import React from 'react';
import { User, Award, PenTool, BookOpen, Layers, Info, Compass } from 'lucide-react';
import { TabType, DailyProgress } from '../types';

interface HomeScreenProps {
  changeTab: (tab: TabType) => void;
  user: any;
  userPhoto: string | null;
  dailyProgress: DailyProgress;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ changeTab, user, userPhoto, dailyProgress }) => {
  const goToProfile = () => changeTab('profile');
  const progressPercent = Math.min(100, Math.round((dailyProgress.current / dailyProgress.total) * 100));

  return (
    <div className="p-6">
      <header className="mb-8 mt-4 flex justify-between items-start">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Hello, {user.displayName ? user.displayName.split(' ')[0] : 'Student'}! 👋</h1>
            <p className="text-gray-500 text-sm mt-1">Ready to boost your band score?</p>
        </div>
        <button 
            onClick={goToProfile}
            className="bg-gray-100 p-1 rounded-full text-gray-600 hover:ring-2 hover:ring-blue-300 transition-all overflow-hidden w-10 h-10 border border-gray-200"
            title="Go to Profile"
        >
            {userPhoto ? (
                <img src={userPhoto} className="w-full h-full object-cover" alt="User" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">
                    {user.displayName ? user.displayName[0] : <User size={20} />}
                </div>
            )}
        </button>
      </header>
      
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden transition-all duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="font-bold text-xl">Daily Goal</h3>
                <p className="text-blue-100 text-sm">{dailyProgress.current}/{dailyProgress.total} Tasks Completed</p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Award size={24} className="text-yellow-300" />
            </div>
            </div>
            <div className="w-full bg-blue-800/30 rounded-full h-2">
                <div 
                    className="bg-yellow-400 h-2 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>
            {progressPercent === 100 && (
                <div className="mt-2 text-xs font-bold text-yellow-300 animate-pulse">
                    🎉 Goal Achieved! Great job!
                </div>
            )}
        </div>
      </div>

      <h2 className="font-bold text-gray-800 mb-4 text-xl">Practice Modules</h2>
      <div className="grid grid-cols-2 gap-4">
        <ModuleCard 
          icon={<PenTool className="text-purple-600" size={28} />} 
          title="Writing" 
          desc="AI Essay Check ✨" 
          onClick={() => changeTab('writing')}
          color="bg-purple-50 border border-purple-100"
        />
        <ModuleCard 
          icon={<BookOpen className="text-orange-600" size={28} />} 
          title="Vocabulary" 
          desc="400+ Band 9 Words" 
          onClick={() => changeTab('vocab')}
          color="bg-orange-50 border border-orange-100"
        />
        <ModuleCard 
          icon={<Layers className="text-emerald-600" size={28} />} 
          title="Mock Test" 
          desc="Reading Practice" 
          onClick={() => changeTab('mock')}
          color="bg-emerald-50 border border-emerald-100"
        />
        <ModuleCard 
          icon={<Compass className="text-pink-600" size={28} />} 
          title="IELTS Guide" 
          desc="Info & Calculator" 
          onClick={() => changeTab('info')}
          color="bg-pink-50 border border-pink-100"
        />
        <ModuleCard 
          icon={<Info className="text-blue-600" size={28} />} 
          title="About Owner" 
          desc="Meet Nadim" 
          onClick={() => changeTab('about')}
          color="bg-blue-50 border border-blue-100"
        />
      </div>
    </div>
  );
};

interface ModuleCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
  color: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ icon, title, desc, onClick, color }) => (
  <button 
    onClick={onClick}
    className={`${color} p-5 rounded-2xl flex flex-col items-start gap-4 hover:shadow-md transition-all active:scale-95 text-left w-full group`}
  >
    <div className="bg-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
      <p className="text-xs text-gray-600 font-medium mt-1">{desc}</p>
    </div>
  </button>
);

export default HomeScreen;