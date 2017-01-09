<template lang="html">
    <li class="group" v-show="isHidden(group.id)">
        <span :style="{ 'background-color': group.color }">{{group.name}}</span>
        <ul>
            <Channel v-for="channel in group.channels" :channel="channel" :serveroffset="serveroffset"></Channel>
        </ul>
    </li>
</template>
<script>
    import Channel from './Channel.vue'

    export default{
        props: ['group', 'serveroffset', 'height'],
        components: { Channel },
        data(){
            return{
                hidden: [21, 23]
            }
        },
        methods: {
            isHidden: function (v) {
                return this.hidden.indexOf(v) < 0 ? 1 : 0
            }
        }
    }
</script>
<style lang="css">
    #channels .group > ul {

    }
    #channels .group > span {
        line-height: 14px;
        font-size: 14px;
        padding: 13px 15px;
        text-transform: uppercase;
        display: block;
        text-decoration: none;
        color: #000;
    }
</style>
