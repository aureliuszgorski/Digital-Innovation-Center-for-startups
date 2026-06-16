'use client';
import React, { useState, useEffect } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, ArrowRight, Layers, Trash2, Plus, Star, AlertTriangle, Sparkles, FileText, Target, Shield, HelpCircle, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CoreValue {
  name: string;
  category: string;
  meaning: string;
  behavior: string;
  antiBehavior: string;
}

interface DecisionPrinciples {
  doList: string[];
  doNotList: string[];
}

const VALUE_CATEGORIES = [
  'Customer Empathy',
  'Execution Speed',
  'Simplicity',
  'Continuous Learning',
  'Integrity',
  'Frugality',
  'Quality & Focus',
  'Transparency'
];

const DEFAULT_VALUES: CoreValue[] = [
  {
    name: 'Empathy-First',
    category: 'Customer Empathy',
    meaning: 'We understand customer pains deeply before proposing solutions.',
    behavior: 'Talking to at least 3 potential users every week and writing down direct quotes.',
    antiBehavior: 'Building features based on our own assumptions without validation.'
  },
  {
    name: 'Bias for Action',
    category: 'Execution Speed',
    meaning: 'We prefer building and testing in the real world over perfect planning.',
    behavior: 'Launching rough prototypes quickly to get immediate feedback.',
    antiBehavior: 'Spending months refining code and polishing layouts before users touch it.'
  },
  {
    name: 'Simple and Focused',
    category: 'Simplicity',
    meaning: 'We solve complex problems through clean, single-purpose solutions.',
    behavior: 'Focusing on doing one core thing exceptionally well and removing secondary tabs.',
    antiBehavior: 'Adding dozens of settings and features to avoid making hard design choices.'
  }
];

const DEFAULT_PRINCIPLES: DecisionPrinciples = {
  doList: [
    'Focus on one customer segment exclusively until we have retention.',
    'Test hypotheses using manual workflows (concierge MVP) before writing automated code.',
    'Prioritize user feedback and learning speed over early monetization.'
  ],
  doNotList: [
    'Build features for "future expansion" or secondary customer segments.',
    'Use paid ads before proving organic user retention and utility.',
    'Add features just because a competitor has them.'
  ]
};

export default function Task5Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput, completedTasks } = useGarage();

  // 1. Prerequisite verification: Task 4 must be completed (or at least have some context outputs)
  const isTask4Complete = completedTasks.includes(4);

  // Load Task 4 Context Inputs
  const rawPains = getTaskInput(4, 'pains');
  const rawGains = getTaskInput(4, 'gains');
  const rawJobs = getTaskInput(4, 'jobs');
  const rawSituation = getTaskInput(4, 'customerSituation');

  const pains = React.useMemo(() => {
    if (rawPains) {
      try { return JSON.parse(rawPains); } catch {}
    }
    return [];
  }, [rawPains]);

  const gains = React.useMemo(() => {
    if (rawGains) {
      try { return JSON.parse(rawGains); } catch {}
    }
    return [];
  }, [rawGains]);

  const jobs = React.useMemo(() => {
    if (rawJobs) {
      try { return JSON.parse(rawJobs); } catch {}
    }
    return null;
  }, [rawJobs]);

  const situation = React.useMemo(() => {
    if (rawSituation) {
      try { return JSON.parse(rawSituation); } catch {}
    }
    return null;
  }, [rawSituation]);

  // Task 3 context (for fallbacks)
  const selectedProblem = getTaskInput(3, 'selectedProblemStatement')
    ? (() => {
        try { return JSON.parse(getTaskInput(3, 'selectedProblemStatement')); } catch { return null; }
      })()
    : null;

  const targetSegment = getTaskInput(3, 'targetCustomer')
    ? (() => {
        try { return JSON.parse(getTaskInput(3, 'targetCustomer')); } catch { return null; }
      })()
    : null;

  // Task 5 states (lazy initialized from context storage)
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isProblemMapConfirmed, setIsProblemMapConfirmed] = useState<boolean>(() => {
    return getTaskInput(5, 'isProblemMapConfirmed') === 'true';
  });

  // Change Statement State
  const [changeCustomer, setChangeCustomer] = useState<string>(() => {
    return getTaskInput(5, 'changeCustomer') || targetSegment?.specificPersona || targetSegment?.primarySegment || 'our users';
  });
  const [changeFromState, setChangeFromState] = useState<string>(() => {
    return getTaskInput(5, 'changeFromState') || situation?.currentBehavior || targetSegment?.currentWorkaround || 'doing things manually';
  });
  const [changeToState, setChangeToState] = useState<string>(() => {
    return getTaskInput(5, 'changeToState') || '';
  });

  // Vision Statement State
  const [visionCustomer, setVisionCustomer] = useState<string>(() => {
    return getTaskInput(5, 'visionCustomer') || targetSegment?.specificPersona || targetSegment?.primarySegment || 'our target customer';
  });
  const [visionOutcome, setVisionOutcome] = useState<string>(() => {
    return getTaskInput(5, 'visionOutcome') || jobs?.mainJTBD?.desiredOutcome || '';
  });
  const [visionPain, setVisionPain] = useState<string>(() => {
    return getTaskInput(5, 'visionPain') || (pains[0]?.description) || '';
  });

  // Mission Statement State
  const [missionCustomer, setMissionCustomer] = useState<string>(() => {
    return getTaskInput(5, 'missionCustomer') || targetSegment?.specificPersona || targetSegment?.primarySegment || 'our target customer';
  });
  const [missionOutcome, setMissionOutcome] = useState<string>(() => {
    return getTaskInput(5, 'missionOutcome') || jobs?.mainJTBD?.desiredOutcome || '';
  });
  const [missionApproach, setMissionApproach] = useState<string>(() => {
    return getTaskInput(5, 'missionApproach') || '';
  });
  const [missionBenefit, setMissionBenefit] = useState<string>(() => {
    return getTaskInput(5, 'missionBenefit') || '';
  });

  // Core Values State
  const [coreValues, setCoreValues] = useState<CoreValue[]>(() => {
    const raw = getTaskInput(5, 'values_structured');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return DEFAULT_VALUES;
  });

  const [newValueName, setNewValueName] = useState('');
  const [newValueCat, setNewValueCat] = useState(VALUE_CATEGORIES[0]);
  const [newValueMeaning, setNewValueMeaning] = useState('');
  const [newValueBehavior, setNewValueBehavior] = useState('');
  const [newValueAntiBehavior, setNewValueAntiBehavior] = useState('');

  // Decision Principles State
  const [decisionPrinciples, setDecisionPrinciples] = useState<DecisionPrinciples>(() => {
    const raw = getTaskInput(5, 'decisionPrinciples');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return DEFAULT_PRINCIPLES;
  });

  const [newDoPrinciple, setNewDoPrinciple] = useState('');
  const [newDoNotPrinciple, setNewDoNotPrinciple] = useState('');

  // Mock AI Refine loading states
  const [isAiRefining, setIsAiRefining] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);

  // Compile final statement strings
  const compiledChange = `We want to help ${changeCustomer} move from ${changeFromState || '[current state]'} to ${changeToState || '[better future state]'}.`;
  const compiledVision = `A world where ${visionCustomer} can ${visionOutcome || '[desired outcome]'} without ${visionPain || '[major pain]'}.`;
  const compiledMission = `We help ${missionCustomer} ${missionOutcome || '[achieve outcome]'} by ${missionApproach || '[approach]'}, so they can ${missionBenefit || '[larger benefit]'}.`;

  // Save all fields to context
  const saveAll = React.useCallback(() => {
    setTaskInput(5, 'isProblemMapConfirmed', isProblemMapConfirmed ? 'true' : 'false');
    setTaskInput(5, 'changeCustomer', changeCustomer);
    setTaskInput(5, 'changeFromState', changeFromState);
    setTaskInput(5, 'changeToState', changeToState);
    setTaskInput(5, 'changeStatement', compiledChange);

    setTaskInput(5, 'visionCustomer', visionCustomer);
    setTaskInput(5, 'visionOutcome', visionOutcome);
    setTaskInput(5, 'visionPain', visionPain);
    setTaskInput(5, 'vision', compiledVision); // Primary Next.js text field

    setTaskInput(5, 'missionCustomer', missionCustomer);
    setTaskInput(5, 'missionOutcome', missionOutcome);
    setTaskInput(5, 'missionApproach', missionApproach);
    setTaskInput(5, 'missionBenefit', missionBenefit);
    setTaskInput(5, 'mission', compiledMission); // Primary Next.js text field

    setTaskInput(5, 'values_structured', JSON.stringify(coreValues));
    // Save readable summary in default 'values' field
    const valuesSummary = coreValues.map((v, i) => `${i + 1}. ${v.name} (${v.category}): ${v.meaning}`).join('\n');
    setTaskInput(5, 'values', valuesSummary); // Primary Next.js text field

    setTaskInput(5, 'decisionPrinciples', JSON.stringify(decisionPrinciples));
  }, [
    isProblemMapConfirmed, changeCustomer, changeFromState, changeToState, compiledChange,
    visionCustomer, visionOutcome, visionPain, compiledVision,
    missionCustomer, missionOutcome, missionApproach, missionBenefit, compiledMission,
    coreValues, decisionPrinciples, setTaskInput
  ]);

  // Auto-save when values change
  useEffect(() => {
    saveAll();
  }, [saveAll]);

  const handleAddValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValueName.trim() || !newValueMeaning.trim()) return;
    const added: CoreValue = {
      name: newValueName.trim(),
      category: newValueCat,
      meaning: newValueMeaning.trim(),
      behavior: newValueBehavior.trim(),
      antiBehavior: newValueAntiBehavior.trim()
    };
    setCoreValues([...coreValues, added]);
    setNewValueName('');
    setNewValueMeaning('');
    setNewValueBehavior('');
    setNewValueAntiBehavior('');
  };

  const handleRemoveValue = (index: number) => {
    setCoreValues(coreValues.filter((_, i) => i !== index));
  };

  const handleAddDoPrinciple = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoPrinciple.trim()) return;
    setDecisionPrinciples({
      ...decisionPrinciples,
      doList: [...decisionPrinciples.doList, newDoPrinciple.trim()]
    });
    setNewDoPrinciple('');
  };

  const handleRemoveDoPrinciple = (index: number) => {
    setDecisionPrinciples({
      ...decisionPrinciples,
      doList: decisionPrinciples.doList.filter((_, i) => i !== index)
    });
  };

  const handleAddDoNotPrinciple = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoNotPrinciple.trim()) return;
    setDecisionPrinciples({
      ...decisionPrinciples,
      doNotList: [...decisionPrinciples.doNotList, newDoNotPrinciple.trim()]
    });
    setNewDoNotPrinciple('');
  };

  const handleRemoveDoNotPrinciple = (index: number) => {
    setDecisionPrinciples({
      ...decisionPrinciples,
      doNotList: decisionPrinciples.doNotList.filter((_, i) => i !== index)
    });
  };

  const handleAiRefine = () => {
    setIsAiRefining(true);
    setTimeout(() => {
      setIsAiRefining(false);
      setAiTip('AI Optimization complete! Refined statements for higher clarity and active verb structures. Make sure they align with your core product intuition.');
      // Make slight modifications for simulation
      if (!changeToState) setChangeToState('seamlessly managing and accelerating their core workflow');
      if (!visionOutcome) setVisionOutcome('reclaim 10 hours a week and focus on strategic growth');
      if (!missionApproach) setMissionApproach('providing a zero-config, AI-assisted productivity system');
      if (!missionBenefit) setMissionBenefit('execute tasks without operational bottlenecks');
    }, 1200);
  };

  const handleComplete = () => {
    saveAll();
    completeTask(5);
    router.push('/tasks/6');
  };

  // Warning panel if Task 4 is incomplete
  if (!isTask4Complete) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="glass-card p-8 border border-white/[0.08] inline-block max-w-lg">
          <AlertTriangle className="mx-auto mb-4 text-[#B4F052]" size={48} />
          <h2 className="text-xl font-bold mb-2">Task 4 Incomplete</h2>
          <p className="text-white/60 mb-6 text-sm">
            Please finish and complete Task 4 (Pinpoint Pains, Gains and JTBD) to populate the customer profile map before defining the Founder North Star.
          </p>
          <Link href="/tasks/4" className="inline-flex items-center gap-2 glass-button px-6 py-3 rounded-xl text-sm font-semibold transition-all">
            Go to Task 4
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 animate-fade-in text-white">
      {/* Header with Cockpit Metrics */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-8">
        <div>
          <div className="text-[#B4F052] text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Layers size={12} />
            Task 5 Redesign
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Define Founder North Star</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Align your personal values, mission, and long-term vision with validated customer problems. Create the filter for all future product roadmaps.
          </p>
        </div>

        {/* Cockpit Card */}
        <div className="glass-card p-4 border border-white/[0.08] flex items-center gap-6 text-xs bg-black/40 backdrop-blur-md">
          <div className="border-r border-white/[0.08] pr-4">
            <div className="text-white/40 mb-0.5">Alignment</div>
            <div className="text-[#B4F052] font-semibold uppercase tracking-wider">Strategic</div>
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
            <div className="text-white font-semibold">~3 hours</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Wizard (Left) & Live Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Wizard Controls (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs header */}
          <div className="flex border-b border-white/[0.08] overflow-x-auto pb-px gap-2">
            {[
              { id: 1, label: '1. Review' },
              { id: 2, label: '2. Change' },
              { id: 3, label: '3. Vision' },
              { id: 4, label: '4. Mission' },
              { id: 5, label: '5. Values' },
              { id: 6, label: '6. Principles' }
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
            
            {/* Step 1: Review Customer Problem Map */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Target size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 1: Review Customer Problem Map</h3>
                </div>
                <p className="text-xs text-white/60">
                  Review the inputs mapped in Task 4 to ensure your strategic orientation anchors onto real problems, pains, and aspirations.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#B4F052] mb-1">Target Customer Segment</div>
                    <p className="text-xs text-white/80 font-semibold">{targetSegment?.primarySegment || 'Not set'}</p>
                    <p className="text-[10px] text-white/40 mt-1">Persona: {targetSegment?.specificPersona || 'Not set'}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#B4F052] mb-1">Selected Focus Problem</div>
                    <p className="text-xs text-white/80 font-semibold truncate">{selectedProblem?.problem || 'Not set'}</p>
                    <p className="text-[10px] text-white/40 mt-1">Root Cause: {selectedProblem?.rootCauseOrContext || 'Not set'}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] md:col-span-2">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#B4F052] mb-1">Main Job To Be Done (JTBD)</div>
                    <p className="text-xs text-white/80 italic">&ldquo;{jobs?.mainJTBD?.finalStatement || 'Not set'}&rdquo;</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-400 mb-1">Top Customer Pains ({pains.length})</div>
                    <ul className="list-disc pl-4 text-xs text-white/70 space-y-1">
                      {pains.slice(0, 3).map((p: { id: string; description: string; intensity: number }) => (
                        <li key={p.id} className="truncate">{p.description} <span className="text-[9px] text-rose-400 font-mono">(Int: {p.intensity}/5)</span></li>
                      ))}
                      {pains.length === 0 && <li className="text-white/30 italic">No pains mapped</li>}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 mb-1">Top Customer Gains ({gains.length})</div>
                    <ul className="list-disc pl-4 text-xs text-white/70 space-y-1">
                      {gains.slice(0, 3).map((g: { id: string; description: string; importance: number }) => (
                        <li key={g.id} className="truncate">{g.description} <span className="text-[9px] text-emerald-400 font-mono">(Imp: {g.importance}/5)</span></li>
                      ))}
                      {gains.length === 0 && <li className="text-white/30 italic">No gains mapped</li>}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    onClick={() => setIsProblemMapConfirmed(!isProblemMapConfirmed)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isProblemMapConfirmed ? 'bg-[#B4F052] border-[#B4F052] text-black' : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    {isProblemMapConfirmed && <Check size={12} />}
                  </button>
                  <label className="text-xs text-white/80 font-medium cursor-pointer" onClick={() => setIsProblemMapConfirmed(!isProblemMapConfirmed)}>
                    I confirm that this Customer Problem Map accurately represents our target hypothesis.
                  </label>
                </div>
              </div>
            )}

            {/* Step 2: Define the Change Statement */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Sparkles size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 2: Define the Change Statement</h3>
                </div>
                <p className="text-xs text-white/60">
                  Contrast the current workarounds of your target segment with the better future outcome. This defines the core migration path.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Target Customer Persona</label>
                    <input
                      type="text"
                      value={changeCustomer}
                      onChange={e => setChangeCustomer(e.target.value)}
                      placeholder="e.g. Solo developers, Busy marketers"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Current State (Workaround / Behavior)</label>
                      <textarea
                        value={changeFromState}
                        onChange={e => setChangeFromState(e.target.value)}
                        placeholder="e.g. wasting hours copy-pasting code fragments or using spreadsheets to log changes"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-none"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Better Future State (Desired Outcome)</label>
                      <textarea
                        value={changeToState}
                        onChange={e => setChangeToState(e.target.value)}
                        placeholder="e.g. automating standard layouts in seconds and deploying them with confidence"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-none"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#B4F052]/5 border border-[#B4F052]/10 mt-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#B4F052] block mb-1">Live Output Preview</span>
                    <p className="text-xs text-white/80 font-mono italic leading-relaxed">{compiledChange}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Write Vision Statement */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Target size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 3: Write Vision Statement</h3>
                </div>
                <p className="text-xs text-white/60">
                  Your vision statement represents the long-term aspirations of your customer. Paint a picture of a friction-free future.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Target Customer</label>
                    <input
                      type="text"
                      value={visionCustomer}
                      onChange={e => setVisionCustomer(e.target.value)}
                      placeholder="e.g. remote engineers"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Desired Outcome</label>
                    <input
                      type="text"
                      value={visionOutcome}
                      onChange={e => setVisionOutcome(e.target.value)}
                      placeholder="e.g. launch secure web servers in under 5 minutes"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Without (Major Pain)</label>
                    <input
                      type="text"
                      value={visionPain}
                      onChange={e => setVisionPain(e.target.value)}
                      placeholder="e.g. writing custom shell scripts or paying for expensive cloud advisors"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#B4F052]/5 border border-[#B4F052]/10 mt-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#B4F052] block mb-1">Live Output Preview</span>
                    <p className="text-xs text-white/80 font-mono italic leading-relaxed">{compiledVision}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Write Mission Statement */}
            {activeTab === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <FileText size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 4: Write Mission Statement</h3>
                </div>
                <p className="text-xs text-white/60">
                  The mission defines how your startup solves the customer problem today. Focus on the core value lever.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Target Customer</label>
                      <input
                        type="text"
                        value={missionCustomer}
                        onChange={e => setMissionCustomer(e.target.value)}
                        placeholder="e.g. early stage founders"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Achieve Outcome</label>
                      <input
                        type="text"
                        value={missionOutcome}
                        onChange={e => setMissionOutcome(e.target.value)}
                        placeholder="e.g. map out their first product roadmap"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">By (Your Approach / Method)</label>
                    <input
                      type="text"
                      value={missionApproach}
                      onChange={e => setMissionApproach(e.target.value)}
                      placeholder="e.g. offering an intuitive, interactive gamified workspace framework"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">So They Can (Larger / Existential Benefit)</label>
                    <input
                      type="text"
                      value={missionBenefit}
                      onChange={e => setMissionBenefit(e.target.value)}
                      placeholder="e.g. save hundreds of hours of design coordination and build with focus"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#B4F052]/5 border border-[#B4F052]/10 mt-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#B4F052] block mb-1">Live Output Preview</span>
                    <p className="text-xs text-white/80 font-mono italic leading-relaxed">{compiledMission}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Define 3-5 Core Values */}
            {activeTab === 5 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Shield size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 5: Define 3-5 Core Values</h3>
                </div>
                <p className="text-xs text-white/60">
                  Formulate values that constrain behavior. A good value has meaning, represents positive behavior, and bans negative &ldquo;anti-behaviors&rdquo;.
                </p>

                {/* Core Values List */}
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  {coreValues.map((val, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{val.name}</span>
                          <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[8px] text-[#B4F052] tracking-wider uppercase font-semibold">{val.category}</span>
                        </div>
                        <p className="text-[10px] text-white/60"><strong className="text-white/40">Meaning:</strong> {val.meaning}</p>
                        <p className="text-[10px] text-emerald-400"><strong className="text-emerald-400/40">Behavior:</strong> {val.behavior}</p>
                        <p className="text-[10px] text-rose-400"><strong className="text-rose-400/40">Anti-Behavior:</strong> {val.antiBehavior}</p>
                      </div>
                      <button onClick={() => handleRemoveValue(idx)} className="text-white/20 hover:text-rose-400 p-1">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {coreValues.length === 0 && (
                    <div className="text-center py-6 text-white/20 text-xs italic">No core values defined yet. Add some below.</div>
                  )}
                </div>

                {/* Core Values Add Form */}
                <form onSubmit={handleAddValue} className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.06] space-y-3">
                  <div className="text-[10px] uppercase font-bold text-[#B4F052] tracking-wider">Add Core Value</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-white/40 block mb-0.5">Value Name</label>
                      <input
                        type="text"
                        value={newValueName}
                        onChange={e => setNewValueName(e.target.value)}
                        placeholder="e.g. Integrity, Focus"
                        className="w-full px-2 py-1 bg-white/[0.02] border border-white/[0.08] text-xs text-white rounded-lg focus:outline-none focus:border-[#B4F052]/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-0.5">Category</label>
                      <select
                        value={newValueCat}
                        onChange={e => setNewValueCat(e.target.value)}
                        className="w-full px-2 py-1 bg-black text-xs text-white rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#B4F052]/40"
                      >
                        {VALUE_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 block mb-0.5">Meaning</label>
                    <input
                      type="text"
                      value={newValueMeaning}
                      onChange={e => setNewValueMeaning(e.target.value)}
                      placeholder="What does this value mean to the business?"
                      className="w-full px-2 py-1 bg-white/[0.02] border border-white/[0.08] text-xs text-white rounded-lg focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-emerald-400 block mb-0.5">Ideal Behavior</label>
                      <input
                        type="text"
                        value={newValueBehavior}
                        onChange={e => setNewValueBehavior(e.target.value)}
                        placeholder="e.g. customer interviews weekly"
                        className="w-full px-2 py-1 bg-white/[0.02] border border-white/[0.08] text-xs text-white rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-rose-400 block mb-0.5">Violative Anti-Behavior</label>
                      <input
                        type="text"
                        value={newValueAntiBehavior}
                        onChange={e => setNewValueAntiBehavior(e.target.value)}
                        placeholder="e.g. building based on internal opinion"
                        className="w-full px-2 py-1 bg-white/[0.02] border border-white/[0.08] text-xs text-white rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>
                  <button type="submit" className="px-3 py-1.5 rounded-lg bg-[#B4F052] text-black text-xs font-bold hover:opacity-90 flex items-center gap-1.5 ml-auto">
                    <Plus size={12} /> Add Value
                  </button>
                </form>
              </div>
            )}

            {/* Step 6: Define Decision Principles */}
            {activeTab === 6 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <HelpCircle size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 6: Define Decision Principles (Trade-offs)</h3>
                </div>
                <p className="text-xs text-white/60">
                  Decision principles define trade-offs. Write rules representing what you actively DO and what you choose NOT to do to protect your focus.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* DO List */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-emerald-400 border-b border-white/[0.04] pb-1">We WILL Do:</div>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto">
                      {decisionPrinciples.doList.map((p, idx) => (
                        <div key={idx} className="flex justify-between items-start p-2 rounded bg-white/[0.01] border border-white/[0.04] text-[10px] text-white/80">
                          <span>{p}</span>
                          <button type="button" onClick={() => handleRemoveDoPrinciple(idx)} className="text-white/20 hover:text-rose-400 ml-2">
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleAddDoPrinciple} className="flex gap-2">
                      <input
                        type="text"
                        value={newDoPrinciple}
                        onChange={e => setNewDoPrinciple(e.target.value)}
                        placeholder="Add a DO rule..."
                        className="flex-1 px-2.5 py-1.5 bg-white/[0.02] border border-white/[0.08] text-xs text-white rounded-lg focus:outline-none"
                      />
                      <button type="submit" className="p-1.5 rounded-lg bg-emerald-500 text-white hover:opacity-90">
                        <Plus size={12} />
                      </button>
                    </form>
                  </div>

                  {/* DO NOT List */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-rose-400 border-b border-white/[0.04] pb-1">We WILL NOT Do:</div>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto">
                      {decisionPrinciples.doNotList.map((p, idx) => (
                        <div key={idx} className="flex justify-between items-start p-2 rounded bg-white/[0.01] border border-white/[0.04] text-[10px] text-white/80">
                          <span>{p}</span>
                          <button type="button" onClick={() => handleRemoveDoNotPrinciple(idx)} className="text-white/20 hover:text-rose-400 ml-2">
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleAddDoNotPrinciple} className="flex gap-2">
                      <input
                        type="text"
                        value={newDoNotPrinciple}
                        onChange={e => setNewDoNotPrinciple(e.target.value)}
                        placeholder="Add a DO NOT rule..."
                        className="flex-1 px-2.5 py-1.5 bg-white/[0.02] border border-white/[0.08] text-xs text-white rounded-lg focus:outline-none"
                      />
                      <button type="submit" className="p-1.5 rounded-lg bg-rose-500 text-white hover:opacity-90">
                        <Plus size={12} />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex justify-between border-t border-white/[0.06] pt-4 mt-6">
              <button
                type="button"
                onClick={() => setActiveTab(prev => Math.max(1, prev - 1))}
                disabled={activeTab === 1}
                className="px-4 py-2 rounded-xl text-xs bg-white/[0.04] hover:bg-white/[0.08] text-white/60 font-semibold disabled:opacity-40 disabled:hover:bg-white/[0.04] transition-all"
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

        {/* Live Document Preview Panel (Col span 1) */}
        <div className="space-y-6">
          <div className="glass-card p-6 border border-white/[0.08] bg-black/60 backdrop-blur-md space-y-6">
            <div className="border-b border-white/[0.08] pb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FileText size={16} className="text-[#B4F052]" />
                <h3 className="text-sm font-bold">North Star Document</h3>
              </div>
              <span className="text-[10px] font-mono text-white/40">v0.1 Draft</span>
            </div>

            {/* Document Content */}
            <div className="space-y-4 text-xs font-sans">
              <div>
                <span className="text-[10px] text-white/30 font-semibold uppercase block mb-1">1. Strategic Direction</span>
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-white/80 leading-relaxed font-mono italic">
                  {compiledChange}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-white/30 font-semibold uppercase block mb-1">2. Vision Statement</span>
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-white/80 leading-relaxed font-mono italic">
                  {compiledVision}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-white/30 font-semibold uppercase block mb-1">3. Mission Statement</span>
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-white/80 leading-relaxed font-mono italic">
                  {compiledMission}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-white/30 font-semibold uppercase block mb-1">4. Core Values ({coreValues.length})</span>
                <div className="space-y-1">
                  {coreValues.slice(0, 3).map((v, i) => (
                    <div key={i} className="px-2 py-1 rounded bg-white/[0.01] border border-white/[0.03] text-[10px]">
                      <span className="font-bold text-white/95">{v.name}</span>: <span className="text-white/60">{v.meaning}</span>
                    </div>
                  ))}
                  {coreValues.length > 3 && <div className="text-[9px] text-[#B4F052] pl-2">+{coreValues.length - 3} more values...</div>}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-white/30 font-semibold uppercase block mb-1">5. Decision Principles</span>
                <div className="grid grid-cols-2 gap-2 text-[9px] leading-tight">
                  <div className="p-2 rounded bg-emerald-500/5 border border-emerald-500/10 text-emerald-200/80">
                    <strong className="block mb-1 text-emerald-400">DO:</strong>
                    {decisionPrinciples.doList.slice(0, 2).map((x, i) => <span key={i} className="block mb-1">• {x}</span>)}
                  </div>
                  <div className="p-2 rounded bg-rose-500/5 border border-rose-500/10 text-rose-200/80">
                    <strong className="block mb-1 text-rose-400">DO NOT:</strong>
                    {decisionPrinciples.doNotList.slice(0, 2).map((x, i) => <span key={i} className="block mb-1">• {x}</span>)}
                  </div>
                </div>
              </div>
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
                Complete Task 5 & Continue
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
