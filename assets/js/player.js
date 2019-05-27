
cc.Class({
    extends: cc.Component,

    properties: {
      controller:require('game')
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    onCollisionEnter: function (other, self) {
      this.controller.onPlayerCollision(other, self)
    }
    // update (dt) {},
});
