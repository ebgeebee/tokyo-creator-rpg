import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Dumbbell, 
  Video, 
  Mic2, 
  History, 
  RotateCcw, 
  Flame, 
  ChevronRight, 
  User,
  Layout, 
  Star, 
  Zap, 
  Target, 
  ExternalLink, 
  RefreshCw, 
  CalendarDays, 
  CheckCircle2, 
  Check 
} from 'lucide-react';

const App = () => {
  // --- STATE MANAGEMENT ---
  const [xp, setXp] = useState(0); 
  const [level, setLevel] = useState(1); // Reset to Level 1 (1 year experience)
  const [weight, setWeight] = useState(91);
  const [history, setHistory] = useState([]);
  const [weeklyArchive, setWeeklyArchive] = useState([]);
  
  // Milestones & Editing States
  const [tiktokFollowers, setTiktokFollowers] = useState(9500);
  const [ytWatchHours, setYtWatchHours] = useState(2100);
  const [isEditingTikTok, setIsEditingTikTok] = useState(false);
  const [isEditingYT, setIsEditingYT] = useState(false);

  // STARTING STATS
  const [stats, setStats] = useState({
    wits: 1,      
    vitality: 1,  
    rhetoric: 1,  
    editing: 10,  
  });

  // PROGRESSIVE STAT TRACKING (XP accumulated toward next attribute level)
  const [statProgressXp, setStatProgressXp] = useState({
    wits: 0,
    vitality: 0,
    rhetoric: 0,
    editing: 0
  });

  const [quests, setQuests] = useState({
    daily: [
      { id: 'd1', text: "Daily Joke Writing (Scott Dikkers Method)", count: 0, target: 7, xpPerUnit: 50, stat: 'wits' },
    ],
    weekly: [
      { id: 'w1', text: "3-4 Talking Head Videos", count: 0, target: 4, xp: 300, stat: 'rhetoric' },
      { id: 'w2', text: "RPG Style Vlog Edit (High Level)", count: 0, target: 1, xp: 1000, stat: 'editing' }, 
      { id: 'w3', text: "3 Gym Sessions", count: 0, target: 3, xp: 400, stat: 'vitality' },
    ],
    monthly: [
      { id: 'm1', text: "Big Boss: One Skit Script", count: 0, target: 1, xp: 1000, stat: 'wits' },
      { id: 'm2', text: "Final Boss: One Skit Video", count: 0, target: 1, xp: 2000, stat: 'editing' },
    ]
  });

  // --- LOGIC ---

  // Scaling logic for Main Level: Base 500, increases 10% per level
  const getNextLevelXp = (lvl) => Math.floor(500 * Math.pow(1.1, lvl - 1));

  // Scaling logic for Attributes: Level 1 costs 50 XP, increases linearly
  const getStatXpNeeded = (lvl) => 50 * lvl; 

  const addXp = (amount, statType, label, questId, questType) => {
    // Snapshot current state for perfect undo/level-down
    const snapshot = {
      prevXp: xp,
      prevLevel: level,
      prevStats: { ...stats },
      prevStatProgressXp: { ...statProgressXp },
      prevQuests: JSON.parse(JSON.stringify(quests)),
      label,
      amount,
      timestamp: Date.now()
    };

    setHistory(prev => [snapshot, ...prev].slice(0, 20));

    // Handle Main XP Gain
    let currentXp = xp + amount;
    let currentLevel = level;
    
    while (currentXp >= getNextLevelXp(currentLevel)) {
      currentXp -= getNextLevelXp(currentLevel);
      currentLevel += 1;
    }

    setXp(currentXp);
    setLevel(currentLevel);

    // Handle Progressive Stat Gain via XP
    if (statType) {
      setStatProgressXp(prevProgress => {
        let currentStatXp = prevProgress[statType] + amount;
        let currentStatLevel = stats[statType];

        while (currentStatXp >= getStatXpNeeded(currentStatLevel)) {
          currentStatXp -= getStatXpNeeded(currentStatLevel);
          currentStatLevel += 1;
        }

        setStats(prevStats => ({ ...prevStats, [statType]: currentStatLevel }));
        return { ...prevProgress, [statType]: currentStatXp };
      });
    }
  };

  const undoLastAction = () => {
    if (history.length === 0) return;
    const last = history[0];
    
    setXp(last.prevXp);
    setLevel(last.prevLevel);
    setStats(last.prevStats);
    setStatProgressXp(last.prevStatProgressXp);
    setQuests(last.prevQuests);
    
    setHistory(prev => prev.slice(1));
  };

  const startNextWeek = () => {
    const weekStats = {
      date: new Date().toLocaleDateString(),
      xpGained: history.reduce((acc, curr) => acc + curr.amount, 0),
      level: level
    };
    
    setWeeklyArchive(prev => [weekStats, ...prev]);

    setQuests(prev => ({
      ...prev,
      daily: prev.daily.map(q => ({ ...q, count: 0 })),
      weekly: prev.weekly.map(q => ({ ...q, count: 0 }))
    }));

    setHistory([]);
  };

  const incrementQuest = (id, type) => {
    setQuests(prev => ({
      ...prev,
      [type]: prev[type].map(q => {
        if (q.id === id && q.count < q.target) {
          const xpGain = type === 'daily' ? q.xpPerUnit : Math.floor(q.xp / q.target);
          addXp(xpGain, q.stat, q.text, q.id, type);
          return { ...q, count: q.count + 1 };
        }
        return q;
      })
    }));
  };

  const nextLevelXpNeeded = getNextLevelXp(level);
  const progressPercent = (xp / nextLevelXpNeeded) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#dcdcdc] font-serif p-4 md:p-8 pb-20 selection:bg-[#c5a059] selection:text-black">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* CHARACTER STATUS HEADER */}
        <header className="relative p-8 rounded-lg border border-[#c5a059]/30 bg-[#121212] shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent opacity-50" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-[#1a1a1a] border-2 border-[#c5a059]/40 rounded-full flex items-center justify-center shadow-inner group overflow-hidden">
                  <User size={48} className="text-[#c5a059]/80 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 border-[6px] border-[#0a0a0a] rounded-full pointer-events-none" />
                </div>
                <div className="absolute -bottom-2 right-2 bg-[#c5a059] text-black text-[10px] font-black px-2 py-0.5 rounded border border-[#0a0a0a] uppercase tracking-tighter">
                  Online
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-[0.1em] text-white">@theiisansan</h1>
                    <a href="https://www.tiktok.com/@theiisansan" target="_blank" rel="noopener noreferrer" className="text-[#c5a059] hover:text-white transition-colors">
                        <ExternalLink size={18} />
                    </a>
                </div>
                <p className="text-[#c5a059] text-sm font-medium italic tracking-[0.15em]">
                  Level {level} Salaryman Drone
                </p>
                <div className="flex gap-3 mt-2">
                    <span className="text-[10px] bg-[#1a1a1a] text-[#8c8c8c] px-2 py-0.5 rounded border border-[#3a3a3a] font-bold uppercase tracking-widest text-center">Tokyo Server</span>
                    <span className="text-[10px] bg-[#c5a059]/10 text-[#c5a059] px-2 py-0.5 rounded border border-[#c5a059]/30 font-bold uppercase tracking-widest text-center">Tarnished Drone</span>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-80 space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-[#8c8c8c]">
                <span>Rune Progress</span>
                <span className="text-[#c5a059]">{Math.floor(xp)} / {nextLevelXpNeeded}</span>
              </div>
              <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden border border-[#3a3a3a] shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-[#8a6d3b] via-[#c5a059] to-[#8a6d3b] shadow-[0_0_10px_rgba(197,160,89,0.3)] transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* GRAND MILESTONES (THE GREAT RUNES) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative p-6 rounded-lg bg-[#121212] border border-[#c5a059]/20 shadow-xl group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                    <Target size={80} className="text-[#c5a059]" />
                </div>
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059]">Great Rune I</h2>
                        <h3 className="text-xl font-bold text-white tracking-widest">TikTok Milestone</h3>
                    </div>
                    <button 
                      onClick={() => setIsEditingTikTok(!isEditingTikTok)}
                      className="p-2 rounded bg-[#1a1a1a] border border-[#3a3a3a] text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all active:scale-95 shadow-inner"
                    >
                        {isEditingTikTok ? <Check size={14} /> : <RefreshCw size={14} />}
                    </button>
                </div>
                <div className="flex justify-between items-end mb-2 font-bold uppercase tracking-widest h-10">
                    {isEditingTikTok ? (
                      <input 
                        type="number"
                        className="bg-[#0a0a0a] border border-[#c5a059]/50 text-white text-2xl font-bold w-full p-1 rounded outline-none focus:border-[#c5a059]"
                        value={tiktokFollowers}
                        onChange={(e) => setTiktokFollowers(parseInt(e.target.value) || 0)}
                        onBlur={() => setIsEditingTikTok(false)}
                        autoFocus
                      />
                    ) : (
                      <>
                        <span className="text-2xl text-white tracking-widest">{tiktokFollowers.toLocaleString()}</span>
                        <span className="text-xs text-[#8c8c8c]">Target 10,000</span>
                      </>
                    )}
                </div>
                <div className="h-3 bg-[#0a0a0a] rounded border border-[#3a3a3a] overflow-hidden shadow-inner mt-4">
                    <div 
                      className="h-full bg-gradient-to-r from-[#4b3c21] to-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.2)] transition-all duration-1000"
                      style={{ width: `${Math.min(100, (tiktokFollowers / 10000) * 100)}%` }}
                    />
                </div>
            </div>

            <div className="relative p-6 rounded-lg bg-[#121212] border border-[#c5a059]/20 shadow-xl group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                    <Mic2 size={80} className="text-[#c5a059]" />
                </div>
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059]">Great Rune II</h2>
                        <h3 className="text-xl font-bold text-white tracking-widest">YouTube Watch Hours</h3>
                    </div>
                    <button 
                      onClick={() => setIsEditingYT(!isEditingYT)}
                      className="p-2 rounded bg-[#1a1a1a] border border-[#3a3a3a] text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all active:scale-95 shadow-inner"
                    >
                        {isEditingYT ? <Check size={14} /> : <RefreshCw size={14} />}
                    </button>
                </div>
                <div className="flex justify-between items-end mb-2 font-bold uppercase tracking-widest h-10">
                    {isEditingYT ? (
                      <input 
                        type="number"
                        className="bg-[#0a0a0a] border border-[#c5a059]/50 text-white text-2xl font-bold w-full p-1 rounded outline-none focus:border-[#c5a059]"
                        value={ytWatchHours}
                        onChange={(e) => setYtWatchHours(parseInt(e.target.value) || 0)}
                        onBlur={() => setIsEditingYT(false)}
                        autoFocus
                      />
                    ) : (
                      <>
                        <span className="text-2xl text-white tracking-widest">{ytWatchHours.toLocaleString()}</span>
                        <span className="text-xs text-[#8c8c8c]">Target 3,000</span>
                      </>
                    )}
                </div>
                <div className="h-3 bg-[#0a0a0a] rounded border border-[#3a3a3a] overflow-hidden shadow-inner mt-4">
                    <div 
                      className="h-full bg-gradient-to-r from-[#4b3c21] to-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.2)] transition-all duration-1000"
                      style={{ width: `${Math.min(100, (ytWatchHours / 3000) * 100)}%` }}
                    />
                </div>
            </div>
        </div>

        {/* SECONDARY CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* STATS & LEGACY COLUMN */}
          <div className="space-y-8">
            <section className="bg-[#121212] p-6 rounded-lg border border-[#c5a059]/20 shadow-lg">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#c5a059] mb-6 flex items-center gap-3">
                <Star size={16} /> Attributes
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {Object.keys(stats).map(statKey => (
                  <StatRow 
                    key={statKey}
                    icon={statKey === 'wits' ? <Zap size={14}/> : statKey === 'vitality' ? <Dumbbell size={14}/> : statKey === 'rhetoric' ? <Mic2 size={14}/> : <Video size={14}/>} 
                    label={statKey} 
                    val={stats[statKey]} 
                    progress={statProgressXp[statKey]}
                    needed={getStatXpNeeded(stats[statKey])}
                  />
                ))}
              </div>
            </section>

            <section className="bg-[#121212] p-6 rounded-lg border border-[#c5a059]/20 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#c5a059] flex items-center gap-3">
                  <Flame size={16} /> Vitality Quest
                </h2>
                <span className="text-[10px] text-[#8c8c8c] font-black uppercase tracking-widest text-right">Goal 75kg</span>
              </div>
              <div className="text-center py-6 border-y border-[#c5a059]/10">
                <div className="text-5xl font-bold text-white tracking-tighter">{weight}<span className="text-lg text-[#8c8c8c] ml-1 uppercase">kg</span></div>
                <div className="flex justify-center gap-6 mt-6">
                  <button onClick={() => setWeight(w => w - 0.5)} className="w-12 h-12 rounded bg-[#1a1a1a] border border-[#3a3a3a] hover:border-[#c5a059] transition-all flex items-center justify-center font-bold text-[#c5a059]">-</button>
                  <button onClick={() => setWeight(w => w + 0.5)} className="w-12 h-12 rounded bg-[#1a1a1a] border border-[#3a3a3a] hover:border-[#c5a059] transition-all flex items-center justify-center font-bold text-[#c5a059]">+</button>
                </div>
              </div>
              <div className="mt-6 h-1.5 bg-[#0a0a0a] rounded overflow-hidden">
                <div 
                  className="h-full bg-[#c5a059] opacity-80" 
                  style={{ width: `${Math.max(0, Math.min(100, (91 - weight) / (91 - 75) * 100))}%` }}
                />
              </div>
            </section>

            <section className="bg-[#121212] p-6 rounded-lg border border-[#3a3a3a] shadow-lg">
              <h2 className="text-[10px] font-black text-[#8c8c8c] uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                <CalendarDays size={16} /> Chronicle of Weeks
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {weeklyArchive.length === 0 ? (
                  <p className="text-[10px] text-[#555] italic text-center py-4 uppercase tracking-widest">Your legend is just beginning...</p>
                ) : (
                  weeklyArchive.map((w, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] bg-[#1a1a1a] p-3 rounded border border-[#3a3a3a] font-bold uppercase tracking-widest">
                      <span className="text-[#8c8c8c]">{w.date}</span>
                      <span className="text-[#c5a059]">+{Math.floor(w.xpGained)} XP</span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* TASKS & QUESTS COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* HABIT TRACKER */}
            <section className="bg-[#121212] p-8 rounded-lg border border-[#c5a059]/20 shadow-xl relative">
              <div className="flex justify-between items-center mb-8 border-b border-[#c5a059]/10 pb-4">
                <h2 className="text-xl font-bold tracking-widest flex items-center gap-3 text-white">
                  <Layout size={20} className="text-[#c5a059]" /> 7-Day Scripting Ritual
                </h2>
                <button 
                  onClick={startNextWeek}
                  className="px-4 py-2 bg-[#1a1a1a] border border-[#c5a059]/40 hover:bg-[#c5a059] hover:text-black text-[#c5a059] text-[10px] font-black uppercase tracking-[0.2em] rounded transition-all shadow-lg active:scale-95"
                >
                  <CalendarDays size={14} className="inline mr-2" /> Start Next Cycle
                </button>
              </div>
              
              <div className="space-y-8">
                {quests.daily.map(q => (
                  <div key={q.id} className="space-y-6">
                    <div className="flex justify-between items-end">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white tracking-wide">{q.text}</h3>
                        <p className="text-[10px] text-[#8c8c8c] font-black uppercase tracking-widest italic">The daily grind of the comedy alchemist</p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black text-white">{q.count}<span className="text-lg text-[#555] ml-1">/7</span></span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {[...Array(7)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 h-14 rounded border flex items-center justify-center transition-all duration-500 ${
                            i < q.count 
                              ? 'bg-[#c5a059]/10 border-[#c5a059] text-[#c5a059] shadow-[inset_0_0_10px_rgba(197,160,89,0.1)]' 
                              : 'bg-[#0a0a0a] border-[#3a3a3a] text-[#333]'
                          }`}
                        >
                          {i < q.count ? <CheckCircle2 size={24} /> : <span className="text-xs font-black opacity-30">{i + 1}</span>}
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => incrementQuest(q.id, 'daily')}
                      disabled={q.count >= q.target}
                      className={`w-full py-4 rounded font-black text-xs uppercase tracking-[0.3em] transition-all ${
                        q.count >= q.target 
                          ? 'bg-[#1a1a1a] text-[#3a3a3a] border border-[#3a3a3a] cursor-default' 
                          : 'bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/40 hover:bg-[#c5a059] hover:text-black shadow-lg'
                      }`}
                    >
                      {q.count >= q.target ? 'Ritual Complete' : 'Perform Daily Ritual'}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* WEEKLY & MONTHLY BOSSES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="bg-[#121212] p-6 rounded-lg border border-[#c5a059]/20 shadow-lg">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#c5a059] mb-6 flex items-center gap-3">
                        <Trophy size={16} /> Weekly Ordeals
                    </h2>
                    <div className="space-y-6">
                        {quests.weekly.map(q => (
                            <div key={q.id} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-[#8c8c8c] uppercase tracking-wider">{q.text}</span>
                                    <button 
                                        onClick={() => incrementQuest(q.id, 'weekly')}
                                        disabled={q.count >= q.target}
                                        className="p-1 text-[#c5a059] hover:text-white transition-colors"
                                    >
                                        <Zap size={14} fill={q.count >= q.target ? "currentColor" : "none"} />
                                    </button>
                                </div>
                                <div className="h-1 bg-[#0a0a0a] rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#c5a059] opacity-60 transition-all duration-700"
                                        style={{ width: `${(q.count / q.target) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-[#555]">
                                    <span>{q.count} / {q.target}</span>
                                    <span>+{Math.floor(q.xp / q.target)} XP / UNIT</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-[#121212] p-6 rounded-lg border border-red-900/30 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                        <Target size={100} />
                    </div>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-red-700 mb-6 flex items-center gap-3">
                        <Target size={16} /> Monthly Bosses
                    </h2>
                    <div className="space-y-6">
                        {quests.monthly.map(q => (
                            <div key={q.id} className="space-y-3">
                                <h3 className="text-xs font-black text-white uppercase tracking-widest">{q.text}</h3>
                                <div className="h-1.5 bg-[#0a0a0a] rounded overflow-hidden">
                                    <div 
                                        className="h-full bg-red-800 transition-all duration-1000"
                                        style={{ width: `${(q.count / q.target) * 100}%` }}
                                    />
                                </div>
                                <button 
                                    onClick={() => incrementQuest(q.id, 'monthly')}
                                    disabled={q.count >= q.target}
                                    className={`w-full py-2 rounded text-[8px] font-black uppercase tracking-[0.2em] transition-all border ${
                                        q.count >= q.target 
                                            ? 'bg-transparent text-[#333] border-[#333] cursor-default' 
                                            : 'bg-red-900/10 text-red-600 border-red-900/50 hover:bg-red-600 hover:text-white'
                                    }`}
                                >
                                    {q.count >= q.target ? 'Boss Slain' : 'Battle Boss'}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* UNDO / RECENT ACTIONS */}
            <section className="bg-[#121212] p-6 rounded-lg border border-[#3a3a3a] shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-[10px] font-black text-[#8c8c8c] uppercase tracking-[0.3em] flex items-center gap-3">
                    <History size={16} /> Tarnished Echoes
                  </h2>
                  <button 
                    onClick={undoLastAction}
                    disabled={history.length === 0}
                    className="text-[10px] font-black text-red-700 hover:text-red-500 transition-colors disabled:opacity-20 uppercase tracking-[0.2em] flex items-center gap-2"
                  >
                    <RotateCcw size={12} /> Revert Fate
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.length === 0 ? (
                      <p className="text-[9px] text-[#555] uppercase tracking-widest italic py-2">No echoes recorded in the current grace...</p>
                  ) : (
                    history.map((snapshot, i) => (
                        <div key={i} className="text-[9px] bg-[#0a0a0a] px-3 py-1.5 rounded border border-[#3a3a3a] font-bold text-[#8c8c8c] uppercase tracking-tighter">
                          <span className="text-[#c5a059]">+{Math.floor(snapshot.amount)}</span> {snapshot.label}
                        </div>
                    ))
                  )}
                </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatRow = ({ icon, label, val, progress, needed }) => (
  <div className="py-2 border-b border-[#3a3a3a]/30 last:border-0 group space-y-1">
    <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
            <span className="text-[#c5a059] opacity-60 group-hover:opacity-100 transition-opacity">{icon}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8c8c8c] group-hover:text-white transition-colors">{label}</span>
        </div>
        <span className="text-sm font-bold text-white tracking-widest">Lv {val}</span>
    </div>
    {/* Attribute Progress Bar */}
    <div className="h-1 w-full bg-[#0a0a0a] rounded-full overflow-hidden">
        <div 
            className="h-full bg-[#c5a059]/40 group-hover:bg-[#c5a059]/70 transition-all duration-500 shadow-[0_0_8px_rgba(197,160,89,0.2)]"
            style={{ width: `${(progress / needed) * 100}%` }}
        />
    </div>
    <div className="flex justify-between text-[7px] font-black text-[#444] uppercase tracking-tighter">
        <span>Exp: {Math.floor(progress)}</span>
        <span>Req: {needed}</span>
    </div>
  </div>
);

export default App;
