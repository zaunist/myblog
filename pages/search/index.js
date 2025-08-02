import BLOG from '@/blog.config'
import { getDataFromCache } from '@/lib/cache/cache_manager'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { DynamicLayout } from '@/themes/theme'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

/**
 * 搜索路由
 * @param {*} props
 * @returns
 */
const Search = props => {
  const { posts } = props
  const router = useRouter()
  const keyword = router?.query?.s
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // 增强的搜索函数，支持全文搜索
  const performSearch = async searchKeyword => {
    if (!searchKeyword) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const filteredPosts = await filterPostsWithFullText(posts, searchKeyword)
    setSearchResults(filteredPosts)
    setIsSearching(false)
  }

  useEffect(() => {
    if (keyword) {
      performSearch(keyword)
    } else {
      setSearchResults([])
    }
  }, [keyword, posts])

  const finalPosts = keyword ? searchResults : []
  props = { ...props, posts: finalPosts, keyword, isSearching }

  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutSearch' {...props} />
}

/**
 * 浏览器前端搜索
 */
export async function getStaticProps({ locale }) {
  const props = await getGlobalData({
    from: 'search-props',
    locale
  })
  const { allPages } = props
  props.posts = allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

// 客户端全文搜索函数
async function filterPostsWithFullText(allPosts, keyword) {
  const filterPosts = []
  if (keyword) {
    keyword = keyword.trim().toLowerCase()
  }

  for (const post of allPosts) {
    // 基础信息搜索
    const tagContent =
      post?.tags && Array.isArray(post?.tags) ? post?.tags.join(' ') : ''
    const categoryContent =
      post.category && Array.isArray(post.category)
        ? post.category.join(' ')
        : ''
    const articleInfo = post.title + post.summary + tagContent + categoryContent
    let hit = articleInfo.toLowerCase().indexOf(keyword) > -1

    // 如果基础信息命中，直接添加
    if (hit) {
      post.results = [post.summary || post.title]
      filterPosts.push(post)
      continue
    }

    // 尝试全文搜索（如果有缓存）
    try {
      const cacheKey = 'page_block_' + post.id
      const page = await getDataFromCache(cacheKey, true)
      if (page) {
        const indexContent = getPageContentText(post, page)
        post.results = []
        let hitCount = 0

        for (const i in indexContent) {
          const c = indexContent[i]
          if (!c) continue

          const index = c.toLowerCase().indexOf(keyword)
          if (index > -1) {
            hit = true
            hitCount += 1
            post.results.push(c)
          } else {
            if ((post.results.length - 1) / hitCount < 3 || i === 0) {
              post.results.push(c)
            }
          }
        }

        if (hit) {
          filterPosts.push(post)
        }
      }
    } catch (error) {
      console.warn('全文搜索失败，使用基础搜索:', error)
    }
  }

  return filterPosts
}

// 复用原有的内容提取函数
function getPageContentText(post, pageBlockMap) {
  let indexContent = []
  if (pageBlockMap && pageBlockMap.block) {
    const contentIds = Object.keys(pageBlockMap.block)
    contentIds.forEach(id => {
      const properties = pageBlockMap?.block[id]?.value?.properties
      indexContent = appendText(indexContent, properties, 'title')
      indexContent = appendText(indexContent, properties, 'caption')
    })
  }
  return indexContent.join('')
}

function appendText(sourceTextArray, targetObj, key) {
  if (!targetObj) return sourceTextArray
  const textArray = targetObj[key]
  const text = textArray ? getTextContent(textArray) : ''
  if (text && text !== 'Untitled') {
    return sourceTextArray.concat(text)
  }
  return sourceTextArray
}

function getTextContent(textArray) {
  if (typeof textArray === 'object' && isIterable(textArray)) {
    let result = ''
    for (const textObj of textArray) {
      result = result + getTextContent(textObj)
    }
    return result
  } else if (typeof textArray === 'string') {
    return textArray
  }
}

const isIterable = obj =>
  obj != null && typeof obj[Symbol.iterator] === 'function'

export default Search
