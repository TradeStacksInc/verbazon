import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, MessageSquare, Mic, Volume2, Pause, Menu, BookOpen, Maximize, Minimize } from 'lucide-react';
import { mockBooks } from '../data/mockData';
import { Book, Message } from '../types';

const ReadBookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your interactive book. You can ask me anything about the story, characters, or themes.",
      isUser: false,
      timestamp: new Date().toISOString()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages] = useState(15); // Mock total pages
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const foundBook = mockBooks.find(b => b.id === id);
      if (foundBook) {
        setBook(foundBook);
      }
      setLoading(false);
    }, 800);
  }, [id]);

  useEffect(() => {
    // Scroll to bottom of chat when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim()) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      isUser: true,
      timestamp: new Date().toISOString(),
      isVoice: isVoiceMode
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const responseContent = getAIResponse(userInput);
      const newAIMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        isUser: false,
        timestamp: new Date().toISOString(),
        isVoice: true
      };
      
      setMessages(prev => [...prev, newAIMessage]);
    }, 1000);
  };

  const getAIResponse = (question: string): string => {
    // Simple mock responses based on user input
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('who') && lowerQuestion.includes('main character')) {
      return "The main character of this story is Alex Mercer, a former scientist who discovers a conspiracy within his company.";
    } else if (lowerQuestion.includes('what happens') || lowerQuestion.includes('ending')) {
      return "I don't want to spoil the story for you, but I can say that the journey Alex takes will change him forever, and the ending might not be what you expect.";
    } else if (lowerQuestion.includes('theme') || lowerQuestion.includes('meaning')) {
      return "One of the central themes of this book is the ethics of scientific advancement and how technology can both empower and corrupt. I wanted readers to consider the moral implications of progress at any cost.";
    } else if (lowerQuestion.includes('why') && lowerQuestion.includes('write')) {
      return "I wrote this book because I was fascinated by the intersection of technology and humanity. The questions of what makes us human in an increasingly digital world kept me up at night.";
    } else if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi')) {
      return "Hello! I'm happy to discuss any aspect of the book with you. What would you like to know?";
    } else {
      return "That's an interesting question. As the author, I tried to explore that concept throughout the narrative. The character's journey reflects my own thoughts on this matter, though I'd love to hear your interpretation as well.";
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const changePage = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && page > 1) {
      setPage(page - 1);
    } else if (direction === 'next' && page < totalPages) {
      setPage(page + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Book Not Found</h1>
          <p className="mb-6">The book you're looking for doesn't exist or has been removed.</p>
          <Link to="/browse" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg">
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Top Navigation */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to={`/book/${book.id}`} className="text-gray-300 hover:text-white">
              <X className="h-6 w-6" />
            </Link>
            <h1 className="text-lg font-medium hidden sm:block">{book.title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSidebar}
              className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button 
              onClick={toggleFullscreen}
              className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-grow overflow-hidden">
        {/* Reading Area */}
        <div className={`flex-grow flex flex-col ${showSidebar ? 'md:mr-80' : ''} transition-all duration-300`}>
          {/* Book Content */}
          <div className="flex-grow p-4 md:p-8 overflow-auto">
            <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6 md:p-10 min-h-[70vh] relative">
              <h2 className="text-2xl font-bold mb-6">Chapter {page}: The Beginning</h2>
              
              <div className="prose prose-invert max-w-none">
                <p className="mb-4">
                  The city loomed before Alex, a sprawling metropolis of glass and steel that seemed to scrape the very heavens. It had been five years since he'd last set foot here, five years since he'd fled in the dead of night with nothing but the clothes on his back and the weight of his conscience. 
                </p>
                
                <p className="mb-4">
                  Now he was back, drawn by a message that had arrived three days ago. A message that should have been impossible. A message from someone who was supposed to be dead.
                </p>
                
                <p className="mb-4">
                  "Dr. Mercer, your access card has been approved." The security guard slid a plastic badge across the counter, his expression carefully neutral. Did he know? Could he possibly recognize Alex after all this time?
                </p>
                
                <p className="mb-4">
                  "Thank you." Alex's voice was steady despite the rapid thumping of his heart. He took the badge, clipped it to his jacket, and proceeded through the scanner. For a moment, he expected alarms to blare, for armed security to descend upon him. But there was only silence and the gentle hum of the building's ventilation system.
                </p>
                
                <p className="mb-4">
                  The elevator was empty when he stepped inside. He pressed the button for the 47th floor—executive level. The doors slid closed with a soft pneumatic hiss, and Alex was alone with his reflection in the polished metal walls. He barely recognized himself. The years had not been kind. 
                </p>

                <p className="mb-4">
                  As the elevator climbed, so did his anxiety. What was waiting for him up there? Why had Sarah contacted him after all this time? And more importantly, how was she still alive when he had watched her lab explode with his own eyes?
                </p>
                
                <p className="mb-4">
                  The answers, he suspected, would only lead to more questions. And in this building, questions had always been dangerous.
                </p>
                
                <p className="mb-4">
                  The display above the door blinked: 45... 46... 47. A soft chime announced his arrival. The doors opened.
                </p>
                
                <p className="mb-4">
                  And there she was. 
                </p>
                
                <p className="mb-4">
                  "Hello, Alex," said Sarah. "It's been a long time."
                </p>
              </div>
              
              {/* Page navigation */}
              <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-700">
                <button 
                  onClick={() => changePage('prev')}
                  disabled={page === 1}
                  className={`flex items-center ${page === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300 hover:text-white'}`}
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Previous
                </button>
                <span className="text-gray-400 text-sm">Page {page} of {totalPages}</span>
                <button 
                  onClick={() => changePage('next')}
                  disabled={page === totalPages}
                  className={`flex items-center ${page === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300 hover:text-white'}`}
                >
                  Next
                  <ChevronRight className="h-5 w-5 ml-1" />
                </button>
              </div>
              
              {/* Audio controls (visible only when reading with audio) */}
              {isPlaying && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-700 rounded-full px-4 py-2 flex items-center space-x-3 shadow-lg">
                  <button 
                    onClick={togglePlayback}
                    className="text-white p-2 hover:bg-gray-600 rounded-full"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                  <div className="w-48 h-1 bg-gray-600 rounded-full">
                    <div className="h-full w-1/3 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-300">01:45 / 05:30</span>
                </div>
              )}
              
              {/* Chat toggle button (visible on mobile) */}
              <button
                onClick={() => setShowChat(true)}
                className="md:hidden fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-10"
              >
                <MessageSquare className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Chat Sidebar (fixed on desktop, slide-in on mobile) */}
        <div 
          className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-gray-800 border-l border-gray-700 z-20 transform transition-transform duration-300 ease-in-out 
                    ${showSidebar ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:w-0 md:opacity-0'} 
                    ${showChat ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}
          style={{ top: '4rem' }}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="font-medium">Chat with the Book</h2>
              <button 
                onClick={() => setShowChat(false)}
                className="md:hidden text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-grow p-4 overflow-y-auto space-y-4"
            >
              {messages.map(message => (
                <div 
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.isUser 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-700 text-white rounded-bl-none'
                    }`}
                  >
                    {message.isVoice && (
                      <div className="flex items-center mb-1 text-xs text-gray-300">
                        <Mic className="h-3 w-3 mr-1" />
                        {message.isUser ? 'Voice message' : 'Voice response'}
                      </div>
                    )}
                    <p>{message.content}</p>
                    <div className="text-right mt-1">
                      <span className="text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-gray-700">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <button
                  type="button"
                  onClick={toggleVoiceMode}
                  className={`p-2 rounded-full ${isVoiceMode ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  aria-label={isVoiceMode ? "Voice mode active" : "Activate voice mode"}
                >
                  <Mic className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={isVoiceMode ? "Speak to the book..." : "Type your question..."}
                  className="flex-grow bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                >
                  <MessageSquare className="h-5 w-5" />
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-2">
                Ask anything about the plot, characters, or themes. The book will respond in the author's voice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadBookPage;