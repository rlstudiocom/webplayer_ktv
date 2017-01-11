import Vue from 'vue'
import App from './App.vue'

new Vue({
    el: '#app',
    render: h => h(App)
})

/*������� ����� */
var player = KartinaPlayerFactory({server_url: "https://rustvt.kartina.tv/", autologin: true});
/*���������*/
player.run();

