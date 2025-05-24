// eslint-disable-next-line @next/next/no-document-import-in-page
import BLOG from '@/blog.config'
import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang={BLOG.LANG}>
        <Head>

          {/* Clarity 跟踪代码 */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "qihe6csyb9");
              `
            }}
          />

          {/* 预加载字体 */}
          {BLOG.FONT_AWESOME && (
            <>
              <link
                rel='preload'
                href={BLOG.FONT_AWESOME}
                as='style'
                crossOrigin='anonymous'
              />
              <link
                rel='stylesheet'
                href={BLOG.FONT_AWESOME}
                crossOrigin='anonymous'
                referrerPolicy='no-referrer'
              />
            </>
          )}

          {/* 预加载字体 */}
          {BLOG.FONT_OPTIMIZATION &&
            <>
              <link
                rel='preconnect'
                href='https://fonts.gstatic.com'
                crossOrigin='anonymous'
              />
            </>
          }
        </Head>

        <body>
          <script dangerouslySetInnerHTML={{
            __html: `
              // 检测暗色/亮色模式
              (function() {
                try {
                  const darkMode = localStorage.getItem('theme') === 'dark';
                  if (darkMode) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `
          }} />

          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

