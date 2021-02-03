<template>
  <div class="collection">
    <div class="title">
      <h1>我的影片收藏夾</h1>
    </div>
    <div class="video-container">
      <div v-for="(item,index) in totalPage[nowPage]" :key="index" class="single-video">
        <div class="video-pic">
          <div class="del-btn" @click.stop="delItem">×</div>
          <img :src="`${item.picUrl}`" alt="pic">
          <div class="video-long">{{ item.videoLong }}</div>
        </div>
        <div class="video-info">
          <div class="video-title">{{ item.title }}</div>
          <div class="video-info">
            <div class="channel">{{ item.channel }}</div>
            <div class="watch-times">觀看次數:{{ item.watch }}</div>
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
  name:"Collection",
  components: {
    Pagination
  },
  mounted() {
    if(localStorage.myVideoFolder){
      let data = JSON.parse(localStorage.myVideoFolder)
      const newData = []
      data.forEach((item, i) => {
      const page = parseInt(i / this.perPage)
      if (i % this.perPage === 0) {
        newData.push([])
      }
      newData[page].push(item)
      })
      this.totalPage = newData
    }
  },
  data() {
    return {
      myVideos:[],
      nowPage: 0,
      totalPage:[],
      perPage:8
    }
  },
  methods: {
    delItem(){
      console.log(this)
    }
  },
}
</script>
<style lang="scss" scoped>
  .collection{
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
            .del-btn{
              display: none;
              width: 25px;
              height: 25px;
              color: #F0F0F0;
              font-size: 24px;
              text-align: center;
              background-color: #BF1010;
              border-radius: 50%;
              position: absolute;
              top: 5px;
              right: 5px;
              user-select: none;
              cursor: pointer;
            }
          }
          .video-info{
            .video-title{
              font-weight: bold;
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
            .del-btn{
              display: block;
            }
          }
        }
      }
  }
</style>