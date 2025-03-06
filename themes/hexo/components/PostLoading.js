import React from 'react'

/**
 * 文章加载中的占位组件
 * @returns {JSX.Element}
 */
const PostLoading = () => {
  return (
    <div className="w-full flex justify-center items-center py-20">
      <div className="animate-pulse flex flex-col items-center">
        <div className="loader"></div>
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">加载中...</div>
        <style jsx>{`
          .loader {
            width: 48px;
            height: 48px;
            aspect-ratio: 1;
            border-radius: 50%;
            background: #000;
            box-shadow: 0 0 0 0 #0004;
            animation: l2 1.5s infinite linear;
            position: relative;
            margin-bottom: 8px;
          }
          .loader:before,
          .loader:after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            box-shadow: 0 0 0 0 #0004;
            animation: inherit;
            animation-delay: -0.5s;
          }
          .loader:after {
            animation-delay: -1s;
          }
          /* 深色模式下的样式 */
          :global(.dark) .loader {
            background: #fff;
            box-shadow: 0 0 0 0 #fff4;
          }
          @keyframes l2 {
            100% {
              box-shadow: 0 0 0 40px #0000;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export default PostLoading