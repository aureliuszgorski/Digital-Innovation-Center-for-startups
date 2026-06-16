'use client';
import { useState } from 'react';
import Link from 'next/link';
import { TASKS, STAGES, SUB_STAGES, TYPE_COLORS, STAGE_COLORS } from '@/data/tasks';
import { useGarage } from '@/context/GarageContext';
import { Check, ChevronRight, ChevronDown, Star, Download } from 'lucide-react';
import PhasePDFGenerator from '@/components/PhasePDFGenerator';

export default function TasksPage() {
  const { completedTasks, completeTask, uncompleteTask } = useGarage();
  const [activeStage, setActiveStage] = useState<'ALL'|'SETUP'|'LAUNCH'|'SCALE'>('ALL');
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const PHASE_PDF_MAP: Record<string, 1|2|3|4> = {
    'Start with Problems': 1,
    'Plan Mission': 2,
    'Assemble Core Team': 3,
    'Collect Ideas': 4,
  };

  const stageTasks = activeStage === 'ALL' ? TASKS : TASKS.filter(t => t.stage === activeStage);
  const filtered = search ? stageTasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase())) : stageTasks;
  const subStages = activeStage === 'ALL' ? SUB_STAGES : SUB_STAGES.filter(s => s.stage === activeStage);

  const stageStats = [
    { name: 'ALL', total: 100, done: completedTasks.length, pct: Math.round((completedTasks.length/100)*100), color: '#ffffff' },
    ...STAGES.map(s => {
      const range = s.name === 'SETUP' ? [1,20] : s.name === 'LAUNCH' ? [21,69] : [70,100];
      const total = range[1] - range[0] + 1;
      const done = completedTasks.filter(n => n >= range[0] && n <= range[1]).length;
      return { name: s.name, total, done, pct: Math.round((done/total)*100), color: s.color };
    })
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">The 100 Tasks</h1>
        <p className="text-sm text-white/40 mt-1">{completedTasks.length} of 100 completed / {completedTasks.length * 10} points earned</p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."
          className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#B4F052]/40" />
      </div>

      {/* Stage Tabs */}
      <div className="flex gap-2 mb-6">
        {stageStats.map(s => (
          <button key={s.name} onClick={() => setActiveStage(s.name as typeof activeStage)}
            className={`flex-1 p-4 rounded-xl border transition-all text-left ${
              activeStage === s.name ? 'border-[#B4F052]/40 bg-[#B4F052]/5' : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]'
            }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: s.color }}>{s.name}</span>
              <span className="text-xs text-white/30">{s.done}/{s.total}</span>
            </div>
            <div className="mt-2 w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${s.pct}%`, background: s.color }} />
            </div>
          </button>
        ))}
      </div>

      {/* Sub-stages */}
      {subStages.map(ss => {
        const ssTasks = filtered.filter(t => t.subStage === ss.name);
        if (ssTasks.length === 0) return null;
        const isCollapsed = collapsed[ss.name];
        const ssDone = ssTasks.filter(t => completedTasks.includes(t.number)).length;
        return (
          <div key={ss.name} className="mb-4">
            <button onClick={() => setCollapsed(c => ({ ...c, [ss.name]: !c[ss.name] }))}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all mb-2">
              <div className="flex items-center gap-3">
                {isCollapsed ? <ChevronRight size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
                <span className="text-sm font-semibold">{ss.name}</span>
                <span className="text-xs text-white/30">Weeks {ss.weekRange[0]}--{ss.weekRange[1]}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05]" style={{ color: STAGE_COLORS[ss.stage] }}>{ssDone}/{ssTasks.length}</span>
            </button>
            {!isCollapsed && (
              <div className="space-y-1 ml-2">
                {ssTasks.map(t => {
                  const done = completedTasks.includes(t.number);
                  return (
                    <div key={t.number} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-all group">
                      <button onClick={() => done ? uncompleteTask(t.number) : completeTask(t.number)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          done ? 'bg-[#B4F052] border-[#B4F052] text-black' : 'border-white/20 hover:border-[#B4F052]'
                        }`}>
                        {done && <Check size={12} />}
                      </button>
                      <Link href={`/tasks/${t.number}`} className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono" style={{ color: STAGE_COLORS[t.stage] }}>{t.number}</span>
                          <span className={`text-sm ${done ? 'text-white/40 line-through' : 'text-white'} group-hover:text-[#B4F052] transition-colors truncate`}>{t.title}</span>
                        </div>
                      </Link>
                      <span className="text-xs px-2 py-0.5 rounded-full border border-white/[0.08]" style={{ color: TYPE_COLORS[t.type] }}>{t.type}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.difficulty }, (_, i) => <Star key={i} size={10} className="text-white/20 fill-white/20" />)}
                      </div>
                      <span className="text-xs text-white/20">W{t.startWeek}{t.startWeek !== t.endWeek ? `--${t.endWeek}` : ''}</span>
                    </div>
                  );
                })}
                {PHASE_PDF_MAP[ss.name] && (
                  <div className="mt-3 mb-1 flex justify-end">
                    <PhasePDFGenerator phase={PHASE_PDF_MAP[ss.name]} />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
