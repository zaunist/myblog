import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { getListByPage } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import BlogPostCard from './BlogPostCard'
import BlogPostListEmpty from './BlogPostListEmpty'

/**
 * 博客列表滚动分页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListScroll = ({
  posts = [],
  currentSearch,
  showSummary = siteConfig('HEXO_POST_LIST_SUMMARY', null, CONFIG),
  siteInfo
}) => {
  const { NOTION_CONFIG, locale } = useGlobal()
  const [page, updatePage] = useState(1)
  // 固定每页显示5篇文章
  const POSTS_PER_PAGE = 5
  const postsToShow = getListByPage(posts, page, POSTS_PER_PAGE)

  let hasMore = false
  if (posts) {
    const totalCount = posts.length
    hasMore = page * POSTS_PER_PAGE < totalCount
  }

  const handleGetMore = () => {
    if (!hasMore) return
    updatePage(page + 1)
  }


  const targetRef = useRef(null)
  

  if (!postsToShow || postsToShow.length === 0) {
    return <BlogPostListEmpty currentSearch={currentSearch} />
  } else {
    return (
      <div id='container' ref={targetRef} className='w-full'>
        {/* 文章列表 */}
        <div className='space-y-6 px-2'>
          {postsToShow.map(post => (
            <BlogPostCard
              key={post.id}
              post={post}
              showSummary={showSummary}
              siteInfo={siteInfo}
            />
          ))}
        </div>

        <div>
          {hasMore ? (
            <div
              onClick={() => {
                handleGetMore()
              }}
              className='w-full my-4 py-4 text-center cursor-pointer rounded-xl dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200'>
              {locale.COMMON.MORE}
            </div>
          ) : (
            <div className='w-full my-4 py-4 text-center rounded-xl dark:text-gray-400'>
              {locale.COMMON.NO_MORE}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default BlogPostListScroll
