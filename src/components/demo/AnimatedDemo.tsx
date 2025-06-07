import React, { useState, useEffect } from 'react';
import { Play, Pause, Download, User, PenTool, BookOpen, MessageSquare, Mic, Upload, DollarSign, BarChart3 } from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
  type: 'user' | 'author';
}

const demoSteps: DemoStep[] = [
  // User Journey
  {
    id: 'user-browse',
    title: 'Browse Interactive Books',
    description: 'Users discover AI-powered books with voice capabilities',
    icon: <BookOpen className="h-6 w-6" />,
    duration: 3000,
    type: 'user'
  },
  {
    id: 'user-purchase',
    title: 'Purchase & Start Reading',
    description: 'Secure purchase and immediate access to interactive content',
    icon: <DollarSign className="h-6 w-6" />,
    duration: 2500,
    type: 'user'
  },
  {
    id: 'user-read',
    title: 'Interactive Reading',
    description: 'Read with AI assistance and real-time explanations',
    icon: <BookOpen className="h-6 w-6" />,
    duration: 3500,
    type: 'user'
  },
  {
    id: 'user-chat',
    title: 'Chat with the Book',
    description: 'Ask questions and get responses in the author\'s voice',
    icon: <MessageSquare className="h-6 w-6" />,
    duration: 4000,
    type: 'user'
  },
  // Author Journey
  {
    id: 'author-upload',
    title: 'Upload Book & Voice',
    description: 'Authors upload their book, cover, and voice sample',
    icon: <Upload className="h-6 w-6" />,
    duration: 3000,
    type: 'author'
  },
  {
    id: 'author-process',
    title: 'AI Processing',
    description: 'AI analyzes content and creates voice model',
    icon: <Mic className="h-6 w-6" />,
    duration: 2500,
    type: 'author'
  },
  {
    id: 'author-publish',
    title: 'Publish & Earn',
    description: 'Book goes live and authors start earning from sales',
    icon: <BarChart3 className="h-6 w-6" />,
    duration: 3000,
    type: 'author'
  }
];

const AnimatedDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedJourney, setSelectedJourney] = useState<'user' | 'author' | 'both'>('both');

  const filteredSteps = selectedJourney === 'both' 
    ? demoSteps 
    : demoSteps.filter(step => step.type === selectedJourney);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentStep < filteredSteps.length) {
      const currentStepData = filteredSteps[currentStep];
      const stepDuration = currentStepData.duration;
      
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (stepDuration / 100));
          
          if (newProgress >= 100) {
            setCurrentStep(prevStep => {
              const nextStep = prevStep + 1;
              if (nextStep >= filteredSteps.length) {
                setIsPlaying(false);
                return 0;
              }
              return nextStep;
            });
            return 0;
          }
          
          return newProgress;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentStep, filteredSteps]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
  };

  const handleDownload = () => {
    // Create a simple video-like experience by capturing the animation
    // In a real implementation, this would generate an actual MP4
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      canvas.width = 1920;
      canvas.height = 1080;
      
      // Create a simple frame
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Verbazon Platform Demo', canvas.width / 2, 100);
      
      ctx.font = '24px Arial';
      ctx.fillText('Interactive AI Books Platform', canvas.width / 2, 150);
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'verbazon-demo.mp4';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  const currentStepData = filteredSteps[currentStep];

  return (
    <div className="bg-gray-800 rounded-lg p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">See How Verbazon Works</h2>
        <p className="text-gray-300 mb-6">
          Experience the future of interactive reading through our platform demo
        </p>
        
        {/* Journey Selection */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-700 rounded-lg p-1 flex">
            <button
              onClick={() => setSelectedJourney('both')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedJourney === 'both' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Full Journey
            </button>
            <button
              onClick={() => setSelectedJourney('user')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedJourney === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <User className="h-4 w-4 mr-2 inline" />
              Reader Journey
            </button>
            <button
              onClick={() => setSelectedJourney('author')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedJourney === 'author' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <PenTool className="h-4 w-4 mr-2 inline" />
              Author Journey
            </button>
          </div>
        </div>
      </div>

      {/* Demo Visualization */}
      <div className="relative">
        {/* Progress Timeline */}
        <div className="flex justify-between items-center mb-8">
          {filteredSteps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex flex-col items-center relative ${
                index <= currentStep ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${
                index === currentStep 
                  ? step.type === 'user' 
                    ? 'bg-blue-600 text-white scale-110' 
                    : 'bg-purple-600 text-white scale-110'
                  : index < currentStep 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
              }`}>
                {step.icon}
              </div>
              <span className={`text-xs text-center max-w-20 ${
                index === currentStep ? 'text-white font-medium' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
              
              {/* Progress line */}
              {index < filteredSteps.length - 1 && (
                <div className="absolute top-6 left-12 w-full h-0.5 bg-gray-600">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      index < currentStep ? 'bg-green-500 w-full' : 
                      index === currentStep ? 'bg-blue-500' : 'bg-gray-600 w-0'
                    }`}
                    style={{
                      width: index === currentStep ? `${progress}%` : 
                             index < currentStep ? '100%' : '0%'
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current Step Display */}
        {currentStepData && (
          <div className="bg-gray-700 rounded-lg p-6 mb-6 text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              currentStepData.type === 'user' ? 'bg-blue-600' : 'bg-purple-600'
            }`}>
              {currentStepData.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{currentStepData.title}</h3>
            <p className="text-gray-300">{currentStepData.description}</p>
            
            {/* Step-specific animations */}
            <div className="mt-6">
              {currentStepData.id === 'user-browse' && (
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-gray-600 rounded-lg p-3 animate-pulse">
                      <div className="aspect-[2/3] bg-gray-500 rounded mb-2"></div>
                      <div className="h-2 bg-gray-500 rounded mb-1"></div>
                      <div className="h-2 bg-gray-500 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              )}
              
              {currentStepData.id === 'user-chat' && (
                <div className="max-w-md mx-auto">
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <div className="bg-blue-600 rounded-lg p-3 max-w-xs">
                        <p className="text-sm">What inspired this story?</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-600 rounded-lg p-3 max-w-xs">
                        <div className="flex items-center mb-1">
                          <Mic className="h-3 w-3 mr-1" />
                          <span className="text-xs">Voice response</span>
                        </div>
                        <p className="text-sm">The story came from my fascination with...</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {currentStepData.id === 'author-upload' && (
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="bg-gray-600 rounded-lg p-4 text-center">
                    <BookOpen className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-xs">Book PDF</span>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-4 text-center">
                    <div className="w-8 h-8 bg-gray-500 rounded mx-auto mb-2"></div>
                    <span className="text-xs">Cover Image</span>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-4 text-center">
                    <Mic className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-xs">Voice Sample</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={handlePlayPause}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
          
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reset
          </button>
          
          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Demo
          </button>
        </div>

        {/* Journey Legend */}
        <div className="flex justify-center mt-6 space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-300">Reader Journey</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-300">Author Journey</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedDemo;