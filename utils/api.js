// API DOMAIN
// JSON 文件见 mock 文件夹
// const DOMAIN = 'http://localhost:8080/mock'
const DOMAIN = 'https://h5.ahmq.net/demo/miniapp-static-api/mock'

export function get (url, data){
  return request(url, 'GET', data)
}

export function post (url, data){
  return request(url, 'POST', data)
}

// 获取全部分类列表
export async function getCategroyList () {
  const categorys = await get('api-category-list.json')
  const subscribeList = await getSubscribeList()
  const maped = Array.isArray(subscribeList) ? subscribeList.reduce((prev, k) => {
    prev[k] = true
    return prev
  }, {}) : null
  return categorys.map(category => {
    // 未设置过关注
    category.selected = maped ? (!!maped[category.id]) : true
    return category
  })
}

const $SubscribeListCacheKey = '$SubscribeList'
// 读取关注列表
export function getSubscribeList () {
  return new Promise(resolve => {
    wx.getStorage({
      key: $SubscribeListCacheKey,
      success: e => resolve(e.data),
      fail: () => resolve(null)
    })
  })
}

// 保存关注列表
export function saveSubscribeList (subscribeList) {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key: $SubscribeListCacheKey,
      data: subscribeList,
      success: resolve,
      fail: e => reject(new Error(e.errMsg))
    })
  })
}

// 加载轮播图
export async function getHomeBannerList () {
  return await get('api-banners.json')
}

// 根据分类和页码加载数据：模拟的数据重新打乱
export async function getNewsByCategory (categoryId, pageId = 1) {
  const data = await get(`api-news-list.json`, { categoryId, pageId })
  return data.sort((a, b) => 0.5 - Math.random())
}

// 订阅频道列表
export async function getSubscribeChannels () {
  return await get('api-subscibe-list.json')
}

// 获取文章详情
export async function getArticleDetail (articleId) {
  return await get('api-news-detail.json', { articleId })
}

export function request(api, method, data = {}){
  wx.showNavigationBarLoading()
  return new Promise((resove, reject) => {
    wx.request({
      url: `${DOMAIN}/${api}`,
      data: data,
      method: method,
      dataType: 'json',
      success: function(res){
        wx.hideNavigationBarLoading()
        const data = res.data
        if (data.code) {
          reject(new Error(data.message))
        } else {
          resove(data.data)
        }
      },
      fail: function(err) {
        wx.hideNavigationBarLoading()
        reject(new Error(err.errMsg))
      }
    })
  })
}
