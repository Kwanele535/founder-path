import React from 'react';
import { SparklesIcon, TargetIcon, UsersIcon, ChevronLeftIcon } from '../Icons';

interface LandingViewProps {
  onStart: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[10%] right-[20%] w-[400px] h-[400px] bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 relative z-10 max-w-md mx-auto w-full">
        {/* Logo / Header */}
        <div className="mb-12">
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl transform -rotate-6">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-[1.1] mb-4">
            Build Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Empire
            </span>
          </h1>
          <p className="text-lg text-gray-500 font-medium leading-relaxed">
            Your pocket co-founder. Master the skills, get AI mentorship, and access the tools you need to launch.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center space-x-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="bg-green-100 p-2 rounded-xl">
              <TargetIcon className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Actionable Lessons</h3>
              <p className="text-xs text-gray-500">From idea to IPO</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="bg-blue-100 p-2 rounded-xl">
              <UsersIcon className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">24/7 AI Mentor</h3>
              <p className="text-xs text-gray-500">Expert advice on demand</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="w-full bg-gray-900 hover:bg-black text-white text-lg font-bold py-5 rounded-[2rem] shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2 group"
        >
          <span>Start Your Journey</span>
          <ChevronLeftIcon className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <p className="text-center text-xs text-gray-400 mt-6 font-medium">
          Join 10,000+ Founders
        </p>
      </div>
    </div>
  );
};

export default LandingView;