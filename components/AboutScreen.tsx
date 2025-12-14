import React from 'react';
import { Mail, Facebook, Instagram, Globe, ChevronLeft } from 'lucide-react';

interface AboutScreenProps {
  goBack: () => void;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ goBack }) => {
  return (
    <div className="bg-white h-full overflow-y-auto no-scrollbar pb-safe-bottom relative">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-4 z-20 flex items-center">
        <button 
          onClick={goBack} 
          className="bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-800 shadow-sm hover:bg-white transition-all"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-80 animate-in fade-in duration-700">
        <img 
          src="https://i.ibb.co.com/PG7SVdPw/player.jpg" 
          alt="Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
          <h1 className="text-3xl font-bold text-white mb-2">IELTS By Nadim</h1>
          <p className="text-gray-200 text-sm font-medium">Built with passion. Designed for success.</p>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 space-y-12">
        
        {/* Story Section */}
        <section className="animate-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Creator's Story</h2>
            <div className="text-gray-600 leading-relaxed text-lg space-y-4">
              <p>
                Hi, I'm <span className="font-bold text-blue-600">Md Nadim Mahmud</span>.
              </p>
              <p>
                My journey with IELTS wasn't easy. Like many of you, I started with a dream to study abroad and improve my future. However, I quickly realized that the path to a high band score is filled with confusion. There are thousands of resources, books, and videos, but finding a structured, simple way to practice daily was difficult.
              </p>
              <p>
                I struggled with maintaining consistency. Some days I studied for hours, other days I felt lost. I realized that the key to success isn't just hard work, but smart, consistent work. I needed a tool that wasn't just a textbook, but a companion that could correct my writing, help me memorize words without boredom, and track my progress.
              </p>
              <p>
                That's why I built this app. I am not just a developer; I am a student first. Every feature here—from the AI writing checker to the flashcards—is something I wished I had when I started. I wanted to create a platform where learners like us can focus on what matters: improving every single day.
              </p>
              <p>
                This isn't just an app; it's a reflection of my dedication to self-improvement and my desire to make the IELTS journey smoother for everyone in our community. Let's achieve our goals together.
              </p>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="animate-in slide-in-from-bottom-8 duration-700 delay-200">
           <div className="rounded-2xl overflow-hidden shadow-lg mb-6 grayscale hover:grayscale-0 transition-all duration-700">
            <img 
              src="https://i.ibb.co.com/svdfy57Y/photo-2025-12-14-22-38-54.jpg" 
              alt="Inspiration" 
              className="w-full h-auto object-cover"
            />
          </div>

          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 italic text-gray-700 bg-gray-50 rounded-r-lg">
            "Success isn't about being the best. It's about being better than you were yesterday. Consistency creates the change you want to see."
          </blockquote>
        </section>

        {/* Contact Section */}
        <section className="bg-gray-900 rounded-3xl p-8 text-white animate-in slide-in-from-bottom-8 duration-700 delay-300">
          <h3 className="text-xl font-bold mb-6 text-center">Let's Connect</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <a 
              href="mailto:nadimmahmudofficial0@gmail.com"
              className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <div className="bg-red-500 p-2 rounded-full">
                <Mail size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email Me</p>
                <p className="text-sm font-medium break-all">nadimmahmudofficial0@gmail.com</p>
              </div>
            </a>

            <a 
              href="https://www.facebook.com/share/17y6krRevv/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
               <div className="bg-blue-600 p-2 rounded-full">
                <Facebook size={20} className="text-white" />
              </div>
              <span className="font-medium">Facebook</span>
            </a>

            <a 
              href="https://www.instagram.com/nadim_sheikh57/profilecard/?igsh=dGs5M2Qzb2ZseDho"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
               <div className="bg-pink-600 p-2 rounded-full">
                <Instagram size={20} className="text-white" />
              </div>
              <span className="font-medium">Instagram</span>
            </a>

            <a 
              href="https://md-nadim-mahmud-portfolio.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
               <div className="bg-emerald-600 p-2 rounded-full">
                <Globe size={20} className="text-white" />
              </div>
              <span className="font-medium">Portfolio Website</span>
            </a>
          </div>

          <div className="mt-8 text-center text-gray-500 text-xs">
            © 2025 IELTS By Nadim. All rights reserved.
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutScreen;