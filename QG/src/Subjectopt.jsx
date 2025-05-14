import Header from "./Header.jsx";
import { useLanguage } from "./hooks/useLanguage";
import { useState, useEffect } from "react";


function Subjectopt() {

    const [i3rabCount, setI3rabCount] = useState(0);
    const [i3rabWords, setI3rabWords] = useState([]);

    const [qCount, setQCount] = useState(0);

  const { language } = useLanguage();
    const isArabic = language === "ar";
    
    const [previewText, setPreviewText] = useState("");

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
    // Remove punctuation and split text into words
    const words = text
      .replace(/[.,/#!$%^&*;:{}=\-_`~()[\]؟،«»]/g, "") // remove Arabic & English punctuation
      .split(/\s+/)
      .filter(Boolean); // remove empty strings
  
    // Shuffle the words randomly
    const shuffled = [...words].sort(() => 0.5 - Math.random());
  
    // Return the first `count` words
    return shuffled.slice(0, count);
  }
  
    


  return (
    <>
      <Header />
      <div
        className="flex flex-row justify-center items-start gap-10 mb-20 mt-[180px]"
        dir={isArabic ? "rtl" : "ltr"}
          >
              
              
        <h2 className="absolute mt-[-80px] text-[26px]">
          {isArabic ? "إنشاء الموضوع" : "Subject Generation"}
        </h2>

        {/* Left Block (always on left in JSX, reversed with flex-row-reverse) */}
        <div className="flex flex-col items-center">
          <div className="w-[550px] h-auto rounded-[10px] border border-black shadow-md overflow-hidden">
            <div className="bg-[#FFB3B3] p-2 border-b border-black">
              <h3 className="text-l font-bold text-black text-center">
                {isArabic ? "عوامل التصفية" : "Filters"}
              </h3>
            </div>
            <div className="bg-white px-14 py-8 h-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {isArabic ? "الفهم" : "Comprehension"}
              </h3>

              {/* Question 1 */}
              {/* Number of Comprehension Questions */}
<div className="flex items-center mb-6">
  <p className="text-gray-800 w-50">
    {isArabic ? "أسئلة الفهم :" : "Comprehension questions:"}
  </p>
                              <select className="border border-gray-400 rounded px-2 py-1"
                              value={qCount}
                              onChange={(e) => setQCount(parseInt(e.target.value))}>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
  </select>
</div>

{/* Number of Synonyms */}
<div className="flex items-center mb-6">
  <p className="text-gray-800 w-50">
    {isArabic ? "عدد المرادفات :" : "Number of synonyms:"}
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
    {isArabic ? "عدد الأضداد :" : "Number of antonyms:"}
  </p>
  <select className="border border-gray-400 rounded px-2 py-1">
    <option value="0">0</option>
    <option value="1">1</option>
    <option value="2">2</option>
  </select>
</div>


              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {isArabic ? "القواعد" : "Grammar"}
              </h3>

              {/* iʿrāb Question */}
<div className="flex items-center mb-6">
  <p className="text-gray-800 w-60">
    {isArabic ? "كم عدد الكلمات المطلوبة للإعراب؟" : "How many words for iʿrāb (parsing)?"}
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
    {isArabic ? "كم عدد الأفعال لتحديد الزمن؟" : "How many verbs to identify the tense?"}
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
    {isArabic ? "كم عدد الجمل لتحديد نوع الجملة؟" : "How many sentences to classify (nominal/verbal)?"}
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
    {isArabic ? "كم عدد الكلمات لتحديد نوع الكلمة؟" : "How many words to categorize (noun/verb/particle)?"}
  </p>
  <select className="border border-gray-400 rounded px-2 py-1">
    <option value="0">0</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
  </select>
</div>


            </div>
          </div>

          <button className="mt-4 bg-[#FFB3B3] text-black font-semibold px-6 py-2 rounded shadow hover:bg-[#ffa1a1] transition">
            {isArabic ? "إنشاء" : "Generate"}
          </button>
        </div>

        {/* Right Block (preview box) */}
        <div className="w-[550px] h-auto rounded-[10px] border border-black shadow-md overflow-hidden">
          <div className="bg-[#FFB3B3] p-2 border-b border-black">
            <h3 className="text-l font-bold text-black text-center">
              {isArabic ? "معاينة الموضوع" : "Subject Preview"}
            </h3>
          </div>
                  <div className="bg-white p-4 h-auto overflow-y-auto whitespace-pre-wrap text-gray-800 text-[15px] leading-6">
                      <h3 className="font-bold text-lg mb-4">{isArabic ? " النص" : "text"}</h3>
                      {previewText || (isArabic ? "لا يوجد محتوى للعرض." : "No content to preview.")}
                      {isArabic ? <h3 className="font-bold text-lg mt-6 mb-2">البناء الفكري:</h3> : <h3 className="font-bold text-lg mt-6 mb-2">Reading comprehension :</h3>}
                      {isArabic ? <h3 className="font-semi-bold text-lg mt-6 mb-1">1- اعط عنوان للنص .</h3> : <h3 className="font-bold text-lg mt-6 mb-1">I'rab</h3>}
                      {isArabic ? <h3 className="font-semi-bold text-lg mt-6 mb-1">2- .</h3> : <h3 className="font-bold text-lg mt-6 mb-1">I'rab</h3>}
                      {isArabic ? <h3 className="font-bold text-lg mt-6 mb-2">البناء اللغوي :</h3> : <h3 className="font-bold text-lg mt-6 mb-2">Grammar :</h3>}
                      {isArabic ? <h3 className="font-semi-bold text-lg mt-6 mb-2">1- اعرب الكلمات التالية :</h3> : <h3 className="font-bold text-lg mt-6 mb-2">I'rab</h3>}

                      {i3rabWords.length > 0 && (
  <table className="w-full border border-gray-300 text-sm mt-2">
    <thead>
      <tr className="bg-gray-100 text-left">
        <th className="border px-2 py-1 text-right">{isArabic ? "الكلمة" : "Word"}</th>
        <th className="border px-2 py-1 text-right">{isArabic ? "الإعراب" : "I'rab"}</th>
      </tr>
    </thead>
    <tbody>
      {i3rabWords.map((word, index) => (
        <tr key={index}>
          <td className="border px-2 py-1">{word}</td>
          <td className="border px-2 py-1">{isArabic ? "..." : "..."}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}


                  </div>

        </div>
      </div>
    </>
  );
}

export default Subjectopt;
