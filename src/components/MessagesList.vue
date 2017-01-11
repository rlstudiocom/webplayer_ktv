<template lang="html">
    <div id="messages">
        <ul>
            <li class="empty" v-show="!messages">Нет ни одного сообщения</li>
            <Message v-for="message in messages" :message="message"></Message>
        </ul>
    </div>
</template>

<script>
    import jsonp from 'jsonp'
    import Message from './Message.vue'

    export default {
        data () {
            return {
                messages: []
            }
        },
        components: { Message },
        methods: {
            getMessagesList: function () {
                var self = this
                jsonp(self.$parent.server + 'messages?cmd=list', null, function (err, data) {
                    if (err) {
                        console.error(err.message)
                    }
                    else {
                        if(data.error)
                            self.$parent.hasError(data.error)
                        else
                            self.messages = data.messages
                    }
                })
            }
        },
        created: function () {
            this.getMessagesList()
        }
    }
</script>

<style lang="css">
    #messages {
        height: 100%;
        overflow-y: scroll;
    }
    #messages li.empty {
        text-align: center;
        padding: 24px 6px;
    }
</style>