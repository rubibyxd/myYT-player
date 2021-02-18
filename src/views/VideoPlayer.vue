<template>
  <div class="video-player">
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
          {{ nowVideo.title }}
        </div>
        <div class="simple-info">
          <span class="watch-times">觀看次數: {{ nowVideo.views }}</span>
          <span class="upload-time">上傳時間: {{ nowVideo.upload }}</span>
        </div>
        <div class="btn-container">
          <!-- <div class="next-video">下一部影片</div> -->
          <div class="goto-youtube" @click="openYTpage(nowVideo.ytUrl)">以 youtube 開啟</div>
        </div>
      </main>
      <aside class="video-list">
        <div class="list-title">播放清單</div>
        <div v-for="(item,index) in videoList" :key="index" class="single-video" @click="changeVideo(item)">
          <div class="video-pic">
            <img :src="`${item.snippet.thumbnails.medium.url}`" alt="pic">
          </div>
          <div class="video-info">
            <div class="vdo-title">{{ item.snippet.title }}</div>
            <div class="channel-name">{{ item.snippet.channelTitle }}</div>
          </div>
        </div>
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
      nowVideo:{
        id:'',
        title:'',
        views:'',
        upload:'',
        ytUrl:''
      },
      videoList:[],
      player: null,
      isPlaying:false,
    }
  },
  methods: {
    changeVideo(item){
      if(item) {
        this.nowVideo = {
          id: item.id.videoId,
          title:item.snippet.title,
          views:item.viewCount,
          upload:this.dateFormat(item.snippet.publishTime),
          ytUrl:'https://www.youtube.com/watch?v=' + item.id.videoId
        }
      }
    },
    updateVideo() {
        this.player.destroy()
        const player = document.querySelector('#video-player')
        player.setAttribute('data-plyr-embed-id', this.nowVideo.id)
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
    initVideoData(){
      let getData = JSON.parse(localStorage.getItem('myCollectionFolder'))
      this.videoList = getData
      this.nowVideo = {
          id:getData[0].id.videoId,
          title:getData[0].snippet.title,
          views:getData[0].viewCount,
          upload:this.dateFormat(getData[0].snippet.publishTime),
          ytUrl:'https://www.youtube.com/watch?v=' + getData[0].id.videoId
      }
    },
    getVideo(){
      const player = document.querySelector('#video-player')
      player.setAttribute('data-plyr-embed-id', this.nowVideo.id)
      this.player = new Plyr('#video-player')
    },
    openYTpage(url) {
      window.open(url)
    },
    dateFormat(dateString) {
      let date = new Date(dateString)
      date = new Date(date)
      let year = date.getFullYear()
      let month = date.getMonth()
      let day = date.getDate()
      return `${year}年${month}月${day}日`
    },
  },
  mounted() {
      this.initVideoData()
      if(this.nowVideo.id)
         this.getVideo()
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
          overflow: auto;
          &::-webkit-scrollbar-track {
            box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            background-color: #F5F5F5;
          }
          &::-webkit-scrollbar {
            width: 10px;
            background-color: #F5F5F5;
          }
          &::-webkit-scrollbar-thumb {
            background-color: #FF4299;
          }
          .list-title{
            width: calc(100% - 20px);
            text-align: center;
            background-color: #242121;
            font-size: 20px;
            font-weight: 500;
            padding: 10px;
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