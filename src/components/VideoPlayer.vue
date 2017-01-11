<template lang="html">
    <videoPlayer :options="videoOptions" ref="videoPlayer"></videoPlayer>
</template>
<script>
    import videoPlayer from 'vue-video-player'

    export default {
        components: { videoPlayer },
        data() {
            return {
                videoOptions: {
                    source: {
                        type: "video/mp4",
                        src: "http://vjs.zencdn.net/v/oceans.mp4"
                    },
                    techOrder: ["flash"],
                    poster: "http://www.freemake.com/blog/wp-content/uploads/2015/06/videojs-logo.jpg",
                    autoplay: false,
                    customEventName: 'state'
                }
            }
        },
        computed: {
            player() {
                return this.$refs.videoPlayer.player
            }
        },
        methods: {
            playerStateChanged(playerCurrentState) {
                console.log(playerCurrentState)
            }
        }
    }
</script>
<style lang="css">

</style>
