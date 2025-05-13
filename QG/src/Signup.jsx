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



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (formData.password !== formData.confirmPassword) {
            setError(texts[language].error);
            return;
        }
    
        setError('');
    
        // Adjust the backend URL to point to your Node.js server (port 5001)
        axios.post('http://localhost:5001/signup', {
            username: formData.username,
            email: formData.email,
            password: formData.password
        })
        .then(response => {
            console.log('Signup response:', response.data);

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
                setError("No response from server. Please try again.");
            } else {
                console.error('Error message:', error.message);
                setError("An error occurred. Please try again.");
            }
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
            error: 'Passwords do not match',
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
            error: 'كلمتا المرور غير متطابقتين',
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
        {language === 'en' ? 'Signup Successful!' : 'تم التسجيل بنجاح!'}
      </h2>
      <p className="text-gray-700">
        {language === 'en' ? 'Redirecting to home...' : 'سيتم التوجيه إلى الصفحة الرئيسية...'}
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
                        {error && (
                            <p className="text-red-500 text-sm mt-1">{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#FFB3B3] text-black py-2 rounded-lg hover:bg-[#f3a8c7] transition"
                    >
                        {texts[language].button}
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default Signup;
