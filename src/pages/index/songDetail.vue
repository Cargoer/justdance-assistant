<template>
  <view class="song_detail_wrap fr">
    <view class="detail_container fc">
      <img class="song_img" :src="chosenSong.imgSrc" alt="">
      <view class="cell fr">
        <view class="left_txt">song</view>
        <view class="right_txt">{{ chosenSong.songName }}</view>
      </view>
      <view class="cell fr">
        <view class="left_txt">artist</view>
        <view class="right_txt">{{ chosenSong.artist }}</view>
      </view>
      <view class="cell fr">
        <view class="left_txt">year</view>
        <view class="right_txt">{{ chosenSong.year }}</view>
      </view>
      <view class="cell fr">
        <view class="left_txt">mode</view>
        <view class="right_txt">{{ chosenSong.mode }}</view>
      </view>
      <view class="cell fr">
        <view class="left_txt">original game</view>
        <view class="right_txt">{{ chosenSong.original_game }}</view>
      </view>
      <view class="cell fr no_bottom_line">
        <view class="left_txt">release date</view>
        <view class="right_txt">{{ chosenSong.release_date }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState(["chosenSong"])
  },
  onLoad(e) {
    if(e.song) {
      this.setChosenSong(JSON.parse(decodeURIComponent(e.song)))
    }
    console.log("chosen song:", this.chosenSong)
  },
  methods: {
    ...mapMutations(["setChosenSong"])
  },
  onShareAppMessage() {
    return {
      title: `我在跳${this.chosenSong.songName}，一起来跳吧！`,
      path: `/pages/index/songDetail?song=${encodeURIComponent(JSON.stringify(this.chosenSong))}`,
      imageUrl: this.chosenSong.imgSrc || ""
    }
  }
}
</script>

<style lang="scss" scoped>
.fr {
  display: flex;
  align-items: center;
}
.fc {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.song_detail_wrap {
  width: 100%;
  min-height: 100vh;
  .detail_container {
    width: 100%;
    padding: 0 40rpx;
    
    .song_img {
      width: 300rpx;
      height: 300rpx;
      border-radius: 10rpx;
      margin-bottom: 30rpx;
    }
    .cell {
      // width: 150rpx;
      width: 100%;
      height: 110rpx;
      border-bottom: 1px solid #F0F0F0;
      position: relative;
      .left_txt {
        font-size: 20px;
        // font-family: Noto Sans S Chinese;
        font-weight: 500;
        color: #0F1D2E;
      }
      .right_txt {
        font-size: 18px;
        // font-family: Noto Sans S Chinese;
        font-weight: 500;
        color: #7c848b;
        position: absolute;
        right: 0;
      }
    }
  }
}
</style>