<template>
  <div id="app">
    <div id="nav">
      <div class="logo">
        <font-awesome-icon :icon="['fas', 'play-circle']" />
        My YT-Player
      </div>
      <div class="link-container">
        <router-link to="/">首頁</router-link>
        <router-link to="/videoPlayer">播放器</router-link>
        <router-link to="/collection">收藏夾</router-link>
      </div>
    </div>
    <router-view/>
  </div>
</template>
<style lang="scss">
#nav {
  height: 50px;
  background-color: #242121;
  padding: 0 50px;
  display: flex;
  align-items: center;
  .logo{
    margin-right: 100px;
    font-weight: bold;
    font-size: 20px;
    color: #FF4299;
    display: flex;
    align-items: center;
    user-select: none;
    svg {
      font-size: 26px;
      margin-right: 15px;
    }
  }
  .link-container{
    a{
      display: inline-block;
      width: 100px;
      padding: 10px 0;
      text-align: center;
    }
    .router-link-exact-active{
      color: #FF4299;
      font-weight: bold;
      border-bottom: 5px solid #FF4299;
      text-shadow: 0 0 10px #ff5ea96b;
    }
  }
}
</style>
