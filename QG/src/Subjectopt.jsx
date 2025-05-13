import Header from "./Header.jsx";
import { useLanguage } from "./hooks/useLanguage";

function Subjectopt() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

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
              <div className="flex items-center mb-6">
                <p className="text-gray-800 w-28">
                  {isArabic ? "السؤال 1:" : "Question 1:"}
                </p>
                <select className="border border-gray-400 rounded px-4 py-1">
                  <option value="mcq">{isArabic ? "اختيار من متعدد" : "Multiple Choice"}</option>
                  <option value="truefalse">{isArabic ? "صح / خطأ" : "True / False"}</option>
                  <option value="open">{isArabic ? "سؤال مفتوح" : "Open-ended"}</option>
                </select>
              </div>

              {/* Question 2 */}
              <div className="flex items-center mb-6">
                <p className="text-gray-800 w-28">
                  {isArabic ? "السؤال 2:" : "Question 2:"}
                </p>
                <select className="border border-gray-400 rounded px-4 py-1">
                  <option value="mcq">{isArabic ? "اختيار من متعدد" : "Multiple Choice"}</option>
                  <option value="truefalse">{isArabic ? "صح / خطأ" : "True / False"}</option>
                  <option value="open">{isArabic ? "سؤال مفتوح" : "Open-ended"}</option>
                </select>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {isArabic ? "القواعد" : "Grammar"}
              </h3>

              {/* Question 3 */}
              <div className="flex items-center mb-6">
                <p className="text-gray-800 w-28">
                  {isArabic ? "السؤال 3:" : "Question 3:"}
                </p>
                <select className="border border-gray-400 rounded px-4 py-1">
                  <option value="mcq">{isArabic ? "اختيار من متعدد" : "Multiple Choice"}</option>
                  <option value="truefalse">{isArabic ? "صح / خطأ" : "True / False"}</option>
                  <option value="open">{isArabic ? "سؤال مفتوح" : "Open-ended"}</option>
                </select>
              </div>

              {/* Question 4 */}
              <div className="flex items-start mb-6">
                <p className="text-gray-800 w-28 mt-2">
                  {isArabic ? "السؤال 4:" : "Question 4:"}
                </p>
                <textarea
                  className="border border-gray-400 rounded px-4 py-2 w-[300px] h-[80px]"
                  placeholder={
                    isArabic ? "اكتب سؤالك المخصص هنا..." : "Type your custom question here..."
                  }
                ></textarea>
              </div>
            </div>
          </div>

          <button className="mt-4 bg-[#FFB3B3] text-black font-semibold px-6 py-2 rounded shadow hover:bg-[#ffa1a1] transition">
            {isArabic ? "إنشاء" : "Generate"}
          </button>
        </div>

        {/* Right Block (preview box) */}
        <div className="w-[550px] h-100 rounded-[10px] border border-black shadow-md overflow-hidden">
          <div className="bg-[#FFB3B3] p-2 border-b border-black">
            <h3 className="text-l font-bold text-black text-center">
              {isArabic ? "معاينة الموضوع" : "Subject Preview"}
            </h3>
          </div>
          <div className="bg-white p-4 h-[150px]">
            {/* Empty content for now */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Subjectopt;
