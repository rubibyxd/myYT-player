<template>
  <div class="home">
    <div class="title">
      <h1 class="page-topic">影片搜尋</h1>
      <div class="search-bar">
        <input v-model="searchString" 
               type="text" 
               class="search-input" 
               @keydown.13.prevent="search(searchString)"  
               placeholder="輸入想搜尋的影片關鍵字 ... ">
        <div class="search-btn" :class="{'search-btn--disabled' : !searchString}" @click.stop="search(searchString)">
          <font-awesome-icon :icon="['fas', 'search']" />
        </div>
      </div>
    </div>
    <div v-show="apiLoading" class="loader"></div>
    <div v-show="!apiLoading" class="video-container">
      <div v-for="(item,index) in totalPage[nowPage]" :key="index" class="single-video">
        <div class="video-pic">
          <div class="mask">
            <div class="play-btn" @click="playNow(item)">立即播放</div>
            <div class="add-to-fav-btn" @click="addToCollect(item)">加入收藏夾</div>
          </div>
          <img :src="`${ item.snippet.thumbnails.medium.url }`" alt="pic">
          <div v-if="item.time !== '00:00:00'" class="video-long">{{ item.time }}</div>
          <div v-if="item.time === '00:00:00'" class="video-online">直播中</div>
        </div>
        <div class="video-info">
          <div class="video-title">{{ item.snippet.title }}</div>
          <div class="video-info">
            <div class="channel">{{ item.snippet.channelTitle }}</div>
            <div class="watch-times">觀看次數: {{ item.viewCount }}</div>
          </div>
        </div>
      </div>  
    </div>
    <pagination v-show="totalPage.length > 0" v-model="nowPage"
      :send-total-page="totalPage"/>
  </div>
</template>

<script>
import Pagination from '../components/pagination.vue';
import moment from 'moment';
export default {
  name: 'Home',
  components: {
    Pagination
  },
  data() {
    return {
      nowPage: 0,
      totalPage:[],
      perPage:12,
      nextToken: '',
      apiData: [],
      videoIds: null,
      allData: [],
      searchString: '',
      apiLoading:false,
      // apiKey: 'AIzaSyAKff7kMhRQeHKIYofqBxeA4YvmV7zv8c8'
      apiKey: 'AIzaSyDje5RZ3Bi-mBAASuyoVUwkBjvmQ39HEGw'
    }
  },
  created(){
    this.getData()
  },
  methods: {
    async getData(token='', str = '') {
      this.apiLoading = true
      await this.getBaseData(token, str)
      if (this.videoIds) {
        await this.getWatchData(this.videoIds)
        await this.getTimeData(this.videoIds)
      }
      await this.getBaseData(this.nextToken, str)
      if (this.videoIds) {
        await this.getWatchData(this.videoIds)
        await this.getTimeData(this.videoIds)
      }
      this.apiLoading = false
    },
    resetData(){
      this.totalPage = []
      this.nextToken =  ''
      this.apiData =  []
      this.videoIds =  null
      this.allData =  []
      this.nowPage = 0
    },
    search(searchParams) {
      if (!searchParams)
        return
      // 移除前後空白字元
      const trimmedSearchString = searchParams.trim()
      if (trimmedSearchString !== '') {
        // Split search string 以空格分割字串
        const searchParamsArr = trimmedSearchString.split(/\s+/);
        this.searchString = searchParamsArr.join(' ');
        const searchStr = searchParamsArr.join('+');
        this.resetData()
        this.getData('', searchStr)
      }
    },
    getBaseData(token,searchStr){
      const url = 'https://www.googleapis.com/youtube/v3/search'
      let paramsObjBase = {
        part: 'snippet',
        type: 'video',
        order: 'date',
        location: '23.697809,120.960518',
        locationRadius: '200km',
        maxResults: 50,
        key: this.apiKey
      }
      let paramsObjSearch = {
        part: 'snippet',
        type: 'video',
        order: 'viewCount',
        q: searchStr || '',
        maxResults: 50,
        key: this.apiKey
      }
      if (token) {
        paramsObjBase.pageToken = token
        paramsObjSearch.pageToken = token
      }
      const _this = this
      return this.axios.get(url, { params: searchStr ? paramsObjSearch : paramsObjBase })
      .then(res => {
        const data = _this.deepCopy(res.data.items)
        const idData = data.map(el => el.id.videoId)
        _this.videoIds = idData.join(',')
        _this.apiData = data
        _this.nextToken = res.data.nextPageToken
      })
      .catch(error => {
        console.error(error)
      })
    },
    deepCopy(data) {
      return JSON.parse(JSON.stringify(data))
    },
    getTimeData(videoIds){
      const url = 'https://www.googleapis.com/youtube/v3/videos'
      const paramsObj = {
        id: videoIds,
        part: 'contentDetails',
        key: this.apiKey
      }
      const _this = this
      this.axios.get(url,{ params: paramsObj })
        .then(res => {
          // 1. 把拿到的資料過濾，只需要id跟時間
          // 2. 把時間的格式處理成一般閱讀的格式
          const data = _this.deepCopy(res.data.items)
          const newData = data.map(item => {
            let obj = {
              id: item.id,
              time:_this.timeFormat(item.contentDetails.duration),
            }
            return obj
          })
          // 因為順序一致所以可以直接以 index 將兩個資料合併
          const arr = _this.apiData.map((item,index) =>{
            item.time = newData[index].time
            return item
          })
          _this.allData = [..._this.allData, ...arr]
          const newVideoData = []
          let allVideos = JSON.parse(JSON.stringify(_this.allData))
          allVideos.forEach((item, i) => {
            const page = parseInt(i / this.perPage)
            if (i % this.perPage === 0) {
              newVideoData.push([])
            }
            newVideoData[page].push(item)
          })
          this.totalPage = newVideoData
        })
        .catch(error => {
          console.error(error)
        })
    },
    getWatchData(videoIds){
      const url = 'https://www.googleapis.com/youtube/v3/videos'
      const paramsObj = {
        id: videoIds,
        part: 'statistics',
        key: this.apiKey
      }
      const _this = this
      this.axios.get(url,{ params: paramsObj })
        .then(res => {
          // 1. 把拿到的資料過濾，只需要id跟觀看次數
          const data = _this.deepCopy(res.data.items)
          const newData = data.map(item => {
            let obj = {
              id: item.id,
              viewCount:_this.formatNum(item.statistics.viewCount),
            }
            return obj
          })
          const arr = _this.apiData.map((item,index) =>{
            item.viewCount = newData[index].viewCount
            return item
          })
          _this.allData = [..._this.allData, ...arr]
          const newVideoData = []
          let allVideos = JSON.parse(JSON.stringify(_this.allData))
          allVideos.forEach((item, i) => {
            const page = parseInt(i / this.perPage)
            if (i % this.perPage === 0) {
              newVideoData.push([])
            }
            newVideoData[page].push(item)
          })
          this.totalPage = newVideoData
        })
        .catch(error => {
          console.error(error)
        })
    },
    timeFormat(timeString){
      let time = moment.duration(timeString)
      const h = this.padZero(time.hours())
      const m = this.padZero(time.minutes())
      const s = this.padZero(time.seconds())
      return `${h}:${m}:${s}`
    },
    padZero(item) {
      return item.toString().padStart(2, '0')
    },
    formatNum(num){
      let result = ''
      let counter = 0
      num = (num || 0).toString()
      for(let i = num.length - 1; i >= 0; i -- ){
        counter++
        result = num.charAt(i) + result
        if (!(counter % 3) && i !== 0) { result = ',' + result; }
      }
      return result
    },
    playNow(item){
      this.addToCollect(item)
      this.$router.push('/videoPlayer')
    },
    addToCollect(item){
      let storageData = localStorage.getItem('myCollectionFolder')
      if(!storageData){
        let dataArr = []
        dataArr.push(item)
        localStorage.setItem('myCollectionFolder',JSON.stringify(dataArr))
      }
      if(storageData){
        let dataArr = JSON.parse(storageData)
        dataArr.unshift(item)
        localStorage.setItem('myCollectionFolder',JSON.stringify(dataArr))
      }
    }
  },
}
</script>
<style lang="scss" scoped>
  .home{
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
    .title{
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 40px;
      .page-topic{
        font-size: 42px;
        color: #FF4299;
        font-weight: bold;
        margin-bottom: 30px;
      }
      .search-bar{
        width: 40%;
        display: flex;
        align-items: center;
        .search-input{
          width: 100%;
          height: 35px;
          border: 1px solid #FF4299;
          border-right: 1px transparent;
          border-radius: 5px 0 0 5px;
          background-color: #242121;
          font-size: 16px;
          padding: 0 20px;
          color: #FF4299;
          &:focus{
            outline: none;
          }
        }
        .search-btn{
          width: 20%;
          height: 35px;
          background-color: #FF4299;
          border: 1px solid #FF4299;
          border-radius: 0 5px 5px 0;
          color: #242121;
          font-size: 22px;
          line-height: 1.5;
          text-align: center;
          cursor: pointer;
        }
        .search-btn--disabled{
          background-color: #a7a7a7;
          border: 1px solid #a7a7a7;
          color: #828282;
        }
      }
    }
    .video-container{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
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
          .video-long {
            padding: 3px 7px;
            background-color: rgba(20, 16, 16, 0.9);
            position: absolute;
            bottom: 10px;
            right: 10px;
            user-select: none;
          }
          .video-online {
            padding: 3px 7px;
            background-color: rgba(159, 14, 14, 0.9);
            position: absolute;
            bottom: 10px;
            right: 10px;
            user-select: none;
          }
        }
        .mask{
          display: none;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          position: absolute;
          z-index: 99;
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
          .add-to-fav-btn{
            width: 150px;
            padding: 10px 0px;
            border: 1px solid #F0F0F0;
            border-radius: 5px;
            text-align: center;
            user-select: none;
            font-weight: bold;
            cursor: pointer;
            &:hover{
              background-color: #F0F0F0;
              color: #141010;
            }
          }
        }
        .video-info{
          .video-title{
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            width: 100%;
            font-weight: 500;
            margin-bottom: 5px;
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
          .mask{
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
