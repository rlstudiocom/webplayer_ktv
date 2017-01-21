<template lang="html">
    <div id="videoControl" v-show="!tab.current">
        <div class="nav">
            <a title="Каналы" class="active" @click.prevent="showTab('channels')"><i class="fa fa-th-list"></i></a>
            <!--a title="Программа передач" @click.prevent="showTab('epg')"><i class="fa fa-calendar"></i></a-->
            <!--a title="Видеотека" @click.prevent="showTab('vod')"><i class="fa fa-film"></i></a-->
        </div>
        <div class="channel">
            <div :style="{ 'background-image': 'url(' + channel.big_icon_link + ')' }">
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
            </div>
        </div>
        <div class="nav right">
            <!--a title="Сообщения" @click.prevent="showTab('messages')"><i class="fa fa-envelope"></i> <span v-show="newMessages">{{ newMessages }}</span></a-->
            <a title="Настройки" @click.prevent="showTab('settings')"><i class="fa fa-cog"></i></a>
            <a title="Выход" @click.prevent="getLogout"><i class="fa fa-sign-out"></i></a>
        </div>
    </div>
</template>
<script>
    export default{
        props: ['channel', 'tab', 'newMessages'],
        data(){
            return{
                progress: 0
            }
        },
        methods: {
            getLogout: function () {
                this.$parent.getLogout()
            },
            showTab: function (k) {
                this.$parent.showTab(k)
            },
            calcProgress: function() {
                var now = Math.trunc((new Date()).getTime() / 1000)
                this.progress = Math.trunc((now - this.channel.epg_start) / (this.channel.epg_end - this.channel.epg_start) * 100)
                if(this.progress >= 100)
                    this.$parent.apiGetChannelList()
            }
        },
        filters: {
            time: function(v) {
                var time = new Date(v * 1000)
                return time.getHours() + ':' + ((time.getMinutes()<10) ? '0'+time.getMinutes() : time.getMinutes())
            }
        },
        created() {
            this.calcProgress()
            window.setInterval(() => {
                this.calcProgress()
        }, 5000)
        }
    }
</script>
<style lang="css">
    #videoControl {
        position: absolute;
        z-index: 999;
        bottom: 0;
        left: 50%;
        width: 624px;
        height: 100px;
        background: rgba(0,0,0,.75);
        padding: 10px;
        margin-left: -320px;
    }
    #videoControl .nav {
        width: 35px;
        float: left;
        border-right: solid 1px rgba(255,255,255,.2);
    }
    #videoControl .nav.right {
        float: right;

        border-right: 0;
        border-left: solid 1px rgba(255,255,255,.2);
    }
    #videoControl .nav a {
        display: inline-block;
        padding: 8px 10px 12px;
        line-height: 13px;
        margin: 0;
        width: 15px;
        height: 13px;
        text-align: center;
        cursor: pointer;
        position: relative;
        border-bottom: solid 1px rgba(255,255,255,.2);
    }
    #videoControl .nav a:last-child {
        border: none;
    }
    #videoControl .channel {
        width: 552px;
        float: left;
        border: none;
    }
</style>
