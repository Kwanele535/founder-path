import React, { useState, useEffect } from 'react';
import { generateLesson } from '../../services/geminiService';
import { Lesson, UserState } from '../../types';
import Loader from '../Loader';
import { ChevronLeftIcon, CheckCircleIcon, SparklesIcon, ShareIcon, XIcon, CopyIcon } from '../Icons';

interface LearnViewProps {
  user: UserState;
  onCompleteLesson: (title: string, xp: number) => void;
}

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

const TOPICS: { title: string; difficulty: Difficulty }[] = [
  { title: "Validating Your Idea", difficulty: 'Beginner' },
  { title: "Writing a Mission Statement", difficulty: 'Beginner' },
  { title: "Finding a Co-Founder", difficulty: 'Beginner' },
  { title: "MVP Development Strategy", difficulty: 'Intermediate' },
  { title: "Go-to-Market Strategy", difficulty: 'Intermediate' },
  { title: "Understanding Venture Capital", difficulty: 'Advanced' },
  { title: "Hiring Your First Employee", difficulty: 'Intermediate' },
  { title: "Product-Market Fit", difficulty: 'Advanced' },
  { title: "Pitch Deck Essentials", difficulty: 'Intermediate' },
  { title: "Leadership Psychology", difficulty: 'Advanced' }
];

const LearnView: React.FC<LearnViewProps> = ({ user, onCompleteLesson }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  
  // Filter state - Multi-select
  const [selectedFilters, setSelectedFilters] = useState<Difficulty[]>([]);
  
  // Modal state
  const [completionData, setCompletionData] = useState<{ title: string; xp: number } | null>(null);

  // Copy state
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [currentSectionIndex]);

  const handleStartLesson = async (topic: string) => {
    setLoading(topic);
    try {
      const lesson = await generateLesson(topic);
      setActiveLesson(lesson);
      setCurrentSectionIndex(0);
      setQuizMode(false);
      setQuizAnswers([]);
    } catch (e) {
      alert("Failed to load lesson. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleNext = () => {
    if (!activeLesson) return;
    if (currentSectionIndex < activeLesson.sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    } else {
      setQuizMode(true);
    }
  };

  const handleQuizAnswer = (optionIndex: number) => {
    const newAnswers = [...quizAnswers, optionIndex];
    setQuizAnswers(newAnswers);
    
    if (activeLesson && newAnswers.length === activeLesson.quiz.length) {
        let correct = 0;
        activeLesson.quiz.forEach((q, idx) => {
            if (q.correctIndex === newAnswers[idx]) correct++;
        });
        
        const xp = 50 + (correct * 25);
        
        setTimeout(() => {
            onCompleteLesson(activeLesson.title, xp);
            setCompletionData({ title: activeLesson.title, xp });
            setActiveLesson(null);
        }, 500);
    }
  };

  const handleClose = () => {
    setActiveLesson(null);
  };

  const handleShare = async () => {
    if (!completionData) return;
    const shareText = `I just completed "${completionData.title}" on FounderPath and earned ${completionData.xp} XP!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FounderPath Achievement',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Achievement copied to clipboard!');
    }
  };

  const handleCopyContent = () => {
    if (!activeLesson) return;
    const content = activeLesson.sections[currentSectionIndex].content;
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy!', err);
    });
  };

  const toggleFilter = (difficulty: Difficulty) => {
    setSelectedFilters(prev => {
      if (prev.includes(difficulty)) {
        return prev.filter(f => f !== difficulty);
      } else {
        return [...prev, difficulty];
      }
    });
  };

  const filteredTopics = TOPICS.filter(t => 
    selectedFilters.length === 0 || selectedFilters.includes(t.difficulty)
  );

  if (activeLesson) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto pb-20">
        {/* Sticky Header with Progress */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-20">
            <div className="max-w-md mx-auto px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={handleClose} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
                        <ChevronLeftIcon className="w-6 h-6 text-gray-900" />
                    </button>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest truncate max-w-[200px]">
                        {quizMode ? 'Knowledge Check' : activeLesson.title}
                    </span>
                    <div className="w-8" />
                </div>
                
                {/* Visual Progress Bar - Segmented for Sections */}
                {!quizMode && (
                    <div className="flex space-x-1.5 w-full">
                        {activeLesson.sections.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                    idx <= currentSectionIndex ? 'bg-gray-900' : 'bg-gray-200'
                                }`} 
                            />
                        ))}
                    </div>
                )}

                {/* Visual Progress Bar - Continuous for Quiz */}
                {quizMode && (
                     <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                           className="bg-green-500 h-full transition-all duration-300 ease-out"
                           style={{ width: `${(quizAnswers.length / activeLesson.quiz.length) * 100}%` }}
                        ></div>
                     </div>
                )}
            </div>
        </div>

        <div className="max-w-md mx-auto px-6 py-8">
          {!quizMode && (
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {activeLesson.sections[currentSectionIndex].title}
              </h1>
              
              <div className="relative">
                <div className="prose prose-lg text-gray-600 leading-relaxed pr-8">
                  {activeLesson.sections[currentSectionIndex].content}
                </div>
                <button
                    onClick={handleCopyContent}
                    className="absolute top-0 right-0 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-200"
                    title="Copy section content"
                >
                    {copied ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
                </button>
              </div>

              <div className="pt-8">
                  <button 
                    onClick={handleNext}
                    className="w-full bg-gray-900 hover:bg-black text-white text-lg font-bold py-5 rounded-[2rem] shadow-xl transition-transform active:scale-95"
                  >
                    {currentSectionIndex < activeLesson.sections.length - 1 ? "Next Section" : "Take Quiz"}
                  </button>
              </div>
            </div>
          )}

          {quizMode && (
            <div className="space-y-8">
               {activeLesson.quiz.map((q, qIdx) => {
                   if (qIdx !== quizAnswers.length) return null;
                   return (
                       <div key={qIdx} className="space-y-6 animate-fade-in">
                           <p className="font-medium text-xl text-gray-800 leading-relaxed">{q.question}</p>
                           <div className="space-y-3">
                               {q.options.map((opt, oIdx) => (
                                   <button
                                     key={oIdx}
                                     onClick={() => handleQuizAnswer(oIdx)}
                                     className="w-full text-left p-6 rounded-[1.5rem] bg-gray-50 border-2 border-transparent hover:border-gray-900 hover:bg-white transition-all duration-200 font-medium text-gray-700"
                                   >
                                       {opt}
                                   </button>
                               ))}
                           </div>
                       </div>
                   )
               })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-32 max-w-md mx-auto relative pt-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Learning Tracks</h1>
      
      {/* Filter Chips - Multi-select */}
      <div className="flex space-x-2 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6">
        {(['Beginner', 'Intermediate', 'Advanced'] as const).map((difficulty) => {
            const isSelected = selectedFilters.includes(difficulty);
            return (
                <button
                    key={difficulty}
                    onClick={() => toggleFilter(difficulty)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 border ${
                    isSelected 
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105' 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    {difficulty}
                </button>
            );
        })}
      </div>

      {loading && (
          <div className="fixed inset-0 bg-white/95 z-50 flex items-center justify-center backdrop-blur-sm">
              <Loader text={`Preparing ${loading}...`} />
          </div>
      )}

      {/* Completion Modal */}
      {completionData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setCompletionData(null)} />
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl relative z-10 text-center space-y-6">
                <button 
                    onClick={() => setCompletionData(null)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <XIcon className="w-6 h-6" />
                </button>

                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
                        <CheckCircleIcon className="w-12 h-12 text-green-600" />
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson Complete!</h2>
                    <p className="text-gray-500 text-sm">You have successfully mastered</p>
                    <p className="text-gray-900 font-semibold mt-1">{completionData.title}</p>
                </div>

                <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                    <div className="flex items-center justify-center space-x-2 text-purple-900">
                        <SparklesIcon className="w-6 h-6" />
                        <span className="text-3xl font-bold">+{completionData.xp} XP</span>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <button 
                        onClick={handleShare}
                        className="w-full flex items-center justify-center space-x-2 bg-gray-900 hover:bg-black text-white py-4 rounded-full font-bold transition-all active:scale-95"
                    >
                        <ShareIcon className="w-5 h-5" />
                        <span>Share Achievement</span>
                    </button>
                    <button 
                        onClick={() => setCompletionData(null)}
                        className="w-full py-3 text-gray-500 font-semibold hover:text-gray-900 transition-colors"
                    >
                        Continue Learning
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic, index) => {
              const isCompleted = user.completedLessons.some(l => l.includes(topic.title));
              return (
                  <button
                      key={index}
                      onClick={() => handleStartLesson(topic.title)}
                      disabled={!!loading}
                      className={`w-full p-6 rounded-[2rem] text-left transition-all duration-300 group
                          ${isCompleted ? 'bg-[#F0FDF4]' : 'bg-white shadow-sm border border-gray-50 hover:shadow-md hover:-translate-y-1'}
                      `}
                  >
                      <div className="flex justify-between items-center">
                          <div className="flex-1 pr-4">
                              <h3 className={`font-bold text-lg mb-1 ${isCompleted ? 'text-green-900' : 'text-gray-900'}`}>
                                  {topic.title}
                              </h3>
                              <div className="flex items-center space-x-2">
                                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                      {isCompleted ? 'Done' : topic.difficulty}
                                  </span>
                              </div>
                          </div>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-200' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                              {isCompleted ? (
                                  <CheckCircleIcon className="w-5 h-5 text-green-700" />
                              ) : (
                                  <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-gray-900 transition-colors" />
                              )}
                          </div>
                      </div>
                  </button>
              )
          })
        ) : (
          <div className="text-center py-12 text-gray-400">
            No lessons found for the selected difficulty levels.
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnView;