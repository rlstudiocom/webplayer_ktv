<template lang="html">
    <li :style="{ 'background-image': 'url(' + channel.big_icon_link + ')' }" @click="showVideo(channel.id)">
        <div class="name">{{ channel.name }}</div>
        <div class="programm" v-bind:title="channel.epg_progname">{{ channel.epg_progname }}</div>
        <div class="time" v-show="channel.epg_start">
            <div class="start">{{ channel.epg_start | time }}</div>
            <div class="progress">
                <div></div>
            </div>
            <div class="end">{{ channel.epg_end | time }}</div>
        </div>
    </li>
</template>
<script>
    export default{
        props: ['channel', 'serveroffset'],
        data(){
            return{

            }
        },
        methods: {
            formatDuration: function(s, e, o) {
                return 'width: ' + Math.floor((Date.now() - o * 1000) - s / (e - s)) + '%'
            },
            formatTime: function(v, o) {
                var time = new Date(v * 1000 - o * 1000)
                return time.getHours() + ':' + ((time.getMinutes()<10) ? '0'+time.getMinutes() : time.getMinutes())
            },
            showVideo: function(i) {
                console.log(i)
            }
        },
        filters: {
            time: function(v) {
//                var time = new Date(v * 1000 - this.serveroffset * 1000)
                var time = new Date(v * 1000)
                return time.getHours() + ':' + ((time.getMinutes()<10) ? '0'+time.getMinutes() : time.getMinutes())
            }
        }
    }
</script>
<style lang="css">
    #channels .group > ul > li {
        background: transparent no-repeat 2px 50%;
        background-size: 48px;
        padding: 2px 2px 2px 54px;
        border-bottom: solid 1px rgba(255,255,255,.1);
        height: 60px;
        /*transition: height 2s ease;*/
    }
    #channels .group > ul > li:hover{
        background-color: rgba(0,0,0,.2);
        /*height: auto;*/
    }
    #channels .group > ul > li .name {
        font-size: 14px;
        font-weight: bold;
    }
    #channels .group > ul > li .programm {
        color: #dedede;
        font-size: 12px;
        line-height: 13px;
        min-height: 26px;
        height: 26px;
        overflow: hidden;
        /*transition: height 2s ease;*/
    }
    #channels .group > ul > li .programm:hover {
        /*height: auto;*/
    }
    #channels .group > ul > li .time {
        font-size: 10px;
        line-height: 10px;
        height: 17px;
        overflow: hidden;
        position: relative;
    }
    #channels .group > ul > li .time .start, #channels .group > ul > li .time .end {
        width: 40px;
        float: left;
        position: absolute;
        top: 4px;
        left: 2px;
        color: #eeac32;
    }
    #channels .group > ul > li .time .end {
        left: auto;
        right: 2px;
        text-align: right;
    }
    #channels .group > ul > li .time .progress {
        margin: 5px 40px 0;
        background: #666;
        height: 6px;
        border-radius: 2px;
    }
    #channels .group > ul > li .time .progress > div {
        background: #eeac32;
        width: 50%;
        height: 6px;
        border-radius: 2px;
    }
</style>
