import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useLanguage } from "./hooks/useLanguage";

function Studentsect() {
  const { language, toggleLanguage } = useLanguage();
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [publishedExams, setPublishedExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isLoadingExams, setIsLoadingExams] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Translation object
  const translations = {
    ar: {
      selectTeacherAndExam: "اختر المعلم والامتحان",
      selectTeacher: ": اختر المعلم",
      selectTeacherOption: "-- اختر معلم --",
      noTeachers: "لا يوجد معلمين",
      loadingTeachers: "جار تحميل المعلمين...",
      examsOf: "امتحانات",
      loadingExams: "جار تحميل الامتحانات...",
      noPublishedExams: "لا توجد امتحانات منشورة من هذا المعلم.",
      loading: "جار التحميل...",
      loadingExam: "جار تحميل الامتحان...",
      downloadExam: "تحميل الامتحان",
      selectExamToView: "اختر امتحاناً لعرضه",
      exportContentNotFound: "Export content not found in the DOM.",
      generatingPdf: "Generating PDF...",
      errorLoadingExam: "حدث خطأ في تحميل الامتحان",
      errorGeneratingPdf: "Failed to generate PDF:",
    },
    en: {
      selectTeacherAndExam: "Select Teacher and Exam",
      selectTeacher: "Select Teacher:",
      selectTeacherOption: "-- Select a Teacher --",
      noTeachers: "No teachers available",
      loadingTeachers: "Loading teachers...",
      examsOf: "Exams by",
      loadingExams: "Loading exams...",
      noPublishedExams: "No published exams from this teacher.",
      loading: "Loading...",
      loadingExam: "Loading exam...",
      downloadExam: "Download Exam",
      selectExamToView: "Select an exam to view",
      exportContentNotFound: "Export content not found in the DOM.",
      generatingPdf: "Generating PDF...",
      errorLoadingExam: "Error loading exam",
      errorGeneratingPdf: "Failed to generate PDF:",
    },
  };

  const t = translations[language];

  useEffect(() => {
    axios
      .get("http://localhost:5000/see-exams")
      .then((res) => {
        console.log("Teachers data:", res.data);
        setTeachers(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Function to get published exams for selected teacher
  const getPublishedExams = (teacherUsername) => {
    if (!teacherUsername) {
      setPublishedExams([]);
      setSelectedExam(null);
      return;
    }

    setIsLoadingExams(true);
    const historyKey = `subjectHistory_${teacherUsername}`;

    try {
      // Get teacher's history from localStorage
      const history = JSON.parse(localStorage.getItem(historyKey) || "[]");

      // Filter only published exams (savedExam: true)
      const published = history.filter(
        (exam) => exam.data && exam.data.savedExam === true
      );

      setPublishedExams(published);
    } catch (error) {
      console.error("Error getting published exams:", error);
      setPublishedExams([]);
    } finally {
      setIsLoadingExams(false);
    }
  };

  // Handle teacher selection
  const handleTeacherChange = (e) => {
    const teacherUsername = e.target.value;
    setSelectedTeacher(teacherUsername);
    setSelectedExam(null); // Clear selected exam when teacher changes
    getPublishedExams(teacherUsername);
  };

  // Handle exam selection and load preview
  const [selectedExamHtml, setSelectedExamHtml] = useState("");
  const handleExamClick = (exam) => {
    setIsLoadingPreview(true);
    setSelectedExam(exam);

    setTimeout(() => {
      try {
        const data = exam.data;
        if (!data || !data.html) throw new Error("Missing HTML content");
        setSelectedExamHtml(data.html);
        setIsLoadingPreview(false);
      } catch (error) {
        console.error("Error loading exam preview:", error);
        alert(t.errorLoadingExam);
        setIsLoadingPreview(false);
      }
    }, 800);
  };

  // Download functionality
  // PDF Download
  const downloadPdf = async () => {
    try {
      // Find the content element to export
      const contentDiv = document.getElementById("export-content");

      if (!contentDiv) {
        alert(t.exportContentNotFound);
        return;
      }

      // Show loading indicator (optional)
      const loadingIndicator = document.createElement("div");
      loadingIndicator.textContent = t.generatingPdf;
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
      alert(`${t.errorGeneratingPdf} ${error.message}`);
    }
  };

  return (
    <>
      <Header />
      <div
        className={`p-6 mt-24 max-w-7xl mx-auto ${
          language === "ar" ? "rtl" : "ltr"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {t.selectTeacherAndExam}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Teacher and Exam Selection */}
          <div className="space-y-6">
            {/* Teacher Selection */}
            <div>
              <label
                className={`block text-lg font-medium mb-2 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t.selectTeacher}
              </label>
              {Array.isArray(teachers) && teachers.length > 0 ? (
                <select
                  className="w-full bg-gray-50 p-4 rounded shadow"
                  value={selectedTeacher}
                  onChange={handleTeacherChange}
                >
                  <option value="">{t.selectTeacherOption}</option>
                  {teachers.map((teacher, index) => (
                    <option key={index} value={teacher.username}>
                      {teacher.username}
                    </option>
                  ))}
                </select>
              ) : teachers.length === 0 ? (
                <p>{t.noTeachers}</p>
              ) : (
                <p>{t.loadingTeachers}</p>
              )}
            </div>

            {/* Published Exams Section */}
            {selectedTeacher && (
              <div>
                <h3
                  className={`text-xl font-medium mb-4 ${
                    language === "ar" ? "text-right rtl" : "text-left ltr"
                  } `}
                >
                  {language === "ar"
                    ? `: ${selectedTeacher} ${t.examsOf}`
                    : `${t.examsOf} ${selectedTeacher}:`}
                </h3>

                {isLoadingExams ? (
                  <p className="text-center">{t.loadingExams}</p>
                ) : publishedExams.length > 0 ? (
                  <div className="space-y-3">
                    {publishedExams.map((exam, index) => (
                      <div
                        key={index}
                        className={`bg-white border rounded-lg p-4 shadow cursor-pointer transition-all hover:shadow-md ${
                          selectedExam &&
                          selectedExam.timestamp === exam.timestamp
                            ? "border-blue-500 bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleExamClick(exam)}
                      >
                        <div
                          className={`flex justify-between items-center ${
                            language === "ar" ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          <div
                            className={
                              language === "ar" ? "text-right" : "text-left"
                            }
                          >
                            <h4 className="font-semibold text-lg">
                              {exam.title}...
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {new Date(exam.timestamp).toLocaleDateString(
                                language === "ar" ? "ar-EG" : "en-US"
                              )}
                            </p>
                          </div>
                          {selectedExam &&
                            selectedExam.timestamp === exam.timestamp && (
                              <div className="text-blue-500">
                                <svg
                                  className="w-6 h-6"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">{t.noPublishedExams}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Exam Preview */}
          <div className="flex justify-center">
            {selectedExam ? (
              isLoadingPreview ? (
                <div className="w-[550px] h-[400px] rounded-[10px] border border-gray-300 shadow-md flex items-center justify-center">
                  <div className="text-center">
                    <div
                      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FFB3B3] border-r-transparent align-[-0.125em]"
                      role="status"
                    >
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        {t.loading}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600">{t.loadingExam}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Download Button */}
                  <div className="text-center">
                    <button
                      onClick={downloadPdf}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow"
                    >
                      {t.downloadExam}
                    </button>
                  </div>

                  {/* Exam Preview */}
                  <div
                    id="export-content"
                    className="p-4 border rounded transition-all duration-500 text-right"
                    dangerouslySetInnerHTML={{ __html: selectedExamHtml }}
                  ></div>
                </div>
              )
            ) : (
              <div className="w-[550px] h-[400px] rounded-[10px] border border-gray-300 shadow-md flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  {t.selectExamToView}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Studentsect;
