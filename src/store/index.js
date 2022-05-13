import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    tabIndex: 0,
    songList: [],
    chosenSong: {},
  },
  mutations: {
    setTabIndex(state, val) {
      state.tabIndex = val
    },
    setSongList(state, val) {
      state.songList = val
    },
    setChosenSong(state, val) {
      state.chosenSong = val
    },
  }
})

export default store