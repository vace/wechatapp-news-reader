const { getSubscribeChannels, getNewsByCategory } = require("../../utils/api")

Page({
    data: {
        channelId: 0,
        channel: {},
        articles: []
    },
    onShow(){
        
    },
    onLoad: function({ channel }) {
        this.setData({ channelId: channel })
        this.getChannelInfo()
        this.getNewsInfo()
    },

    async getChannelInfo () {
        const { channelId } = this.data
        const channels = await getSubscribeChannels()
        const channel = channels.find(c => c.id == channelId)
        this.setData({ channel })
        wx.setNavigationBarTitle({ title: channel.name, })
    },

    async getNewsInfo () {
        const articles = await getNewsByCategory(this.data.channelId, 1)
        this.setData({ articles })
    }
})