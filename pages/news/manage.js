/**
 * 用户自定义需要显示的分类
 */

const $vm = getApp()
const util = $vm.utils

Page({
    data:{
        categorys:[]
    },
    onReady(){
        wx.setNavigationBarTitle({title:'设置关注分类'})
        // 本地数据
        this._getCategorys()
    },

    deleteCategory(event){
        this._setCategorySelected(event,false)
    },

    addCategory(event){
        this._setCategorySelected(event,true)
    },
    selectAll(){
        wx.setStorageSync('USER_COLLECT',[])
        $vm.globalData.categoryChanged = true
        this._getCategorys()
    },
    returnIndex(){
        wx.navigateBack()
    },
    _getCategorys(){
        util.getCategorys().then(res => this.setData({
            categorys:res
        }))
    },
    _setCategorySelected(event,isSelect){
        var key =  event.target.dataset.key
        var idx = `categorys[${key}].selected`

        // 其中头条为必选项
        if(parseInt(key,10) === 0){
            wx.showToast({title:'头条不可删除',duration:2000})
            return false
        }

        this.setData({ [idx] : isSelect })
        // 保存我的喜欢
        var likedArr = []
        this.data.categorys.forEach(function(category){
            if(category.selected){
                likedArr.push({
                    id:category.lanmu_id,
                    sort:0
                })
            }
        })
        $vm.globalData.categoryChanged = true
        wx.setStorageSync('USER_COLLECT',likedArr)
    }
})