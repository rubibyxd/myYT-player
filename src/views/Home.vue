<template>
  <div class="home">
    <div class="title">
      <h1 class="page-topic">Video Search</h1>
      <div class="search-bar">
        <input class="search-input" type="text" placeholder="輸入想搜尋的影片關鍵字 ... ">
        <div class="search-btn">
          <font-awesome-icon :icon="['fas', 'search']" />
        </div>
      </div>
    </div>
    <div class="video-container">
      <div v-for="(item,index) in totalPage[nowPage]" :key="index" class="single-video">
        <div class="video-pic">
          <div class="mask">
            <div class="play-btn">立即播放</div>
            <div class="add-to-fav-btn">加入收藏夾</div>
          </div>
          <img :src="`${ item.picUrl }`" alt="">
          <div class="video-long">{{ item.videoLong }}</div>
        </div>
        <div class="video-info">
          <div class="video-title">{{ item.title }}</div>
          <div class="video-info">
            <div class="channel">{{ item.channel }}</div>
            <div class="watch-times">觀看次數: {{ item.watch }}</div>
          </div>
        </div>
      </div>  
    </div>
    <pagination v-model="nowPage"
      :send-total-page="totalPage"/>
  </div>
</template>

<script>
import Pagination from '../components/pagination.vue';
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
    }
  },
  created() {
    this.axios
      .get('/json/demo.json')
      .then(res => {
        let allBlocks = JSON.parse(JSON.stringify(res.data))
        const newData = []
        allBlocks.forEach((item, i) => {
          const page = parseInt(i / this.perPage)
          if (i % this.perPage === 0) {
            newData.push([])
          }
          newData[page].push(item)
        })
        this.blocks = allBlocks
        this.totalPage = newData
      })
      .catch(function (error) { 
        console.log(error);
      });
  },
  methods: {

  },
}
</script>
<style lang="scss" scoped>
  .home{
    padding: 50px 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
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
          .video-long{
            padding: 3px 7px;
            background-color: rgba(20, 16, 16, 0.9);
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
            font-weight: 500;
            margin-bottom: 5px;
          }
          .video-info{
            font-size: 14px;
            color: #BCB8B8;
            display: flex;
            .channel{
              margin-right: 15px;
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
