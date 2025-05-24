/**
 * 挂件组件相关
 * 仅支持 UTTERRANCES
 */
module.exports = {
  COMMENT_HIDE_SINGLE_TAB:
    process.env.NEXT_PUBLIC_COMMENT_HIDE_SINGLE_TAB || false, // Whether hide the tab when there's no tabs. 只有一个评论组件时是否隐藏切换组件的标签页

    COMMENT_GISCUS_REPO: process.env.NEXT_PUBLIC_COMMENT_GISCUS_REPO || 'zaunist/zaunist', // 你的Github仓库名 e.g 'tangly1024/NotionNext'
    COMMENT_GISCUS_REPO_ID: process.env.NEXT_PUBLIC_COMMENT_GISCUS_REPO_ID || 'R_kgDOJTGKaw', // 你的Github Repo ID e.g ( 設定完 giscus 即可看到 )
    COMMENT_GISCUS_CATEGORY_ID:
      process.env.NEXT_PUBLIC_COMMENT_GISCUS_CATEGORY_ID || 'DIC_kwDOJTGKa84Cqip9', // 你的Github Discussions 內的 Category ID ( 設定完 giscus 即可看到 )
    COMMENT_GISCUS_MAPPING:
      process.env.NEXT_PUBLIC_COMMENT_GISCUS_MAPPING || 'pathname', // 你的Github Discussions 使用哪種方式來標定文章, 預設 'pathname'
    COMMENT_GISCUS_REACTIONS_ENABLED:
      process.env.NEXT_PUBLIC_COMMENT_GISCUS_REACTIONS_ENABLED || '1', // 你的 Giscus 是否開啟文章表情符號 '1' 開啟 "0" 關閉 預設開啟
    COMMENT_GISCUS_EMIT_METADATA:
      process.env.NEXT_PUBLIC_COMMENT_GISCUS_EMIT_METADATA || '0', // 你的 Giscus 是否提取 Metadata '1' 開啟 '0' 關閉 預設關閉
    COMMENT_GISCUS_INPUT_POSITION:
      process.env.NEXT_PUBLIC_COMMENT_GISCUS_INPUT_POSITION || 'bottom', // 你的 Giscus 發表留言位置 'bottom' 尾部 'top' 頂部, 預設 'bottom'
    COMMENT_GISCUS_LANG: process.env.NEXT_PUBLIC_COMMENT_GISCUS_LANG || 'zh-CN', // 你的 Giscus 語言 e.g 'en', 'zh-TW', 'zh-CN', 預設 'en'
    COMMENT_GISCUS_LOADING:
      process.env.NEXT_PUBLIC_COMMENT_GISCUS_LOADING || 'lazy', // 你的 Giscus 載入是否漸進式載入, 預設 'lazy'
    COMMENT_GISCUS_CROSSORIGIN:
      process.env.NEXT_PUBLIC_COMMENT_GISCUS_CROSSORIGIN || 'anonymous', // 你的 Giscus 可以跨網域, 預設 'anonymous'
}
