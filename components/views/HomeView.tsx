import React, { useEffect, useState } from 'react';
import { UserState } from '../../types';
import { getDailyTip } from '../../services/geminiService';
import { SparklesIcon, CheckCircleIcon, UserIcon } from '../Icons';

interface HomeViewProps {
  user: UserState;
}

const HomeView: React.FC<HomeViewProps> = ({ user }) => {
  const [tip, setTip] = useState<string>("");

  useEffect(() => {
    getDailyTip().then(setTip);
  }, []);

  return (
    <div className="p-6 space-y-8 pb-32 max-w-md mx-auto pt-10">
      <header className="flex justify-between items-center">
        <div>
            <p className="text-gray-500 font-medium mb-1">Welcome back,</p>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{user.name}</h1>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
            {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <UserIcon className="w-6 h-6 text-gray-400" />
            )}
        </div>
      </header>

      {/* Daily Tip Card - Matches the 'Exotic Bali' card style with soft pastel background */}
      <div className="bg-[#F3E8FF] rounded-[2rem] p-8 relative overflow-hidden transition-transform hover:scale-[1.02] duration-300">
        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
             <SparklesIcon className="w-32 h-32 text-purple-900" />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-purple-900 uppercase tracking-wide mb-4">
            <SparklesIcon className="w-3 h-3" />
            <span>Daily Wisdom</span>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 leading-relaxed mb-4">
            {tip || "Gathering insights for your journey..."}
          </h2>
          
          <button className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-black transition-colors">
            Read more
          </button>
        </div>
      </div>

      {/* Stats - Clean white cards with soft shadows */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex flex-col justify-between h-32">
          <div className="text-4xl font-bold text-gray-900">{user.xp}</div>
          <div className="text-sm text-gray-400 font-medium">Total XP</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex flex-col justify-between h-32">
          <div className="text-4xl font-bold text-gray-900">{user.completedLessons.length}</div>
          <div className="text-sm text-gray-400 font-medium">Lessons Done</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 px-2">Your Journey</h3>
        <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-gray-50">
            {user.completedLessons.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                    Start your first lesson today.
                </div>
            ) : (
                <div className="space-y-2">
                    {user.completedLessons.slice(-3).map((lesson, i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-3xl transition-colors">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-gray-700 font-medium text-sm truncate">{lesson}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default HomeView;