import React from 'react';
import { SparklesIcon } from '../Icons';

const SplashView: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center animate-pulse">
        <div className="w-24 h-24 bg-gray-900 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl transform rotate-3">
          <SparklesIcon className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">FounderPath</h1>
      </div>
      
      <div className="absolute bottom-12 flex flex-col items-center space-y-4">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">From Idea to Exit</p>
      </div>
    </div>
  );
};

export default SplashView;