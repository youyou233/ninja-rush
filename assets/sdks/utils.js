/**
 * @des 工具函数
 */
let isWeChat = (cc.sys.platform == cc.sys.WECHAT_GAME);
var Utils = {
  // 分辨率适配
  setDesignResolution: function () {
    var canvas = cc.find("Canvas").getComponent(cc.Canvas);
    let winSize = cc.director.getWinSize();
    window.winSize = winSize
    if (winSize.width / winSize.height > 9 / 16) {
      canvas.fitWidth = false;
      canvas.fitHeight = true;
    } else {
      canvas.fitWidth = true;
      canvas.fitHeight = false;
    }
  },
  /**
   * @param {Number}min max随机数范围
   */
  random(min, max) {
    return min + Math.floor(Math.random() * (max - min));
  },
  /**
   * @des 获取两个点的夹角
   */
  getAngle(x1, y1, x2, y2) {
    // 直角的边长
    var x = Math.abs(x1 - x2);
    var y = Math.abs(y1 - y2);
    // 斜边长
    var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    // 余弦
    var cos = y / z;
    // 弧度
    var radina = Math.acos(cos);
    // 角度
    var angle = 180 / (Math.PI / radina);
    return angle;
  },
  
}
export default Utils;