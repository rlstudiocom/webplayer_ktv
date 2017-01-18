<template lang="html">
    <li class="group" v-show="isHidden()">
        <div :style="{ 'background-color': group.color }">{{group.name}}</div>
        <Channel v-for="channel in group.channels" :channel="channel"></Channel>
    </li>
</template>
<script>
    import Channel from './Channel.vue'
    export default{
        components: { Channel },
        data(){
            return{
                hidden: [21, 23]
            }
        },
        methods: {
            isHidden: function () {
                return this.hidden.indexOf(this.group.id) < 0 ? 1 : 0
            }
        }
    }
</script>
<style lang="css">
</style>
