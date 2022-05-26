Page({
  data:{
    icons: Array.from({ length: 16 }, (_, i) => i),
    animationData: null
  },

  onShow:function(){
    const animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
        delay:200
    })
    animation.opacity(1).backgroundColor('#fff').step()
    this.setData({ animationData: animation.export() })
  },

  // TODO
  keepDevelop(){
    wx.showModal({
        title:'此功能无法开发',
        content:'小程序目前不能跳转外链，此应用属于外链，页面无法打开！',
        confirmText:'我晓得了',
        confirmColor:'#d81e06',
        showCancel:false,
    })
  }
})