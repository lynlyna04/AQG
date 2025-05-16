import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useState } from 'react';
import { useLanguage } from './hooks/useLanguage';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const { language } = useLanguage();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        if (formData.password !== formData.confirmPassword) {
            setError(texts[language].passwordMismatch);
            setIsLoading(false);
            return;
        }

        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError(texts[language].emptyFields);
            setIsLoading(false);
            return;
        }
    
        setError('');
    
        // Adjust the backend URL to point to your Node.js server (port 5001)
        axios.post('http://localhost:5000/signup', {
            username: formData.username,
            email: formData.email,
            password: formData.password
        })
        .then(response => {
            console.log('Signup response:', response.data);

            // Store only non-sensitive user info
            localStorage.setItem('user', JSON.stringify({
                username: formData.username,
                email: formData.email
            }));
            
            setShowSuccessModal(true); // show modal

            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/');
            }, 2000); // delay then redirect
        })
        .catch(error => {
            if (error.response) {
                console.error('Error response:', error.response.data);
                setError(error.response.data.message);
            } else if (error.request) {
                console.error('No response received:', error.request);
                setError(texts[language].noResponse);
            } else {
                console.error('Error message:', error.message);
                setError(texts[language].generalError);
            }
        })
        .finally(() => {
            setIsLoading(false);
        });
    };
    
    const texts = {
        en: {
            title: 'Sign Up',
            username: 'Username',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            button: 'Sign Up',
            passwordMismatch: 'Passwords do not match',
            emptyFields: 'Please fill in all fields',
            noResponse: 'No response from server. Please try again.',
            generalError: 'An error occurred. Please try again.',
            success: 'Signup Successful!',
            redirecting: 'Redirecting to home...',
            placeholder: {
                username: 'Enter username',
                email: 'Enter email',
                password: 'Enter password',
                confirmPassword: 'Confirm password',
            }
        },
        ar: {
            title: 'إنشاء حساب',
            username: 'اسم المستخدم',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            confirmPassword: 'تأكيد كلمة المرور',
            button: 'تسجيل',
            passwordMismatch: 'كلمتا المرور غير متطابقتين',
            emptyFields: 'يرجى ملء جميع الحقول',
            noResponse: 'لا استجابة من الخادم. حاول مرة أخرى.',
            generalError: 'حدث خطأ. حاول مرة أخرى.',
            success: 'تم التسجيل بنجاح!',
            redirecting: 'سيتم التوجيه إلى الصفحة الرئيسية...',
            placeholder: {
                username: 'أدخل اسم المستخدم',
                email: 'أدخل البريد الإلكتروني',
                password: 'أدخل كلمة المرور',
                confirmPassword: 'أكد كلمة المرور',
            }
        }
    };

    return (
        <>
            <Header />
            {showSuccessModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-2xl font-semibold text-green-600 mb-2">
                            {texts[language].success}
                        </h2>
                        <p className="text-gray-700">
                            {texts[language].redirecting}
                        </p>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-center min-h-screen bg-gray-50 h-180">
                <form
                    onSubmit={handleSubmit}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                    className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4"
                >
                    <h2 className="text-2xl font-semibold text-center mb-4">
                        {texts[language].title}
                    </h2>

                    <div>
                        <label className="block mb-1 text-sm font-medium">{texts[language].username}</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder={texts[language].placeholder.username}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">{texts[language].email}</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={texts[language].placeholder.email}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">{texts[language].password}</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={texts[language].placeholder.password}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">{texts[language].confirmPassword}</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder={texts[language].placeholder.confirmPassword}
                            required
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'}`}
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#21FFAE] text-black py-2 rounded-lg hover:bg-[#21FFF0] transition flex items-center justify-center"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                        ) : (
                            texts[language].button
                        )}
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default Signup;