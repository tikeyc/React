import $ from 'jquery'

/*
*@function swipleftRight 屏幕左右滑动
*/
const HorizontalScroller = function (config) {
  this.config = $.extend({}, this.defaultOption, config)
  this.init()
}

HorizontalScroller.prototype = {
  defaultOption: {
    touchEle: $(".slide"),
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    distanceX: 0,
    distanceY: 0,
    lenArr: [],
    isMoveLen: 0,
    isMoved: false,
    colWidth: $(window).width() / 3
  },
  init: function () {
    this.onEvent()
  },
  onEvent: function () {
    var _this = this
    var $touch = _this.config.touchEle
    $touch.on("touchstart", function (e) {
      _this.tStart(e.originalEvent)
    })
    $touch.on("touchmove", function (e) {
      _this.tMove(e.originalEvent)
    })
    $touch.on("touchend", function (e) {
      _this.tEnd(e.originalEvent)
    })
  },
  tStart: function (e) {
    var _this = this
    var param = _this.config
    param.startY = _this.getPos(e).posY
    param.startX = _this.getPos(e).posX
    param.isMoved = false
  },
  tMove: function (e) {
    var _this = this
    var param = _this.config
    var $table = param.touchEle.find(".row")
    if ($table.width() < param.colWidth * 2) {
      return false
    }
    param.endX = _this.getPos(e).posX
    param.endY = _this.getPos(e).posY

    param.distanceY = param.endY - param.startY
    param.distanceX = param.endX - param.startX

    if ((Math.abs(param.distanceY) - Math.abs(param.distanceX)) < 5) {
      param.isMoved = true
      _this.moveTo(param.distanceX)
      e.preventDefault()
    }
  },
  tEnd: function (e) {
    var _this = this
    var param = _this.config
    if (param.isMoved) {
      param.isMoveLen = param.lenArr[param.lenArr.length - 1]
      param.lenArr.length = 0
    }
  },
  moveTo: function (dis, direct) {
    var _this = this
    var param = _this.config
    if (!direct) {
      if (param.isMoveLen != 0) {
        dis = dis + param.isMoveLen
      }
      var $table = param.touchEle.find(".row")
      if ($table.width() < param.colWidth * 2) {
        return false
      }
      if (dis < 0 && dis <= -($table.width() - param.colWidth * 2)) {
        dis = -($table.width() - param.colWidth * 2)
      } else if (dis >= 0) {
        dis = 0
      }
    }
    param.lenArr.push(dis)
    param.touchEle.css('-webkit-transform', 'translate3d(' + dis + 'px,0,0)')
  },
  getPos: function (e) {
    return {
      posX: e.changedTouches[0].clientX,
      posY: e.changedTouches[0].clientY
    }
  }
}

export default HorizontalScroller
