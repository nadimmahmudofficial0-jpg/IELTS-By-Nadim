import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { auth, googleProvider } from '../firebaseConfig';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/invalid-credential':
        return "Incorrect email or password. Please try again.";
      case 'auth/user-not-found':
        return "No account found with this email.";
      case 'auth/wrong-password':
        return "Wrong password! Please try again.";
      case 'auth/email-already-in-use':
        return "This email is already used. Try logging in.";
      case 'auth/weak-password':
        return "Password must be at least 6 characters.";
      case 'auth/invalid-email':
        return "Please enter a valid email address.";
      case 'auth/too-many-requests':
        return "Too many failed attempts. Please try again later.";
      default:
        return "Something went wrong. Please check your internet connection.";
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin && (!firstName.trim() || !lastName.trim())) {
        setError("Please enter your first and last name.");
        return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
            displayName: `${firstName.trim()} ${lastName.trim()}`
        });
      }
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.code));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.code));
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email address in the box above first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError('');
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.code));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-48 h-48 mx-auto mb-6 flex items-center justify-center">
            <img 
              src="https://i.ibb.co.com/F4wTB0mc/Gemini-Generated-Image-7lnvyd7lnvyd7lnv.png" 
              alt="IELTS By Nadim Logo" 
              className="w-full h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; 
                target.src = "https://cdn-icons-png.flaticon.com/512/3429/3429402.png";
              }}
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">IELTS By Nadim</h1>
          <p className="text-gray-500 text-sm mt-1">Your personal band score booster</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium mb-4 text-center border border-red-100 animate-pulse">
            {error}
          </div>
        )}

        {resetSent && (
          <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm font-medium mb-4 text-center border border-green-100">
            ✅ Password reset link sent to your email!
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="First Name"
                        className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required={!isLogin}
                    />
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required={!isLogin}
                    />
                </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Email address"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-3">
            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                    <path fill="#EA4335" d="M12 4.81c1.6 0 3.05.55 4.19 1.63l3.15-3.15C17.45 1.45 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
            </button>
        </div>

        <div className="mt-6 text-center space-y-3">
            {isLogin && (
                <button 
                    onClick={handleResetPassword}
                    className="text-sm font-medium text-gray-500 hover:text-blue-600 block w-full transition-colors underline decoration-dotted"
                >
                    Forgot Password?
                </button>
            )}
            
            <div className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setResetSent(false);
                }}
                className="font-bold text-blue-600 hover:text-blue-700"
                >
                {isLogin ? 'Sign Up' : 'Login'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;