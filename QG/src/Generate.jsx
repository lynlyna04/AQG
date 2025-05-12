import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useLanguage } from './hooks/useLanguage'; // Import the hook

function Generate() {
    const { language } = useLanguage(); // Get current language

    return (
        <>
            <Header></Header>
            <div
  className={`flex justify-center gap-6 mt-[170px] absolute ${
    language === 'ar' ? 'flex-row-reverse' : ''
  } ml-60`}
>
  {/* Card 1 */}
  <div className="w-[450px] rounded-[10px] border border-black shadow-md overflow-hidden">
    <div className="bg-[#FFB3B3] p-2 border-b border-black">
      <h3
        className="text-l font-bold text-black"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {language === 'ar' ? 'أدخل النص العربي' : 'Enter your Arabic text'}
      </h3>
    </div>
    <div className="bg-white p-4 h-[150px]">
      <p className="text-gray-800 leading-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        .
      </p>
    </div>
  </div>

  {/* Card 2 */}
  <div className="w-[350px] rounded-[10px] border border-black shadow-md overflow-hidden">
    <div className="bg-[#FFB3B3] p-2 border-b border-black">
      <h3
        className="text-l font-bold text-black"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {language === 'ar' ? 'الأسئلة' : 'Questions'}
      </h3>
    </div>
    <div className="bg-white p-4">
      <p className="text-gray-800 leading-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        .
      </p>
    </div>
  </div>
</div>

{/* Button */}
<button
          className={`mt-96 ml-139 bg-[#FFEF9D] text-[14px] font-semibold border-2 border-black px-6 py-2 rounded-[15px] hover:bg-[#FFE768] ${language === 'ar' ? 'ml-153' : ''}`}
>
  <div className={`flex items-center w-full ${language === 'ar' ? 'flex-row-reverse' : 'justify-between'}`}>
  <span>{language === 'ar' ? 'إنشاء' : 'Generate'}</span>
  <img src="/Icon.png" alt="icon" className="w-4 h-4 ml-0 mr-6 rtl:ml-0 rtl:mr-2 scale-x-[-1]" />
</div>

</button>

{/* Image */}
<img src="./ni9er.png" className="w-[190px] mt-[-150px] ml-10" />



        </>
    )
}

export default Generate;