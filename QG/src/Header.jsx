import { useNavigate } from "react-router-dom";
import { useLanguage } from "./hooks/useLanguage";
import { useEffect, useState, useRef, use } from "react";
import { FiGlobe } from "react-icons/fi";

function Header() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const [user, setUser] = useState(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const langRef = useRef(null);
  const userRef = useRef(null);
  const [showhistory, setShowHistory] = useState(false);

  // Admin code modal states
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [adminError, setAdminError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // You can change this admin code to whatever you prefer
  const ADMIN_CODE = "ADMIN2024"; // Change this to your desired admin code

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      setShowHistory(savedUser.user_type === "teacher");
    } else {
      setUser(null);
      setShowHistory(false);
    }
  }, []);

  const handleGetStartedClick = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    } else {
      navigate("/Generate");
    }
  };

  const handleGetStarted = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    } else {
      navigate("/Generate-subject");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleManageAccountsClick = () => {
    setUserDropdownOpen(false);
    setShowAdminModal(true);
    setAdminCode("");
    setAdminError("");
  };

  const handleAdminCodeSubmit = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setAdminError("");

    // Simulate verification delay (you can remove this if you want instant verification)
    setTimeout(() => {
      if (adminCode === ADMIN_CODE) {
        setShowAdminModal(false);
        setAdminCode("");
        navigate("/admin/manage-accounts"); // Navigate to admin panel
      } else {
        setAdminError(
          language === "en" ? "Invalid admin code" : "رمز الإدارة غير صحيح"
        );
      }
      setIsVerifying(false);
    }, 500);
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setAdminCode("");
    setAdminError("");
  };

  const getUserTypeDisplay = (type) => {
    if (!type) return language === "en" ? "User" : "مستخدم";
    if (language === "en") {
      return type.charAt(0).toUpperCase() + type.slice(1);
    } else {
      return type === "student" ? "طالب" : "معلم";
    }
  };

  return (
    <>
      <header>
        <nav className="w-full h-20 flex items-center justify-between px-8 md:px-20 fixed top-0 left-0 z-50 bg-white">
          <div
            className={`flex gap-4 items-center ${
              language === "en" ? "order-2" : "order-1"
            }`}
          >
            {/* 🌐 Language dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen((prev) => !prev)}
                className="bg-black text-white px-3 py-[11px] rounded-lg hover:bg-gray-600 flex items-center"
              >
                <FiGlobe className="text-lg" />
              </button>
              {langDropdownOpen && (
                <div className="absolute mt-2 right-0 bg-white border rounded shadow-lg z-50">
                  <button
                    onClick={() => {
                      if (language !== "en") toggleLanguage();
                      setLangDropdownOpen(false);
                    }}
                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      if (language !== "ar") toggleLanguage();
                      setLangDropdownOpen(false);
                    }}
                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                  >
                    العربية
                  </button>
                </div>
              )}
            </div>

            {/* Auth buttons or User Dropdown */}
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-black text-white px-3 py-1.5 rounded hover:bg-gray-700 transition-all duration-300"
                >
                  {language === "en" ? "Login" : "تسجيل الدخول"}
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-black text-white px-3 py-1.5 rounded hover:bg-gray-700 transition-all duration-300"
                >
                  {language === "en" ? "Sign Up" : "إنشاء حساب"}
                </button>
              </>
            ) : (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  className="h-10 w-10 bg-black text-white p-3 rounded-lg cursor-pointer"
                >
                  <img
                    src="/userw.png"
                    alt="user icon"
                    className="h-full w-full object-contain"
                  />
                </button>
                {userDropdownOpen && (
                  <div
                    className={`absolute mt-2 w-48 bg-white border rounded shadow-lg z-50 ${
                      language === "ar" ? "left-0" : "right-0"
                    }`}
                  >
                    {/* User type label */}
                    <div className="px-4 py-1 text-xs text-center text-gray-500 bg-gray-50">
                      {getUserTypeDisplay(user.user_type)}
                    </div>
                    {/* Username */}
                    <p className="px-4 py-2 text-gray-800 border-b">
                      {user.username}
                    </p>

                    {/* 📜 History Link */}
                    {showhistory && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          navigate("/history");
                        }}
                        className="w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100"
                      >
                        {language === "en" ? "History" : "السجل"}
                      </button>
                    )}

                    {/* 👑 Manage Accounts - Only for teachers */}
                    {user?.user_type === "teacher" && (
                      <button
                        onClick={handleManageAccountsClick}
                        className="w-full text-left px-4 py-2 text-purple-600 hover:bg-gray-100"
                      >
                        {language === "en"
                          ? "Manage Accounts"
                          : "إدارة الحسابات"}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100"
                    >
                      {language== 'ar' ? "الملف الشخصي" : "Profile"}
                    </button>
                    {/* 🔓 Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      {language === "en" ? "Logout" : "تسجيل الخروج"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation links */}
          <ul
            dir={language === "ar" ? "rtl" : "ltr"}
            className="absolute left-1/2 transform -translate-x-1/2 flex space-x-0 rtl:space-x-reverse text-black text-lg gap-14"
          >
            <li className="flex gap-4">
              <a
                href="/"
                className="px-4 py-2 rounded transition-all duration-300 hover:bg-[#FFEF9D] hover:text-black"
              >
                {language === "en" ? "Home" : "الرئيسية"}
              </a>
              <a
                onClick={handleGetStartedClick}
                className="cursor-pointer px-4 py-2 rounded transition-all duration-300 hover:bg-[#FFEF9D] hover:text-black"
              >
                {language === "en" ? "Generate Questions" : "أنشئ"}
              </a>
              {user?.user_type === "teacher" && (
                <>
                  <a
                    onClick={handleGetStarted}
                    className="cursor-pointer px-4 py-2 rounded transition-all duration-300 hover:bg-[#FFEF9D] hover:text-black"
                  >
                    {language === "en" ? "Generate Subject" : "أنشئ موضوع"}
                  </a>
                </>
              )}

              {user?.user_type === "student" && (
                <a
                  onClick={() => navigate("/see-exams")}
                  className="cursor-pointer px-4 py-2 rounded transition-all duration-300 hover:bg-[#FFEF9D] hover:text-black"
                >
                  {language === "en" ? "See Exams" : "شاهد الإمتحانات"}
                </a>
              )}
            </li>
          </ul>

          {/* Logo */}
          <div className={` ${language === "en" ? "order-1" : "order-2"}`}>
            <img src="/logo.png" alt="logo" className="h-25" />
          </div>
        </nav>
      </header>

      {/* Admin Code Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-center mb-4">
              {language === "en" ? "Enter Admin Code" : "أدخل رمز الإدارة"}
            </h2>
            <form onSubmit={handleAdminCodeSubmit}>
              <div className="mb-4">
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder={
                    language === "en" ? "Enter admin code" : "أدخل رمز الإدارة"
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                  autoFocus
                />
              </div>

              {adminError && (
                <p className="text-red-500 text-sm mb-4 text-center">
                  {adminError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeAdminModal}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  disabled={isVerifying}
                >
                  {language === "en" ? "Cancel" : "إلغاء"}
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
                >
                  {isVerifying ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  ) : language === "en" ? (
                    "Verify"
                  ) : (
                    "تحقق"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
