import Header from "./Header.jsx";
import { useLanguage } from "./hooks/useLanguage";
import { useState, useEffect } from "react";

function Subjectopt() {
  const [i3rabWords, setI3rabWords] = useState([]);
  const [i3rabInput, setI3rabInput] = useState(""); // New state for i3rab input field
  const [qCount, setQCount] = useState(0);
  const [userInputWords, setUserInputWords] = useState('');
  const [synoWords, setUserSynoWords] = useState("");
  const [parsedWords, setParsedWords] = useState([]);
  const [previewText, setPreviewText] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(3); // default fallback
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Store temporary values that will be applied to preview only when generate is clicked
  const [tempQCount, setTempQCount] = useState(0);
  
  // Get language from context - this will be used only for the left panel
  const { language } = useLanguage();
  const [antonymsInput, setAntonymsInput] = useState("");
  const [parsedAntonyms, setParsedAntonyms] = useState([]);
  const [parsedSyno, setParsedSyno] = useState([]);
  const [transformType, setTransformType] = useState("مثنى"); // Default transformation type
  const [transformInput, setTransformInput] = useState(""); 
  
  // New states for تعليل (grammatical reasoning)
  const [taleelType, setTaleelType] = useState("همزة");
  const [taleelWords, setTaleelWords] = useState("");
  const [parsedTaleelWords, setParsedTaleelWords] = useState([]);
  
  // New states for verb conjugation (تصريف الأفعال)
  const [verbInput, setVerbInput] = useState("");
  const [parsedVerbs, setParsedVerbs] = useState([]);
  const [pronounsInput, setPronounsInput] = useState("أنا, أنتَ, أنتِ, هو, هي, نحن, أنتم, أنتن, هم, هن");
  const [parsedPronouns, setParsedPronouns] = useState([]);
  const [verbTense, setVerbTense] = useState("الماضي");
  

  
  const handleChange = (event) => {
    setUserInputWords(event.target.value);
  };

  // Handler for i3rab input changes
  const handleI3rabInputChange = (event) => {
    setI3rabInput(event.target.value);
  };
  
  function handleParseWords() {
    const words = userInputWords
      .split(/[,،]/) // Regex to split on either , or ،
      .map(word => word.trim())
      .filter(Boolean);
    setParsedWords(words);
  }
    
  function handleParseAntonyms() {
    const words = antonymsInput
      .split(/[,،]/)
      .map(word => word.trim())
      .filter(Boolean);
    setParsedAntonyms(words);
  }
    
  function handleParseSyno() {
    const words = synoWords
      .split(/[,،]/)
      .map(word => word.trim())
      .filter(Boolean);
    setParsedSyno(words);
  }
  
  // Function to parse and set i3rab words from the input
  function handleParseI3rab() {
    const words = i3rabInput
      .split(/[,،]/)
      .map(word => word.trim())
      .filter(Boolean);
    setI3rabWords(words);
  }
  
  // Function to parse and set تعليل words from input
  function handleParseTaleelWords() {
    const words = taleelWords
      .split(/[,،]/)
      .map(word => word.trim())
      .filter(Boolean);
    setParsedTaleelWords(words);
  }
  
  // Function to parse and set verbs from input
  function handleParseVerbs() {
    const verbs = verbInput
      .split(/[,،]/)
      .map(verb => verb.trim())
      .filter(Boolean);
    setParsedVerbs(verbs);
  }
  
  // Function to parse and set pronouns from input
  function handleParsePronouns() {
    const pronouns = pronounsInput
      .split(/[,،]/)
      .map(pronoun => pronoun.trim())
      .filter(Boolean);
    setParsedPronouns(pronouns);
  }
    
  const handleTransformTypeChange = (event) => {
    setTransformType(event.target.value);
  };
    
  const handleTransformInputChange = (event) => {
    setTransformInput(event.target.value);
  };
  
  // Handlers for تعليل (reasoning) input and type
  const handleTaleelTypeChange = (event) => {
    setTaleelType(event.target.value);
  };
  
  const handleTaleelWordsChange = (event) => {
    setTaleelWords(event.target.value);
  };
  
  // Handlers for verb conjugation inputs
  const handleVerbInputChange = (event) => {
    setVerbInput(event.target.value);
  };
  
  const handlePronounsInputChange = (event) => {
    setPronounsInput(event.target.value);
  };
  
  const handleVerbTenseChange = (event) => {
    setVerbTense(event.target.value);
  };

  useEffect(() => {
    const savedText = localStorage.getItem("subjectText");
    if (savedText) {
      setPreviewText(savedText);
    }
  }, []);
      
  useEffect(() => {
    const storedOptions = localStorage.getItem('subjectQuestions'); // ✅ correct key
    const storedCount = localStorage.getItem('questionCount');
  
    if (storedOptions) {
      setSubjectOptions(JSON.parse(storedOptions));
    }
  
    if (storedCount) {
      setTotalQuestions(parseInt(storedCount));
      setTempQCount(1); // Initial value for the UI dropdown
    }
  }, []);
  
  const handleGenerateClick = () => {
    setIsLoading(true);
  
    // Apply the temporary values
    setQCount(tempQCount);
    handleParseSyno();
    handleParseAntonyms();
    handleParseWords();
    handleParseI3rab(); // Parse the i3rab words on generate click
    handleParseTaleelWords(); // Parse تعليل words on generate click
    handleParseVerbs(); // Parse verbs for conjugation
    handleParsePronouns(); // Parse pronouns for conjugation table
  
    setTimeout(() => {
      setIsLoading(false);
      setShowPreview(true);
    }, 1500);
  };
  
    
  const downloadPdf = async () => {
    try {
      // Find the content element to export
      const contentDiv = document.getElementById('export-content');
    
      if (!contentDiv) {
        alert("Export content not found in the DOM.");
        return;
      }
    
      // Show loading indicator (optional)
      const loadingIndicator = document.createElement('div');
      loadingIndicator.textContent = 'Generating PDF...';
      loadingIndicator.style.position = 'fixed';
      loadingIndicator.style.top = '50%';
      loadingIndicator.style.left = '50%';
      loadingIndicator.style.transform = 'translate(-50%, -50%)';
      loadingIndicator.style.padding = '20px';
      loadingIndicator.style.backgroundColor = 'rgba(0,0,0,0.7)';
      loadingIndicator.style.color = 'white';
      loadingIndicator.style.borderRadius = '5px';
      loadingIndicator.style.zIndex = '1000';
      document.body.appendChild(loadingIndicator);
      
      // Process tables to ensure they're visible in PDF
      const processTablesForPdf = () => {
        // Create a deep clone of the content to avoid modifying the original
        const contentClone = contentDiv.cloneNode(true);
        
        // Find all tables in the clone
        const tables = contentClone.querySelectorAll('table');
        
        // Process each table
        tables.forEach((table) => {
          // Ensure tables have explicit width
          table.style.width = '100%';
          table.style.borderCollapse = 'collapse';
          table.style.pageBreakInside = 'auto';
          
          // Process all cells
          const cells = table.querySelectorAll('th, td');
          cells.forEach((cell) => {
            cell.style.border = '1px solid #ddd';
            cell.style.padding = '8px';
          });
          
          // Style headers
          const headers = table.querySelectorAll('th');
          headers.forEach((header) => {
            header.style.backgroundColor = '#f2f2f2';
            header.style.fontWeight = 'bold';
          });
        });
        
        return contentClone.innerHTML;
      };
    
      // Get processed HTML content
      const htmlContent = processTablesForPdf();
    
      // Send request to backend
      const res = await fetch('http://localhost:5000/generate-pdf', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ htmlContent }),
      });
    
      // Remove loading indicator
      document.body.removeChild(loadingIndicator);
    
      // Handle error responses
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        if (errorData && errorData.error) {
          alert(`Error: ${errorData.error}\n${errorData.solution || ''}`);
        } else {
          alert(`Error generating PDF: ${res.status} ${res.statusText}`);
        }
        return;
      }
    
      // Process successful response
      const blob = await res.blob();
      
      // Check if we got a valid PDF (basic check)
      if (blob.type !== 'application/pdf' && blob.type !== 'application/octet-stream') {
        alert(`Received invalid response type: ${blob.type}. Expected PDF.`);
        return;
      }
      
      // Create object URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      alert(`Failed to generate PDF: ${error.message}`);
    }
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
                <p className="text-gray-800 w-37">
                  {language === "ar" ? "أسئلة الفهم :" : "Comprehension questions:"}
                </p>
                <select
                  className="border border-gray-400 rounded px-2 py-1"
                  value={tempQCount}
                  onChange={(e) => setTempQCount(parseInt(e.target.value))}
                >
                  {Array.from({ length: totalQuestions }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Synonyms */}
              <div className="flex items-center mb-6 gap-2">
                <p className="text-gray-800 w-35">
                  {language === "ar" ? "أدخل المرادفات:" : "Give synonyms:"}
                </p>
                <input
                  type="text"
                  placeholder={language === "ar" ? "افصل بين الكلمات بفواصل" : "Enter synonyms separated by commas"}
                  className="flex-grow border border-gray-400 rounded px-2 py-1 text-sm"
                  value={synoWords}
                  onChange={(e) => setUserSynoWords(e.target.value)}
                />
              </div>

              {/* Antonyms Input */}
              <div className="flex items-center mb-6 gap-2">
                <p className="text-gray-800 w-35">
                  {language === "ar" ? "أدخل الأضداد:" : "Enter antonyms:"}
                </p>
                <input
                  type="text"
                  className="flex-grow border border-gray-400 rounded px-2 py-1 text-sm"
                  placeholder={language === "ar" ? "افصل بين الكلمات بفواصل" : "Separate with commas"}
                  value={antonymsInput}
                  onChange={(e) => setAntonymsInput(e.target.value)}
                />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === "ar" ? "القواعد" : "Grammar"}
              </h3>

              {/* I3rab Input Field - New field for i3rab words */}
              <div className="flex items-center gap-2 mb-6">
                <p className="text-gray-800 w-35">
                  {language === "ar" ? "أدخل كلمات الإعراب:" : "Enter i3rab words:"}
                </p>
                <input
                  type="text"
                  className="flex-grow border border-gray-400 rounded px-2 py-1 text-sm"
                  placeholder={language === "ar" ? "افصل بين الكلمات بفواصل" : "Separate with commas"}
                  value={i3rabInput}
                  onChange={handleI3rabInputChange}
                />
              </div>
              
              {/* تعليل (Grammatical reasoning) section */}
              <div className="flex items-center mb-6 gap-2">
                <p className="text-gray-800 w-35">
                  {language === "ar" ? "نوع التعليل:" : "Reasoning type:"}
                </p>
                <select
                  className="border border-gray-400 rounded px-2 py-1"
                  value={taleelType}
                  onChange={handleTaleelTypeChange}
                >
                  <option value="همزة">همزة</option>
                  <option value="تاء مفتوحة">تاء مفتوحة</option>
                  <option value="تاء مربوطة">تاء مربوطة</option>
                  <option value="ألف لينة">ألف لينة</option>
                </select>
              </div>
              
              {/* تعليل words input */}
              <div className="flex items-center mb-6 gap-2">
                <p className="text-gray-800 w-35">
                  {language === "ar" ? "أدخل كلمات التعليل:" : "Enter reasoning words:"}
                </p>
                <input
                  type="text"
                  className="flex-grow border border-gray-400 rounded px-2 py-1 text-sm"
                  placeholder={language === "ar" ? "افصل بين الكلمات بفواصل" : "Separate with commas"}
                  value={taleelWords}
                  onChange={handleTaleelWordsChange}
                />
              </div>
              
              {/* Transformation selector */}
              <div className="flex items-center mb-6 gap-2">
                <p className="text-gray-800 w-35">
                  {language === "ar" ? "نوع التحويل:" : "Transformation type:"}
                </p>
                <select
                  className="border border-gray-400 rounded px-2 py-1"
                  value={transformType}
                  onChange={handleTransformTypeChange}
                >
                  <option value="مثنى">مثنى</option>
                  <option value="جمع مذكر">جمع مذكر</option>
                  <option value="جمع مؤنث">جمع مؤنث</option>
                  <option value="مفرد">مفرد</option>
                </select>
              </div>    

              {/* Transformation input field */}
              <div className="flex items-center mb-6 gap-2">
                <p className="text-gray-800 w-35">
                  {language === "ar" ? "أدخل الكلمات للتحويل:" : "Enter words for transformation:"}
                </p>
                <input
                  type="text"
                  className="flex-grow border border-gray-400 rounded px-2 py-1 text-sm"
                  placeholder={language === "ar" ? "افصل بين الكلمات بفواصل" : "Separate with commas"}
                  value={transformInput}
                  onChange={handleTransformInputChange}
                />
              </div>

              {/* Extract Words Input Field */}
                <div className="flex items-center gap-2 mb-6">
                <p className="text-gray-800 w-35">
                  {language === "ar" ? "أدخل كلمات للاستخراج :" : "Enter extraction words:"}
                </p>
                <textarea
                  className="flex-grow border border-gray-300 p-2 rounded text-sm"
                  rows="2"
                  placeholder={language === "ar" ? "أدخل الكلمات مفصولة بفواصل" : "Enter words separated by commas"}
                  value={userInputWords}
                  onChange={handleChange}
                />
              </div>
              
              {/* Verb Conjugation Section */}
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === "ar" ? "تصريف الأفعال" : "Verb Conjugation"}
              </h3>
              
              {/* Verb tense selector */}
              <div className="flex items-center mb-6 gap-2">
                <p className="text-gray-800 w-35">
                  {language === "ar" ? "زمن الفعل:" : "Verb tense:"}
                </p>
                <select
                  className="border border-gray-400 rounded px-2 py-1"
                  value={verbTense}
                  onChange={handleVerbTenseChange}
                >
                  <option value="الماضي">الماضي</option>
                  <option value="المضارع">المضارع</option>
                  <option value="الأمر">الأمر</option>
                </select>
              </div>
              
              {/* Verbs input */}
              <div className="flex items-center mb-6 gap-2">
                <p className="text-gray-800 w-35">
                  {language === "ar" ? "أدخل الأفعال:" : "Enter verbs:"}
                </p>
                <input
                  type="text"
                  className="flex-grow border border-gray-400 rounded px-2 py-1 text-sm"
                  placeholder={language === "ar" ? "افصل بين الأفعال بفواصل" : "Separate with commas"}
                  value={verbInput}
                  onChange={handleVerbInputChange}
                />
              </div>
              
              {/* Pronouns input */}
              <div className="flex items-center mb-6 gap-2">
                <p className="text-gray-800 w-35">
                  {language === "ar" ? "أدخل الضمائر:" : "Enter pronouns:"}
                </p>
                <textarea
                  className="flex-grow border border-gray-300 p-2 rounded text-sm"
                  rows="2"
                  placeholder={language === "ar" ? "افصل بين الضمائر بفواصل" : "Enter pronouns separated by commas"}
                  value={pronounsInput}
                  onChange={handlePronounsInputChange}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleGenerateClick}
              className="bg-[#FFB3B3] text-black font-semibold px-6 py-2 rounded shadow hover:bg-[#ffa1a1] transition"
            >
              {language === "ar" ? "إنشاء " : "Generate"}
            </button>
            
            {/* Add Save as PDF button - only show when preview is available */}
            {showPreview && !isLoading && (
              <button onClick={downloadPdf}
                className="bg-[#b3d1ff] text-black font-semibold px-6 py-2 rounded shadow hover:bg-[#a1c1ff] transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {language === "ar" ? "حفظ كـ PDF" : "Save as PDF"}
              </button>
            )}
          </div>
                  
        </div>

        {/* Right Block (preview box) - Conditionally rendered, always in Arabic */}
        {(showPreview || isLoading) && (
          <div className="w-[550px] h-auto rounded-[10px] border border-black shadow-md overflow-hidden" id="export-content">
            <div className="bg-[#FFB3B3] p-2 border-b border-black">
              <h3 className="text-l font-bold text-black text-center">
                معاينة الموضوع
                          </h3>
                          
            </div>
            
            {isLoading ? (
              <div className="bg-white p-4 h-[400px] flex items-center justify-center ">
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
                <ol className="list-decimal mr-6 text-lg text-gray-700 px-4 space-y-2">
                  <li>اعط عنوان للنص.</li>
                  <li>
                    اجب على الاسئلة التالية:
                    <ul className="list-disc mr-6 mt-1 pl-5">
                      {subjectOptions.slice(0, qCount).map((opt, index) => (
                        <li key={index}>{opt}</li>
                      ))}
                    </ul>
                  </li>
                  {parsedSyno.length > 0 && (
                    <li>
                      {`أعط مرادفات الكلمات التالية و وظفها في جملة مفيدة: ${parsedSyno.join("، ")}`}
                    </li>
                  )}
                  {parsedAntonyms.length > 0 && (
                    <li>
                      {`أعط الأضداد الكلمات التالية و وظفها في جملة مفيدة : ${parsedAntonyms.join("، ")}`}
                    </li>
                  )}
                </ol>

                <h3 className="font-bold text-lg mt-6 mb-2">البناء اللغوي:</h3>

<ol className="list-decimal mr-6 space-y-6">

  {i3rabWords.length > 0 && (
    <li>
      <h3 className="font-semibold text-lg mb-2">اعرب الكلمات التالية:</h3>
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
    </li>
  )}

  {parsedTaleelWords.length > 0 && (
    <li>
      <h3 className="font-semibold text-lg mb-2">علل سبب كتابة {taleelType} في:</h3>
      <ul className="list-disc mr-6 mt-1 pl-5">
        {parsedTaleelWords.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ul>
    </li>
  )}

  {parsedWords.length > 0 && (
    <li>
      <h3 className="font-semibold text-lg mb-2">استخرج من النص:</h3>
      <table className="w-full border border-gray-300 text-sm mt-2 mb-4">
        <thead>
          <tr className="bg-gray-100">
            {parsedWords.map((word, index) => (
              <th className="border px-2 py-1 text-right" key={index}>{word}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {parsedWords.map((_, index) => (
              <td className="border px-2 py-1" key={index}>...</td>
            ))}
          </tr>
        </tbody>
      </table>
    </li>
  )}

  {transformInput && transformInput.trim() !== "" && (
    <li>
      <h3 className="font-semibold text-lg mb-2">
         حول " {transformInput.split(/[,،]/).map(word => word.trim()).join("، ")}" إلى {transformType}.
      </h3>
    </li>
  )}

  {parsedVerbs.length > 0 && parsedPronouns.length > 0 && (
    <li>
      <h3 className="font-semibold text-lg mb-2">
        صرف الآتي في {verbTense}:
      </h3>
      <table className="w-full border border-gray-300 text-sm mt-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-right">الضمائر</th>
            {parsedVerbs.map((verb, index) => (
              <th className="border px-2 py-1 text-right" key={index}>{verb}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {parsedPronouns.map((pronoun, index) => (
            <tr key={index}>
              <td className="border px-2 py-1">{pronoun}</td>
              {parsedVerbs.map((_, verbIndex) => (
                <td className="border px-2 py-1" key={verbIndex}>...</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </li>
  )}

</ol>

              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Subjectopt;