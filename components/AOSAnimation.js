import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'
// import AOS from 'aos'

/**
 * 加载滚动动画
 * 改从外部CDN读取
 * https://michalsnik.github.io/aos/
 */
export default function AOSAnimation() {
  const initAOS = async () => {
    Promise.all([
      loadExternalResource('/js/aos.js', 'js'),
      loadExternalResource('/css/aos.css', 'css')
    ]).then(() => {
      if (window.AOS) {
        window.AOS.init({
          // 优化配置
          offset: 50, // 触发动画的距离
          delay: 0, // 动画延迟
          duration: 400, // 动画持续时间
          easing: 'ease-out', // 动画缓动函数
          once: true, // 动画是否只触发一次
          disable: 'mobile', // 在移动设备上禁用动画
          startEvent: 'load', // 在页面加载完成后开始初始化
          throttleDelay: 99, // 节流延迟
          debounceDelay: 50, // 防抖延迟
          disableMutationObserver: true // 禁用 MutationObserver
        })
      }
    })
  }
  useEffect(() => {
    initAOS()
  }, [])
}
