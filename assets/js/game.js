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
    levelData: cc.JsonAsset,
    characterPrefab: cc.Prefab,
    characterConfig: cc.JsonAsset,
  },
  // ------------- 生命周期和触摸事件 ------------------
  level: 0,
  progress: 0,
  onLoad() {
    var manager = cc.director.getCollisionManager();
    manager.enabled = true;
    let canvas = cc.director.getScene().getChildByName('Canvas')
    utils.setDesignResolution()
    canvas.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
    canvas.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    canvas.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
  },
  loadRes() {
    
  },
  init() {

  },
  start() {
    this.config = this.config.json
    this.PD = playerData.loadData() //获取存档数据
    console.log(this.PD)
    this.level = this.PD.level
    this.showStartPage()
  },
  _onTouchBegin(event) {
    if (this.playerStatus == 2 && this.status == 1) {
      this.playerGetBigger = true
    }
  },
  _onTouchEnd(event) {
    if (this.playerGetBigger == true && this.status == 1) {
      this.playerGetBigger = false
      this.playerStatus = 1
    }
  },

  _onTouchCancel(event) {},
  playerStatus: 0, //0 无操作状态  1 冲刺状态 2 返回状态 3失败反弹
  update() {
    if (this.status == 1 || this.status == 2) {
      switch (this.playerStatus) {
        case 0:
          break;
        case 1:
          this.playerRush()
          break;
        case 2:
          this.playerBack()
          break;
        case 3:
          this.failRebound()
          break
      }
    }
  },

  onPlayerCollision(other, self) {
    if (this.playerStatus = 2) {
      switch (other.node.group) {
        case 'target':
          if (this.checkIsBig(this.player, other.node)) {
            this.successPunch()
          } else {
            this.gameOver()
          }
          break
        case 'gap':
          this.gameOver()
          break
      }
    }
  },

  checkSkill() {
    // 用于判断人物角色技能
  },
  checkAkt() {
    // 用于制作怪物血量
  },
  // -------------- UI动态渲染 ----------------
  showCharacter() {
    let characterData = this.characterConfig.json
    characterData.map((item, index) => {
      let character = cc.instantiate(this.characterPrefab)
      character.getComponent('character').init(this, item)
    })
  },
  //动态切换角色
  switchCharacter(num) {

  },
  // -------------- 游戏进程 -------------------
  gameStart() {
    this.status = 1
    this.playerStatus = 2
    this.initGameLevel()
    this.operateDialog(0, 0)
  },
  gameRestart() {
    if (this.status = 2) {
      this.status = 1
      this.operateDialog(2, 0)
      this.init()
      this.gameStart()
    }
  },
  initGameLevel() {
    this.progress = 1
    this.initTarget(this.levelData.json[this.level - 1].progress[this.progress - 1])
    this.initGamePos()
  },
  progressUp() {
    // 每个关卡的进程
    console.log(this.level, this.progress)
    if (this.progress == this.levelData.json[this.level - 1].progress.length) {
      this.onLevelSuccess()
      return
    }
    this.progress++
    this.initTarget(this.levelData.json[this.level - 1].progress[this.progress - 1])
    this.initGamePos()
  },
  onLevelSuccess() {
    this.operateDialog(4, 1)
  },
  initTarget(type) {
    this.target.width = this.target.height = 100 * (Math.random() * 1.5 + 0.5)
    this.gapWeight = 100 * (Math.random() * 1.5 + 0.005 * (100 - this.level - this.progress)) + this.target.width
  },
  levelUp() {
    this.operateDialog(4, 0)
    this.level++
    this.gameStart()
  },
  initGamePos() {
    let targetAction = cc.moveTo(0.4, 0, window.winSize.height / 2 - this.config.targetOriginPos)
    this.target.runAction(targetAction)
    let action1 = cc.moveBy(0.3, 0, -300)
    let action2 = cc.fadeOut(0.3)
    let action3 = cc.moveTo(0.3, 0, window.winSize.height / 2 - this.config.gapOriginPos)
    let action4 = cc.fadeIn(0.3)
    let gapAction = cc.sequence(cc.spawn(action1, action2), cc.callFunc(() => {
      this.gap.getChildByName('left').x = -window.winSize.width - this.gap.getChildByName('left').width / 2
      this.gap.getChildByName('right').x = +window.winSize.width + this.gap.getChildByName('right').width / 2
      this.gap.y = window.winSize.height + this.gap.height
      let actionLeft = cc.moveTo(0.3, -this.gapWeight / 2, 0)
      let actionRight = cc.moveTo(0.3, this.gapWeight / 2, 0)
      this.gap.getChildByName('left').runAction(actionLeft)
      this.gap.getChildByName('right').runAction(actionRight)
    }), cc.spawn(action3, action4))
    this.gap.runAction(gapAction)
  },
  gameOver() {
    if (this.status == 1) {
      this.status = 2
      this.playerStatus = 3
      this.operateDialog(2, 1)
    }
  },

  successPunch() {
    this.playerStatus = 2
    let action = cc.moveBy(0.1, 0, window.winSize.height / 2 + this.target.height)
    let sq = cc.sequence(action, cc.callFunc(() => {
      this.progressUp()
    }))
    this.target.runAction(sq)
  },
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
  openDialogBtn(e, d) {
    console.log(+d)
    this.operateDialog(+d, 1)
  },
  closeDialogBtn(e, d) {
    console.log(+d)
    this.operateDialog(+d, 0)
  },
  showStartPage() {
    this.closeAllDialogs(0)
    this.operateDialog(0, 1)
  },
  closeAllDialogs(num) {
    for (let i = 0; i < this.dialogs.length; i++) {
      if (num == i || i == 1) continue
      this.operateDialog(i, 0)
    }
  },
  //--------------- 实现方放 -----------------
  playerRush() {
    this.player.y += 20 * (this.player.scale - 1) * 0.5 + 40
  },
  playerBack() {
    if (this.playerGetBigger) {
      this.player.scale = this.player.scale > this.config.maxScale ? this.config.maxScale : this.player.scale + 0.05 * this.config.increaseMultiple
    } else {
      this.player.scale = this.player.scale < 1 ? 1 : this.player.scale - 0.05 * this.config.reduceMultiple
    }
    if (this.player.y > -window.winSize.height / 2 + this.config.targetOriginPos) {
      this.player.y -= (this.player.y + window.winSize.height / 2 - this.config.playerOriginPos) / 50
    } else {
      this.player.y = -window.winSize.height / 2 + this.config.targetOriginPos
    }
  },
  failRebound() {
    if (this.player.y > -window.winSize.height / 2 + this.config.targetOriginPos) {
      this.player.y -= (this.player.y + window.winSize.height / 2 - this.config.playerOriginPos) / 100
    } else {
      this.player.y = -window.winSize.height / 2 + this.config.playerOriginPos
    }
  },
  checkIsBig(frist, last) {
    return frist.width * frist.scale > last.width * last.scale
  },
});