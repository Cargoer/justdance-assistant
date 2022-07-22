<template>
  <view class="justdance_wrap fc">
    <canvas id="myCanvas" canvas-id="myCanvas" type="2d" hidden="true"></canvas>
    <view class="pick_area fc">
      <view class="pick_info fc a_i">
        <view class="song_name">{{ pickResult.songName }}</view>
        <!-- <a :href="hrefBase + pickResult.href"> -->
          <image class="img" :src="pickResult.imgSrc" mode="aspectFill"></image>
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

    <view class="pick_result fc a_i">
      <!-- <view class="box_shadow"></view> -->
      <view class="title">已选歌曲</view>
      <view class="clear" @click.stop="clearPickList">清空已选</view>
      <view class="pick_list fr">
        <view 
          v-for="(item, index) in pickList" 
          :key="index"
          class="pick_item"
          @click="gotoDetail(item)"
        >
          <!-- <a :href="hrefBase + item.href"> -->
            <image class="img" :src="item.imgSrc" mode="aspectFill"></image>
          <!-- </a> -->
          <view class="song_name">{{ item.songName }}</view>
        </view>
      </view>
    </view>
    <Tabbar></Tabbar>
  </view>
</template>

<script>
import cheerio from 'cheerio'
import { getUrlBase64 } from '@/common/tools.js'
import Tabbar from '@/components/tabbar.vue'
import { mapState, mapMutations } from "vuex"

export default {
  data() {
    return {
      hrefBase: 'https://justdance.fandom.com', 
      webUrl: 'https://justdance.fandom.com/wiki/Just_Dance_Unlimited_(Chinese_Version)', // 爬取页面
      resultList: [], // 爬取数据结果列表
      pickResult: {  // 当前轮播歌曲数据
        songName: '',
        href: '',
        imgSrc: '',
      },
      shuffleTimer: null,  // 轮播计时器
      pickMode: 'manual', // 选曲模式：manual-手动 auto-自动
      autoPickNum: 3, // 自动选曲歌曲数量
    }
  },
  components: {
    Tabbar,
  },
  onLoad() {
    if(!this.songList.length) {
      this.getJustdanceInfo()
    } else {
      this.pickResult = this.songList[0]
    }
  },
  onUnload() {
    if(this.shuffleTimer) {
      clearInterval(this.shuffleTimer)
      this.shuffleTimer = null
    }
  },
  computed: {
    ...mapState(["songList", "pickList"]),
    isShuffling() {
      return this.shuffleTimer? true: false
    },
  },
  methods: {
    ...mapMutations(["setSongList", "setChosenSong", "setPickList", "addPickSong", "clearPickList"]),
    // 获取jd wiki页面信息
    getJustdanceInfo() {
      // TODO 改为云函数
      uni.showLoading({
        title: '加载中'
      })
      uni.request({
        url: this.webUrl
      }).then(resp => {
        console.log("resp:", resp)
        let $ = cheerio.load(resp[1].data)
        console.log("$:", $)
        let list = $(".wikitable").eq(0).find('tr')
        console.log("list:", list)
        // let list = $("#user-repositories-list li")
        
        for(let i = 2; i < list.length; i++) {
          let tds = list.eq(i).find('td')
          let specialMinus = 0
          i == 2 && console.log("tds:", tds)
          if(tds.length < 8) {
            // 歌曲名本身就是中文的不存在翻译名称，少一列
            specialMinus = 1
          }
          let songItem = {}
          // song
          songItem.songName = tds.eq(0).find('a').text()
          songItem.href = tds.eq(0).find('a').attr("href")
          // artist
          songItem.artist = tds.eq(2 - specialMinus).text().trim()
          // year
          songItem.year = tds.eq(3 - specialMinus).text().trim()
          // mode
          songItem.mode = tds.eq(4 - specialMinus).find('b').text().trim()
          // original game
          songItem.original_game = tds.eq(6 - specialMinus).find("a").text().trim()
          // release date
          songItem.release_date = tds.eq(7 - specialMinus).text().trim()
          // square - image
          let imgEle = tds.eq(5 - specialMinus).find('img')
          let dataSrc = imgEle.attr("data-src") || imgEle.attr("src")
          if(!dataSrc) {
            console.log("no dataSrc at", i, songItem)
            continue
          }
          let posSubfix = dataSrc.indexOf('png')
          if(posSubfix == -1) {
            posSubfix = dataSrc.indexOf('jpg')
            if(posSubfix == -1) {
              console.warn("unmatch image format:", dataSrc)
              continue
            }
          }
          // getUrlBase64(dataSrc.slice(0, posSubfix+3), 'png').then(res => {
          //   songItem.imgSrc = res.replace(/[\r\n]/g, "")
          //   if(songItem.imgSrc.length < 10) {
          //     console.log("res:", res)
          //     console.log(`incorrect imgSrc at ${songItem.songName}: ${songItem.imgSrc}`)
          //   }
          //   this.resultList.push(songItem)
          //   if(this.resultList.length == 1) {
          //     this.pickResult = this.resultList[0]
          //   }
          // }).catch(err => {
          //   console.error("getUrlBase64 err:", err)
          // })
          songItem.imgSrc = dataSrc.slice(0, posSubfix+3)
          this.resultList.push(songItem)
          // if(this.resultList.length == 1) {
          //   this.pickResult = this.resultList[0]
          // }
        }
        console.log("result list:", this.resultList)
        this.setSongList(this.resultList)
        this.pickResult = this.resultList[0]
        uni.hideLoading()
        let imgSrcRequests = this.resultList.map(item => getUrlBase64(item.imgSrc, 'png', this))
        // 并行请求图片资源
        Promise.all(imgSrcRequests).then(res => {
          console.log("ress:", res)
          for(let i = 0; i < res.length; i++) {
            this.resultList[i].imgSrc = res[i]
          }
          this.setSongList(this.resultList)
          // this.pickResult = this.resultList[0]
          // uni.hideLoading()
        })
      })
    },

    // 进行图片轮播
    shuffle() {
      this.shuffleTimer = setInterval(() => {
        let randomIndex = Math.floor(Math.random() * this.songList.length)
        this.pickResult = this.songList[randomIndex]
      }, 100)
    },

    // 选取歌曲
    pickSong(op) {
      if(this.pickList.indexOf(this.pickResult) !== -1) {
        uni.showToast({
          title: '你已经选过该歌曲',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      this.addPickSong(this.pickResult)
      // if(this.pickList.indexOf(this.pickResult) == -1) {
      //   this.pickList.push(this.pickResult)
      // } else {
      //   uni.showToast({
      //     title: '你已经选过该歌曲',
      //     duration: 2000,
      //   })
      // }
      if(op == 'stop') {
        clearInterval(this.shuffleTimer)
        this.shuffleTimer = null
      }
    },

    // 自动化选曲
    autoShuffleAndPick() {
      this.pickMode = 'auto'
      this.shuffle()
      // this.pickList = []
      this.clearPickList()
      let autoPicker = setInterval(() => {
        // if(this.pickList.indexOf(this.pickResult) == -1) {
        //   this.pickList.push(this.pickResult)
        // }
        this.addPickSong(this.pickResult)
        if(this.pickList.length == this.autoPickNum) {
          clearInterval(autoPicker)
          clearInterval(this.shuffleTimer)
          this.shuffleTimer = null
          this.pickMode = 'manual'
        }
      }, 150)
    },

    // 清空已选歌曲
    // clearPickList() {
    //   this.pickList = []
    // },

    gotoDetail(item) {
      this.setChosenSong(item)
      uni.navigateTo({
        url: `/pages/index/songDetail`
      })
    },
  },
  onShareAppMessage() {
    let randomIndex = Math.floor(Math.random() * this.songList.length)
    return {
      title: '平时百无聊赖，不如舞力全开！',
      path: '/pages/index/justdance',
      imageUrl: this.songList[randomIndex].imgSrc || ""
    }
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
.a_i {
  align-items: center;
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
      .img {
        width: 200rpx;
        height: 200rpx;
        margin-top: 20rpx;
        margin-bottom: 40rpx;
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
  .pick_result {
    position: relative;
    z-index: 10;
    margin-top: 40rpx;
    // width: 90%;
    background-color: #fff;
    border-radius: 50rpx 50rpx 0rpx 0rpx;
    box-shadow: 0 -8rpx 10rpx rgba(113, 203, 238, 0.4);
    // transform: translateY(-25rpx);
    .title {
      margin-top: 24rpx;
    }
    .clear {
      cursor: pointer;
      position: absolute;
      top: 32rpx;
      right: 26rpx;
      font-size: 24rpx;
      color: rgb(144, 147, 153);
    }
    .pick_list {
      padding: 25rpx;
      flex-wrap: wrap;
      // justify-content: center;
      gap: 20rpx;
      .pick_item {
        width: 160rpx;
        .img {
          width: 160rpx;
          height: 160rpx;
        }
        .song_name {
          font-size: 30rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
        }
      }
    }
  }
}
#myCanvas {
  position: fixed;
  top: -500rpx;
  left: -500rpx;
}
</style>