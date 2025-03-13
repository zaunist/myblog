import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'

/**
 * 最新文章列表
 * @param posts 所有文章数据
 * @param sliceCount 截取展示的数量 默认6
 * @constructor
 */
const LatestPostsGroup = ({ latestPosts }) => {
  // 获取当前路径
  const currentPath = useRouter().asPath

  if (!latestPosts) {
    return <></>
  }

  return (
    <>
      {latestPosts.map(post => {
        const selected = currentPath === post?.href

        return (
          <Link
            key={post.id}
            title={post.title}
            href={post?.href}
            passHref
            className={'my-3 flex'}>
            <div
              className={
                (selected ? ' text-indigo-400 ' : 'dark:text-gray-400 ') +
                ' text-sm overflow-x-hidden hover:text-indigo-600 px-2 duration-200 w-full rounded ' +
                ' hover:text-indigo-400 cursor-pointer items-center flex'
              }>
              <div>
                <div className='line-clamp-2 menu-link'>{post.title}</div>
                <div className='text-gray-500'>{post.lastEditedDay}</div>
              </div>
            </div>
          </Link>
        )
      })}
    </>
  )
}
export default LatestPostsGroup
