import React, { useEffect, useState } from 'react';
import { FareedElectronicsBadge } from './BrandLogo';
import { Sparkles, ArrowRight, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

interface StartupSplashScreenProps {
  onComplete: () => void;
  durationSeconds?: number;
}

export const StartupSplashScreen: React.FC<StartupSplashScreenProps> = ({
  onComplete,
  durationSeconds = 10,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(durationSeconds);
  const [progress, setProgress] = useState<number>(0);
  const [currentStepText, setCurrentStepText] = useState('Initializing Core Accounting System...');

  useEffect(() => {
    const startTime = Date.now();
    const totalMs = durationSeconds * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / totalMs) * 100);
      const remainingSec = Math.max(0, Math.ceil((totalMs - elapsed) / 1000));

      setProgress(pct);
      setSecondsRemaining(remainingSec);

      // Step text sequence over 10 seconds
      if (pct < 25) {
        setCurrentStepText('Initializing 2026 Fareed Electronics Core Database...');
      } else if (pct < 50) {
        setCurrentStepText('Loading All-Size Tag Printing & Barcode Scanner Engine...');
      } else if (pct < 75) {
        setCurrentStepText('Verifying Pieces Stock Inventory & Adjustment Ledgers...');
      } else if (pct < 95) {
        setCurrentStepText('Configuring Printer Selection & Fast Sale Invoicing...');
      } else {
        setCurrentStepText('Welcome to Fareed Electronics Accounting System!');
      }

      if (elapsed >= totalMs) {
        clearInterval(interval);
        onComplete();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [durationSeconds, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      {/* Dynamic Animated Cyan Aura & Particle Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,174,239,0.22),transparent_70%)] pointer-events-none animate-pulse" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-bounce" style={{ animationDuration: '7s' }} />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-bounce" style={{ animationDuration: '9s' }} />

      {/* Main 10-Second Showcase Card */}
      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center space-y-6">
        
        {/* GIF-Style Central Animated Medallion Container */}
        <div className="relative flex items-center justify-center">
          {/* Outer Rotating Energy Ring */}
          <div
            className="absolute -inset-6 rounded-full border-2 border-dashed border-[#00aeef]/60 animate-spin"
            style={{ animationDuration: '12s' }}
          />

          {/* Reverse Rotating Counter Ring */}
          <div
            className="absolute -inset-10 rounded-full border border-cyan-400/30 animate-spin"
            style={{ animationDuration: '18s', animationDirection: 'reverse' }}
          />

          {/* Hologram Pulse Backdrop */}
          <div className="absolute inset-0 rounded-full bg-[#00aeef]/20 filter blur-xl animate-ping" style={{ animationDuration: '3s' }} />

          {/* Official Fareed Electronics Badge - Transparent Background */}
          <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
            <FareedElectronicsBadge
              size={180}
              animated={true}
              className="drop-shadow-[0_0_35px_rgba(0,174,239,0.85)]"
            />
          </div>
        </div>

        {/* Brand Titles */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase shadow-inner">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            <span>2026 OFFICIAL ENTERPRISE EDITION</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-sans font-black tracking-wide text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            FAREED ELECTRONICS
          </h1>
          <p className="text-sm font-mono tracking-wider text-cyan-400 font-bold uppercase">
            ACCOUNTING &amp; INVENTORY ERP SYSTEM
          </p>
        </div>

        {/* 10-Second Dynamic Progress Bar & Countdown */}
        <div className="w-full max-w-sm space-y-2 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#00aeef] animate-ping" />
              {currentStepText}
            </span>
            <span className="text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
              {secondsRemaining}s remaining
            </span>
          </div>

          {/* Progress fill bar */}
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-700/60 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-[#00aeef] to-blue-500 rounded-full transition-all duration-150 shadow-[0_0_12px_rgba(0,174,239,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Starting Software (10s Splash)...</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Skip / Enter Now Button */}
        <div className="pt-2">
          <button
            onClick={onComplete}
            type="button"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-cyan-950 hover:to-slate-900 text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-400 font-semibold text-sm shadow-lg transition-all transform hover:scale-105 cursor-pointer"
          >
            <span>Skip Intro &amp; Enter (داخل ہوں)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
