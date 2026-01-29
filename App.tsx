import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Layout } from './components/Layout';
import { CreatePost } from './components/CreatePost';
import { PostCard } from './components/PostCard';
import EditProfile from './components/EditProfile';
import { 
  AppState, 
  User, 
  ViewState, 
  Post, 
  Message 
} from './types';
import { api } from './api';
import { 
  Send, 
  UserPlus, 
  Check, 
  MessageCircle, 
  ChevronLeft,
  Gamepad2,
  User as UserIcon,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  UserCog
} from 'lucide-react';

// --- Authentication Component ---

const AuthPage: React.FC<{ 
  onLogin: (u: string, p: string) => void; 
  onRegister: (name: string, username: string, pass: string, bio: string) => void; 
  error: string | null;
  onClearError: () => void;
}> = ({ onLogin, onRegister, error, onClearError }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await onLogin(username, password);
      } else {
        await onRegister(name, username, password, bio);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 max-w-md w-full relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-cyan-500/10 blur-[50px] rounded-full"></div>
        
        <div className="relative text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-[0_0_30px_rgba(6,182,212,0.4)] rotate-3">
            <Gamepad2 size={32} />
          </div>
          <h1 className="text-3xl font-black italic text-white mb-2 tracking-tighter">TOGETHER<span className="text-cyan-400">4</span>EVER</h1>
          <p className="text-slate-400 mb-8 font-medium text-sm">
            {isLogin ? 'Welcome back, player.' : 'Create your character.'}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {!isLogin && (
              <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Display Name</label>
                 <div className="relative">
                    <UserIcon size={18} className="absolute left-3 top-3 text-slate-500" />
                    <input 
                      type="text" 
                      required 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                      placeholder="e.g. ShadowHunter"
                    />
                 </div>
              </div>
            )}

            <div className="space-y-1">
               <label className="text-xs font-bold text-slate-500 uppercase ml-1">Username</label>
               <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3 text-slate-500" />
                  <input 
                    type="text" 
                    required 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    placeholder="Enter username"
                  />
               </div>
            </div>

            <div className="space-y-1">
               <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
               <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3 text-slate-500" />
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
               </div>
            </div>

            {!isLogin && (
               <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Bio (Optional)</label>
                 <textarea 
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all resize-none h-20"
                    placeholder="What games do you play?"
                 />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium text-center">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl font-bold text-base hover:brightness-110 transition-all shadow-lg active:scale-[0.98] mt-4 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <span>{isLogin ? 'Login' : 'Sign Up'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <button 
              onClick={() => { setIsLogin(!isLogin); setUsername(''); setPassword(''); onClearError(); }}
              className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FriendsPage: React.FC<{ users: User[], currentUser: User, onAdd: (id: string) => void }> = ({ users, currentUser, onAdd }) => {
  const nonFriends = users.filter(u => u.id !== currentUser.id && !currentUser.friends.includes(u.id));
  const friends = users.filter(u => currentUser.friends.includes(u.id));

  return (
    <div className="space-y-8 px-4 md:px-0">
      <section>
        <h2 className="text-xl font-black text-white italic tracking-wide mb-5 flex items-center">
          <span className="w-2 h-8 bg-cyan-500 mr-3 rounded-sm"></span>
          YOUR SQUAD
        </h2>
        {friends.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
             <p className="text-slate-500 mb-2">Your squad is empty.</p>
             <p className="text-xs text-slate-600">Add players from the recruitment list below!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {friends.map(friend => (
              <div key={friend.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all flex items-center space-x-4 shadow-lg group">
                <div className="relative">
                  <img src={friend.avatar} alt={friend.name} className="w-14 h-14 rounded-full border-2 border-slate-700 group-hover:border-cyan-400 transition-colors" />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900"></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">{friend.name}</h3>
                  <p className="text-xs text-slate-500 truncate font-mono">{friend.bio}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-black text-white italic tracking-wide mb-5 flex items-center">
          <span className="w-2 h-8 bg-purple-500 mr-3 rounded-sm"></span>
          RECRUIT PLAYERS
        </h2>
        <div className="space-y-3">
          {nonFriends.map(user => (
            <div key={user.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between shadow-lg hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center space-x-4">
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border border-slate-700" />
                <div>
                  <h3 className="font-bold text-slate-200">{user.name}</h3>
                  <p className="text-xs text-slate-500">{user.bio}</p>
                </div>
              </div>
              <button 
                onClick={() => onAdd(user.id)}
                className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-white transition-all border border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                <UserPlus size={20} />
              </button>
            </div>
          ))}
          {nonFriends.length === 0 && <p className="text-slate-500 text-sm font-mono p-4 border border-dashed border-slate-800 rounded-lg text-center">No new recruits found on this server.</p>}
        </div>
      </section>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  // --- State ---
  const [activeView, setActiveView] = useState<ViewState>('LOGIN');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  // Initialize empty state
  const [state, setState] = useState<AppState>({
    currentUser: null,
    users: [],
    posts: [],
    messages: []
  });
  
  // UI State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [replyingToPost, setReplyingToPost] = useState<Post | null>(null);
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollInterval = useRef<any>(null);

  // Fetch all data
  const fetchData = async () => {
    if (!state.currentUser) return;
    try {
      const [users, posts, messages] = await Promise.all([
        api.getUsers(),
        api.getPosts(),
        api.getMessages()
      ]);
      setState(prev => ({
        ...prev,
        users,
        posts,
        messages
      }));
    } catch (e) {
      console.error("Failed to sync data", e);
    }
  };

  // Poll for updates
  useEffect(() => {
    if (state.currentUser) {
      fetchData(); // Initial fetch
      pollInterval.current = setInterval(fetchData, 5000); // Poll every 5s
    }
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [state.currentUser?.id]); // Restart polling if user changes

  // Scroll to bottom of chat
  useEffect(() => {
    if (activeView === 'MESSAGES' && selectedChatUser) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages, selectedChatUser, activeView]);

  // --- Computed ---
  const feedPosts = useMemo(() => {
    if (!state.currentUser) return [];
    return state.posts
      .filter(p => state.currentUser?.friends.includes(p.userId) || p.userId === state.currentUser?.id)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [state.posts, state.currentUser, state.users]); // Added users dependency as it tracks friend changes indirectly

  const unreadMessages = useMemo(() => {
    if (!state.currentUser) return 0;
    return state.messages.filter(m => m.receiverId === state.currentUser?.id && !m.read).length;
  }, [state.messages, state.currentUser]);

  // --- Actions ---

  const handleLogin = async (username: string, pass: string) => {
    try {
      const user = await api.login(username, pass);
      setState(prev => ({ ...prev, currentUser: user }));
      // Fetch data immediately after login
      const [users, posts, messages] = await Promise.all([
        api.getUsers(),
        api.getPosts(),
        api.getMessages()
      ]);
      setState(prev => ({ ...prev, users, posts, messages }));
      setActiveView('HOME');
      setAuthError(null);
    } catch (e) {
      setAuthError("Invalid credentials.");
    }
  };

  const handleRegister = async (name: string, username: string, pass: string, bio: string) => {
     try {
       const newUser: User = {
         id: `u_${Date.now()}`,
         name,
         username,
         password: pass,
         bio: bio || "Ready to play.",
         avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
         friends: []
       };
       await api.register(newUser);
       setState(prev => ({ ...prev, currentUser: newUser }));
       setActiveView('HOME');
       setAuthError(null);
       fetchData();
     } catch (e) {
       setAuthError("Registration failed. Username may be taken.");
     }
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null, users: [], posts: [], messages: [] }));
    setActiveView('LOGIN');
    setAuthError(null);
  };

  const handleCreatePost = async (content: string, imageUrl?: string) => {
    if (!state.currentUser) return;
    const newPost: Post = {
      id: `p${Date.now()}`,
      userId: state.currentUser.id,
      content,
      imageUrl,
      timestamp: Date.now(),
      likes: []
    };
    try {
      await api.createPost(newPost);
      fetchData(); // Refresh immediately
    } catch (e) {
      console.error(e);
    }
  };

  const handleLike = async (postId: string) => {
    if (!state.currentUser) return;
    // Optimistic update
    setState(prev => ({
      ...prev,
      posts: prev.posts.map(p => {
        if (p.id !== postId) return p;
        const isLiked = p.likes.includes(prev.currentUser!.id);
        return {
          ...p,
          likes: isLiked 
            ? p.likes.filter(id => id !== prev.currentUser!.id)
            : [...p.likes, prev.currentUser!.id]
        };
      })
    }));

    try {
      await api.toggleLike(postId, state.currentUser.id);
    } catch (e) {
      console.error(e);
      fetchData(); // Revert on error
    }
  };

  const handleStartReply = (post: Post) => {
    setReplyingToPost(post);
    setSelectedChatUser(post.userId);
    setActiveView('MESSAGES');
  };

  const handleSendMessage = async (content: string, replyToPostId?: string) => {
    if (!state.currentUser || !selectedChatUser) return;
    
    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: state.currentUser.id,
      receiverId: selectedChatUser,
      content,
      timestamp: Date.now(),
      read: false,
      replyToPostId
    };

    // Optimistic update
    setState(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));
    setChatInput('');
    setReplyingToPost(null);

    try {
      await api.sendMessage(newMessage);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddFriend = async (friendId: string) => {
    if (!state.currentUser) return;
    try {
      await api.addFriend(state.currentUser.id, friendId);
      // Update local state to reflect friend add immediately
      setState(prev => {
        if (!prev.currentUser) return prev;
        const updatedUser = { 
          ...prev.currentUser, 
          friends: [...prev.currentUser.friends, friendId] 
        };
        return {
          ...prev,
          currentUser: updatedUser
        };
      });
      fetchData(); // Sync with server
    } catch (e) {
      console.error(e);
    }
  };

  // --- Render Views ---

  if (activeView === 'LOGIN') {
    return <AuthPage onLogin={handleLogin} onRegister={handleRegister} error={authError} onClearError={() => setAuthError(null)} />;
  }

  const renderMessages = () => {
    if (!selectedChatUser) {
      // Chat List
      const conversations = state.currentUser!.friends.map(friendId => {
        const friend = state.users.find(u => u.id === friendId);
        if (!friend) return null; // Handle missing friend data

        const messages = state.messages
          .filter(m => (m.senderId === state.currentUser!.id && m.receiverId === friendId) || 
                       (m.senderId === friendId && m.receiverId === state.currentUser!.id));
        const lastMsg = messages.sort((a, b) => b.timestamp - a.timestamp)[0];
        
        const hasUnread = messages.some(m => m.receiverId === state.currentUser!.id && !m.read);

        return (
          <div 
            key={friendId}
            onClick={() => setSelectedChatUser(friendId)}
            className={`flex items-center space-x-4 p-4 border-b border-slate-800 hover:bg-slate-800/80 cursor-pointer transition-colors ${hasUnread ? 'bg-slate-900/80 border-l-4 border-l-pink-500' : 'bg-slate-900'}`}
          >
            <div className="relative">
              <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full border border-slate-700" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className={`font-bold truncate group-hover:text-white ${hasUnread ? 'text-white' : 'text-slate-200'}`}>{friend.name}</h3>
                {lastMsg && (
                   <span className="text-xs text-slate-500 font-mono">
                     {new Date(Number(lastMsg.timestamp)).toLocaleDateString()}
                   </span>
                )}
              </div>
              <p className={`text-sm truncate ${hasUnread ? 'font-bold text-pink-400' : 'text-slate-500'}`}>
                {lastMsg ? lastMsg.content : 'Start a session...'}
              </p>
            </div>
            {hasUnread && (
              <div className="w-2.5 h-2.5 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.8)] animate-pulse"></div>
            )}
          </div>
        );
      }).filter(Boolean);

      return (
        <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden h-[calc(100vh-140px)] md:h-[600px] flex flex-col">
          <div className="p-4 border-b border-slate-800 font-black italic tracking-wide text-lg text-white flex items-center bg-slate-900/50 backdrop-blur">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></span>
            ACTIVE CHATS
          </div>
          <div className="overflow-y-auto h-full pb-20 scrollbar-thin scrollbar-thumb-slate-700">
            {conversations && conversations.length > 0 ? conversations : (
               <div className="flex flex-col items-center justify-center h-full text-slate-600 p-8 text-center">
                 <div className="bg-slate-800 p-6 rounded-full mb-4">
                   <MessageCircle size={32} className="opacity-50" />
                 </div>
                 <p className="font-mono text-sm">No active channels. Reply to a status or start a chat!</p>
               </div>
            )}
          </div>
        </div>
      );
    }

    // Chat View
    const friend = state.users.find(u => u.id === selectedChatUser);
    if (!friend) return <div>User not found</div>;

    const chatMessages = state.messages
      .filter(m => (m.senderId === state.currentUser!.id && m.receiverId === selectedChatUser) || 
                   (m.senderId === selectedChatUser && m.receiverId === state.currentUser!.id))
      .sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

    return (
      <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden flex flex-col h-[calc(100vh-140px)] md:h-[600px]">
        {/* Chat Header */}
        <div className="p-3 border-b border-slate-800 flex items-center space-x-3 bg-slate-900 z-10 shadow-md">
          <button onClick={() => setSelectedChatUser(null)} className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <img src={friend.avatar} alt={friend.name} className="w-9 h-9 rounded-full border border-slate-700" />
          <span className="font-bold text-white tracking-wide">{friend.name}</span>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
          {chatMessages.map(msg => {
            const isMe = msg.senderId === state.currentUser!.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-md ${
                  isMe 
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none' 
                    : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                }`}>
                  {msg.replyToPostId && (
                    <div className="text-xs opacity-70 mb-1 border-l-2 border-white/30 pl-2 font-mono">
                      RE: Status Update
                    </div>
                  )}
                  <p className="leading-relaxed">{msg.content}</p>
                  <div className={`text-[10px] mt-1 text-right font-mono ${isMe ? 'text-white/60' : 'text-slate-500'}`}>
                    {new Date(Number(msg.timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Context Context */}
        {replyingToPost && (
          <div className="bg-slate-800/80 backdrop-blur p-2 text-sm text-slate-300 flex justify-between items-center border-t border-slate-700 border-b border-slate-900">
            <span className="truncate flex-1 pl-2 border-l-2 border-cyan-500 ml-1">
              Replying to: <strong className="text-cyan-400">{replyingToPost.content}</strong>
            </span>
            <button onClick={() => setReplyingToPost(null)} className="p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white">
              <Check size={16} />
            </button>
          </div>
        )}

        {/* Input Area */}
        <form 
          onSubmit={(e) => { e.preventDefault(); if(chatInput.trim()) handleSendMessage(chatInput, replyingToPost?.id); }}
          className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Send message..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-4 py-2.5 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none placeholder-slate-600 transition-all"
          />
          <button 
            type="submit" 
            disabled={!chatInput.trim()}
            className="p-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full disabled:opacity-50 disabled:grayscale hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    );
  };

  const renderProfile = () => {
    if (isEditingProfile) {
      return <EditProfile 
                user={state.currentUser!} 
                onClose={() => setIsEditingProfile(false)}
                onUpdate={async (updatedUser) => {
                  if (state.currentUser) {
                    try {
                      const user = await api.updateUser(state.currentUser.id, updatedUser);
                      setState(prev => ({
                        ...prev,
                        currentUser: user
                      }));
                    } catch (e) {
                      console.error("Failed to update user", e);
                      // Optionally: show an error message to the user
                    }
                  }
                  setIsEditingProfile(false);
                }} 
             />;
    }

    const user = state.currentUser!;
    const myPosts = state.posts.filter(p => p.userId === user.id).sort((a, b) => b.timestamp - a.timestamp);

    return (
      <div className="space-y-6">
        <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2">
            <button onClick={() => { console.log('Edit Profile button clicked'); setIsEditingProfile(!isEditingProfile); }} className="p-2 bg-slate-800/80 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
              <UserCog size={18} />
            </button>
          </div>
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-800 to-transparent opacity-50"></div>
          
          <div className="relative inline-block mx-auto mb-4">
            <img src={user.avatar} alt={user.name} className="w-28 h-28 rounded-full border-4 border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] object-cover relative z-10" />
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500 opacity-50 animate-pulse z-0"></div>
          </div>
          
          <h2 className="text-2xl font-black text-white tracking-wide">{user.name}</h2>
          <p className="text-cyan-400 text-sm font-bold mb-1">@{user.username}</p>
          <p className="text-slate-400 mb-6 font-medium">{user.bio}</p>
          
          <div className="flex justify-center space-x-4">
            <div className="px-6 py-3 bg-slate-950 rounded-lg border border-slate-800 min-w-[100px]">
              <div className="font-black text-2xl text-cyan-400">{myPosts.length}</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Posts</div>
            </div>
            <div className="px-6 py-3 bg-slate-950 rounded-lg border border-slate-800 min-w-[100px]">
              <div className="font-black text-2xl text-purple-400">{user.friends.length}</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Friends</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-black text-lg px-2 text-white italic">RECENT ACTIVITY</h3>
          {myPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              author={user} 
              currentUser={state.currentUser!} 
              onLike={handleLike}
              onReply={handleStartReply}
            />
          ))}
          {myPosts.length === 0 && (
             <div className="text-center text-slate-600 py-12 border-2 border-dashed border-slate-800 rounded-xl">
               <div className="mb-2 text-4xl">👾</div>
               <p className="font-mono">No stats recorded yet.</p>
             </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout 
      activeView={activeView} 
      onNavigate={setActiveView} 
      currentUser={state.currentUser}
      onLogout={handleLogout}
      unreadCount={unreadMessages}
    >
      <div className="animate-fade-in px-4 md:px-0">
        {activeView === 'HOME' && (
          <>
            <CreatePost currentUser={state.currentUser!} onSubmit={handleCreatePost} />
            <div className="space-y-6">
              {feedPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  author={state.users.find(u => u.id === post.userId)!} 
                  currentUser={state.currentUser!} 
                  onLike={handleLike}
                  onReply={handleStartReply}
                />
              ))}
              {feedPosts.length === 0 && (
                <div className="text-center py-12">
                   <Gamepad2 size={48} className="mx-auto text-slate-700 mb-4" />
                  <p className="text-slate-500 font-medium">Server empty. Be the first to post!</p>
                </div>
              )}
            </div>
          </>
        )}
        
        {activeView === 'FRIENDS' && (
          <FriendsPage 
            users={state.users} 
            currentUser={state.currentUser!} 
            onAdd={handleAddFriend} 
          />
        )}
        
        {activeView === 'MESSAGES' && renderMessages()}
        
        {activeView === 'PROFILE' && renderProfile()}
      </div>
    </Layout>
  );
};

export default App;