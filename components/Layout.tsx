
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store';
import { UserRole } from '../types';
import { NAVIGATION_ITEMS } from '../constants';
import { LogOut, ChevronDown, User, Bell, Menu, X, Shield, Clock, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  activeView: string;
  setActiveView: (view: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeView, setActiveView, children }) => {
  const { currentUser, setRole, notifications, markNotificationRead, setSelectedRequestId, clearNotifications } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNav = NAVIGATION_ITEMS.filter(item => 
    item.roles.includes(currentUser.role)
  );

  const handleNavClick = (path: string) => {
    setActiveView(path);
    setSelectedRequestId(null);
    setIsMobileMenuOpen(false);
  };

  const handleRoleSwitch = (role: UserRole) => {
    setRole(role);
    setIsRoleMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleNotificationClick = (notification: any) => {
    markNotificationRead(notification.id);
    if (notification.action) {
      setActiveView(notification.action.view);
      if (notification.action.requestId) {
        setSelectedRequestId(notification.action.requestId);
      } else {
        setSelectedRequestId(null);
      }
    }
    setIsNotificationsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={14} className="text-emerald-500" />;
      case 'warning': return <AlertTriangle size={14} className="text-amber-500" />;
      case 'error': return <X size={14} className="text-rose-500" />;
      default: return <Info size={14} className="text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-x-hidden">
      {/* Desktop Sidebar (Left) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex-col shadow-2xl z-50">
        <div className="flex items-center space-x-3 px-6 py-8">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white italic">O</div>
          <span className="text-xl font-bold tracking-tight">OmniFlow</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {filteredNav.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeView === item.path 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 text-xs uppercase tracking-widest font-bold">
            System Health
          </div>
          <div className="px-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">Node Status</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-500 h-1.5 rounded-full w-4/5 transition-all duration-1000"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Right-Side Menu Drawer */}
      <div 
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div 
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <aside 
          className={`absolute inset-y-0 right-0 w-80 bg-slate-900 text-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between px-6 py-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white italic">O</div>
              <span className="text-xl font-bold tracking-tight">OmniFlow</span>
            </div>
            <button 
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="px-4 py-6">
              <p className="px-4 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Menu</p>
              <nav className="space-y-1">
                {filteredNav.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                      activeView === item.path 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="px-4 py-6 border-t border-slate-800/50 bg-slate-950/20">
              <p className="px-4 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                <Shield size={12} className="mr-2" />
                Simulate System Role
              </p>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(UserRole).map(role => (
                  <button
                    key={role}
                    onClick={() => handleRoleSwitch(role)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border ${
                      currentUser.role === role 
                        ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 font-bold' 
                        : 'bg-slate-800/30 border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <User size={16} />
                      <span>{role}</span>
                    </div>
                    {currentUser.role === role && (
                      <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-800 bg-slate-950/50">
             <div className="flex items-center space-x-4 mb-6">
                <div className="h-12 w-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg border border-indigo-400/30 shadow-inner">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 truncate">{currentUser.role} Account</p>
                </div>
             </div>
             <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-rose-600 hover:text-white transition-all font-bold border border-slate-700">
               <LogOut size={18} />
               <span>Sign Out</span>
             </button>
          </div>
        </aside>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Topbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center">
             <div className="lg:hidden flex items-center space-x-3 mr-4">
                <div className="w-7 h-7 bg-indigo-500 rounded flex items-center justify-center font-bold text-white italic text-sm">O</div>
                <span className="text-lg font-bold tracking-tight text-slate-900">OmniFlow</span>
             </div>
          </div>

          <div className="flex-1 max-w-xl mx-4 hidden sm:block">
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search workflows, requests..." 
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-slate-50/50"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Notification Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 transition-colors relative rounded-lg hover:bg-slate-100 ${isNotificationsOpen ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-rose-500 rounded-full border-2 border-white text-[8px] flex items-center justify-center font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl py-0 z-50 overflow-hidden"
                  >
                    <div className="px-5 py-4 bg-slate-900 flex items-center justify-between">
                      <h3 className="text-xs font-black text-white uppercase tracking-widest">System Alerts</h3>
                      <button onClick={clearNotifications} className="text-[10px] font-bold text-slate-400 hover:text-white uppercase transition-colors">Mark all read</button>
                    </div>
                    <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`w-full text-left p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 flex items-start space-x-4 ${n.read ? 'opacity-60' : 'bg-indigo-50/20'}`}
                          >
                            <div className={`mt-1 h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${n.read ? 'bg-slate-100' : 'bg-white shadow-sm ring-1 ring-slate-200'}`}>
                              {getNotificationIcon(n.type)}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-[10px] font-black uppercase tracking-tight ${n.read ? 'text-slate-400' : 'text-slate-900'}`}>{n.title}</span>
                                <span className="text-[9px] text-slate-400 flex items-center shrink-0">
                                  <Clock size={10} className="mr-1" /> Just now
                                </span>
                              </div>
                              <p className={`text-[11px] leading-relaxed line-clamp-2 ${n.read ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>{n.message}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="py-12 flex flex-col items-center justify-center opacity-30 text-center">
                          <Bell size={32} className="mb-3" />
                          <p className="text-[10px] font-black uppercase">No Alerts</p>
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-center">
                      <button onClick={() => setIsNotificationsOpen(false)} className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:text-indigo-800 transition-colors">Close Command Feed</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="h-8 w-px bg-slate-200 hidden xs:block"></div>

            {/* Desktop Role Switcher Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center space-x-3 p-1 pr-3 rounded-full hover:bg-slate-100 transition-colors group"
              >
                <div className="h-8 w-8 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-semibold text-xs border border-indigo-200 shadow-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden xs:block">
                  <p className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{currentUser.role}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isRoleMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-slate-100 mb-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Switch Simulator Role</p>
                  </div>
                  {Object.values(UserRole).map(role => (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className={`w-full flex items-center px-4 py-2 text-sm text-left transition-colors ${
                        currentUser.role === role ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <User size={14} className="mr-3" />
                      {role}
                    </button>
                  ))}
                  <div className="h-px bg-slate-100 my-2"></div>
                  <button className="w-full flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium">
                    <LogOut size={14} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button 
              className="lg:hidden p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors ring-1 ring-slate-200 shadow-sm"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
