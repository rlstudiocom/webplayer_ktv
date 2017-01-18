class ktv {

    var server
    var error

    constructor(server) {
        this.server = server
    }

    getLogon (abo, pass) {
        jsonp(this.server + 'login?login=' + abo + '&pass=' + pass + '&soft_id=web-ktv-002&cli_serial=webplayer', null, function (err, data) {
            if (err) {
                console.error(err.message)
            } else {
                return data
            }
        })
    }

    getLogout() {
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
    }

    getChannelList () {
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
    }

    getUrl(cid) {
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
    }

    getAccount () {
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
    }

    sendSettings (k) {
        jsonp(self.server + 'settings_set?var=' + k + '&val=' + self.settings[k].value, null, function (err, data) {
            if (err)
                console.error(err.message);
            else {
                if (data.error) {
                    self.error = data.error
                }
                else {
                    self.info = 'Настройки обновлены (' + k + '=' + self.settings[k].value + ')'
                }
            }
        })
    }

}
