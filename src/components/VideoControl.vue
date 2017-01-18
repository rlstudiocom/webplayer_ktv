<template lang="html">
    <div id="videoControl" v-show="!tab.current">
        <div class="nav">
            <a title="Каналы" class="active" @click.prevent="showTab('channels')"><i class="fa fa-th-list"></i></a>
            <a title="Программа передач" @click.prevent="showTab('epg')"><i class="fa fa-calendar"></i></a>
            <a title="Видеотека" @click.prevent="showTab('vod')"><i class="fa fa-film"></i></a>
        </div>
        <Channel :channel="channel"></Channel>
        <div class="nav right">
            <a title="Сообщения" @click.prevent="showTab('messages')"><i class="fa fa-envelope"></i> <span v-show="newMessages">{{ newMessages }}</span></a>
            <a title="Настройки" @click.prevent="showTab('settings')"><i class="fa fa-cog"></i></a>
            <a title="Выход" @click.prevent="logout"><i class="fa fa-sign-out"></i></a>
        </div>
    </div>
</template>
<script>
    import Channel from './Channel.vue'
    export default{
        props: ['channel', 'tab', 'newMessages'],
        components: { Channel },
        methods: {
            logout: function () {
                this.$parent.logout()
            },
            showTab: function (k) {
                this.$parent.showTab(k)
            }
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
