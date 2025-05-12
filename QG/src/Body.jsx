
import { useLanguage } from './hooks/useLanguage';



function Body() {
    const { language } = useLanguage(); // Get current language
    return (
        <div>
            <div className="bg-[#21FFAE] h-250 mb-30">
  <img src="/Group 33.png" className="mt-[-70px] absolute" />
  <h2 className="text-semibold flex justify-center items-center px-16 py-30 text-[48px] font-semibold">
    {language === 'ar' ? 'كيف يعمل؟' : 'How it works?'}
  </h2>
  <img src="./ni9er.png" />

  {/* Box 1 */}
  <div className={`w-[250px] rounded-[10px] border-1 border- shadow-md overflow-hidden mt-[-470px] ${language === 'ar' ? 'ml-220' : 'ml-65'}`}>
    <div className="bg-[#FFB3B3] p-4 border-b border-black" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <h3 className={`text-xl font-bold text-black ${language === 'ar' ? 'text-right' : ''}`}>
        {language === 'ar' ? 'الصق نصك' : 'Paste Your Text'}
      </h3>
    </div>
    <div className="bg-white p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <p className={`text-gray-800 leading-6 ${language === 'ar' ? 'text-right' : ''}`}>
        {language === 'ar'
          ? 'قم بإدخال فقرة أو قصة أو مقالة باللغة العربية.'
          : 'Simply drop in any Arabic paragraph, story or article.'}
      </p>
    </div>
  </div>

  {/* Box 2 */}
  <div className={`w-[250px] rounded-[10px] border-1 border- shadow-md overflow-hidden mt-[-20px] ${language === 'ar' ? 'ml-170' : 'ml-110'}`}>
    <div className="bg-[#FFB3B3] p-4 border-b border-black" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <h3 className={`text-xl font-bold text-black ${language === 'ar' ? 'text-right' : ''}`}>
        {language === 'ar' ? 'انقر على "توليد"' : 'Click “Generate”'}
      </h3>
    </div>
    <div className="bg-white p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <p className={`text-gray-800 leading-6 ${language === 'ar' ? 'text-right' : ''}`}>
        {language === 'ar'
          ? 'يقوم محركنا الذكي بإنشاء أسئلة مخصصة لنصك.'
          : 'Our smart engine creates questions tailored to your text.'}
      </p>
    </div>
  </div>

  {/* Box 3 */}
  <div className={`w-[280px] rounded-[10px] border-1 border- shadow-md overflow-hidden mt-[-20px] ${language === 'ar' ? 'ml-120' : 'ml-160'}`}>
    <div className="bg-[#FFB3B3] p-4 border-b border-black" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <h3 className={`text-xl font-bold text-black ${language === 'ar' ? 'text-right' : ''}`}>
        {language === 'ar' ? 'راجع واطبع' : 'Review & Print'}
      </h3>
    </div>
    <div className="bg-white p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <p className={`text-gray-800 leading-6 ${language === 'ar' ? 'text-right' : ''}`}>
        {language === 'ar'
          ? 'استعرض الأسئلة، ثم قم بتنزيلها أو طباعتها للفصل أو المنزل.'
          : 'Preview questions, then download or print for the classroom or home.'}
      </p>
    </div>
  </div>

  {/* Box 4 */}
  <div className={`w-[280px] rounded-[10px] border-1 border- shadow-md overflow-hidden mt-[-20px] ${language === 'ar' ? 'ml-70' : 'ml-210'}`}>
    <div className="bg-[#FFB3B3] p-4 border-b border-black" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <h3 className={`text-xl font-bold text-black ${language === 'ar' ? 'text-right' : ''}`}>
        {language === 'ar' ? 'تعلّم وتقدّم' : 'Learn & Grow'}
      </h3>
    </div>
    <div className="bg-white p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <p className={`text-gray-800 leading-6 ${language === 'ar' ? 'text-right' : ''}`}>
        {language === 'ar'
          ? 'دع الأطفال يجيبون، واحصل على تعليقات فورية، وشاهد مدى تطورهم في الفهم والثقة.'
          : 'Let kids answer, get instant feedback, and watch their comprehension and confidence.'}
      </p>
    </div>
  </div>

  <img src="/Group 33.png" className="mt-[150px] absolute" />
</div>



            <div className="h-250">
                <h2 className=" flex justify-center items-center px-16  text-[48px] font-semibold"> Features at a glance</h2>
                


            </div>

            <div className="bg-[#FFB3B3] h-250 mb-30">
  <img src="/Group 1.png" className="absolute mt-[-15px]" />
                <img src="/Quote mark.png" className={`absolute mt-[120px] px-30 ${language === 'ar' ? 'scale-x-[-1] ml-220' : ''}`} />

  <div className="py-45 px-55">
    <h2 className={`font-bold text-[48px] leading-tight ${language === 'ar' ? 'text-right' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {language === 'ar' ? 'قصص حقيقية من مستخدمين حقيقيين' : 'Real stories from real users'}
    </h2>
    <h4 className={`text-[22px] mb-10 ${language === 'ar' ? 'text-right mb-40' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {language === 'ar' ? 'استلهم من هذه القصص' : 'Get inspired by these stories'}
    </h4>

    {/* Card 1 */}
    <div className={`bg-[#FFFF] rounded-[10px] p-6 shadow w-[380px] px-10 ml-5 ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <img src="./Quote mark (1).png" className={`mb-2 ${language === 'ar' ? 'mr-[-15px] scale-x-[-1]' : 'ml-[-15px]'}`} />
      <h4 className="text-[18px]">
        {language === 'ar'
          ? 'لقد غيّرت هذه الأداة تمامًا طريقة تدريسي للقراءة. طلابي أكثر تفاعلاً، والأسئلة تساعدهم حقًا على التفكير!'
          : 'This tool has completely changed the way I teach reading. My students are more engaged, and the questions really help them think!'}
      </h4>
      <p className="text-[18px] font-semibold">{language === 'ar' ? 'الأستاذة ليلى' : 'Ms. Layla'}</p>
      <p className="text-[14px] text-gray-600">{language === 'ar' ? 'معلمة في المرحلة الابتدائية' : 'Primary School Teacher'}</p>
    </div>

    {/* Card 2 */}
    <div className={`bg-[#FFFF] rounded-[10px] p-4 shadow w-[480px] px-10 ml-105 mt-[-330px] ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <img src="./Quote mark (1).png" className={`mb-2 ${language === 'ar' ? 'mr-[-15px] scale-x-[-1]' : 'ml-[-15px]'}`} />
      <h4 className="text-[18px]">
        {language === 'ar'
          ? 'استخدمته مع ابني في المنزل، وطلب المزيد من الأسئلة! إنها أداة ممتعة وبسيطة ومفيدة جدًا.'
          : 'I used it with my son at home, and he actually asked for more questions. It’s fun, simple, and super helpful!'}
      </h4>
      <p className="text-[18px] font-semibold">{language === 'ar' ? 'أمينة' : 'Amina'}</p>
      <p className="text-[14px] text-gray-600">{language === 'ar' ? 'أم تقوم بتعليم أبنائها في المنزل' : 'Home schooling mom'}</p>
    </div>

    {/* Card 3 */}
    <div className={`bg-[#FFFF] rounded-[10px] p-4 shadow w-[380px] px-10 ml-105 mt-5 ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <img src="./Quote mark (1).png" className={`mb-2 ${language === 'ar' ? 'mr-[-15px] scale-x-[-1]' : 'ml-[-15px]'}`} />
      <h4 className="text-[18px]">
        {language === 'ar'
          ? 'أخيرًا، أداة ذكية تجعل قراءة اللغة العربية تفاعلية. الأسئلة الفورية توفر لي الكثير من وقت التحضير.'
          : 'Finally, a smart tool that makes Arabic reading interactive. The instant questions save me so much prep time'}
      </h4>
      <p className="text-[18px] font-semibold">{language === 'ar' ? 'الأستاذ يوسف' : 'Mr Youcef'}</p>
      <p className="text-[14px] text-gray-600">{language === 'ar' ? 'مدرس لغة' : 'Language tutor'}</p>
    </div>
  </div>

                <img src="./Group 79.png" className={`${language === 'ar' ? 'mt-[-40px]' : 'mt-[-30px]'} `} />
</div>



            <div className="w-150 max-w-4xl mx-auto mt-20 mb-20 px-4">
  <h2
    className={`flex justify-center items-center px-16 text-[48px] font-semibold mb-[-30px] ${
      language === 'ar' ? 'text-right' : ''
    }`}
    dir={language === 'ar' ? 'rtl' : 'ltr'}
  >
    {language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
  </h2>

  <img src="./ThreeDee Male (4).png" className="w-[100px]" />

  <div className="space-y-6" dir={language === 'ar' ? 'rtl' : ''}>
    {[
      {
        question: language === 'ar' ? 'ما هو My Quizzer؟' : 'What is My Quizzer?',
        answer: language === 'ar'
          ? 'هو منشئ اختبارات ممتعة باللغة العربية للأطفال يساعد على الفهم.'
          : "It's a fun Arabic quiz generator for kids that helps with comprehension."
      },
      {
        question: language === 'ar' ? 'هل هو مجاني؟' : 'Is it free to use?',
        answer: language === 'ar'
          ? 'نعم! يمكنك البدء باستخدامه مجانًا تمامًا.'
          : "Yes! It's completely free to get started."
      },
      {
        question: language === 'ar' ? 'هل يمكنني استخدامه على الهاتف؟' : 'Can I use it on mobile?',
        answer: language === 'ar'
          ? 'بالتأكيد! إنه مناسب للهواتف ويعمل على جميع الأجهزة.'
          : "Absolutely! It's mobile-friendly and works on all devices."
      }
    ].map((faq, index) => (
      <details key={index} className="bg-white border border-black rounded-x1 p-4 ">
        <summary className="text-lg font-semibold cursor-pointer">{faq.question}</summary>
        <p className="mt-2 text-gray-700">{faq.answer}</p>
      </details>
    ))}
  </div>
</div>






            
        </div>
    )
}

export default Body;