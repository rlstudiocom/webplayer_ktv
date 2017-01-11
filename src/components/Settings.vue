<template lang="html">
    <div id="settings">
        <ul>
            <li>
                <span>Абонемент</span>
                {{ account.account.login }}
            </li>
            <li>
                <span>Пакет</span>
                {{ account.account.packet_name }}
            </li>
            <li>
                <span>Дата окончания</span>
                {{ account.account.packet_expire | datetime }}
            </li>
        </ul>
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
</template>
<script>
    import jsonp from 'jsonp'

    export default{
        props: ['account'],
        methods: {
            sendSettings: function (k) {
                var self = this
                jsonp(this.$parent.server + 'settings_set?var=' + k + '&val=' + self.account.settings[k].value, null, function (err, data) {
                    if (err)
                        console.error(err.message);
                    else {
                        if(data.error)
                            self.$parent.hasError(data.error.code)
                        else
                            self.$parent.showToast('Настройки обновлены (' + k + '=' + self.account.settings[k].value + ')', 'info')
                    }
                })
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
    #settings > ul > li, #settings > div {
        position: relative;
        background: transparent no-repeat 2px 50%;
        padding: 6px 6px 5px;
        border-bottom: solid 1px rgba(255,255,255,.1);
        transition: height 2s ease;
    }
    #settings > div:last-child {
        border: 0;
    }
    #settings > ul > li:hover, #settings > div:hover  {
        background-color: rgba(0,0,0,.2);
        /*height: auto;*/
    }
    #settings > ul > li span, #settings > div span {
        font-size: 10px;
        line-height: 10px;
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
    }
    #settings > div select option {
        background: #2a2a2a;
        border: 0;
    }
</style>
