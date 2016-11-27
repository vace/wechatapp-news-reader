var $vm = getApp()

Page({
  data:{
    text:"Page user",
    userInfo: {}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
  	//调用应用实例的方法获取全局数据
    $vm.getUserInfo().then(user => this.setData({userInfo:user})).catch(console.log)
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})