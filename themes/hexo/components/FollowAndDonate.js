import { useState } from 'react'
import { siteConfig } from '@/lib/config'
import Card from './Card'

/**
 * 关注博主和微信打赏组件
 * @returns {JSX.Element}
 */
const FollowAndDonate = () => {
  const CONTACT_TWITTER = siteConfig('CONTACT_TWITTER')
  const CONTACT_BILIBILI = siteConfig('CONTACT_BILIBILI')
  const CONTACT_YOUTUBE = siteConfig('CONTACT_YOUTUBE')
  const CONTACT_TELEGRAM = siteConfig('CONTACT_TELEGRAM')

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
              Twitter
            </a>
          )}
          
          {CONTACT_BILIBILI && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'哔哩哔哩'}
              href={CONTACT_BILIBILI}
              className='text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-150 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm font-bold'>
              BiliBili
            </a>
          )}
          
          {CONTACT_YOUTUBE && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'YouTube'}
              href={CONTACT_YOUTUBE}
              className='text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-150 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm font-bold'>
              YouTube
            </a>
          )}
          
          {CONTACT_TELEGRAM && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'Telegram'}
              href={CONTACT_TELEGRAM}
              className='text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-150 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm font-bold'>
              Telegram
            </a>
          )}
        </div>
        
        {/* 微信公众号图片 - 直接显示 */}
        <div className='mt-4 mb-4'>
          <img 
            src="/gongzhonghao.png" 
            alt="微信公众号" 
            className="w-full max-w-xs object-contain border border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>
      
      {/* 微信打赏 - 直接显示图片 */}
      <div className='mt-6'>
        <div className='font-medium text-xl  mb-1'>微信打赏</div>
        <hr className='my-1 border-gray-200 dark:border-gray-700 border-t-2' />
        <div className='w-full mt-4'>
          <img 
            src="/reward_qrcode_wechat.png" 
            alt="微信收款码" 
            className="w-full max-w-xs object-contain border border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>
    </Card>
  )
}

export default FollowAndDonate 