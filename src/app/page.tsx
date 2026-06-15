'use client';
import { useGarage } from '@/context/GarageContext';
import { TASKS, STAGES, getTasksForWeek } from '@/data/tasks';
import { getLevelForPoints, getLevelProgress, getNextLevel, getEarnedBadges } from '@/data/gamification';
import Link from 'next/link';
import { Crown, Check, ArrowRight, Lock } from 'lucide-react';

function TodaysFocus() {
  const { completedTasks } = useGarage();
  const next = TASKS.find(t => !completedTasks.includes(t.number));
  if (!next) return (
    <div className="glass-card p-6 col-span-2 animate-slide-up flex items-center justify-center">
      <div className="text-center"><Crown size={40} className="mx-auto mb-2" style={{color:'#B4F052'}} /><p className="mt-2 text-lg font-bold" style={{color:'#B4F052'}}>All 100 Tasks Complete!</p></div>
    </div>
  );
  const total = TASKS.length;
  const done = completedTasks.length;
  const pct = Math.round((done / total) * 100);
  return (
    <Link href={`/tasks/${next.number}`} className="glass-card p-6 col-span-2 animate-slide-up hover:border-[#B4F052]/30 cursor-pointer group">
      <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Today&apos;s Focus</div>
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#B4F052" strokeWidth="2.5" strokeDasharray={`${pct} ${100-pct}`} strokeLinecap="round" className="transition-all duration-700" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{color:'#B4F052'}}>{pct}%</div>
        </div>
        <div>
          <div className="text-white/40 text-xs mb-1">Task {next.number} / {next.subStage}</div>
          <div className="text-lg font-semibold group-hover:text-[#B4F052] transition-colors">{next.title}</div>
          <div className="text-xs text-white/30 mt-1">{next.stage} / Weeks {next.startWeek}--{next.endWeek}</div>
        </div>
      </div>
    </Link>
  );
}

function StartupScore() {
  const { points } = useGarage();
  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Startup Score</div>
      <div className="flex items-end gap-1">
        <span className="text-4xl font-bold" style={{ color: '#B4F052' }}>{points}</span>
        <span className="text-white/30 text-sm mb-1">/1000</span>
      </div>
      <div className="mt-3 w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(points/1000)*100}%`, background: 'linear-gradient(90deg, #22c55e, #B4F052)' }} />
      </div>
      <div className="flex justify-between mt-2 text-xs text-white/30">
        <span>SETUP</span><span>LAUNCH</span><span>SCALE</span>
      </div>
    </div>
  );
}

function FounderLevel() {
  const { points } = useGarage();
  const level = getLevelForPoints(points);
  const progress = getLevelProgress(points);
  const next = getNextLevel(points);
  const LevelIcon = level.icon;
  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Founder Level</div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: level.color + '20' }}>
          <LevelIcon size={22} style={{ color: level.color }} />
        </div>
        <div>
          <div className="text-xl font-bold" style={{ color: level.color }}>{level.name}</div>
          {next && <div className="text-xs text-white/30">{next.minPoints - points} pts to {next.name}</div>}
        </div>
      </div>
      <div className="mt-3 w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: level.color }} />
      </div>
    </div>
  );
}

function StageProgress() {
  const { completedTasks } = useGarage();
  const stageData = STAGES.map(s => {
    const range = s.name === 'SETUP' ? [1,20] : s.name === 'LAUNCH' ? [21,69] : [70,100];
    const total = range[1] - range[0] + 1;
    const done = completedTasks.filter(n => n >= range[0] && n <= range[1]).length;
    return { ...s, total, done, pct: Math.round((done/total)*100) };
  });

  return (
    <div className="glass-card p-6 col-span-2 animate-slide-up" style={{ animationDelay: '0.15s' }}>
      <div className="text-xs text-white/40 uppercase tracking-wider mb-4">Stage Progress</div>
      <div className="flex items-center justify-between">
        {stageData.map((s, i) => (
          <div key={s.name} className="flex items-center gap-3 flex-1">
            <div className="text-center flex-1">
              <div className="relative w-14 h-14 mx-auto mb-2">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke={s.color} strokeWidth="3" strokeDasharray={`${s.pct} ${100-s.pct}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  {s.pct === 100 ? <Check size={16} style={{ color: s.color }} /> : <span className="text-xs font-bold">{s.pct}%</span>}
                </div>
              </div>
              <div className="text-xs font-semibold" style={{ color: s.color }}>{s.name}</div>
              <div className="text-xs text-white/30">{s.done}/{s.total}</div>
            </div>
            {i < stageData.length - 1 && <ArrowRight size={16} className="text-white/20" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarChart() {
  const { completedTasks } = useGarage();
  const dims = [
    { label: 'Product', tasks: [26,27,28,31,34,82,83,84] },
    { label: 'Market', tasks: [1,2,3,4,18,21,22,79,99] },
    { label: 'Team', tasks: [8,9,10,43,44,72,73,74,94] },
    { label: 'Finance', tasks: [24,36,37,42,70,77,81,89] },
    { label: 'Ops', tasks: [45,47,48,49,50,52,58,60,85,93] },
    { label: 'Growth', tasks: [56,57,68,78,88,91,92,100] },
  ];
  const scores = dims.map(d => {
    const done = d.tasks.filter(t => completedTasks.includes(t)).length;
    return done / d.tasks.length;
  });

  const cx = 90, cy = 90, r = 70;
  const angles = scores.map((_, i) => (Math.PI * 2 * i / scores.length) - Math.PI / 2);
  const points = scores.map((s, i) => `${cx + r * s * Math.cos(angles[i])},${cy + r * s * Math.sin(angles[i])}`).join(' ');
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.25s' }}>
      <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Startup Health</div>
      <svg viewBox="0 0 180 180" className="w-full max-w-[200px] mx-auto">
        {gridLevels.map(l => (
          <polygon key={l} points={angles.map(a => `${cx + r * l * Math.cos(a)},${cy + r * l * Math.sin(a)}`).join(' ')} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        ))}
        {dims.map((d, i) => (
          <g key={d.label}>
            <line x1={cx} y1={cy} x2={cx + r * Math.cos(angles[i])} y2={cy + r * Math.sin(angles[i])} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            <text x={cx + (r + 14) * Math.cos(angles[i])} y={cy + (r + 14) * Math.sin(angles[i])} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.4)" fontSize="6">{d.label}</text>
          </g>
        ))}
        <polygon points={points} fill="rgba(180,240,82,0.15)" stroke="#B4F052" strokeWidth="1.5" />
        {scores.map((s, i) => (
          <circle key={i} cx={cx + r * s * Math.cos(angles[i])} cy={cy + r * s * Math.sin(angles[i])} r="2.5" fill="#B4F052" />
        ))}
      </svg>
    </div>
  );
}

function WeeklySprint() {
  const { completedTasks, currentWeek } = useGarage();
  const weekTasks = getTasksForWeek(currentWeek);
  return (
    <div className="glass-card p-6 col-span-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-white/40 uppercase tracking-wider">Weekly Sprint -- Week {currentWeek}</div>
        <div className="text-xs text-white/30">{weekTasks.filter(t => completedTasks.includes(t.number)).length}/{weekTasks.length} done</div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {weekTasks.slice(0, 6).map(t => {
          const done = completedTasks.includes(t.number);
          return (
            <Link key={t.number} href={`/tasks/${t.number}`} className={`p-3 rounded-xl border transition-all hover:border-[#B4F052]/30 ${done ? 'bg-[#B4F052]/5 border-[#B4F052]/20' : 'bg-white/[0.02] border-white/[0.06]'}`}>
              <div className="text-xs text-white/40 mb-1">Task {t.number}</div>
              <div className="text-sm font-medium truncate">{t.title}</div>
              <div className="flex items-center gap-1.5 mt-2">
                {done ? <Check size={12} className="text-[#B4F052]" /> : <Lock size={12} className="text-white/30" />}
                <span className={`text-xs ${done ? 'text-[#B4F052]' : 'text-white/40'}`}>{done ? 'Done' : 'To Do'}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function RecentActivity() {
  const { completedTasks } = useGarage();
  const recent = [...completedTasks].reverse().slice(0, 5);
  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.35s' }}>
      <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Recent Activity</div>
      {recent.length === 0 ? <p className="text-sm text-white/30">No completed tasks yet</p> : (
        <div className="space-y-3">
          {recent.map(num => {
            const t = TASKS.find(x => x.number === num);
            if (!t) return null;
            return (
              <div key={num} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B4F052]" />
                <div className="text-sm truncate flex-1">
                  <span className="text-white/40 mr-1">#{num}</span>{t.title}
                </div>
                <span className="text-xs text-[#B4F052]">+10</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BadgesPreview() {
  const { completedTasks, streak } = useGarage();
  const earned = getEarnedBadges(completedTasks, streak);
  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-white/40 uppercase tracking-wider">Badges</div>
        <Link href="/badges" className="text-xs text-[#B4F052] hover:underline">{earned.length} earned</Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {earned.length === 0 ? <p className="text-sm text-white/30">Complete tasks to earn badges</p> : 
          earned.slice(0, 6).map(b => {
            const Icon = b.icon;
            return (
              <div key={b.id} className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center" title={b.name}>
                <Icon size={18} className="text-[#B4F052]" />
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Premium Workspace Banner */}
      <div className="relative w-full h-[360px] md:h-[540px] rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl group transition-all duration-300 hover:border-[#B4F052]/30">
        {/* Deep gradient to black at the bottom, transparent at the top to keep the neon sign clear */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <img 
          src="/garage.jpg" 
          alt="Digital Innovation Center Workspace" 
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
        />
        {/* Ambient glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B4F052]/10 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Banner content */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B4F052]/10 border border-[#B4F052]/20 text-[#B4F052] text-xs font-semibold w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B4F052] animate-pulse" />
              INNOVATION CENTER
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-none">
              Digital Innovation Center <span style={{ color: '#B4F052' }}>for Startups @ District.org</span>
            </h1>
            <p className="text-xs md:text-sm text-white/70 max-w-xl mt-1">
              Your operational command center. Keep building, testing, and scaling towards your first unicorn.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TodaysFocus />
          <StartupScore />
          <FounderLevel />
          <StageProgress />
          <RadarChart />
          <BadgesPreview />
          <WeeklySprint />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
