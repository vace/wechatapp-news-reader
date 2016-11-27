//app.js
const utils = require('./utils/util.js')

App({
    onLaunch: function() {

    },

    getUserInfo(){
      return new utils.Promise((resolve,reject) => {
        if(this.globalData.userInfo){
          resolve(this.globalData.userInfo)
        }
        return utils.getUserInfo().then(res => {
          resolve(this.globalData.userInfo = res.userInfo)
        })
      })
    },
  globalData:{
    userInfo:null,
    categoryChanged:true
  },

  cacheSubscibe:[],

  utils
})