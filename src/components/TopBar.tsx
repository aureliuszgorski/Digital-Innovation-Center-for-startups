'use client';
import { useGarage } from '@/context/GarageContext';
import { getLevelForPoints, getLevelProgress } from '@/data/gamification';
import { Flame, Moon } from 'lucide-react';

export default function TopBar() {
  const { points, streak, startupName, founderName } = useGarage();
  const level = getLevelForPoints(points);
  const progress = getLevelProgress(points);
  const LevelIcon = level.icon;

  return (
    <header className="fixed top-0 left-56 right-0 h-16 glass-card rounded-none border-t-0 border-r-0 z-40 flex items-center justify-end px-6">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08]">
          <LevelIcon size={14} style={{ color: level.color }} />
          <span className="text-xs font-medium" style={{ color: level.color }}>{level.name}</span>
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: level.color }} />
          </div>
        </div>
        <div className="text-sm font-bold" style={{ color: '#B4F052' }}>{points}<span className="text-white/40 font-normal">/1000</span></div>
        <div className="flex items-center gap-1 text-sm text-white/50">
          {streak > 0 ? <><Flame size={14} className="text-orange-400" />{streak}d</> : <><Moon size={14} /> --</>}
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B4F052] to-emerald-600 flex items-center justify-center text-xs font-bold text-black">
          {founderName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
