import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { siteConfig } from '@/lib/config'

/**
 * 自定义钩子，用于控制数据加载状态
 * @param {Array|Object} data - 需要监听的数据，通常是文章列表或文章详情
 * @param {number} defaultMinLoadingTime - 最小显示加载动画的时间（毫秒），如不指定则使用配置项
 * @returns {boolean} - 是否正在加载
 */
export default function useLoading(data, defaultMinLoadingTime) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  
  // 从配置中获取最小加载时间
  const configMinLoadingTime = siteConfig('MIN_LOADING_TIME')
  // 使用配置项中的值，如果没有则使用默认值
  const minLoadingTime = defaultMinLoadingTime || configMinLoadingTime || 800
  
  // 去掉对路由变化的监听，避免与_app.js中的路由加载状态冲突
  // 这样可以防止加载状态的闪烁，因为路由变化的加载状态已经在_app.js中处理了
  
  // 设置开始加载时间，初始化时立即执行一次
  useEffect(() => {
    let isActive = true // 用于处理组件卸载后的异步操作
    
    // 检查和更新加载状态
    const checkAndUpdateLoadingState = () => {
      const startTime = new Date().getTime()
      
      // 检查数据是否已加载
      const checkDataLoaded = () => {
        if (!data) return false
        
        // 检查数组数据
        if (Array.isArray(data)) return data.length > 0
        
        // 检查对象数据，通常是文章详情
        if (typeof data === 'object') {
          if (data.blockMap) return true
          if (data.title && data.id) return true
        }
        
        return false
      }
      
      const dataLoaded = checkDataLoaded()
      
      if (dataLoaded) {
        // 计算已经过去的时间
        const elapsedTime = new Date().getTime() - startTime
        
        // 如果过去的时间小于最小加载时间，则等待
        if (elapsedTime < minLoadingTime) {
          const timer = setTimeout(() => {
            if (isActive) {
              setIsLoading(false)
            }
          }, minLoadingTime - elapsedTime)
          
          return () => {
            clearTimeout(timer)
          }
        } else {
          if (isActive) {
            setIsLoading(false)
          }
        }
      } else {
        // 如果数据未加载，保持加载状态
        if (isActive) {
          setIsLoading(true)
        }
      }
    }
    
    checkAndUpdateLoadingState()
    
    // 清理函数，防止组件卸载后状态更新导致的内存泄漏
    return () => {
      isActive = false
    }
  }, [data, minLoadingTime])
  
  return isLoading
} 