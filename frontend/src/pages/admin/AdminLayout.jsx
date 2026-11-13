import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  BookOpen,
  FolderTree,
  ImagePlus,
  Library,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  KeyRound,
  Mail,
  Lock,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

// Robust Error Boundary to prevent any blank white screen in Admin
class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Admin Render Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white p-8 rounded-3xl border border-rose-200 text-center space-y-4 max-w-xl mx-auto my-12 shadow-sm font-sans">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto font-black text-xl">
            !
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">Unable to load this section</h3>
          <p className="text-xs text-rose-700 font-mono bg-rose-50 p-3 rounded-xl border border-rose-200 text-left overflow-x-auto">
            {this.state.error?.message || 'Unexpected application error'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-5 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-red-700 cursor-pointer"
          >
            Reload Section
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AdminLayout() {
  const { user, logout, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const mainRef = useRef(null);

  // Quick Password & Profile Edit Modal state
  const [isQuickProfileOpen, setIsQuickProfileOpen] = useState(false);
  const [quickForm, setQuickForm] = useState({
    name: '',
    email: '',
    password: '',
    currentPassword: '',
  });
  const [quickShowPassword, setQuickShowPassword] = useState(false);
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickMsg, setQuickMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Profits', path: '/admin/profits', icon: TrendingUp },
    { label: 'Products', path: '/admin/products', icon: BookOpen },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Publications', path: '/admin/publications', icon: Library },
    { label: 'Home & Banners', path: '/admin/banners', icon: Sparkles },
    { label: 'Admins & Staff', path: '/admin/admins', icon: ShieldCheck },
  ];

  // Open Quick Modal
  const handleOpenQuickModal = () => {
    setQuickForm({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      currentPassword: '',
    });
    setQuickMsg({ text: '', type: '' });
    setQuickShowPassword(false);
    setIsQuickProfileOpen(true);
  };

  // Submit Quick Profile & Password Update
  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    setQuickSubmitting(true);
    setQuickMsg({ text: '', type: '' });
    try {
      const res = await updateProfile({
        name: quickForm.name,
        email: quickForm.email,
        password: quickForm.password || undefined,
        currentPassword: quickForm.currentPassword || undefined,
      });

      if (res.success) {
        setQuickMsg({ text: 'Admin credentials & password updated successfully!', type: 'success' });
        setTimeout(() => {
          setIsQuickProfileOpen(false);
        }, 1500);
      } else {
        setQuickMsg({ text: res.message || 'Failed to update credentials.', type: 'error' });
      }
    } catch (err) {
      setQuickMsg({ text: err.response?.data?.message || 'Error updating credentials.', type: 'error' });
    } finally {
      setQuickSubmitting(false);
    }
  };

  // Helper renderer for sidebar navigation
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      {/* Top Header & Navigation */}
      <div className="flex flex-col flex-1 min-h-0">
        
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md shadow-black/40">
              <img
                src="/images/ebook_logo.png"
                alt="Sri Chaitanya"
                className="w-full h-full object-contain drop-shadow-xs"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full rounded-lg bg-red-600 items-center justify-center text-white font-black text-xs">
                SC
              </div>
            </div>
            <div>
              <h1 className="text-white font-black text-sm sm:text-base leading-tight tracking-tight">Sri Chaitanya</h1>
              <p className="text-[10px] text-red-400 font-extrabold uppercase tracking-wider">Admin Portal</p>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= ACTIVE ADMIN DETAILS CAPSULE ================= */}
        <div className="p-3 mx-3 my-2.5 bg-slate-800/80 rounded-2xl border border-slate-700/70 shadow-sm shrink-0 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white font-black text-xs shadow-xs shrink-0 border border-white/20">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate leading-tight">{user?.name || 'Administrator'}</p>
                <p className="text-[10.5px] font-mono text-slate-400 truncate leading-tight mt-0.5">
                  {user?.email || 'admin@gmail.com'}
                </p>
              </div>
            </div>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded-md border border-emerald-500/30 tracking-wider shrink-0">
              ADMIN
            </span>
          </div>

          {/* Quick Edit My Password / Profile Trigger */}
          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
            <button
              onClick={handleOpenQuickModal}
              className="text-slate-300 hover:text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer group"
              title="Click to edit admin email or change password"
            >
              <KeyRound className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
              <span className="group-hover:underline">Edit Password</span>
            </button>
            <NavLink
              to="/admin/admins"
              onClick={() => setMobileSidebarOpen(false)}
              className="text-[10px] text-slate-400 hover:text-red-400 font-medium transition-colors"
            >
              All Admins &rarr;
            </NavLink>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md shadow-red-500/25'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* FIXED BOTTOM ACTIONS: Sign Out & Storefront link */}
      <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-950/70 space-y-1.5">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-red-400" />
            <span>View Storefront</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Live &rarr;</span>
        </a>

        {/* Sign Out Button firmly fixed at the bottom */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 hover:text-rose-200 border border-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-100 font-sans">
      
      {/* 1. DESKTOP FIXED STICKY SIDEBAR (Never moves / scrolls away) */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col h-full shrink-0 border-r border-slate-800 z-30 select-none">
        {renderSidebarContent()}
      </aside>

      {/* 2. MOBILE SLIDE-IN SIDEBAR DRAWER */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-slate-300 flex flex-col h-full z-50 shadow-2xl animate-in slide-in-from-left duration-200">
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* 3. MAIN RIGHT CONTENT CONTAINER (Header Sticky + Body Scrollable) */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {/* STICKY TOP ADMIN HEADER BAR (Always Stays Fixed on Top) */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 shadow-2xs">
          
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile Drawer */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200/80 cursor-pointer"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight leading-none">
                  Sri Chaitanya Administration
                </h2>
                <p className="text-[10px] text-slate-500 mt-0.5">Control Panel & Inventory</p>
              </div>
            </div>
          </div>

          {/* Right Header Admin Profile & Actions */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-red-600" />
              <span>Live Storefront</span>
            </a>

            {/* Profile Button with Quick Click to Manage Admins / Change Password */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <button
                onClick={handleOpenQuickModal}
                className="flex items-center gap-2 text-left hover:opacity-85 transition-opacity cursor-pointer group"
                title="Click to view/edit administrator credentials"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-rose-600 text-white font-black text-xs flex items-center justify-center border border-white/20 shadow-xs group-hover:scale-105 transition-transform">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-red-600 transition-colors">
                    {user?.name || 'Admin'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono leading-none">
                    {user?.email || 'admin@gmail.com'}
                  </p>
                </div>
              </button>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

        </header>

        {/* SCROLLABLE MAIN VIEWPORT (Only this area scrolls!) */}
        <main ref={mainRef} data-scroll-container="true" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/80">
          <AdminErrorBoundary>
            <Outlet />
          </AdminErrorBoundary>
        </main>
      </div>

      {/* ================= QUICK ADMIN PROFILE & PASSWORD MODAL (Accessible from any page!) ================= */}
      {isQuickProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shadow-xs">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Edit Admin Credentials</h3>
                  <p className="text-xs text-slate-400">Change your administrator email & password</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuickProfileOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {quickMsg.text && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                quickMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {quickMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>{quickMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleQuickSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Administrator Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={quickForm.name}
                    onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={quickForm.email}
                    onChange={(e) => setQuickForm({ ...quickForm, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      New Password (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => setQuickShowPassword(!quickShowPassword)}
                      className="text-[11px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                    >
                      {quickShowPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{quickShowPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={quickShowPassword ? 'text' : 'password'}
                      placeholder="Leave blank to keep current password"
                      value={quickForm.password}
                      onChange={(e) => setQuickForm({ ...quickForm, password: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Leave blank if you only want to change your name or email.
                  </p>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <Link
                  to="/admin/admins"
                  onClick={() => setIsQuickProfileOpen(false)}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Manage All Admins &rarr;
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsQuickProfileOpen(false)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={quickSubmitting}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-xs shadow-md shadow-red-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {quickSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
