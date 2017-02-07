<template lang="html">
    <div id="channellist" class="screen">
        <div id="groups">
            <ul>
                <li v-for="group in groups" class="group" v-show="isHidden(group.id)" :style="{ 'background-color': group.color }" @click="toGroup(group.id)">
                    <div>
                        {{group.name}}
                    </div>
                </li>
            </ul>
        </div>
        <div id="channels">
            <ul id="channels_ul">
                <Channel v-for="channel in channels" :channel="channel"></Channel>
            </ul>
        </div>
    </div>

</template>

<script>
    import Channel from './Channel.vue'

    export default {
        props: [ 'tab', 'groups', 'channels' ],
        components: { Channel },
        data() {
            return{
                hidden: [21, 23]
            }
        },
        methods: {
            toGroup: function (id) {
                var objDiv  = document.getElementById('channels_ul')
                console.log(objDiv.scrollHeight)
                //var container = this.$el.querySelector('#channels_ul')
                //container.scrollTop = container.scrollHeight
                //container.scrollTop = id * 100 + 'px'
                objDiv.scrollTop = objDiv.scrollHeight
            },
            isHidden: function (id) {
                return this.hidden.indexOf(id) < 0 ? 1 : 0
            },
            hideTab: function () {
                this.tab.current = false
            }
        }
    }
</script>

<style lang="css">
    #channellist {
        z-index: 10;
        background: rgba(0,0,0,.75);
    }
    #groups, #channels {
        position: absolute;
        height: 100%;
        top: 0;
        left: 0;
        overflow-y: scroll;
        width: 240px;
    }
    #groups ul, #groups li {
        list-style: none;
        margin: 0;
        padding: 0;
        cursor: pointer;
    }
    #groups li div {
        /*height: 80px;*/
        text-transform: uppercase;
        padding: 24px 10px;
        background: linear-gradient(to top, rgba(0,0,0,.25), rgba(0,0,0,.1));
    }
    #groups li:hover div {
        background: linear-gradient(to top, rgba(0,0,0,.5), rgba(0,0,0,.2));
    }

    #channels {
        left: 240px;
        width: 400px;
    }

    #channels a {
        color: #fff;
    }
    #channels > ul {
        padding: 0;
        margin: 0;
        list-style: none;
    }
</style>