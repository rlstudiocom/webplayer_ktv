<template lang="html">
    <videoPlayer :options="videoOptions" ref="videoPlayer"></videoPlayer>
</template>
<script>
    import { videoPlayer } from 'vue-video-player'

    export default {
        props: ['videoOptions'],
        components: { videoPlayer },
        computed: {
            player() {
                return this.$refs.videoPlayer.player
            }
        },
        mounted: function () {
            this.videoOptions.height = this.height
        },
        methods: {
            setHeight: function (height) {
                this.videoOptions.height = height
            },
            setStream: function (url) {
                //self.videoOptions.poster = self.channel.big_icon_link
                this.videoOptions.source.src = url
                //self.videoOptions.source.label = self.channel.name
            }/*,
            playerStateChanged(playerCurrentState) {
                console.log(playerCurrentState)
            }*/
        }
    }
</script>
<style lang="css">
    videoPlayer, .video-player {
        height: 100vh;
    }
</style>
