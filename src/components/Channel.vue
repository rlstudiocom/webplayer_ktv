<template lang="html">
    <li :style="{ 'background-image': 'url(' + channel.big_icon_link + ')' }" @click="showVideo()">
        <div class="archive" v-show="channel.have_archive" title="Есть архив"><i class="fa fa-circle"></i></div>
        <div class="name">{{ channel.name }}</div>
        <div class="programm" v-bind:title="channel.epg_progname">{{ channel.epg_progname }}</div>
        <div class="time" v-show="channel.epg_start">
            <div class="start">{{ channel.epg_start | time }}</div>
            <div class="progress">
                <div :style="{ 'width' : progress + '%' }"></div>
            </div>
            <div class="end">{{ channel.epg_end | time }}</div>
        </div>
    </li>
</template>
<script>
    export default{
        props: ['channel', 'serverOffset'],
        data(){
            return{
                progress: 0
            }
        },
        methods: {
            /*formatTime: function(v, o) {
                var time = new Date(v * 1000 - o * 1000)
                return time.getHours() + ':' + ((time.getMinutes()<10) ? '0'+time.getMinutes() : time.getMinutes())
            },*/
            showVideo: function() {
                this.$parent.$parent.$parent.getURL(this.channel.id)
            },
            calcProgress: function() {
                var now = Math.trunc((new Date()).getTime() / 1000)
                this.progress = Math.trunc((now - this.channel.epg_start) / (this.channel.epg_end - this.channel.epg_start) * 100)
                if(this.progress >= 100)
                    this.$parent.$parent.getChannelsList()
            }
        },
        filters: {
            time: function(v) {
//                var time = new Date(v * 1000 - this.serveroffset * 1000)
                var time = new Date(v * 1000) // Todo: добавить сдвиг относительно сервера
                return time.getHours() + ':' + ((time.getMinutes()<10) ? '0'+time.getMinutes() : time.getMinutes())
            }
        },
        created() {
            this.calcProgress()
            window.setInterval(() => {
                this.calcProgress()
                    //this.$parent.$parent.getChannelsList()
            }, 5000);
        }
    }
</script>
<style lang="css">
    #channels .group > ul > li {
        position: relative;
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
    #channels .group > ul > li .archive {
        position: absolute;
        top: 2px;
        left: 4px;
        font-size: 12px;
        color: #00b200;
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
        background: #555;
        height: 6px;
        border-radius: 2px;
        overflow: hidden;
    }
    #channels .group > ul > li .time .progress > div {
        width: 50%;
        height: 6px;
        border-radius: 2px;
        background: #eeac32;
        background: linear-gradient(to top, rgba(238, 172, 50, .5), rgba(238, 172, 50, 1));
    }
</style>
