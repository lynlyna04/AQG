import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useState } from 'react';
import { useLanguage } from './hooks/useLanguage';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const { language } = useLanguage();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
      
        if (!formData.email || !formData.password) {
          setError(texts[language].emptyFields);
          setIsLoading(false);
          return;
        }
      
        setError('');
      
        axios.post('http://localhost:5000/login', {
          email: formData.email,
          password: formData.password
        })
        .then(response => {
            console.log(response.data);
            const { username, email, user_type } = response.data; // match backend naming

localStorage.setItem('user', JSON.stringify({
    username,
    email,
    user_type // snake_case, consistent with signup
}));


    
            // Show success modal
            setShowSuccessModal(true);
          
            // Redirect after a successful login
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/');
            }, 2000);
        })
        .catch(error => {
            if (error.response) {
                setError(error.response.data.message);
            } else if (error.request) {
                setError(texts[language].noResponse);
            } else {
                setError(texts[language].generalError);
            }
        })
        .finally(() => {
            setIsLoading(false);
        });
    };
    
    const texts = {
        en: {
            title: 'Login',
            email: 'Email',
            password: 'Password',
            button: 'Login',
            emptyFields: 'Please fill in all fields',
            noResponse: 'No response from server. Try again.',
            generalError: 'Login error. Try again.',
            success: 'Login Successful!',
            redirecting: 'Redirecting to home...',
            placeholder: {
                email: 'Enter email',
                password: 'Enter password',
            }
        },
        ar: {
            title: 'تسجيل الدخول',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            button: 'دخول',
            emptyFields: 'يرجى ملء جميع الحقول',
            noResponse: 'لا استجابة من الخادم. حاول مرة أخرى.',
            generalError: 'خطأ في تسجيل الدخول. حاول مرة أخرى.',
            success: 'تم تسجيل الدخول بنجاح!',
            redirecting: 'سيتم التوجيه إلى الصفحة الرئيسية...',
            placeholder: {
                email: 'أدخل البريد الإلكتروني',
                password: 'أدخل كلمة المرور',
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
            
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <form
                    onSubmit={handleSubmit}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                    className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4"
                >
                    <h2 className="text-2xl font-semibold text-center mb-4">
                        {texts[language].title}
                    </h2>

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

export default Login;