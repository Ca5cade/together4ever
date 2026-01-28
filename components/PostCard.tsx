import React from 'react';
import { Post, User } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

interface PostCardProps {
  post: Post;
  author: User;
  currentUser: User;
  onLike: (postId: string) => void;
  onReply: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, author, currentUser, onLike, onReply }) => {
  const isLiked = post.likes.includes(currentUser.id);

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden mb-5 hover:border-slate-700 transition-colors duration-300">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src={author.avatar} 
              alt={author.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-700"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm tracking-wide">{author.name}</h3>
            <p className="text-xs text-slate-500 font-mono">{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
        <button className="text-slate-600 hover:text-slate-300 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-slate-300 text-base mb-3 whitespace-pre-wrap leading-relaxed">{post.content}</p>
      </div>
      
      {post.imageUrl && (
        <div className="w-full h-64 sm:h-80 bg-slate-950 overflow-hidden border-y border-slate-800/50">
          <img 
            src={post.imageUrl} 
            alt="Status attachment" 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-3 px-4 flex items-center justify-between border-t border-slate-800/50 bg-slate-900/50">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => onLike(post.id)}
            className={`flex items-center space-x-2 group transition-all ${isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-400'}`}
          >
            <div className={`p-1.5 rounded-full group-hover:bg-red-500/10 transition-colors ${isLiked ? 'bg-red-500/10' : ''}`}>
              <Heart size={20} className={isLiked ? "fill-current" : ""} />
            </div>
            <span className="text-sm font-bold">{post.likes.length > 0 ? post.likes.length : ''}</span>
          </button>
          
          <button 
            onClick={() => onReply(post)}
            className="flex items-center space-x-2 text-slate-500 hover:text-cyan-400 transition-colors group"
          >
            <div className="p-1.5 rounded-full group-hover:bg-cyan-500/10 transition-colors">
               <MessageCircle size={20} />
            </div>
            <span className="text-sm font-bold">Reply</span>
          </button>
        </div>
        
        <button className="text-slate-600 hover:text-slate-300 transition-colors p-1.5 hover:bg-slate-800 rounded-full">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
};