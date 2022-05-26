Page({
  data:{
    userInfo: {
      nickname: '',
      avatar: ''
    }
  },
  doGetUserData () {
    wx.getUserProfile({
      desc: '申请获取你的个人资料',
      success: ({ userInfo }) => {
        this.setData({
          userInfo: { nickname: userInfo.nickName, avatar: userInfo.avatarUrl }
        })
      },
      fail: () => wx.showToast({ title: '获取失败', icon: 'error' })
    })
  }
})