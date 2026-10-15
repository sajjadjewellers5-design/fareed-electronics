import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  KeyRound,
  LogIn,
  CheckCircle2,
  Mail,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';

export const LoginScreen: React.FC = () => {
  const { login, users, companyProfile } = useApp();

  const [username, setUsername] = useState('bhattijee695@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(username.trim(), password);
      setIsLoading(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Invalid username or password. Please try again.');
      }
    }, 250);
  };

  const handleQuickFill = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Tech Glow & Grid Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-block p-1 rounded-2xl bg-gradient-to-b from-cyan-500/20 to-transparent border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.2)]">
            <BrandLogo
              customLogoUrl={companyProfile.logoUrl}
              size="xl"
              showSubtitle={true}
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-lg font-bold text-white tracking-wide uppercase flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Accounting &amp; Lab ERP Portal</span>
            </h1>
            <p className="text-xs text-slate-400">
              Enter authorized operator credentials to access financial books &amp; inventory
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-75" />

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Failed</p>
                <p className="text-[11px] text-rose-300/80">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Login Mode Selector: Email vs Username */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-4">
            <button
              type="button"
              onClick={() => {
                setUsername('bhattijee695@gmail.com');
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                username.includes('@')
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Login (ای میل لاگ ان)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUsername('admin');
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                !username.includes('@')
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Username Login (یوزر نام)</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4.5">
            {/* Username or Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {username.includes('@') ? 'Account Email Address (ای میل پتہ)' : 'Operator Username (یوزر نام)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  {username.includes('@') ? <Mail className="w-4 h-4 text-cyan-400" /> : <User className="w-4 h-4" />}
                </div>
                <input
                  type={username.includes('@') ? 'email' : 'text'}
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={username.includes('@') ? 'bhattijee695@gmail.com or admin@fareedelectronics.pk' : 'admin, cashier, or labtech'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs font-medium placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  Secret Password
                </label>
                <span className="text-[10px] text-cyan-400 font-mono">Security Encrypted</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs font-medium placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
                />
                <span>Remember session on this device</span>
              </label>

              <span className="text-[11px] text-slate-500">Default: password123</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating Operator...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Unlock Software Access</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Authorized Login Options:</span>
              </span>
              <span className="text-[10px] text-slate-500">Click to autofill</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('bhattijee695@gmail.com', 'password123')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-cyan-500/40 text-left transition-all cursor-pointer group col-span-2 flex items-center justify-between"
              >
                <div>
                  <div className="text-[11px] font-black text-cyan-300 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-cyan-400" />
                    <span>My Email Login (Owner / Super Admin)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">bhattijee695@gmail.com</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  Owner
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'password123')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-left transition-all cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-cyan-300 group-hover:text-cyan-200">Admin User</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">admin</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('cashier', 'password123')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 text-left transition-all cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-emerald-300 group-hover:text-emerald-200">Cashier / POS</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">cashier</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-4">
          <span>{companyProfile.name}</span>
          <span>•</span>
          <span>{companyProfile.ntn}</span>
          <span>•</span>
          <span>Security Protected</span>
        </div>
      </div>
    </div>
  );
};
