import React from 'react';
import { ViewState, User } from '../types';
import { Home, User as UserIcon, MessageCircle, Users, LogOut, Gamepad2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
  currentUser: User | null;
  onLogout: () => void;
  unreadCount: number;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeView, 
  onNavigate, 
  currentUser,
  onLogout,
  unreadCount
}) => {
  if (!currentUser) return <>{children}</>;

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => onNavigate(view)}
      className={`flex flex-col md:flex-row items-center md:space-x-3 p-2 rounded-lg transition-all duration-200 ${
        activeView === view 
          ? 'text-cyan-400 md:bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <div className="relative">
        <Icon size={24} strokeWidth={activeView === view ? 2.5 : 2} />
        {view === 'MESSAGES' && unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[9px] font-bold text-white ring-2 ring-slate-900 shadow-[0_0_8px_rgba(236,72,153,0.6)] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>
      <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0 uppercase tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-200">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 p-6 z-20 shadow-xl">
        <div className="flex items-center space-x-2 mb-10 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-[0_0_10px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.7)] transition-shadow duration-300">
            <Gamepad2 size={24} />
          </div>
          <h1 className="text-xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            TOGETHER<span className="text-white">4</span>EVER
          </h1>
        </div>

        <nav className="flex-1 space-y-3">
          <NavItem view="HOME" icon={Home} label="Feed" />
          <NavItem view="FRIENDS" icon={Users} label="Squad" />
          <NavItem view="MESSAGES" icon={MessageCircle} label="Chats" />
          <NavItem view="PROFILE" icon={UserIcon} label="Profile" />
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="flex items-center space-x-3 text-slate-500 hover:text-red-400 transition-colors w-full p-2 group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-medium uppercase tracking-wider text-sm">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto md:px-6 pb-24 md:pb-6 pt-4 md:pt-6">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 pb-4 bg-slate-950 sticky top-0 z-10 border-b border-slate-900/50 backdrop-blur-sm">
          <h1 className="text-lg font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            T4E
          </h1>
          <img 
            src={currentUser.avatar} 
            alt="Me" 
            onClick={() => onNavigate('PROFILE')}
            className="w-9 h-9 rounded-full border-2 border-slate-800"
          />
        </div>
        
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex justify-around items-center py-3 px-2 pb-safe z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <NavItem view="HOME" icon={Home} label="Feed" />
        <NavItem view="FRIENDS" icon={Users} label="Squad" />
        <NavItem view="MESSAGES" icon={MessageCircle} label="Chat" />
        <NavItem view="PROFILE" icon={UserIcon} label="Me" />
      </div>
    </div>
  );
};