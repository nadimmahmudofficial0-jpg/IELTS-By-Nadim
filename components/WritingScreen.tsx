import React, { useState } from 'react';
import { PenTool, RefreshCcw, Zap, CheckCircle, Sparkles } from 'lucide-react';
import { generateIeltsTopic, analyzeEssay } from '../services/geminiService';
import { EssayAnalysisResult } from '../types';

interface WritingScreenProps {
  onTaskComplete: () => void;
}

const WritingScreen: React.FC<WritingScreenProps> = ({ onTaskComplete }) => {
  const [essay, setEssay] = useState('');
  const [topic, setTopic] = useState("Technology in Education: Good or Bad?");
  const [isChecking, setIsChecking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<EssayAnalysisResult | null>(null);

  const handleGetTopic = async () => {
    setIsGenerating(true);
    try {
        const newTopic = await generateIeltsTopic();
        setTopic(newTopic);
    } catch (err) {
        alert("Failed to get topic. Check connection.");
    }
    setIsGenerating(false);
  };

  const handleCheck = async () => {
    if (essay.length < 50) {
      alert("Please write at least 50 characters for a valid check.");
      return;
    }

    setIsChecking(true);
    setResult(null);

    try {
        const data = await analyzeEssay(topic, essay);
        setResult(data);
        if (onTaskComplete) onTaskComplete();
    } catch (error) {
        console.error(error);
        alert("AI could not analyze the essay. Please try again.");
    }
    
    setIsChecking(false);
  };

  const reset = () => {
    setEssay('');
    setResult(null);
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <div className="bg-purple-100 p-2 rounded-lg">
            <PenTool className="text-purple-600" size={24} /> 
        </div>
        Writing Checker
      </h2>

      {!result ? (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-4 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-3 gap-2">
                <div className="flex-1">
                    <label className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded uppercase tracking-wide">Topic</label>
                    <p className="text-sm text-gray-800 font-bold mt-2 leading-snug">{topic}</p>
                </div>
                <button 
                    onClick={handleGetTopic}
                    disabled={isGenerating}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-purple-100 text-purple-600 transition-colors"
                    title="Get New Topic"
                >
                    <RefreshCcw size={18} className={isGenerating ? "animate-spin" : ""} />
                </button>
            </div>
            
            <textarea
              className="w-full flex-1 resize-none outline-none text-gray-700 leading-relaxed text-base placeholder-gray-300 p-2 bg-gray-50 rounded-xl"
              placeholder="Start typing your essay here..."
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
            ></textarea>
            <div className="text-right mt-2 text-xs text-gray-400 font-mono">{essay.length} chars</div>
          </div>

          <button
            onClick={handleCheck}
            disabled={isChecking}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg flex justify-center items-center gap-2 transition-all
              ${isChecking ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700 active:scale-[0.98]'}
            `}
          >
            {isChecking ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Zap size={20} fill="currentColor" /> Check with AI ✨
              </>
            )}
          </button>
        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="bg-purple-600 text-white p-8 rounded-3xl shadow-xl mb-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
            <p className="text-purple-100 text-sm font-medium mb-2 uppercase tracking-wider relative z-10">Predicted Score</p>
            <div className="text-6xl font-black mb-3 relative z-10">{result.band}</div>
            <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-full text-xs font-medium relative z-10">
              <Sparkles size={12} className="inline mr-1" /> Gemini Analysis
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-lg">
              <CheckCircle size={20} className="text-green-500" /> AI Feedback
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 border-l-4 border-gray-200 pl-4">
              {result.feedback}
            </p>
            
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                <h3 className="font-bold text-yellow-800 mb-1 text-xs uppercase tracking-wide">Quick Tip</h3>
                <p className="text-sm text-yellow-800 font-medium">
                {result.corrected}
                </p>
            </div>
          </div>

          <button 
            onClick={reset}
            className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCcw size={20} /> Write Another
          </button>
        </div>
      )}
    </div>
  );
};

export default WritingScreen;