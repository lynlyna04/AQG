import { useState } from "react";
import BinaaFikri from "./BinaaFikri.jsx";
import BinaaLughawi from "./BinaaLughawi.jsx";
import { useLanguage } from './hooks/useLanguage';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function Generate() {
  const [activeTab, setActiveTab] = useState("fikri"); // default to fikri
  const { language } = useLanguage();

  return (
    <>
      <Header />

      {/* Toggle Buttons */}
      <div className="flex absolute  justify-center mt-[100px] gap-4 ml-125 mb-[20px]">
        <button
          onClick={() => setActiveTab("fikri")}
          className={`px-6 py-2 border-2 rounded-[15px] font-semibold ${
            activeTab === "fikri"
              ? "bg-[#FFEF9D] border-black"
              : "bg-white border-gray-400"
          }`}
        >
          {language === "ar" ? "بناء فكري" : "Binaa Fikri"}
        </button>
        <button
          onClick={() => setActiveTab("lughawi")}
          className={`px-6 py-2 border-2 rounded-[15px] font-semibold ${
            activeTab === "lughawi"
              ? "bg-[#FFEF9D] border-black"
              : "bg-white border-gray-400"
          }`}
        >
          {language === "ar" ? "بناء لغوي" : "Binaa Lughawi"}
        </button>
      </div>

      {/* Section Rendering */}
      <div className="mt-6">
        {activeTab === "fikri" ? <BinaaFikri /> : <BinaaLughawi />}
      </div>

      <Footer />
    </>
  );
}

export default Generate;
