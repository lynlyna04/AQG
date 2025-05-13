import { useState } from "react";
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useLanguage } from './hooks/useLanguage'; // Import the hook
import axios from "axios"; // Import axios for HTTP requests
import * as pdfjsLib from "pdfjs-dist"; // Import PDF.js library

function Generate() {
  const { language } = useLanguage(); // Get current language

  // States to hold input text and output (generated questions)
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input text change
  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  // Handle the button click and generate questions
  const handleGenerateClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/generate", {
        text: inputText,
      });

      // Update outputText with the generated string from Flask
      setOutputText(response.data.generated);
    } catch (error) {
      console.error(error);
      setError(language === 'ar' ? "حدث خطأ أثناء إنشاء الأسئلة." : "An error occurred while generating questions.");
    } finally {
      setLoading(false);
    }
  };


  const handleSaveFile = () => {
    const fileType = 'text/plain'; // Can be set dynamically or prompted
    const fileName = 'generated_results.txt'; // You can also allow the user to choose the file name
  
    // Convert output text to a Blob (for .txt file)
    const blob = new Blob([outputText], { type: fileType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName; // Specify the filename
    link.click(); // Trigger the download
  };
  
  // Handle PDF upload
  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
  
    if (file) {
      // Check file type before processing
      if (file.type === 'application/pdf') {
        // Handle PDF file upload
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
            setInputText(pdfText); // Set the extracted text to inputText state
          } catch (error) {
            console.error("Error extracting PDF text:", error);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type === 'text/plain') {
        // Handle .txt file upload
        const reader = new FileReader();
        reader.onload = (e) => {
          setInputText(e.target.result); // Set text file content
        };
        reader.readAsText(file);
      } else {
        console.error("Invalid file type");
      }
    }
  };

  return (
    <>
      <Header/>
      <div
        className={`flex justify-center gap-6 mt-[170px] absolute ${language === 'ar' ? 'flex-row-reverse' : ''} ml-60`}
      >
        {/* Input Card */}
        <div className="w-[450px] rounded-[10px] border border-black shadow-md overflow-hidden">
          <div className="bg-[#FFB3B3] p-2 border-b border-black">
            <h3 className="text-l font-bold text-black" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {language === 'ar' ? 'أدخل النص العربي' : 'Enter your Arabic text'}
            </h3>
          </div>
          <div className="bg-white p-4 h-[150px]">
            <textarea
              className="w-full h-full text-gray-800 leading-6 p-2 rounded"
              placeholder={language === 'ar' ? 'أدخل النص هنا' : 'Enter your text here'}
              value={inputText}
              onChange={handleInputChange}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        

        {/* Output Card */}
        <div className="w-[350px] rounded-[10px] border border-black shadow-md overflow-hidden">
          <div className="bg-[#FFB3B3] p-2 border-b border-black">
            <h3 className="text-l font-bold text-black" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {language === 'ar' ? 'الأسئلة' : 'Questions'}
            </h3>
          </div>
          <div className="bg-white p-4">
            <p className="text-gray-800 leading-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {loading
                ? language === 'ar'
                  ? 'جارٍ إنشاء الأسئلة...'
                  : 'Generating questions...'
                : outputText}
            </p>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerateClick}
        className={`mt-96 bg-[#FFEF9D] text-[14px] font-semibold border-2 border-black px-6 py-2 rounded-[15px] hover:bg-[#FFE768] ${language === 'ar' ? 'ml-153' : 'ml-136'}`}
      >
        <div className={`flex items-center w-full ${language === 'ar' ? 'flex-row-reverse' : 'justify-between'}`}>
          <span>{language === 'ar' ? 'إنشاء' : 'Generate'}</span>
          <img
            src="/Icon.png"
            alt="icon"
            className={`w-4 h-4 ${language === 'ar' ? 'scale-x-[-1] mr-4' : 'ml-6'}`}
          />
        </div>
      </button>

      <div className={`absolute  ${language === 'ar' ? 'ml-183 mt-[-44px]' : 'ml-108 mt-[-40px]'}`}>
  {/* Hidden file input */}
  <input
    id="file-upload"
    type="file"
    accept=".pdf, .txt"
    onChange={handlePdfUpload}
    className="hidden"  // Hides the default file input
  />

  {/* Custom button */}
  <label
    htmlFor="file-upload"
    className="bg-[#FFEF9D] text-[14px] font-semibold border-2 border-black py-[11px] px-3 rounded-[15px] hover:bg-[#FFE768] cursor-pointer"
  >
    {language === 'ar' ? 'تحميل ملف ' : 'Upload file'}  {/* Custom label */}
  </label>
      </div>
      
      {/* Save Results Button */}
<button
  onClick={handleSaveFile}
  className={`bg-[#FFEF9D] text-[14px] ${language === 'ar' ? 'ml-[-480px]' : 'ml-62'} font-semibold border-2 border-black px-6 py-2 rounded-[15px] hover:bg-[#FFE768]`}
>
  {language === 'ar' ? 'حفظ النتيجة' : 'Save Result'}
</button>


      {/* Image */}
      <img src="./ni9er.png" className="w-[190px] mt-[-150px] ml-10" />
      <Footer />
      </>
  );
}

export default Generate;
