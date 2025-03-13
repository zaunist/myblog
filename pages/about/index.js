import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPost, getPostBlocks } from '@/lib/db/getSiteData'
import { getPageTableOfContents } from '@/lib/notion/getPageTableOfContents'
import { DynamicLayout } from '@/themes/theme'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 关于页面
 * @param {*} props
 * @returns
 */
const About = props => {
  const { post } = props
  const router = useRouter()

  // 文章加载
  useEffect(() => {
    if (post?.blockMap?.block) {
      post.content = Object.keys(post.blockMap.block).filter(
        key => post.blockMap.block[key]?.value?.parent_id === post.id
      )
      post.toc = getPageTableOfContents(post, post.blockMap)
    }
  }, [router])

  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return (
    <>
      <DynamicLayout theme={theme} layoutName='LayoutSlug' {...props} />
    </>
  )
}

export async function getStaticProps({ locale }) {
  const from = 'about-page'
  const props = await getGlobalData({ from, locale })
  
  // 查找类型为Page且slug为about的页面
  props.post = props?.allPages?.find(p => {
    return p.type === 'Page' && p.slug === 'about'
  })

  // 如果在allPages中找不到about页面，则尝试从Notion中获取
  if (!props?.post) {
    // 查找配置中是否有指定的About页面ID
    const aboutPageId = siteConfig('ABOUT_PAGE_ID', null, props.NOTION_CONFIG)
    if (aboutPageId) {
      const post = await getPost(aboutPageId)
      props.post = post
    }
  }

  // 如果仍然没有找到about页面，创建一个默认的页面
  if (!props?.post) {
    props.post = {
      id: 'about',
      title: '关于',
      slug: 'about',
      type: 'Page',
      status: 'Published',
      blockMap: {
        block: {}
      }
    }
  } else {
    // 获取页面内容
    props.post.blockMap = await getPostBlocks(props.post.id, 'about-page')
  }

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

export default About 