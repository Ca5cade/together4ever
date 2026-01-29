import React, { useState } from 'react';
import { User } from '../types';
import { X, Save } from 'lucide-react';

interface EditProfileProps {
  user: User;
  onUpdate: (updatedUser: Partial<User>) => void;
  onClose: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onUpdate, onClose }) => {
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState(user.avatar);

  const handleSave = () => {
    onUpdate({ bio, avatar });
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-white italic tracking-wide">EDIT PROFILE</h2>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <img src={avatar} alt="Avatar" className="w-28 h-28 rounded-full border-4 border-slate-800 object-cover" />
          <div className="w-full">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Avatar URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
              placeholder="https://example.com/avatar.png"
            />
          </div>
        </div>

        <div className="w-full">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all resize-none h-24"
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold flex items-center space-x-2 hover:brightness-110 transition-all"
        >
          <Save size={16} />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
