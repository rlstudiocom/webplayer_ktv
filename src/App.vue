<template>
    <div>

        <div id="main" v-if="account.account.login">

            <ChannelList :channelList="channelList" :tab="tab" v-show="tab.current == 'channels'"></ChannelList>

            <MessagesList :tab="tab" v-show="tab.current == 'messages'"></MessagesList>

            <Settings :account="account" :tab="tab" ref="settings" v-show="tab.current == 'settings'"></Settings>

            <div id="player">
                <VideoPlayer :videoOptions="videoOptions" ref="player"></VideoPlayer>
                <VideoControl :channel="channel" :tab="tab" :newMessages="newMessages"></VideoControl>
            </div>

        </div>

        <div id="login" v-else>
            <div>
                <h1><img src="dist/logo-kartina.png" alt="Kartina.TV"> Kartina.TV</h1>
                <div>
                    <form action="" @submit.prevent="getLogin">
                        <label for="">Абонемент</label>
                        <input type="text" v-model.number="login.abo">
                        <label for="">Пароль</label>
                        <input type="password" v-model.number="login.pass">
                        <button type="submit">Войти</button>
                    </form>
                    <a href="https://kartina.tv/shop" id="shop"><i class="fa fa-shopping-cart"></i> Нет абонемента?</a>
                </div>
                <br class="clear">
                <h2>Круглосуточная техподдержка</h2>
                <h3><a href="tel:49698484540" class="color-black"><i class="fa fa-phone"></i> +49 69 84 84 540</a></h3>
            </div>
        </div>

        <vueToast ref="toast"></vueToast>

    </div>
</template>

<script>
    import jsonp from 'jsonp'
    import 'vue-toast/dist/vue-toast.min.css'
    import vueToast from 'vue-toast'

    import ChannelList from './components/ChannelList.vue'
    import VideoControl from './components/VideoControl.vue'
    import MessagesList from './components/MessagesList.vue'
    import Settings from './components/Settings.vue'
    import VideoPlayer from './components/VideoPlayer.vue'

    export default {
        name: 'app',
        components: { ChannelList, MessagesList, Settings, VideoPlayer, VideoControl, vueToast },
        data () {
            return {
                server: 'https://iptv.kartina.tv/api/json/',
                error: false,
                info: false,
                player: false,
                lastUpdated: 0, // время последнего запроса списка каналов
                channelList: [],
                channel: {
                    id: 2,
                    name: 'Первый',
                    big_icon_link: 'http://anysta.kartina.tv/assets/img/logo/comigo/1/2.7.png'
                },
                login: {
                    abo: '',
                    pass: ''
                },
                account: {
                    account: {
                        login: false,
                        packet_name: false,
                        packet_expire: false
                    },
                    settings: {
                        stream_server: { value: '', list: [] },
                        timeshift: { value: '', list: [] },
                        http_caching: { value: '', list: [] },
                        stream_standard: { value: 'hls_h264' }
                    }
                },
                stream_url: false,
                serverOffset: 0,
                tab: {
                    current: false,
                    last: false
                },
                newMessages: 0,
                videoOptions: {
                    source: {
                        type: 'application/x-mpegURL',
                        src: 'https://logos-channel.scaleengine.net/logos-channel/live/biblescreen-ad-free/playlist.m3u8',
                        label: 'Первый',
                        withCredentials: false
                    },
                    poster: 'http://anysta.kartina.tv/assets/img/logo/comigo/1/2.7.png',
                    live: true,
                    autoplay: true,
                    height: 500,
                    language: 'ru',
                    controlBar: false
                }
            }
        },
        watch: {
            error: function () {
                var message = false
                switch(this.error.code) {
                    case 1: // Incorrect Request
                        message = 'Неверные параметры запроса'
                        break
                    case 2: // Wrong login or password
                        message = 'Неверный логин или пароль'
                        break
                    case 3: // Access Denied
                        this.account.login = ''
                        message = 'Доступ запрещен. Повторите авторизацию через 10 минут'
                        break
                    case 4: // Login incorrect
                        this.account.login = ''
                        message = 'Ошибка авторизации'
                        break
                    case 5: // You contract is inactive
                        this.account.login = ''
                        message = 'Ваш абонемент недействителен. Закончился контракт'
                        break
                    case 6: // You contract is paused
                        this.account.login = ''
                        message = 'Ваш абонемент неактивен. Находится в режиме ожидания'
                        break
                    case 7: // Channel not found or not allowed
                        message = 'Ошибка запроса. Данный контент недоступен'
                        break
                    case 8: // Error generate URL. Bad parameters
                        message = 'Ошибка получения видеопотока. Повторите запрос'
                        break
                    case 9: // Need DAY parameter <DDMMYY>
                        message = 'Необходимо выбрать дату'
                        break
                    case 10: // Need parameter <cid>
                        message = 'Необходимо выбрать канал'
                        break
                    case 11: // Another client with you login was logged)
                        this.account.login = ''
                        message = 'Другой клиент вошел под Вашим абонементом. Повторите авторизацию'
                        break
                    case 12: // Authentification error
                        this.account.login = ''
                        message = 'Необходимо авторизоваться'
                        break
                    case 13: // You Subscription has expired
                        message = 'Ваш абонемент неактивен. Закончился контракт'
                        break
                    case 14: // Unknown API function
                        message = 'Ошибка запроса. Неверный вызов команды'
                        break
                    case 15: // Archive is not available
                        message = 'Архив недоступен'
                        break
                    case 16: // Need place to set
                        message = ''
                        break
                    case 17: // Need name of settings variable
                        message = ''
                        break
                    case 18: // Incorrect confirmation code
                        message = ''
                        break
                    case 19: // Current code wrong
                        message = ''
                        break
                    case 20: // New code wrong
                        message = ''
                        break
                    case 21: // Need value (val) parameter
                        message = ''
                        break
                    case 22: // This value is not allowed
                        message = ''
                        break
                    case 23: // Need parameter
                    case 24: // Need parameter <id>
                    case 25: // Need parameter <fileid>
                    case 26: // Need parameter <type>
                    case 27: // Need parameter <query>
                        message = 'Ошибка параметров. Повторите запрос'
                        break
                    case 30: // Service is not available
                        this.account.login = ''
                        message = 'Сервис временно недоступен'
                        break
                    case 31: // Query limit exceeded
                        message = ''
                        break
                    case 32: // Rule already exist
                        message = 'Правило существует'
                        break
                    case 33: // Need param ?cmd = hide_channel | show_channel | get_list
                        message = ''
                        break
                    case 34: // Need param ?cmd = get_user_rates | set_user_rates
                        message = ''
                        break
                    case 35: // Bad rate value. Allow <show|hide|pass>
                        message = ''
                        break
                    case 36: // Cannt find film
                        message = 'Невозможно найти фильм'
                        break
                    case 37: // This film already added to favorite list
                        message = 'Фильм уже добавлен в избранное'
                        break
                    case 99: // System error
                        this.account.login = ''
                        message = 'Системная ошибка. Обратитесь в техподдержку'
                        break
                    default:
                        message = this.error.message
                }

                this.showToast(message, 'error')

            },
            info: function () {
                this.showToast(this.info, 'info')
            },
            channel: function () {
                this.apiGetUrl(this.channel.id)
            },
            stream_url: function () {
                this.videoOptions.poster = this.channel.big_icon_link
                this.videoOptions.source.src = this.stream_url
                this.videoOptions.autoplay = true
            },
            account: function() {
                if(this.account.account.login) {
                    this.apiGetChannelList()
                    this.apiGetUrl(this.channel.id)
                }
            }
        },
        created: function () {
            this.checkAccount()

            window.addEventListener('resize', this.handleResize)
            this.videoOptions.height = window.innerHeight
        },
        mounted: function () {
            this.$refs.toast.setOptions({
                maxToasts: 6,
                position: 'right bottom'
            })
        },
        methods: {
            apiGetLogon: function () {
                var self = this
                jsonp(self.server + 'login?login=' + self.login.abo + '&pass=' + self.login.pass + '&soft_id=web-ktv-002&cli_serial=webplayer', null, function (err, data) {
                    if (err) {
                        console.error(err.message)
                    } else {
                        if (data.error) {
                            self.error = data.error
                        }
                        else {
                            self.apiGetAccount()
                        }

                        self.login.pass = ''
                    }
                })
            },
            apiGetLogout: function () {
                var self = this
                jsonp(self.server + 'logout', null, function (err, data) {
                    if (err) {
                        console.error(err.message)
                    } else {
                        if (data.error) {
                            self.error = data.error
                        }
                        else {
                            self.login.abo = ''
                            self.info = 'Вы вышли из аккаунта'
                        }
                    }
                })
            },
            apiGetChannelList: function () {
                var self = this
                if(!self.lastUpdated || (self.getNow() - self.lastUpdated) >= 60) { // время получение ответа, чтобы не повторять запрос
                    self.lastUpdated = self.getNow()
                    jsonp(self.server + 'channel_list?icon=3', null, function (err, data) {
                        if (err) {
                            console.error(err.message)
                        } else {
                            if (data.error) {
                                self.error = data.error
                            } else {
                                self.channelList = data.groups
//                                self.serverTime = data.servertime
                                self.newMessages = data.messages
//                                self.$parent.serverOffset = Math.floor(Date.now() - self.serverTime * 1000) // Todo: вычислять корректно сдвиг относительно сервера в часах
                                //console.log(self.serverOffset)
                            }
                        }
                    })
                }
            },
            apiGetUrl: function (cid) {
                var self = this
                jsonp(self.server + 'get_url?cid=' + cid, null, function (err, data) {
                    if (err) {
                        console.error(err.message)
                    } else {
                        if (data.error) {
                            self.error = data.error
                        }
                        else {
                            self.stream_url = data.url
                        }
                    }
                })
            },
            apiGetAccount: function () {
                var self = this
                self.sidemenuTab = self.lastTab = 'channels'
                jsonp(self.server + 'account?settings=1', null, function (err, data) {
                    if (err) {
                        console.error(err.message)
                    } else {
                        if (data.error) {
                            self.error = data.error
                        }
                        else {
                            self.info = 'Сессия обновлена'
                            self.account = data
                            if(self.account.settings.stream_standard.value != 'hls_h264') { // Todo: пока принимаем только стандарт HLS
                                self.account.settings.stream_standard.value = 'hls_h264'
                                self.apiSendSettings('stream_standard')
                            }
                        }
                    }
                })
            },
            apiSendSettings: function (k) {
                var self = this
                jsonp(self.server + 'settings_set?var=' + k + '&val=' + self.account.settings[k].value, null, function (err, data) {
                    if (err)
                        console.error(err.message);
                    else {
                        if (data.error) {
                            self.error = data.error
                        }
                        else {
                            self.info = 'Настройки обновлены (' + k + '=' + self.account.settings[k].value + ')'
                        }
                    }
                })
            },
            handleResize: function () {
                this.videoOptions.height = window.innerHeight
            },
            getLogin: function () {
                this.apiGetLogon()

                if(this.account.account.login) {
                    this.apiGetChannelList()
                    this.apiGetUrl(2)
                }
            },
            checkAccount: function () {
                this.apiGetAccount()
            },
            getLogout: function () {
                this.account.account.login = false
                this.apiGetLogout()
            },
            showTab: function (k) {
                if (!k) {
                    this.tab.current = !this.tab.current ? this.tab.last : false
                }
                else {
                    this.tab.current = this.tab.last = k
                }
            },
            hideTab: function (k) {
                this.tab.current = false
            },
            showToast: function (message, theme) {
                this.$refs.toast.showToast(message, {
                    theme: theme,
                    timeLife: 3000,
                    closeBtn: false
                })
            },
            getNow: function () {
                return Math.trunc((new Date()).getTime() / 1000)
            }
        }
    }

</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,700,900&subset=cyrillic');

    html, body, #main, #player {
        width: 100%;
        height: 100%;
        background: #2a2a2a url(assets/43a9a631.png);
        color: #fff;
        margin: 0;
        padding: 0;
        font-family: 'Roboto', sans-serif;
        overflow: hidden;
        position: relative;
    }

    .clear {
        clear: both;
    }

    h1, h2, h3, h4, input, button {
        font-family: 'Roboto', sans-serif;
        font-weight: 300;
    }




    #login ul, #login li {
        margin: 0;
        padding: 0;
        list-style: none;
        list-style-position: inside;
    }

    #login > div {
        width: 480px;
        height: 560px;
        position: absolute;
        left: 50%;
        margin-left: -240px;
        top: 50%;
        margin-top: -280px;
        font-weight: 300;
        text-shadow: 1px 1px 6px #222;
    }

    #login h1 {
        text-align: center;
        line-height: 56px;
        margin: -32px 0 48px;
        font-size: 56px;
    }

    #login h1 img {
        margin: 32px 10px -32px;
    }

    #login h2 {
        text-align: center;
        font-size: 24px;
        text-transform: uppercase;
        line-height: 28px;
        margin: 12px 0 0;
    }

    #login h3 {
        text-align: center;
        line-height: 42px;
        font-size: 42px;
        margin: 0;
    }

    #login a {
        color: #fff;
        text-decoration: none;
    }

    #login a:hover {
        color: #f98d0b;
    }

    #login form {
        padding: 0 40px;
    }

    #login label {
        margin: 4px 0 0;
        line-height: 36px;
        font-size: 19px;
        text-align: center;
        text-transform: uppercase;
        display: block;
        width: 100%;
    }

    #login input {
        background: rgba(0, 0, 0, .25);
        border: solid 1px rgba(0, 0, 0, .25);
        border-bottom: solid 1px rgba(255, 255, 255, .15);
        display: block;
        padding: 8px 0;
        width: 100%;
        font-size: 24px;
        color: #efefef;
        text-align: center;
        overflow: hidden;
        border-radius: 8px;
        margin-bottom: 12px;
    }

    #login button {
        background: #f76d1a;
        border: solid 1px rgba(255, 255, 255, .25);
        border-bottom: solid 1px rgba(0, 0, 0, .25);
        text-transform: uppercase;
        padding: 8px 0;
        width: 180px;
        font-size: 19px;
        text-align: center;
        overflow: hidden;
        border-radius: 8px;
        margin: 20px auto 32px;
        display: block;
        color: #fff;
        text-shadow: 1px 1px 4px rgba(0, 0, 0, .25);
    }

    #shop {
        display: block;
        font-size: 19px;
        color: #fff;
        text-decoration: none;
        text-align: center;
    }

    #shop:hover {
        color: #f98d0b;
    }

    #sidenav {
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 999;
        background: rgba(0, 0, 0, 0.2);
    }

    #sidenav > ul > li:last-child {
        position: absolute;
        bottom: 0;
    }

    #sidenav > ul > li.active {
        background-color: #3f3f3f;
    }

    #sidenav > ul > li > span {
        display: inline-block;
        padding: 12px 15px;
        line-height: 14px;
        margin: 0;
        width: 15px;
        height: 18px;
        text-align: center;
        cursor: pointer;
        position: relative;
        border-bottom: solid 1px #3f3f3f;
    }

    #sidenav > ul > li:last-child span {
        border-bottom: 0;
        border-top: solid 1px #3f3f3f;
    }

    #sidenav > ul > li > span > span {
        position: absolute;
        display: inline-block;
        top: 6px;
        right: 2px;
        background: #eeac32;
        /*background: linear-gradient(to top, rgba(238, 172, 50, .5), rgba(238, 172, 50, 1));*/
        border-radius: 7px;
        font-size: 8px;
        line-height: 10px;
        width: 10px;
        text-align: center;
        padding: 2px;
        color: #000;
        font-weight: bold;
    }

    #sidenav > ul > li > div {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        margin-left: 45px;
        background: rgba(0, 0, 0, 0.2);
        width: 320px;
    }

    #sidenav .panels > li {
        height: 100%;
    }

    #sidenav > ul > li > span#epgBtn {
        display: none;
    }

    .vue-toast-manager_container {
        z-index: 1000
    }

    .vue-toast_message {
        padding: 10px 12px!important;
    }

    /* Let's get this party started */
    ::-webkit-scrollbar {
        width: 6px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);*/
        -webkit-border-radius: 2px;
        border-radius: 2px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        -webkit-border-radius: 2px;
        border-radius: 2px;
        background: #555;
        /*background: rgba(255,0,0,0.8);*/
        /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);*/
    }

    ::-webkit-scrollbar-thumb:window-inactive {
        background: #2a2a2a;
        /*background: rgba(255,0,0,0.4);*/
    }

    *:focus {
        outline: #999;
    }
</style>