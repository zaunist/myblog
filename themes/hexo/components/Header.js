import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import ButtonRandomPost from './ButtonRandomPost'
import CategoryGroup from './CategoryGroup'
import Logo from './Logo'
import { MenuListTop } from './MenuListTop'
import SearchButton from './SearchButton'
import SearchDrawer from './SearchDrawer'
import TagGroups from './TagGroups'

let windowTop = 0

/**
 * 顶部导航
 * @param {*} param0
 * @returns
 */
const Header = props => {
  const searchDrawer = useRef()
  const { tags, currentTag, categories, currentCategory } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const [isOpen, changeShow] = useState(false)
  const showSearchButton = siteConfig('HEXO_MENU_SEARCH', false, CONFIG)
  const showRandomButton = siteConfig('HEXO_MENU_RANDOM', false, CONFIG)

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  const toggleSideBarClose = () => {
    changeShow(false)
  }

  // 监听滚动
  useEffect(() => {
    window.addEventListener('scroll', topNavStyleHandler)
    router.events.on('routeChangeComplete', topNavStyleHandler)
    topNavStyleHandler()
    return () => {
      router.events.off('routeChangeComplete', topNavStyleHandler)
      window.removeEventListener('scroll', topNavStyleHandler)
    }
  }, [])

  const throttleMs = 200

  const topNavStyleHandler = useCallback(
    throttle(() => {
      const scrollS = window.scrollY
      const nav = document.querySelector('#sticky-nav')
      // 首页和文章页会有头图
      const header = document.querySelector('#header')
      const postTitle = document.querySelector('#post-bg')
      
      // 导航栏和头图是否重叠
      const scrollInHeader =
        header && (scrollS < 10 || scrollS < header?.clientHeight - 50)

      if (scrollInHeader) {
        nav && nav.classList.replace('bg-gray-180', 'bg-none')
        nav && nav.classList.replace('border', 'border-transparent')
        nav && nav.classList.replace('drop-shadow-md', 'shadow-none')
        nav && nav.classList.replace('dark:bg-gray-800', 'transparent')
      } else {
        nav && nav.classList.replace('bg-none', 'bg-gray-180')
        nav && nav.classList.replace('border-transparent', 'border')
        nav && nav.classList.replace('shadow-none', 'drop-shadow-md')
        nav && nav.classList.replace('transparent', 'dark:bg-gray-800')
      }

      if (scrollInHeader) {
        nav && nav.classList.replace('text-black', 'text-white')
      } else {
        nav && nav.classList.replace('text-white', 'text-black')
      }

      // 修改导航栏滚动行为：当文章标题接触到导航栏时开始收缩
      if (postTitle) {
        const postTitleRect = postTitle.getBoundingClientRect()
        const navRect = nav.getBoundingClientRect()
        if (postTitleRect.top <= navRect.bottom) {
          nav && nav.classList.add('nav-shrink')
        } else {
          nav && nav.classList.remove('nav-shrink')
        }
      } else if (scrollS > 50) { // 非文章页面在滚动50px时开始收缩
        // 非文章页面保持原有行为
        nav && nav.classList.add('nav-shrink')
      } else {
        nav && nav.classList.remove('nav-shrink')
      }
    }, throttleMs)
  )

  const searchDrawerSlot = (
    <>
      {categories && (
        <section className='mt-8'>
          <div className='text-sm flex flex-nowrap justify-between font-light px-2'>
            <div className='text-gray-600 dark:text-gray-200'>
              <i className='mr-2 fas fa-th-list' />
              {locale.COMMON.CATEGORY}
            </div>
            <Link
              href={'/category'}
              passHref
              className='mb-3 text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'>
              {locale.COMMON.MORE} <i className='fas fa-angle-double-right' />
            </Link>
          </div>
          <CategoryGroup
            currentCategory={currentCategory}
            categories={categories}
          />
        </section>
      )}

      {tags && (
        <section className='mt-4'>
          <div className='text-sm py-2 px-2 flex flex-nowrap justify-between font-light dark:text-gray-200'>
            <div className='text-gray-600 dark:text-gray-200'>
              <i className='mr-2 fas fa-tag' />
              {locale.COMMON.TAGS}
            </div>
            <Link
              href={'/tag'}
              passHref
              className='text-gray-400 hover:text-black  dark:hover:text-white hover:underline cursor-pointer'>
              {locale.COMMON.MORE} <i className='fas fa-angle-double-right' />
            </Link>
          </div>
          <div className='p-2'>
            <TagGroups tags={tags} currentTag={currentTag} />
          </div>
        </section>
      )}
    </>
  )

  return (
    <div id='top-nav' className='z-40'>
      <SearchDrawer cRef={searchDrawer} slot={searchDrawerSlot} />

      <style jsx global>{`
        #sticky-nav {
          transition: all 0.6s ease-in-out;
          padding: 16px 0;
          background-color: rgba(243, 244, 246, 0.9);
        }
        #sticky-nav.nav-shrink {
          padding: 2px 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          background-color: rgba(243, 244, 246, 0.95);
        }
        .dark #sticky-nav {
          background-color: rgba(31, 41, 55, 0.8);
        }
        .dark #sticky-nav.nav-shrink {
          background-color: rgba(31, 41, 55, 0.9);
        }
        #sticky-nav .w-full {
          transition: all 0.6s ease-in-out;
          display: flex;
          align-items: center;
        }
        #sticky-nav.nav-shrink .w-full {
          transform: translateY(0);
        }
        #sticky-nav .logo-img {
          transition: all 0.6s ease-in-out;
          font-size: 1.125rem;
        }
        #sticky-nav.nav-shrink .logo-img {
          font-size: 0.95rem;
        }
        #sticky-nav .menu-link {
          display: flex;
          align-items: center;
          height: 100%;
        }
      `}</style>

      {/* 导航栏 */}
      <div
        id='sticky-nav'
        style={{ backdropFilter: 'blur(5px)' }}
        className={
          'top-0 duration-300 transition-all shadow-none fixed text-black w-full z-20 transform border-transparent'
        }>
        <div className='w-full flex justify-between items-center px-4'>
          <div className='flex items-center'>
            <Logo {...props} />
          </div>

          {/* 右侧功能 */}
          <div className='mr-1 flex justify-end items-center'>
            <div className='hidden lg:flex items-center'>
              {' '}
              <MenuListTop {...props} />
            </div>
            <div
              onClick={toggleMenuOpen}
              className='w-8 justify-center items-center h-8 cursor-pointer flex lg:hidden'>
              {isOpen ? (
                <i className='fas fa-times' />
              ) : (
                <i className='fas fa-bars' />
              )}
            </div>
            {showSearchButton && <SearchButton />}
            {showRandomButton && <ButtonRandomPost {...props} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
