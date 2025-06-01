import { siteConfig } from '@/lib/config'
import Card from './Card'

/**
 * 关注博主组件
 * @returns {JSX.Element}
 */
const Follow = () => {
  const CONTACT_TWITTER = siteConfig('CONTACT_TWITTER')
  const CONTACT_YOUTUBE = siteConfig('CONTACT_YOUTUBE')
  const CONTACT_TELEGRAM = siteConfig('CONTACT_TELEGRAM')
  const ENABLE_RSS = siteConfig('ENABLE_RSS')

  return (
    <Card>
      <div className='mb-0'>
        <div className='font-medium text-xl mb-1'>关注博主</div>
        <hr className='my-1 border-gray-200 dark:border-gray-700 border-t-2' />
        
        {/* 社交平台链接 - 同一行显示 */}
        <div className='w-full flex flex-wrap gap-2 mt-3'>
          {CONTACT_TWITTER && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'Twitter'}
              href={CONTACT_TWITTER}
              className='text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-150 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm font-bold'>
              <i className='fab fa-twitter mr-1'></i>X
            </a>
          )}
          
          {CONTACT_YOUTUBE && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'YouTube'}
              href={CONTACT_YOUTUBE}
              className='text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-150 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm font-bold'>
              <i className='fab fa-youtube mr-1'></i>YouTube
            </a>
          )}
          
          {CONTACT_TELEGRAM && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'Telegram'}
              href={CONTACT_TELEGRAM}
              className='text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-150 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm font-bold'>
              <i className='fab fa-telegram mr-1'></i>Telegram
            </a>
          )}
          
          {ENABLE_RSS && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'RSS 订阅'}
              href={'/rss/feed.xml'}
              className='text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-150 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm font-bold'>
              <i className='fas fa-rss mr-1'></i>RSS
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}

export default Follow