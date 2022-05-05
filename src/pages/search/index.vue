<template>
  <view class="search_wrapper fc">
    <view class="search_input_area fr">
      <input 
        type="text"
        v-model="keyword"
        placeholder="请输入歌曲关键词"
        confirm-type="search"
        @confirm="goSearch"
        @input="goSearch"
        class="search_input"
      >
      <view class="button search" @click="goSearch">搜索</view>
    </view>
    <view class="search_result_area">
      <view class="result_list fc">
        <view 
          v-for="(item, index) in resultList"
          :key="index"
          class="result_item fr"
        >
          <view class="left image">
            <image class="img" :src="item.imgSrc" mode="aspectFill"></image>
          </view>
          <view class="right info fc">
            <view class="song_name">{{ item.songName }}</view>
            <view class="artist">{{ item.artist }}</view>
          </view>
        </view>
      </view>
    </view>
    <Tabbar></Tabbar>
  </view>
</template>

<script>
import { mapState } from "vuex"
import Tabbar from '@/components/tabbar.vue'
export default {
  data() {
    return {
      keyword: '',
      resultList: [],
    }
  },
  components: {
    Tabbar,
  },
  computed: {
    ...mapState(["songList"])
  },
  methods: {
    goSearch() {
      this.resultList = this.songList.filter((songItem) => {
        let condition = songItem.songName.indexOf(this.keyword) !== -1 ||
                        songItem.artist.indexOf(this.keyword) !== -1
        console.log(condition)
        return condition
      });
      console.log(this.resultList)
    },
  },
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
}
.search_wrapper {
  align-items: center;
  .search_input_area {
    width: 700rpx;
    height: 100rpx;
    border-radius: 20rpx;
    border: 2px solid rgb(89, 167, 250);
    position: relative;
    .search_input {
      padding-left: 20rpx;
    }
    .button {
      height: 80rpx;
      position: absolute;
      right: 10rpx;
      line-height: 80rpx;
      font-size: 32rpx;
      padding: 0 20rpx;
      background-color: rgb(89, 167, 250);
      color: #fff;
      border-radius: 20rpx;
    }
  }
  .search_result_area {
    .result_list {
      .result_item {
        margin-bottom: 10rpx;
        .left {
          width: 100rpx;
          height: 100rpx;
          margin-left: 15rpx;
          .img {
            width: 100rpx;
            height: 100rpx;
          }
        }
        .right {
          margin-left: 10rpx;
          .song_name {
            font-size: 30rpx;
          }
          .artist {
            font-size: 24rpx;
          }
        }
      }
    }
  }
}
</style>