<template lang="html">
    <li>
        <div class="name">{{ message.title }}</div>
        <div class="date">{{ message.dt_create | datetime }}</div>
    </li>
</template>
<script>
    export default{
        props: ['message'],
        data(){
            return{
                progress: 0
            }
        },
        methods: {
            getDetail: function (id) {
                
            },
            getDelete: function (id) {
                
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
    #messages > ul > li {
        position: relative;
        background: transparent no-repeat 2px 50%;
        padding: 2px 2px 2px 6px;
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
</style>
