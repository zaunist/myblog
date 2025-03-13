import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import Card from './Card'
import SearchInput from './SearchInput'
import TagItemMini from './TagItemMini'

/**
 * 搜索页面的导航
 * @param {*} props
 * @returns
 */
export default function SearchNav(props) {
  const { tagOptions, categoryOptions } = props
  const cRef = useRef(null)
  const { locale } = useGlobal()
  useEffect(() => {
    // 自动聚焦到搜索框
    cRef?.current?.focus()
  }, [])

  return <>
    <div className="my-8 px-2">
        <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {locale.NAV.SEARCH}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
                {locale.SEARCH.TIPS || '输入关键词搜索文章'}
            </p>
        </div>
        
        <div className="max-w-3xl mx-auto mb-8">
            <SearchInput cRef={cRef} {...props} />
        </div>
        
        {/* 分类 */}
        <Card className="w-full mt-8">
            <div className="dark:text-gray-200 mb-5 mx-3">
                <i className="mr-4 fas fa-th" />
                {locale.COMMON.CATEGORY}:
            </div>
            <div id="category-list" className="duration-200 flex flex-wrap mx-8">
                {categoryOptions?.map(category => {
                  return (
                      <Link
                          key={category.name}
                          href={`/category/${category.name}`}
                          passHref
                          legacyBehavior>
                          <div
                              className={
                                  ' duration-300 dark:hover:text-white rounded-lg px-5 cursor-pointer py-2 hover:bg-indigo-400 hover:text-white'
                              }
                          >
                              <i className="mr-4 fas fa-folder" />
                              {category.name}({category.count})
                          </div>
                      </Link>
                  )
                })}
            </div>
        </Card>
        {/* 标签 */}
        <Card className="w-full mt-4">
            <div className="dark:text-gray-200 mb-5 ml-4">
                <i className="mr-4 fas fa-tag" />
                {locale.COMMON.TAGS}:
            </div>
            <div id="tags-list" className="duration-200 flex flex-wrap ml-8">
                {tagOptions?.map(tag => {
                  return (
                        <div key={tag.name} className="p-2">
                            <TagItemMini key={tag.name} tag={tag} />
                        </div>
                  )
                })}
            </div>
        </Card>
    </div>
</>
}
