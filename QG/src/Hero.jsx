import { useNavigate } from 'react-router-dom';
import { useLanguage } from './hooks/useLanguage'; // Import the hook

function Hero() {
  const navigate = useNavigate();
  const { language } = useLanguage(); // Get current language

  const handleGetStartedClick = () => {
    navigate('/Generate');
  };

  return (
    <div className={`flex justify-between items-center px-8 py-0 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
      <div className={`w-1/2 mb-10 w-170 px-5 py-40 ml-5 ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <h1 className="text-[48px] font-semibold mb-6 leading-snug">
          {language === 'en' ? (
            <>Welcome to <span className="text-[#FFB3B3] text-opacity-100">"My Quizzer"</span><br />Your Fun Arabic Question Generator for Kids</>
          ) : (
            <>مرحبًا بك في <span className="text-[#FFB3B3] text-opacity-100">"ماي كويزر"</span><br />مولد الأسئلة العربية الممتع للأطفال</>
          )}
        </h1>

        <hr className="border-t-3 border-black w-100 mb-5" />

        <p className="text-[22px] font-semibold w-140 mb-5">
          {language === 'en'
            ? 'Turn any Arabic text into engaging questions that boost reading comprehension and spark curiosity!'
            : 'حوّل أي نص عربي إلى أسئلة ممتعة تعزز فهم القراءة وتثير الفضول!'}
        </p>

        <button
          className="bg-[#FFB3B3] text-[22px] font-semibold border-2 border-black px-10 py-2 rounded-[15px] hover:bg-[#f3a8c7] w-1/2 flex justify-between items-center w-80 mb-15"
          onClick={handleGetStartedClick}
        >
          {language === 'en' ? 'Get started for free' : 'ابدأ مجانًا'}
          <img src="/Icon.png" alt="icon" className={`ml-2 ${language === 'ar' ? 'scale-x-[-1] ml-[-20px]' : ''}`} />
        </button>

        <div className="flex gap-6 flex-wrap">
          <div className="bg-[#FFEF9D] rounded-[10px] p-4 shadow w-[270px] px-6">
            <h4 className="text-[19px] font-semibold">
              {language === 'en' ? 'Build Comprehension Skills' : 'تنمية مهارات الفهم'}
            </h4>
            <p className="text-[11px]">
              {language === 'en'
                ? 'Generate a variety of question types—multiple‑choice, true/false, and open‑ended—to help kids practice understanding what they read.'
                : 'أنشئ أنواعًا مختلفة من الأسئلة — اختيار من متعدد، صح/خطأ، وأسئلة مفتوحة — لمساعدة الأطفال على ممارسة فهمهم للنصوص.'}
            </p>
          </div>

          <div className="bg-[#FFEF9D] rounded-[10px] p-4 shadow w-[200px] px-6">
            <h4 className="text-[19px] font-semibold">
              {language === 'en' ? 'Easy & Instant' : 'سهل وفوري'}
            </h4>
            <p className="text-[11px]">
              {language === 'en'
                ? 'Paste your Arabic text, click “Generate,” and see a ready‑to‑use quiz in seconds—no setup required!'
                : 'الصق النص العربي، واضغط "إنشاء"، وشاهد اختبارًا جاهزًا في ثوانٍ — بدون أي إعداد!'}
            </p>
          </div>

          <div className="bg-[#FFEF9D] rounded-[10px] p-4 shadow w-[240px] px-6">
            <h4 className="text-[19px] font-semibold">
              {language === 'en' ? 'Spark Engagement' : 'زيادة التفاعل'}
            </h4>
            <p className="text-[11px]">
              {language === 'en'
                ? 'Interactive, colorful questions keep young learners motivated and excited to explore new stories and topics.'
                : 'الأسئلة التفاعلية والملونة تحفّز المتعلمين الصغار وتحمّسهم لاستكشاف قصص ومواضيع جديدة.'}
            </p>
          </div>
        </div>
      </div>

      {/* Right side image */}
      <div className={`w-1/2 flex justify-end ${language === 'ar' ? 'mr-10 mt-[-270px]' : 'mt-[-460px]'}`}>
        <img src="/Image area (1).png" alt="hero" className= "w-[500px] h-auto"/>
      </div>
    </div>
  );
}

export default Hero;
