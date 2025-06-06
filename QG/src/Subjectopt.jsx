import Header from "./Header.jsx";
import { useLanguage } from "./hooks/useLanguage";
import { useState, useEffect } from "react";
import { SlArrowUpCircle } from "react-icons/sl";

function Subjectopt() {
  // Get language from context - this will be used only for the left panel
  const { language } = useLanguage();
  const [previewText, setPreviewText] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(3); // default fallback
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Store temporary values that will be applied to preview only when generate is clicked
  const [tempQCount, setTempQCount] = useState(0);
  const [qCount, setQCount] = useState(0);

  // 1. Text retrieve
  useEffect(() => {
    const savedText = localStorage.getItem("subjectText");
    if (savedText) {
      setPreviewText(savedText);
    }
  }, []);

  // All the text words
  const [allTextWords, setAllTextWords] = useState([]);
  useEffect(() => {
    if (previewText) {
      // Extract all unique words from the text
      const words = previewText
        .replace(/[.,،:;'"!؟?()[\]{}]/g, " ") // Remove punctuation
        .split(/\s+/) // Split by whitespace
        .filter((word) => word.trim() !== "") // Remove empty strings
        .filter((word, index, self) => self.indexOf(word) === index); // Remove duplicates

      setAllTextWords(words);
    }
  }, [previewText]);

  // 2. Understanding Quations retrieve
  useEffect(() => {
    const storedOptions = localStorage.getItem("subjectQuestions"); // ✅ correct key
    const storedCount = localStorage.getItem("questionCount");
    if (storedOptions) {
      setSubjectOptions(JSON.parse(storedOptions));
    }
    if (storedCount) {
      setTotalQuestions(parseInt(storedCount));
      setTempQCount(1); // Initial value for the UI dropdown
    }
  }, []);

  // 2.1. Extracted verbs retrieve
  const [allExtractedVerbs, setAllExtractedVerbs] = useState([]);
  useEffect(() => {
    const storedVerbs = localStorage.getItem("allExtractedVerbs");
    setAllExtractedVerbs(storedVerbs ? JSON.parse(storedVerbs) : []);
  }, []);

  // 3. Syno
  const [showSynoWordSelector, setShowSynoWordSelector] = useState(false);
  const [parsedSyno, setParsedSyno] = useState([]); // Temporary selection
  const [synoWords, setUserSynoWords] = useState(""); // Final string used on generate
  // Handle word toggle
  const handleSynoWordSelection = (word) => {
    setParsedSyno((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };
  // Function to parse selected synonyms
  const applySelectedSynonyms = () => {
    setUserSynoWords(parsedSyno.join("، "));
  };

  // 4. Anto
  // State for antonyms
  const [showAntonymWordSelector, setShowAntonymWordSelector] = useState(false);
  const [antonymsInput, setAntonymsInput] = useState(""); // Final applied value
  const [parsedAntonyms, setParsedAntonyms] = useState([]); // Temporary selection before applying
  // Handle selecting/unselecting a word from the modal
  const handleAntonymWordSelection = (word) => {
    setParsedAntonyms((prev) => {
      const alreadySelected = prev.includes(word);
      if (alreadySelected) {
        return prev.filter((w) => w !== word);
      } else {
        return [...prev, word];
      }
    });
  };
  // Function to parse selected antonyms
  const applySelectedAntonyms = () => {
    setAntonymsInput(parsedAntonyms.join("، ")); // Or ',' depending on language
  };

  // 5. I3rab
  const [showWordSelector, setShowWordSelector] = useState(false);
  const [parsedI3rabWords, setParsedI3rabWords] = useState([]); // temporary selection
  const [i3rabInput, setI3rabInput] = useState(""); // final displayed input
  // Toggle selection of a word
  const handleI3rabWordSelection = (word) => {
    setParsedI3rabWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };
  // Apply selected words to input
  const applyI3rabWords = () => {
    setI3rabInput(parsedI3rabWords.join("، ")); // Arabic comma
  };

  // 6. Ta3leel
  const [taleelType, setTaleelType] = useState("");
  const [matchedWords, setMatchedWords] = useState([]);
  const [showTaleelSelector, setShowTaleelSelector] = useState(false);
  const [temporarySelectedWords, setTemporarySelectedWords] = useState([]);
  const [finalTaleelWords, setFinalTaleelWords] = useState([]); // Final saved on generate
  // Filter text based on taleel type
  const filterWordsByTaleelType = (text, type) => {
    const words = text.split(/\s+/).filter((w) => w.trim() !== "");
    switch (type) {
      case "همزة":
        return words.filter((word) => /[ءأإؤئ]/.test(word));
      case "تاء مفتوحة":
        return words.filter((word) => word.endsWith("ت"));
      case "تاء مربوطة":
        return words.filter((word) => word.endsWith("ة"));
      case "ألف لينة":
        return words.filter((word) => word.endsWith("ى") || word.endsWith("ا"));
      default:
        return [];
    }
  };
  // On taleel type change
  const [tempTaleelType, setTempTaleelType] = useState("همزة"); // Default type
  const handleTaleelTypeChange = (e) => {
    const selectedType = e.target.value;
    setTempTaleelType(selectedType);
    const matched = filterWordsByTaleelType(previewText, selectedType);
    setMatchedWords(matched);
    setTemporarySelectedWords([]); // Reset temp
    setShowTaleelSelector(true);
  };
  // Toggle word selection in modal
  const handleTaleelSelection = (word) => {
    setTemporarySelectedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };
  // Call this when user clicks "Generate"
  const handleTaleelWords = () => {
    setFinalTaleelWords(temporarySelectedWords);
  };

  // 8. extraction rules
  const [extractionCategories, setExtractionCategories] = useState([
    {
      id: "grammar",
      name: "قواعد نحوية",
      items: [
        // Verbs
        "فعل ماض",
        "فعل مضارع",
        "فعل أمر",
        "فعل لازم", // Added (5th grade)
        "فعل متعد", // Added (5th grade)
        "فعل ماض مبني للمجهول", // Added (5th grade)

        // Sentence structures
        "جملة اسمية",
        "جملة فعلية",
        "مبتدأ",
        "خبر",
        "فاعل",
        "نائب فاعل", // Added (5th grade)
        "مفعول به",
        "مفعول مطلق", // Added (4th grade)
        "مضاف إليه", // Added (4th grade)

        // Nouns & particles
        "اسم إشارة",
        "اسم موصول",
        "ظرف زمان", // Added (4th grade)
        "ظرف مكان", // Added (4th grade)
        "حرف جر",
        "حرف نصب", // Added (5th grade)
        "حرف جزم", // Added (5th grade)

        // Pronouns
        "ضمير متصل",
        "ضمير منفصل",

        // Special constructs
        "أخوات إن", // Added (4th/5th grade)
        "أخوات كان", // Added (5th grade)
        "أداة استثناء", // Added (5th grade)
        "مستثنى", // Added (5th grade)
      ],
    },
    {
      id: "style",
      name: "أساليب لغوية",
      items: [
        "أسلوب استفهام",
        "أسلوب نداء",
        "أسلوب تعجب",
        "أسلوب نهي",
        "أسلوب أمر",
        "أسلوب شرط",
        "تشبيه",
        "استعارة",
        // Removed "كناية" (not in curriculum)
      ],
    },
    {
      id: "other",
      name: "عناصر أخرى",
      items: [
        "حرف عطف",
        "نعت",
        "حال",
        "تمييز",
        "بدل",
        "مصدر",
        "اسم فاعل",
        "اسم مفعول",
        "توكيد",
        "المثنى", // Added (5th grade)
        "جمع مذكر سالم", // Added (5th grade)
        "جمع مؤنث سالم", // Added (5th grade)
        "جمع تكسير", // Added (5th grade)
        "الأسماء الخمسة", // Added (5th grade: أب، أخ، حم، فو، ذو)
      ],
    },
  ]);
  const [showExtractionSelector, setShowExtractionSelector] = useState(false);
  const [tempParsedWords, setTempParsedWords] = useState([]); // for modal selection
  const [finalParsedWords, setFinalParsedWords] = useState([]); // for confirmed selection
  const handleExtractionItemSelection = (item) => {
    if (tempParsedWords.includes(item)) {
      setTempParsedWords(tempParsedWords.filter((word) => word !== item));
    } else {
      setTempParsedWords([...tempParsedWords, item]);
    }
  };
  // Call this inside your "Generate" function
  const applyExtractionSelections = () => {
    setFinalParsedWords(tempParsedWords);
  };

  // 9. verbs extraction
  const [showVerbSelector, setShowVerbSelector] = useState(false);
  const [tempSelectedVerbs, setTempSelectedVerbs] = useState([]); // for modal selection
  const [finalSelectedVerbs, setFinalSelectedVerbs] = useState([]); // for confirmed selection
  const [selectedTense, setSelectedTense] = useState("present");
  const [finalVerbTense, setFinalVerbTense] = useState("present"); // for confirmed selection
  const handleVerbSelection = (verb) => {
    setTempSelectedVerbs((prev) =>
      prev.includes(verb) ? prev.filter((v) => v !== verb) : [...prev, verb]
    );
  };
  const applyVerbSelection = () => {
    setFinalSelectedVerbs(tempSelectedVerbs);
  };

  // 10. Prounoun choice
  const [tempSelectedPronounType, setTempSelectedPronounType] = useState("all"); // temporary
  const [finalSelectedPronounType, setFinalSelectedPronounType] =
    useState("all"); // finalized on Generate
  const handlePronounTypeChange = (e) => {
    setTempSelectedPronounType(e.target.value); // just temporary change
  };

  // 11. Written Expression (there's problem UserInputWords)
  const [showConstraintsSelector, setShowConstraintsSelector] = useState(false);
  const [geminiConstraints, setGeminiConstraints] = useState([]);
  const handleConstraintItemSelection = (item) => {
    setGeminiConstraints((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };
  const grammarCategories = [
    {
      id: "tense",
      name: language === "ar" ? "الأزمنة" : "Tenses",
      items: [
        "الماضي",
        "المضارع",
        "الأمر",
        "الماضي المبني للمجهول", // Added (5th grade)
        "المضارع المبني للمجهول", // Added (5th grade)
      ],
    },
    {
      id: "structure",
      name: language === "ar" ? "التراكيب النحوية" : "Sentence Structures",
      items: [
        "الفاعل",
        "نائب الفاعل", // Added (5th grade)
        "المفعول به",
        "المفعول المطلق", // Added (4th grade)
        "المضاف إليه", // Added (4th grade)
        "المبتدأ", // Added (5th grade)
        "الخبر", // Added (5th grade)
      ],
    },
    {
      id: "particles",
      name: language === "ar" ? "أدوات الربط" : "Linking Words",
      items: [
        "و",
        "ف", // Added (5th grade)
        "ثم",
        "لكن",
        "أو",
        "لأن",
        "إن", // Added (4th/5th grade)
        "أن", // Added (4th/5th grade)
      ],
    },
    {
      id: "types",
      name: language === "ar" ? "أنواع الجمل" : "Sentence Types",
      items: [
        "جملة اسمية",
        "جملة فعلية",
        "جملة استفهامية", // Added (5th grade)
        "جملة تعجبية", // Added (5th grade)
      ],
    },
    {
      id: "pronouns",
      name: language === "ar" ? "الضمائر" : "Pronouns",
      items: [
        "أنا",
        "أنتَ",
        "هو",
        "هي",
        "نحن",
        "هما", // Added (dual - 5th grade)
        "هم", // Added (plural)
        "هن", // Added (plural)
      ],
    },
  ];
  const [writtenExpression, setWrittenExpression] = useState("");
  const [geminiMinLines, setGeminiMinLines] = useState(8);
  const [geminiMaxLines, setGeminiMaxLines] = useState(10);
  const handleWrittenExpression = async () => {
    try {
      const res = await fetch("http://localhost:5000/generate-instruction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: previewText,
          constraints: geminiConstraints,
          min_lines: geminiMinLines,
          max_lines: geminiMaxLines,
          api_key: "AIzaSyAf33OMbH4JU7PhK48GgjK3rZLxJR3K6Qg",
        }),
      });

      const result = await res.json();
      setWrittenExpression(result.instruction || "");
    } catch (error) {
      console.error("Error generating written expression:", error);
      alert("فشل في إنشاء الوضعية الإدماجية.");
      setWrittenExpression("");
    }
  };

  // 1. Add these state variables to your existing component states
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCurrentExamPublished, setIsCurrentExamPublished] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [examName, setExamName] = useState("");
  const [publishedExamName, setPublishedExamName] = useState("");

  // 2. Add these functions to your existing component
  const handlePublishClick = () => {
    // Show modal when publish button is clicked
    setShowPublishModal(true);
    setExamName(""); // Reset exam name
  };

  const handleConfirmPublish = async () => {
    if (!examName.trim()) {
      alert("Please enter an exam name");
      return;
    }

    setIsPublishing(true);
    setShowPublishModal(false);

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.username) {
      console.error("User not logged in");
      setIsPublishing(false);
      return;
    }

    const historyKey = `subjectHistory_${user.username}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || "[]");

    // Find the most recent exam (index 0)
    if (history.length > 0) {
      history[0].data.savedExam = true;
      history[0].data.examName = examName.trim(); // Add the custom exam name
      history[0].title = examName.trim(); // Update the title as well
      localStorage.setItem(historyKey, JSON.stringify(history));
      setIsCurrentExamPublished(true);
      setPublishedExamName(examName.trim());
      setSavedExam(true); // This should reference your existing setSavedExam
      console.log("Current exam published successfully with name:", examName);
    }

    setTimeout(() => {
      setIsPublishing(false);
    }, 1000);
  };

  const handleCancelPublish = () => {
    setShowPublishModal(false);
    setExamName("");
  };

  const handleUnpublishCurrentExam = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.username) return;

    const historyKey = `subjectHistory_${user.username}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || "[]");

    if (history.length > 0) {
      history[0].data.savedExam = false;
      history[0].data.examName = undefined; // Remove custom exam name
      localStorage.setItem(historyKey, JSON.stringify(history));
      setIsCurrentExamPublished(false);
      setPublishedExamName("");
      setSavedExam(false); // This should reference your existing setSavedExam
    }
  };

  // 3. Add this Modal component inside your main component
  const PublishModal = () => {
    if (!showPublishModal) return null;

    return (
      <div
        className={`fixed inset-0 backdrop-blur-sm bg-white/30 bg-opacity-50 flex items-center justify-center z-50`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {language === "ar" ? "نشر الامتحان" : "Publish Exam"}
          </h2>
          <p className="text-gray-600 mb-4">
            {language === "ar"
              ? "أدخل اسمًا لهذا الامتحان ليظهر للتلاميذ:"
              : "Enter a name for this exam that students will see:"}
          </p>

          <input
            type="text"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            placeholder={
              language === "ar"
                ? "مثال: اختبار قواعد اللغة العربية - الوحدة 5"
                : "e.g., Arabic Grammar Test - Chapter 5"
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-6"
            maxLength={100}
            autoFocus
            style={{ textAlign: language === "ar" ? "right" : "left" }}
          />

          <div
            className={`flex gap-3 justify-end ${
              language === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            <button
              onClick={handleCancelPublish}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {language === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button
              onClick={handleConfirmPublish}
              disabled={!examName.trim()}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                examName.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {language === "ar" ? "نشر الامتحان" : "Publish Exam"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 4. Add this JSX component inside your main component's return statement
  const PublishButton = () => {
    // Only show if exam preview is visible
    if (!showPreview) return null;

    return (
      <div className="flex-block justify-center items-center">
        <button
          onClick={
            isCurrentExamPublished
              ? handleUnpublishCurrentExam
              : handlePublishClick
          }
          disabled={isPublishing}
          className={`px-6 py-3 rounded shadow font-semibold transition duration-200 flex items-center gap-2 ${
            isCurrentExamPublished
              ? "bg-green-600 hover:bg-[#ff6464] text-white px-6 py-3 rounded shadow-lg"
              : "bg-[#FFB3B3] text-black font-semibold hover:bg-[#ffa1a1] transition"
          } ${isPublishing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isPublishing ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {language === "ar" ? "نشر..." : "Publishing..."}
            </>
          ) : (
            <>
              {isCurrentExamPublished ? (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {language === "ar" ? "إلغاء نشر الامتحان" : "Unpublish Exam"}
                </>
              ) : (
                <>
                  <SlArrowUpCircle />
                  {language === "ar"
                    ? "نشر الامتحان للتلاميذ"
                    : "Publish for Students"}
                </>
              )}
            </>
          )}
        </button>

        {isCurrentExamPublished && (
          <div className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
            {language === "ar"
              ? `✓ متاح باسم: "${publishedExamName}"`
              : `✓ Available as: "${publishedExamName}"`}
          </div>
        )}
      </div>
    );
  };

  // Generate Button
  const [savedExam, setSavedExam] = useState(); // for saving exam for students
  const handleGenerateClick = async () => {
    setIsLoading(true);
    // Parse all inputs
    setQCount(tempQCount);
    applySelectedSynonyms();
    applySelectedAntonyms();
    applyI3rabWords();
    handleTaleelWords();
    setTaleelType(tempTaleelType); // only now we commit
    applyExtractionSelections();
    applyVerbSelection();
    setFinalVerbTense(selectedTense);
    setFinalSelectedPronounType(tempSelectedPronounType); // only now we commit
    await handleWrittenExpression(); // 🟢 Call it here
    setSavedExam(false); // Set exam as saved for students
    setIsCurrentExamPublished(false);
    setPublishedExamName("");
    setTimeout(() => {
      setIsLoading(false);
      setShowPreview(true);
    }, 1500);

    // Save the exam in history with ALL parameters
    setTimeout(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.username) return;

      const historyKey = `subjectHistory_${user.username}`;
      const history = JSON.parse(localStorage.getItem(historyKey) || "[]");
      const contentDiv = document.getElementById("export-content");

      const newEntry = {
        title: previewText.substring(0, 50),
        timestamp: new Date().toISOString(),
        data: {
          html: contentDiv.innerHTML, // ✅ Save as HTML string
          savedExam: false,
        },
      };

      localStorage.setItem(historyKey, JSON.stringify([newEntry, ...history]));
    }, 1600);
  };

  // PDF Download
  const downloadPdf = async () => {
    try {
      // Find the content element to export
      const contentDiv = document.getElementById("export-content");

      if (!contentDiv) {
        alert("Export content not found in the DOM.");
        return;
      }

      // Show loading indicator (optional)
      const loadingIndicator = document.createElement("div");
      loadingIndicator.textContent = "Generating PDF...";
      loadingIndicator.style.position = "fixed";
      loadingIndicator.style.top = "50%";
      loadingIndicator.style.left = "50%";
      loadingIndicator.style.transform = "translate(-50%, -50%)";
      loadingIndicator.style.padding = "20px";
      loadingIndicator.style.backgroundColor = "rgba(0,0,0,0.7)";
      loadingIndicator.style.color = "white";
      loadingIndicator.style.borderRadius = "5px";
      loadingIndicator.style.zIndex = "1000";
      document.body.appendChild(loadingIndicator);

      // Process tables to ensure they're visible in PDF
      const processTablesForPdf = () => {
        // Create a deep clone of the content to avoid modifying the original
        const contentClone = contentDiv.cloneNode(true);

        // Find all tables in the clone
        const tables = contentClone.querySelectorAll("table");

        // Process each table
        tables.forEach((table) => {
          // Ensure tables have explicit width
          table.style.width = "100%";
          table.style.borderCollapse = "collapse";
          table.style.pageBreakInside = "auto";

          // Process all cells
          const cells = table.querySelectorAll("th, td");
          cells.forEach((cell) => {
            cell.style.border = "1px solid #ddd";
            cell.style.padding = "8px";
          });

          // Style headers
          const headers = table.querySelectorAll("th");
          headers.forEach((header) => {
            header.style.backgroundColor = "#f2f2f2";
            header.style.fontWeight = "bold";
          });
        });

        return contentClone.innerHTML;
      };

      // Get processed HTML content
      const htmlContent = processTablesForPdf();

      // Send request to backend
      const res = await fetch("http://localhost:5000/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ htmlContent }),
      });

      // Remove loading indicator
      document.body.removeChild(loadingIndicator);

      // Handle error responses
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        if (errorData && errorData.error) {
          alert(`Error: ${errorData.error}\n${errorData.solution || ""}`);
        } else {
          alert(`Error generating PDF: ${res.status} ${res.statusText}`);
        }
        return;
      }

      // Process successful response
      const blob = await res.blob();

      // Check if we got a valid PDF (basic check)
      if (
        blob.type !== "application/pdf" &&
        blob.type !== "application/octet-stream"
      ) {
        alert(`Received invalid response type: ${blob.type}. Expected PDF.`);
        return;
      }

      // Create object URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated.pdf";
      document.body.appendChild(a);
      a.click();

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (error) {
      console.error("PDF generation error:", error);
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
              {/* 2. Understanding Quations retrieve */}
              <div className="flex items-center mb-6">
                <p className="text-gray-800 w-37">
                  {language === "ar"
                    ? "أسئلة الفهم :"
                    : "Comprehension questions:"}
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

              {/* 3. Syno */}
              <div className="flex items-center mb-6 gap-2">
                <p className="text-gray-800 w-35">
                  {language === "ar" ? "أدخل المرادفات:" : "Give synonyms:"}
                </p>
                <div className="flex flex-grow gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setShowSynoWordSelector(!showSynoWordSelector)
                    }
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    {language === "ar" ? "اختيار من النص" : "Select from text"}
                  </button>
                </div>
              </div>
              {/* Selected count - always visible */}
              <div className="text-sm text-gray-600 mb-4">
                {language === "ar"
                  ? `الكلمات المحددة: ${parsedSyno.length}`
                  : `Selected words: ${parsedSyno.length}`}
              </div>
              {/* Synonyms Word Selector Modal */}
              {showSynoWordSelector && (
                <div className="mb-6 border border-gray-300 rounded p-3">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-semibold">
                      {language === "ar"
                        ? "اختر الكلمات للمرادفات:"
                        : "Select words for synonyms:"}
                    </h4>
                    <button
                      onClick={() => setShowSynoWordSelector(false)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="max-h-40 overflow-y-auto p-2 bg-gray-50 rounded">
                    <div className="flex flex-wrap gap-2">
                      {allTextWords.map((word, index) => (
                        <button
                          key={index}
                          onClick={() => handleSynoWordSelection(word)}
                          className={`px-2 py-1 rounded text-sm ${
                            parsedSyno.includes(word)
                              ? "bg-[#FFB3B3] text-gray-800"
                              : "bg-gray-200 text-gray-700"
                          } hover:bg-gray-300`}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* 4. Anto */}
              <div className="flex items-center mb-6 gap-2">
                <p className="text-gray-800 w-35">
                  {language === "ar" ? "أدخل الأضداد:" : "Enter antonyms:"}
                </p>
                <div className="flex flex-grow gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setShowAntonymWordSelector(!showAntonymWordSelector)
                    }
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    {language === "ar" ? "اختيار من النص" : "Select from text"}
                  </button>
                </div>
              </div>
              {/* Selected count - always visible */}
              <div className="text-sm text-gray-600 mb-4">
                {language === "ar"
                  ? `الكلمات المحددة: ${parsedAntonyms.length}`
                  : `Selected words: ${parsedAntonyms.length}`}
              </div>
              {/* Antonym Word Selector Modal */}
              {showAntonymWordSelector && (
                <div className="mb-6 border border-gray-300 rounded p-3">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-semibold">
                      {language === "ar"
                        ? "اختر الكلمات للأضداد:"
                        : "Select words for antonyms:"}
                    </h4>
                    <button
                      onClick={() => setShowAntonymWordSelector(false)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="max-h-40 overflow-y-auto p-2 bg-gray-50 rounded">
                    <div className="flex flex-wrap gap-2">
                      {allTextWords.map((word, index) => (
                        <button
                          key={index}
                          onClick={() => handleAntonymWordSelection(word)}
                          className={`px-2 py-1 rounded text-sm ${
                            parsedAntonyms.includes(word)
                              ? "bg-[#FFB3B3] text-gray-800"
                              : "bg-gray-200 text-gray-700"
                          } hover:bg-gray-300`}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === "ar" ? "القواعد" : "Grammar"}
              </h3>
              {/* 5. I3rab */}
              <div className="flex items-center gap-2 mb-6">
                <p className="text-gray-800 w-35">
                  {language === "ar"
                    ? "أدخل كلمات الإعراب:"
                    : "Enter Iirab words:"}
                </p>
                <div className="flex flex-grow gap-2">
                  <button
                    type="button"
                    onClick={() => setShowWordSelector(!showWordSelector)}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    {language === "ar" ? "اختيار من النص" : "Select from text"}
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                {language === "ar"
                  ? `الكلمات المحددة: ${parsedI3rabWords.length}`
                  : `Selected words: ${parsedI3rabWords.length}`}
              </div>
              {/* Word selector modal/dropdown */}
              {showWordSelector && (
                <div className="mb-6 border border-gray-300 rounded p-3">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-semibold">
                      {language === "ar"
                        ? "اختر الكلمات من النص:"
                        : "Select words from text:"}
                    </h4>
                    <button
                      onClick={() => setShowWordSelector(false)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="max-h-40 overflow-y-auto p-2 bg-gray-50 rounded">
                    <div className="flex flex-wrap gap-2">
                      {allTextWords.map((word, index) => (
                        <button
                          key={index}
                          onClick={() => handleI3rabWordSelection(word)}
                          className={`px-2 py-1 rounded text-sm ${
                            parsedI3rabWords.includes(word)
                              ? "bg-[#FFB3B3] text-gray-800"
                              : "bg-gray-200 text-gray-700"
                          } hover:bg-gray-300`}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Ta3leel */}
              <div className="mb-6">
                <div className="flex items-center mb-4 gap-2">
                  <p className="text-gray-800 w-35">
                    {language === "ar" ? "نوع الإملاء:" : "Dictation type:"}
                  </p>
                  <select
                    className="border border-gray-400 rounded px-2 py-1"
                    value={taleelType}
                    onChange={handleTaleelTypeChange}
                  >
                    <option value="">--</option>
                    <option value="همزة">همزة</option>
                    <option value="تاء مفتوحة">تاء مفتوحة</option>
                    <option value="تاء مربوطة">تاء مربوطة</option>
                    <option value="ألف لينة">ألف لينة</option>
                  </select>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  {language === "ar"
                    ? `الكلمات المحددة : ${temporarySelectedWords.length}`
                    : ` selected words: ${temporarySelectedWords.length}`}
                </div>
                {showTaleelSelector && (
                  <div className="border border-gray-300 rounded p-3 bg-white shadow">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-semibold">
                        {language === "ar"
                          ? "اختر الكلمات من النص:"
                          : "Select words from text:"}
                      </h4>
                      <button
                        onClick={() => setShowTaleelSelector(false)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="max-h-40 overflow-y-auto p-2 bg-gray-50 rounded">
                      <div className="flex flex-wrap gap-2">
                        {matchedWords.map((word, index) => (
                          <button
                            key={index}
                            onClick={() => handleTaleelSelection(word)}
                            className={`px-2 py-1 rounded text-sm ${
                              temporarySelectedWords.includes(word)
                                ? "bg-[#FFB3B3] text-gray-800"
                                : "bg-gray-200 text-gray-700"
                            } hover:bg-gray-300`}
                          >
                            {word}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* 8. extraction rules */}
              <div className="flex items-center gap-2 mb-6">
                <p className="text-gray-800 w-35">
                  {language === "ar" ? "عناصر للاستخراج:" : "Extraction items:"}
                </p>
                <div className="flex flex-grow gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setShowExtractionSelector(!showExtractionSelector)
                    }
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    {language === "ar" ? "اختيار العناصر" : "Select items"}
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-4">
                  {language === "ar"
                    ? `العناصر المحددة: ${tempParsedWords.length}`
                    : `Selected items: ${tempParsedWords.length}`}
                </p>
              </div>
              {/* Modal */}
              {showExtractionSelector && (
                <div className="mb-6 border border-gray-300 rounded p-3">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-semibold">
                      {language === "ar"
                        ? "اختر عناصر للاستخراج:"
                        : "Select items for extraction:"}
                    </h4>
                    <button
                      onClick={() => setShowExtractionSelector(false)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ✕
                    </button>
                  </div>

                  {extractionCategories.map((category) => (
                    <div key={category.id} className="mb-3">
                      <h5 className="font-medium text-gray-700 mb-1">
                        {category.name}
                      </h5>
                      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded">
                        {category.items.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => handleExtractionItemSelection(item)}
                            className={`px-2 py-1 rounded text-sm ${
                              tempParsedWords.includes(item)
                                ? "bg-[#FFB3B3] text-gray-800"
                                : "bg-gray-200 text-gray-700"
                            } hover:bg-gray-300`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === "ar" ? "تصريف الأفعال" : "Verb Conjugation"}
              </h3>
              {/* 9. verbs extraction */}
              {/* Tense Selector */}
              <div className="flex items-center mb-6 gap-2">
                <p className="text-gray-800 w-35">
                  {language === "ar" ? "اختر الزمن:" : "Select tense:"}
                </p>
                <div className="flex flex-grow gap-2">
                  <select
                    value={selectedTense}
                    onChange={(e) => setSelectedTense(e.target.value)}
                    className="flex-grow border border-gray-300 p-2 rounded text-sm"
                  >
                    <option value="past">
                      {language === "ar" ? "الماضي" : "Past"}
                    </option>
                    <option value="present">
                      {language === "ar" ? "المضارع" : "Present"}
                    </option>
                    <option value="future">
                      {language === "ar" ? "المستقبل" : "Future"}
                    </option>
                    <option value="imperative">
                      {language === "ar" ? "الأمر" : "Imperative"}
                    </option>
                  </select>
                </div>
              </div>
              {/* Verb Selector Open Button */}
              <div className="flex items-center gap-2 mb-6">
                <p className="text-gray-800 w-35">
                  {language === "ar"
                    ? "اختر الأفعال من النص:"
                    : "Select verbs from text:"}
                </p>
                <div className="flex flex-grow gap-2">
                  <button
                    type="button"
                    onClick={() => setShowVerbSelector(!showVerbSelector)}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    {language === "ar" ? "اختيار من النص" : "Select from text"}
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-4">
                  {language === "ar"
                    ? `الأفعال المحددة: ${tempSelectedVerbs.length}`
                    : `Selected verbs: ${tempSelectedVerbs.length}`}
                </p>
              </div>
              {/* Verb Selector Modal */}
              {showVerbSelector && (
                <div className="mb-6 border border-gray-300 rounded p-3">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-semibold">
                      {language === "ar"
                        ? "اختر الأفعال من النص:"
                        : "Select verbs from text:"}
                    </h4>
                    <button
                      onClick={() => setShowVerbSelector(false)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="max-h-40 overflow-y-auto p-2 bg-gray-50 rounded">
                    <div className="flex flex-wrap gap-2">
                      {allExtractedVerbs.map((verb, index) => (
                        <button
                          key={index}
                          onClick={() => handleVerbSelection(verb)}
                          className={`px-2 py-1 rounded text-sm ${
                            tempSelectedVerbs.includes(verb)
                              ? "bg-[#FFB3B3] text-black"
                              : "bg-gray-200 text-gray-700"
                          } hover:bg-gray-300`}
                        >
                          {verb}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* 10. Prounoun choice  */}
              <div className="flex items-center mb-6 gap-2">
                <p className="text-gray-800 w-35">
                  {language === "ar" ? "نوع الضمير:" : "Pronoun type:"}
                </p>
                <div className="flex flex-grow gap-2">
                  <select
                    value={tempSelectedPronounType}
                    onChange={handlePronounTypeChange}
                    className="flex-grow border border-gray-300 p-2 rounded text-sm"
                  >
                    <option value="all">
                      {language === "ar" ? "جميع الضمائر" : "All pronouns"}
                    </option>
                    <option value="متكلم">
                      {language === "ar" ? "ضمائر المتكلم" : "First person"}
                    </option>
                    <option value="مخاطب">
                      {language === "ar" ? "ضمائر المخاطب" : "Second person"}
                    </option>
                    <option value="غائب">
                      {language === "ar" ? "ضمائر الغائب" : "Third person"}
                    </option>
                  </select>
                </div>
              </div>
              {/* 11. Written Expression */}
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === "ar" ? "الوضعية الإدماجية" : "Written Expression"}
              </h3>
              {/* Grammar constraints selector - using the same UI component style as extraction selector */}
              <div className="mb-6 border border-gray-300 rounded p-3">
                <div className="mb-4">
                  <button
                    onClick={() => setShowConstraintsSelector(true)}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    {language === "ar" ? "اختر القواعد" : "Choose Constraints"}
                  </button>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-4">
                    {language === "ar"
                      ? `القواعد المحددة: ${geminiConstraints.length}`
                      : `Selected constraints: ${geminiConstraints.length}`}
                  </p>
                </div>
                {showConstraintsSelector && (
                  <div className="mb-6 border border-gray-300 rounded p-3">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-semibold">
                        {language === "ar"
                          ? "اختر القواعد المستعملة:"
                          : "Select grammar constraints:"}
                      </h4>
                      <button
                        onClick={() => setShowConstraintsSelector(false)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        ✕
                      </button>
                    </div>
                    {grammarCategories.map((category) => (
                      <div key={category.id} className="mb-3">
                        <h5 className="font-medium text-gray-700 mb-1">
                          {category.name}
                        </h5>
                        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded">
                          {category.items.map((item, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                handleConstraintItemSelection(item)
                              }
                              className={`px-2 py-1 rounded text-sm ${
                                geminiConstraints.includes(item)
                                  ? "bg-[#FFB3B3] text-gray-800"
                                  : "bg-gray-200 text-gray-700"
                              } hover:bg-gray-300`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Min and Max line inputs */}
                <div className="flex items-center mb-4 gap-4">
                  <label className="text-gray-800">
                    {language === "ar" ? "عدد الأسطر الأدنى:" : "Min lines:"}
                  </label>
                  <input
                    type="number"
                    value={geminiMinLines}
                    onChange={(e) =>
                      setGeminiMinLines(parseInt(e.target.value))
                    }
                    className="border border-gray-400 rounded px-2 py-1 text-sm w-20"
                  />
                  <label className="text-gray-800">
                    {language === "ar" ? "العدد الأقصى:" : "Max lines:"}
                  </label>
                  <input
                    type="number"
                    value={geminiMaxLines}
                    onChange={(e) =>
                      setGeminiMaxLines(parseInt(e.target.value))
                    }
                    className="border border-gray-400 rounded px-2 py-1 text-sm w-20"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Generate and Save as PDF buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleGenerateClick}
              className="bg-[#FFB3B3] text-black font-semibold px-6 py-2 rounded shadow hover:bg-[#ffa1a1] transition"
            >
              {language === "ar" ? "إنشاء " : "Generate"}
            </button>

            {/* Add Save as PDF button - only show when preview is available */}
            {showPreview && !isLoading && (
              <button
                onClick={downloadPdf}
                className="bg-[#b3d1ff] text-black font-semibold px-6 py-2 rounded shadow hover:bg-[#a1c1ff] transition flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {language === "ar" ? "حفظ كـ PDF" : "Save as PDF"}
              </button>
            )}
            {/* Your existing exam preview content */}
            <PublishButton />
            <PublishModal />
          </div>
        </div>

        {/* Right Block (preview box) - Conditionally rendered, always in Arabic */}
        {(showPreview || isLoading) && (
          <div
            className="w-[550px] h-auto rounded-[10px] border border-black shadow-md overflow-hidden"
            id="export-content"
          >
            <div className="bg-[#FFB3B3] p-2 border-b border-black">
              <h3 className="text-l font-bold text-black text-center">
                معاينة الموضوع
              </h3>
            </div>

            {isLoading ? (
              <div className="bg-white p-4 h-[400px] flex items-center justify-center ">
                <div className="text-center">
                  <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FFB3B3] border-r-transparent align-[-0.125em]"
                    role="status"
                  >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      جار التحميل...
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">جار إنشاء الموضوع...</p>
                </div>
              </div>
            ) : (
              <div
                className="bg-white p-4 h-auto overflow-y-auto whitespace-pre-wrap text-gray-800 text-[15px] leading-6"
                dir="rtl"
              >
                <h3 className="font-bold text-lg mb-4">النص</h3>
                {previewText || "لا يوجد محتوى للعرض."}
                <h3 className="font-bold text-lg mt-6 mb-2">البناء الفكري:</h3>
                <ol className="list-decimal mr-6 text-lg text-gray-700 px-4 space-y-2">
                  <li>
                    اعط عنوان للنص.
                    <p className="text-gray-400">
                      .............................................................................................................
                    </p>
                  </li>
                  <li>
                    اجب على الاسئلة التالية:
                    <ul className="list-disc mr-6 mt-1 pl-5 space-y-2">
                      {subjectOptions.slice(0, qCount).map((opt, index) => (
                        <li key={index}>
                          {opt}
                          <p className="text-gray-400">
                            ........................................................................
                          </p>
                        </li>
                      ))}
                    </ul>
                  </li>

                  {synoWords.length > 0 && (
                    <li>
                      {`أعط مرادفات الكلمات التالية و وظفها في جملة مفيدة: ${synoWords}`}
                      <p className="text-gray-400">
                        ........................................................................
                      </p>
                    </li>
                  )}

                  {antonymsInput.length > 0 && (
                    <li>
                      {`أعط الأضداد الكلمات التالية و وظفها في جملة مفيدة : ${antonymsInput}`}
                      <p className="text-gray-400">
                        ........................................................................
                      </p>
                    </li>
                  )}

                  <li>
                    ما هي العبرة من النص؟
                    <p className="text-gray-400">
                      ........................................................................
                    </p>
                  </li>
                </ol>
                <h3 className="font-bold text-lg mt-6 mb-2">البناء اللغوي:</h3>
                <ol className="list-decimal mr-6 space-y-6">
                  {i3rabInput.length > 0 && (
                    <li>
                      <h3 className="font-semibold text-lg mb-2">
                        اعرب الكلمات التالية:
                      </h3>
                      <table className="w-full border border-gray-300 text-sm mt-2">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border w-20 px-2 py-1 text-right">
                              الكلمة
                            </th>
                            <th className="border px-2 py-1 text-right">
                              الإعراب
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {i3rabInput.split("، ").map((word, index) => (
                            <tr key={index}>
                              <td className="border px-2 py-1">{word}</td>
                              <td className="border px-2 py-1">...</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </li>
                  )}
                  {finalTaleelWords.length > 0 && (
                    <li>
                      <h3 className="font-semibold text-lg mb-2">
                        علل سبب كتابة {taleelType} في:
                      </h3>
                      <ul className="list-disc mr-6 mt-1 pl-5">
                        {finalTaleelWords.map((word, index) => (
                          <li key={index}>{word}</li>
                        ))}
                      </ul>
                    </li>
                  )}
                  {finalParsedWords.length > 0 && (
                    <li>
                      <h3 className="font-semibold text-lg mb-2">
                        استخرج من النص:
                      </h3>
                      <table className="w-full border border-gray-300 text-sm mt-2 mb-4">
                        <thead>
                          <tr className="bg-gray-100">
                            {finalParsedWords.map((word, index) => (
                              <th
                                className="border px-2 py-1 text-right"
                                key={index}
                              >
                                {word}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {finalParsedWords.map((_, index) => (
                              <td className="border px-2 py-1" key={index}>
                                ...
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </li>
                  )}
                  {finalSelectedVerbs && finalSelectedVerbs.length > 0 && (
                    <li>
                      <h3 className="font-semibold text-lg mb-2">
                        صرف الأفعال التالية في{" "}
                        {finalVerbTense === "present"
                          ? "المضارع"
                          : finalVerbTense === "past"
                          ? "الماضي"
                          : finalVerbTense === "future"
                          ? "المستقبل"
                          : finalVerbTense === "imperative"
                          ? "الأمر"
                          : finalVerbTense}
                        {finalSelectedPronounType !== "all"
                          ? ` مع ضمائر ${finalSelectedPronounType}`
                          : "مع جميع الضمائر"}
                        :
                      </h3>
                      <table className="w-full border border-gray-300 text-sm mt-2">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border px-2 py-1 text-right">
                              الضمائر
                            </th>
                            {finalSelectedVerbs.map((verb, index) => (
                              <th
                                className="border px-2 py-1 text-right"
                                key={index}
                              >
                                {verb}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            // Define all pronouns by category
                            const pronouns = {
                              متكلم: ["أنا", "نحن"],
                              مخاطب: ["أنتَ", "أنتِ", "أنتما", "أنتم", "أنتن"],
                              غائب: ["هو", "هي", "هما", "هم", "هن"],
                            };

                            // Get the list of pronouns to display based on selectedPronounType
                            let displayPronouns = [];
                            if (finalSelectedPronounType === "all") {
                              // For "all", concatenate all pronouns
                              displayPronouns = [
                                ...pronouns["متكلم"],
                                ...pronouns["مخاطب"],
                                ...pronouns["غائب"],
                              ];
                            } else {
                              // Only show pronouns for the selected type
                              displayPronouns =
                                pronouns[finalSelectedPronounType] || [];
                            }

                            // Generate rows for each pronoun
                            return displayPronouns.map((pronoun, i) => (
                              <tr key={i}>
                                <td className="border px-2 py-1">...</td>
                                {finalSelectedVerbs.map((_, verbIndex) => (
                                  <td
                                    className="border px-2 py-1"
                                    key={verbIndex}
                                  >
                                    ...
                                  </td>
                                ))}
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </li>
                  )}
                </ol>

                {writtenExpression && (
                  <>
                    <h3 className="font-bold text-lg mt-6 mb-2">
                      الوضعية الإدماجية:
                    </h3>
                    <p className="text-gray-800 text-md leading-7 whitespace-pre-line">
                      {writtenExpression}
                    </p>
                  </>
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
