<template lang="html">

</template>
<script>
    export default{
        props: ['login', 'error'],
        data(){
            return{
                server: 'https://iptv.kartina.tv/api/json/',
                account: {
                    login: '',
                    packet_name: '',
                    packet_expire: '',
                    settings: {
                        stream_server: { value: '', list: [] },
                        timeshift: { value: '', list: [] },
                        http_caching: { value: '', list: [] },
                        stream_standard: { value: 'hls_h264' }
                    }
                }
            }
        },
        methods: {
            getAccount: function () {
                var self = this
                jsonp(self.server + 'account?settings=1', null, function (err, data) {
                    if (err)  {
                        console.error(err.message)
                    } else {
                        if (data.error) {
                            self.error = data.error
                        }
                        else {
                            self.info = 'Сессия обновлена'
                            self.account = data.account
                            if(self.account.settings.stream_standard.value != 'hls_h264') { // Todo: пока принимаем только стандарт HLS
                                self.account.settings.stream_standard.value = 'hls_h264'
                                self.putSettings('stream_standard')
                            }
                        }
                    }
                })
            },
            getLogon: function () {
                var self = this
                jsonp(self.server + 'login?login=' + self.login.abo + '&pass=' + self.login.pass + '&soft_id=web-ktv-002&cli_serial=webplayer', null, function (err, data) {
                    if (err) {
                        console.error(err.message)
                    } else {
                        if (data.error) {
                            self.errorShow = true
                        }
                        else {
                            self.checkAccount()
                        }

                        self.login.pass = ''
                    }
                })
            },
            getLogout: function () {
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
                        }
                    }
                })
            },
            putSettings: function (k) {
                var self = this
                jsonp(self.server + 'settings_set?var=' + k + '&val=' + self.account.settings[k].value, null, function (err, data) {
                    if (err) {
                        console.error(err.message)
                    } else {
                        if(data.error) {
                            self.error = data.error
                        }
                        else {
                            self.info = 'Настройки обновлены (' + k + '=' + self.account.settings[k].value + ')'
                        }
                    }
                })
            },
            getURL: function (cid) {
                var self = this
                jsonp(self.server + 'get_url?cid=' + cid, null, function (err, data) {
                    if (err) {
                        console.error(err.message)
                    } else {
                        if (data.error) {
                            self.error = data.error
                        }
                        else {
//                            self.videoOptions.autoplay = true
//                            self.videoOptions.source.src = data.url
//                            self.showTab(false)
                            console.log(data.url)
                        }
                    }
                })
            }
        }
    }
</script>
<style lang="css">

</style>
