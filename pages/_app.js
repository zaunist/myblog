// import '@/styles/animate.css' // @see https://animate.style/
import '@/styles/globals.css'
import '@/styles/utility-patterns.css'

// core styles shared by all of react-notion-x (required)
import '@/styles/notion.css' //  重写部分notion样式
import 'react-notion-x/src/styles.css' // 原版的react-notion-x

import useAdjustStyle from '@/hooks/useAdjustStyle'
import { GlobalContextProvider } from '@/lib/global'
import { getBaseLayoutByTheme } from '@/themes/theme'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState, useEffect } from 'react'
import { getQueryParam } from '../lib/utils'
import { siteConfig } from '@/lib/config'

// 各种扩展插件 这个要阻塞引入
import BLOG from '@/blog.config'
import ExternalPlugins from '@/components/ExternalPlugins'
import SEO from '@/components/SEO'

/**
 * App挂载DOM 入口文件
 * @param {*} param0
 * @returns
 */
const MyApp = ({ Component, pageProps }) => {
  // 一些可能出现 bug 的样式，可以统一放入该钩子进行调整
  useAdjustStyle()

  // 添加加载状态
  const [isLoading, setIsLoading] = useState(false)
  
  // 获取加载动画相关配置
  const disableInitialLoading = siteConfig('DISABLE_INITIAL_LOADING')

  // 应用挂载时移除初始加载动画
  useEffect(() => {
    // 当页面完全加载后，移除静态加载动画
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        document.documentElement.classList.add('loaded')
      }, 300)
    }
  }, [])

  // 监听路由变化，控制加载状态
  const router = useRouter()
  useEffect(() => {
    let loadingTimeout = null
    let isChangingRoute = false
    
    const handleStart = (url) => {
      // 只有当路由改变时才显示加载动画
      if (url !== router.asPath) {
        isChangingRoute = true
        
        // 添加一个小延迟，避免快速导航时闪烁
        clearTimeout(loadingTimeout)
        loadingTimeout = setTimeout(() => {
          if (isChangingRoute) {
            setIsLoading(true)
          }
        }, 100)
      }
    }
    
    const handleComplete = () => {
      isChangingRoute = false
      clearTimeout(loadingTimeout)
      
      // 添加一个小延迟来隐藏加载动画，给其他组件时间准备
      setTimeout(() => {
        setIsLoading(false)
      }, 100)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      clearTimeout(loadingTimeout)
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  const route = router
  const theme = useMemo(() => {
    return (
      getQueryParam(route.asPath, 'theme') ||
      pageProps?.NOTION_CONFIG?.THEME ||
      BLOG.THEME
    )
  }, [route])

  // 整体布局
  const GLayout = useCallback(
    props => {
      const Layout = getBaseLayoutByTheme(theme)
      return <Layout {...props} />
    },
    [theme]
  )

  // 将isLoading状态传递给GlobalContextProvider
  pageProps.loadingRouteChange = isLoading

  const content = (
    <GlobalContextProvider {...pageProps}>
      <GLayout {...pageProps}>
        <SEO {...pageProps} />
        <Component {...pageProps} />
      </GLayout>
      <ExternalPlugins {...pageProps} />
    </GlobalContextProvider>
  )
  return (
    <>
      {content}
    </>
  )
}

export default MyApp
