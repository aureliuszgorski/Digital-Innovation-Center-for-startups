'use client';

import React, { useState, useEffect } from 'react';
import { useGarage } from '@/context/GarageContext';
import { 
  Sparkles, Lock, Unlock, Coins, Briefcase, 
  ArrowUpRight, Check, X, Award
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  value: string;
  partner: string;
  partnerDetails: string;
  description: string;
  requirementText: string;
  accentColor: string;
  stageColor: string;
  stageName: string;
  type: string;
  checkEligible: (completedCount: number, completedList: number[]) => boolean;
  progressText: (completedCount: number, completedList: number[]) => string;
  progressPercent: (completedCount: number, completedList: number[]) => number;
}

export default function ResourcesPage() {
  const { completedTasks, startupName, founderName } = useGarage();
  const [mounted, setMounted] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [appliedResources, setAppliedResources] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [useCaseText, setUseCaseText] = useState('');

  // Local state persistence for applications
  useEffect(() => {
    const saved = localStorage.getItem('applied-resources');
    let parsed: string[] = [];
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    setTimeout(() => {
      setAppliedResources(parsed);
      setMounted(true);
    }, 0);
  }, []);

  const totalCompleted = completedTasks.length;

  const resources: Resource[] = [
    {
      id: 'google-25k',
      title: '$25k Infrastructure Grant',
      value: '$25,000',
      partner: 'Google Cloud for Startups',
      partnerDetails: 'Official Infrastructure Credit Partner',
      description: 'Kickstart your hosting, database storage, and early API testing. Includes full access to Firebase, Google Cloud Platform, and maps API credits to build out your initial architecture.',
      requirementText: 'Requires completing all 20 SETUP stage tasks (Tasks 1 to 20).',
      accentColor: '#22c55e', // Setup stage green
      stageColor: 'rgba(34, 197, 94, 0.12)',
      stageName: 'SETUP STAGE',
      type: 'Cloud Credits',
      checkEligible: (count, list) => {
        const setupCompleted = list.filter(n => n >= 1 && n <= 20).length;
        return setupCompleted >= 20;
      },
      progressText: (count, list) => {
        const completed = list.filter(n => n >= 1 && n <= 20).length;
        return `${completed} / 20 Setup Tasks`;
      },
      progressPercent: (count, list) => {
        const completed = list.filter(n => n >= 1 && n <= 20).length;
        return Math.min(100, Math.round((completed / 20) * 100));
      }
    },
    {
      id: 'google-100k',
      title: '$100k Infrastructure Grant',
      value: '$100,000',
      partner: 'Google Cloud for Startups',
      partnerDetails: 'Official Scale Credit Partner',
      description: 'Scale your product, host high-volume databases, and utilize AI/GPU compute platforms. Designed for startups ready to support thousands of active users and train custom models.',
      requirementText: 'Requires completing at least 40 tasks across the system.',
      accentColor: '#B4F052', // Launch stage yellow/green
      stageColor: 'rgba(180, 240, 82, 0.12)',
      stageName: 'LAUNCH STAGE',
      type: 'AI & GPU Compute',
      checkEligible: (count) => count >= 40,
      progressText: (count) => `${count} / 40 Tasks`,
      progressPercent: (count) => Math.min(100, Math.round((count / 40) * 100))
    },
    {
      id: 'investors-1m',
      title: 'Up to $1M MVP Funding',
      value: 'Up to $1,000,000',
      partner: "Investor's Lounge",
      partnerDetails: 'Strategic Syndicate Partner',
      description: 'Seed capital to commercialize your product, expand your client pipeline, and transition from MVP to a scaling enterprise. Direct pitch-deck review and feedback from lead partners.',
      requirementText: 'Requires reaching the SCALE stage (completing at least 70 tasks).',
      accentColor: '#a855f7', // Scale stage purple
      stageColor: 'rgba(168, 85, 247, 0.12)',
      stageName: 'SCALE STAGE',
      type: 'Venture Capital',
      checkEligible: (count) => count >= 70,
      progressText: (count) => `${count} / 70 Tasks`,
      progressPercent: (count) => Math.min(100, Math.round((count / 70) * 100))
    }
  ];

  const handleApplyClick = (res: Resource) => {
    setSelectedResource(res);
    setSubmitSuccess(false);
    setUseCaseText('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResource) return;

    const updated = [...appliedResources, selectedResource.id];
    setAppliedResources(updated);
    localStorage.setItem('applied-resources', JSON.stringify(updated));
    setSubmitSuccess(true);
  };

  const eligibleCount = resources.filter(r => r.checkEligible(totalCompleted, completedTasks)).length;

  return (
    <div className="max-w-6xl mx-auto pb-12 relative animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4F052]/10 border border-[#B4F052]/20 text-xs font-semibold text-[#B4F052] mb-3">
          <Sparkles size={12} />
          <span>FOUNDER BENEFITS PORTFOLIO</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Partner Resources & Grants</h1>
        <p className="text-white/60 text-sm max-w-2xl">
          Unlock pre-negotiated infrastructure credits, GPU/AI compute support, and direct seed-funding checks as you build, launch, and scale through the 100 tasks.
        </p>
      </div>

      {/* Overview Stats */}
      {mounted && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-5 flex items-center justify-between border-white/[0.06]">
            <div>
              <div className="text-xs text-white/40 uppercase font-medium">Total Capital Value</div>
              <div className="text-2xl font-bold mt-1 text-[#B4F052]">$1,125,000</div>
            </div>
            <Coins className="text-[#B4F052]/20" size={32} />
          </div>
          <div className="glass-card p-5 flex items-center justify-between border-white/[0.06]">
            <div>
              <div className="text-xs text-white/40 uppercase font-medium">Currently Eligible</div>
              <div className="text-2xl font-bold mt-1 text-white">
                {eligibleCount} / {resources.length}
              </div>
            </div>
            <Award className="text-white/20" size={32} />
          </div>
          <div className="glass-card p-5 flex items-center justify-between border-white/[0.06]">
            <div>
              <div className="text-xs text-white/40 uppercase font-medium">Applications Submitted</div>
              <div className="text-2xl font-bold mt-1 text-white">
                {appliedResources.length}
              </div>
            </div>
            <Briefcase className="text-white/20" size={32} />
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {resources.map((res) => {
          const isEligible = mounted && res.checkEligible(totalCompleted, completedTasks);
          const hasApplied = appliedResources.includes(res.id);
          const progressPct = mounted ? res.progressPercent(totalCompleted, completedTasks) : 0;
          const progressLabel = mounted ? res.progressText(totalCompleted, completedTasks) : '0 Tasks';

          return (
            <div
              key={res.id}
              className="glass-card p-6 flex flex-col justify-between hover:border-white/20 group hover:scale-[1.01] duration-300 relative overflow-hidden"
            >
              {/* Visual Decorative Top Accent Bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-[3px] opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: res.accentColor }}
              />

              <div>
                {/* Meta details */}
                <div className="flex items-center justify-between mb-4">
                  <span 
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border"
                    style={{ color: res.accentColor, backgroundColor: res.stageColor, borderColor: `${res.accentColor}25` }}
                  >
                    {res.stageName}
                  </span>
                  <span className="text-[10px] text-white/40 font-mono uppercase">
                    {res.type}
                  </span>
                </div>

                {/* Title and Value */}
                <h3 className="text-2xl font-black tracking-tight text-white mb-1 group-hover:text-[#B4F052] transition-colors">
                  {res.title}
                </h3>
                <div className="text-xs text-white/50 mb-4">
                  in partnership with <span className="text-white/90 font-medium">{res.partner}</span>
                </div>

                <p className="text-white/60 text-xs leading-relaxed mb-6">
                  {res.description}
                </p>
              </div>

              {/* Requirement Section */}
              <div className="mt-auto">
                <div className="border-t border-white/[0.06] pt-4 mb-4">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-white/40">Task Requirements</span>
                    <span className="font-semibold" style={{ color: isEligible ? '#22c55e' : '#fff' }}>
                      {progressLabel}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${progressPct}%`, backgroundColor: res.accentColor }}
                    />
                  </div>
                </div>

                {/* Status and Action Buttons */}
                {mounted && (
                  <div>
                    {isEligible ? (
                      hasApplied ? (
                        <div className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-white/[0.04] border border-white/[0.08] text-white/50 flex items-center justify-center gap-2">
                          <Check size={14} className="text-[#22c55e]" />
                          Application Submitted
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApplyClick(res)}
                          className="w-full py-3 px-4 rounded-xl text-xs font-bold text-black flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg"
                          style={{ backgroundColor: res.accentColor, boxShadow: `0 4px 12px ${res.accentColor}20` }}
                        >
                          <Unlock size={14} />
                          Claim Resource Grant
                          <ArrowUpRight size={14} className="ml-1" />
                        </button>
                      )
                    ) : (
                      <div className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-white/[0.02] border border-white/[0.04] text-white/30 flex items-center justify-center gap-2">
                        <Lock size={14} />
                        Locked -- {res.requirementText}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Slideout Modal for claiming resources */}
      {selectedResource && (
        <>
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setSelectedResource(null)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 transition-opacity duration-300"
          />

          {/* Modal Element */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-black/95 border border-white/[0.1] shadow-2xl rounded-2xl z-50 p-6 flex flex-col justify-between animate-fade-in">
            <div>
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
                <div>
                  <span 
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border"
                    style={{ 
                      color: selectedResource.accentColor, 
                      backgroundColor: selectedResource.stageColor,
                      borderColor: `${selectedResource.accentColor}25`
                    }}
                  >
                    {selectedResource.stageName}
                  </span>
                  <h2 className="text-xl font-extrabold text-white mt-2 leading-snug">
                    Apply for {selectedResource.value} Credit
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedResource(null)}
                  className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {!submitSuccess ? (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Dynamic Info Cards */}
                  <div className="grid grid-cols-2 gap-3 bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl">
                    <div>
                      <div className="text-[10px] text-white/40 uppercase font-semibold">Startup Name</div>
                      <div className="text-xs font-bold text-white mt-0.5">{startupName || 'Not Set'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40 uppercase font-semibold">Founder Profile</div>
                      <div className="text-xs font-bold text-white mt-0.5">{founderName || 'Not Set'}</div>
                    </div>
                  </div>

                  {/* Partner Specific Info */}
                  <div className="p-3 rounded-xl bg-white/[0.01] border border-white/[0.04]">
                    <div className="text-xs font-semibold text-[#B4F052]">Partner Sponsor</div>
                    <div className="text-[11px] text-white/60 mt-0.5">{selectedResource.partner} -- {selectedResource.partnerDetails}</div>
                  </div>

                  {/* Application Textarea */}
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-2">
                      Describe your infrastructure use-case / roadmap:
                    </label>
                    <textarea
                      required
                      value={useCaseText}
                      onChange={(e) => setUseCaseText(e.target.value)}
                      placeholder="E.g., Host server instances, test database sync, query GPU platforms..."
                      className="w-full h-24 bg-white/[0.03] border border-white/[0.08] hover:border-white/20 focus:border-[#B4F052]/50 text-xs font-medium text-white rounded-xl p-3 outline-none transition-all"
                    />
                  </div>

                  <div className="pt-2 border-t border-white/[0.08] flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedResource(null)}
                      className="py-2.5 px-4 rounded-xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/[0.03] border border-white/[0.06] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 px-5 font-bold rounded-xl text-xs text-black hover:opacity-95 shadow-lg shadow-[#B4F052]/10 transition-all"
                      style={{ backgroundColor: selectedResource.accentColor }}
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-6 text-center">
                  <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4 bg-[#22c55e]/10 border border-[#22c55e]/20">
                    <Check className="text-[#22c55e]" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Application Submitted!</h3>
                  <p className="text-white/60 text-xs max-w-xs mx-auto mt-2 leading-relaxed">
                    Your request for the <strong>{selectedResource.value} Grant</strong> has been sent to our partner network. Approval typically takes 24 to 48 hours.
                  </p>
                  <button
                    onClick={() => setSelectedResource(null)}
                    className="mt-6 py-2 px-6 bg-[#B4F052] text-black font-bold rounded-xl text-xs hover:opacity-90 transition-all"
                  >
                    Return to Resources
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
