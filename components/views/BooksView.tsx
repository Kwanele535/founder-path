import React, { useState } from 'react';
import { generateBookSummary } from '../../services/geminiService';
import { Book } from '../../types';
import Loader from '../Loader';
import { XIcon } from '../Icons';

const BOOKS: Book[] = [
  { id: '1', title: 'Zero to One', author: 'Peter Thiel', color: 'bg-gradient-to-br from-blue-600 to-cyan-500' },
  { id: '2', title: 'The Lean Startup', author: 'Eric Ries', color: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
  { id: '3', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', color: 'bg-gradient-to-br from-amber-600 to-orange-500' },
  { id: '4', title: 'Atomic Habits', author: 'James Clear', color: 'bg-gradient-to-br from-yellow-500 to-amber-600' },
  { id: '5', title: 'Hard Thing About Hard Things', author: 'Ben Horowitz', color: 'bg-gradient-to-br from-gray-800 to-gray-900' },
  { id: '6', title: 'Shoe Dog', author: 'Phil Knight', color: 'bg-gradient-to-br from-red-600 to-orange-600' },
  { id: '7', title: 'Start with Why', author: 'Simon Sinek', color: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
  { id: '8', title: 'Good to Great', author: 'Jim Collins', color: 'bg-gradient-to-br from-red-500 to-rose-600' },
];

const BooksView: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [readingContent, setReadingContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBookClick = async (book: Book) => {
    setSelectedBook(book);
    setLoading(true);
    setReadingContent(null);
    
    // Simulate a slight delay before calling AI to make the UI transition feel intentional
    try {
        const summary = await generateBookSummary(book.title, book.author);
        setReadingContent(summary);
    } catch (e) {
        setReadingContent("Sorry, we couldn't retrieve this book summary right now.");
    } finally {
        setLoading(false);
    }
  };

  const closeReader = () => {
    setSelectedBook(null);
    setReadingContent(null);
  };

  if (selectedBook) {
      return (
          <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade-in">
              {/* Reader Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
                  <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Now Reading</span>
                      <span className="font-serif font-bold text-gray-900 text-lg leading-none mt-1">{selectedBook.title}</span>
                  </div>
                  <button 
                    onClick={closeReader}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                      <XIcon className="w-6 h-6 text-gray-500" />
                  </button>
              </div>

              {/* Reader Content */}
              <div className="flex-1 overflow-y-auto bg-[#FDFBF7] p-6 pb-32">
                  <div className="max-w-2xl mx-auto">
                    {loading ? (
                        <div className="h-[60vh] flex flex-col items-center justify-center">
                            <Loader text="Synthesizing wisdom..." />
                        </div>
                    ) : (
                        <div className="prose prose-lg prose-slate prose-headings:font-serif prose-p:font-serif prose-p:text-gray-800 prose-headings:text-gray-900 leading-loose">
                            {/* Generated Markdown Content */}
                            <div className="whitespace-pre-line">
                                {readingContent}
                            </div>
                            
                            <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                                <p className="text-gray-400 italic font-serif">End of Summary</p>
                                <button 
                                    onClick={closeReader}
                                    className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-full font-sans text-sm font-bold"
                                >
                                    Close Book
                                </button>
                            </div>
                        </div>
                    )}
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="p-6 pb-32 max-w-md mx-auto pt-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Founder Library</h1>
      <p className="text-gray-500 mb-8">Curated classics synthesized for speed.</p>

      <div className="grid grid-cols-2 gap-4">
        {BOOKS.map(book => (
            <button
                key={book.id}
                onClick={() => handleBookClick(book)}
                className="group relative flex flex-col text-left"
            >
                {/* Book Cover */}
                <div className={`aspect-[2/3] rounded-xl shadow-md ${book.color} p-4 flex flex-col justify-between mb-3 transition-transform group-hover:scale-[1.02] group-hover:shadow-xl`}>
                    <div className="w-full h-full border border-white/20 rounded-lg p-2 flex flex-col">
                        <h3 className="text-white font-serif font-bold text-xl leading-tight line-clamp-3">
                            {book.title}
                        </h3>
                        <div className="mt-auto">
                            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">{book.author}</p>
                        </div>
                    </div>
                </div>
                
                {/* Helper Text (Optional) */}
                <span className="text-xs font-semibold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 left-0">
                    Tap to read
                </span>
            </button>
        ))}
      </div>
    </div>
  );
};

export default BooksView;