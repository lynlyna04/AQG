import { useNavigate } from 'react-router-dom';
import { useLanguage } from './hooks/useLanguage';
import { Link } from 'react-router-dom';


function Header() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();

  const handleGetStartedClick = () => {
    navigate('/Generate');
  };

  return (
    <header>
  <nav className="w-full h-20 flex items-center justify-between px-8 md:px-20 absolute">
    <div className={`flex gap-4 ${language === 'en' ? 'order-2' : 'order-1'}`}>
      <button
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
        onClick={toggleLanguage}
      >
        {language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      </button>

      <button
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
        onClick={handleGetStartedClick}
      >
        {language === 'en' ? 'Generate' : 'أنشئ'}
      </button>
    </div>

    <ul
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="absolute left-1/2 transform -translate-x-1/2 flex space-x-0 rtl:space-x-reverse text-black text-lg gap-14"
    >
      <li><a href="/">{language === 'en' ? 'Home' : 'الرئيسية'}</a></li>
    </ul>

    <div className={`${language === 'en' ? 'order-1' : 'order-2'}`}>
      <img src="./Group 78.png" alt="logo" className="h-10" />
    </div>
  </nav>
</header>

  );
}

export default Header;
