import { useState } from "react";
import Header from './Header.jsx';
import { useLanguage } from './hooks/useLanguage';
import * as pdfjsLib from "pdfjs-dist";
import { useNavigate } from 'react-router-dom';

function Subjectone() {
  const { language } = useLanguage();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [subjectOptions, setSubjectOptions] = useState([]);
  const isArabic = language === 'ar';

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };
    
  const handleNext = async () => {
    if (!inputText.trim()) {
      alert(isArabic ? 'الرجاء إدخال نص أولاً' : 'Please enter text first');
      return;
    }

    setIsLoading(true);
    
    try {
      // Save the text immediately
      localStorage.setItem('subjectText', inputText);
      
      // Generate questions and wait for completion
      await generateQuestions();
      
      // Save the generated options
      localStorage.setItem('subjectOptions', JSON.stringify(subjectOptions));
      
      // Navigate after everything is saved
      navigate('/generate-subjectopt');
    } catch (error) {
      console.error("Error in processing:", error);
      alert(isArabic ? 'حدث خطأ أثناء المعالجة' : 'An error occurred during processing');
      setIsLoading(false);
    }
  };
      
  async function generateQuestions() {
    try {
      const response = await fetch("http://localhost:5000/generate-subjectopt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubjectOptions(data.subject_options);
        // Return the data to ensure we wait for completion
        return data.subject_options;
      } else {
        console.error("Error:", data.error);
        // If the server returned an error, create default questions
        const defaultOptions = [
          isArabic ? "ما هي الفكرة الرئيسية للنص؟" : "What is the main idea of the text?",
          isArabic ? "ما هو الهدف من النص؟" : "What is the purpose of the text?",
          isArabic ? "كيف تصف أسلوب الكاتب؟" : "How would you describe the author's style?"
        ];
        setSubjectOptions(defaultOptions);
        return defaultOptions;
      }
    } catch (error) {
      console.error("Failed to generate:", error);
      // If the API call fails completely, create default questions
      const defaultOptions = [
        isArabic ? "ما هي الفكرة الرئيسية للنص؟" : "What is the main idea of the text?",
        isArabic ? "ما هو الهدف من النص؟" : "What is the purpose of the text?",
        isArabic ? "كيف تصف أسلوب الكاتب؟" : "How would you describe the author's style?"
      ];
      setSubjectOptions(defaultOptions);
      return defaultOptions;
    }
  }

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        if (file.type === 'application/pdf') {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const pdfData = new Uint8Array(e.target.result);
            try {
              const pdfDoc = await pdfjsLib.getDocument(pdfData).promise;
              let pdfText = "";
              for (let i = 1; i <= pdfDoc.numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const textContent = await page.getTextContent();
                pdfText += textContent.items.map(item => item.str).join(" ") + "\n";
              }
              setInputText(pdfText);
              setIsLoading(false);
            } catch (error) {
              console.error("Error extracting PDF text:", error);
              setIsLoading(false);
            }
          };
          reader.readAsArrayBuffer(file);
        } else if (file.type === 'text/plain') {
          const reader = new FileReader();
          reader.onload = (e) => {
            setInputText(e.target.result);
            setIsLoading(false);
          };
          reader.readAsText(file);
        } else {
          console.error("Invalid file type");
          alert(isArabic ? 'نوع الملف غير صالح' : 'Invalid file type');
          setIsLoading(false);
        }
      } catch (error) {
        console.error("File processing error:", error);
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center mt-[100px]">
        <h2 className="mb-8 text-[26px]" dir={isArabic ? 'rtl' : 'ltr'}>
          {isArabic ? 'إنشاء الموضوع' : 'Subject Generation'}
        </h2>
        
        {/* Input Box */}
        <div className="w-[500px] rounded-[10px] h-60 border border-black shadow-md overflow-hidden mb-6">
          <div className="bg-[#FFB3B3] p-2 border-b border-black">
            <h3 className="text-l font-bold text-black text-center" dir={isArabic ? 'rtl' : 'ltr'}>
              {isArabic ? 'أدخل النص العربي' : 'Enter your Arabic text'}
            </h3>
          </div>
          <div className="bg-white p-4 h-[150px]">
            <textarea
              className="w-full h-40 text-gray-800 leading-6 p-2 rounded"
              placeholder={isArabic ? 'أدخل النص هنا' : 'Enter your text here'}
              value={inputText}
              onChange={handleInputChange}
              dir='rtl'
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex gap-4">
          {/* Upload Button */}
          <div className="mt-[8px]">
            <input
              id="file-upload"
              type="file"
              accept=".pdf, .txt"
              onChange={handlePdfUpload}
              className="hidden"
              disabled={isLoading}
            />
            <label
              htmlFor="file-upload"
              className={`bg-[#FFEF9D] text-[14px] font-semibold border-2 border-black py-[11px] px-4 rounded-[15px] ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FFE768] cursor-pointer'}`}
            >
              {isArabic ? 'تحميل ملف' : 'Upload File'}
            </label>
          </div>
                  
          <button
            onClick={handleNext}
            disabled={isLoading || !inputText.trim()}
            className={`bg-[#FFEF9D] text-[14px] font-semibold border-2 border-black px-6 py-2 rounded-[15px] ${isLoading || !inputText.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FFE768] cursor-pointer'}`}
          >
            {isLoading ? (isArabic ? 'جاري المعالجة...' : 'Processing...') : (isArabic ? 'التالي' : 'Next')}
          </button>
        </div>

        {/* Optional image at bottom left */}
        <img src="./ni9er.png" className="w-[190px] mt-[-230px] ml-[-800px]" alt="" />
      </div>
    </>
  );
}

export default Subjectone;