'use client';
import { useState, useEffect } from 'react';
import { CHALLENGES, Challenge } from '@/data/challenges';
import { 
  Search, Star, Clock, Trophy, X, Sparkles, 
  ArrowUpRight, Compass
} from 'lucide-react';

export default function ChallengesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load starred challenges from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('starred-challenges');
    let parsed: string[] = [];
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing starred challenges', e);
      }
    }
    setTimeout(() => {
      setStarredIds(parsed);
      setMounted(true);
    }, 0);
  }, []);

  // Save starred challenges to localStorage
  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the drawer when clicking the star
    let updated: string[];
    if (starredIds.includes(id)) {
      updated = starredIds.filter(x => x !== id);
    } else {
      updated = [...starredIds, id];
    }
    setStarredIds(updated);
    localStorage.setItem('starred-challenges', JSON.stringify(updated));
  };

  const categories = [
    'All', 
    'Energy/Climate', 
    'Health', 
    'Education/Work', 
    'Fintech/Legaltech', 
    'Cybersecurity', 
    'Industry/Logistics', 
    'AgriFood/Water', 
    'Construction/UrbanTech', 
    'GovTech/Resilience', 
    'AI for Business'
  ];

  // Filter challenges based on search query and category
  const filteredChallenges = CHALLENGES.filter(c => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const expandedChallenge = CHALLENGES.find(c => c.id === expandedId);

  // Color mapping helpers
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Energy/Climate': 
        return { text: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.2)' };
      case 'Health': 
        return { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.2)' };
      case 'Education/Work': 
        return { text: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.2)' };
      case 'Fintech/Legaltech': 
        return { text: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)', border: 'rgba(99, 102, 241, 0.2)' };
      case 'Cybersecurity': 
        return { text: '#eab308', bg: 'rgba(234, 179, 8, 0.12)', border: 'rgba(234, 179, 8, 0.2)' };
      case 'Industry/Logistics': 
        return { text: '#f97316', bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.2)' };
      case 'AgriFood/Water': 
        return { text: '#14b8a6', bg: 'rgba(20, 184, 166, 0.12)', border: 'rgba(20, 184, 166, 0.2)' };
      case 'Construction/UrbanTech': 
        return { text: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.2)' };
      case 'GovTech/Resilience': 
        return { text: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.2)' };
      case 'AI for Business': 
        return { text: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.2)' };
      default: 
        return { text: '#ffffff', bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.15)' };
    }
  };

  const getAmbitionColor = (ambition: 'A1' | 'A2' | 'A3') => {
    switch (ambition) {
      case 'A1': 
        return { text: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.2)', label: 'A1: Niche Wedge' };
      case 'A2': 
        return { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.2)', label: 'A2: Platform / Workflow' };
      case 'A3': 
        return { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.2)', label: 'A3: Infrastructure / System' };
      default: 
        return { text: '#ffffff', bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.15)', label: '' };
    }
  };

  const getCategoryCount = (category: string) => {
    if (category === 'All') return CHALLENGES.length;
    return CHALLENGES.filter(c => c.category === category).length;
  };

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#B4F052] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 relative px-4">
      {/* Header & Introduction Banner */}
      <div className="mb-8 animate-fade-in glass-card p-6 border-[#B4F052]/20 relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B4F052]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4F052]/10 border border-[#B4F052]/20 text-xs font-semibold text-[#B4F052] mb-3">
              <Sparkles size={12} />
              <span>100 STARTUP CHALLENGES PORTFOLIO</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">
              Ambitious & Feasible Challenges
            </h1>
            
            {/* Highly visible English callout box */}
            <div className="mt-4 p-4 rounded-2xl bg-[#B4F052]/10 border-2 border-[#B4F052] relative overflow-hidden shadow-[0_0_30px_rgba(180,240,82,0.15)] max-w-3xl">
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 rounded-xl bg-black text-[#B4F052] flex-shrink-0 mt-0.5 border border-[#B4F052]/30 shadow-inner">
                  <Sparkles size={16} className="animate-pulse" />
                </div>
                <div>
                  <h2 className="text-sm font-black tracking-tight text-white mb-1.5 uppercase flex items-center gap-1.5">
                    Looking for a startup idea? 💡
                  </h2>
                  <p className="text-white text-xs leading-relaxed font-medium">
                    If you have trouble choosing a direction, <span className="text-[#B4F052] font-black underline decoration-2 underline-offset-2">it is worth going beyond your immediate interests</span>. True market opportunities often hide in niches and hard problems within technical, energy, or industrial sectors. By solving real pain points, you build a business based on actual demand, rather than just your own hypotheses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-slide-up">
        {/* Left Sidebar Filter (1/4 width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search Box */}
          <div className="glass-card p-4 space-y-3">
            <h3 className="text-xs font-bold text-[#B4F052] uppercase tracking-wider">Search</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={14} />
              <input
                type="text"
                placeholder="Search title, desc, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] hover:border-white/20 focus:border-[#B4F052]/50 focus:bg-white/[0.05] text-white rounded-xl py-2 pl-9 pr-8 text-xs font-medium outline-none transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Sectors/Categories Sidebar Filter */}
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#B4F052] uppercase tracking-wider">Sectors</h3>
              {selectedCategory !== 'All' && (
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className="text-[10px] text-white/40 hover:text-[#B4F052] transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
              {categories.map(cat => {
                const isSelected = selectedCategory === cat;
                const count = getCategoryCount(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-200 text-left ${
                      isSelected
                        ? 'bg-[#B4F052]/15 border border-[#B4F052]/30 text-[#B4F052] font-semibold'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.03] border border-transparent'
                    }`}
                  >
                    <span>{cat === 'All' ? 'All Sectors' : cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                      isSelected ? 'bg-[#B4F052]/20 text-[#B4F052]' : 'bg-white/[0.04] text-white/40'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Small Bookmarks Quick View */}
          {mounted && starredIds.length > 0 && (
            <div className="glass-card p-4 border-[#B4F052]/20 animate-fade-in">
              <div className="flex items-center gap-2 text-[#B4F052]">
                <Star size={14} className="fill-[#B4F052]/20" />
                <span className="text-xs font-bold uppercase tracking-wider">Bookmarked ({starredIds.length})</span>
              </div>
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                {CHALLENGES.filter(c => starredIds.includes(c.id)).map(c => (
                  <button
                    key={c.id}
                    onClick={() => setExpandedId(c.id)}
                    className="w-full text-left text-[11px] text-white/70 hover:text-[#B4F052] truncate block bg-white/[0.02] border border-white/[0.04] hover:border-white/10 p-2 rounded-lg transition-all"
                  >
                    #{c.index} {c.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content Area: Grid of Challenges (3/4 width) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center text-xs text-white/40 px-1">
            <div>
              Showing {filteredChallenges.length} of {CHALLENGES.length} challenges
            </div>
            {selectedCategory !== 'All' && (
              <div>
                Sector: <span className="text-[#B4F052] font-semibold">{selectedCategory}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChallenges.length > 0 ? (
              filteredChallenges.map((c) => {
                const catColors = getCategoryColor(c.category);
                const ambColors = getAmbitionColor(c.ambition);
                const isStarred = starredIds.includes(c.id);

                return (
                  <div
                    key={c.id}
                    onClick={() => setExpandedId(c.id)}
                    className="glass-card p-5 flex flex-col justify-between hover:border-white/20 cursor-pointer group hover:scale-[1.01] duration-300 relative overflow-hidden"
                  >
                    {/* Visual Side Accent line */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-[3px] opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: catColors.text }}
                    />

                    <div>
                      {/* Meta Tags Row */}
                      <div className="flex items-center justify-between mb-3 pl-1">
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border"
                            style={{ color: catColors.text, backgroundColor: catColors.bg, borderColor: catColors.border }}
                          >
                            {c.category}
                          </span>
                          <span 
                            className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border"
                            style={{ color: ambColors.text, backgroundColor: ambColors.bg, borderColor: ambColors.border }}
                          >
                            {c.ambition}
                          </span>
                        </div>

                        {mounted && (
                          <button
                            onClick={(e) => toggleStar(c.id, e)}
                            className={`p-1.5 rounded-lg border transition-all duration-200 ${
                              isStarred 
                                ? 'bg-[#B4F052]/10 border-[#B4F052]/30 text-[#B4F052] scale-110' 
                                : 'bg-white/[0.02] border-white/[0.06] text-white/30 hover:text-white/70 hover:border-white/10'
                            }`}
                          >
                            <Star size={12} className={isStarred ? 'fill-[#B4F052]' : ''} />
                          </button>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-white group-hover:text-[#B4F052] transition-colors duration-200 flex items-start gap-1.5 pl-1 leading-snug">
                        <span className="text-white/30 text-xs font-mono">#{c.index}</span>
                        <span className="flex-1">{c.title}</span>
                        <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#B4F052] flex-shrink-0 mt-0.5" />
                      </h3>

                      {/* Description */}
                      <p className="text-white/60 text-xs mt-2 leading-relaxed line-clamp-2 pl-1">
                        {c.description}
                      </p>
                    </div>

                    {/* Footer Details */}
                    <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-white/40 pl-1">
                      <div className="flex items-center gap-1 max-w-[65%]">
                        <Trophy size={10} className="text-[#B4F052] flex-shrink-0" />
                        <span className="truncate" title={c.impact}>{c.impact}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Clock size={10} className="text-white/30" />
                        <span className="capitalize">{c.timeline} MVP</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 glass-card py-16 px-4 text-center">
                <Compass size={40} className="mx-auto text-white/20 mb-3" />
                <p className="text-sm font-semibold text-white/80">No challenges match your criteria</p>
                <p className="text-white/40 text-xs mt-1">Try adjusting your search query or selected sector.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
