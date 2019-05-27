/**
 * @des 处理公用动作函数
 */
var Action = {
  // 设置回调
  addCallback(actions, callback) {
    return cc.sequence(actions, cc.callFunc(() => {
      callback
    }))
  },
  // 渐入
  fadeInAction(node, time, callback) {
    time = time ? time : 1
    node.opacity = 0
    let action = cc.fadeIn(time)
    if (callback) {
      return action
    } else {
      return this.addCallback(action, callback)
    }
  },
  // 震动动作 0.1效果比较好
  shackAction(time, range, callback) {
    time = time ? time : 0.1
    range = range ? range : 20
    let action1 = cc.moveBy(time, range, range)
    let action2 = cc.moveBy(time, -range, -range)
    let action3 = cc.moveBy(time * 0.8, range * 0.8, range * 0.8)
    let action4 = cc.moveBy(time * 0.8, -range * 0.8, -range * 0.8)
    let action5 = cc.moveBy(time * 0.6, range * 0.6, range * 0.6)
    let action6 = cc.moveBy(time * 0.6, -range * 0.6, -range * 0.6)
    let action7 = cc.moveBy(time * 0.4, range * 0.4, range * 0.4)
    let action8 = cc.moveBy(time * 0.4, -range * 0.4, -range * 0.4)
    let action9 = cc.moveBy(time * 0.2, range * 0.2, range * 0.2)
    let action10 = cc.moveBy(time * 0.2, -range * 0.2, -range * 0.2)
    let sq = cc.sequence(action1, action2, action3, action4, action5, action6, action7, action8, action9, action10)
    if (callback) {
      return sq
    } else {
      return this.addCallback(sq, callback)
    }
  },
  // 晃动动作
  rockAction(time, range, callback) {
    time = time ? time : 0.1
    range = range ? range : 20
    let action1 = cc.rotateBy(time, range, range)
    let action2 = cc.rotateBy(time, -2 * range, -2 * range)
    let action3 = cc.rotateBy(time * 0.8, 2 * range * 0.8, 2 * range * 0.8)
    let action6 = cc.rotateBy(time * 0.6, -2 * range * 0.6, -2 * range * 0.6)
    let action7 = cc.rotateBy(time * 0.4, 2 * range * 0.4, 2 * range * 0.4)
    let action10 = cc.rotateTo(time * 0.2, 0, 0)
    let sq = cc.sequence(action1, action2, action3, action6, action7, action10)
    if (callback) {
      return sq
    } else {
      return this.addCallback(sq, callback)
    }
  },
  // 弹出效果
  popOut(time, callFunc) {
    time = time ? time : 0.5
    let action = cc.scaleTo(time, 1).easing(cc.easeBackOut(2.0))
    return callFunc ? this.addCallback(action, callFunc) : action
  },
  // 收入效果
  popIn(time, callFunc) {
    time = time ? time : 0.5
    let action = cc.scaleTo(time, 0).easing(cc.easeBackIn(2.0))
    return callFunc ? this.addCallback(action, callFunc) : action
  },
  /**
   * 打字机效果
   * @param {*} label  传入组件
   * @param {*} text  传入文字
   * @param {*} cb callback
   */
  typingAni(label, text, cb) {
    var self = this;
    var html = '';
    var arr = text.split('');
    var len = arr.length;
    var step = 0;
    self.func = function () {
      html += arr[step];
      label.string = html;
      if (++step == len) {
        self.unschedule(self.func, self);
        cb();
      }
    }
    self.schedule(self.func, 0.05, cc.macro.REPEAT_FOREVER, 0)
  },
}
export default Action;