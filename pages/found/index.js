var util = require('../../utils/util.js')



Page({
  data:{
    icons:util.makeArray(16),
    animationData:null
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var animation

    animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
        delay:200
    })

    animation.opacity(1).backgroundColor('#fff').step()

    this.setData({
      animationData:animation.export()
    })

  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },


  keepDevelop(){
    wx.showModal({
        title:'此功能无法开发',
        content:'小程序目前不能跳转外链，此应用属于外链，页面无法打开！',
        confirmText:'我晓得了',
        confirmColor:'#d81e06',
        showCancel:false,
        success(){
            
        }
    })
  }
})