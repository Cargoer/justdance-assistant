<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			wx.onMemoryWarning((res) => {
				console.log("onMemoryWarning level:", res)
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
  .fr {
    display: flex;
    align-items: center;
  }
</style>
