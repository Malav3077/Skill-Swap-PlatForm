import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, Star, AlertCircle, CheckCircle } from 'lucide-react';

const AuthForms: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
    name: ''
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const errors = { email: '', password: '', name: '' };
    let isValid = true;

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    if (!isLogin && !formData.name) {
      errors.name = 'Full name is required';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };
  const { login, register, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        setSuccess('Login successful! Redirecting...');
      } else {
        await register(formData.email, formData.password, formData.name);
        setSuccess('Account created successfully! Welcome to SkillSwap!');
      }
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Try again or reset your password.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists. Try logging in.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 6 characters with letters and numbers.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'This doesn’t look like a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.code === 'auth/internal-error') {
        errorMessage = 'Something went wrong on our end. Please try again shortly.';
      } else if (error.message) {
        errorMessage = error.message;
      }


      setError(errorMessage);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await loginWithGoogle();
      setSuccess('Google login successful! Welcome to SkillSwap!');
    } catch (error: any) {
      let errorMessage = 'Google login failed. Please try again.';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Google sign-in popup was closed. Please try again.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Another sign-in attempt is already in progress.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setLoading(false);
    };
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear field error when user starts typing
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors({ ...fieldErrors, [field]: '' });
    }
    // Clear general error when user makes changes
    if (error) setError('');
    if (success) setSuccess('');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-200">
              <Star className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SkillSwap Platform
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Welcome back! Sign in to your account' : 'Create your account and start swapping skills'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2 animate-fade-in">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`pl-12 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${fieldErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {fieldErrors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{fieldErrors.name}</span>
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-12 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  placeholder="Enter your email"
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{fieldErrors.email}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`pl-12 pr-12 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{fieldErrors.password}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Please wait...</span>
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Google</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>


        </div>
      </div>
    </div>
  );
};

// Add custom CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in { animation: fade-in 0.3s ease-out; }
`;
document.head.appendChild(style);
export default AuthForms;