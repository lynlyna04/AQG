import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { useLanguage } from "./hooks/useLanguage";
import { SlArrowUpCircle } from "react-icons/sl";
import { GoHistory } from "react-icons/go";

function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const user = JSON.parse(localStorage.getItem("user"));
  const historyKey = user ? `subjectHistory_${user.username}` : null;

  useEffect(() => {
    if (historyKey) {
      const savedHistory = localStorage.getItem(historyKey);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    }
  }, [historyKey]);

  // State variables
  const [isPublishing, setIsPublishing] = useState(null); // null or timestamp
  const [selectedExamHtml, setSelectedExamHtml] = useState("");
  const [showPreviewRestore, setShowPreviewRestore] = useState(false);
  const [selectedExamData, setSelectedExamData] = useState(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [examName, setExamName] = useState("");
  const PublishModal = ({ selectedEntry }) => {
    if (!showPublishModal) return null;

    return (
      <div
        className="fixed inset-0 backdrop-blur-sm bg-white/30 bg-opacity-50 flex items-center justify-center z-50"
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
              onClick={() => handleConfirmPublish(selectedEntry)}
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
  const [selectedEntry, setSelectedEntry] = useState(null);
  const handlePublishClick = (entry) => {
    if (entry.data.savedExam) {
      // Unpublish directly
      const updatedEntry = {
        ...entry,
        data: { ...entry.data, savedExam: false, examName: "" },
      };
      const updatedHistory = history.map((historyEntry) =>
        historyEntry.timestamp === entry.timestamp ? updatedEntry : historyEntry
      );
      setHistory(updatedHistory);
      localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    } else {
      // Show modal to publish
      setSelectedEntry(entry);
      setShowPublishModal(true);
      setExamName(""); // Reset exam name
    }
  };

  const handleConfirmPublish = async (selectedEntry) => {
    if (!examName.trim()) {
      alert("Please enter an exam name");
      return;
    }

    setIsPublishing(selectedEntry.timestamp);
    setShowPublishModal(false);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.username) {
      console.error("User not logged in");
      setIsPublishing(false);
      return;
    }

    // Toggle the savedExam status in the entry
    selectedEntry.data.savedExam = !selectedEntry.data.savedExam;
    selectedEntry.data.examName = examName.trim(); // Set the exam name
    selectedEntry.title = examName.trim(); // <-- Add this line

    // Update the history array and save back to localStorage
    const updatedHistory = history.map((historyEntry) => {
      if (historyEntry.timestamp === selectedEntry.timestamp) {
        return selectedEntry;
      }
      return historyEntry;
    });

    setHistory(updatedHistory);
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));

    setTimeout(() => {
      setIsPublishing(false);
    }, 1000);
  };

  const handleCancelPublish = () => {
    setShowPublishModal(false);
    setSelectedEntry(null);
    setExamName("");
  };

  const handleRestore = (entry) => {
    try {
      const data = entry.data;
      if (!data || !data.html) throw new Error("Missing HTML content");
      setSelectedExamHtml(data.html);
      setSelectedExamData(entry);
      setShowPreviewRestore(true);
    } catch (error) {
      console.error("Error loading exam preview:", error);
      alert("حدث خطأ في تحميل الامتحان");
    }
  };

  const handleClosePreview = () => {
    setShowPreviewRestore(false);
    setSelectedExamHtml("");
    setSelectedExamData(null);
  };

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

  const handleDelete = (index) => {
    const updatedHistory = [...history];
    const entry = updatedHistory[index];

    // If the exam is published, unpublish it before deleting
    if (entry && entry.data && entry.data.savedExam) {
      // Optionally show an error message and prevent deletion
      alert(
        language === "ar"
          ? "لا يمكنك حذف امتحان منشور مباشرة. يرجى إلغاء النشر أولاً."
          : "You cannot delete a published exam directly. Please unpublish it first."
      );
      return;
    }

    updatedHistory.splice(index, 1);
    setHistory(updatedHistory);
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
  };

  const handleClearAll = () => {
    // Separate published and unpublished exams
    const publishedHistory = history.filter(
      (entry) => entry.data && entry.data.savedExam
    );
    const unpublishedHistory = history.filter(
      (entry) => !entry.data || !entry.data.savedExam
    );
    setHistory(publishedHistory);
    localStorage.setItem(historyKey, JSON.stringify(publishedHistory));
    setTimeout(() => {
      if (publishedHistory.length > 0) {
        alert(
          language === "ar"
            ? `تم حذف جميع الامتحانات غير المنشورة. لا يمكن حذف الامتحانات المنشورة (${publishedHistory.length})، يجب إلغاء نشرها أولاً.`
            : `All unpublished exams have been deleted. The remaining ${publishedHistory.length} published exam(s) cannot be deleted. Please unpublish them first.`
        );
      }
    }, 500); // Show alert after a short delay
  };

  return (
    <>
      <Header />
      <div className="p-6 mt-28 max-w-xl mx-auto">
        <div className="mb-6 flex items-center justify-center gap-3">
          <GoHistory className="text-2xl mb-0" />
          <h1 className="text-xl font-bold text-center mb-0">
            {language === "en" ? "History" : "السجل"}
          </h1>
        </div>
        {!user ? (
          <p className="text-gray-600 text-center text-sm">
            {language === "en"
              ? "Please log in to view history."
              : "يرجى تسجيل الدخول لعرض السجل."}
          </p>
        ) : history.length === 0 ? (
          <p className="text-gray-600 text-center text-sm">
            {language === "en" ? "No history found." : "لا يوجد سجل محفوظ."}
          </p>
        ) : (
          <>
            <ul className="space-y-3 mb-4">
              {history.map((entry, idx) => (
                <li key={idx} className="border p-3 rounded shadow-sm bg-white">
                  <h2 className="font-medium text-base">
                    {entry.title ||
                      (language === "en" ? "Untitled" : "بدون عنوان")}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>

                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      onClick={() => handleRestore(entry)}
                      className="bg-[#FFEF9D] text-black px-2 py-1 text-sm border rounded hover:bg-[#f7de59]"
                    >
                      {language === "en" ? "Restore" : "استعادة"}
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      className="bg-[#f74040] text-white px-2 py-1 text-sm rounded hover:bg-red-600"
                    >
                      {language === "en" ? "Delete" : "حذف"}
                    </button>
                    <button
                      onClick={() => handlePublishClick(entry)}
                      disabled={isPublishing === entry.timestamp}
                      className={`px-3 rounded shadow font-semibold transition duration-200 flex items-center gap-2 ${
                        entry.data.savedExam
                          ? "bg-green-600 hover:bg-[#ff6464] text-white shadow-lg"
                          : "bg-[#FFB3B3] text-black font-semibold hover:bg-[#ffa1a1] transition"
                      } ${
                        isPublishing === entry.timestamp
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isPublishing === entry.timestamp ? (
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
                          {entry.data.savedExam ? (
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
                              {language === "ar"
                                ? "إلغاء نشر الامتحان"
                                : "Unpublish Exam"}
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
                  </div>
                </li>
              ))}
              {showPublishModal && (
                <PublishModal selectedEntry={selectedEntry} />
              )}
            </ul>

            <div className="text-center">
              <button
                onClick={handleClearAll}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-red-500 text-sm"
              >
                {language === "en" ? "Clear All History" : "مسح كل السجل"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Preview Window Modal */}
      {showPreviewRestore && (
        <div className="pt-20 fixed inset-0 bg-transparent bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-semibold text-gray-800">
                {language === "en" ? "Exam Preview" : "معاينة الامتحان"}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={downloadPdf}
                  className="bg-[#FFEF9D] hover:bg-green-600 text-black px-4 py-2 border rounded flex items-center gap-2 text-sm font-medium transition"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {language === "en" ? "Download" : "تحميل"}
                </button>
                <button
                  onClick={handleClosePreview}
                  className="bg-[#F7947C] hover:bg-[#F06F4F] text-white px-3 py-2 rounded text-sm font-medium transition"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              <div
                id="export-content"
                className="p-4 rounded transition-all duration-500 w-full h-full"
                style={{ minHeight: 0 }} // ensures flexbox scrolling works
                dangerouslySetInnerHTML={{ __html: selectedExamHtml }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default History;
