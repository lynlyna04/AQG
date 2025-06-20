import { useNavigate } from 'react-router-dom';
import { useLanguage } from './hooks/useLanguage';
import { useEffect, useState } from 'react';

function Hero() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      try {
        const parsedUser = JSON.parse(user);
        setUserType(parsedUser.user_type); // Ensure user_type is stored like: { user_type: "student" }
      } catch (error) {
        console.error('Failed to parse user:', error);
      }
    }
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className={`flex justify-between items-center px-8 py-0 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
      <div className={`w-1/2 mb-10 w-170 px-5 py-40 ml-5 ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <h1 className="text-[48px] font-semibold mb-6 leading-snug">
          {language === 'en' ? (
            <>Welcome to <span className="text-[#FFB3B3] text-opacity-100">"Taqyeem"</span><br />Arabic Learning Made Easy for Kids & Teachers</>
          ) : (
            <>مرحبًا بك في <span className="text-[#FFB3B3] text-opacity-100">"Taqyeem"</span><br />التعلم العربي أصبح سهلاً للطلاب والمعلمين</>
          )}
        </h1>

        <hr className="border-t-3 border-black w-100 mb-5" />

        <p className="text-[22px] font-semibold w-140 mb-5">
          {language === 'en'
            ? 'A question generator for elementary school students and a helpful tool for teachers to create subjects with ready-to-use templates.'
            : 'مولد أسئلة لطلاب المرحلة الابتدائية، وأداة مفيدة للمعلمين لإنشاء مواضيع باستخدام امتحانات جاهزة.'}
        </p>

        <div className="flex gap-4 mt-6 mb-15">
          {!isLoggedIn ? (
            <button
              className="bg-[#FFB3B3] text-[18px] font-semibold border-2 border-black px-12 py-2 rounded-[15px] hover:bg-[#f3a8c7] flex items-center"
              onClick={() => handleNavigate('/login')}
            >
              {language === 'en' ? 'Get Started' : 'ابدأ'}
              <img src="/Icon.png" alt="icon" className={`ml-2 ${language === 'ar' ? 'scale-x-[-1] ml-[-20px] mr-4' : ''}`} />
            </button>
          ) : (
            <>
              <button
                className="bg-[#FFB3B3] text-[18px] font-semibold border-2 border-black px-12 py-2 rounded-[15px] hover:bg-[#f3a8c7] flex items-center"
                onClick={() => handleNavigate('/Generate')}
              >
                {language === 'en' ? 'Generate Questions' : 'إنشاء الأسئلة'}
                <img src="/Icon.png" alt="icon" className={`ml-2 ${language === 'ar' ? 'scale-x-[-1] ml-[-20px] mr-4' : ''}`} />
              </button>

              {userType === 'student' && (
                <button
                  className="bg-[#FFEF9D] text-[18px] font-semibold border-2 border-black px-12 py-2 rounded-[15px] hover:bg-[#FFE768] flex items-center"
                  onClick={() => handleNavigate('/See-Exams')}
                >
                  {language === 'en' ? 'See Exams' : 'عرض الامتحانات'}
                  <img src="/Icon.png" alt="icon" className={`ml-2 ${language === 'ar' ? 'scale-x-[-1] ml-[-20px] mr-4' : ''}`} />
                </button>
              )}

              {userType === 'teacher' && (
                <button
                  className="bg-[#FFEF9D] text-[18px] font-semibold border-2 border-black px-12 py-2 rounded-[15px] hover:bg-[#FFE768] flex items-center"
                  onClick={() => handleNavigate('/Generate-subject')}
                >
                  {language === 'en' ? 'Generate Exam' : 'إنشاء الموضوع'}
                  <img src="/Icon.png" alt="icon" className={`ml-2 ${language === 'ar' ? 'scale-x-[-1] ml-[-20px] mr-4' : ''}`} />
                </button>
              )}
            </>
          )}
        </div>

        {/* Feature Boxes */}
        <div className="flex gap-6 flex-wrap">
          <div className="bg-[#FFEF9D] rounded-[10px] p-4 shadow w-[270px] px-6">
            <h4 className="text-[19px] font-semibold">
              {language === 'en' ? 'Perfect for Young Learners' : 'مثالي للمتعلمين الصغار'}
            </h4>
            <p className="text-[11px]">
              {language === 'en'
                ? 'Generate fun and interactive Arabic questions for elementary students —Grammar Questions, open-ended and writing prompts.'
                : 'أنشئ أسئلة عربية ممتعة وتفاعلية لطلاب المرحلة الابتدائية — اختيار قواعد، أسئلة مفتوحةووضعيات إدماجبة.'}
            </p>
          </div>

          <div className="bg-[#FFEF9D] rounded-[10px] p-4 shadow w-[200px] px-6">
            <h4 className="text-[19px] font-semibold">
              {language === 'en' ? 'Built for Teachers' : 'مصمم للمعلمين'}
            </h4>
            <p className="text-[11px]">
              {language === 'en'
                ? 'Easily create custom quizzes and subjects using ready-made educational templates for your classroom.'
                : 'أنشئ الاختبارات والمواضيع بسهولة باستخدام قوالب تعليمية جاهزة لفصلك الدراسي.'}
            </p>
          </div>

          <div className="bg-[#FFEF9D] rounded-[10px] p-4 shadow w-[240px] px-6">
            <h4 className="text-[19px] font-semibold">
              {language === 'en' ? 'Engaging & Easy to Use' : 'سهل الاستخدام ويزيد التفاعل'}
            </h4>
            <p className="text-[11px]">
              {language === 'en'
                ? 'Simple design and colorful quizzes keep kids engaged and make content creation easier for teachers.'
                : 'تصميم بسيط واختبارات ملونة تُبقي الأطفال متفاعلين وتُسهل على المعلمين إنشاء المحتوى.'}
            </p>
          </div>
        </div>
      </div>

      {/* Right side image */}
      <div className={`w-1/2 flex justify-end ${language === 'ar' ? 'mr-10 mt-[-270px]' : 'mt-[-460px]'}`}>
        <img src="/Image area (1).png" alt="hero" className="w-[500px] h-auto" />
      </div>
    </div>
  );
}

export default Hero;
