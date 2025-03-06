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
          {/* 百度站长验证 */}
          <meta name="baidu-site-verification" content="codeva-bqvSVJwVXp" />

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

          {/* 内联样式：在JavaScript加载前显示加载动画 */}
          <style dangerouslySetInnerHTML={{
            __html: `
              #initial-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: white;
                z-index: 9999;
                transition: opacity 0.3s;
              }

              .dark #initial-loader {
                background-color: #111;
              }
              
              .loader-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
              }

              /* 博客风格的加载动画 */
              .blog-loader {
                position: relative;
                width: 80px;
                height: 60px;
                margin-bottom: 20px;
              }
              
              .blog-loader .line {
                position: absolute;
                height: 3px;
                border-radius: 3px;
                background: #333;
                opacity: 0;
              }
              
              .dark .blog-loader .line {
                background: #eee;
              }
              
              .blog-loader .line:nth-child(1) {
                top: 0;
                left: 0;
                width: 100%;
                animation: blog-line 2s infinite ease-in-out;
                animation-delay: 0s;
              }
              
              .blog-loader .line:nth-child(2) {
                top: 15px;
                left: 10%;
                width: 80%;
                animation: blog-line 2s infinite ease-in-out;
                animation-delay: 0.1s;
              }
              
              .blog-loader .line:nth-child(3) {
                top: 30px;
                left: 0;
                width: 95%;
                animation: blog-line 2s infinite ease-in-out;
                animation-delay: 0.2s;
              }
              
              .blog-loader .line:nth-child(4) {
                top: 45px;
                left: 5%;
                width: 70%;
                animation: blog-line 2s infinite ease-in-out;
                animation-delay: 0.3s;
              }
              
              @keyframes blog-line {
                0% {
                  opacity: 0;
                  transform: translateX(-100%);
                }
                20% {
                  opacity: 1;
                  transform: translateX(0);
                }
                80% {
                  opacity: 1;
                  transform: translateX(0);
                }
                100% {
                  opacity: 0;
                  transform: translateX(100%);
                }
              }
              
              /* 打字机效果 */
              .typing-text {
                position: relative;
                font-family: monospace;
                font-size: 20px;
                color: #333;
                overflow: hidden;
                white-space: nowrap;
                border-right: 2px solid #333;
                animation: typing 3.5s steps(30, end) infinite, blink 0.5s step-end infinite alternate;
                width: 0;
                max-width: 270px;
              }
              
              .dark .typing-text {
                color: #eee;
                border-right-color: #eee;
              }
              
              @keyframes typing {
                0% {
                  width: 0;
                }
                40% {
                  width: 270px;
                }
                60% {
                  width: 270px;
                }
                100% {
                  width: 0;
                }
              }
              
              @keyframes blink {
                50% {
                  border-color: transparent;
                }
              }

              .loader-subtext {
                margin-top: 15px;
                font-size: 14px;
                color: #666;
                font-style: italic;
              }

              .dark .loader-subtext {
                color: #999;
              }

              /* 当页面加载完成后隐藏加载器 */
              .loaded #initial-loader {
                opacity: 0;
                pointer-events: none;
              }
            `
          }} />
        </Head>

        <body>
          {/* 在页面内容加载前显示的加载指示器 */}
          <div id="initial-loader">
            <div className="loader-wrapper">
              <div className="blog-loader">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
              <div className="typing-text">欢迎访问我的博客...</div>
              <div className="loader-subtext">思考中，马上呈现精彩内容</div>
            </div>
          </div>

          <script dangerouslySetInnerHTML={{
            __html: `
              // 检测页面加载完成
              document.addEventListener('DOMContentLoaded', function() {
                setTimeout(function() {
                  document.documentElement.classList.add('loaded');
                }, 300);
              });
              
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

