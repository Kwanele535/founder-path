import React, { useState } from 'react';
import { UserState } from '../../types';
import { SparklesIcon, GoogleIcon, AppleIcon, FacebookIcon, PhoneIcon, ChevronLeftIcon, MailIcon } from '../Icons';
import Loader from '../Loader';

interface AuthViewProps {
  onLogin: (user: Partial<UserState>) => void;
  onBack: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'social' | 'phone' | 'email'>('social');
  const [inputValue, setInputValue] = useState('');

  const handleSimulateLogin = (provider: string) => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
        const mockName = provider === 'Phone' ? 'Founder' : `${provider} User`;
        onLogin({ name: mockName });
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    handleSimulateLogin(method === 'phone' ? 'Phone' : 'Email');
  };

  if (loading) {
      return (
          <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
              <Loader text="Authenticating..." />
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 animate-fade-in">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        {/* Header */}
        <div className="mb-10 mt-4">
             {method !== 'social' && (
                <button 
                    onClick={() => setMethod('social')}
                    className="mb-6 p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
            )}
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl transform -rotate-3">
                <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                {method === 'social' ? 'Get Started' : method === 'phone' ? 'Enter Phone' : 'Enter Email'}
            </h1>
            <p className="text-gray-500 font-medium">
                {method === 'social' 
                    ? 'Join the community of founders.' 
                    : method === 'phone' 
                    ? 'We will send you a verification code.' 
                    : 'Sign in with your email address.'}
            </p>
        </div>

        {/* Social Methods */}
        {method === 'social' && (
            <div className="space-y-4">
                <button 
                    onClick={() => handleSimulateLogin('Google')}
                    className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-2xl transition-all shadow-sm hover:shadow-md"
                >
                    <GoogleIcon className="w-5 h-5" />
                    <span>Continue with Google</span>
                </button>

                <button 
                    onClick={() => handleSimulateLogin('Apple')}
                    className="w-full flex items-center justify-center space-x-3 bg-black text-white hover:bg-gray-800 font-bold py-4 rounded-2xl transition-all shadow-xl hover:shadow-2xl"
                >
                    <AppleIcon className="w-5 h-5" />
                    <span>Continue with Apple</span>
                </button>

                <button 
                    onClick={() => handleSimulateLogin('Facebook')}
                    className="w-full flex items-center justify-center space-x-3 bg-[#1877F2] text-white hover:bg-[#166fe5] font-bold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg"
                >
                    <FacebookIcon className="w-6 h-6" />
                    <span>Continue with Facebook</span>
                </button>

                <div className="relative py-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-400 font-medium">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <button 
                        onClick={() => setMethod('phone')}
                        className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-200 hover:bg-white transition-all"
                    >
                        <PhoneIcon className="w-6 h-6 text-gray-900 mb-2" />
                        <span className="text-sm font-bold text-gray-900">Phone</span>
                    </button>
                    <button 
                        onClick={() => setMethod('email')}
                        className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-200 hover:bg-white transition-all"
                    >
                        <MailIcon className="w-6 h-6 text-gray-900 mb-2" />
                        <span className="text-sm font-bold text-gray-900">Email</span>
                    </button>
                </div>
            </div>
        )}

        {/* Input Methods */}
        {method !== 'social' && (
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="space-y-4">
                    <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-transparent focus-within:border-gray-900 focus-within:bg-white transition-all">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                            {method === 'phone' ? 'Phone Number' : 'Email Address'}
                        </label>
                        <input
                            type={method === 'phone' ? 'tel' : 'email'}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={method === 'phone' ? '+1 (555) 000-0000' : 'founder@startup.com'}
                            className="w-full bg-transparent border-none p-0 text-lg font-bold text-gray-900 placeholder-gray-300 focus:ring-0 outline-none"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="mt-auto pt-6">
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="w-full bg-gray-900 disabled:bg-gray-300 text-white text-lg font-bold py-5 rounded-[2rem] shadow-xl transition-all active:scale-95"
                    >
                        Continue
                    </button>
                </div>
            </form>
        )}

        {/* Footer */}
        {method === 'social' && (
            <p className="mt-8 text-center text-xs text-gray-400 leading-relaxed px-8">
                By continuing, you agree to FounderPath's <span className="text-gray-900 font-bold cursor-pointer">Terms of Service</span> and <span className="text-gray-900 font-bold cursor-pointer">Privacy Policy</span>.
            </p>
        )}
      </div>
    </div>
  );
};

export default AuthView;