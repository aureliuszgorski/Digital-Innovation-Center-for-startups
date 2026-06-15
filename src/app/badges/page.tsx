'use client';
import { useGarage } from '@/context/GarageContext';
import { BADGES, LEVELS, getEarnedBadges, getLevelForPoints, getLevelProgress } from '@/data/gamification';
import { ArrowRight, Check } from 'lucide-react';

export default function BadgesPage() {
  const { completedTasks, points, streak } = useGarage();
  const earned = getEarnedBadges(completedTasks, streak);
  const earnedIds = new Set(earned.map(b => b.id));
  const level = getLevelForPoints(points);
  const progress = getLevelProgress(points);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Achievements</h1>

      {/* Level Progress */}
      <div className="glass-card p-6 mb-6">
        <div className="text-xs text-white/40 uppercase tracking-wider mb-4">Founder Level Progression</div>
        <div className="flex items-center gap-4">
          {LEVELS.map((l, i) => {
            const isActive = l.name === level.name;
            const isPast = points >= l.maxPoints;
            const Icon = l.icon;
            return (
              <div key={l.name} className="flex items-center gap-3 flex-1">
                <div className={`text-center flex-1 p-4 rounded-xl border transition-all ${
                  isActive ? 'border-[#B4F052]/40 bg-[#B4F052]/5 animate-pulse-glow' : isPast ? 'border-white/20 bg-white/[0.05]' : 'border-white/[0.06] bg-white/[0.02] opacity-40'
                }`}>
                  <div className="flex justify-center mb-2">
                    <Icon size={28} style={{ color: isActive || isPast ? l.color : undefined }} />
                  </div>
                  <div className="text-sm font-semibold" style={{ color: isActive || isPast ? l.color : undefined }}>{l.name}</div>
                  <div className="text-xs text-white/30">{l.minPoints}--{l.maxPoints} pts</div>
                  {isActive && <div className="mt-2 text-xs text-[#B4F052]">{progress}%</div>}
                </div>
                {i < LEVELS.length - 1 && <ArrowRight size={16} className="text-white/20" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="glass-card p-6">
        <div className="text-xs text-white/40 uppercase tracking-wider mb-4">Badges -- {earned.length}/{BADGES.length} earned</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {BADGES.map(b => {
            const isEarned = earnedIds.has(b.id);
            const Icon = b.icon;
            return (
              <div key={b.id} className={`p-4 rounded-xl border transition-all ${
                isEarned ? 'border-[#B4F052]/30 bg-[#B4F052]/5' : 'border-white/[0.06] bg-white/[0.02] opacity-40'
              }`}>
                <div className="mb-2">
                  <Icon size={28} style={{ color: isEarned ? '#B4F052' : undefined }} />
                </div>
                <div className="text-sm font-semibold">{b.name}</div>
                <div className="text-xs text-white/40 mt-1">{b.description}</div>
                {isEarned && <div className="text-xs text-[#B4F052] mt-2 flex items-center gap-1"><Check size={12} /> Earned</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
