<template>
    <div id="app">

        <div id="main" v-if="account.sid">

            <div id="sidenav">

                <ul class="nav" role="tablist">
                    <li role="presentation"><span title="Каналы" @click.prevent="sidemenuToggle"><i
                            class="fa fa-bars"></i></span></li>
                    <li role="presentation" class="active"><span aria-controls="channels" role="tab" data-toggle="tab"
                                                                 title="Каналы"><i class="fa fa-th-list"></i></span>
                    </li>
                    <li role="presentation"><span aria-controls="videoteka" role="tab" data-toggle="tab"
                                                  title="Видеотека" style="display:none"><i
                            class="fa fa-film"></i></span></li>
                    <li role="presentation"><span aria-controls="messages" role="tab" data-toggle="tab"><i
                            class="fa fa-envelope"></i></span></li>
                    <li role="presentation"><span aria-controls="settings" role="tab" data-toggle="tab"><i
                            class="fa fa-cog"></i></span></li>
                    <li role="presentation" class="bottom"><span title="Выход" @click.prevent="getLogout"><i
                            class="fa fa-sign-out"></i></span></li>
                </ul>

                <ul class="panels" v-show="sidemenuShow">
                    <li id="channelsPanel">
                        <ChannelsList></ChannelsList>
                    </li>
                </ul>

            </div>

            <div id="player">
                <!--<video-player :options="videoOptions"></video-player>-->
            </div>

        </div>

        <div id="login" v-else>
            <div>
                <h1>Вы смотрите <img src="src/assets/logo-kartina.png" alt="Kartina.TV"> Kartina.TV</h1>
                <div class="col-1-2">
                    <ul>
                        <li v-for="value in promo" v-bind:style="'background-image: url(src/assets/' + value.i + ')'">
                            <h4>{{value.t}}</h4>
                            <p>{{value.d}}</p>
                        </li>
                    </ul>
                </div>
                <div class="col-1-2">
                    <div class="error" v-show="errorShow" @click="errorToggle">
                        Не удалось пройти авторизацию
                    </div>
                    <form action="" @submit.prevent="getLogon">
                        <label for="">Абонемент</label>
                        <input type="text" v-model.number="account.login">
                        <label for="">Пароль</label>
                        <input type="password" v-model.number="account.pass">
                        <button type="submit">Войти</button>
                    </form>
                    <a href="https://kartina.tv/shop" id="shop"><i class="fa fa-shopping-cart"></i> <span>Нет абонемента?</span></a>
                </div>
                <br class="clear">
                <h2>Круглосуточная техподдержка</h2>
                <h3><a href="tel:49698484540" class="color-black"><i class="fa fa-phone"></i> +49 69 84 84 540</a></h3>
            </div>
        </div>

    </div>
</template>

<script>
    import jsonp from 'jsonp'
    import cookie from 'vue-cookie'
    //import VideoPlayer from 'vue-video-player'
    import ChannelsList from './components/ChannelsList.vue'

    export default {
        name: 'app',
        components: { ChannelsList },
        data () {
            return {
                server: 'https://rustvt.kartina.tv/api/json/',
                account: {
                    login: '',
                    pass: '',
                    sid: false
                },
                sidemenuShow: true,
                errorShow: false,
                promo: [
                    {
                        i: 'icon-world.png',
                        t: 'Просмотр в любой точке мира',
                        d: 'Теперь можно смотреть любимые каналы в любой точке мира без использования громоздкого оборудования'
                    },
                    {
                        i: 'icon-archive.png',
                        t: 'Телевидение в записи',
                        d: 'У нас можно просматривать пропущенные программы в течение двух недель после выхода передачи в эфир'
                    },
                    {
                        i: 'icon-hd.png',
                        t: 'Выбери свое качество',
                        d: 'Благодаря адаптивному вещанию, Вы сможете смотреть HD-каналы даже при низкой скорости Интернета'
                    },
                ],
                videoOptions: {
                    source: {
                        type: "video/webm",
                        src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm',
                        // if you need custom player state changed event name, you can config it like this
                        customEventName: 'my-player-state-changed-event-custom-name'
                    }
                }
            }
        },
        methods: {
            sidemenuToggle: function () {
                this.sidemenuShow = !this.sidemenuShow
            },
            errorToggle: function () {
                this.errorShow = !this.errorShow
            },
            checkAccount: function () {
                if (cookie.get('sid')) {
                    this.account.sid = cookie.get('sid');
                    cookie.set('sid', this.account.sid, 30);  // продлим еще на 30 дней
                }
            },
            getLogon: function () {
                var self = this;
                jsonp(this.server + 'login?login=' + this.account.login + '&pass=' + this.account.pass + '&soft_id=web-ktv-002&cli_serial=webplayer&callback=callback', null, function (err, data) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        if (data.error) {
                            self.errorShow = true;
                            self.account.pass = ''
                        }
                        else {
                            cookie.set('sid', data.sid, 30);
                            self.account.sid = cookie.get('sid')
                        }

                        console.log(data);
                    }
                })
            },
            getLogout: function () {
                var self = this;
                jsonp(this.server + 'logout', null, function (err, data) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        if (data.error) {
                            self.errorShow = true;
                            self.account.pass = ''
                        }
                        else {
                            cookie.delete('sid');
                            self.account.sid = false
                        }
                    }
                })
            },
            hasError: function (code) {
                if (code == 12) {
                    cookie.delete('sid');
                    this.account.sid = false
                }
            }
        },
        mounted: function () {
            this.checkAccount()
        }
    }

</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,700,900&subset=cyrillic');

    html, body {
        width: 100%;
        height: 100%;
        background: #2a2a2a url(assets/43a9a631.png);
        color: #fff;
        margin: 0;
        padding: 0;
        font-family: 'Roboto', sans-serif;
        overflow: hidden;
    }

    .clear {
        clear: both;
    }

    h1, h2, h3, h4, input, button {
        font-family: 'Roboto', sans-serif;
        font-weight: 300;
    }

    #login ul, #login li, #sidenav ul, #sidenav li {
        margin: 0;
        padding: 0;
        list-style: none;
        list-style-position: inside;
    }

    #login > div {
        width: 920px;
        height: 560px;
        position: absolute;
        left: 50%;
        margin-left: -460px;
        top: 50%;
        margin-top: -280px;
        font-weight: 300;
        text-shadow: 1px 1px 6px #222;
    }

    #login h1 {
        text-align: center;
        line-height: 42px;
        margin: -32px 0 48px;
        font-size: 42px;
    }

    #login h1 img {
        margin: 32px 20px -32px;
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

    #login .col-1-2 {
        width: 50%;
        float: left;
    }

    #login li {
        overflow: hidden;
        height: 120px;
        padding: 0 10px 0 120px;
        background: transparent no-repeat 0 50%;
        background-size: 100px;
        border-top: solid 1px #444;
        border-bottom: solid 1px #333;
    }

    #login li:first-child {
        border-top: 0;
    }

    #login li:last-child {
        border-bottom: 0;
    }

    #login h4 {
        /*color: #f98d0b;*/
        margin: 6px 0 0;
        line-height: 36px;
        font-size: 19px;
        text-transform: uppercase;
        font-weight: 300;
    }

    #login p {
        margin: 0;
        line-height: 21px;
        font-size: 14px;
        color: #dedede;
    }

    #login .error {
        padding: 4px 0 6px;
        border-radius: 6px;
        background: #980000;
        margin: 0 40px;
        border: solid 1px rgba(255, 255, 255, .15);
        border-bottom: solid 1px rgba(0, 0, 0, .15);
        text-align: center;
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

    /*#shop span {
      border-bottom: underline;
    }*/
    #shop:hover {
        color: #f98d0b;
    }

    #shop:hover span {
        text-decoration: none;
    }

    #sidenav > ul {
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }

    #sidenav .nav {
        width: 46px;
        background-color: #2a2a2a;
    }

    #sidenav .nav li {
        border-bottom: solid 1px #3f3f3f;
    }

    #sidenav .nav li:last-child {
        position: absolute;
        bottom: 0;
        border-bottom: 0;
        border-top: solid 1px #3f3f3f;
    }

    #sidenav .nav li.active {
        background-color: #3f3f3f;
    }

    #sidenav .nav span {
        display: inline-block;
        padding: 12px 15px;
        line-height: 14px;
        margin: 0;
        width: 12px;
        height: 18px;
        text-align: center;
        cursor: pointer;
    }

    #sidenav .panels {
        height: 100%;
        margin-left: 45px;
        background: rgba(0, 0, 0, 0.2);
        width: 20%;
    }

    #sidenav .panels > li {
        height: 100%;
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
</style>