const { getArticleDetail, getNewsByCategory } = require("../../utils/api")

Page({
    data:{
        article:{},
        tagStyle: {
            img: "display: block; width: 100%; height: auto;",
            h2: "margin: 10px 0",
        },
        relations: []
    },
    onLoad:function({ id }){
        this.refreshArticle(id)
        this.refreshRelationArticles()
    },
    async refreshArticle (id) {
        const article = await getArticleDetail(id)
        this.setData( { article } )
    },
    async refreshRelationArticles () {
        const relations = await getNewsByCategory(0)
        this.setData({ relations })
    }
})