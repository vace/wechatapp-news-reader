const $vm = getApp()
const {parseNews} = $vm.utils
Page({
  data:{
    text:"Page subscibe",
    goodDingList:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.getDingGoods()
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
  },

  getDingGoods(){
    // 已经存在订阅
    if(this.data.goodDingList.length){
      return false
    }
    $vm.utils.get('v2/ding/good.html').then(res => {
      var goodDingList = res.dingList.map(ding => {
        var {ding_id:id,ding_name:name,ding_pic:headimg,ding_remark:remark,ding_news:news_old} = ding
        var news = parseNews(news_old || [])
        return {id,name,headimg,remark,news}
      })
      $vm.cacheSubscibe = goodDingList
      this.setData({goodDingList})
    })
  }
})