import { useState, useEffect } from 'react';
import { useGlobal } from '@/lib/global'; // 假设用于获取语言设置

const PrivacyPolicyPopup = () => {
  const [showButton, setShowButton] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const { locale } = useGlobal(); // 获取当前语言环境，以便后续支持多语言

  // 模拟用户首次访问时显示弹窗，或者从localStorage读取状态
  useEffect(() => {
    const VISTOR_AGREEMENT = localStorage.getItem('VISITOR_AGREEMENT_TO_PRIVACY_POLICY');
    if (VISTOR_AGREEMENT === 'true' || VISTOR_AGREEMENT === 'opt_out') {
      setShowButton(false); // 如果用户已经交互过，则不显示按钮
      setShowPopup(false);
    } else {
      setShowButton(true); // 否则，显示初始按钮
      setShowPopup(false);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('VISITOR_AGREEMENT_TO_PRIVACY_POLICY', 'true');
    setShowPopup(false);
    setShowButton(false); // 用户同意后，按钮和弹窗都隐藏
  };

  const handleOptOut = () => {
    localStorage.setItem('VISITOR_AGREEMENT_TO_PRIVACY_POLICY', 'opt_out');
    setShowPopup(false);
    setShowButton(false); // 用户选择退出后，按钮和弹窗都隐藏
  };

  const handleOpenPopup = () => {
    setShowButton(false);
    setShowPopup(true);
  };

  // 文本内容可以从语言文件中获取
  const texts = {
    en: {
      doNotSell: 'Do Not Sell or Share My Personal Information',
      optOutTitle: 'Opt out of the sale or sharing of personal information',
      description: "We won't sell or share your personal information to inform the ads you see. You may still see interest-based ads if your information is sold or shared by other companies or was sold or shared previously.",
      dismiss: 'Dismiss',
      optOut: 'Opt out'
    },
    'zh-CN': {
      doNotSell: '不出售或分享我的个人信息',
      optOutTitle: '选择不出售或分享个人信息',
      description: '我们不会出售或分享您的个人信息以告知您所看到的广告。如果您的信息被其他公司出售或分享，或者以前曾被出售或分享，您可能仍会看到基于兴趣的广告。',
      dismiss: '知道了',
      optOut: '选择退出'
    }
  };

  const currentTexts = texts[locale.LOCALE?.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en'] || texts.en;

  if (!showButton && !showPopup) {
    return null; // 如果按钮和弹窗都不应该显示，则不渲染任何内容
  }

  return (
    <>
      {showButton && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-100 bg-opacity-5 p-2">
          <button 
            className="w-full border-none bg-gray-200 py-4 cursor-pointer text-center text-gray-800 text-sm font-medium hover:bg-gray-300"
            role="button" 
            aria-label={currentTexts.doNotSell} 
            tabIndex="0" 
            onClick={handleOpenPopup}
          >
            <div className="fc-button-background"> </div>
            <p className="m-0 text-sm">{currentTexts.doNotSell}</p>
          </button>
        </div>
      )}

      {showPopup && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-30"></div>
          <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-white p-5 rounded-lg shadow-lg w-11/12 max-w-xl dark:bg-gray-800 dark:text-gray-200 dark:border dark:border-gray-700">
            <div role="dialog" aria-label={currentTexts.optOutTitle} tabIndex="0">
              <div className="text-center mb-4">
                {/* The image could be optional or configurable */}
                {/* <div className="fc-header-image-container"><img className="fc-header-image" alt={currentTexts.optOutTitle} src="https://lh3.googleusercontent.com/-LkeDbfC0La7KWcVTgk_5oG9UumaKB4AUBMK-p43C0w--B4N4TibIZXBW0EKR5N0GFwsJknrVzM5wgTYdPvf9w5Mm4Y6OMbjyznJs0VanXJ2OoFVyDOD=h60" style={{ maxHeight: '60px' }} /></div> */}
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{currentTexts.optOutTitle}</h1>
              </div>
              <div className="mb-5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>{currentTexts.description}</p>
              </div>
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-md cursor-pointer bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                  onClick={handleDismiss} role="button" aria-label={currentTexts.dismiss} tabIndex="0">
                  <p className="m-0">{currentTexts.dismiss}</p>
                </button>
                <button className="px-4 py-2 border-none rounded-md cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleOptOut} role="button" aria-label={currentTexts.optOut} tabIndex="0">
                  <p className="m-0">{currentTexts.optOut}</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrivacyPolicyPopup;