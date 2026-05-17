/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Crosshair, 
  Target, 
  BarChart3, 
  Settings, 
  ChevronRight, 
  RefreshCcw,
  Monitor,
  Flame,
  Info,
  ExternalLink,
  Lock,
  Ghost
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Loadout {
  weapon: string;
  type: string;
  attachments: string[];
  description: string;
}

interface OptSetting {
  category: string;
  setting: string;
  value: string;
  impact: string;
}

interface OptResponse {
  settings: OptSetting[];
  proTip: string;
}

// --- Components ---

const MetricsPanel = () => {
  const [metrics, setMetrics] = useState({
    cpu: 45,
    gpu: 62,
    ram: 12.4,
    ping: 28,
    fps: 144
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.floor(40 + Math.random() * 15),
        gpu: Math.floor(60 + Math.random() * 10),
        ram: parseFloat((12.1 + Math.random() * 0.5).toFixed(1)),
        ping: Math.floor(24 + Math.random() * 8),
        fps: Math.floor(138 + Math.random() * 12)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 border-b border-tactical-border bg-tactical-card/50">
      <MetricItem icon={<Cpu size={16} />} label="CPU LOAD" value={`${metrics.cpu}%`} color="text-tactical-green" />
      <MetricItem icon={<Zap size={16} />} label="GPU LOAD" value={`${metrics.gpu}%`} color="text-tactical-green" />
      <MetricItem icon={<Activity size={16} />} label="MEM UTIL" value={`${metrics.ram} GB`} color="text-tactical-green" />
      <MetricItem icon={<Target size={16} />} label="LATENCY" value={`${metrics.ping} MS`} color="text-tactical-orange" />
      <MetricItem icon={<BarChart3 size={16} />} label="STABLE FPS" value={metrics.fps} color="text-tactical-green" />
    </div>
  );
};

const MetricItem = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5 opacity-50">
      {icon}
      <span className="text-[10px] font-mono tracking-tighter uppercase">{label}</span>
    </div>
    <span className={`text-xl font-mono font-bold ${color}`}>{value}</span>
  </div>
);

const CrosshairPreview = () => {
  const [size, setSize] = useState(10);
  const [gap, setGap] = useState(4);
  const [thickness, setThickness] = useState(2);
  const [color, setColor] = useState('#00ff41');

  return (
    <div className="bg-tactical-card border border-tactical-border rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Crosshair className="text-tactical-green" size={20} />
        <h2 className="font-mono text-sm font-bold tracking-widest uppercase">Crosshair Lab</h2>
      </div>

      <div className="relative aspect-video bg-black rounded border border-tactical-border flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 tactical-grid opacity-20" />
        {/* The Crosshair */}
        <div className="relative pointer-events-none">
          {/* Vertical */}
          <div style={{ backgroundColor: color, height: size, width: thickness, bottom: gap }} className="absolute -translate-x-1/2" />
          <div style={{ backgroundColor: color, height: size, width: thickness, top: gap }} className="absolute -translate-x-1/2" />
          {/* Horizontal */}
          <div style={{ backgroundColor: color, width: size, height: thickness, right: gap }} className="absolute -translate-y-1/2" />
          <div style={{ backgroundColor: color, width: size, height: thickness, left: gap }} className="absolute -translate-y-1/2" />
          {/* Dot */}
          <div style={{ backgroundColor: color, width: thickness, height: thickness }} className="absolute -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="space-y-4 font-mono text-[11px]">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="opacity-50">SIZE: {size}PX</label>
            <input type="range" min="2" max="30" value={size} onChange={e => setSize(Number(e.target.value))} className="w-full accent-tactical-green" />
          </div>
          <div className="space-y-2">
            <label className="opacity-50">GAP: {gap}PX</label>
            <input type="range" min="0" max="20" value={gap} onChange={e => setGap(Number(e.target.value))} className="w-full accent-tactical-green" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="opacity-50">THICKNESS: {thickness}PX</label>
            <input type="range" min="1" max="5" value={thickness} onChange={e => setThickness(Number(e.target.value))} className="w-full accent-tactical-green" />
          </div>
          <div className="space-y-2">
            <label className="opacity-50">TINT</label>
            <div className="flex gap-2">
              {['#00ff41', '#ff6600', '#00ffff', '#ffffff'].map(c => (
                <button 
                  key={c} 
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border border-tactical-border ${color === c ? 'ring-2 ring-white/50' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadoutsSection = () => {
  const [loadouts, setLoadouts] = useState<Loadout[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLoadouts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/loadouts', { method: 'POST' });
      const data = await res.json();
      setLoadouts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoadouts();
  }, []);

  return (
    <div className="bg-tactical-card border border-tactical-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Flame className="text-tactical-orange" size={20} />
          <h2 className="font-mono text-sm font-bold tracking-widest uppercase">Tactical Loadouts</h2>
        </div>
        <button 
          onClick={fetchLoadouts}
          disabled={loading}
          className="p-2 hover:bg-tactical-border rounded transition-colors disabled:opacity-50"
        >
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-tactical-border/30 animate-pulse rounded border border-tactical-border" />
          ))
        ) : (
          loadouts.map((l, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 border border-tactical-border bg-tactical-bg rounded hover:border-tactical-orange/50 transition-colors group"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg leading-tight uppercase">{l.weapon}</h3>
                  <span className="text-[10px] font-mono text-tactical-orange">{l.type}</span>
                </div>
                <Ghost size={16} className="opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {l.attachments.map((a, j) => (
                  <span key={j} className="text-[9px] font-mono bg-tactical-card px-2 py-0.5 border border-tactical-border uppercase">
                    {a}
                  </span>
                ))}
              </div>
              <p className="text-xs text-white/60 leading-relaxed italic">"{l.description}"</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

const OptimizationPanel = () => {
  const [hardware, setHardware] = useState('');
  const [targetFPS, setTargetFPS] = useState('144');
  const [result, setResult] = useState<OptResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hardware) return;
    setLoading(true);
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hardware, targetFPS })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-tactical-card border border-tactical-border rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 text-tactical-green">
        <Monitor size={20} />
        <h2 className="font-mono text-sm font-bold tracking-widest uppercase">System Optimizer</h2>
      </div>

      <form onSubmit={handleOptimize} className="space-y-4 mb-6">
        <div>
          <label className="block text-[10px] font-mono uppercase opacity-50 mb-1">Hardware Interface (e.g. RTX 3080, i9-12900K)</label>
          <input 
            type="text" 
            value={hardware}
            onChange={e => setHardware(e.target.value)}
            placeholder="DETECTING..."
            className="w-full bg-tactical-bg border border-tactical-border rounded px-3 py-2 font-mono text-sm focus:outline-none focus:border-tactical-green disabled:opacity-50"
            disabled={loading}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-[10px] font-mono uppercase opacity-50 mb-1">Target Frequency (FPS)</label>
            <select 
              value={targetFPS}
              onChange={e => setTargetFPS(e.target.value)}
              className="w-full bg-tactical-bg border border-tactical-border rounded px-3 py-2 font-mono text-sm focus:outline-none"
              disabled={loading}
            >
              <option value="60">60 FPS</option>
              <option value="144">144 FPS</option>
              <option value="240">240 FPS</option>
              <option value="MAX">UNLIMITED</option>
            </select>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="self-end px-6 py-2 bg-tactical-green text-black font-bold uppercase tracking-tighter text-sm flex items-center gap-2 rounded disabled:opacity-50 h-[38px]"
            disabled={loading || !hardware}
          >
            {loading ? <RefreshCcw size={16} className="animate-spin" /> : <Zap size={16} />}
            ANALYZE
          </motion.button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {!result && !loading && (
          <div className="flex flex-col items-center justify-center h-full opacity-20 py-12">
            <Activity size={48} className="mb-4" />
            <p className="font-mono text-xs uppercase tracking-widest">Waiting for hardware telemetry...</p>
          </div>
        )}

        {loading && (
          <div className="space-y-3">
             <div className="h-4 bg-tactical-border/30 rounded w-1/3 animate-pulse" />
             <div className="h-20 bg-tactical-border/30 rounded animate-pulse" />
             <div className="h-4 bg-tactical-border/30 rounded w-1/4 animate-pulse" />
             <div className="h-20 bg-tactical-border/30 rounded animate-pulse" />
          </div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="p-3 border border-tactical-green/30 bg-tactical-green/5 rounded flex gap-3">
              <Info size={16} className="text-tactical-green shrink-0 mt-0.5" />
              <p className="text-xs text-tactical-green leading-relaxed uppercase font-bold italic">{result.proTip}</p>
            </div>
            
            <div className="space-y-2">
              <div className="grid grid-cols-4 px-2 text-[9px] font-mono uppercase opacity-40">
                <span className="col-span-1">CATEGORY</span>
                <span className="col-span-1">SETTING</span>
                <span className="col-span-1">VALUE</span>
                <span className="col-span-1 text-right">IMPACT</span>
              </div>
              {result.settings.map((s, i) => (
                <div key={i} className="grid grid-cols-4 p-2 bg-tactical-bg border border-tactical-border text-xs font-mono uppercase">
                   <span className="text-tactical-orange">{s.category}</span>
                   <span className="opacity-80 truncate">{s.setting}</span>
                   <span className="text-tactical-green truncate">{s.value}</span>
                   <span className="text-right opacity-50">{s.impact}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostComplete, setBoostComplete] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert("App is already installed or your browser doesn't support PWA installation yet.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  const startBoost = () => {
    setIsBoosting(true);
    setBoostComplete(false);
    setTimeout(() => {
      setIsBoosting(false);
      setBoostComplete(true);
      setTimeout(() => setBoostComplete(false), 3000);
    }, 4000);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-tactical-green selection:text-black">
      <div className="scanline" />
      
      {/* Header */}
      <header className="border-b border-tactical-border backdrop-blur-md sticky top-0 z-50 bg-tactical-bg/80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-tactical-green p-1.5 rounded-sm">
                <ShieldCheck size={24} className="text-black" strokeWidth={3} />
            </div>
            <div>
              <h1 className="font-mono text-xl font-bold tracking-tighter leading-none italic uppercase">STRIKEFORCE</h1>
              <span className="text-[10px] font-mono tracking-widest text-tactical-green uppercase opacity-70">BOOSTER V4.2.1</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono font-bold tracking-widest uppercase">
              <a href="#" className="flex items-center gap-1.5 text-tactical-green hover:opacity-100 transition-opacity">
                DASHBOARD
              </a>
              <button 
                onClick={handleInstall}
                className={`flex items-center gap-1.5 transition-opacity ${deferredPrompt ? 'text-tactical-orange animate-pulse' : 'opacity-40 hover:opacity-100'}`}
              >
                INSTALL APP
              </button>
              <a href="#apk-guide" className="flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
                APK BUILDER
              </a>
            </nav>
            
            <motion.button 
              onClick={startBoost}
              disabled={isBoosting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-2 rounded-full font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-2 ${
                isBoosting 
                  ? 'bg-tactical-orange animate-pulse' 
                  : boostComplete 
                  ? 'bg-white text-black' 
                  : 'bg-tactical-green text-black neon-glow'
              }`}
            >
              {isBoosting ? <Settings size={18} className="animate-spin" /> : <Zap size={18} />}
              {isBoosting ? 'BOOSTING...' : boostComplete ? 'OPTIMIZED' : 'SYSTEM BOOST'}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Stats */}
      <MetricsPanel />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 tactical-grid relative">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-tactical-bg via-transparent to-transparent opacity-60" />

        {/* Global Warning / Info Bar */}
        <div className="lg:col-span-12">
          <div className="bg-tactical-orange/10 border-l-4 border-tactical-orange p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="text-tactical-orange" />
              <div>
                <p className="text-xs font-bold uppercase tracking-tighter">Season 2 Meta Update Detected</p>
                <p className="text-[10px] opacity-60 uppercase font-mono">Recommend updating loadouts for high-velocity engagement.</p>
              </div>
            </div>
            <button className="text-[10px] font-mono font-bold uppercase bg-tactical-orange/20 px-3 py-1 text-tactical-orange hover:bg-tactical-orange hover:text-black transition-colors rounded">
              UPDATE NOW
            </button>
          </div>
        </div>

        {/* Left Column - Meta & Labs */}
        <div className="lg:col-span-4 space-y-8 z-10">
          <LoadoutsSection />
          <CrosshairPreview />
        </div>

        {/* Center / Right Column - Optimization */}
        <div className="lg:col-span-8 space-y-8 z-10">
          <OptimizationPanel />
          
          <div id="apk-guide" className="bg-tactical-card border border-tactical-border rounded-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
               <div className="flex gap-1">
                 <div className="w-1 h-1 bg-tactical-green rounded-full animate-ping" />
                 <div className="w-1 h-1 bg-tactical-green rounded-full opacity-50" />
               </div>
            </div>

            <div className="flex items-center gap-2 mb-6 text-tactical-green">
              <Cpu size={20} />
              <h2 className="font-mono text-sm font-bold tracking-widest uppercase">One-Click Android Build System</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-mono text-tactical-green mb-4 uppercase tracking-widest">System Integrated: Capacitor + GitHub Actions</p>
                
                <div className="flex items-start gap-4 p-3 bg-tactical-bg border border-tactical-border hover:border-tactical-green/30 transition-all group">
                  <div className="bg-tactical-green text-black w-8 h-8 rounded flex items-center justify-center shrink-0 text-sm font-black italic">01</div>
                  <div>
                    <h4 className="text-xs font-bold uppercase mb-1">Push to GitHub</h4>
                    <p className="text-[10px] opacity-60 leading-normal">Click 'Export to GitHub' in the AI Studio menu. This pushes your code to a private or public repo.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 bg-tactical-bg border border-tactical-border hover:border-tactical-green/30 transition-all">
                  <div className="bg-tactical-green text-black w-8 h-8 rounded flex items-center justify-center shrink-0 text-sm font-black italic">02</div>
                  <div>
                    <h4 className="text-xs font-bold uppercase mb-1">Auto-Compiler Triggers</h4>
                    <p className="text-[10px] opacity-60 leading-normal">The integrated GitHub Action (android_build.yml) detects the code and automatically starts a native Android build on the cloud.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 bg-tactical-bg border border-tactical-border hover:border-tactical-green/30 transition-all">
                  <div className="bg-tactical-green text-black w-8 h-8 rounded flex items-center justify-center shrink-0 text-sm font-black italic">03</div>
                  <div>
                    <h4 className="text-xs font-bold uppercase mb-1">Download APK</h4>
                    <p className="text-[10px] opacity-60 leading-normal">Go to the 'Actions' tab on GitHub. Once complete (approx 3-5 mins), download the compiled APK from the 'Artifacts' section.</p>
                  </div>
                </div>
              </div>
              
              <div className="border border-dashed border-tactical-border rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4 bg-tactical-green/5">
                <div className="bg-tactical-green/20 p-4 rounded-full">
                  <Zap className="text-tactical-green" size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase">Cloud-Compiling Ready</h3>
                  <p className="text-[10px] opacity-60 mt-2 font-mono max-w-[200px] mx-auto">
                    Integrated Capacitor Bridge: v7.0.1<br/>
                    Build Target: Android API 34<br/>
                    Automation: GitHub Actions CI/CD
                  </p>
                </div>
                <div className="w-full h-[1px] bg-tactical-border" />
                <button className="text-[10px] font-mono font-bold text-tactical-green border border-tactical-green px-4 py-2 hover:bg-tactical-green hover:text-black transition-all uppercase tracking-widest">
                  View Source Manifest
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-tactical-border py-6 bg-tactical-card/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[10px] font-mono opacity-40 uppercase">
             <span>© 2026 StrikeForce Systems</span>
             <span className="hidden md:inline">|</span>
             <span className="flex items-center gap-1"><ShieldCheck size={10} /> Kernel Sec Enabled</span>
             <span className="hidden md:inline">|</span>
             <span className="flex items-center gap-1 hover:text-tactical-green cursor-help">DOCS <ExternalLink size={10} /></span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-tactical-green animate-pulse" />
              <span className="text-[10px] font-mono opacity-70 uppercase tracking-widest">SERVER STATUS: NORM</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-tactical-green" />
              <span className="text-[10px] font-mono opacity-70 uppercase tracking-widest">DRIVERS: CURRENT</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Boosting Overlay */}
      <AnimatePresence>
        {isBoosting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center flex-col text-center"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-12"
            >
              <div className="w-32 h-32 border-4 border-tactical-green/20 rounded-full animate-ping absolute inset-0" />
              <div className="w-32 h-32 border-4 border-tactical-green rounded-full border-t-transparent animate-spin" />
              <ShieldCheck size={48} className="absolute inset-0 m-auto text-tactical-green" />
            </motion.div>
            
            <h2 className="text-4xl font-bold italic uppercase tracking-tighter mb-2">Striking System</h2>
            <div className="font-mono text-tactical-green text-sm flex gap-2 items-center">
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {">"}
              </motion.span>
              <TypeWriter text="ALLOCATING CORE RESOURCES... OPTIMIZING MEMORY HEIRARCHY... BYPASSING LATENCY THROTTLES..." />
            </div>
            
            <div className="mt-12 w-64 h-1 bg-tactical-border rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 4 }}
                 className="h-full bg-tactical-green neon-glow"
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TypeWriter = ({ text }: { text: string }) => {
  const [currentText, setCurrentText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setCurrentText(text.slice(0, i));
      i++;
      if (i > text.length) i = 0;
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return <span className="uppercase">{currentText}</span>;
};
