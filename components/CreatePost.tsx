import React, { useState } from 'react';
import { User } from '../types';
import { Image as ImageIcon, Send, X } from 'lucide-react';

interface CreatePostProps {
  currentUser: User;
  onSubmit: (content: string, imageUrl?: string) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onSubmit }) => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Mock upload by creating a placeholder URL
      const url = 'https://picsum.photos/800/600';
      setSelectedImage(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !selectedImage) return;
    
    onSubmit(content, selectedImage || undefined);
    setContent('');
    setSelectedImage(null);
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-4 mb-6 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 opacity-70"></div>
      
      <div className="flex space-x-3">
        <img 
          src={currentUser.avatar} 
          alt={currentUser.name} 
          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Ready to drop a status, ${currentUser.name.split(' ')[0]}?`}
            className="w-full resize-none bg-slate-950/50 rounded-lg border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 p-3 text-slate-200 text-base placeholder-slate-500 min-h-[80px] transition-all"
          />
          
          {selectedImage && (
            <div className="relative mt-2 mb-4 w-full h-48 rounded-lg overflow-hidden bg-slate-950 group border border-slate-800">
              <img src={selectedImage} alt="Selected" className="w-full h-full object-cover opacity-90" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 p-1 bg-black/70 text-white rounded-full hover:bg-red-500/80 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 mt-1">
            <div className="flex items-center space-x-2">
              <label className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-full cursor-pointer transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                <ImageIcon size={20} />
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!content.trim() && !selectedImage}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-5 py-2 rounded-full font-bold text-sm flex items-center space-x-2 hover:brightness-110 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all shadow-[0_4px_14px_rgba(6,182,212,0.3)]"
            >
              <span>PUBLISH</span>
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};