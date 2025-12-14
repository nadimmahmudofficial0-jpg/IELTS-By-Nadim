import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Home, PenTool, BookOpen, User as UserIcon } from 'lucide-react';
import { auth, db, APP_ID } from './firebaseConfig';
import { TabType, DailyProgress } from './types';

// Components
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import WritingScreen from './components/WritingScreen';
import VocabScreen from './components/VocabScreen';
import ProfileScreen from './components/ProfileScreen';
import MockTestScreen from './components/MockTestScreen';
import AboutScreen from './components/AboutScreen';
import IeltsInfoScreen from './components/IeltsInfoScreen';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>({ current: 0, total: 5 });

  const incrementProgress = () => {
    setDailyProgress(prev => {
      if (prev.current < prev.total) {
        return { ...prev, current: prev.current + 1 };
      }
      return prev;
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
          setUserPhoto(null);
          setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
        const profileRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'profile', 'info');
        const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.photoURL) {
                    setUserPhoto(data.photoURL);
                }
            } else {
                setUserPhoto(user.photoURL); 
            }
            setLoading(false);
        }, (error) => {
            console.error("Firestore Error:", error);
            setUserPhoto(user.photoURL);
            setLoading(false);
        });

        return () => unsubscribeProfile();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen changeTab={setActiveTab} user={user} userPhoto={userPhoto} dailyProgress={dailyProgress} />;
      case 'writing':
        return <WritingScreen onTaskComplete={incrementProgress} />;
      case 'vocab':
        return <VocabScreen onTaskComplete={incrementProgress} />;
      case 'profile':
        return <ProfileScreen user={user} userPhoto={userPhoto} />;
      case 'mock':
        return <MockTestScreen onComplete={incrementProgress} goBack={() => setActiveTab('home')} />;
      case 'about':
        return <AboutScreen goBack={() => setActiveTab('home')} />;
      case 'info':
        return <IeltsInfoScreen goBack={() => setActiveTab('home')} />;
      default:
        return <HomeScreen changeTab={setActiveTab} user={user} userPhoto={userPhoto} dailyProgress={dailyProgress} />;
    }
  };

  return (
    <div className="w-full h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      <div className="flex-1 overflow-y-auto w-full max-w-3xl mx-auto bg-white shadow-sm sm:border-x border-gray-100 no-scrollbar relative">
        {renderContent()}
      </div>

      {/* Hide Bottom Nav on special screens */}
      {activeTab !== 'mock' && activeTab !== 'about' && activeTab !== 'info' && (
        <div className="bg-white border-t border-gray-200 px-6 py-3 pb-safe-bottom flex justify-between items-center w-full max-w-3xl mx-auto z-50">
          <NavButton 
            icon={<Home size={24} />} 
            label="Home" 
            isActive={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
          />
          <NavButton 
            icon={<PenTool size={24} />} 
            label="Writing" 
            isActive={activeTab === 'writing'} 
            onClick={() => setActiveTab('writing')} 
          />
          <NavButton 
            icon={<BookOpen size={24} />} 
            label="Vocab" 
            isActive={activeTab === 'vocab'} 
            onClick={() => setActiveTab('vocab')} 
          />
          <NavButton 
            icon={<UserIcon size={24} />} 
            label="Profile" 
            isActive={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
          />
        </div>
      )}
    </div>
  );
}

interface NavButtonProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-blue-600 scale-105' : 'text-gray-400 hover:text-gray-600'} active:scale-90`}
  >
    {icon}
    <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-0 scale-0'} transition-all duration-300`}>{label}</span>
  </button>
);