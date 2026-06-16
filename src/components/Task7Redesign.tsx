'use client';
import React, { useState, useEffect } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, ArrowRight, Layers, Trash2, Star, AlertTriangle, Sparkles, FileText, Filter, RefreshCw, GitCommit, ChevronRight, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Milestone {
  id: string;
  category: string;
  title: string;
  horizon: string;
}

interface Step {
  id: string;
  milestoneId: string;
  title: string;
  dependency: string;
  unknowns: string;
}

const STARTUP_PHASES = [
  'Problem Clarity',
  'Solution Definition',
  'MVP & Validation',
  'Channel & Retention',
  'Scale Systems'
] as const;

const MOSCOW_PRIORITIES = [
  'Must-Have',
  'Should-Have',
  'Nice-To-Have',
  'Later'
] as const;

const DEFAULT_FEEDBACK_LOOPS: Record<string, string> = {
  'Problem Clarity': 'Conduct weekly user interviews (minimum 3) to test problem urgency.',
  'Solution Definition': 'Track landing page conversion rate; target > 15% email signup rate.',
  'MVP & Validation': 'Measure 30-day cohort retention; target > 40% active usage.',
  'Channel & Retention': 'Monitor viral coefficient and organic referral rates.',
  'Scale Systems': 'Track server response times and automated crash report frequency.'
};

export default function Task7Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput, completedTasks } = useGarage();

  // 1. Prerequisite verification: Task 6 must be completed
  const isTask6Complete = completedTasks.includes(6);

  // Load Task 6 Context Inputs
  const rawMilestones = getTaskInput(6, 'milestones');
  const rawSteps = getTaskInput(6, 'steps');

  const milestones: Milestone[] = React.useMemo(() => {
    if (rawMilestones) {
      try { return JSON.parse(rawMilestones); } catch {}
    }
    return [];
  }, [rawMilestones]);

  const [steps, setSteps] = useState<Step[]>(() => {
    if (rawSteps) {
      try { return JSON.parse(rawSteps); } catch {}
    }
    return [];
  });
  // Task 7 states (lazy initialized from context storage)
  const [activeTab, setActiveTab] = useState<number>(1);

  // MoSCoW priorities state
  const [priorities, setPriorities] = useState<Record<string, 'Must-Have' | 'Should-Have' | 'Nice-To-Have' | 'Later'>>(() => {
    const raw = getTaskInput(7, 'priorities');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return {};
  });

  // Lead Times state
  const [leadTimes, setLeadTimes] = useState<Record<string, string>>(() => {
    const raw = getTaskInput(7, 'leadTimes');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return {};
  });

  // Sequencing steps into startup phases
  const [phaseSequences, setPhaseSequences] = useState<Record<string, string>>(() => {
    const raw = getTaskInput(7, 'phaseSequences');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return {};
  });

  // Feedback loops per phase state
  const [feedbackLoops, setFeedbackLoops] = useState<Record<string, string>>(() => {
    const raw = getTaskInput(7, 'feedbackLoops');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return DEFAULT_FEEDBACK_LOOPS;
  });

  // Filters for review step
  const [reviewFilter, setReviewFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock AI Refine loading states
  const [isAiRefining, setIsAiRefining] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);

  // Sync state values on changes
  const saveAll = React.useCallback(() => {
    setTaskInput(7, 'steps_cleaned', JSON.stringify(steps));
    setTaskInput(7, 'priorities', JSON.stringify(priorities));
    setTaskInput(7, 'leadTimes', JSON.stringify(leadTimes));
    setTaskInput(7, 'phaseSequences', JSON.stringify(phaseSequences));
    setTaskInput(7, 'feedbackLoops', JSON.stringify(feedbackLoops));

    // Compile readable roadmap text summary for default Next.js fields
    const roadmapLines: string[] = [];
    STARTUP_PHASES.forEach(phase => {
      roadmapLines.push(`[PHASE: ${phase}]`);
      roadmapLines.push(`Feedback Loop: ${feedbackLoops[phase] || 'None'}`);
      const phaseSteps = steps.filter(s => phaseSequences[s.id] === phase);
      phaseSteps.forEach(s => {
        const priority = priorities[s.id] || 'Must-Have';
        const lead = leadTimes[s.id] || '3 days';
        roadmapLines.push(`  - ${s.title} (${priority}, Lead: ${lead})`);
      });
      roadmapLines.push('');
    });
    setTaskInput(7, 'notes', roadmapLines.join('\n'));
    setTaskInput(7, 'deliverable', 'Roadmap v0.1 Document');
  }, [steps, priorities, leadTimes, phaseSequences, feedbackLoops, setTaskInput]);

  useEffect(() => {
    saveAll();
  }, [saveAll]);

  // Merge tool simulation helper
  const handleMergeSteps = (sourceId: string, targetId: string) => {
    const sourceStep = steps.find(s => s.id === sourceId);
    const targetStep = steps.find(s => s.id === targetId);
    if (!sourceStep || !targetStep) return;

    if (confirm(`Do you want to merge "${sourceStep.title}" into "${targetStep.title}"?`)) {
      // Create merged title
      const mergedTitle = `${targetStep.title} (inc. ${sourceStep.title})`;
      const updatedSteps = steps.map(s => {
        if (s.id === targetId) return { ...s, title: mergedTitle };
        return s;
      }).filter(s => s.id !== sourceId);
      setSteps(updatedSteps);

      // Clean up priority and lead time keys
      const nextPriorities = { ...priorities };
      delete nextPriorities[sourceId];
      setPriorities(nextPriorities);

      const nextLeads = { ...leadTimes };
      delete nextLeads[sourceId];
      setLeadTimes(nextLeads);

      const nextPhases = { ...phaseSequences };
      delete nextPhases[sourceId];
      setPhaseSequences(nextPhases);
    }
  };

  const handleRemoveStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const handleAiRefine = () => {
    setIsAiRefining(true);
    setTimeout(() => {
      setIsAiRefining(false);
      setAiTip('AI Roadmap Planner optimized lead times based on historical founder benchmarks. Phase sequence adjusted to guarantee that user interview outputs directly feed landing page copy before MVP code begins.');
      
      // Auto sequence remaining steps if empty
      const nextPriorities = { ...priorities };
      const nextLeads = { ...leadTimes };
      const nextPhases = { ...phaseSequences };

      steps.forEach((s, idx) => {
        if (!nextPriorities[s.id]) {
          nextPriorities[s.id] = idx % 3 === 0 ? 'Must-Have' : idx % 3 === 1 ? 'Should-Have' : 'Nice-To-Have';
        }
        if (!nextLeads[s.id]) {
          nextLeads[s.id] = idx % 2 === 0 ? '3 days' : '1 week';
        }
        if (!nextPhases[s.id]) {
          nextPhases[s.id] = STARTUP_PHASES[idx % STARTUP_PHASES.length];
        }
      });

      setPriorities(nextPriorities);
      setLeadTimes(nextLeads);
      setPhaseSequences(nextPhases);
    }, 1200);
  };

  const handleComplete = () => {
    saveAll();
    completeTask(7);
    router.push('/tasks');
  };

  // Warning panel if Task 6 is incomplete
  if (!isTask6Complete) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="glass-card p-8 border border-white/[0.08] inline-block max-w-lg">
          <AlertTriangle className="mx-auto mb-4 text-[#B4F052]" size={48} />
          <h2 className="text-xl font-bold mb-2">Task 6 Incomplete</h2>
          <p className="text-white/60 mb-6 text-sm">
            Please finish and complete Task 6 (Build Operational Step & Milestone Backlog) to map out your raw backlog before streamlining it into a roadmap.
          </p>
          <Link href="/tasks/6" className="inline-flex items-center gap-2 glass-button px-6 py-3 rounded-xl text-sm font-semibold transition-all">
            Go to Task 6
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Filtered steps for Tab 1 Review
  const filteredSteps = steps.filter(s => {
    const assocM = milestones.find(m => m.id === s.milestoneId);
    if (reviewFilter !== 'All' && assocM?.category !== reviewFilter) return false;
    if (searchQuery && !s.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 animate-fade-in text-white">
      {/* Header with Cockpit Metrics */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-8">
        <div>
          <div className="text-[#B4F052] text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Layers size={12} />
            Task 7 Redesign
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Streamline Roadmap v0.1</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Prioritize your backlog using MoSCoW rules, sequence tasks into startup phases, and attach feedback loop indicators to preserve agility.
          </p>
        </div>

        {/* Cockpit Card */}
        <div className="glass-card p-4 border border-white/[0.08] flex items-center gap-6 text-xs bg-black/40 backdrop-blur-md">
          <div className="border-r border-white/[0.08] pr-4">
            <div className="text-white/40 mb-0.5">Alignment</div>
            <div className="text-[#B4F052] font-semibold uppercase tracking-wider">Operational</div>
          </div>
          <div className="border-r border-white/[0.08] pr-4">
            <div className="text-white/40 mb-0.5">Difficulty</div>
            <div className="flex gap-0.5 text-[#B4F052]">
              <Star size={12} className="fill-[#B4F052]" />
              <span className="ml-1 text-white font-medium">Beginner</span>
            </div>
          </div>
          <div>
            <div className="text-white/40 mb-0.5">Duration</div>
            <div className="text-white font-semibold">~2 hours</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Wizard (Left) & Live Roadmap (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Wizard Panel (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs header */}
          <div className="flex border-b border-white/[0.08] overflow-x-auto pb-px gap-2">
            {[
              { id: 1, label: '1. Review Backlog' },
              { id: 2, label: '2. Merge/Clean' },
              { id: 3, label: '3. MoSCoW' },
              { id: 4, label: '4. Lead Times' },
              { id: 5, label: '5. Sequence' },
              { id: 6, label: '6. Feedback Loops' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-semibold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#B4F052] text-[#B4F052] bg-white/[0.02]'
                    : 'border-transparent text-white/40 hover:text-white/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Wizard Panels */}
          <div className="glass-card p-6 border border-white/[0.06] space-y-6">
            
            {/* Step 1: Review Raw Inventory */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Filter size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 1: Review Raw Inventory</h3>
                </div>
                <p className="text-xs text-white/60">
                  Filter and inspect the raw backlog steps imported from Task 6. Search for key terms to locate steps.
                </p>

                <div className="flex flex-col md:flex-row gap-3 pt-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search steps..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <select
                      value={reviewFilter}
                      onChange={e => setReviewFilter(e.target.value)}
                      className="bg-black border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="All">All Categories</option>
                      <option value="Problem Validation">Problem Validation</option>
                      <option value="Solution Validation">Solution Validation</option>
                      <option value="MVP Launch">MVP Launch</option>
                      <option value="Channel Growth">Channel Growth</option>
                      <option value="System Scale">System Scale</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {filteredSteps.map(s => {
                    const assocM = milestones.find(m => m.id === s.milestoneId);
                    return (
                      <div key={s.id} className="p-2.5 rounded-lg bg-white/[0.01] border border-white/[0.04] text-xs flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-white/90">{s.title}</span>
                          <span className="text-[9px] text-[#B4F052]/60 block mt-0.5">{assocM?.title || 'Milestone: None'}</span>
                        </div>
                        <span className="text-[8px] bg-white/[0.06] text-white/40 px-1.5 py-0.5 rounded uppercase font-mono">ID: {s.id.slice(0, 4)}</span>
                      </div>
                    );
                  })}
                  {filteredSteps.length === 0 && (
                    <div className="text-center py-8 text-white/20 italic text-xs">No matching steps found.</div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Remove/Merge Duplicates Tool */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <RefreshCw size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 2: Clean Backlog / Merge Duplicates</h3>
                </div>
                <p className="text-xs text-white/60">
                  Combine overlapping tasks or purge redundant tasks to simplify and focus your workload.
                </p>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {steps.map((step) => {
                    // Find potential merge targets (any step that is NOT this step)
                    const mergeTargets = steps.filter(x => x.id !== step.id);
                    return (
                      <div key={step.id} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] space-y-2 text-xs">
                        <div className="flex justify-between items-start gap-4">
                          <span className="font-semibold text-white/80">{step.title}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRemoveStep(step.id)}
                              className="text-white/30 hover:text-rose-400 p-1 border border-white/[0.08] hover:border-rose-400/20 rounded bg-white/[0.02]"
                              title="Delete step"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {mergeTargets.length > 0 && (
                          <div className="flex items-center gap-2 pt-1 border-t border-white/[0.03]">
                            <span className="text-[9px] text-white/40">Merge into:</span>
                            <select
                              onChange={e => {
                                if (e.target.value) {
                                  handleMergeSteps(step.id, e.target.value);
                                  e.target.value = ''; // Reset select
                                }
                              }}
                              className="bg-black border border-white/[0.08] text-[9px] text-white/60 rounded px-1 py-0.5 focus:outline-none"
                              defaultValue=""
                            >
                              <option value="" disabled>Select target step...</option>
                              {mergeTargets.map(t => (
                                <option key={t.id} value={t.id}>{t.title.slice(0, 40)}...</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {steps.length === 0 && (
                    <div className="text-center py-8 text-white/20 italic">All steps cleaned or deleted. Add more in Task 6.</div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Classify Priority (MoSCoW) */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Star size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 3: MoSCoW Prioritization</h3>
                </div>
                <p className="text-xs text-white/60">
                  Assign priorities to lock in a core focus. Must-Haves are non-negotiable validation steps; Laters are post-PMF optimizations.
                </p>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {steps.map((step) => {
                    const currentPriority = priorities[step.id] || 'Must-Have';
                    return (
                      <div key={step.id} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                        <span className="font-semibold text-white/80">{step.title}</span>
                        <div className="flex gap-1">
                          {MOSCOW_PRIORITIES.map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => {
                                setPriorities({ ...priorities, [step.id]: p });
                              }}
                              className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all ${
                                currentPriority === p
                                  ? p === 'Must-Have' ? 'bg-[#B4F052] text-black' :
                                    p === 'Should-Have' ? 'bg-blue-500 text-white' :
                                    p === 'Nice-To-Have' ? 'bg-purple-500 text-white' : 'bg-white/20 text-white/60'
                                  : 'bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Map Dependencies & Lead Times */}
            {activeTab === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <GitCommit size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 4: Lead Times & Dependency Map</h3>
                </div>
                <p className="text-xs text-white/60">
                  Assign estimated durations/lead times to each task to calculate timing horizons accurately.
                </p>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {steps.map((step) => {
                    const lead = leadTimes[step.id] || '3 days';
                    return (
                      <div key={step.id} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-white/80">{step.title}</span>
                          <span className="text-[9px] text-purple-400">Dependency: {step.dependency}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-white/40">Estimated Duration:</span>
                          <select
                            value={lead}
                            onChange={e => setLeadTimes({ ...leadTimes, [step.id]: e.target.value })}
                            className="bg-black border border-white/[0.08] text-xs rounded px-2 py-1 text-white focus:outline-none focus:border-[#B4F052]/40"
                          >
                            <option value="1 day">1 day</option>
                            <option value="2 days">2 days</option>
                            <option value="3 days">3 days</option>
                            <option value="5 days">5 days</option>
                            <option value="1 week">1 week</option>
                            <option value="2 weeks">2 weeks</option>
                            <option value="1 month">1 month</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 5: Sequence Active Steps into Startup Phases */}
            {activeTab === 5 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Layers size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 5: Sequence Steps into Startup Phases</h3>
                </div>
                <p className="text-xs text-white/60">
                  Align steps to sequential validation phases. Verify that earlier phases validate underlying demand before building.
                </p>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {steps.map((step) => {
                    const currentPhase = phaseSequences[step.id] || 'Problem Clarity';
                    return (
                      <div key={step.id} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] space-y-2 text-xs">
                        <span className="font-semibold text-white/80 block">{step.title}</span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {STARTUP_PHASES.map(phase => (
                            <button
                              key={phase}
                              type="button"
                              onClick={() => setPhaseSequences({ ...phaseSequences, [step.id]: phase })}
                              className={`px-2 py-1 rounded text-[9px] font-bold transition-all ${
                                currentPhase === phase
                                  ? 'bg-[#B4F052] text-black font-semibold'
                                  : 'bg-white/[0.02] border border-white/[0.06] text-white/40 hover:text-white'
                              }`}
                            >
                              {phase}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 6: Add Feedback Loops per Phase */}
            {activeTab === 6 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <RefreshCw size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 6: Phase Feedback Loops</h3>
                </div>
                <p className="text-xs text-white/60">
                  For each execution phase, define the feedback loop mechanism that checks whether we are on the right path or should pivot.
                </p>

                <div className="space-y-3 pt-2">
                  {STARTUP_PHASES.map(phase => (
                    <div key={phase} className="space-y-1 text-xs">
                      <label className="text-[10px] font-bold text-[#B4F052] uppercase block tracking-wider">{phase}</label>
                      <input
                        type="text"
                        value={feedbackLoops[phase] || ''}
                        onChange={e => setFeedbackLoops({ ...feedbackLoops, [phase]: e.target.value })}
                        placeholder={`Define a feedback metric or checkpoint for ${phase}...`}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex justify-between border-t border-white/[0.06] pt-4 mt-6">
              <button
                type="button"
                onClick={() => setActiveTab(prev => Math.max(1, prev - 1))}
                disabled={activeTab === 1}
                className="px-4 py-2 rounded-xl text-xs bg-white/[0.04] hover:bg-white/[0.08] text-white/60 font-semibold disabled:opacity-40 transition-all"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveTab(prev => Math.min(6, prev + 1))}
                disabled={activeTab === 6}
                className="px-4 py-2 rounded-xl text-xs bg-[#B4F052] text-black font-semibold hover:opacity-90 disabled:opacity-40 transition-all"
              >
                Next
              </button>
            </div>

          </div>
        </div>

        {/* Live Roadmap View (Col span 1) */}
        <div className="space-y-6">
          <div className="glass-card p-6 border border-white/[0.08] bg-black/60 backdrop-blur-md space-y-6">
            <div className="border-b border-white/[0.08] pb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FileText size={16} className="text-[#B4F052]" />
                <h3 className="text-sm font-bold">Streamlined Roadmap v0.1</h3>
              </div>
              <span className="text-[9px] font-mono text-white/30">Active Plan</span>
            </div>

            {/* Timed Startup Phases Layout */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 text-xs">
              {STARTUP_PHASES.map((phase) => {
                const phaseSteps = steps.filter(s => phaseSequences[s.id] === phase);
                const loop = feedbackLoops[phase] || 'None defined';
                return (
                  <div key={phase} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] relative">
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-1 mb-2">
                      <span className="font-extrabold text-xs text-white">{phase}</span>
                      <ChevronRight size={12} className="text-white/30" />
                    </div>

                    {/* Feedback loop */}
                    <div className="mb-2 p-1.5 rounded bg-[#B4F052]/5 border border-[#B4F052]/10 text-[9px] text-[#B4F052]">
                      <span className="font-bold uppercase tracking-wider block text-[8px] opacity-75">Feedback Loop:</span>
                      {loop}
                    </div>

                    {/* Phase Steps list */}
                    <div className="space-y-1.5">
                      {phaseSteps.map(s => {
                        const priority = priorities[s.id] || 'Must-Have';
                        const lead = leadTimes[s.id] || '3 days';
                        return (
                          <div key={s.id} className="p-1 rounded bg-white/[0.01] border border-white/[0.03] text-[10px] flex justify-between items-center">
                            <span className="text-white/80 leading-snug">• {s.title}</span>
                            <span className={`text-[8px] font-mono font-semibold px-1 rounded flex-shrink-0 ${
                              priority === 'Must-Have' ? 'bg-[#B4F052]/20 text-[#B4F052]' :
                              priority === 'Should-Have' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-white/40'
                            }`}>{lead}</span>
                          </div>
                        );
                      })}
                      {phaseSteps.length === 0 && (
                        <div className="text-[9px] text-white/20 italic">No steps scheduled in this phase</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Refine Feedback */}
            {aiTip && (
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[10px] text-emerald-200/80 leading-relaxed flex gap-2">
                <Sparkles size={14} className="text-[#B4F052] flex-shrink-0 mt-0.5" />
                <span>{aiTip}</span>
              </div>
            )}

            {/* Document Controls */}
            <div className="pt-4 border-t border-white/[0.08] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={saveAll}
                  className="py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-white/80 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Save size={14} />
                  Save Draft
                </button>
                <button
                  onClick={handleAiRefine}
                  disabled={isAiRefining}
                  className="py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
                >
                  <Sparkles size={14} />
                  {isAiRefining ? 'Refining...' : 'AI-Refine'}
                </button>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-3 rounded-xl bg-[#B4F052] hover:opacity-95 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-[#B4F052]/10"
              >
                <Check size={14} />
                Complete Task 7 & Finalize
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
