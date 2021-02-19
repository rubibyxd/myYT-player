<template>
  <div class="collection">
    <div class="title">
      <h1>我的影片收藏夾</h1>
    </div>
    <div v-show="loading" class="loader"></div>
    <div v-show="delSuccess" class="delSuccessHint"></div>
    <div v-if="totalPage" class="video-container">
      <div v-for="(item,index) in totalPage[nowPage]" :key="index" class="single-video">        
        <div class="video-pic">
          <div class="mask">
            <div class="play-btn" @click="playThis(item)">立即播放</div>
          </div>
          <div class="del-btn" @click.stop="delItem(item)">×</div>
          <img :src="`${item.snippet.thumbnails.medium.url}`" alt="pic">
          <div class="video-long">{{ item.time }}</div>
        </div>
        <div class="video-info">
          <div class="video-title">{{ item.snippet.title }}</div>
          <div class="video-info">
            <div class="channel">{{ item.snippet.channelTitle }}</div>
            <div class="watch-times">觀看次數:{{ item.viewCount }}</div>
          </div>
        </div>
      </div>  
    </div>
    <pagination  v-show="totalPage.length > 0" v-model="nowPage"
                :send-total-page="totalPage"/>
    <template v-if="totalPage.length === 0 && !loading">
      <div>
        <div class="empty-hint">
          <h1>
            <font-awesome-icon :icon="['fas', 'dizzy']" />
            Oops！您的收藏夾是空的唷！
          </h1>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import Pagination from '../components/pagination.vue';
export default {
  name:"Collection",
  components: {
    Pagination
  },
  data() {
    return {
      allVideoData:[],
      nowPage: 0,
      totalPage:[],
      perPage:8,
      loading:false,
      delSuccess:false
    }
  },
  methods: {
    delItem(item){
      let newData = this.allVideoData.filter(el => el.id.videoId !== item.id.videoId)
      this.setCollectData(newData)
      this.getCollectData()
    },
    getCollectData(){
      this.loading = true
      this.totalPage = []
      let storageData = JSON.parse(localStorage.getItem('myCollectionFolder'))
      this.allVideoData = storageData
      const newData = []
      this.allVideoData.forEach((item, i) => {
        const page = parseInt(i / this.perPage)
        if (i % this.perPage === 0) {
            newData.push([])
        }
        newData[page].push(item)
      })  
      let t = setTimeout(()=>{
        this.totalPage = JSON.parse(JSON.stringify(newData))
        this.loading = false
        clearTimeout(t)
      },1000)
      
    },
    setCollectData(data) {
      let newData = JSON.stringify(data)
      localStorage.setItem('myCollectionFolder',newData)
    },
    playThis(item) {
      // console.log(item)
      // 1. 從localStorage裡找到對應item的index
      let storageDataArr = JSON.parse(localStorage.getItem('myCollectionFolder'))
      let itemIndex = storageDataArr.findIndex( el => {
          return el.id.videoId === item.id.videoId
      })
      // 2. 用 arrMove 將 item 的 index 移到第0個後再將 localStorage 的資料重設
      let newArr = JSON.stringify(this.arrMove(storageDataArr,itemIndex,0))
      localStorage.setItem('myCollectionFolder',newArr)
      // 3. 跳轉到撥放器
      this.$router.push('/videoPlayer')
    },
    arrMove(arr, fromIndex, toIndex) {
      let item = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, item);
      return arr
    }
  },
  created() {
    this.getCollectData()
  },
  watch:{
    totalPage(data){
      console.log('totalPage',data)
    },
    allVideoData(data){
      console.log('allVideoData',data)
    }
  }
}
</script>
<style lang="scss" scoped>
  .collection{
      padding: 50px 70px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .loader {
        margin-top: 30px;
        border: 15px solid #242121; 
        border-top: 15px solid #FF4299; 
        border-radius: 50%;
        width: 100px;
        height: 100px;
        animation: spin 2s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .empty-hint {
        font-size: 30px;
      }
      .title{
        font-size: 42px;
        color: #FF4299;
        font-weight: bold;
        margin-bottom: 30px;
      }
      .video-container{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 40px;
        .single-video{
          width: 290px;
          margin: 0 20px;
          margin-bottom: 40px;
          .video-pic{
            margin-bottom: 10px;
            position: relative;
            img {
              width: 290px;
            }
            .video-long{
              padding: 3px 7px;
              background-color: rgba(20, 16, 16, 0.9);
              position: absolute;
              bottom: 10px;
              right: 10px;
              user-select: none;
            }
            .mask{
              display: none;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.6);
              position: absolute;
              z-index: 95;
              .play-btn{
                width: 150px;
                padding: 10px 0px;
                border: 1px solid #FF4299;
                color: #FF4299;
                font-weight: bold;
                text-align: center;
                margin-bottom: 20px;
                border-radius: 5px;
                user-select: none;
                cursor: pointer;
                &:hover{
                  background-color: #FF4299;
                  color: #F0F0F0;
              }
              }
            }
            .del-btn{
              display: none;
              width: 25px;
              height: 25px;
              color: #F0F0F0;
              font-size: 22px;
              line-height: 1;
              text-align: center;
              border: 2px solid #F0F0F0;
              border-radius: 50%;
              position: absolute;
              z-index: 99;
              top: 5px;
              right: 5px;
              user-select: none;
              cursor: pointer;
              &:hover {
                border: 2px solid transparent;
                background-color: #BF1010;
              }
            }
          }
          .video-info{
            .video-title{
              width: 100%;
              font-weight: 400;
              margin-bottom: 10px;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            .video-info{
              font-size: 14px;
              color: #BCB8B8;
              .channel,.watch-times{
                width: 100%;
                margin-bottom: 10px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
            }
          }
          &:hover {
            .del-btn {
              display: block;
            }
            .mask {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
  }
</style>