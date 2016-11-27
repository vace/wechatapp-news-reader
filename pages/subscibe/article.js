//index.js
//获取应用实例
const $vm = getApp()

const cache = Object.create(null)

const {decodeHtml,parseNews} = $vm.utils


Page({
    _isLoading:false,
    data: {
        articles:[],
        categoryTabs:[],
        currentTab:0,
        author:{}
    },
    onShow(){
        if($vm.globalData.categoryChanged){
            $vm.utils.getCategorys().then(res => this.setData({
                categoryTabs:res
            }))
            $vm.globalData.categoryChanged = false
        }
    },
    onReady(){
        wx.setNavigationBarTitle({
            title: this.data.author.name
        })
    },
    onLoad: function(options) {
        let chid = options.chid

        var author = $vm.cacheSubscibe.find(subs => subs.id == chid)
        // console.log(author)
        this.setData({
            author:author,
            currentTab:chid
        })

        this.getNewsList(options.chid)
    },

    // 页面相关事件处理函数--监听用户下拉动作，下拉刷新
    onPullDownRefresh(){
        // 刷新页面，清空当前的缓存，重新获取
        var chid = this.data.currentTab
        // 命中缓存
        if(cache[chid]){
            cache[chid] = {slides:[],news:[],page:0,time:Date.now()}
        }
        this.getNewsList(chid)
    },
    // 到达底部，重新加载
    onReachBottom(){
        this.getNewsList(this.data.currentTab,1)
    },
    // 切换当前选择的分类
    changeCategory(event){
        var chid = event.target.dataset.id
        // 获取ccurrentTab.没有切换分类
        if(this.data.currentTab === chid){
            return false
        }
        this.setData({ currentTab:chid })
        this.getNewsList(chid,0)
    },
    getNewsList(chid = 0,page = 0){
        
        if(!cache[chid]){
            // 新内容
            cache[chid] = {slides:[],news:[],page:0,time:Date.now()}
        }
        var infos = cache[chid]
        // 获取下一页数据
        if(page){
            // 加载中。无法触发
            if(this._isLoading){
                return false;
            }
            infos.page += 1
        }else{
            // 直接从缓存中取出
            if(infos.news.length){
                this.setData({
                    swiperList:infos.slides,
                    articles:infos.news
                })
                return false
            }
        }

        

        this._isLoading = true
        
        $vm.utils.post('v2/news/list.html',{chid:chid,page:infos.page}).then(res => {
            this._isLoading = false

            var {code,newsList,newsBanner} = res
            if(code === 0){
                // 新闻管理
                // style 3下面三张图，1,下面一张大图，2.普通模式，0.无图模式
                if(newsList && newsList.length){
                    // infos.news = []
                    var datas = parseNews(newsList)
                    infos.news.push(...datas)
                }
                // 轮播管理
                if(newsBanner && newsBanner.length){
                    // infos.slides = []
                    var banners = newsBanner.map(news => {
                        return {
                            id:news.news_id,
                            title:news.news_title,
                            image:news.news_icon.pop(),
                            style:news.news_style
                        }
                    })
                    infos.slides.push(...banners)
                }
                this.setData({
                    swiperList:infos.slides,
                    articles:infos.news
                })
            }
            
        }).catch(err =>console.log(err))

    }
})