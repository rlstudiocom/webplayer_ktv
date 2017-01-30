<template lang="html">
    <div id="channels">
        <ul>
            <li v-for="group in channelList" class="group" v-show="isHidden(group.id)">
                <div class="title">
                    <div :style="{ 'background-color': group.color }">
                        {{group.name}}
                    </div>
                </div>
                <Channel v-for="channel in group.channels" :channel="channel"></Channel>
            </li>
        </ul>
    </div>

</template>

<script>
    import Channel from './Channel.vue'

    export default {
        props: [ 'tab', 'channelList' ],
        components: { Channel },
        data() {
            return{
                hidden: [21, 23]
            }
        },
        methods: {
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
    #channels {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        overflow-y: scroll;
        z-index: 10;
        background: rgba(0,0,0,.75);
    }
    #channels a {
        color: #fff;
    }
    #channels > ul {
        padding: 0;
        margin: 0;
        list-style: none;
    }
    #channels .group > ul {
        padding: 0;
        margin: 0;
        list-style: none;
    }
    #channels .group {
        clear: both;
        overflow: hidden;
    }
    #channels .group > div {
        width: 20%;
        height: 121px;
        float: left;
        overflow: hidden;
    }
    #channels .group > div.title > div {
        line-height: 80px;
        font-size: 21px;
        text-transform: uppercase;
        text-decoration: none;
        color: #fff;
        padding: 20px;
        background: linear-gradient(to top, rgba(0,0,0,.25), rgba(0,0,0,.1));
    }
</style>