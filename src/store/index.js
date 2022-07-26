import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    tabIndex: 0,
    songList: [],
    pickList: [],
    chosenSong: {},
    justdanceVersion: '国行版',
  },
  mutations: {
    setTabIndex(state, val) {
      state.tabIndex = val
    },
    setSongList(state, val) {
      state.songList = val
    },
    setPickList(state, val) {
      state.pickList = val
    },
    addPickSong(state, val) {
      if(state.pickList.indexOf(val) == -1) {
        state.pickList.push(val)
      }
    },
    clearPickList(state) {
      state.pickList = []
    },
    removePickSong(state, song) {
      let songIndex = state.pickList.indexOf(song)
      if(songIndex !== -1) {
        state.pickList.splice(songIndex, 1)
      }
    },
    setChosenSong(state, val) {
      state.chosenSong = val
    },
    setJustdanceVersion(state, val) {
      state.justdanceVersion = val
    },
  }
})

export default store