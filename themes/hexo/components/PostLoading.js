import React from 'react'

/**
 * 文章加载中的占位组件
 * @returns {JSX.Element}
 */
const PostLoading = () => {
  return (
    <div className="w-full flex justify-center items-center py-20 my-10">
      <div className="flex flex-col items-center">
        <div className="blog-loader">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <div className="typing-text">正在加载内容...</div>
        <div className="loader-subtext">思考中，马上呈现精彩内容</div>
      </div>
    </div>
  )
}

export default PostLoading