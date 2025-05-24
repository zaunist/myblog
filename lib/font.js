/**
 * 在此处配置字体
 */
const BLOG = require('../blog.config')

// const { fontFamily } = require('tailwindcss/defaultTheme')

function CJK() {
  switch (BLOG.LANG.toLowerCase()) {
    case 'zh-cn':
    case 'zh-sg':
      return 'SC'
    case 'zh':
    case 'zh-hk':
    case 'zh-tw':
      return 'TC'
    case 'ja':
    case 'ja-jp':
      return 'JP'
    case 'ko':
    case 'ko-kr':
      return 'KR'
    default:
      return null
  }
}

const cjkLang = CJK();
const fontSansCJK = !cjkLang || cjkLang === 'SC'
  ? []
  : [`"Noto Sans CJK ${cjkLang}"`, `"Noto Sans ${cjkLang}"`];
const fontSerifCJK = !cjkLang || cjkLang === 'SC'
  ? []
  : [`"Noto Serif CJK ${cjkLang}"`, `"Noto Serif ${cjkLang}"`];

const fontFamilies = {
  sans: [...BLOG.FONT_SANS, ...fontSansCJK],
  serif: [...BLOG.FONT_SERIF, ...fontSerifCJK],
  noEmoji: [
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'sans-serif'
  ]
}
module.exports = { fontFamilies }
