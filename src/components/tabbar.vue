<template>
  <view class="tabbar_wrapper fr">
    <view 
      v-for="(item, index) in tabbarList"
      :key="index"
      :class="['tabbar_item', {'active': tabIndex === item.index}]"
      @click="changeTabbar(item.index)"
    >
      {{ item.name }}
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex"
export default {
  data() {
    return {
      tabbarList: [
        {
          index: 0,
          name: '选曲',
        },
        {
          index: 1,
          name: '搜索',
        }
      ]
    }
  },
  created() {
    console.log("tabIndex:", this.tabIndex)
  },
  computed: {
    ...mapState(["tabIndex"]),
  },
  methods: {
    ...mapMutations(["setTabIndex"]),
    changeTabbar(index) {
      if(index === this.tabIndex) {
        return
      }
      this.setTabIndex(index)
      if(index === 0) {
        uni.reLaunch({
          url: '/pages/index/justdance'
        })
      } else if(index === 1) {
        uni.reLaunch({
          url: '/pages/search/index'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fr {
  display: flex;
  align-items: center;
}
.tabbar_wrapper {
  height: 100rpx;
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 99;
  justify-content: space-around;
  background-color: rgb(102, 177, 255);
  color: #fff;
  .tabbar_item {
    &.active {
      transform: scale(1.2);
    }
  }
}
</style>