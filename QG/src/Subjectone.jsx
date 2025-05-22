import { useState } from "react";
import Header from './Header.jsx';
import { useLanguage } from './hooks/useLanguage';
import * as pdfjsLib from "pdfjs-dist";
import { useNavigate } from 'react-router-dom';

function Subjectone() {
  const { language } = useLanguage();
    const [inputText, setInputText] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const isArabic = language === 'ar';

  const handleInputChange = (event) => {
    setInputText(event.target.value);
    };
    

    const handlePdfUpload = async (event) => {
      const file = event.target.files[0];
      if (file) {
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
            } catch (error) {
              console.error("Error extracting PDF text:", error);
            }
          };
          reader.readAsArrayBuffer(file);
        } else if (file.type === 'text/plain') {
          const reader = new FileReader();
          reader.onload = (e) => {
            setInputText(e.target.result);
          };
          reader.readAsText(file);
        } else {
          console.error("Invalid file type");
        }
      }
    };
    const [allExtractedVerbs, setAllExtractedVerbs] = useState([]); // from Gemini
    const extractInfinitiveVerbs = async () => {
      if (!inputText.trim()) {
        alert("النص فارغ!");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/extract-verbs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: inputText,
            api_key: "AIzaSyAf33OMbH4JU7PhK48GgjK3rZLxJR3K6Qg",
          }),
        });

        const result = await res.json();
        console.log("Raw API result:", result);
        
        let verbList = [];
        
        if (Array.isArray(result.verbs)) {
          verbList = result.verbs;
        } else if (typeof result.verbs === "string") {
          const cleaned = result.verbs.replace(/[\[\]'"]+/g, "").trim();
          verbList = cleaned.split(/[,\،]/).map(v => v.trim()).filter(Boolean);
        }

        if (verbList.length === 0) {
          alert("لم يتم العثور على أفعال.");
          setAllExtractedVerbs(["لم يتم العثور على أفعال."]);
          localStorage.setItem('allExtractedVerbs', JSON.stringify(["لم يتم العثور على أفعال."])); // ✅ Store here
          return;
        }

        setAllExtractedVerbs(verbList);
        localStorage.setItem('allExtractedVerbs', JSON.stringify(verbList)); // ✅ Store here with actual data
      } catch (error) {
        console.error("Error extracting verbs:", error);
        alert("فشل في استخراج الأفعال.");
      } 
    };

    const handleNext = async () => {
        setIsLoading(true);
        await extractInfinitiveVerbs(); // Call the verb extraction function first
        try {
          const response = await fetch("http://localhost:5000/generate-subject", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: inputText }),
          });
      
          const data = await response.json();
            console.log(data);
          if (response.ok) {
            const subjectOptions = data.subject_options || [];
            localStorage.setItem('subjectText', inputText);
            localStorage.setItem('subjectQuestions', JSON.stringify(subjectOptions));
            localStorage.setItem('questionCount', subjectOptions.length);
            navigate('/generate-subjectopt');
          } else {
            console.error("Error:", data.error);
          }
        } catch (error) {
          console.error("Failed to fetch subject options:", error);
          setIsLoading(false);
        }
    };
      

  return (
    <>
          <Header />
          <div className="flex flex-col items-center justify-center mt-[100px]">
          <h2 className="mb-8 text-[26px]">Subject Generation</h2>
        {/* Input Box */}
        <div className="w-[500px] rounded-[10px] h-60 border border-black shadow-md overflow-hidden mb-6">
          <div className="bg-[#FFB3B3] p-2 border-b border-black">
            <h3 className="text-l font-bold text-black text-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {language === 'ar' ? 'أدخل النص العربي' : 'Enter your Arabic text'}
            </h3>
          </div>
          <div className="bg-white p-4 h-[150px]">
            <textarea
              className="w-full h-40 text-gray-800 leading-6 p-2 rounded"
              placeholder={language === 'ar' ? 'أدخل النص هنا' : 'Enter your text here'}
              value={inputText}
              onChange={handleInputChange}
              dir='rtl'
            />
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex gap-4 ">

          {/* Upload Button */}
          <div className={` ${language === 'ar' ? 'mt-[8px]' : 'mt-[8px]'}`}>
            <input
              id="file-upload"
              type="file"
              accept=".pdf, .txt"
              onChange={handlePdfUpload}
              disabled={isLoading}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              
              className={`bg-[#FFEF9D] text-[14px] font-semibold border-2 border-black py-[11px] px-4 rounded-[15px] ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FFE768] cursor-pointer'}`}
            >
              {language === 'ar' ? 'تحميل ملف' : 'Upload File'}
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
        <img src="./ni9er.png" className="w-[190px] mt-[-230px]  ml-[-800px]" />
      </div>
    </>
  );
}

export default Subjectone;