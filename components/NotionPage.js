import { siteConfig } from '@/lib/config'
import { compressImage, mapImgUrl } from '@/lib/notion/mapImage'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import 'katex/dist/katex.min.css'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { NotionRenderer } from 'react-notion-x'

// 动态导入 medium-zoom，减少初始加载的数据量
const MediumZoom = dynamic(() => import('@fisch0920/medium-zoom'), { 
  ssr: false,
  loading: () => <div>Loading Zoom...</div>
})

/**
 * 整个站点的核心组件
 * 将Notion数据渲染成网页
 * @param {*} param0
 * @returns
 */
const NotionPage = ({ post, className }) => {
  // 是否关闭数据库和画册的点击跳转
  const POST_DISABLE_GALLERY_CLICK = siteConfig('POST_DISABLE_GALLERY_CLICK')
  const POST_DISABLE_DATABASE_CLICK = siteConfig('POST_DISABLE_DATABASE_CLICK')
  const SPOILER_TEXT_TAG = siteConfig('SPOILER_TEXT_TAG')
  const IMAGE_ZOOM_IN_WIDTH = siteConfig('IMAGE_ZOOM_IN_WIDTH', 1200)

  // 所有状态和引用放在组件顶部
  const zoomRef = useRef(null)
  const [observerAttached, setObserverAttached] = useState(false)
  
  // 初始化 medium-zoom
  useEffect(() => {
    if (isBrowser) {
      import('@fisch0920/medium-zoom').then(module => {
        const mediumZoom = module.default
        const zoom = mediumZoom({
          background: 'rgba(0, 0, 0, 0.2)',
          margin: getMediumZoomMargin()
        })
        zoomRef.current = zoom ? zoom.clone() : null
      })
    }
  }, [])

  // 页面首次打开时执行的勾子
  useEffect(() => {
    // 检测当前的url并自动滚动到对应目标
    autoScrollToHash()
  }, [])

  // 页面文章发生变化时会执行的勾子
  useEffect(() => {
    // 相册视图点击禁止跳转，只能放大查看图片
    if (POST_DISABLE_GALLERY_CLICK && zoomRef.current) {
      // 针对页面中的gallery视图，点击后是放大图片还是跳转到gallery的内部页面
      processGalleryImg(zoomRef.current)
    }

    // 页内数据库点击禁止跳转，只能查看
    if (POST_DISABLE_DATABASE_CLICK) {
      processDisableDatabaseUrl()
    }
  }, [post, POST_DISABLE_GALLERY_CLICK, POST_DISABLE_DATABASE_CLICK])

  // 单独的 useEffect 处理 MutationObserver
  useEffect(() => {
    // 只在浏览器环境且未附加观察器时执行
    if (isBrowser && !observerAttached) {
      /**
       * 放大查看图片时替换成高清图像
       */
      const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'class'
          ) {
            if (mutation.target.classList.contains('medium-zoom-image--opened')) {
              // 等待动画完成后替换为更高清的图像
              setTimeout(() => {
                // 获取该元素的 src 属性
                const src = mutation?.target?.getAttribute('src')
                //   替换为更高清的图像
                mutation?.target?.setAttribute(
                  'src',
                  compressImage(src, IMAGE_ZOOM_IN_WIDTH)
                )
              }, 800)
            }
          }
        })
      })

      // 监视页面元素和属性变化
      observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class']
      })

      // 标记观察器已附加，避免重复附加
      setObserverAttached(true)

      return () => {
        // 清理观察器
        observer.disconnect()
      }
    }
  }, [IMAGE_ZOOM_IN_WIDTH])

  // Spoiler文本功能
  useEffect(() => {
    if (SPOILER_TEXT_TAG && isBrowser) {
      import('lodash/escapeRegExp').then(escapeRegExp => {
        Promise.all([
          loadExternalResource('/js/spoilerText.js', 'js'),
          loadExternalResource('/css/spoiler-text.css', 'css')
        ]).then(() => {
          window.textToSpoiler &&
            window.textToSpoiler(escapeRegExp.default(SPOILER_TEXT_TAG))
        })
      })
    }
  }, [SPOILER_TEXT_TAG])

  return (
    <div
      id='notion-article'
      className={`mx-auto overflow-hidden ${className || ''}`}>
      <NotionRenderer
        recordMap={post?.blockMap}
        mapPageUrl={mapPageUrl}
        mapImageUrl={mapImgUrl}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
          Tweet
        }}
      />

      <AdEmbed />
      <PrismMac />
    </div>
  )
}

/**
 * 页面的数据库链接禁止跳转，只能查看
 */
const processDisableDatabaseUrl = () => {
  if (isBrowser) {
    const links = document.querySelectorAll('.notion-table a')
    for (const e of links) {
      e.removeAttribute('href')
    }
  }
}

/**
 * gallery视图，点击后是放大图片还是跳转到gallery的内部页面
 */
const processGalleryImg = zoom => {
  setTimeout(() => {
    if (isBrowser) {
      const imgList = document?.querySelectorAll(
        '.notion-collection-card-cover img'
      )
      if (imgList && zoom) {
        for (let i = 0; i < imgList.length; i++) {
          zoom.attach(imgList[i])
        }
      }

      const cards = document.getElementsByClassName('notion-collection-card')
      for (const e of cards) {
        e.removeAttribute('href')
      }
    }
  }, 800)
}

/**
 * 根据url参数自动滚动到锚位置
 */
const autoScrollToHash = () => {
  setTimeout(() => {
    // 跳转到指定标题
    const hash = window?.location?.hash
    const needToJumpToTitle = hash && hash.length > 0
    if (needToJumpToTitle) {
      console.log('jump to hash', hash)
      const tocNode = document.getElementById(hash.substring(1))
      if (tocNode && tocNode?.className?.indexOf('notion') > -1) {
        tocNode.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
    }
  }, 180)
}

/**
 * 将id映射成博文内部链接。
 * @param {*} id
 * @returns
 */
const mapPageUrl = id => {
  // return 'https://www.notion.so/' + id.replace(/-/g, '')
  return '/' + id.replace(/-/g, '')
}

/**
 * 缩放
 * @returns
 */
function getMediumZoomMargin() {
  const width = window.innerWidth

  if (width < 500) {
    return 8
  } else if (width < 800) {
    return 20
  } else if (width < 1280) {
    return 30
  } else if (width < 1600) {
    return 40
  } else if (width < 1920) {
    return 48
  } else {
    return 72
  }
}

// 代码
const Code = dynamic(
  () =>
    import('react-notion-x/build/third-party/code').then(async m => {
      return m.Code
    }),
  { ssr: false }
)

// 公式
const Equation = dynamic(
  () =>
    import('@/components/Equation').then(async m => {
      // 化学方程式
      await import('@/lib/plugins/mhchem')
      return m.Equation
    }),
  { ssr: false }
)

// 原版文档
// const Pdf = dynamic(
//   () => import('react-notion-x/build/third-party/pdf').then(m => m.Pdf),
//   {
//     ssr: false
//   }
// )
const Pdf = dynamic(() => import('@/components/Pdf').then(m => m.Pdf), {
  ssr: false
})

// 美化代码 from: https://github.com/txs
const PrismMac = dynamic(() => import('@/components/PrismMac'), {
  ssr: false
})

/**
 * tweet嵌入
 */
const TweetEmbed = dynamic(() => import('react-tweet-embed'), {
  ssr: false
})

/**
 * 文内google广告
 */
const AdEmbed = dynamic(
  () => import('@/components/GoogleAdsense').then(m => m.AdEmbed),
  { ssr: true }
)

const Collection = dynamic(
  () =>
    import('react-notion-x/build/third-party/collection').then(
      m => m.Collection
    ),
  {
    ssr: true
  }
)

const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then(m => m.Modal),
  { ssr: false }
)

const Tweet = ({ id }) => {
  return <TweetEmbed tweetId={id} />
}

export default NotionPage
