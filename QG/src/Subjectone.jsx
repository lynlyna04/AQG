import { useState } from "react";
import Header from './Header.jsx';
import { useLanguage } from './hooks/useLanguage';
import * as pdfjsLib from "pdfjs-dist";
import { useNavigate } from 'react-router-dom';

function Subjectone() {
  const { language } = useLanguage();
    const [inputText, setInputText] = useState("");
    const navigate = useNavigate();

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
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="bg-[#FFEF9D] text-[14px] font-semibold border-2 border-black py-[11px] px-4 rounded-[15px] hover:bg-[#FFE768] cursor-pointer"
            >
              {language === 'ar' ? 'تحميل ملف' : 'Upload File'}
            </label>
                  </div>
                  
                  <button
            onClick={() => navigate('/generate-subjectopt')}
            className="bg-[#FFEF9D] cursor-pointer text-[14px] font-semibold border-2 border-black px-6 py-2 rounded-[15px] hover:bg-[#FFE768]"
          >
            {language === 'ar' ? 'التالي' : 'Next'}
          </button>
        </div>

        {/* Optional image at bottom left */}
        <img src="./ni9er.png" className="w-[190px] mt-[-230px]  ml-[-800px]" />
      </div>
    </>
  );
}

export default Subjectone;
