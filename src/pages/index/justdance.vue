<template>
  <view class="justdance_wrap fc">
    <canvas id="myCanvas" type="2d" hidden="true"></canvas>
    <view class="pick_area fc">
      <view class="pick_info">
        <view class="song_name">{{ pickResult.songName }}</view>
        <!-- <a :href="hrefBase + pickResult.href"> -->
          <img :src="pickResult.imgSrc" alt="" crossorigin="anonymous">
        <!-- </a> -->
      </view>
      <view class="pick_operation fr">
        <view v-if="!isShuffling || pickMode == 'auto'" class="fr">
          <view class="button shuffle" @click="shuffle">手动选取</view>
          <view class="button auto" @click="autoShuffleAndPick">
            自动选取
            <span @click.stop="">
              <input type="number" class="input_number" v-model="autoPickNum">
            </span>
            首歌曲
          </view>
        </view>

        <view v-else class="fr">
          <view class="button pick" @click="pickSong">选择</view>
          <view class="button stop" @click="pickSong('stop')">选择并结束</view>
        </view>
      </view>
    </view>

    <view class="pick_result">
      <!-- <view class="box_shadow"></view> -->
      <view class="title">已选歌曲</view>
      <view class="clear" @click.stop="clearPickList">清空已选</view>
      <view class="pick_list fr">
        <view 
          v-for="(item, index) in pickList" 
          :key="index"
          class="pick_item"
        >
          <!-- <a :href="hrefBase + item.href"> -->
            <img :src="item.imgSrc" alt="" crossorigin="anonymous">
          <!-- </a> -->
          <view class="song_name">{{ item.songName }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import cheerio from 'cheerio'
import { getUrlBase64 } from '@/common/tools.js'

export default {
  data() {
    return {
      hrefBase: 'https://justdance.fandom.com', 
      webUrl: 'https://justdance.fandom.com/wiki/Category:Songs', // 爬取页面
      resultList: [], // 爬取数据结果列表
      pickResult: {  // 当前轮播歌曲数据
        songName: '',
        href: '',
        imgSrc: '',
      },
      pickList: [],  // 已选歌曲列表
      shuffleTimer: null,  // 轮播计时器
      pickMode: 'manual', // 选曲模式：manual-手动 auto-自动
      autoPickNum: 3, // 自动选曲歌曲数量
    }
  },
  onLoad() {
    this.getJustdanceInfo()
  },
  computed: {
    isShuffling() {
      return this.shuffleTimer? true: false
    }
  },
  methods: {
    // 获取jd wiki页面信息
    getJustdanceInfo() {
      // TODO 改为云函数
      uni.request({
        url: this.webUrl
      }).then(resp => {
        console.log("resp:", resp)
        let $ = cheerio.load(resp[1].data)
        console.log("$:", $)
        let list = $(".category-members-grouped__member")
        console.log("list:", list)

        for(let i = 0; i < list.length; i++) {
          let item = list.eq(i)
          let title = item.find(".category-members-grouped__member-link").attr("title")
          let dataSrc = item.find(".category-members-grouped__member-thumbnail").attr("data-src")
          console.log("title:", title)
          console.log("dataSrc:", dataSrc)
          // 图片src截取到后缀名，否则不显示
          if(dataSrc) {
            let posSubfix = dataSrc.indexOf('png')
            if(posSubfix == -1) {
              posSubfix = dataSrc.indexOf('jpg')
              if(posSubfix == -1) {
                console.warn("unmatch image format:", dataSrc)
                continue
              }
            }
            // 通过转码减少图片请求
            getUrlBase64(dataSrc.slice(0, posSubfix+3), 'png').then(res => {
              let result = {
                songName: title,
                href: item.find(".category-members-grouped__member-link").attr("href"),
                imgSrc: res,
              }
              this.resultList.push(result)
              if(this.resultList.length == 1) {
                this.pickResult = this.resultList[0]
              }
            })
          }
        }
        console.log("result list:", this.resultList)
      })
    },

    // 进行图片轮播
    shuffle() {
      this.shuffleTimer = setInterval(() => {
        let randomIndex = Math.floor(Math.random() * this.resultList.length)
        this.pickResult = this.resultList[randomIndex]
      }, 100)
    },

    // 选取歌曲
    pickSong(op) {
      if(this.pickList.indexOf(this.pickResult) == -1) {
        this.pickList.push(this.pickResult)
      } else {
        uni.showToast({
          title: '你已经选过该歌曲',
          duration: 2000,
        })
      }
      if(op == 'stop') {
        clearInterval(this.shuffleTimer)
        this.shuffleTimer = null
      }
    },

    // 自动化选曲
    autoShuffleAndPick() {
      this.pickMode = 'auto'
      this.shuffle()
      this.pickList = []
      let autoPicker = setInterval(() => {
        if(this.pickList.indexOf(this.pickResult) == -1) {
          this.pickList.push(this.pickResult)
        }
        if(this.pickList.length == this.autoPickNum) {
          clearInterval(autoPicker)
          clearInterval(this.shuffleTimer)
          this.shuffleTimer = null
          this.pickMode = 'manual'
        }
      }, 150)
    },

    // 清空已选歌曲
    clearPickList() {
      this.pickList = []
    },
  }
}
</script>

<style lang="scss" scoped>
.fr {
  display: flex;
  gap: 10rpx;
}
.fc {
  display: flex;
  flex-direction: column;
}
.button {
  cursor: pointer;
  padding: 8rpx 10rpx;
  color: #ffffff;
  border-radius: 6rpx;
  background: rgb(102, 177, 255);
  &:hover {
    background: #409EFF;
  }
}

.justdance_wrap {
  .pick_area {
    .pick_info {
      img {
        width: 200rpx;
        height: 200rpx;
      }
    }
    .pick_operation {
      justify-content: center;
      .button {
        &.auto {
          .input_number {
            border: none;
            background-color: rgb(217, 236, 255);
            color: #606266;
            text-align: center;
            width: 2.5em;
          }
        }
      }
    }
  }
  .box_shadow {
    margin-top: 20rpx;
    z-index: 9;
    // position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 25rpx;
    border-radius: 25rpx 25rpx 0rpx 0rpx;
    box-shadow: 0 -8rpx 10rpx rgba(113, 203, 238, 0.6);
  }
  .pick_result {
    position: relative;
    z-index: 10;
    margin-top: 20rpx;
    // width: 90%;
    background-color: #fff;
    border-radius: 35rpx 35rpx 0rpx 0rpx;
    box-shadow: 0 -8rpx 10rpx rgba(113, 203, 238, 0.4);
    // transform: translateY(-25rpx);
    .title {
      margin-top: 10rpx;
    }
    .clear {
      cursor: pointer;
      position: absolute;
      top: 13rpx;
      right: 10rpx;
      font-size: 10rpx;
      color: rgb(144, 147, 153);
    }
    .pick_list {
      padding: 8rpx;
      flex-wrap: wrap;
      justify-content: center;
      .pick_item {
        img {
          width: 150rpx;
          height: 150rpx;
        }
      }
    }
  }
}
</style>