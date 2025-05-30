import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { useState, useEffect } from "react";
import { useLanguage } from "./hooks/useLanguage.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminManageAccounts() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, user: null });
  const [editModal, setEditModal] = useState({ show: false, user: null });
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    user_type: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const SavedUser = JSON.parse(localStorage.getItem("user"));
  const texts = {
    en: {
      title: "Manage Accounts",
      subtitle: "Admin Panel - User Management",
      search: "Search users...",
      filter: "Filter by type",
      all: "All Users",
      students: "Students",
      teachers: "Teachers",
      username: "Username",
      email: "Email",
      userType: "User Type",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete",
      student: "Student",
      teacher: "Teacher",
      noUsers: "No users found",
      loading: "Loading users...",
      deleteConfirm: "Delete User",
      deleteMessage:
        "Are you sure you want to delete this user? This action cannot be undone.",
      cancel: "Cancel",
      confirm: "Confirm",
      editUser: "Edit User",
      save: "Save Changes",
      error: "Error loading users",
      deleteSuccess: "User deleted successfully",
      updateSuccess: "User updated successfully",
      deleteError: "Error deleting user",
      updateError: "Error updating user",
    },
    ar: {
      title: "إدارة الحسابات",
      subtitle: "لوحة الإدارة - إدارة المستخدمين",
      search: "البحث عن المستخدمين...",
      filter: "فلترة حسب النوع",
      all: "جميع المستخدمين",
      students: "الطلاب",
      teachers: "المعلمون",
      username: "اسم المستخدم",
      email: "البريد الإلكتروني",
      userType: "نوع المستخدم",
      actions: "الإجراءات",
      edit: "تعديل",
      delete: "حذف",
      student: "طالب",
      teacher: "معلم",
      noUsers: "لم يتم العثور على مستخدمين",
      loading: "جاري تحميل المستخدمين...",
      deleteConfirm: "حذف المستخدم",
      deleteMessage:
        "هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.",
      cancel: "إلغاء",
      confirm: "تأكيد",
      editUser: "تعديل المستخدم",
      save: "حفظ التغييرات",
      error: "خطأ في تحميل المستخدمين",
      deleteSuccess: "تم حذف المستخدم بنجاح",
      updateSuccess: "تم تحديث المستخدم بنجاح",
      deleteError: "خطأ في حذف المستخدم",
      updateError: "خطأ في تحديث المستخدم",
    },
  };

  // Check if user is authorized (teacher who entered correct admin code)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.user_type !== "teacher") {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get("http://localhost:5000/admin/users");
      setUsers(response.data.users);
    } catch (err) {
      setError(texts[language].error);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async (userId) => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/admin/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      setIsDeleting(false);
      setDeleteModal({ show: false, user: null });
      // You could add a success toast here
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(texts[language].deleteError);
      setIsDeleting(false);
      setDeleteModal({ show: false, user: null });
    }
  };

  const handleEdit = (user) => {
    setEditForm({
      username: user.username,
      email: user.email,
      user_type: user.user_type,
    });
    setEditModal({ show: true, user });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/admin/users/${editModal.user.id}`,
        editForm
      );
      setUsers(
        users.map((user) =>
          user.id === editModal.user.id ? { ...user, ...editForm } : user
        )
      );
      setEditModal({ show: false, user: null });
      setSuccess(texts[language].updateSuccess); // <-- Set success message here
    } catch (err) {
      console.error("Error updating user:", err);
      setError(texts[language].updateError);
    }
  };

  // Filter and search users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || user.user_type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Header />
      <div
        className="min-h-screen bg-gray-50 pt-24 pb-8"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
            language === "ar" ? "text-right" : "text-left"
          }`}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {texts[language].title}
            </h1>
            <p className="text-gray-600">{texts[language].subtitle}</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={texts[language].search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">{texts[language].all}</option>
                <option value="student">{texts[language].students}</option>
                <option value="teacher">{texts[language].teachers}</option>
              </select>
            </div>
          </div>
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Users Table */}
          <div
            className={`bg-white rounded-lg shadow overflow-hidden ${
              language === "ar" ? "text-right" : "text-left"
            } `}
          >
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-gray-600">{texts[language].loading}</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {texts[language].noUsers}
              </div>
            ) : (
              <div
                className={`overflow-x-auto ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {texts[language].username}
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {texts[language].email}
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {texts[language].userType}
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {texts[language].actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.user_type === "teacher"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.user_type === "teacher"
                              ? texts[language].teacher
                              : texts[language].student}
                          </span>
                        </td>
                        <td className="text-sm font-medium">
                          <button
                            onClick={() => handleEdit(user)}
                            className="px-6 py-4 text-blue-600 hover:text-blue-900 mr-4"
                          >
                            {texts[language].edit}
                          </button>
                          <button
                            disabled={user.username === SavedUser.username}
                            onClick={() => setDeleteModal({ show: true, user })}
                            className="text-red-600 hover:text-red-900 transition-colors duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {user.username === SavedUser.username
                              ? language === "en"
                                ? "This is your account, delete from Profile"
                                : "هذا حسابك، احذفه من ملفك الشخصي"
                              : texts[language].delete}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-center mb-4 text-red-600">
              {texts[language].deleteConfirm}
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              {texts[language].deleteMessage}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteModal.user.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center w-full">
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
                  </span>
                ) : (
                  texts[language].confirm
                )}
              </button>
              <button
                onClick={() => setDeleteModal({ show: false, user: null })}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                {texts[language].cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editModal.show && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-center mb-4">
              {texts[language].editUser}
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {texts[language].username}
                </label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {texts[language].email}
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {texts[language].userType}
                </label>
                <select
                  value={editForm.user_type}
                  onChange={(e) =>
                    setEditForm({ ...editForm, user_type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="student">{texts[language].student}</option>
                  <option value="teacher">{texts[language].teacher}</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditModal({ show: false, user: null })}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  {texts[language].cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  {texts[language].save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default AdminManageAccounts;
