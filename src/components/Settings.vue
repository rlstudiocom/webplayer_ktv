<template lang="html">
    <div id="settings">
        <div>
            <div>
                <span>Абонемент</span>
                {{ account.account.login }}
            </div>
            <div>
                <span>Пакет</span>
                {{ account.account.packet_name }}
            </div>
            <div>
                <span>Дата окончания</span>
                {{ account.account.packet_expire | datetime }}
            </div>
            <div>
                <span>Сервер вещания</span>
                <select v-model="account.settings.stream_server.value" @change="sendSettings('stream_server')">
                    <option v-for="server in account.settings.stream_server.list" v-bind:value="server.ip">{{ server.descr }}</option>
                </select>
            </div>
            <div>
                <span>Таймшифт</span>
                <select v-model="account.settings.timeshift.value" @change="sendSettings('timeshift')">
                    <option v-for="value in account.settings.timeshift.list" v-bind:value="value">{{ value }}</option>
                </select>
            </div>
            <div>
                <span>Кеширование</span>
                <select v-model="account.settings.http_caching.value" @change="sendSettings('http_caching')">
                    <option v-for="value in account.settings.http_caching.list" v-bind:value="value">{{ value }}</option>
                </select>
            </div>
        </div>
        <a href="#" class="close" @click.prevent="hideTab"><i class="fa fa-times"></i></a>
    </div>
</template>
<script>
    import jsonp from 'jsonp'

    export default{
        props: [ 'tab', 'account'],
        methods: {
            sendSettings: function (k) {
                this.$parent.apiSendSettings(k)
            },
            hideTab: function () {
                this.tab.current = false
            }
        },
        filters: {
            datetime: function(v) {
                var time = new Date(v * 1000), // Todo: добавить сдвиг относительно сервера
                        month = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
                return time.getDate() + ' ' + month[time.getMonth()] + ' ' + time.getFullYear()
            }
        }
    }
</script>
<style lang="css">
    #settings {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        overflow-y: scroll;
        z-index: 10;
        background: rgba(0,0,0,.75);
    }
    #settings > div {
        width: 20%;
        margin: 120px auto 0;
    }
    #settings > div > div {
        position: relative;
        background: transparent no-repeat 2px 50%;
        padding: 10px;
        border-bottom: solid 1px rgba(255,255,255,.1);
        font-size: 17px;
    }
    #settings > div > div:last-child {
        border: 0;
    }
    #settings > div > div:hover  {
        background-color: rgba(0,0,0,.6);
    }
    #settings > ul > li span, #settings > div span {
        font-size: 14px;
        line-height: 16px;
        text-transform: uppercase;
        display: block;
        color: #efefef;
    }
    #settings > div select {
        text-transform: uppercase;
        display: block;
        width: 100%;
        padding: 6px;
        background: rgba(0, 0, 0, .25);
        border: solid 1px rgba(0, 0, 0, .25);
        border-bottom: solid 1px rgba(255, 255, 255, .15);
        display: block;
        border-radius: 6px;
        margin: 4px 0;
        color: #fff;
        font-size: 21px;
    }
    #settings select option {
        background: #2a2a2a;
        border: 0;
    }
    #settings .close {
        position: fixed;
        display: block;
        top: 10px;
        right: 10px;
        width: 33px;
        height: 33px;
        padding: 10px;
        font-size: 33px;
        line-height: 33px;
        text-align: center;
        z-index: 999;
        color: #fff;
    }
</style>
