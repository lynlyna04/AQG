import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { useLanguage } from "./hooks/useLanguage";

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

  const handleRestore = (entry) => {
    localStorage.setItem("subjectText", entry.data.previewText);
    localStorage.setItem("subjectQuestions", JSON.stringify(entry.data.subjectOptions));
    localStorage.setItem("questionCount", entry.data.totalQuestions);
    navigate("/generate-subjectopt");
  };

  const handleDelete = (index) => {
    const updatedHistory = [...history];
    updatedHistory.splice(index, 1);
    setHistory(updatedHistory);
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
  };

  const handleClearAll = () => {
    setHistory([]);
    localStorage.removeItem(historyKey);
  };

  return (
    <>
      <Header />
      <div className="p-6 mt-28 max-w-xl mx-auto">
        <h1 className="text-xl font-bold mb-6 text-center">
          {language === "en" ? "📜 History" : "📜 السجل"}
        </h1>

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
                <li
                  key={idx}
                  className="border p-3 rounded shadow-sm bg-white"
                >
                  <h2 className="font-medium text-base">
                    {entry.title || (language === "en" ? "Untitled" : "بدون عنوان")}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>

                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      onClick={() => handleRestore(entry)}
                      className="bg-blue-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-600"
                    >
                      {language === "en" ? "Restore" : "استعادة"}
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600"
                    >
                      {language === "en" ? "Delete" : "حذف"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="text-center">
              <button
                onClick={handleClearAll}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
              >
                {language === "en" ? "Clear All History" : "مسح كل السجل"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default History;
