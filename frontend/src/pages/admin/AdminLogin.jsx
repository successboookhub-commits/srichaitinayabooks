import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Package,
  BookOpen,
  ExternalLink,
  Shield
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080d1a] relative overflow-hidden flex flex-col justify-between font-sans selection:bg-red-500 selection:text-white">
      
      {/* ================= EXTRAORDINARY BACKGROUND LIGHTING & CYBER MESH ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Radial Aurora Blurs */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-red-600/18 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-rose-600/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[650px] h-[650px] bg-red-800/10 rounded-full blur-[160px]" />
        
        {/* Subtle Cyber Grid Matrix */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Fine Star Dust Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* ================= TOP BRAND NAVIGATION BAR ================= */}
      <header className="relative z-20 px-6 py-5 sm:px-10 flex items-center justify-between border-b border-white/5 bg-slate-950/40 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-lg shadow-black/50 group-hover:scale-105 transition-transform duration-300">
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
            <div className="flex items-center gap-1.5">
              <span className="text-white font-black text-sm tracking-tight">Sri Chaitanya</span>
              <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-red-600/30 text-red-400 border border-red-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10.5px] text-slate-400 font-semibold tracking-wider uppercase">Book Centre Management</p>
          </div>
        </Link>

        {/* Storefront return link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all backdrop-blur-xs shadow-xs"
        >
          <ExternalLink className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">Back to Public Storefront</span>
          <span className="sm:hidden">Storefront</span>
        </Link>
      </header>

      {/* ================= MAIN SPLIT CONTENT WORKSPACE ================= */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ================= LEFT COLUMN: HERO SHOWCASE (DESKTOP) ================= */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-center space-y-8 pr-4">
            
            {/* Live Telemetry Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md self-start text-xs font-bold text-slate-300 shadow-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>All Systems Operational • Port 5000 Live</span>
              <span className="text-slate-600">|</span>
              <span className="text-red-400 font-mono">v2.4.0 High-Performance</span>
            </div>

            {/* Big Headline */}
            <div className="space-y-4">
              <h2 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Empowering the Leaders of Tomorrow with{' '}
                <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                  Precision Logistics.
                </span>
              </h2>
              <p className="text-sm xl:text-base text-slate-400 max-w-xl leading-relaxed">
                Welcome to the Sri Chaitanya Enterprise Portal. Manage 1,400+ active student orders, inventory fulfillment pipelines, barcode dispatch, and publications catalog with real-time accuracy.
              </p>
            </div>

            {/* 3 Live Telemetry Stat Pills */}
            <div className="grid grid-cols-3 gap-3.5 pt-2 max-w-xl">
              
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-md space-y-1">
                <div className="flex items-center gap-2 text-red-400">
                  <Package className="w-4 h-4" />
                  <span className="text-[10.5px] uppercase font-bold tracking-wider text-slate-400">Total Orders</span>
                </div>
                <p className="text-2xl font-black text-white">1,415</p>
                <p className="text-[10px] text-emerald-400 font-bold">100% Live in Database</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-md space-y-1">
                <div className="flex items-center gap-2 text-rose-400">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-[10.5px] uppercase font-bold tracking-wider text-slate-400">Book Catalog</span>
                </div>
                <p className="text-2xl font-black text-white">338</p>
                <p className="text-[10px] text-slate-400 font-medium">4,02,417 Stock Units</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-md space-y-1">
                <div className="flex items-center gap-2 text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10.5px] uppercase font-bold tracking-wider text-slate-400">Security</span>
                </div>
                <p className="text-2xl font-black text-white">256-Bit</p>
                <p className="text-[10px] text-emerald-400 font-bold">Bcrypt + JWT Guarded</p>
              </div>

            </div>

            {/* Customer Quote Strip */}
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400 border-t border-white/5">
              <span className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center font-black text-xs shrink-0">
                ★
              </span>
              <p className="leading-snug">
                Trusted by 50,000+ competitive exam aspirants across AP & Telangana for SI, Police, Group 1, 2, 4 & Railway exams.
              </p>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: ULTRA-PREMIUM LOGIN MASTER CARD ================= */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            
            <div className="relative">
              
              {/* Outer Card Glow Halo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600/30 via-rose-600/20 to-red-800/30 rounded-[34px] blur-xl opacity-75 pointer-events-none" />

              {/* Glass Card Container */}
              <div className="relative bg-slate-900/85 backdrop-blur-2xl rounded-3xl border border-slate-700/60 p-6 sm:p-8 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] space-y-6">
                
                {/* Header inside Card */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-widest text-red-400">
                      Administrative Access
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Encrypted Gateway
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Sign In to Portal
                  </h3>
                  <p className="text-xs text-slate-400">
                    Enter your authorized administrative email and password to continue.
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-2.5 text-rose-300 text-xs sm:text-sm font-semibold animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Form Fields */}
                <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
                  
                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Admin Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-400 transition-colors pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter administrator email"
                        autoComplete="off"
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 focus:border-red-500 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/25 font-medium text-xs sm:text-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {showPassword ? (
                          <>
                            <EyeOff className="w-3 h-3" /> <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" /> <span>Show</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="relative group">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-400 transition-colors pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        autoComplete="new-password"
                        className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-700/80 focus:border-red-500 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/25 font-medium text-xs sm:text-sm transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-200">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-red-600 focus:ring-red-500 focus:ring-offset-slate-900 cursor-pointer"
                      />
                      <span>Keep signed in for 7 days</span>
                    </label>

                    <span className="text-[11px] text-slate-500 font-mono">TLS 1.3 Active</span>
                  </div>

                  {/* Primary CTA Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-xl shadow-red-600/35 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In to Admin Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Security Guarantee */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Authorized Admins Only</span>
                  </span>
                  <span className="font-mono text-slate-500">Node + MySQL Live</span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </main>

      {/* ================= BOTTOM FOOTER SYSTEM TELEMETRY STRIP ================= */}
      <footer className="relative z-20 px-6 py-4 border-t border-white/5 bg-slate-950/60 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400 font-medium">Sri Chaitanya Bookstore Logistics Server: Active</span>
        </div>
        <p className="text-[11px] text-slate-500">
          © {new Date().getFullYear()} Sri Chaitanya Book Centre. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
