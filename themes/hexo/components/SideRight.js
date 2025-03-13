import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import CONFIG from '../config'
import { AnalyticsCard } from './AnalyticsCard'
import Announcement from './Announcement'
import Card from './Card'
import Catalog from './Catalog'
import CategoryGroup from './CategoryGroup'
import LatestPostsGroup from './LatestPostsGroup'
import TagGroups from './TagGroups'
import Follow from './Follow'

/**
 * Hexo主题右侧栏
 * @param {*} props
 * @returns
 */
export default function SideRight(props) {
  const {
    post,
    currentCategory,
    categoryOptions,
    latestPosts,
    tags,
    currentTag,
    showCategory,
    showTag,
    rightAreaSlot,
    notice,
    className
  } = props

  const { locale } = useGlobal()

  // 文章全屏处理
  if (post && post?.fullWidth) {
    return null
  }

  // 获取最新的5篇文章
  const recentPosts = latestPosts ? latestPosts.slice(0, 5) : []

  return (
    <div
      id='sideRight'
      className={`lg:w-96 lg:pt-8 ${post ? 'lg:pt-0' : 'lg:pt-4'}`}>
      <style jsx global>{`
        @media (min-width: 1024px) {
          #sideRightContent {
            max-height: calc(100vh - 80px);
            overflow-y: auto;
            position: sticky;
            top: 20px;
          }
          
          /* 隐藏滚动条但保留滚动功能 */
          #sideRightContent::-webkit-scrollbar {
            width: 0;
            background: transparent;
          }
          
          #sideRightContent {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        }
      `}</style>
      <div id='sideRightContent' className='space-y-4 transition-all duration-200'>
        {post && post.toc && post.toc.length > 1 && (
          <Card>
            <Catalog toc={post.toc} />
          </Card>
        )}

        <Follow />

        <Card>
          <div className='mb-0'>
            <div className='font-medium text-xl mb-1'>文章分类</div>
            <hr className='my-1 border-gray-200 dark:border-gray-700 border-t-2' />
            <CategoryGroup
              currentCategory={currentCategory}
              categories={categoryOptions}
            />
          </div>
        </Card>
        
        {/* 最新文章 */}
        {latestPosts && latestPosts.length > 0 && (
          <Card>
            <div className='mb-0'>
              <div className='font-medium text-xl mb-1'>最新文章</div>
              <hr className='my-1 border-gray-200 dark:border-gray-700 border-t-2' />
              <LatestPostsGroup latestPosts={recentPosts} />
            </div>
          </Card>
        )}
        
        {siteConfig('HEXO_WIDGET_ANALYTICS', null, CONFIG) && (
          <AnalyticsCard {...props} />
        )}

        {showTag && (
          <Card>
            <TagGroups tags={tags} currentTag={currentTag} />
          </Card>
        )}
        
        <Announcement post={notice} />

        {rightAreaSlot}
      </div>
    </div>
  )
}
