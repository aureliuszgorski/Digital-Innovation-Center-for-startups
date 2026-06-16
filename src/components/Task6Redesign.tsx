'use client';
import React, { useState, useEffect } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, ArrowRight, Layers, Trash2, Plus, Star, AlertTriangle, Sparkles, FileText, Calendar, PlusCircle, HelpCircle, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Milestone {
  id: string;
  category: 'Problem Validation' | 'Solution Validation' | 'MVP Launch' | 'Channel Growth' | 'System Scale';
  title: string;
  whyMatters: string;
  horizon: 'Month 1' | 'Month 3' | 'Month 6' | 'Year 1' | 'Year 2';
}

interface Step {
  id: string;
  milestoneId: string;
  title: string;
  dependency: string;
  unknowns: string;
}

const MILESTONE_CATEGORIES = [
  'Problem Validation',
  'Solution Validation',
  'MVP Launch',
  'Channel Growth',
  'System Scale'
] as const;

const TIME_HORIZONS = [
  'Month 1',
  'Month 3',
  'Month 6',
  'Year 1',
  'Year 2'
] as const;

const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'm1',
    category: 'Problem Validation',
    title: 'Confirm problem intensity with 15 user interviews',
    whyMatters: 'We must verify that pain intensity is high enough to warrant payment.',
    horizon: 'Month 1'
  },
  {
    id: 'm2',
    category: 'Solution Validation',
    title: 'Deploy landing page and sign up 100 waitlist users',
    whyMatters: 'Validates interest in our proposed value proposition.',
    horizon: 'Month 3'
  },
  {
    id: 'm3',
    category: 'MVP Launch',
    title: 'Onboard 10 active beta users to manual concierge service',
    whyMatters: 'Proves utility and allows manual tweaking of value delivery.',
    horizon: 'Month 6'
  }
];

const DEFAULT_STEPS: Step[] = [
  {
    id: 's1',
    milestoneId: 'm1',
    title: 'Draft a customer validation script focusing on past behaviors',
    dependency: 'None',
    unknowns: 'Finding enough qualified interviewees'
  },
  {
    id: 's2',
    milestoneId: 'm1',
    title: 'Conduct and transcribe 10 user validation calls',
    dependency: 'Draft validation script',
    unknowns: 'High no-show rates'
  },
  {
    id: 's3',
    milestoneId: 'm2',
    title: 'Build high-fidelity landing page mockup',
    dependency: 'None',
    unknowns: 'Copywriting tone alignment'
  }
];

const FRAMEWORK_SUGGESTIONS = [
  { category: 'Problem Validation', title: 'Conduct problem interview campaign (15+ people)', desc: 'Direct qualitative discovery' },
  { category: 'Solution Validation', title: 'Set up interactive landing page with signup flow', desc: 'Pre-launch validation' },
  { category: 'Solution Validation', title: 'Build manually-serviced concierge MVP', desc: 'Verify utility without code' },
  { category: 'MVP Launch', title: 'Define pricing tiers and set up billing provider', desc: 'First purchase intent check' },
  { category: 'MVP Launch', title: 'Acquire first 10 paying beta reference customers', desc: 'The ultimate validation test' },
  { category: 'Channel Growth', title: 'Create automatic email onboarding nurture triggers', desc: 'Set up engagement loops' },
  { category: 'System Scale', title: 'Setup database replication and backup system', desc: 'Ensure data preservation' }
];

export default function Task6Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput, completedTasks } = useGarage();

  // 1. Prerequisite verification: Task 5 must be completed
  const isTask5Complete = completedTasks.includes(5);

  // Load Task 5 Context Inputs
  const vision = getTaskInput(5, 'vision') || '';
  const mission = getTaskInput(5, 'mission') || '';
  const rawValues = getTaskInput(5, 'values_structured') || getTaskInput(5, 'values');
  const rawPrinciples = getTaskInput(5, 'decisionPrinciples');

  const valuesList = (() => {
    if (rawValues) {
      try {
        const parsed = JSON.parse(rawValues);
        if (Array.isArray(parsed)) return parsed.map(x => x.name);
      } catch {}
      return rawValues.split('\n').map(x => x.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
    }
    return [];
  })();

  const principles = (() => {
    if (rawPrinciples) {
      try { return JSON.parse(rawPrinciples); } catch {}
    }
    return null;
  })();

  // Task 6 states (lazy initialized from context storage)
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isNorthStarConfirmed, setIsNorthStarConfirmed] = useState<boolean>(() => {
    return getTaskInput(6, 'isNorthStarConfirmed') === 'true';
  });

  // 3-Year Destination Statement States
  const [destCustomerReach, setDestCustomerReach] = useState(() => getTaskInput(6, 'destCustomerReach') || '');
  const [destProductValue, setDestProductValue] = useState(() => getTaskInput(6, 'destProductValue') || '');
  const [destScaleGoal, setDestScaleGoal] = useState(() => getTaskInput(6, 'destScaleGoal') || '');
  const [destText, setDestText] = useState(() => getTaskInput(6, 'destText') || '');

  // Milestones State
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const raw = getTaskInput(6, 'milestones');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return DEFAULT_MILESTONES;
  });

  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneCat, setNewMilestoneCat] = useState<Milestone['category']>('Problem Validation');
  const [newMilestoneWhy, setNewMilestoneWhy] = useState('');
  const [newMilestoneHorizon, setNewMilestoneHorizon] = useState<Milestone['horizon']>('Month 1');

  // Steps State
  const [steps, setSteps] = useState<Step[]>(() => {
    const raw = getTaskInput(6, 'steps');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return DEFAULT_STEPS;
  });

  // Unique ID counters to ensure hook purity
  const [milestoneCounter, setMilestoneCounter] = useState(100);
  const [stepCounter, setStepCounter] = useState(100);

  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepMilestoneId, setNewStepMilestoneId] = useState(() => milestones[0]?.id || '');
  const [newStepDependency, setNewStepDependency] = useState('');
  const [newStepUnknowns, setNewStepUnknowns] = useState('');

  // Open Questions State
  const [openQuestions, setOpenQuestions] = useState<string[]>(() => {
    const raw = getTaskInput(6, 'openQuestions');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [
      'Will users pay for this service or expect a free tier?',
      'Can we build the core engine within a 2-week sprint?'
    ];
  });
  const [newQuestion, setNewQuestion] = useState('');

  // Tabular repository filters
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterHorizon, setFilterHorizon] = useState<string>('All');

  // Mock AI Refine loading states
  const [isAiRefining, setIsAiRefining] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);

  // Compile Destination text dynamically if user hasn't overwritten it
  const compiledDest = destText || `In 3 years, we serve ${destCustomerReach || '[target customer reach]'} with a solution that ${destProductValue || '[core product value]'}, reaching a scale of ${destScaleGoal || '[scale goal]'}.`;

  const saveAll = React.useCallback(() => {
    setTaskInput(6, 'isNorthStarConfirmed', isNorthStarConfirmed ? 'true' : 'false');
    setTaskInput(6, 'destCustomerReach', destCustomerReach);
    setTaskInput(6, 'destProductValue', destProductValue);
    setTaskInput(6, 'destScaleGoal', destScaleGoal);
    setTaskInput(6, 'destText', destText);
    setTaskInput(6, 'destinationStatement', compiledDest);

    setTaskInput(6, 'milestones', JSON.stringify(milestones));
    setTaskInput(6, 'steps', JSON.stringify(steps));
    setTaskInput(6, 'openQuestions', JSON.stringify(openQuestions));
  }, [
    isNorthStarConfirmed, destCustomerReach, destProductValue, destScaleGoal, destText, compiledDest,
    milestones, steps, openQuestions, setTaskInput
  ]);

  // Auto-save when values change
  useEffect(() => {
    saveAll();
  }, [saveAll]);

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    const nextCounter = milestoneCounter + 1;
    setMilestoneCounter(nextCounter);
    const added: Milestone = {
      id: 'm_' + nextCounter,
      category: newMilestoneCat,
      title: newMilestoneTitle.trim(),
      whyMatters: newMilestoneWhy.trim(),
      horizon: newMilestoneHorizon
    };
    setMilestones([...milestones, added]);
    setNewMilestoneTitle('');
    setNewMilestoneWhy('');
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
    setSteps(steps.filter(s => s.milestoneId !== id)); // Cascading delete steps
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    const activeMilestoneId = newStepMilestoneId || milestones[0]?.id || '';
    if (!newStepTitle.trim() || !activeMilestoneId) return;
    const nextCounter = stepCounter + 1;
    setStepCounter(nextCounter);
    const added: Step = {
      id: 's_' + nextCounter,
      milestoneId: activeMilestoneId,
      title: newStepTitle.trim(),
      dependency: newStepDependency.trim() || 'None',
      unknowns: newStepUnknowns.trim() || 'None'
    };
    setSteps([...steps, added]);
    setNewStepTitle('');
    setNewStepDependency('');
    setNewStepUnknowns('');
  };

  const handleAddFrameworkSuggestion = (title: string, category: string) => {
    const targetM = milestones.find(m => m.category === category);
    let targetMilestoneId = '';
    
    if (!targetM) {
      const nextMCount = milestoneCounter + 1;
      setMilestoneCounter(nextMCount);
      targetMilestoneId = 'm_' + nextMCount;
      const newM: Milestone = {
        id: targetMilestoneId,
        category: category as Milestone['category'],
        title: `Achieve ${category} milestone`,
        whyMatters: 'Added automatically to house steps',
        horizon: 'Month 3'
      };
      setMilestones(m => [...m, newM]);
    } else {
      targetMilestoneId = targetM.id;
    }

    const nextSCount = stepCounter + 1;
    setStepCounter(nextSCount);
    const added: Step = {
      id: 's_' + nextSCount,
      milestoneId: targetMilestoneId,
      title,
      dependency: 'None',
      unknowns: 'Awaiting discovery'
    };
    setSteps(prev => [...prev, added]);
  };

  const handleRemoveStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setOpenQuestions([...openQuestions, newQuestion.trim()]);
    setNewQuestion('');
  };

  const handleRemoveQuestion = (idx: number) => {
    setOpenQuestions(openQuestions.filter((_, i) => i !== idx));
  };

  const handleAiRefine = () => {
    setIsAiRefining(true);
    setTimeout(() => {
      setIsAiRefining(false);
      setAiTip('AI Roadmap refiner analyzed step dependencies. Formulated a linear path, grouping steps to avoid circular dependencies and ensuring time horizons remain logical.');
      if (!destCustomerReach) setDestCustomerReach('10,000 professional developers');
      if (!destProductValue) setDestProductValue('saves 2 hours of manual orchestration per deploy');
      if (!destScaleGoal) setDestScaleGoal('$50,000 Monthly Recurring Revenue (MRR)');
    }, 1200);
  };

  const handleComplete = () => {
    saveAll();
    completeTask(6);
    router.push('/tasks/7');
  };

  // Warning panel if Task 5 is incomplete
  if (!isTask5Complete) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="glass-card p-8 border border-white/[0.08] inline-block max-w-lg">
          <AlertTriangle className="mx-auto mb-4 text-[#B4F052]" size={48} />
          <h2 className="text-xl font-bold mb-2">Task 5 Incomplete</h2>
          <p className="text-white/60 mb-6 text-sm">
            Please finish and complete Task 5 (Define Founder North Star) to establish the strategic framework before mapping milestones and steps.
          </p>
          <Link href="/tasks/5" className="inline-flex items-center gap-2 glass-button px-6 py-3 rounded-xl text-sm font-semibold transition-all">
            Go to Task 5
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Filtered lists for the backlog repository
  const filteredMilestones = milestones.filter(m => {
    if (filterCategory !== 'All' && m.category !== filterCategory) return false;
    if (filterHorizon !== 'All' && m.horizon !== filterHorizon) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 animate-fade-in text-white">
      {/* Header with Cockpit Metrics */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-8">
        <div>
          <div className="text-[#B4F052] text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Layers size={12} />
            Task 6 Redesign
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Build Operational Step & Milestone Backlog</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Convert your high-level strategy into discrete milestones and actionable steps. Group work into time horizons and define dependencies.
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
            <div className="text-white font-semibold">~3 hours</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Wizard (Left) & Live Backlog (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Wizard Panel (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs header */}
          <div className="flex border-b border-white/[0.08] overflow-x-auto pb-px gap-2">
            {[
              { id: 1, label: '1. North Star' },
              { id: 2, label: '2. Destination' },
              { id: 3, label: '3. Milestones' },
              { id: 4, label: '4. Steps' },
              { id: 5, label: '5. Dependencies' },
              { id: 6, label: '6. Questions' }
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
            
            {/* Step 1: Review North Star */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <FileText size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 1: Review Founder North Star</h3>
                </div>
                <p className="text-xs text-white/60">
                  Verify that your Vision, Mission, and Core Values align with the steps and milestones you are mapping.
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <strong className="text-white/40 uppercase text-[9px] tracking-wider block mb-1">Vision Statement</strong>
                    <p className="text-white/80 italic font-mono">&ldquo;{vision || 'Not defined'}&rdquo;</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <strong className="text-white/40 uppercase text-[9px] tracking-wider block mb-1">Mission Statement</strong>
                    <p className="text-white/80 italic font-mono">&ldquo;{mission || 'Not defined'}&rdquo;</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <strong className="text-white/40 uppercase text-[9px] tracking-wider block mb-1">Core Values</strong>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {valuesList.map((val, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[9px] text-white/70">{val}</span>
                        ))}
                        {valuesList.length === 0 && <span className="text-white/30 italic">None defined</span>}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <strong className="text-white/40 uppercase text-[9px] tracking-wider block mb-1">Decision Principles</strong>
                      <div className="text-[10px] text-white/60 mt-1">
                        <div>DO: {principles?.doList?.length || 0} active constraints</div>
                        <div>DO NOT: {principles?.doNotList?.length || 0} active constraints</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    onClick={() => setIsNorthStarConfirmed(!isNorthStarConfirmed)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isNorthStarConfirmed ? 'bg-[#B4F052] border-[#B4F052] text-black' : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    {isNorthStarConfirmed && <Check size={12} />}
                  </button>
                  <label className="text-xs text-white/80 font-medium cursor-pointer" onClick={() => setIsNorthStarConfirmed(!isNorthStarConfirmed)}>
                    I have reviewed our Founder North Star and confirmed it guides our roadmap direction.
                  </label>
                </div>
              </div>
            )}

            {/* Step 2: Define 3-Year Destination Statement */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Sparkles size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 2: Define 3-Year Destination Statement</h3>
                </div>
                <p className="text-xs text-white/60">
                  Where will your startup stand in 3 years? Define key indicators for reach, value delivery, and scale.
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Target Customer Reach</label>
                      <input
                        type="text"
                        value={destCustomerReach}
                        onChange={e => setDestCustomerReach(e.target.value)}
                        placeholder="e.g. 5,000 active developers"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Core Product Value</label>
                      <input
                        type="text"
                        value={destProductValue}
                        onChange={e => setDestProductValue(e.target.value)}
                        placeholder="e.g. automates deployment scripting"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Revenue / Scale Goal</label>
                      <input
                        type="text"
                        value={destScaleGoal}
                        onChange={e => setDestScaleGoal(e.target.value)}
                        placeholder="e.g. $10k monthly revenue"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-white/40 block mb-1">Custom Destination Statement (Overrides Template)</label>
                    <textarea
                      value={destText}
                      onChange={e => setDestText(e.target.value)}
                      placeholder="Write your custom destination statement here or leave empty to use template..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                      rows={3}
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#B4F052]/5 border border-[#B4F052]/10 mt-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#B4F052] block mb-1">Destination Statement Preview</span>
                    <p className="text-xs text-white/80 font-mono italic leading-relaxed">{compiledDest}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Milestone Gathering */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Calendar size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 3: Milestone Gathering</h3>
                </div>
                <p className="text-xs text-white/60">
                  Establish key checkpoints across your time horizon. A milestone defines a completed, verified state.
                </p>

                {/* Milestone Form */}
                <form onSubmit={handleAddMilestone} className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.06] space-y-3">
                  <div className="text-[10px] uppercase font-bold text-[#B4F052]">Log Milestone</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-white/40 block mb-0.5">Milestone Description</label>
                      <input
                        type="text"
                        value={newMilestoneTitle}
                        onChange={e => setNewMilestoneTitle(e.target.value)}
                        placeholder="e.g. Conduct 15 problem validation interviews"
                        className="w-full px-2 py-1 bg-white/[0.02] border border-white/[0.08] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-0.5">Category</label>
                      <select
                        value={newMilestoneCat}
                        onChange={e => setNewMilestoneCat(e.target.value as Milestone['category'])}
                        className="w-full px-2 py-1 bg-black text-xs text-white rounded-lg border border-white/[0.08]"
                      >
                        {MILESTONE_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-white/40 block mb-0.5">Why it Matters (Rationale)</label>
                      <input
                        type="text"
                        value={newMilestoneWhy}
                        onChange={e => setNewMilestoneWhy(e.target.value)}
                        placeholder="e.g. ensures problem intensity justifies pricing"
                        className="w-full px-2 py-1 bg-white/[0.02] border border-white/[0.08] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-0.5">Time Horizon</label>
                      <select
                        value={newMilestoneHorizon}
                        onChange={e => setNewMilestoneHorizon(e.target.value as Milestone['horizon'])}
                        className="w-full px-2 py-1 bg-black text-xs text-white rounded-lg border border-white/[0.08]"
                      >
                        {TIME_HORIZONS.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="px-3 py-1.5 rounded-lg bg-[#B4F052] text-black text-xs font-bold hover:opacity-90 flex items-center gap-1.5 ml-auto">
                    <Plus size={12} /> Add Milestone
                  </button>
                </form>

                {/* List of Milestones */}
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {milestones.map((m) => (
                    <div key={m.id} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] flex justify-between items-start text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{m.title}</span>
                          <span className="px-1 py-0.5 bg-[#B4F052]/10 text-[#B4F052] text-[8px] rounded uppercase font-semibold">{m.horizon}</span>
                          <span className="px-1 py-0.5 bg-white/[0.06] text-white/50 text-[8px] rounded uppercase">{m.category}</span>
                        </div>
                        <p className="text-[10px] text-white/50 mt-1">Why: {m.whyMatters}</p>
                      </div>
                      <button type="button" onClick={() => handleRemoveMilestone(m.id)} className="text-white/20 hover:text-rose-400 p-1">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Step Gathering */}
            {activeTab === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <PlusCircle size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 4: Step Gathering</h3>
                </div>
                <p className="text-xs text-white/60">
                  Assign steps to milestones. Underneath, see recommended tasks from the 100-tasks framework to inspire your list.
                </p>

                {/* Step Form */}
                <form onSubmit={handleAddStep} className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.06] space-y-3">
                  <div className="text-[10px] uppercase font-bold text-[#B4F052]">Define Roadmap Step</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-white/40 block mb-0.5">Step Description / Action</label>
                      <input
                        type="text"
                        value={newStepTitle}
                        onChange={e => setNewStepTitle(e.target.value)}
                        placeholder="e.g. Set up database schemas"
                        className="w-full px-2 py-1 bg-white/[0.02] border border-white/[0.08] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-0.5">Associate with Milestone</label>
                      <select
                        value={newStepMilestoneId}
                        onChange={e => setNewStepMilestoneId(e.target.value)}
                        className="w-full px-2 py-1 bg-black text-xs text-white rounded-lg border border-white/[0.08]"
                      >
                        {milestones.map(m => (
                          <option key={m.id} value={m.id}>{m.title} ({m.horizon})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="px-3 py-1.5 rounded-lg bg-[#B4F052] text-black text-xs font-bold hover:opacity-90 flex items-center gap-1.5 ml-auto">
                    <Plus size={12} /> Add Step
                  </button>
                </form>

                {/* 100-Tasks Framework Inspiration */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#B4F052] block">100-Tasks Framework Suggestions (Click card to add)</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                    {FRAMEWORK_SUGGESTIONS.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddFrameworkSuggestion(s.title, s.category)}
                        className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-[#B4F052]/30 text-left transition-all text-xs flex justify-between items-center group"
                      >
                        <div>
                          <div className="font-semibold text-white group-hover:text-[#B4F052] transition-colors">{s.title}</div>
                          <span className="text-[9px] text-white/40">{s.category} • {s.desc}</span>
                        </div>
                        <Plus size={12} className="text-[#B4F052] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Dependencies & Unknowns Mapping */}
            {activeTab === 5 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Layers size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 5: Dependencies & Unknowns Mapping</h3>
                </div>
                <p className="text-xs text-white/60">
                  Select and define what must happen before each step can proceed, and log key operational risks.
                </p>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {steps.map((step, idx) => {
                    const assocM = milestones.find(m => m.id === step.milestoneId);
                    return (
                      <div key={step.id} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] space-y-2 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-white/90">{step.title}</span>
                            <span className="text-[9px] text-white/40 block mt-0.5">Milestone: {assocM?.title || 'None'}</span>
                          </div>
                          <button type="button" onClick={() => handleRemoveStep(step.id)} className="text-white/20 hover:text-rose-400">
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="text-[9px] text-white/40 block mb-0.5">Dependency Step / Milestone</label>
                            <input
                              type="text"
                              value={step.dependency}
                              onChange={e => {
                                const next = [...steps];
                                next[idx].dependency = e.target.value;
                                setSteps(next);
                              }}
                              className="w-full px-2 py-1 bg-white/[0.02] border border-white/[0.08] text-[10px] rounded focus:outline-none"
                              placeholder="e.g. s1, m1, or None"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-white/40 block mb-0.5">Operational Unknowns / Risks</label>
                            <input
                              type="text"
                              value={step.unknowns}
                              onChange={e => {
                                const next = [...steps];
                                next[idx].unknowns = e.target.value;
                                setSteps(next);
                              }}
                              className="w-full px-2 py-1 bg-white/[0.02] border border-white/[0.08] text-[10px] rounded focus:outline-none"
                              placeholder="e.g. third-party API approval delay"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {steps.length === 0 && (
                    <div className="text-center py-8 text-white/20 italic">No steps mapped. Go to Tab 4 to add steps.</div>
                  )}
                </div>
              </div>
            )}

            {/* Step 6: Open Questions Logger */}
            {activeTab === 6 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <HelpCircle size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 6: Open Questions Logger</h3>
                </div>
                <p className="text-xs text-white/60">
                  Log critical uncertainties that require research or customer discovery. This keeps track of what you still need to find out.
                </p>

                <form onSubmit={handleAddQuestion} className="flex gap-2">
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={e => setNewQuestion(e.target.value)}
                    placeholder="Enter an open question..."
                    className="flex-1 px-3 py-1.5 bg-white/[0.02] border border-white/[0.08] text-xs text-white rounded-lg focus:outline-none"
                  />
                  <button type="submit" className="p-1.5 rounded-lg bg-[#B4F052] text-black hover:opacity-90">
                    <Plus size={14} />
                  </button>
                </form>

                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {openQuestions.map((q, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 rounded bg-white/[0.01] border border-white/[0.04] text-xs">
                      <span className="text-white/80">{q}</span>
                      <button type="button" onClick={() => handleRemoveQuestion(idx)} className="text-white/20 hover:text-rose-400 p-1">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {openQuestions.length === 0 && <p className="text-center text-white/20 italic text-xs py-6">No open questions logged</p>}
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

        {/* Backlog Tabular view (Col span 1) */}
        <div className="space-y-6">
          <div className="glass-card p-6 border border-white/[0.08] bg-black/60 backdrop-blur-md space-y-6">
            <div className="border-b border-white/[0.08] pb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FileText size={16} className="text-[#B4F052]" />
                <h3 className="text-sm font-bold">Backlog Repository</h3>
              </div>
              <span className="text-[10px] font-mono text-white/40">{milestones.length} Milestones / {steps.length} Steps</span>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <label className="text-white/30 block mb-0.5 uppercase tracking-wider">Category</label>
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="w-full bg-black border border-white/[0.08] rounded px-1.5 py-1 text-white"
                >
                  <option value="All">All Categories</option>
                  {MILESTONE_CATEGORIES.map(x => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/30 block mb-0.5 uppercase tracking-wider">Horizon</label>
                <select
                  value={filterHorizon}
                  onChange={e => setFilterHorizon(e.target.value)}
                  className="w-full bg-black border border-white/[0.08] rounded px-1.5 py-1 text-white"
                >
                  <option value="All">All Horizons</option>
                  {TIME_HORIZONS.map(x => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
            </div>

            {/* Tabular Output */}
            <div className="max-h-[250px] overflow-y-auto space-y-3 pr-1 text-xs">
              {filteredMilestones.map(m => {
                const milestoneSteps = steps.filter(s => s.milestoneId === m.id);
                return (
                  <div key={m.id} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-1 mb-1.5">
                      <span className="font-bold text-[#B4F052] text-[10px]">{m.title}</span>
                      <span className="px-1 py-0.5 bg-[#B4F052]/10 text-[#B4F052] text-[8px] rounded uppercase">{m.horizon}</span>
                    </div>
                    {milestoneSteps.map((s, i) => (
                      <div key={s.id} className="py-1 pl-2 border-l border-[#B4F052]/30 text-[10px] text-white/80 leading-relaxed mb-1">
                        • {s.title}
                        {s.dependency !== 'None' && <span className="text-[8px] text-purple-400 block">Requires: {s.dependency}</span>}
                      </div>
                    ))}
                    {milestoneSteps.length === 0 && (
                      <span className="text-[9px] text-white/30 italic block pl-2">No steps assigned</span>
                    )}
                  </div>
                );
              })}
              {filteredMilestones.length === 0 && (
                <div className="text-center py-6 text-white/20 italic">No matching backlog items found.</div>
              )}
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
                Complete Task 6 & Continue
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
