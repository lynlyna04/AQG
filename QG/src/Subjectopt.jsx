import Header from "./Header.jsx";
import { useLanguage } from "./hooks/useLanguage";
import { useState, useEffect } from "react";

function Subjectopt() {
  const [i3rabCount, setI3rabCount] = useState(0);
  const [i3rabWords, setI3rabWords] = useState([]);
  const [qCount, setQCount] = useState(0);
  const [userInputWords, setUserInputWords] = useState("");
  const [parsedWords, setParsedWords] = useState([]);
  const [previewText, setPreviewText] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(3); // default fallback
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get language from context - this will be used only for the left panel
  const { language } = useLanguage();
  
  // For the preview block, always use Arabic settings regardless of useLanguage
  const previewIsArabic = true;
  
  function handleParseWords() {
    const words = userInputWords
      .split(/[,،]/) // Regex to split on either , or ،
      .map(word => word.trim())
      .filter(Boolean);
    setParsedWords(words);
  }

  useEffect(() => {
    const savedText = localStorage.getItem("subjectText");
    if (savedText) {
      setPreviewText(savedText);
    }
  }, []);
      
  useEffect(() => {
    if (i3rabCount > 0 && previewText) {
      const selectedWords = getRandomWords(previewText, i3rabCount);
      setI3rabWords(selectedWords);
    } else {
      setI3rabWords([]);
    }
  }, [i3rabCount, previewText]);
  
  function getRandomWords(text, count) {
    const words = text
      .replace(/[.,/#!$%^&*;:{}=\-_`~()[\]؟،«»]/g, "") // remove Arabic & English punctuation
      .split(/\s+/)
      .filter(Boolean); // remove empty strings

    // Shuffle the words randomly
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    
    // Return the first `count` words
    return shuffled.slice(0, count);
  }
  
  useEffect(() => {
    const storedOptions = localStorage.getItem('subjectQuestions'); // ✅ correct key
    const storedCount = localStorage.getItem('questionCount');
  
    if (storedOptions) {
      setSubjectOptions(JSON.parse(storedOptions));
    }
  
    if (storedCount) {
      setTotalQuestions(parseInt(storedCount));
      setQCount(1);
    }
  }, []);
  
  const handleGenerateClick = () => {
    setIsLoading(true);
    
    // Simulate loading with a timeout
    setTimeout(() => {
      setIsLoading(false);
      setShowPreview(true);
    }, 1500); // 1.5 seconds loading time
  };

  return (
    <>
      <Header />
      <div
        className="flex flex-row justify-center items-start gap-10 mb-20 mt-[180px]"
        dir={language === "ar" ? "rtl" : "ltr"}
      >          
        <h2 className="absolute mt-[-80px] text-[26px]">
          {language === "ar" ? "إنشاء الموضوع" : "Subject Generation"}
        </h2>
        {/* Left Block (filters) */}
        <div className="flex flex-col items-center">
          <div className="w-[550px] h-auto rounded-[10px] border border-black shadow-md overflow-hidden">
            <div className="bg-[#FFB3B3] p-2 border-b border-black">
              <h3 className="text-l font-bold text-black text-center">
                عوامل التصفية
              </h3>
            </div>
            <div className="bg-white px-14 py-8 h-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === "ar" ? "الفهم" : "Comprehension"}
              </h3>

              {/* Question 1 */}
              {/* Number of Comprehension Questions */}
              <div className="flex items-center mb-6">
                <p className="text-gray-800 w-50">
                  {language === "ar" ? "أسئلة الفهم :" : "Comprehension questions:"}
                </p>
                <select
                  className="border border-gray-400 rounded px-2 py-1 mr-2"
                  value={qCount}
                  onChange={(e) => setQCount(parseInt(e.target.value))}
                >
                  {Array.from({ length: totalQuestions }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Synonyms */}
              <div className="flex items-center mb-6">
                <p className="text-gray-800 w-50">
                  عدد المرادفات :
                </p>
                <select className="border border-gray-400 rounded px-2 py-1">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>

              {/* Number of Antonyms */}
              <div className="flex items-center mb-6">
                <p className="text-gray-800 w-50">
                  عدد الأضداد :
                </p>
                <select className="border border-gray-400 rounded px-2 py-1">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-4">
                القواعد
              </h3>

              {/* iʿrāb Question */}
              <div className="flex items-center mb-6">
                <p className="text-gray-800 w-60">
                  كم عدد الكلمات المطلوبة للإعراب؟
                </p>
                <select
                  className="border border-gray-400 rounded px-2 py-1"
                  value={i3rabCount}
                  onChange={(e) => setI3rabCount(parseInt(e.target.value))}
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

              {/* Tense Identification */}
              <div className="flex items-center mb-6">
                <p className="text-gray-800 w-60">
                  كم عدد الأفعال لتحديد الزمن؟
                </p>
                <select className="border border-gray-400 rounded px-2 py-1">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
                          
              <div className="flex items-center mb-6">
                <p className="text-gray-800 w-60">
                  كم عدد الجمل لتحديد نوع الجملة؟
                </p>
                <select className="border border-gray-400 rounded px-2 py-1">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

              <div className="flex items-center mb-6">
                <p className="text-gray-800 w-60">
                  كم عدد الكلمات لتحديد نوع الكلمة؟
                </p>
                <select className="border border-gray-400 rounded px-2 py-1">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <textarea
                  className="flex-grow border border-gray-300 p-2 rounded text-sm"
                  rows="2"
                  placeholder="أدخل الكلمات مفصولة بفواصل"
                  value={userInputWords}
                  onChange={(e) => setUserInputWords(e.target.value)}
                />
                <button
                  onClick={handleParseWords}
                  className="bg-[#FFB3B3] text-black font-semibold px-3 py-1 rounded shadow hover:bg-[#ffa1a1] transition text-sm"
                >
                  تحليل
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleGenerateClick}
            className="mt-4 bg-[#FFB3B3] text-black font-semibold px-6 py-2 rounded shadow hover:bg-[#ffa1a1] transition"
          >
            إنشاء
          </button>
        </div>

        {/* Right Block (preview box) - Conditionally rendered, always in Arabic */}
        {(showPreview || isLoading) && (
          <div className="w-[550px] h-auto rounded-[10px] border border-black shadow-md overflow-hidden">
            <div className="bg-[#FFB3B3] p-2 border-b border-black">
              <h3 className="text-l font-bold text-black text-center">
                معاينة الموضوع
              </h3>
            </div>
            
            {isLoading ? (
              <div className="bg-white p-4 h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FFB3B3] border-r-transparent align-[-0.125em]" role="status">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      جار التحميل...
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">جار إنشاء الموضوع...</p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 h-auto overflow-y-auto whitespace-pre-wrap text-gray-800 text-[15px] leading-6" dir="rtl">
                <h3 className="font-bold text-lg mb-4">النص</h3>
                {previewText || "لا يوجد محتوى للعرض."}
                
                <h3 className="font-bold text-lg mt-6 mb-2">البناء الفكري:</h3>
                <h3 className="font-semibold text-lg mt-6 mb-1">1- اعط عنوان للنص.</h3>
                <h3 className="font-semibold text-lg mt-1 mb-2">2- اجب على الاسئلة التالية:</h3>
                <ul className="list-disc mr-6 text-lg text-gray-700 px-4">
                  {subjectOptions.slice(0, qCount).map((opt, index) => (
                    <li key={index}>
                      {opt}
                    </li>
                  ))}
                </ul>

                <h3 className="font-bold text-lg mt-6 mb-2">البناء اللغوي:</h3>
                <h3 className="font-semi-bold text-lg mt-6 mb-2">1- اعرب الكلمات التالية:</h3>
                {i3rabWords.length > 0 && (
                  <table className="w-full border border-gray-300 text-sm mt-2">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border w-20 px-2 py-1 text-right">الكلمة</th>
                        <th className="border px-2 py-1 text-right">الإعراب</th>
                      </tr>
                    </thead>
                    <tbody>
                      {i3rabWords.map((word, index) => (
                        <tr key={index}>
                          <td className="border px-2 py-1">{word}</td>
                          <td className="border px-2 py-1">...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                
                <h3 className="font-semi-bold text-lg mt-6 mb-2">2- اكمل الجدول التالي:</h3>
                {parsedWords.length > 0 && (
                  <table className="w-full border border-gray-300 text-sm mt-2">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-2 py-1 text-right">الكلمة</th>
                        <th className="border px-2 py-1 text-right">النوع</th>
                        <th className="border px-2 py-1 text-right">الوظيفة</th>
                        <th className="border px-2 py-1 text-right">الملاحظات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedWords.map((word, index) => (
                        <tr key={index}>
                          <td className="border px-2 py-1">{word}</td>
                          <td className="border px-2 py-1">...</td>
                          <td className="border px-2 py-1">...</td>
                          <td className="border px-2 py-1">...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Subjectopt;