const Promise = require('./Promise')

const REGX_HTML_DECODE = /&\w{1,};|&#\d{1,};/g;
const HTML_DECODE = {
        "&lt;"  : "<", 
        "&gt;"  : ">", 
        "&amp;" : "&", 
        "&nbsp;": " ", 
        "&quot;": "\"", 
        "&copy;": "©"
   };


function login(){
  return new Promise((resolve,reject) => wx.login({
    success:resolve,
    fail:reject
  }))
}

function getUserInfo(){
  return login().then(res => new Promise((resolve,reject) => 
    wx.getUserInfo({
      success:resolve,
      fail:reject
    })
  ))
}

function decodeHtml(str){
  return (typeof str != "string") ? str :
    str.replace(REGX_HTML_DECODE,function($0){
      var c  = HTML_DECODE[$0]
      if(c === undefined){
          var m = $0.match(/\d{1,}/);
          if(m){
              var cc = m[0];
              cc = (cc === 0xA0) ? 0x20 : cc;
              c = String.fromCharCode(cc);
          }else{
              c = $0;
          }
      }
      return c;
    }) 
}

function makeArray(num,val){
  var arr = []
  for(var i = 0; i < num ; i++){
    arr.push(typeof val !== 'undefined' ? val : i)
  }
  return arr
}

const categorysJson = require('./categorys')
function getCategorys(){
  return new Promise((resolve,reject) => {
    // [{id:1,order:2...}]
    var liked = wx.getStorageSync('USER_COLLECT') || [];
    var categorys = categorysJson.data

    categorys.forEach(category => {
      if(!liked.length){
        category.selected = true
      }else{
        category.selected = false
        liked.forEach(like => 
          category.lanmu_id === like.id && (category.selected = true)
        )
      }
    })

    resolve(categorys)
  })
}


function requstGet(url,data){
  return requst(url,'GET',data)
}

function requstPost(url,data){
  return requst(url,'POST',data)
}

const DOMAIN = 'http://wx.diggid.cn/coverHttps.php'

// 小程序上线需要https，这里使用服务器端脚本转发请求为https
function requst(url,method,data = {}){
  wx.showNavigationBarLoading()
  var rewriteUrl = encodeURIComponent(url)
  data.method = method
  return new Promise((resove,reject) => {
    wx.request({
      url: DOMAIN + '?url=' + rewriteUrl,
      data: data,
      header: {},
      method: method.toUpperCase(), // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function(res){
        wx.hideNavigationBarLoading()
        resove(res.data)
      },
      fail: function(msg) {
        console.log('reqest error',msg)
        wx.hideNavigationBarLoading()
        reject('fail')
      }
    })
  })
}


function parseNews(newsList){
  return newsList.map(news => {
      var {news_id:id,news_title,news_date:date,news_datetime,news_praise_count:parise,news_comment_count:commont,news_summary:summary,news_icon:icons,news_remark:tag,news_style:style,news_column_id:chid} = news
        if(style === 4){
            style = 1
            tag = 'H5'
        }
        if(parise > 99){
          parise = '99+'
        }
        if(commont > 99){
          commont = '99+'
        }
        return { id,chid,title:decodeHtml(news_title),date:date||news_datetime,parise,commont,summary,icons,style,tag }
  })
}



module.exports = {
  makeArray,getCategorys,getUserInfo,Promise,
  get:requstGet,post:requstPost,requst,decodeHtml,parseNews
}
