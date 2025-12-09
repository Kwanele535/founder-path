import React from 'react';
import { View } from '../types';
import { HomeIcon, BookIcon, MessageCircleIcon, BriefcaseIcon, LibraryIcon } from './Icons';

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: View.HOME, label: 'Home', icon: HomeIcon },
    { view: View.LEARN, label: 'Learn', icon: BookIcon },
    { view: View.BOOKS, label: 'Library', icon: LibraryIcon },
    { view: View.MENTOR, label: 'Mentor', icon: MessageCircleIcon },
    { view: View.TOOLS, label: 'Tools', icon: BriefcaseIcon },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 pb-safe pt-2 px-2 shadow-sm z-50">
      <div className="flex justify-between items-center max-w-md mx-auto h-20">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center justify-center flex-1 space-y-2 transition-all duration-300 ${
                isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-2 rounded-2xl ${isActive ? 'bg-purple-50' : 'bg-transparent'}`}>
                  <item.icon className={`w-5 h-5 ${isActive ? 'stroke-2' : 'stroke-[1.5]'}`} />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;