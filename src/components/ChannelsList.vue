<template lang="html">
    <div id="channels">
        <ul>
            <ChannelsGroup v-for="(group, key) in groups" :group="group" :serverOffset="serverOffset"></ChannelsGroup>
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
                serverTime: 0,
                serverOffset: 0, // разница с сервером в секундах
                lastUpdated: 0 // время последнего запроса списка каналов
            }
        },
        components: { ChannelsGroup },
        methods: {
            getNow: function () {
                return Math.trunc((new Date()).getTime() / 1000)
            },
            getChannelsList: function () {
                var self = this

                if(!self.lastUpdated || (self.getNow() - self.lastUpdated) >= 60) { // время получение ответа, чтобы не повторять запрос
                    self.lastUpdated = self.getNow()
                    jsonp(this.$parent.server + 'channel_list?sid=' + this.$parent.account.sid + '&icon=3', null, function (err, data) {
                        if (err) {
                            console.error(err.message);
                        }
                        else {
                            if(data.error) {
                                self.$parent.hasError(data.error.code)
                            }
                            else {
                                self.groups = data.groups;
                                self.serverTime = data.servertime;
                                self.serverOffset = Math.floor(Date.now() - self.serverTime * 1000) // Todo: вычислять корректно сдвиг относительно сервера в часах
                                //console.log(self.serverOffset)
                            }
                        }
                    })
                }
            }
        },
        created: function () {
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