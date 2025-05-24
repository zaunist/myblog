import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import Link from 'next/link'
import TagItemMini from './TagItemMini'

/**
 * 文章详情页的Hero块
 */
export default function PostHero({ post, siteInfo }) {
  const { locale, fullWidth } = useGlobal()

  if (!post) {
    return <></>
  }

  // 文章全屏隐藏标头
  if (fullWidth) {
    return <div className='my-8' />
  }

  const headerImage = post?.pageCover ? post.pageCover : siteInfo?.pageCover

  return (
    <div
      id='post-bg'
      className={`${
        fullWidth ? '' : 'mx-auto w-full md:w-full'
      } animate__animated animate__fadeIn`}>
      <header className='mx-auto w-full bg-white dark:bg-black relative'>
        <div className='animate__animated animate__fadeIn animate__faster'>
          {/* 文章标题 */}
          <div className='font-bold text-3xl text-black dark:text-white font-serif pt-24 text-center'>
            {post?.title}
          </div>

          <section className='flex-wrap shadow-text-md flex text-sm justify-center mt-4 text-gray-500 dark:text-gray-400 font-light leading-8'>
            <div className='flex justify-center dark:text-gray-200 text-opacity-70'>
              {post?.type !== 'Page' && (
                <>
                  <Link
                    href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                    passHref
                    className='pl-1 mr-2 cursor-pointer hover:underline'>
                    {locale.COMMON.POST_TIME}: {post?.publishDay}
                  </Link>
                </>
              )}
              <div className='pl-1 mr-2'>
                {locale.COMMON.LAST_EDITED_TIME}: {post.lastEditedDay}
              </div>
            </div>
          </section>

          <div className='mt-4 mb-1'>
            {post.tagItems && (
              <div className='flex justify-center flex-nowrap overflow-x-auto'>
                {post.tagItems.map(tag => (
                  <TagItemMini key={tag.name} tag={tag} />
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}
