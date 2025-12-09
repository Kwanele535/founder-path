import React, { useState, useRef, useEffect } from 'react';
import { createMentorChat } from '../../services/geminiService';
import { ChatMessage, UserState } from '../../types';
import { SendIcon, SparklesIcon, UserIcon, CameraIcon, HistoryIcon } from '../Icons';
import { GenerateContentResponse, Chat } from "@google/genai";

interface MentorViewProps {
  user: UserState;
  onUpdateUser: (updates: Partial<UserState>) => void;
}

const MentorView: React.FC<MentorViewProps> = ({ user, onUpdateUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello. I'm your AI Mentor. What can I help you with today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const chatSessionRef = useRef<Chat | null>(null);

  useEffect(() => {
    if (!chatSessionRef.current) {
      chatSessionRef.current = createMentorChat();
    }
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const resultStream = await chatSessionRef.current.sendMessageStream({ message: userMsg.text });
      
      let fullText = "";
      const modelMsgId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, {
          id: modelMsgId,
          role: 'model',
          text: '',
          timestamp: Date.now()
      }]);

      for await (const chunk of resultStream) {
          const c = chunk as GenerateContentResponse;
          const text = c.text || "";
          fullText += text;
          
          setMessages(prev => prev.map(m => 
              m.id === modelMsgId ? { ...m, text: fullText } : m
          ));
      }
    } catch (error) {
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'model',
          text: "I'm having trouble connecting right now. Try again in a moment.",
          timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFlashback = async () => {
    if (!chatSessionRef.current) return;
    
    // Create a user message that acts as the trigger command in the chat
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: "Show me an AI Flashback from business history.",
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
        const prompt = "Share a short, compelling 'Flashback' story from startup history (e.g., Apple, Airbnb, Slack, Nintendo) that teaches a valuable lesson for a founder today. Keep it under 100 words and make it impactful.";
        const resultStream = await chatSessionRef.current.sendMessageStream({ message: prompt });
        
        let fullText = "";
        const modelMsgId = (Date.now() + 1).toString();
        
        setMessages(prev => [...prev, {
            id: modelMsgId,
            role: 'model',
            text: '',
            timestamp: Date.now()
        }]);

        for await (const chunk of resultStream) {
            const c = chunk as GenerateContentResponse;
            const text = c.text || "";
            fullText += text;
            
            setMessages(prev => prev.map(m => 
                m.id === modelMsgId ? { ...m, text: fullText } : m
            ));
        }
    } catch (error) {
        // Silent fail or minimal error
    } finally {
        setIsTyping(false);
    }
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Limit file size to 2MB to prevent localStorage quota issues
      if (file.size > 2 * 1024 * 1024) {
          alert("Image size must be less than 2MB.");
          return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onUpdateUser({ profilePicture: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-screen bg-white pb-24">
      <div className="bg-white/80 backdrop-blur-md sticky top-0 border-b border-gray-50 p-4 sm:p-6 z-10">
        <div className="flex items-center justify-between max-w-md mx-auto">
            {/* Left: Mentor Info */}
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 shadow-sm">
                    <SparklesIcon className="w-6 h-6 text-purple-900" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Mentor AI</h1>
                    <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> Online
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                 {/* Flashback Button */}
                <button
                    onClick={handleFlashback}
                    disabled={isTyping}
                    className="p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors disabled:opacity-50"
                    title="Get an AI Flashback"
                >
                    <HistoryIcon className="w-5 h-5" />
                </button>

                {/* Right: User Profile Picture Upload */}
                <div className="relative group">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleProfilePictureUpload}
                    />
                    <button 
                        onClick={triggerFileUpload}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 transition-all hover:ring-2 hover:ring-purple-200"
                        title="Upload Profile Picture"
                    >
                        {user.profilePicture ? (
                            <img 
                                src={user.profilePicture} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <UserIcon className="w-5 h-5 text-gray-400" />
                        )}
                    </button>
                    <div 
                        onClick={triggerFileUpload}
                        className="absolute -bottom-1 -right-1 bg-gray-900 text-white p-1 rounded-full cursor-pointer shadow-md border border-white"
                    >
                        <CameraIcon className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-md mx-auto w-full no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-3xl px-6 py-4 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gray-900 text-white rounded-tr-sm'
                  : 'bg-gray-50 text-gray-800 rounded-tl-sm border border-gray-100'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
               <div className="bg-gray-50 border border-gray-100 rounded-3xl rounded-tl-sm px-6 py-4">
                   <div className="flex space-x-1.5">
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                   </div>
               </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white/80 backdrop-blur-md p-4 fixed bottom-[80px] sm:bottom-0 left-0 right-0 w-full z-20">
         <div className="max-w-md mx-auto flex items-center gap-2 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask for advice..."
                className="flex-1 bg-transparent border-0 text-gray-900 text-sm focus:ring-0 px-4 py-2 outline-none placeholder-gray-400"
            />
            <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white rounded-full p-3 transition-all"
            >
                <SendIcon className="w-5 h-5" />
            </button>
         </div>
      </div>
    </div>
  );
};

export default MentorView;