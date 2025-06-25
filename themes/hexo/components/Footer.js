import Link from 'next/link'
import { siteConfig } from '@/lib/config'
import { useVercount } from 'vercount-react'

const Footer = ({ title }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear
  
  // 获取访问统计数据
  const { sitePv, siteUv, pagePv } = useVercount()

  return (
    <footer className='relative z-10 dark:bg-black flex-shrink-0 bg-hexo-light-gray justify-center text-center m-auto w-full leading-6  text-gray-600 dark:text-gray-100 text-sm p-6'>
      {/* <DarkModeButton/> */}
      <i className='fas fa-person-running' /> {`${copyrightDate}`}
      <span>
        <i className='mx-1 animate-pulse fas fa-headphones' />
        <a
          href="https://ajie.lu"
          className='underline font-bold  dark:text-gray-300 '>
          {siteConfig('AUTHOR')}
        </a>
        .<br />
        <h1 className='text-xs pt-4 text-light-400 dark:text-gray-400'>
          <Link href='/' className='hover:underline'>
            {title}
          </Link> {siteConfig('BIO') && <>|</>} {siteConfig('BIO')}
        </h1>
        {/* <PoweredBy className='justify-center' /> */}
      </span>
      
      {/* 网站访问统计 */}
      <div className='mt-4 pt-4 border-t border-gray-300 dark:border-gray-600'>
        <div className='flex flex-wrap justify-center items-center gap-4 text-xs text-gray-500 dark:text-gray-400'>
          <div className='flex items-center gap-1'>
            <i className='fas fa-eye'></i>
            <span>总访问量: </span>
            <span className='font-semibold text-blue-600 dark:text-blue-400'>{sitePv || '0'}</span>
          </div>
          <div className='flex items-center gap-1'>
            <i className='fas fa-users'></i>
            <span>总访客数: </span>
            <span className='font-semibold text-green-600 dark:text-green-400'>{siteUv || '0'}</span>
          </div>
          <div className='flex items-center gap-1'>
            <i className='fas fa-file-alt'></i>
            <span>本页访问: </span>
            <span className='font-semibold text-purple-600 dark:text-purple-400'>{pagePv || '0'}</span>
          </div>
        </div>
      </div>
      <br />
   
    </footer>
  )
}

export default Footer
