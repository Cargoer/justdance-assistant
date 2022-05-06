<template>
  <view class="search_wrapper fc">
    <view class="search_input_area fr">
      <input 
        type="text"
        v-model="keyword"
        placeholder="请输入歌曲或歌手名称"
        confirm-type="search"
        @confirm="goSearch"
        @input="goSearch"
        class="search_input"
      >
      <view class="button search" @click="goSearch">搜索</view>
    </view>
    <view class="search_result_area">
      <view class="count">
        共搜索到 {{resultList.length}} 条结果
      </view>
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
            <!-- <view class="song_name">{{ highlightName(item.songName) }}</view> -->
            <rich-text class="song_name" :nodes="highlightName(item.songName)"></rich-text>
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
    ...mapState(["songList"]),
    
  },
  methods: {
    highlightName(songName) {
      let name = songName
      let reg = new RegExp(`${this.keyword}`, "gi")
      let matches = name.match(reg)
      console.log(songName, matches)
      if(matches) {
        matches.forEach((matchStr) => {
          let pos = name.indexOf(matchStr)
          let nameL = name.split("")
          nameL.splice(pos+this.keyword.length, 0, '</span>')
          nameL.splice(pos, 0, `<span style="color: rgb(214, 38, 38);">`)
          name = nameL.join("")
        })
      }
      console.log(name)
      return name
      // return name.replaceAll(reg, `<span style="color: rgb(214, 38, 38);">${this.keyword}</span>`)
    },
    goSearch() {
      let reg = new RegExp(`${this.keyword}`, "i")
      this.resultList = this.songList.filter((songItem) => {
        // let condition = songItem.songName.indexOf(this.keyword) !== -1 ||
        //                 songItem.artist.indexOf(this.keyword) !== -1
        let condition = songItem.songName.match(reg) ||
                        songItem.artist.match(reg)
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
  padding-top: 10rpx;
  .search_input_area {
    width: 700rpx;
    height: 100rpx;
    border-radius: 20rpx;
    border: 2px solid rgb(89, 167, 250);
    position: sticky;
    // color: rgb(214, 38, 38);
    // #ifdef H5
    top: calc(var(--status-bar-height) + 98rpx);
    // #endif
    // #ifdef MP-WEIXIN
    top: 10rpx;
    // #endif
    // margin-top: 10rpx;
    background-color: #fff;
    z-index: 100;
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
    width: 100%;
    margin-top: 25rpx;
    .count {
      margin-left: 25rpx;
      margin-bottom: 10rpx;
    }
    .result_list {
      margin-bottom: 110rpx;
      .result_item {
        // margin-bottom: 15rpx;
        margin-left: 25rpx;
        border-bottom: 1px solid rgba(89, 167, 250, 0.6);
        height: 150rpx;
        .left {
          width: 120rpx;
          height: 120rpx;
          // margin-left: 25rpx;
          border-radius: 10rpx;
          .img {
            width: 120rpx;
            height: 120rpx;
          }
        }
        .right {
          margin-left: 10rpx;
          .song_name {
            font-size: 30rpx;
            margin-bottom: 8rpx;
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