import {
  Compass, Hammer, Rocket, Sprout, Crown,
  Footprints, Search, Telescope, Ruler, Package,
  Banknote, PartyPopper, BarChart3, Zap,
  Flame, Gem, Mountain, Palette, Handshake,
  type LucideIcon,
} from 'lucide-react';

export interface Level {
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: LucideIcon;
  color: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const LEVELS: Level[] = [
  { name: 'Explorer', minPoints: 0, maxPoints: 100, icon: Compass, color: '#22c55e' },
  { name: 'Builder', minPoints: 101, maxPoints: 250, icon: Hammer, color: '#3b82f6' },
  { name: 'Launcher', minPoints: 251, maxPoints: 500, icon: Rocket, color: '#a855f7' },
  { name: 'Grower', minPoints: 501, maxPoints: 750, icon: Sprout, color: '#eab308' },
  { name: 'Unicorn', minPoints: 751, maxPoints: 1000, icon: Crown, color: '#ef4444' },
];

export const BADGES: Badge[] = [
  { id: 'first-step', name: 'First Step', description: 'Complete your first task', icon: Footprints },
  { id: 'problem-found', name: 'Problem Found', description: 'Complete "Start with Problems"', icon: Search },
  { id: 'visionary', name: 'Visionary', description: 'Complete "Plan Mission"', icon: Telescope },
  { id: 'blueprint-ready', name: 'Blueprint Ready', description: 'Complete SETUP stage', icon: Ruler },
  { id: 'mvp-shipped', name: 'MVP Shipped', description: 'Complete Task 31 (Develop MVP)', icon: Package },
  { id: 'funded', name: 'Funded', description: 'Complete Task 42 (Secure Investment)', icon: Banknote },
  { id: 'go-live', name: 'Go Live', description: 'Complete Task 68 (Launch)', icon: PartyPopper },
  { id: 'data-driven', name: 'Data Driven', description: 'Complete "Learn from Data"', icon: BarChart3 },
  { id: 'optimized', name: 'Optimized', description: 'Complete "Optimize Functions"', icon: Zap },
  { id: 'streak-7', name: 'Weekly Warrior', description: '7 consecutive days active', icon: Flame },
  { id: 'streak-30', name: 'Monthly Machine', description: '30 consecutive days active', icon: Gem },
  { id: 'half-way', name: 'Half Way', description: 'Complete 50 tasks', icon: Mountain },
  { id: 'canvas-master', name: 'Canvas Master', description: 'Complete all Business Canvas tasks', icon: Palette },
  { id: 'team-builder', name: 'Team Builder', description: 'Complete "Build Culture"', icon: Handshake },
  { id: 'unicorn', name: 'Unicorn', description: 'Complete all 100 tasks', icon: Crown },
];

export function getLevelForPoints(points: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getLevelProgress(points: number): number {
  const level = getLevelForPoints(points);
  const range = level.maxPoints - level.minPoints;
  const progress = points - level.minPoints;
  return Math.min(100, Math.round((progress / range) * 100));
}

export function getNextLevel(points: number): Level | null {
  const current = getLevelForPoints(points);
  const idx = LEVELS.indexOf(current);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function getEarnedBadges(completedTasks: number[], streak: number): Badge[] {
  const earned: Badge[] = [];
  const ct = new Set(completedTasks);
  
  const findBadge = (id: string) => {
    const badge = BADGES.find(b => b.id === id);
    if (!badge) throw new Error(`Badge not found: ${id}`);
    return badge;
  };

  if (ct.size >= 1) earned.push(findBadge('first-step'));
  if ([1,2,3,4].every(n => ct.has(n))) earned.push(findBadge('problem-found'));
  if ([5,6,7].every(n => ct.has(n))) earned.push(findBadge('visionary'));
  if (Array.from({length:20}, (_,i) => i+1).every(n => ct.has(n))) earned.push(findBadge('blueprint-ready'));
  if (ct.has(31)) earned.push(findBadge('mvp-shipped'));
  if (ct.has(42)) earned.push(findBadge('funded'));
  if (ct.has(68)) earned.push(findBadge('go-live'));
  if ([75,76,77,78,79,80,81].every(n => ct.has(n))) earned.push(findBadge('data-driven'));
  if ([82,83,84,85,86,87,88,89,90,91,92,93,94].every(n => ct.has(n))) earned.push(findBadge('optimized'));
  if (ct.size >= 100) earned.push(findBadge('unicorn'));
  if (streak >= 7) earned.push(findBadge('streak-7'));
  if (streak >= 30) earned.push(findBadge('streak-30'));
  if (ct.size >= 50) earned.push(findBadge('half-way'));
  if ([14,15,16,17,18,19].every(n => ct.has(n))) earned.push(findBadge('canvas-master'));
  if ([72,73,74].every(n => ct.has(n))) earned.push(findBadge('team-builder'));
  return earned;
}
