<template lang="html">
    <div id="channels">
        <ul>
            <ChannelsGroup v-for="(group, key) in groups" :group="group" :serveroffset="serveroffset"></ChannelsGroup>
        </ul>
    </div>

</template>

<script>
    import jsonp from 'jsonp'
    import ChannelsGroup from './ChannelsGroup.vue'

    export default {
        data () {
            return {
                groups: [],
                openId: 1,
                servertime: 0,
                serveroffset: 0 // разница с сервером в секундах
            }
        },
        components: { ChannelsGroup },
        methods: {
            getChannelsList: function () {
                var self = this;
                jsonp(this.$parent.server + 'channel_list?sid=' + this.$parent.account.sid + '&icon=3', null, function (err, data) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        if(data.error) {
                            self.$parent.hasError(data.error.code)
                        }
                        else {
                            self.groups = data.groups;
                            self.servertime = data.servertime;
                            self.serveroffset = Math.floor(Date.now() - self.servertime * 1000); //
                            //console.log(self.serveroffset)
                        }
                    }
                });

                self.height = self.$el.offsetHeight; //  не знал куда пристроить
                console.log(self.height);
            }
        },
        mounted: function () {
            this.getChannelsList()
        }
    }
</script>

<style lang="css">
    #channels {
        height: 100%;
        overflow-y: scroll;
    }
    #channels a {
        color: #fff;
    }
</style>