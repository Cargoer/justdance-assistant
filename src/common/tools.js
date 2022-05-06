/**
 * 
 * @param {*} url 图片路径
 * @param {*} ext 图片格式
 * @param {*} callback 回调函数
 */
export function getUrlBase64(url, ext, obj) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    // console.log("mp-weixin still work!")
    uni.request({
      url: url,
      method: 'GET',
      responseType: 'arraybuffer',
      success: async res => {
        resolve('data:image/jpeg;base64,' + wx.arrayBufferToBase64(res.data))
      }
    })
    // #endif

    // #ifndef MP-WEIXIN
    // let canvas = document.createElement("canvas")
    // let canvas = uni.querySeletor("#canvas")
    let canvas = uni.createSelectorQuery().in(obj).select("#myCanvas")
    // let ctx = uni.createCanvasContext("myCanvas", obj)
    let ctx = canvas.getContext('2d')
    let img = new Image
    img.crossOrigin = 'Anonymous'
    img.src = url
    img.onload = function() {
      canvas.height = 200
      canvas.width = 200
      ctx.drawImage(img, 0, 0, 200, 200)
      let dataUrl = canvas.toDataURL("image/" + ext)
      // console.log("dataUrl:", dataUrl)
      // callback.call(this, dataUrl)
      canvas = null
      resolve(dataUrl)
    }
    // #endif
  })
  
}