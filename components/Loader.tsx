import React from 'react';

const Loader: React.FC<{ text?: string }> = ({ text = "Thinking..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-gray-500 animate-pulse">{text}</p>
    </div>
  );
};

export default Loader;