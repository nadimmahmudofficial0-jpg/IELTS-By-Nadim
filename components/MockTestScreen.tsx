import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, CheckCircle, AlertCircle, Clock, BookOpen, Headphones, PenTool, Play, Pause, RotateCcw, Sparkles, Mic, Volume2, StopCircle } from 'lucide-react';
import { generateMockReadingTest, generateMockListeningTest, generateIeltsTopic, analyzeEssay, generateMockSpeakingTest, evaluateSpeakingPerformance } from '../services/geminiService';
import { MockQuestion, MockReadingTest, MockListeningTest, EssayAnalysisResult, MockSpeakingTest, SpeakingFeedback } from '../types';

interface MockTestScreenProps {
  onComplete: () => void;
  goBack: () => void;
}

type TestMode = 'reading' | 'listening' | 'writing' | 'speaking';
type SpeakingState = 'idle' | 'examiner_speaking' | 'user_listening' | 'user_recording' | 'processing';

// Speech Recognition Polyfill for TS
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const MockTestScreen: React.FC<MockTestScreenProps> = ({ onComplete, goBack }) => {
  const [mode, setMode] = useState<TestMode>('reading');
  const [loading, setLoading] = useState(false);
  
  // Reading State
  const [readingData, setReadingData] = useState<MockReadingTest | null>(null);
  
  // Listening State
  const [listeningData, setListeningData] = useState<MockListeningTest | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Writing State
  const [writingTopic, setWritingTopic] = useState('');
  const [essay, setEssay] = useState('');
  const [writingResult, setWritingResult] = useState<EssayAnalysisResult | null>(null);

  // Speaking State
  const [speakingData, setSpeakingData] = useState<MockSpeakingTest | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [speakingState, setSpeakingState] = useState<SpeakingState>('idle');
  const [transcript, setTranscript] = useState<{question: string, answer: string}[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [speakingResult, setSpeakingResult] = useState<SpeakingFeedback | null>(null);
  const recognitionRef = useRef<any>(null);

  // Shared State
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // --- Helper: Text to Speech ---
  const speakText = (text: string, onEnd?: () => void) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';
    
    // Attempt to pick a natural sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha"));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => {
        if (onEnd) onEnd();
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // --- Helper: Speech to Text ---
  useEffect(() => {
    if (mode === 'speaking') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        setCurrentAnswer(prev => prev + event.results[i][0].transcript + ' ');
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
            };

            recognition.onerror = (event: any) => {
                console.error("Speech Error", event.error);
                setSpeakingState('idle');
            };

            recognitionRef.current = recognition;
        }
    }
  }, [mode]);

  // --- Actions ---

  const startReadingTest = async () => {
    setLoading(true);
    setReadingData(null);
    setSubmitted(false);
    setAnswers([]);
    try {
      const data = await generateMockReadingTest();
      setReadingData(data);
      setAnswers(new Array(data.questions.length).fill(-1));
    } catch (e) {
      alert("Failed to generate test. Please try again.");
    }
    setLoading(false);
  };

  const startListeningTest = async () => {
    setLoading(true);
    setListeningData(null);
    setSubmitted(false);
    setAnswers([]);
    try {
      const data = await generateMockListeningTest();
      setListeningData(data);
      setAnswers(new Array(data.questions.length).fill(-1));
    } catch (e) {
      alert("Failed to generate test. Please try again.");
    }
    setLoading(false);
  };

  const startWritingTest = async () => {
    setLoading(true);
    setWritingTopic('');
    setEssay('');
    setWritingResult(null);
    try {
      const topic = await generateIeltsTopic();
      setWritingTopic(topic);
    } catch (e) {
      alert("Failed to generate topic.");
    }
    setLoading(false);
  };

  const startSpeakingTest = async () => {
    setLoading(true);
    setSpeakingData(null);
    setSpeakingResult(null);
    setTranscript([]);
    setCurrentQuestionIdx(0);
    setSpeakingState('idle');
    try {
        const data = await generateMockSpeakingTest();
        setSpeakingData(data);
    } catch (e) {
        alert("Failed to start speaking test.");
    }
    setLoading(false);
  };

  // Speaking Flow
  const startSpeakingSession = () => {
      if (!speakingData) return;
      playQuestion(0);
  };

  const playQuestion = (idx: number) => {
      if (!speakingData) return;
      setSpeakingState('examiner_speaking');
      setCurrentAnswer('');
      speakText(speakingData.questions[idx], () => {
          setSpeakingState('user_listening');
          // Automatically start recording after question? 
          // Better to let user click "Start Answering" to avoid cutting them off
      });
  };

  const startRecording = () => {
      if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
            setSpeakingState('user_recording');
          } catch(e) {
              console.error("Mic error", e);
              alert("Microphone access denied or error. Please check settings.");
          }
      } else {
          alert("Speech recognition not supported in this browser. Please use Chrome.");
      }
  };

  const stopRecording = () => {
      if (recognitionRef.current) {
          recognitionRef.current.stop();
          setSpeakingState('idle');
          // Save Answer
          if (speakingData) {
            const newEntry = { 
                question: speakingData.questions[currentQuestionIdx], 
                answer: currentAnswer.trim() || "(No answer recorded)" 
            };
            const newTranscript = [...transcript, newEntry];
            setTranscript(newTranscript);

            // Move to next
            if (currentQuestionIdx < speakingData.questions.length - 1) {
                setTimeout(() => {
                    setCurrentQuestionIdx(prev => prev + 1);
                    playQuestion(currentQuestionIdx + 1);
                }, 1000);
            } else {
                // Finish
                finishSpeakingTest(newTranscript);
            }
          }
      }
  };

  const finishSpeakingTest = async (finalTranscript: {question: string, answer: string}[]) => {
      setSpeakingState('processing');
      try {
        const result = await evaluateSpeakingPerformance(finalTranscript);
        setSpeakingResult(result);
        if (onComplete) onComplete();
      } catch (e) {
          alert("Evaluation failed.");
      }
      setSpeakingState('idle');
  };

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const submitMCQ = (questions: MockQuestion[]) => {
    if (answers.includes(-1)) {
      if(!confirm("You have unanswered questions. Submit anyway?")) return;
    }
    
    let currentScore = 0;
    answers.forEach((ans, idx) => {
      if (ans === questions[idx].correctIndex) {
        currentScore += 1;
      }
    });
    setScore(currentScore);
    setSubmitted(true);
    if (onComplete) onComplete();
  };

  const submitWriting = async () => {
    if (essay.length < 50) {
        alert("Write at least 50 characters.");
        return;
    }
    setLoading(true);
    try {
        const result = await analyzeEssay(writingTopic, essay);
        setWritingResult(result);
        if (onComplete) onComplete();
    } catch (e) {
        alert("Analysis failed.");
    }
    setLoading(false);
  };

  // --- Audio Logic for Listening ---
  const toggleAudio = () => {
    if (!listeningData) return;
    
    if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    } else {
        const utterance = new SpeechSynthesisUtterance(listeningData.script);
        utterance.rate = 0.9; 
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
    }
  };

  // --- Renderers ---

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-10 shadow-sm">
        <button 
          onClick={() => { window.speechSynthesis.cancel(); goBack(); }} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">AI Mock Test</h2>
            <p className="text-xs text-gray-500">Auto-generated & Unique</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-2 gap-2 bg-gray-50 border-b border-gray-100 overflow-x-auto no-scrollbar">
        <button 
            onClick={() => { setMode('reading'); setReadingData(null); }}
            className={`flex-1 min-w-[80px] py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'reading' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-100' : 'text-gray-400'}`}
        >
            <BookOpen size={16} /> Reading
        </button>
        <button 
            onClick={() => { setMode('listening'); setListeningData(null); setIsPlaying(false); window.speechSynthesis.cancel(); }}
            className={`flex-1 min-w-[80px] py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'listening' ? 'bg-white text-red-600 shadow-sm ring-1 ring-gray-100' : 'text-gray-400'}`}
        >
            <Headphones size={16} /> Listening
        </button>
        <button 
            onClick={() => { setMode('speaking'); setSpeakingData(null); window.speechSynthesis.cancel(); }}
            className={`flex-1 min-w-[80px] py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'speaking' ? 'bg-white text-orange-600 shadow-sm ring-1 ring-gray-100' : 'text-gray-400'}`}
        >
            <Mic size={16} /> Speaking
        </button>
        <button 
            onClick={() => { setMode('writing'); setWritingTopic(''); }}
            className={`flex-1 min-w-[80px] py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'writing' ? 'bg-white text-purple-600 shadow-sm ring-1 ring-gray-100' : 'text-gray-400'}`}
        >
            <PenTool size={16} /> Writing
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        
        {/* READING MODE */}
        {mode === 'reading' && (
            <>
                {!readingData ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 pt-10">
                        <div className="bg-blue-100 p-6 rounded-full">
                            <BookOpen size={48} className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Reading Section</h3>
                            <p className="text-gray-500 max-w-xs mx-auto mt-2">Generate a unique academic passage with 10 questions.</p>
                        </div>
                        <button 
                            onClick={startReadingTest} 
                            disabled={loading}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center gap-2"
                        >
                            {loading ? 'Generating...' : <><Sparkles size={18} /> Generate New Test</>}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                             <div className="flex items-center justify-between mb-3">
                                <span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded">PASSAGE</span>
                                <h3 className="font-bold text-gray-900">{readingData.title}</h3>
                             </div>
                             <p className="text-gray-700 leading-relaxed text-sm font-serif whitespace-pre-line text-justify">
                                {readingData.passage}
                             </p>
                        </div>
                        
                        <div className="space-y-4">
                            {readingData.questions.map((q, qIdx) => (
                                <MCQBlock 
                                    key={q.id} 
                                    question={q} 
                                    index={qIdx} 
                                    selectedOption={answers[qIdx]} 
                                    submitted={submitted} 
                                    onSelect={(oIdx) => handleSelectAnswer(qIdx, oIdx)} 
                                />
                            ))}
                        </div>
                    </div>
                )}
            </>
        )}

        {/* LISTENING MODE */}
        {mode === 'listening' && (
             <>
             {!listeningData ? (
                 <div className="flex flex-col items-center justify-center h-full text-center space-y-4 pt-10">
                     <div className="bg-red-100 p-6 rounded-full">
                         <Headphones size={48} className="text-red-600" />
                     </div>
                     <div>
                         <h3 className="text-xl font-bold text-gray-900">Listening Section</h3>
                         <p className="text-gray-500 max-w-xs mx-auto mt-2">AI generates a script and reads it to you. Listen & Answer.</p>
                     </div>
                     <button 
                         onClick={startListeningTest} 
                         disabled={loading}
                         className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-transform flex items-center gap-2"
                     >
                         {loading ? 'Generating...' : <><Sparkles size={18} /> Generate New Test</>}
                     </button>
                 </div>
             ) : (
                 <div className="space-y-6">
                     <div className="sticky top-0 z-10 bg-white shadow-lg p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-gray-900">Audio Player</h3>
                            <p className="text-xs text-gray-500">{listeningData.scenario}</p>
                        </div>
                        <button 
                            onClick={toggleAudio}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isPlaying ? 'bg-red-100 text-red-600' : 'bg-gray-900 text-white'}`}
                        >
                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                     </div>
                     
                     <div className="space-y-4">
                         {listeningData.questions.map((q, qIdx) => (
                             <MCQBlock 
                                 key={q.id} 
                                 question={q} 
                                 index={qIdx} 
                                 selectedOption={answers[qIdx]} 
                                 submitted={submitted} 
                                 onSelect={(oIdx) => handleSelectAnswer(qIdx, oIdx)} 
                             />
                         ))}
                     </div>
                 </div>
             )}
         </>
        )}

        {/* SPEAKING MODE */}
        {mode === 'speaking' && (
            <>
                {!speakingData ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 pt-10">
                        <div className="bg-orange-100 p-6 rounded-full">
                            <Mic size={48} className="text-orange-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Speaking Mock</h3>
                            <p className="text-gray-500 max-w-xs mx-auto mt-2">Simulate a real interview. The AI Examiner will ask questions, and you respond by speaking.</p>
                        </div>
                        <button 
                            onClick={startSpeakingTest} 
                            disabled={loading}
                            className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 active:scale-95 transition-transform flex items-center gap-2"
                        >
                            {loading ? 'Initializing...' : <><Play size={18} /> Start Session</>}
                        </button>
                        <p className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded">Chrome/Edge Required for Microphone</p>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center">
                        {!speakingResult ? (
                            <>
                                {speakingState === 'idle' && currentQuestionIdx === 0 && (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                                        <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center border-4 border-white shadow-lg">
                                            <UserIcon size={40} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Examiner is Ready</h3>
                                        <p className="text-gray-500 mb-8 max-w-xs">There are {speakingData.questions.length} questions. Please speak clearly.</p>
                                        <button 
                                            onClick={startSpeakingSession}
                                            className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform"
                                        >
                                            Begin Interview
                                        </button>
                                    </div>
                                )}

                                {(speakingState !== 'idle' || currentQuestionIdx > 0) && (
                                    <div className="w-full flex-1 flex flex-col items-center pt-8 px-4">
                                        {/* Examiner Avatar */}
                                        <div className={`relative w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-xl transition-all duration-500 ${speakingState === 'examiner_speaking' ? 'border-orange-500 scale-110' : 'border-gray-200'}`}>
                                            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Examiner" alt="Examiner" className="w-full h-full" />
                                            </div>
                                            {speakingState === 'examiner_speaking' && (
                                                <div className="absolute -right-2 -top-2 bg-orange-500 text-white p-2 rounded-full animate-bounce">
                                                    <Volume2 size={16} />
                                                </div>
                                            )}
                                        </div>

                                        <h4 className="mt-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Question {currentQuestionIdx + 1}</h4>
                                        <p className="mt-2 text-xl font-bold text-gray-900 text-center leading-relaxed">
                                            "{speakingData.questions[currentQuestionIdx]}"
                                        </p>

                                        {/* Live Transcription */}
                                        <div className="mt-8 w-full max-w-md bg-gray-50 rounded-2xl p-6 min-h-[120px] border border-gray-100 relative">
                                            <span className="absolute top-3 left-4 text-xs font-bold text-gray-400 uppercase">Your Answer</span>
                                            <p className="mt-4 text-gray-700 font-medium">
                                                {currentAnswer || <span className="text-gray-300 italic">Listening...</span>}
                                            </p>
                                        </div>

                                        <div className="mt-auto mb-8 w-full max-w-xs">
                                            {speakingState === 'user_listening' && (
                                                <button 
                                                    onClick={startRecording}
                                                    className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                                                >
                                                    <Mic size={20} /> Tap to Answer
                                                </button>
                                            )}
                                            {speakingState === 'user_recording' && (
                                                <button 
                                                    onClick={stopRecording}
                                                    className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-200 flex items-center justify-center gap-2 animate-pulse"
                                                >
                                                    <StopCircle size={20} /> Stop & Submit
                                                </button>
                                            )}
                                             {speakingState === 'processing' && (
                                                 <div className="text-center text-gray-500 font-medium animate-pulse">
                                                     Analyzing your response...
                                                 </div>
                                             )}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="space-y-4 w-full animate-in fade-in slide-in-from-bottom-10">
                                <div className="bg-orange-600 text-white p-6 rounded-2xl text-center shadow-xl">
                                    <p className="text-orange-200 text-xs font-bold uppercase">Estimated Speaking Score</p>
                                    <div className="text-6xl font-black my-2">{speakingResult.band}</div>
                                    <div className="flex justify-center gap-2">
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">Fluency: {speakingResult.fluency}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                                            <BookOpen size={16} className="text-blue-500"/> Vocabulary
                                        </h4>
                                        <p className="text-sm text-gray-600">{speakingResult.vocabulary}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                                            <PenTool size={16} className="text-purple-500"/> Grammar
                                        </h4>
                                        <p className="text-sm text-gray-600">{speakingResult.grammar}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                                            <Volume2 size={16} className="text-green-500"/> Pronunciation Tip
                                        </h4>
                                        <p className="text-sm text-gray-600">{speakingResult.pronunciation}</p>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={startSpeakingTest}
                                    className="w-full py-4 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Start New Interview
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </>
        )}


        {/* WRITING MODE */}
        {mode === 'writing' && (
            <>
                {!writingTopic ? (
                     <div className="flex flex-col items-center justify-center h-full text-center space-y-4 pt-10">
                     <div className="bg-purple-100 p-6 rounded-full">
                         <PenTool size={48} className="text-purple-600" />
                     </div>
                     <div>
                         <h3 className="text-xl font-bold text-gray-900">Writing Task 2</h3>
                         <p className="text-gray-500 max-w-xs mx-auto mt-2">Get a random topic, write your essay, and get an instant Band Score.</p>
                     </div>
                     <button 
                         onClick={startWritingTest} 
                         disabled={loading}
                         className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-200 active:scale-95 transition-transform flex items-center gap-2"
                     >
                         {loading ? 'Generating...' : <><Sparkles size={18} /> Start Writing Test</>}
                     </button>
                 </div>
                ) : (
                    <div className="space-y-4 h-full flex flex-col">
                        {!writingResult ? (
                            <>
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                    <span className="text-purple-600 font-bold text-xs uppercase tracking-wide">Topic</span>
                                    <h3 className="font-bold text-gray-900 mt-1">{writingTopic}</h3>
                                </div>
                                <textarea
                                    className="flex-1 w-full p-4 bg-gray-50 rounded-xl border border-gray-200 resize-none outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Write your essay here..."
                                    value={essay}
                                    onChange={(e) => setEssay(e.target.value)}
                                ></textarea>
                                <p className="text-right text-xs text-gray-400">{essay.length} chars</p>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-purple-600 text-white p-6 rounded-2xl text-center">
                                    <p className="text-purple-200 text-xs font-bold uppercase">Estimated Score</p>
                                    <div className="text-5xl font-black">{writingResult.band}</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <h4 className="font-bold text-gray-900 mb-2">Feedback</h4>
                                    <p className="text-gray-600 text-sm">{writingResult.feedback}</p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                                    <h4 className="font-bold text-yellow-800 mb-2 text-xs uppercase">Correction</h4>
                                    <p className="text-yellow-900 text-sm">{writingResult.corrected}</p>
                                </div>
                                <button 
                                    onClick={startWritingTest}
                                    className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl"
                                >
                                    New Topic
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </>
        )}

      </div>

      {/* FOOTER ACTIONS */}
      {(readingData || listeningData || (writingTopic && !writingResult)) && (
        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-safe-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
             {mode === 'writing' ? (
                 <button 
                    onClick={submitWriting}
                    disabled={loading}
                    className="w-full py-4 bg-purple-600 text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                >
                    {loading ? 'Grading...' : 'Submit Essay'}
                </button>
             ) : (
                <>
                {submitted ? (
                    <div className="bg-gray-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg">
                        <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Score</p>
                        <p className="text-2xl font-black">{score} / {answers.length}</p>
                        </div>
                        <button 
                        onClick={() => {
                             if(mode === 'reading') startReadingTest();
                             if(mode === 'listening') startListeningTest();
                        }}
                        className="px-6 py-2 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                        <RotateCcw size={14} /> Next Section
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            if (mode === 'reading' && readingData) submitMCQ(readingData.questions);
                            if (mode === 'listening' && listeningData) submitMCQ(listeningData.questions);
                        }}
                        className={`w-full py-4 text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all flex justify-center items-center gap-2 ${mode === 'reading' ? 'bg-blue-600' : 'bg-red-600'}`}
                    >
                        Submit Answers <CheckCircle size={18} />
                    </button>
                )}
                </>
             )}
        </div>
      )}
    </div>
  );
};

// Sub-component for MCQ
interface MCQBlockProps {
    question: MockQuestion;
    index: number;
    selectedOption: number;
    submitted: boolean;
    onSelect: (idx: number) => void;
}

const MCQBlock: React.FC<MCQBlockProps> = ({ 
    question, index, selectedOption, submitted, onSelect 
}) => {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3 flex gap-3 text-sm">
                <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                    {index + 1}
                </span>
                {question.text}
            </h4>
            <div className="space-y-2 pl-9">
                {question.options.map((opt, oIdx) => {
                    let style = "border-gray-200 bg-white hover:bg-gray-50 text-gray-700";
                    if (submitted) {
                        if (oIdx === question.correctIndex) style = "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500";
                        else if (selectedOption === oIdx) style = "border-red-300 bg-red-50 text-red-700";
                        else style = "border-gray-100 bg-gray-50 text-gray-400 opacity-60";
                    } else if (selectedOption === oIdx) {
                        style = "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500";
                    }

                    return (
                        <button
                            key={oIdx}
                            onClick={() => onSelect(oIdx)}
                            disabled={submitted}
                            className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex justify-between items-center ${style}`}
                        >
                            {opt}
                            {submitted && oIdx === question.correctIndex && <CheckCircle size={14} className="text-green-600" />}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

// Icon for missing import
const UserIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

export default MockTestScreen;