import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { ensureHttps } from '@/lib/utils'

/**
 * 生成文章的JSON-LD结构化数据
 * @param {*} post 文章对象
 * @param {*} siteInfo 网站信息
 * @returns 
 */
export const BlogPostingJsonLd = ({ post, siteInfo }) => {
  if (!post) return null

  // 获取配置
  const author = siteConfig('AUTHOR') || BLOG.AUTHOR
  const link = ensureHttps(siteConfig('LINK') || BLOG.LINK)
  const title = siteConfig('TITLE') || BLOG.TITLE

  // 构建JSON-LD数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    author: {
      '@type': 'Person',
      name: author,
      url: link
    },
    publisher: {
      '@type': 'Organization',
      name: title,
      logo: {
        '@type': 'ImageObject',
        url: `${link}/favicon.ico`
      }
    },
    datePublished: new Date(post.publishDate || post.publishDay).toISOString(),
    dateModified: new Date(post.lastEditedDate || post.lastEditedDay).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${link}/${post.slug}`
    },
    isAccessibleForFree: 'True',
    inLanguage: siteConfig('LANG') || BLOG.LANG
  }

  // 如果有封面图，添加图片信息
  if (post.pageCoverThumbnail) {
    jsonLd.image = [post.pageCoverThumbnail]
  }

  // 如果有标签，添加关键词和主题
  if (post.tags && post.tags.length > 0) {
    jsonLd.keywords = post.tags.join(',')
    jsonLd.about = post.tags.map(tag => ({
      '@type': 'Thing',
      name: tag
    }))
  }

  // 如果有分类，添加分类
  if (post.category) {
    jsonLd.articleSection = post.category
  }

  // 如果有字数统计，添加字数
  if (post.wordCount) {
    jsonLd.wordCount = post.wordCount
  }

  // 添加阅读时间
  if (post.readTime) {
    jsonLd.timeRequired = `PT${Math.ceil(post.readTime)}M`
  }

  // 添加评论数据
  if (post.commentCount) {
    jsonLd.commentCount = post.commentCount
    
    // 如果有评论数据，添加评论
    if (post.comments && post.comments.length > 0) {
      jsonLd.comment = post.comments.map(comment => ({
        '@type': 'Comment',
        author: {
          '@type': 'Person',
          name: comment.author
        },
        datePublished: new Date(comment.date).toISOString(),
        text: comment.content
      }))
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

/**
 * 生成网站的JSON-LD结构化数据
 * @param {*} siteInfo 网站信息
 * @returns 
 */
export const WebSiteJsonLd = ({ siteInfo }) => {
  if (!siteInfo) return null

  // 获取配置
  const author = siteConfig('AUTHOR') || BLOG.AUTHOR
  const link = ensureHttps(siteConfig('LINK') || BLOG.LINK)
  const title = siteConfig('TITLE') || BLOG.TITLE
  const description = siteConfig('DESCRIPTION') || BLOG.DESCRIPTION

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: title,
    description: description,
    url: link,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${link}/search?keyword={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  // 添加作者信息
  jsonLd.author = {
    '@type': 'Person',
    name: author
  }

  // 添加发布者信息
  jsonLd.publisher = {
    '@type': 'Organization',
    name: title,
    logo: {
      '@type': 'ImageObject',
      url: `${link}/favicon.ico`
    }
  }

  // 添加博客相关信息
  jsonLd.alternateName = siteInfo?.title || title
  jsonLd.inLanguage = siteConfig('LANG') || BLOG.LANG
  
  // 添加社交媒体链接
  const sameAs = []
  if (siteConfig('CONTACT_GITHUB')) sameAs.push(siteConfig('CONTACT_GITHUB'))
  if (siteConfig('CONTACT_TWITTER')) sameAs.push(siteConfig('CONTACT_TWITTER'))
  if (siteConfig('CONTACT_FACEBOOK')) sameAs.push(siteConfig('CONTACT_FACEBOOK'))
  if (siteConfig('CONTACT_INSTAGRAM')) sameAs.push(siteConfig('CONTACT_INSTAGRAM'))
  if (siteConfig('CONTACT_LINKEDIN')) sameAs.push(siteConfig('CONTACT_LINKEDIN'))
  if (siteConfig('CONTACT_YOUTUBE')) sameAs.push(siteConfig('CONTACT_YOUTUBE'))
  
  if (sameAs.length > 0) {
    jsonLd.sameAs = sameAs
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

/**
 * 生成面包屑导航的JSON-LD结构化数据
 * @param {*} posts 文章列表
 * @param {*} currentPost 当前文章
 * @param {*} siteInfo 网站信息
 * @returns 
 */
export const BreadcrumbJsonLd = ({ posts, currentPost, siteInfo }) => {
  if (!currentPost) return null

  // 获取配置
  const link = ensureHttps(siteConfig('LINK') || BLOG.LINK)
  const title = siteConfig('TITLE') || BLOG.TITLE

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: title,
      item: link
    }
  ]

  // 如果有分类，添加分类面包屑
  if (currentPost.category) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: currentPost.category,
      item: `${link}/category/${encodeURIComponent(currentPost.category)}`
    })
  }

  // 添加当前文章
  breadcrumbItems.push({
    '@type': 'ListItem',
    position: currentPost.category ? 3 : 2,
    name: currentPost.title,
    item: `${link}/${currentPost.slug}`
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

/**
 * 生成作者的JSON-LD结构化数据
 * @param {*} siteInfo 网站信息
 * @returns 
 */
export const PersonJsonLd = ({ siteInfo }) => {
  // 获取配置
  const author = siteConfig('AUTHOR') || BLOG.AUTHOR
  const link = ensureHttps(siteConfig('LINK') || BLOG.LINK)
  const title = siteConfig('TITLE') || BLOG.TITLE
  const contactEmail = siteConfig('CONTACT_EMAIL') || BLOG.CONTACT_EMAIL
  const contactTwitter = siteConfig('CONTACT_TWITTER') || BLOG.CONTACT_TWITTER
  const contactGithub = siteConfig('CONTACT_GITHUB') || BLOG.CONTACT_GITHUB

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author,
    url: link,
    jobTitle: '博主',
    worksFor: {
      '@type': 'Organization',
      name: title
    }
  }

  // 添加社交媒体信息
  const sameAs = []
  if (contactTwitter) sameAs.push(contactTwitter)
  if (contactGithub) sameAs.push(contactGithub)
  if (siteConfig('CONTACT_FACEBOOK')) sameAs.push(siteConfig('CONTACT_FACEBOOK'))
  if (siteConfig('CONTACT_INSTAGRAM')) sameAs.push(siteConfig('CONTACT_INSTAGRAM'))
  if (siteConfig('CONTACT_LINKEDIN')) sameAs.push(siteConfig('CONTACT_LINKEDIN'))
  if (siteConfig('CONTACT_YOUTUBE')) sameAs.push(siteConfig('CONTACT_YOUTUBE'))
  
  if (sameAs.length > 0) {
    jsonLd.sameAs = sameAs
  }

  // 添加邮箱
  if (contactEmail) {
    jsonLd.email = contactEmail
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

/**
 * 生成博客文章集合的JSON-LD结构化数据
 * @param {*} posts 文章列表
 * @param {*} siteInfo 网站信息
 * @returns 
 */
export const BlogPostCollectionJsonLd = ({ posts, siteInfo }) => {
  if (!posts || posts.length === 0) return null

  // 获取配置
  const link = ensureHttps(siteConfig('LINK') || BLOG.LINK)
  const title = siteConfig('TITLE') || BLOG.TITLE

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${title} - 博客文章列表`,
    description: `${title}的所有博客文章`,
    url: `${link}/archive`,
    isPartOf: {
      '@type': 'WebSite',
      name: title,
      url: link
    },
    inLanguage: siteConfig('LANG') || BLOG.LANG,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${link}/${post.slug}`,
        name: post.title
      }))
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

/**
 * 生成FAQ的JSON-LD结构化数据
 * @param {*} faqs FAQ数据
 * @returns 
 */
export const FAQJsonLd = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

/**
 * 生成产品的JSON-LD结构化数据
 * @param {*} product 产品数据
 * @returns 
 */
export const ProductJsonLd = ({ product }) => {
  if (!product) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand
    }
  }

  // 如果有评价，添加评价
  if (product.reviews && product.reviews.length > 0) {
    jsonLd.review = product.reviews.map(review => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: '5'
      },
      author: {
        '@type': 'Person',
        name: review.author
      },
      reviewBody: review.content
    }))

    // 添加聚合评分
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / product.reviews.length

    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: averageRating.toFixed(1),
      reviewCount: product.reviews.length
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

/**
 * 生成本地商家的JSON-LD结构化数据
 * @param {*} business 商家数据
 * @returns 
 */
export const LocalBusinessJsonLd = ({ business }) => {
  if (!business) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': business.type || 'LocalBusiness',
    name: business.name,
    image: business.image,
    '@id': business.url,
    url: business.url,
    telephone: business.telephone,
    priceRange: business.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.geo.latitude,
      longitude: business.geo.longitude
    },
    openingHoursSpecification: business.openingHours.map(hours => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
} 