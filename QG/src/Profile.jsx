import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useState, useEffect } from 'react';
import { useLanguage } from './hooks/useLanguage';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const { language } = useLanguage();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('info');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Form states
    const [profileForm, setProfileForm] = useState({
        username: '',
        email: ''
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [deleteForm, setDeleteForm] = useState({
        password: ''
    });

    useEffect(() => {
        // Load user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setProfileForm({
                username: parsedUser.username,
                email: parsedUser.email
            });
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleProfileChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handleDeleteChange = (e) => {
        setDeleteForm({ ...deleteForm, [e.target.name]: e.target.value });
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.put('http://localhost:5000/profile', {
                username: profileForm.username,
                email: profileForm.email,
                currentEmail: user.email // Send current email for identification
            });

            // Update localStorage with new data
            const updatedUser = { ...user, username: profileForm.username, email: profileForm.email };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            setSuccessMessage(texts[language].profileUpdated);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError(texts[language].generalError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError(texts[language].passwordMismatch);
            setIsLoading(false);
            return;
        }

        try {
            await axios.put('http://localhost:5000/password', {
                email: user.email,
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });

            setSuccessMessage(texts[language].passwordUpdated);
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError(texts[language].generalError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const deleteAccount = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await axios.delete('http://localhost:5000/account', {
                data: {
                    email: user.email,
                    password: deleteForm.password
                }
            });

            // Clear localStorage and redirect
            localStorage.removeItem('user');
            navigate('/');
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError(texts[language].generalError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const texts = {
        en: {
            title: 'Profile',
            personalInfo: 'Personal Information',
            changePassword: 'Change Password',
            deleteAccount: 'Delete Account',
            username: 'Username',
            email: 'Email',
            userType: 'User Type',
            currentPassword: 'Current Password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm New Password',
            save: 'Save Changes',
            update: 'Update',
            delete: 'Delete Account',
            cancel: 'Cancel',
            confirmDelete: 'Confirm Account Deletion',
            deleteWarning: 'This action cannot be undone. Please enter your password to confirm.',
            passwordMismatch: 'New passwords do not match',
            profileUpdated: 'Profile updated successfully!',
            passwordUpdated: 'Password updated successfully!',
            generalError: 'An error occurred. Please try again.',
            student: 'Student',
            teacher: 'Teacher',
            placeholder: {
                username: 'Enter username',
                email: 'Enter email',
                currentPassword: 'Enter current password',
                newPassword: 'Enter new password',
                confirmPassword: 'Confirm new password',
                deletePassword: 'Enter password to confirm deletion'
            }
        },
        ar: {
            title: 'الملف الشخصي',
            personalInfo: 'المعلومات الشخصية',
            changePassword: 'تغيير كلمة المرور',
            deleteAccount: 'حذف الحساب',
            username: 'اسم المستخدم',
            email: 'البريد الإلكتروني',
            userType: 'نوع المستخدم',
            currentPassword: 'كلمة المرور الحالية',
            newPassword: 'كلمة المرور الجديدة',
            confirmPassword: 'تأكيد كلمة المرور الجديدة',
            save: 'حفظ التغييرات',
            update: 'تحديث',
            delete: 'حذف الحساب',
            cancel: 'إلغاء',
            confirmDelete: 'تأكيد حذف الحساب',
            deleteWarning: 'لا يمكن التراجع عن هذا الإجراء. يرجى إدخال كلمة المرور للتأكيد.',
            passwordMismatch: 'كلمتا المرور الجديدتان غير متطابقتين',
            profileUpdated: 'تم تحديث الملف الشخصي بنجاح!',
            passwordUpdated: 'تم تحديث كلمة المرور بنجاح!',
            generalError: 'حدث خطأ. حاول مرة أخرى.',
            student: 'طالب',
            teacher: 'معلم',
            placeholder: {
                username: 'أدخل اسم المستخدم',
                email: 'أدخل البريد الإلكتروني',
                currentPassword: 'أدخل كلمة المرور الحالية',
                newPassword: 'أدخل كلمة المرور الجديدة',
                confirmPassword: 'أكد كلمة المرور الجديدة',
                deletePassword: 'أدخل كلمة المرور لتأكيد الحذف'
            }
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold text-red-600 mb-4">
                            {texts[language].confirmDelete}
                        </h3>
                        <p className="text-gray-700 mb-4">
                            {texts[language].deleteWarning}
                        </p>
                        <form onSubmit={deleteAccount}>
                            <input
                                type="password"
                                name="password"
                                value={deleteForm.password}
                                onChange={handleDeleteChange}
                                placeholder={texts[language].placeholder.deletePassword}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 mb-4"
                            />
                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteForm({ password: '' });
                                        setError('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    {texts[language].cancel}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                >
                                    {isLoading ? 'Deleting...' : texts[language].delete}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-center mb-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        {texts[language].title}
                    </h1>

                    {/* Tab Navigation */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="flex border-b" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`flex-1 py-3 px-4 font-medium transition ${
                                    activeTab === 'info'
                                        ? 'bg-[#FFEF9D] text-black border-b-2 border-[#FFEF9D]'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {texts[language].personalInfo}
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`flex-1 py-3 px-4 font-medium transition ${
                                    activeTab === 'password'
                                        ? 'bg-[#FFEF9D] text-black border-b-2 border-[#FFEF9D]'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {texts[language].changePassword}
                            </button>
                            <button
                                onClick={() => setActiveTab('delete')}
                                className={`flex-1 py-3 px-4 font-medium transition ${
                                    activeTab === 'delete'
                                        ? 'bg-red-100 text-red-600 border-b-2 border-red-500'
                                        : 'text-red-500 hover:bg-red-50'
                                }`}
                            >
                                {texts[language].deleteAccount}
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Success/Error Messages */}
                            {successMessage && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                    {successMessage}
                                </div>
                            )}

                            {/* Personal Information Tab */}
                            {activeTab === 'info' && (
                                <form onSubmit={updateProfile} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                {texts[language].username}
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={profileForm.username}
                                                onChange={handleProfileChange}
                                                placeholder={texts[language].placeholder.username}
                                                required
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                {texts[language].email}
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={profileForm.email}
                                                onChange={handleProfileChange}
                                                placeholder={texts[language].placeholder.email}
                                                required
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                {texts[language].userType}
                                            </label>
                                            <input
                                                type="text"
                                                value={texts[language][user.user_type]}
                                                disabled
                                                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
                                            />
                                        </div>

                                        {error && (
                                            <p className="text-red-500 text-sm">{error}</p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-[#FFB3B3] text-black py-2 rounded-lg hover:bg-[#F7947C] transition disabled:opacity-50"
                                        >
                                            {isLoading ? 'Saving...' : texts[language].save}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Change Password Tab */}
                            {activeTab === 'password' && (
                                <form onSubmit={updatePassword} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                {texts[language].currentPassword}
                                            </label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={passwordForm.currentPassword}
                                                onChange={handlePasswordChange}
                                                placeholder={texts[language].placeholder.currentPassword}
                                                required
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                {texts[language].newPassword}
                                            </label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordForm.newPassword}
                                                onChange={handlePasswordChange}
                                                placeholder={texts[language].placeholder.newPassword}
                                                required
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                {texts[language].confirmPassword}
                                            </label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordForm.confirmPassword}
                                                onChange={handlePasswordChange}
                                                placeholder={texts[language].placeholder.confirmPassword}
                                                required
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>

                                        {error && (
                                            <p className="text-red-500 text-sm">{error}</p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-[#FFB3B3] text-black py-2 rounded-lg hover:bg-[#F7947C] transition disabled:opacity-50"
                                        >
                                            {isLoading ? 'Updating...' : texts[language].update}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Delete Account Tab */}
                            {activeTab === 'delete' && (
                                <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                        <p className="text-red-700">
                                            {texts[language].deleteWarning}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                                    >
                                        {texts[language].delete}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Profile;