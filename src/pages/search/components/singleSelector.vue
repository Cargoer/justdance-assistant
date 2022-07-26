<template>
  <view class="single_selector_wrap fr">
    <view class="label">{{ label }}</view>
    <view class="select_area" @click="showSelectList = !showSelectList">
      <view class="single_select_value">{{ selectList[selectedIndex] }}</view>
      <view class="select_list" v-if="showSelectList">
        <view 
          class="select_item" 
          v-for="(item, index) in selectList" 
          :key="index"
          @click.stop="selectItem(index)"
        >
          {{ item }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "单选",
    },
    selectList: {
      type: Array,
      default: ['全部'],
    },
  },
  data() {
    return {
      selectedIndex: 0,
      showSelectList: false,
    }
  },
  methods: {
    selectItem(index) {
      this.selectedIndex = index
      this.showSelectList = false
      const mapLabel = {
        '模式': 'mode'
      }
      let attribute = mapLabel[this.label]
      let value = this.selectList[this.selectedIndex]
      
      if(attribute === 'mode') {
        const mapMode = {
          '全部': 'All',
          '单人': 'Solo',
          '双人': 'Duet',
          '三人': 'Trio',
          '四人': 'Quartet',
        }
        value = mapMode[value]
      }
      console.log("selectItem", index)
      this.$emit('select', {
        attribute,
        value
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.single_selector_wrap {
  height: 100rpx;
  .label {
    margin-right: 15rpx;
  }
  .select_area {
    z-index: 999;
    position: relative;
    min-width: 150rpx;
    .single_select_value {
      border-radius: 10rpx;
      padding-left: 10rpx;
      background-color: #ccc;
    }
    .select_list {
      position: absolute;
      top: 100%;
      left: 0;
      border-radius: 10rpx;
      background-color: #ccc;
      .select_item {
        width: 150rpx;
        padding-left: 10rpx;
        height: 80rpx;
        line-height: 80rpx;
        // background-color: #ccc;
      }
    }
  }
}
</style>