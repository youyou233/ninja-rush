var utils = require('utils.js')
var AC = require('action.js')
var playerData = require('playerData.js')
cc.Class({
  extends: cc.Component,

  properties: {
    status: 0, //0未开始游戏 1游戏开始 2游戏结束
    dialogs: [cc.Node], //0 开始页面 1失败页面 2指导页面
    player: cc.Node,
    target: cc.Node,
    gap: cc.Node,
    config: cc.JsonAsset,
  },
  // ------------- 生命周期和触摸事件 ------------------
  onLoad() {
    let canvas = cc.director.getScene().getChildByName('Canvas')
    utils.setDesignResolution()
    canvas.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
    canvas.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    canvas.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
  },
  start() {
    this.config = this.config.json
    this.PD = playerData.loadData() //获取存档数据
    console.log(this.PD)
    this.showStartPage()
  },
  _onTouchBegin(event) {
    if (this.playerStatus == 2) {
      this.playerGetBigger = true
    }
  },
  _onTouchEnd(event) {
    if (this.playerGetBigger == true) {
      this.playerGetBigger = false
      this.playerStatus = 1
    }
  },
  _onTouchCancel(event) {},
  playerStatus: 0, //0 无操作状态  1 冲刺状态 2 返回状态
  update() {
    switch (this.playerStatus) {
      case 0:
        break;
      case 1:
        this.playerRush()
        break;
      case 2:
        this.playerBack()
        break;
    }
  },
  playerRush() {
    this.player.y += 10
  },
  playerBack() {
    if (this.playerGetBigger) {
      this.player.scale = this.player.scale > this.config.maxScale ? this.config.maxScale : this.player.scale + 0.05 * this.config.increaseMultiple
    } else {
      this.player.scale = this.player.scale < 1 ? 1 : this.player.scale - 0.05 * this.config.reduceMultiple
    }
    if (this.player.y > -window.winSize.height / 2 + this.config.targetOriginPos) {
      this.player.y -= (this.player.y + window.winSize.height / 2 + this.config.targetOriginPos) / 500
    } else {
      this.player.y = -window.winSize.height / 2 + this.config.targetOriginPos
    }

  },
  // -------------- 游戏进程 -------------------


  // -------------- 页面更换 -------------------
  /**
   * 操作弹框
   * @param {*} target 传Node则直接操作Node 传数字则去dialogs中取对应的
   * @param {*} operation 操作方式 1打开 0关闭
   */
  operateDialog(target, operation) {
    let action = ''
    if (typeof (target) == 'number') {
      target = this.dialogs[target]
    }
    if (operation) {
      target.scale = 0.5
      target.active = true
      action = AC.popOut(0.5)
    } else {
      action = AC.popIn(0.5)
    }
    target.runAction(action)
  },
  showStartPage() {
    this.closeAllDialogs(0)
    this.operateDialog(0, 1)
  },
  closeAllDialogs(num) {
    for (let i = 0; i < this.dialogs.length; i++) {
      if (num == i) break
      this.operateDialog(i, 0)
    }
  }
});