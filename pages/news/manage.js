/**
 * 用户自定义需要显示的分类
 */

const { getCategroyList, saveSubscribeList } = require("../../utils/api")

Page({
    data:{
        categoryList: []
    },
    onLoad (){
        getCategroyList().then(categoryList => this.setData({ categoryList }))
    },

    // 添加关注
    addSubscribe (event) {
        this.subscribeAction('add', event.target.dataset.id)
    },
    delSubscribe (event) {
        const count = this.data.categoryList.filter(c => c.selected).length
        if (count <= 1) {
            return wx.showToast({ title: '请至少保留一个频道', icon: 'error' })
        }
        this.subscribeAction('del', event.target.dataset.id)
    },

    // 关注全部
    subscribeAll () {
        this.subscribeAction('all')
    },

    subscribeAction (command, id) {
        const categoryList = this.data.categoryList.slice(0)
        if (command === 'all') {
            categoryList.forEach(item => item.selected = true)
        } else if (command === 'add') {
            categoryList.find(item => item.id === id).selected = true
        } else if (command === 'del') {
            categoryList.find(item => item.id === id).selected = false
        } else {
            throw new Error('未知操作：' + command)
        }
        this.setData({ categoryList })
        const subscribeList = categoryList.filter(c => c.selected).map(c => c.id)
        saveSubscribeList(subscribeList)
    },

    onBackHome(){
        wx.navigateBack()
    },
})