<template>
  <div class="video-player">
    <div class="title">
      <h1>影片播放器</h1>
    </div>
    <div class="player-container">
      <main class="main-video">
        <div class="player-screen">
          <div id="ad-block" @click="showAdBlock">
            <h2>我是廣告頁</h2>
            <h2>再點一下繼續播放</h2>
          </div>
          <div id="video-player" data-plyr-provider="youtube"></div>
        </div>
        <div class="video-title">
          怕海的人不要看，真實的美人魚 | 老高與小茉 Mr & Mrs Gao
        </div>
        <div class="simple-info">
          <span class="watch-times">觀看次數: 9999999</span>
          <span class="upload-time">上傳時間: 9999999</span>
        </div>
        <div class="btn-container">
          <div class="next-video">下一部影片</div>
          <div class="goto-youtube">以 youtube 開啟</div>
        </div>
      </main>
      <aside class="video-list">
        <div class="list-title">播放清單</div>
        <div class="single-video">
          <div class="video-pic">
            <img src="/images/sample.jpg" alt="">
          </div>
          <div class="video-info">
            <div class="vdo-title">[ 純享版 ] 林憶蓮《水星記》《夢想的聲音2》EP.4 20171124 /浙江衛視官方HD/</div>
            <div class="channel-name">我是頻道名稱</div>
          </div>
        </div>
        <div class="list-scroll">▼</div>
      </aside>
    </div>
  </div>
</template>
<script>
import Plyr from 'plyr'
export default {
  name:"VideoPlayer",
  data() {
    return {
      nowVideo:'bTqVqk7FSmY',
      player: null,
      isPlaying:false,
    }
  },
  methods: {
    changeVideo(videoId){
      if(videoId) {
        this.nowVideo = videoId
      }
    },
    updateVideo() {
        this.player.destroy()
        const player = document.querySelector('#video-player')
        player.setAttribute('data-plyr-embed-id', this.nowVideo)
        this.player = new Plyr('#video-player')
    },
    showAdBlock(data){
      this.player.togglePlay(data)
      const block = document.getElementById('ad-block')
      if(data){
        block.style.display = "none"
      }else{
        block.style.display = "flex"
        block.style.flexDirection = "column"
        block.style.alignItems = "center"
        block.style.justifyContent = "center"
      }
    },
    onPlay() {
      this.isPlaying = true
    },
    onPause() {
      this.isPlaying = false
    },
  },
  mounted() {
      const player = document.querySelector('#video-player')
      player.setAttribute('data-plyr-embed-id', this.nowVideo)
      this.player = new Plyr('#video-player')
  },
  watch: {
    nowVideo(){
      this.updateVideo()
    },
    isPlaying(){
      this.showAdBlock(this.isPlaying)
    },
    player(){
      if(this.player){
        this.player.on('play', () => this.onPlay())
        this.player.on('pause', () => this.onPause())
      }
    },
  },
}
</script>
<style lang="scss" scoped>
  .video-player{
      padding: 50px 70px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .title{
        font-size: 42px;
        color: #FF4299;
        font-weight: bold;
        margin-bottom: 30px;
      }
      .player-container{
        width: 100%;
        display: flex;
        justify-content: center;
        .main-video{
          width: 60%;
          height: 100%;
          margin-right: 20px;
          .player-screen{
            width: 100%;
            position: relative;
          }
          .video-title{
            font-size: 24px;
            font-weight: 500;
            margin: 20px 0;
          }
          .watch-times {
            margin-right: 20px;
          }
          #ad-block{
            display: none;
            width: 100%;
            height: 100%;
            font-size: 40px;
            line-height: 1.5;
            background-color: rgba(0, 0, 0, 0.9);
            color: #ffc60a;
            position: absolute;
            z-index: 99;
            text-align: center;
            user-select: none;
            cursor: pointer;
          }
        }
        .video-list{
          width: 30%;
          max-height: 600px;
          overflow: hidden;
          position: relative;
          .list-title,.list-scroll{
            width: calc(100% - 20px);
            text-align: center;
            background-color: #242121;
            font-size: 20px;
            font-weight: 500;
            padding: 10px;
          }
          .list-scroll{
            position: absolute;
            bottom: 0;
            user-select: none;
            cursor: pointer;
            opacity: 0.5;
            transition: 0.3s opacity;
            &:hover{
              opacity: 1;
            }
          }
          .single-video{
            margin: 20px 0;
            display: flex;
            .video-pic{
              width: 50%;
              margin-right: 15px;
              img{
                width: 100%;
                object-fit: cover;
              }
            }
            .video-info{
              width: 50%;
              font-size: 12px;
              .vdo-title{
                font-weight: 500;
                margin-bottom: 15px;
                line-height: 1.5;
              }
              .channel-name{
                color: #CDCDCD;
              }
            }
          }
        }
      }
      .btn-container{
        display: flex;
        text-align: center;
        align-self: flex-start;
        margin-top: 30px;
        .next-video,.goto-youtube {
          width: 300px;
          padding: 10px 0;
          border-radius: 5px;
          font-weight: bold;
          user-select: none;
          cursor: pointer;
        }
        .next-video {
          border: 1px solid #FF4299;
          color:  #FF4299;
          margin-right: 30px;
          &:hover {
            background-color: #FF4299;
            color: #141010;
          }
        }
        .goto-youtube{
          background-color: #b32f2f;
          color: #D6D6D6;
          &:hover {
            background-color: #b31111;
          }
        }
      }
  }
</style>