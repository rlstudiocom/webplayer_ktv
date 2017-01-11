<template lang="html">
    <li @click="getDetail">
        <div class="type">{{ message.type }}</div>
        <div class="name">{{ message.title }}</div>
        <div class="date">{{ message.dt_create | datetime }}</div>
        <div class="body">{{ message.body }}</div>
    </li>
</template>
<script>
    import jsonp from 'jsonp'

    export default{
        props: ['message'],
        methods: {
            getDetail: function () {
                var self = this
                jsonp(self.$parent.$parent.server + 'messages?cmd=get&id=' + self.message.id, null, function (err, data) {
                    if (err)
                        console.error(err.message);
                    else {
                        if(data.error)
                            self.$parent.$parent.hasError(data.error)
                        else
                            self.message.body = data.message.body // Todo: починить пустое значение, чтобы выводилось потом
                    }
                })
            },
            getDelete: function () {
                
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
        padding: 6px;
        border-bottom: solid 1px rgba(255,255,255,.1);
        transition: height 2s ease;
    }
    #messages > ul > li:hover{
        background-color: rgba(0,0,0,.2);
        /*height: auto;*/
    }
    #messages > ul > li .type {
        position: absolute;
        top: 10px;
        right: 6px;
        font-size: 10px;
        line-height: 10px;
        background: #eeac32;
        background: linear-gradient(to top, rgba(238, 172, 50, .5), rgba(238, 172, 50, 1));
        padding: 2px 6px 1px;
        border-radius: 6px;
        text-transform: uppercase;
    }
    #messages > ul > li .date {
        font-size: 14px;
        color: #dedede;
    }
    #messages > ul > li .name {
        font-size: 16px;
        font-weight: bold;
    }
    #messages > ul > li .archive {
        position: absolute;
        top: 2px;
        left: 4px;
        font-size: 12px;
        color: #00b200;
    }
    #messages > ul > li .body {
        color: #dedede;
        font-size: 12px;
        line-height: 14px;
        overflow: hidden;
        /*transition: height 2s ease;*/
    }
</style>
