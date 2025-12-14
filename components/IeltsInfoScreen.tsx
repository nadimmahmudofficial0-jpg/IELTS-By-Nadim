import React, { useState, useEffect } from 'react';
import { ChevronLeft, GraduationCap, Briefcase, Calculator, BookOpen, Globe, RefreshCcw, Clock, FileText, Mic, Headphones } from 'lucide-react';

interface IeltsInfoScreenProps {
  goBack: () => void;
}

const IeltsInfoScreen: React.FC<IeltsInfoScreenProps> = ({ goBack }) => {
  // Calculator State
  const [scores, setScores] = useState({
    listening: '',
    reading: '',
    writing: '',
    speaking: ''
  });
  const [overall, setOverall] = useState<number | null>(null);

  const calculateScore = () => {
    const l = parseFloat(scores.listening) || 0;
    const r = parseFloat(scores.reading) || 0;
    const w = parseFloat(scores.writing) || 0;
    const s = parseFloat(scores.speaking) || 0;

    if (l === 0 && r === 0 && w === 0 && s === 0) {
        setOverall(null);
        return;
    }

    const avg = (l + r + w + s) / 4;
    const rounded = Math.round(avg * 2) / 2;
    setOverall(rounded);
  };

  useEffect(() => {
    calculateScore();
  }, [scores]);

  const handleInputChange = (field: string, value: string) => {
    if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= 9)) {
        setScores(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="bg-slate-50 h-full overflow-y-auto no-scrollbar pb-safe-bottom relative font-sans">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md p-4 z-20 flex items-center border-b border-gray-200">
        <button 
          onClick={goBack} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold text-gray-900 ml-2">IELTS Guide & Tools</h2>
      </div>

      <div className="p-6 space-y-12">
        
        {/* Intro Section with Image */}
        <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div className="h-40 w-full relative">
            <img 
              src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1000" 
              alt="IELTS Study" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <h3 className="text-2xl font-bold text-white">Master the IELTS</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-lg">
                    <Globe className="text-red-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">What is IELTS?</h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm">
                The <strong>International English Language Testing System (IELTS)</strong> is the world's most popular English language proficiency test for higher education and global migration. It assesses your ability to listen, read, write and speak English.
            </p>
          </div>
        </section>

        {/* Exam Format Breakdown */}
        <section>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText size={24} className="text-blue-600" /> Exam Format Details
            </h3>

            <div className="space-y-6">
                {/* Listening */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row">
                    <div className="sm:w-1/3 h-32 sm:h-auto bg-red-50 relative">
                        <img src="https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=500" alt="Listening" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-red-600 flex items-center gap-1">
                            <Headphones size={12} /> Listening
                        </div>
                    </div>
                    <div className="p-5 sm:w-2/3">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900">30 Minutes</h4>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">4 Sections</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">You will listen to four recordings of native English speakers and then write your answers to a series of questions.</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                            <li>• Recording 1: Conversation (Social context)</li>
                            <li>• Recording 2: Monologue (Social context)</li>
                            <li>• Recording 3: Conversation (Educational context)</li>
                            <li>• Recording 4: Monologue (Academic subject)</li>
                        </ul>
                    </div>
                </div>

                {/* Reading */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row">
                    <div className="sm:w-1/3 h-32 sm:h-auto bg-blue-50 relative">
                        <img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=500" alt="Reading" className="w-full h-full object-cover" />
                         <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-blue-600 flex items-center gap-1">
                            <BookOpen size={12} /> Reading
                        </div>
                    </div>
                    <div className="p-5 sm:w-2/3">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900">60 Minutes</h4>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">40 Questions</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                            The Academic version includes three long texts which range from the descriptive and factual to the discursive and analytical. 
                        </p>
                        <div className="text-xs bg-blue-50 text-blue-800 p-2 rounded">
                            <strong>Tip:</strong> Skim for main ideas, scan for keywords.
                        </div>
                    </div>
                </div>

                {/* Writing */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row">
                    <div className="sm:w-1/3 h-32 sm:h-auto bg-purple-50 relative">
                        <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=500" alt="Writing" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-purple-600 flex items-center gap-1">
                            <FileText size={12} /> Writing
                        </div>
                    </div>
                    <div className="p-5 sm:w-2/3">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900">60 Minutes</h4>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">2 Tasks</span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-2 mb-3">
                            <li><strong>Task 1 (20 mins):</strong> Describe a graph, table, chart or diagram (150 words).</li>
                            <li><strong>Task 2 (40 mins):</strong> Write an essay in response to a point of view, argument or problem (250 words).</li>
                        </ul>
                    </div>
                </div>

                {/* Speaking */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row">
                    <div className="sm:w-1/3 h-32 sm:h-auto bg-orange-50 relative">
                        <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=500" alt="Speaking" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-orange-600 flex items-center gap-1">
                            <Mic size={12} /> Speaking
                        </div>
                    </div>
                    <div className="p-5 sm:w-2/3">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900">11-14 Minutes</h4>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Face-to-Face</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">A face-to-face interview with an examiner.</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                            <li>• Part 1: Intro & Interview (4-5 mins)</li>
                            <li>• Part 2: Long Turn / Cue Card (3-4 mins)</li>
                            <li>• Part 3: Discussion (4-5 mins)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* Calculator Section - MOVED TO MIDDLE */}
        <section className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 ring-4 ring-purple-50/50">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-2 rounded-lg">
                    <Calculator className="text-purple-600" size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Score Calculator</h3>
                    <p className="text-gray-500 text-xs">Calculate your Overall Band Score</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Listening</label>
                    <input 
                        type="number" 
                        placeholder="0-9" 
                        value={scores.listening}
                        onChange={(e) => handleInputChange('listening', e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-center font-bold text-gray-800"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Reading</label>
                    <input 
                        type="number" 
                        placeholder="0-9" 
                        value={scores.reading}
                        onChange={(e) => handleInputChange('reading', e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-center font-bold text-gray-800"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Writing</label>
                    <input 
                        type="number" 
                        placeholder="0-9" 
                        value={scores.writing}
                        onChange={(e) => handleInputChange('writing', e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-center font-bold text-gray-800"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Speaking</label>
                    <input 
                        type="number" 
                        placeholder="0-9" 
                        value={scores.speaking}
                        onChange={(e) => handleInputChange('speaking', e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-center font-bold text-gray-800"
                    />
                </div>
            </div>

            <div className="bg-gray-900 text-white rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/20 to-transparent"></div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Overall Band Score</p>
                <div className="text-5xl font-black relative z-10">
                    {overall !== null ? overall : '-'}
                </div>
                {overall !== null && (
                    <div className="mt-2 text-xs font-medium px-3 py-1 bg-white/10 rounded-full relative z-10">
                        {overall >= 8 ? 'Expert User 🌟' : overall >= 7 ? 'Good User 👍' : overall >= 6 ? 'Competent User' : 'Keep Practicing'}
                    </div>
                )}
            </div>

            <button 
                onClick={() => { setScores({listening: '', reading: '', writing: '', speaking: ''}); setOverall(null); }}
                className="w-full mt-4 flex items-center justify-center gap-2 text-gray-500 text-sm hover:text-purple-600 py-2"
            >
                <RefreshCcw size={14} /> Reset Calculator
            </button>
        </section>

        {/* Comparison Section */}
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-blue-600" /> Academic vs General
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <GraduationCap size={80} />
                </div>
                <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <GraduationCap size={20} /> Academic
                </h4>
                <p className="text-blue-100 text-sm mb-4">
                    For higher education or professional registration.
                </p>
                <ul className="text-xs space-y-2 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <li>• University admission</li>
                    <li>• Medical professionals</li>
                    <li>• Complex texts & diagrams</li>
                </ul>
            </div>

            <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Briefcase size={80} />
                </div>
                <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <Briefcase size={20} /> General Training
                </h4>
                <p className="text-emerald-100 text-sm mb-4">
                    For secondary education, work or migration.
                </p>
                <ul className="text-xs space-y-2 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <li>• Migration (Canada, Aus, UK)</li>
                    <li>• Work experience</li>
                    <li>• Social survival skills</li>
                </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default IeltsInfoScreen;