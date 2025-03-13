import { siteConfig } from '@/lib/config'
import Link from 'next/link'
/**
 * Logo
 * 实际值支持文字
 * @param {*} props
 * @returns
 */
const Logo = props => {
  const { siteInfo } = props
  return (
    <Link href='https://zaunist.com' className='flex flex-col justify-center items-center cursor-pointer'>
      <div className='font-medium text-lg p-1.5 rounded dark:border-white dark:text-white menu-link transform duration-200 logo-img'>
        {' '}
        {siteInfo?.title || siteConfig('TITLE')}
      </div>
    </Link>
  )
}
export default Logo
