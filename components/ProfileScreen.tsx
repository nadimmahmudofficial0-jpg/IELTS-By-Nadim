import React, { useState, useEffect } from 'react';
import { User, Camera, Save, LogOut, PenTool, Mail } from 'lucide-react';
import { updateProfile, signOut } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db, APP_ID } from '../firebaseConfig';

interface ProfileScreenProps {
  user: any;
  userPhoto: string | null;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, userPhoto }) => {
  const [name, setName] = useState(user.displayName || '');
  const [photoURL, setPhotoURL] = useState(userPhoto || ''); 
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setPhotoURL(userPhoto || '');
  }, [userPhoto]);

  const resizeImage = (file: File, maxWidth = 500): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL(file.type, 0.7));
                }
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    setMessage('');
    try {
        if (name !== user.displayName) {
            try {
                await updateProfile(auth.currentUser, {
                    displayName: name
                });
            } catch (authErr) {
                console.error("Name update failed", authErr);
            }
        }

        if (photoURL) {
            const profileRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'profile', 'info');
            await setDoc(profileRef, {
                photoURL: photoURL,
                updatedAt: new Date().toISOString()
            }, { merge: true });
        }

        setMessage('Profile updated successfully! ✅');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
        console.error(error);
        setMessage('Error: ' + error.message);
    }
    setIsSaving(false);
  };

  const handleLogout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out: ", error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        try {
            const resizedImage = await resizeImage(file);
            setPhotoURL(resizedImage);
        } catch (err) {
            alert("Error processing image. Please try another one.");
        }
    }
  };

  return (
    <div className="p-6 pb-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
                <User className="text-blue-600" size={24} /> 
            </div>
            My Profile
        </h2>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
            <div className="relative group mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-50 shadow-inner bg-gray-100">
                    {photoURL ? (
                        <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <User size={48} />
                        </div>
                    )}
                </div>
                {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
                        <Camera size={18} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                )}
            </div>

            {message && (
                <div className="mb-4 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
                    {message}
                </div>
            )}

            <div className="w-full space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Full Name</label>
                    <input 
                        type="text" 
                        value={name}
                        disabled={!isEditing}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full p-3 rounded-xl border ${isEditing ? 'border-blue-300 bg-white focus:ring-2 focus:ring-blue-100' : 'border-gray-200 bg-gray-50 text-gray-600'} transition-all outline-none`}
                    />
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email Address</label>
                    <div className="relative">
                        <input 
                            type="email" 
                            value={user.email}
                            disabled
                            className="w-full p-3 pl-10 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    </div>
                </div>

                {isEditing && (
                    <div className="pt-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Or Paste Image URL</label>
                            <input 
                            type="text" 
                            value={photoURL}
                            onChange={(e) => setPhotoURL(e.target.value)}
                            placeholder="https://..."
                            className="w-full p-3 rounded-xl border border-blue-300 bg-white text-sm"
                        />
                    </div>
                )}
            </div>

            <div className="w-full mt-8 flex gap-3">
                {isEditing ? (
                        <>
                        <button 
                            onClick={() => { setIsEditing(false); setName(user.displayName || ''); setPhotoURL(userPhoto || ''); }}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex justify-center items-center gap-2"
                        >
                            {isSaving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </button>
                        </>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex justify-center items-center gap-2 shadow-lg shadow-blue-200"
                    >
                        <PenTool size={18} /> Edit Profile
                    </button>
                )}
            </div>
        </div>

        <button 
            onClick={handleLogout}
            className="w-full mt-6 py-4 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 flex justify-center items-center gap-2 border border-red-100 transition-colors"
        >
            <LogOut size={20} /> Logout
        </button>
    </div>
  );
};

export default ProfileScreen;