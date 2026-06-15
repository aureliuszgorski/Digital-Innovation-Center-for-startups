'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ListChecks, CalendarDays, Trophy, Crown, 
  Users, Globe, Brain, Presentation, Briefcase 
} from 'lucide-react';

const GROUPS = [
  {
    title: 'Digital Innovation Center',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/ai-skills', label: 'AI Skills', icon: Brain },
      { href: '/tasks', label: 'Tasks', icon: ListChecks },
      { href: '/sprints', label: 'Sprints', icon: CalendarDays },
      { href: '/badges', label: 'Badges', icon: Trophy },
    ]
  },
  {
    title: 'Innovation Center',
    items: [
      { href: '/challenges', label: 'Challenges', icon: Globe },
      { href: '/coworking', label: 'Coworking', icon: Users },
      { href: '/pitch-to-pilot-program', label: 'Pitch to pilot program', icon: Presentation },
      { href: '/pitch-to-investors', label: 'Pitch to investors', icon: Briefcase },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 flex flex-col glass-card rounded-none border-l-0 border-t-0 border-b-0 z-50">
      <div className="p-5 border-b border-white/[0.08]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-black" style={{ background: '#B4F052' }}>
            <Crown size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[11px] font-bold leading-tight" style={{ color: '#B4F052' }}>Digital Innovation Center</div>
            <div className="text-[9px] text-white/40 leading-none mt-0.5">for Startups @ District.org</div>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
        {GROUPS.map(group => (
          <div key={group.title} className="space-y-1.5">
            <div className="px-3 text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">
              {group.title}
            </div>
            {group.items.map(n => {
              const active = n.href === '/' ? pathname === '/' : pathname.startsWith(n.href);
              const Icon = n.icon;
              return (
                <Link 
                  key={n.href} 
                  href={n.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                    active 
                      ? 'bg-[#B4F052]/20 text-[#B4F052] font-semibold' 
                      : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon size={16} />
                  {n.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/[0.08] text-xs text-white/30">
        v1.0 MVP
      </div>
    </aside>
  );
}
