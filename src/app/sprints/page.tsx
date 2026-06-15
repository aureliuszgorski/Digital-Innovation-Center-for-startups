'use client';
import { TASKS, STAGE_COLORS } from '@/data/tasks';
import { useGarage } from '@/context/GarageContext';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function SprintsPage() {
  const { completedTasks, currentWeek } = useGarage();

  const weeks = Array.from({ length: 20 }, (_, i) => {
    const week = i + 1;
    const weekTasks = TASKS.filter(t => t.startWeek <= week && t.endWeek >= week);
    const done = weekTasks.filter(t => completedTasks.includes(t.number)).length;
    const stage = week <= 6 ? 'SETUP' : week <= 14 ? 'LAUNCH' : 'SCALE';
    return { week, tasks: weekTasks, done, total: weekTasks.length, stage, pct: weekTasks.length ? Math.round((done/weekTasks.length)*100) : 0 };
  });

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Sprint Timeline</h1>
      <p className="text-sm text-white/40 mb-6">20-week journey from idea to unicorn</p>

      {/* Timeline */}
      <div className="flex gap-1 mb-8 h-3 rounded-full overflow-hidden bg-white/[0.05]">
        {weeks.map(w => (
          <div key={w.week} className="flex-1 rounded-sm transition-all" title={`Week ${w.week}: ${w.pct}%`}
            style={{ background: w.pct === 100 ? STAGE_COLORS[w.stage] : w.pct > 0 ? STAGE_COLORS[w.stage] + '40' : 'transparent' }} />
        ))}
      </div>

      {/* Weeks */}
      <div className="space-y-3">
        {weeks.map(w => (
          <div key={w.week} className={`glass-card p-4 ${w.week === currentWeek ? 'border-[#B4F052]/30 animate-pulse-glow' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold font-mono" style={{ color: STAGE_COLORS[w.stage] }}>W{w.week}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: STAGE_COLORS[w.stage] + '20', color: STAGE_COLORS[w.stage] }}>{w.stage}</span>
                {w.week === currentWeek && <span className="text-xs px-2 py-0.5 rounded-full bg-[#B4F052]/20 text-[#B4F052]">Current</span>}
              </div>
              <span className="text-xs text-white/40">{w.done}/{w.total} tasks / {w.pct}%</span>
            </div>
            <div className="w-full h-1 bg-white/[0.06] rounded-full mb-3">
              <div className="h-full rounded-full transition-all" style={{ width: `${w.pct}%`, background: STAGE_COLORS[w.stage] }} />
            </div>
            <div className="flex flex-wrap gap-2">
              {w.tasks.map(t => {
                const isDone = completedTasks.includes(t.number);
                return (
                  <Link key={t.number} href={`/tasks/${t.number}`} className={`text-xs px-2.5 py-1 rounded-lg border transition-all hover:border-[#B4F052]/30 flex items-center gap-1 ${isDone ? 'bg-[#B4F052]/10 border-[#B4F052]/20 text-[#B4F052]' : 'bg-white/[0.02] border-white/[0.06] text-white/50'}`}>
                    {isDone && <Check size={10} />}
                    {t.number}. {t.title.length > 30 ? t.title.slice(0, 30) + '...' : t.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
