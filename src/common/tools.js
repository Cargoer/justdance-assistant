/**
 * 
 * @param {*} url 图片路径
 * @param {*} ext 图片格式
 * @param {*} callback 回调函数
 */
export function getUrlBase64(url, ext) {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery();
    query.select("#myCanvas").fields({
      node: true, // 获取 node
    }).exec(res => {

      let {
        node: canvas
      } = res[0];

      let ctx = canvas.getContext('2d');
      let image = canvas.createImage();

      // console.log(image);
      image.src = url;
      image.onload = () => {
        ctx.drawImage(image, 0, 0, 200, 200);
        resolve(canvas.toDataURL())
      }
    });

    // let canvas = wx.createSelectorQuery().select('#myCanvas')
    // let ctx = canvas.getContext('2d')
    // let img = new Image
    // img.crossOrigin = 'Anonymous'
    // img.src = url
    // img.onload = function() {
    //   canvas.height = 200
    //   canvas.width = 200
    //   ctx.drawImage(img, 0, 0, 200, 200)
    //   let dataUrl = canvas.toDataURL("image/" + ext)
    //   // console.log("dataUrl:", dataUrl)
    //   // callback.call(this, dataUrl)
    //   canvas = null
    //   resolve(dataUrl)
    // }
  })
  
}