'use client';
import React, { useState, useEffect } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, ArrowRight, Layers, Info, Trash2, Plus, Star, AlertTriangle, Sparkles, Activity, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PhasePDFGenerator from '@/components/PhasePDFGenerator';

interface Task3Statement {
  targetCustomer: string;
  problem: string;
  rootCauseOrContext: string;
  impact: string;
  trendSignal: string;
  finalStatement: string;
}

interface Task3TargetCustomer {
  primarySegment: string;
  specificPersona: string;
  problemContext: string;
  currentWorkaround: string;
  whyThisSegmentFirst: string;
}

interface CustomerSituation {
  whenProblemAppears: string;
  trigger: string;
  customerGoal: string;
  currentBehavior: string;
  whyDifficult: string;
}

interface MainJTBD {
  situation: string;
  motivationOrAction: string;
  desiredOutcome: string;
  finalStatement: string;
}

interface JobsState {
  functionalJob: string;
  emotionalJob: string;
  socialJob: string;
  mainJTBD: MainJTBD;
}

interface PainItem {
  id: string;
  description: string;
  category: 'functional' | 'emotional' | 'social' | 'risk' | 'cost/time';
  frequency: string;
  intensity: number;
  evidence: string;
}

interface GainItem {
  id: string;
  description: string;
  category: 'functional' | 'emotional' | 'social' | 'time/cost' | 'strategic';
  importance: number;
  desiredOutcome: string;
  evidence: string;
}

interface MatrixRow {
  id: string;
  situation: string;
  jobToBeDone: string;
  painBlockingProgress: string;
  desiredGain: string;
  importance: number;
  evidence: string;
}

interface AdvancedProcessStep {
  customerAction: string;
  pain: string;
  desiredGain: string;
  valueClue: string;
}

type AdvancedProcessMap = Record<string, AdvancedProcessStep>;

const INITIAL_ADVANCED_STEPS = {
  define: { customerAction: '', pain: '', desiredGain: '', valueClue: '' },
  locate: { customerAction: '', pain: '', desiredGain: '', valueClue: '' },
  prepare: { customerAction: '', pain: '', desiredGain: '', valueClue: '' },
  confirm: { customerAction: '', pain: '', desiredGain: '', valueClue: '' },
  execute: { customerAction: '', pain: '', desiredGain: '', valueClue: '' },
  monitor: { customerAction: '', pain: '', desiredGain: '', valueClue: '' },
  modify: { customerAction: '', pain: '', desiredGain: '', valueClue: '' },
  conclude: { customerAction: '', pain: '', desiredGain: '', valueClue: '' }
};

export default function Task4Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput } = useGarage();

  // Load Task 3 Data (Inputs)
  const task3Statement = (() => {
    const raw = getTaskInput(3, 'selectedProblemStatement');
    if (raw) {
      try {
        return JSON.parse(raw) as Task3Statement;
      } catch {}
    }
    return null;
  })();

  const task3Customer = (() => {
    const raw = getTaskInput(3, 'targetCustomer');
    if (raw) {
      try {
        return JSON.parse(raw) as Task3TargetCustomer;
      } catch {}
    }
    return null;
  })();

  const task3Rationale = getTaskInput(3, 'decisionRationale') || '';
  const task3Id = getTaskInput(3, 'selectedProblemId') || '';

  // Task 4 States (lazy initialized from context storage)
  const [isProblemConfirmed, setIsProblemConfirmed] = useState<boolean>(() => {
    return getTaskInput(4, 'isProblemConfirmed') === 'true';
  });

  const [customerSituation, setCustomerSituation] = useState<CustomerSituation>(() => {
    const raw = getTaskInput(4, 'customerSituation');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return {
      whenProblemAppears: task3Customer?.problemContext || '',
      trigger: task3Statement?.rootCauseOrContext || '',
      customerGoal: task3Statement?.problem || '',
      currentBehavior: task3Customer?.currentWorkaround || '',
      whyDifficult: ''
    };
  });

  const [jobs, setJobs] = useState<JobsState>(() => {
    const raw = getTaskInput(4, 'jobs');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    const situationSeed = task3Customer?.problemContext || '';
    const motivationSeed = task3Statement?.problem || '';
    const outcomeSeed = task3Statement?.impact || '';
    const finalStmtSeed = `${situationSeed ? 'When ' + situationSeed : ''}${motivationSeed ? ', I want to ' + motivationSeed : ''}${outcomeSeed ? ', so I can ' + outcomeSeed : ''}`.trim();
    return {
      functionalJob: '',
      emotionalJob: '',
      socialJob: '',
      mainJTBD: {
        situation: situationSeed,
        motivationOrAction: motivationSeed,
        desiredOutcome: outcomeSeed,
        finalStatement: finalStmtSeed
      }
    };
  });

  const [pains, setPains] = useState<PainItem[]>(() => {
    const raw = getTaskInput(4, 'pains');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [];
  });

  const [gains, setGains] = useState<GainItem[]>(() => {
    const raw = getTaskInput(4, 'gains');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [];
  });

  const [jtbdMatrix, setJtbdMatrix] = useState<MatrixRow[]>(() => {
    const raw = getTaskInput(4, 'jtbdMatrix');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [];
  });

  const [processMap, setProcessMap] = useState<AdvancedProcessMap>(() => {
    const raw = getTaskInput(4, 'advancedJobProcessMap');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return INITIAL_ADVANCED_STEPS;
  });

  useEffect(() => {
    const rawSituation = getTaskInput(4, 'customerSituation');
    const rawJobs = getTaskInput(4, 'jobs');
    if (!rawSituation) {
      setTaskInput(4, 'customerSituation', JSON.stringify(customerSituation));
    }
    if (!rawJobs) {
      setTaskInput(4, 'jobs', JSON.stringify(jobs));
    }
  }, [customerSituation, jobs, getTaskInput, setTaskInput]);

  // Expandable sections for process map
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  // Form states for adding Pain / Gain / Matrix row
  const [newPain, setNewPain] = useState<Omit<PainItem, 'id'>>({
    description: '',
    category: 'functional',
    frequency: '',
    intensity: 3,
    evidence: ''
  });

  const [newGain, setNewGain] = useState<Omit<GainItem, 'id'>>({
    description: '',
    category: 'functional',
    importance: 3,
    desiredOutcome: '',
    evidence: ''
  });

  const [newMatrixRow, setNewMatrixRow] = useState<Omit<MatrixRow, 'id'>>({
    situation: '',
    jobToBeDone: '',
    painBlockingProgress: '',
    desiredGain: '',
    importance: 3,
    evidence: ''
  });

  const saveField = (key: string, val: unknown) => {
    setTaskInput(4, key, typeof val === 'string' ? val : JSON.stringify(val));
  };

  // Updaters
  const handleConfirmProblem = () => {
    setIsProblemConfirmed(true);
    saveField('isProblemConfirmed', 'true');
  };

  const handleResetConfirmProblem = () => {
    setIsProblemConfirmed(false);
    saveField('isProblemConfirmed', 'false');
  };

  const updateSituation = (field: keyof CustomerSituation, value: string) => {
    const next = { ...customerSituation, [field]: value };
    setCustomerSituation(next);
    saveField('customerSituation', next);
  };

  const updateJobField = (field: 'functionalJob' | 'emotionalJob' | 'socialJob', value: string) => {
    const next = { ...jobs, [field]: value };
    setJobs(next);
    saveField('jobs', next);
  };

  const updateMainJTBDField = (field: keyof MainJTBD, value: string) => {
    const nextMain = { ...jobs.mainJTBD, [field]: value };
    const sit = nextMain.situation ? `When ${nextMain.situation}` : '';
    const mot = nextMain.motivationOrAction ? `, I want to ${nextMain.motivationOrAction}` : '';
    const out = nextMain.desiredOutcome ? `, so I can ${nextMain.desiredOutcome}.` : '';
    nextMain.finalStatement = `${sit}${mot}${out}`.trim().replace(/^, /, '');
    const nextJobs = { ...jobs, mainJTBD: nextMain };
    setJobs(nextJobs);
    saveField('jobs', nextJobs);
  };

  // Add/Remove Pain
  const addPain = () => {
    if (!newPain.description.trim()) return;
    const item: PainItem = {
      ...newPain,
      id: `pain_${Date.now()}`
    };
    const next = [...pains, item];
    setPains(next);
    saveField('pains', next);
    setNewPain({
      description: '',
      category: 'functional',
      frequency: '',
      intensity: 3,
      evidence: ''
    });
  };

  const removePain = (id: string) => {
    const next = pains.filter(p => p.id !== id);
    setPains(next);
    saveField('pains', next);
  };

  // Add/Remove Gain
  const addGain = () => {
    if (!newGain.description.trim()) return;
    const item: GainItem = {
      ...newGain,
      id: `gain_${Date.now()}`
    };
    const next = [...gains, item];
    setGains(next);
    saveField('gains', next);
    setNewGain({
      description: '',
      category: 'functional',
      importance: 3,
      desiredOutcome: '',
      evidence: ''
    });
  };

  const removeGain = (id: string) => {
    const next = gains.filter(g => g.id !== id);
    setGains(next);
    saveField('gains', next);
  };

  // Add/Remove Matrix Row
  const addMatrixRow = () => {
    if (!newMatrixRow.jobToBeDone && !newMatrixRow.painBlockingProgress && !newMatrixRow.desiredGain) return;
    const item: MatrixRow = {
      ...newMatrixRow,
      id: `matrix_${Date.now()}`
    };
    const next = [...jtbdMatrix, item];
    setJtbdMatrix(next);
    saveField('jtbdMatrix', next);
    setNewMatrixRow({
      situation: '',
      jobToBeDone: '',
      painBlockingProgress: '',
      desiredGain: '',
      importance: 3,
      evidence: ''
    });
  };

  const removeMatrixRow = (id: string) => {
    const next = jtbdMatrix.filter(row => row.id !== id);
    setJtbdMatrix(next);
    saveField('jtbdMatrix', next);
  };

  const updateProcessMap = (step: string, field: keyof AdvancedProcessStep, value: string) => {
    const next = {
      ...processMap,
      [step]: {
        ...processMap[step],
        [field]: value
      }
    };
    setProcessMap(next);
    saveField('advancedJobProcessMap', next);
  };

  // Checklist verification
  const checklist = {
    selectedProblemImported: !!task3Id && isProblemConfirmed,
    customerSituationDefined: Object.values(customerSituation).every(v => v.trim().length > 0),
    mainJTBDWritten: !!jobs.mainJTBD.situation.trim() && !!jobs.mainJTBD.motivationOrAction.trim() && !!jobs.mainJTBD.desiredOutcome.trim(),
    jobsIdentified: !!jobs.functionalJob.trim() && !!jobs.emotionalJob.trim() && !!jobs.socialJob.trim(),
    painsMapped: pains.length >= 1,
    gainsMapped: gains.length >= 1,
    jtbdMatrixGenerated: jtbdMatrix.length >= 1,
    painGainMapGenerated: pains.length >= 1 && gains.length >= 1
  };

  const checklistItems = [
    { key: 'selectedProblemImported', label: 'Import and confirm problem statement from Task 3' },
    { key: 'customerSituationDefined', label: 'Define the 5 customer situation aspects' },
    { key: 'mainJTBDWritten', label: 'Draft the main Job To Be Done statement' },
    { key: 'jobsIdentified', label: 'Identify functional, emotional, and social jobs' },
    { key: 'painsMapped', label: 'Map at least one customer pain point' },
    { key: 'gainsMapped', label: 'Map at least one customer gain benefit' },
    { key: 'jtbdMatrixGenerated', label: 'Create at least one row in the JTBD Matrix' },
    { key: 'painGainMapGenerated', label: 'Create a combined customer profile (pains & gains)' }
  ];

  const allComplete = Object.values(checklist).every(v => v === true);

  const handleCompleteTask = () => {
    if (!allComplete) {
      if (!confirm('Some checklist items are not fully completed yet. Do you want to complete the task anyway?')) {
        return;
      }
    }
    completeTask(4);
    router.push('/tasks/5');
  };

  // If Task 3 not finished
  if (!task3Id || !task3Statement) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="glass-card p-8 border border-white/[0.08] inline-block max-w-lg">
          <AlertTriangle className="mx-auto mb-4 text-[#B4F052]" size={48} />
          <h2 className="text-xl font-bold mb-2">Task 3 Incomplete</h2>
          <p className="text-white/60 mb-6 text-sm">
            You need to select one focus problem in Task 3 before mapping pains, gains and Jobs To Be Done.
          </p>
          <Link href="/tasks/3" className="inline-flex items-center gap-2 glass-button px-6 py-3 rounded-xl text-sm font-semibold transition-all">
            Go to Task 3
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const painCategoryColor = {
    functional: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    emotional: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    social: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
    risk: 'bg-red-500/10 text-red-400 border border-red-500/20',
    'cost/time': 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
  };

  const gainCategoryColor = {
    functional: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    emotional: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    social: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
    'time/cost': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    strategic: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 animate-fade-in">
      {/* 1. Header Area */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-8">
        <div className="flex-1">
          <div className="text-[#B4F052] text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Layers size={12} />
            Task 4 Redesign
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Pinpoint Pains, Gains and Jobs To Be Done</h1>
          <p className="text-sm text-white/60 max-w-2xl leading-relaxed">
            Understand what your target customer is trying to achieve, what blocks them and what better outcome they want.
          </p>
          <div className="mt-4 p-3 rounded-xl bg-[#B4F052]/10 border border-[#B4F052]/20 flex items-start gap-2 max-w-2xl">
            <Info size={16} className="text-[#B4F052] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#B4F052] leading-relaxed font-medium">
              <strong>Warning:</strong> Do not design the solution yet. This task is about understanding the customer’s job, pains and desired gains. We map opportunity areas, not product features.
            </div>
          </div>
        </div>

        {/* Cockpit Card */}
        <div className="glass-card p-5 w-full lg:w-80 border border-white/[0.08] relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#B4F052]/5 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 pb-1 border-b border-white/[0.06]">Mission Cockpit</h3>
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs text-white/70">
            <div>Stage:</div>
            <div className="font-semibold text-emerald-400 text-right">SETUP</div>
            <div>Sub-stage:</div>
            <div className="font-semibold text-white/90 text-right">Start with Problems</div>
            <div>Function:</div>
            <div className="font-semibold text-white/90 text-right">Business</div>
            <div>Difficulty:</div>
            <div className="font-semibold text-white/90 text-right">Beginner (1/3)</div>
            <div>Time Limit:</div>
            <div className="font-semibold text-white/90 text-right">~4h</div>
            <div>Input:</div>
            <div className="font-semibold text-[#B4F052] text-right truncate" title="Selected Problem Statement">Selected Problem</div>
            <div>Output:</div>
            <div className="font-semibold text-white/90 text-right">Customer Problem Map</div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.06]">
            <Link href="/tasks/5" className="flex items-center justify-between text-xs text-white/40 hover:text-[#B4F052] transition-colors">
              <span>Next: Task 5 - Mission & Values</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Imported Problem Panel */}
      <div className="glass-card p-6 mb-8 border border-white/[0.08]">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={16} className="text-[#B4F052]" />
          <h2 className="text-xs uppercase font-bold text-white/40 tracking-wider">Imported Focus Data from Task 3</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
          <div>
            <label className="text-xs text-white/30 block mb-1">Focus Customer Segment</label>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white/90 font-medium">
              {task3Customer?.primarySegment || 'N/A'}
            </div>
            {task3Customer?.specificPersona && (
              <div className="mt-2 text-xs text-white/50">
                <span className="font-semibold">Persona Detail:</span> {task3Customer.specificPersona}
              </div>
            )}
          </div>
          <div>
            <label className="text-xs text-white/30 block mb-1">Context / Triggers</label>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white/90">
              {task3Customer?.problemContext || 'N/A'}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-white/30 block mb-1">Focus Problem Statement</label>
            <div className="p-4 rounded-xl bg-[#B4F052]/5 border border-[#B4F052]/10 text-[#B4F052] font-semibold text-base leading-relaxed">
              {task3Statement?.finalStatement || 'N/A'}
            </div>
          </div>
          <div>
            <label className="text-xs text-white/30 block mb-1">Current Workarounds</label>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white/80 text-xs leading-relaxed">
              {task3Customer?.currentWorkaround || 'N/A'}
            </div>
          </div>
          <div>
            <label className="text-xs text-white/30 block mb-1">Selection Rationale</label>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white/80 text-xs leading-relaxed">
              {task3Rationale || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section 1: Review & Confirm Focus Problem */}
      <div className="glass-card p-6 mb-8 border border-white/[0.08]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white/[0.08] text-white text-xs flex items-center justify-center font-bold">1</span>
            <h2 className="text-lg font-bold">Review Selected Problem</h2>
          </div>
          {isProblemConfirmed && (
            <span className="text-xs text-[#B4F052] font-semibold flex items-center gap-1">
              <Check size={12} /> Focus Confirmed
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.06] space-y-3">
            <p className="text-xs text-white/40">Review the structured parts of the chosen problem statement:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-black/20">
                <span className="text-[#B4F052] block font-semibold mb-1">Target Customer:</span>
                <span className="text-white/80">{task3Statement?.targetCustomer}</span>
              </div>
              <div className="p-3 rounded-lg bg-black/20">
                <span className="text-[#B4F052] block font-semibold mb-1">Core Problem:</span>
                <span className="text-white/80">{task3Statement?.problem}</span>
              </div>
              <div className="p-3 rounded-lg bg-black/20">
                <span className="text-[#B4F052] block font-semibold mb-1">Root Cause / Context:</span>
                <span className="text-white/80">{task3Statement?.rootCauseOrContext}</span>
              </div>
              <div className="p-3 rounded-lg bg-black/20">
                <span className="text-[#B4F052] block font-semibold mb-1">Business Impact:</span>
                <span className="text-white/80">{task3Statement?.impact}</span>
              </div>
              <div className="p-3 rounded-lg bg-black/20 md:col-span-2">
                <span className="text-[#B4F052] block font-semibold mb-1">Macro Trend Signal:</span>
                <span className="text-white/80">{task3Statement?.trendSignal}</span>
              </div>
            </div>
            <p className="text-xs text-white/50 italic pt-1">
              Before you continue, make sure this still feels like the right problem to analyze.
            </p>
          </div>

          <div className="flex gap-3">
            {!isProblemConfirmed ? (
              <button onClick={handleConfirmProblem} className="glass-button px-5 py-2.5 text-xs flex items-center gap-1.5">
                <Check size={14} /> Confirm and Continue
              </button>
            ) : (
              <button onClick={handleResetConfirmProblem} className="px-4 py-2.5 rounded-xl border border-white/10 text-white/40 hover:text-white/70 text-xs transition-colors">
                Unlock Statement
              </button>
            )}
          </div>
        </div>
      </div>

      {isProblemConfirmed ? (
        <div className="space-y-8">
          {/* 4. Section 2: Define Customer Situation */}
          <div className="glass-card p-6 border border-white/[0.08]">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-white/[0.08] text-white text-xs flex items-center justify-center font-bold">2</span>
              <h2 className="text-lg font-bold">Define Customer Situation</h2>
            </div>
            <p className="text-xs text-white/50 mb-6 leading-relaxed">
              Analyze the precise context in which the problem occurs. Defining the trigger and difficulty forms the core baseline of the Jobs To Be Done model.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/50 block mb-1">When does this problem appear?</label>
                <input
                  type="text"
                  value={customerSituation.whenProblemAppears}
                  onChange={e => updateSituation('whenProblemAppears', e.target.value)}
                  placeholder="e.g. When a small company starts introducing AI tools without a clear internal policy."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40 focus:bg-white/[0.04] transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1">What triggers the problem?</label>
                <input
                  type="text"
                  value={customerSituation.trigger}
                  onChange={e => updateSituation('trigger', e.target.value)}
                  placeholder="e.g. Employees start using random AI tools for client work."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40 focus:bg-white/[0.04] transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1">What is the customer trying to accomplish?</label>
                <input
                  type="text"
                  value={customerSituation.customerGoal}
                  onChange={e => updateSituation('customerGoal', e.target.value)}
                  placeholder="e.g. Use AI to improve productivity without creating data or compliance risks."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40 focus:bg-white/[0.04] transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1">What does the customer do today? (Current Behaviors)</label>
                <input
                  type="text"
                  value={customerSituation.currentBehavior}
                  onChange={e => updateSituation('currentBehavior', e.target.value)}
                  placeholder="e.g. They test tools informally, ask colleagues, create ad hoc rules or avoid AI entirely."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40 focus:bg-white/[0.04] transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1">What makes this situation difficult?</label>
                <textarea
                  value={customerSituation.whyDifficult}
                  onChange={e => updateSituation('whyDifficult', e.target.value)}
                  placeholder="e.g. Lack of knowledge, too many tools, unclear risks, no internal owner."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40 focus:bg-white/[0.04] transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* 5. Section 3: Map Customer Jobs */}
          <div className="glass-card p-6 border border-white/[0.08]">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-white/[0.08] text-white text-xs flex items-center justify-center font-bold">3</span>
              <h2 className="text-lg font-bold">Map Customer Jobs</h2>
            </div>
            <p className="text-xs text-white/50 mb-6 leading-relaxed">
              A &ldquo;job&rdquo; represents the progress a customer wants to make. It is not their job title, but the functional, emotional, and social outcomes they seek.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.05]">
                <label className="text-xs font-semibold text-blue-400 block mb-1">Functional Job</label>
                <span className="text-[10px] text-white/40 block mb-2">What practical tasks are they trying to complete?</span>
                <textarea
                  value={jobs.functionalJob}
                  onChange={e => updateJobField('functionalJob', e.target.value)}
                  placeholder="e.g. Choose safe and useful AI tools for the company."
                  rows={3}
                  className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                />
              </div>
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.05]">
                <label className="text-xs font-semibold text-purple-400 block mb-1">Emotional Job</label>
                <span className="text-[10px] text-white/40 block mb-2">How does the customer want to feel during/after?</span>
                <textarea
                  value={jobs.emotionalJob}
                  onChange={e => updateJobField('emotionalJob', e.target.value)}
                  placeholder="e.g. Feel confident instead of overwhelmed by AI."
                  rows={3}
                  className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                />
              </div>
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.05]">
                <label className="text-xs font-semibold text-teal-400 block mb-1">Social Job</label>
                <span className="text-[10px] text-white/40 block mb-2">How does the customer want to be perceived by others?</span>
                <textarea
                  value={jobs.socialJob}
                  onChange={e => updateJobField('socialJob', e.target.value)}
                  placeholder="e.g. Be seen as a modern leader who responsibly introduces AI."
                  rows={3}
                  className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                />
              </div>
            </div>

            {/* Main JTBD Statement Builder */}
            <div className="p-5 rounded-xl bg-[#B4F052]/5 border border-[#B4F052]/10 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-[#B4F052]" />
                <h3 className="text-xs font-bold text-[#B4F052] uppercase tracking-wider">Main Job To Be Done Builder</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-white/40 block mb-1">When [situation...]</label>
                  <input
                    type="text"
                    value={jobs.mainJTBD.situation}
                    onChange={e => updateMainJTBDField('situation', e.target.value)}
                    placeholder="e.g. my company starts using AI tools"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#B4F052]/40"
                  />
                </div>
                <div>
                  <label className="text-white/40 block mb-1">I want to [motivation / action...]</label>
                  <input
                    type="text"
                    value={jobs.mainJTBD.motivationOrAction}
                    onChange={e => updateMainJTBDField('motivationOrAction', e.target.value)}
                    placeholder="e.g. understand which tools are safe and useful"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#B4F052]/40"
                  />
                </div>
                <div>
                  <label className="text-white/40 block mb-1">so I can [desired outcome...]</label>
                  <input
                    type="text"
                    value={jobs.mainJTBD.desiredOutcome}
                    onChange={e => updateMainJTBDField('desiredOutcome', e.target.value)}
                    placeholder="e.g. improve productivity without exposing business to risk"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#B4F052]/40"
                  />
                </div>
              </div>

              {jobs.mainJTBD.finalStatement && (
                <div className="pt-2">
                  <span className="text-[10px] text-white/30 block mb-1">Generated Main JTBD Statement</span>
                  <div className="p-3.5 rounded-lg bg-black/50 text-white border border-white/[0.08] text-sm italic">
                    &ldquo;{jobs.mainJTBD.finalStatement}&rdquo;
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 6. Section 4: Identify Pains */}
          <div className="glass-card p-6 border border-white/[0.08]">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-white/[0.08] text-white text-xs flex items-center justify-center font-bold">4</span>
              <h2 className="text-lg font-bold">Identify Pains (Customer Obstacles)</h2>
            </div>
            <p className="text-xs text-white/50 mb-6 leading-relaxed">
              Identify the costs, risks, negative feelings, or obstacles your target customer faces when trying to get the job done. Rank their intensity and provide observed evidence.
            </p>

            {/* Form to add a pain */}
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.06] mb-6 space-y-4">
              <h3 className="text-xs font-semibold text-white/60">Add a Customer Pain Point</h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                <div className="md:col-span-5">
                  <label className="text-white/40 block mb-1">Pain Description</label>
                  <input
                    type="text"
                    value={newPain.description}
                    onChange={e => setNewPain({ ...newPain, description: e.target.value })}
                    placeholder="e.g. Unsure which tools violate client data agreements"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-white/40 block mb-1">Category</label>
                  <select
                    value={newPain.category}
                    onChange={e => setNewPain({ ...newPain, category: e.target.value as PainItem['category'] })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#B4F052]/40"
                  >
                    <option value="functional">Functional</option>
                    <option value="emotional">Emotional</option>
                    <option value="social">Social</option>
                    <option value="risk">Risk</option>
                    <option value="cost/time">Cost / Time</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-white/40 block mb-1">Intensity (1-5)</label>
                  <select
                    value={newPain.intensity}
                    onChange={e => setNewPain({ ...newPain, intensity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-[#B4F052] focus:outline-none focus:border-[#B4F052]/40 font-bold"
                  >
                    <option value="1">1 - Low</option>
                    <option value="2">2 - Minor</option>
                    <option value="3">3 - Moderate</option>
                    <option value="4">4 - High</option>
                    <option value="5">5 - Critical</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-white/40 block mb-1">Frequency</label>
                  <input
                    type="text"
                    value={newPain.frequency}
                    onChange={e => setNewPain({ ...newPain, frequency: e.target.value })}
                    placeholder="e.g. Daily / Often"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                  />
                </div>
                <div className="md:col-span-10">
                  <label className="text-white/40 block mb-1">Observed Evidence / Quotes</label>
                  <input
                    type="text"
                    value={newPain.evidence}
                    onChange={e => setNewPain({ ...newPain, evidence: e.target.value })}
                    placeholder="e.g. Team leads report that they blocked several projects due to legal questions"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                  />
                </div>
                <div className="md:col-span-2 flex items-end">
                  <button
                    onClick={addPain}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium hover:border-[#B4F052]/30 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            </div>

            {/* Pains Table */}
            {pains.length === 0 ? (
              <div className="text-center py-6 text-xs text-white/30 bg-black/20 rounded-xl border border-dashed border-white/10">
                No pain points defined yet. Add some items above to populate your pain map.
              </div>
            ) : (
              <div className="overflow-x-auto border border-white/[0.06] rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] text-white/40 uppercase tracking-wider border-b border-white/[0.06]">
                      <th className="p-3">Pain Description</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-center">Intensity</th>
                      <th className="p-3">Frequency</th>
                      <th className="p-3">Evidence / Quotes</th>
                      <th className="p-3 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {pains.map(p => (
                      <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-3 font-semibold text-white/90">{p.description}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${painCategoryColor[p.category]}`}>
                            {p.category}
                          </span>
                        </td>
                        <td className="p-3 text-center whitespace-nowrap">
                          <div className="inline-flex gap-0.5 text-[#B4F052]">
                            {Array.from({ length: p.intensity }, (_, i) => (
                              <Star key={i} size={10} className="fill-[#B4F052]" />
                            ))}
                            {Array.from({ length: 5 - p.intensity }, (_, i) => (
                              <Star key={i} size={10} className="opacity-20" />
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-white/60">{p.frequency || '-'}</td>
                        <td className="p-3 text-white/60 max-w-xs truncate" title={p.evidence}>{p.evidence || '-'}</td>
                        <td className="p-3 text-center">
                          <button onClick={() => removePain(p.id)} className="text-white/30 hover:text-red-400 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 7. Section 5: Identify Gains */}
          <div className="glass-card p-6 border border-white/[0.08]">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-white/[0.08] text-white text-xs flex items-center justify-center font-bold">5</span>
              <h2 className="text-lg font-bold">Identify Gains (Customer Desires)</h2>
            </div>
            <p className="text-xs text-white/50 mb-6 leading-relaxed">
              Identify the positive outcomes, efficiencies, social elevations, or benefits your target customer dreams of or expects. Rank their importance and explain the expected outcomes.
            </p>

            {/* Form to add a gain */}
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.06] mb-6 space-y-4">
              <h3 className="text-xs font-semibold text-white/60">Add a Customer Desired Gain</h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                <div className="md:col-span-5">
                  <label className="text-white/40 block mb-1">Gain Description</label>
                  <input
                    type="text"
                    value={newGain.description}
                    onChange={e => setNewGain({ ...newGain, description: e.target.value })}
                    placeholder="e.g. Confident team introducing legal AI software"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-white/40 block mb-1">Category</label>
                  <select
                    value={newGain.category}
                    onChange={e => setNewGain({ ...newGain, category: e.target.value as GainItem['category'] })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#B4F052]/40"
                  >
                    <option value="functional">Functional</option>
                    <option value="emotional">Emotional</option>
                    <option value="social">Social</option>
                    <option value="time/cost">Time / Cost</option>
                    <option value="strategic">Strategic</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-white/40 block mb-1">Importance (1-5)</label>
                  <select
                    value={newGain.importance}
                    onChange={e => setNewGain({ ...newGain, importance: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-[#B4F052] focus:outline-none focus:border-[#B4F052]/40 font-bold"
                  >
                    <option value="1">1 - Nice to have</option>
                    <option value="2">2 - Expected</option>
                    <option value="3">3 - Desired</option>
                    <option value="4">4 - High Value</option>
                    <option value="5">5 - Transformational</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex items-end">
                  <button
                    onClick={addGain}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium hover:border-[#B4F052]/30 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="md:col-span-6">
                  <label className="text-white/40 block mb-1">Desired Outcome</label>
                  <input
                    type="text"
                    value={newGain.desiredOutcome}
                    onChange={e => setNewGain({ ...newGain, desiredOutcome: e.target.value })}
                    placeholder="e.g. Fully compliant legal policies with clear guidelines"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                  />
                </div>
                <div className="md:col-span-6">
                  <label className="text-white/40 block mb-1">Evidence or Observation</label>
                  <input
                    type="text"
                    value={newGain.evidence}
                    onChange={e => setNewGain({ ...newGain, evidence: e.target.value })}
                    placeholder="e.g. Employee survey indicates 84% desire clearer AI security instructions"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                  />
                </div>
              </div>
            </div>

            {/* Gains Table */}
            {gains.length === 0 ? (
              <div className="text-center py-6 text-xs text-white/30 bg-black/20 rounded-xl border border-dashed border-white/10">
                No gains defined yet. Add some items above to populate your gains map.
              </div>
            ) : (
              <div className="overflow-x-auto border border-white/[0.06] rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] text-white/40 uppercase tracking-wider border-b border-white/[0.06]">
                      <th className="p-3">Gain Description</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-center">Importance</th>
                      <th className="p-3">Desired Outcome</th>
                      <th className="p-3">Evidence / Quotes</th>
                      <th className="p-3 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {gains.map(g => (
                      <tr key={g.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-3 font-semibold text-white/90">{g.description}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${gainCategoryColor[g.category]}`}>
                            {g.category}
                          </span>
                        </td>
                        <td className="p-3 text-center whitespace-nowrap">
                          <div className="inline-flex gap-0.5 text-[#B4F052]">
                            {Array.from({ length: g.importance }, (_, i) => (
                              <Star key={i} size={10} className="fill-[#B4F052]" />
                            ))}
                            {Array.from({ length: 5 - g.importance }, (_, i) => (
                              <Star key={i} size={10} className="opacity-20" />
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-white/60">{g.desiredOutcome || '-'}</td>
                        <td className="p-3 text-white/60 max-w-xs truncate" title={g.evidence}>{g.evidence || '-'}</td>
                        <td className="p-3 text-center">
                          <button onClick={() => removeGain(g.id)} className="text-white/30 hover:text-red-400 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 5.5: Visual Pain/Gain Canvas Map */}
          <div className="glass-card p-6 border border-white/[0.08] space-y-6 bg-white/[0.02] backdrop-blur-md">
            <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
              <Sparkles size={18} className="text-[#B4F052]" />
              <h3 className="text-base font-bold text-white">Section 5.5: Visual Pain/Gain Canvas Map</h3>
            </div>
            
            <p className="text-xs text-white/50 leading-relaxed">
              Visual map organizing customer jobs, pains by intensity, and gains by importance.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Jobs Summary Card */}
              <div className="glass-card p-5 border border-white/[0.06] bg-white/[0.01] space-y-4">
                <h4 className="text-xs font-bold text-[#B4F052] uppercase tracking-wider font-mono">Customer Jobs</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-[9px] uppercase font-mono text-white/40 block">Main JTBD Statement</span>
                    <p className="text-xs text-white/90 font-medium leading-relaxed italic border-l-2 border-[#B4F052]/40 pl-2 mt-0.5">
                      {jobs.mainJTBD.finalStatement || 'No main JTBD statement generated.'}
                    </p>
                  </div>
                  {jobs.functionalJob && (
                    <div>
                      <span className="text-[9px] uppercase font-mono text-white/40 block">Functional Job</span>
                      <p className="text-xs text-white/80 mt-0.5">{jobs.functionalJob}</p>
                    </div>
                  )}
                  {jobs.emotionalJob && (
                    <div>
                      <span className="text-[9px] uppercase font-mono text-white/40 block">Emotional Job</span>
                      <p className="text-xs text-white/80 mt-0.5">{jobs.emotionalJob}</p>
                    </div>
                  )}
                  {jobs.socialJob && (
                    <div>
                      <span className="text-[9px] uppercase font-mono text-white/40 block">Social Job</span>
                      <p className="text-xs text-white/80 mt-0.5">{jobs.socialJob}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pains by Intensity Card */}
              <div className="glass-card p-5 border border-white/[0.06] bg-white/[0.01] space-y-4">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono">Pains (By Intensity)</h4>
                <div className="space-y-3">
                  {pains.length === 0 ? (
                    <p className="text-xs text-white/30 italic">No pains defined yet.</p>
                  ) : (
                    <>
                      {/* High Intensity (4-5) */}
                      {pains.filter(p => p.intensity >= 4).length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Severe / Critical (4-5)
                          </span>
                          <div className="space-y-1">
                            {pains.filter(p => p.intensity >= 4).map(p => (
                              <div key={p.id} className="text-xs p-2 rounded bg-rose-500/5 border border-rose-500/10 text-white/85">
                                {p.description} <span className="font-mono text-[9px] text-rose-400/80">({p.intensity}/5)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Medium/Low Intensity (1-3) */}
                      {pains.filter(p => p.intensity < 4).length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Moderate / Minor (1-3)
                          </span>
                          <div className="space-y-1">
                            {pains.filter(p => p.intensity < 4).map(p => (
                              <div key={p.id} className="text-xs p-2 rounded bg-amber-500/5 border border-amber-500/10 text-white/85">
                                {p.description} <span className="font-mono text-[9px] text-amber-400/80">({p.intensity}/5)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Gains by Importance Card */}
              <div className="glass-card p-5 border border-white/[0.06] bg-white/[0.01] space-y-4">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">Gains (By Importance)</h4>
                <div className="space-y-3">
                  {gains.length === 0 ? (
                    <p className="text-xs text-white/30 italic">No gains defined yet.</p>
                  ) : (
                    <>
                      {/* Critical Gains (4-5) */}
                      {gains.filter(g => g.importance >= 4).length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            High Importance / Required (4-5)
                          </span>
                          <div className="space-y-1">
                            {gains.filter(g => g.importance >= 4).map(g => (
                              <div key={g.id} className="text-xs p-2 rounded bg-emerald-500/5 border border-emerald-500/10 text-white/85">
                                {g.description} <span className="font-mono text-[9px] text-emerald-400/80">({g.importance}/5)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Lower Importance Gains (1-3) */}
                      {gains.filter(g => g.importance < 4).length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            Nice-to-Have / Desired (1-3)
                          </span>
                          <div className="space-y-1">
                            {gains.filter(g => g.importance < 4).map(g => (
                              <div key={g.id} className="text-xs p-2 rounded bg-cyan-500/5 border border-cyan-500/10 text-white/85">
                                {g.description} <span className="font-mono text-[9px] text-cyan-400/80">({g.importance}/5)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 8. Section 6: Build JTBD Matrix */}
          <div className="glass-card p-6 border border-white/[0.08]">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-white/[0.08] text-white text-xs flex items-center justify-center font-bold">6</span>
              <h2 className="text-lg font-bold">Build JTBD Matrix</h2>
            </div>
            <p className="text-xs text-white/50 mb-6 leading-relaxed">
              Create a unified Customer Problem Map matrix. Link the situation, customer job, the pain blocking progress, the desired outcome gain, and evidence together.
            </p>

            {/* Matrix Form Constructor */}
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.06] mb-6 space-y-4">
              <h3 className="text-xs font-semibold text-white/60">Construct a Matrix Mapping Row</h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                <div className="md:col-span-4">
                  <label className="text-white/40 block mb-1">Situation (e.g. Trigger / Event)</label>
                  <input
                    type="text"
                    value={newMatrixRow.situation}
                    onChange={e => setNewMatrixRow({ ...newMatrixRow, situation: e.target.value })}
                    placeholder="e.g. Company starts using AI tools"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="text-white/40 block mb-1">Job To Be Done</label>
                  <select
                    value={newMatrixRow.jobToBeDone}
                    onChange={e => setNewMatrixRow({ ...newMatrixRow, jobToBeDone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#B4F052]/40"
                  >
                    <option value="">-- Select or enter custom job --</option>
                    {jobs.functionalJob && <option value={jobs.functionalJob}>[Functional] {jobs.functionalJob}</option>}
                    {jobs.emotionalJob && <option value={jobs.emotionalJob}>[Emotional] {jobs.emotionalJob}</option>}
                    {jobs.socialJob && <option value={jobs.socialJob}>[Social] {jobs.socialJob}</option>}
                    {jobs.mainJTBD.finalStatement && <option value={jobs.mainJTBD.finalStatement}>[Main] {jobs.mainJTBD.finalStatement}</option>}
                  </select>
                  {/* Text input to overwrite if needed */}
                  <input
                    type="text"
                    value={newMatrixRow.jobToBeDone}
                    onChange={e => setNewMatrixRow({ ...newMatrixRow, jobToBeDone: e.target.value })}
                    placeholder="Or enter custom job here..."
                    className="w-full mt-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="text-white/40 block mb-1">Pain Blocking Progress</label>
                  <select
                    value={newMatrixRow.painBlockingProgress}
                    onChange={e => setNewMatrixRow({ ...newMatrixRow, painBlockingProgress: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#B4F052]/40"
                  >
                    <option value="">-- Select from Pains --</option>
                    {pains.map(p => (
                      <option key={p.id} value={p.description}>{p.description}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newMatrixRow.painBlockingProgress}
                    onChange={e => setNewMatrixRow({ ...newMatrixRow, painBlockingProgress: e.target.value })}
                    placeholder="Or enter custom pain..."
                    className="w-full mt-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="text-white/40 block mb-1">Desired Gain</label>
                  <select
                    value={newMatrixRow.desiredGain}
                    onChange={e => setNewMatrixRow({ ...newMatrixRow, desiredGain: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#B4F052]/40"
                  >
                    <option value="">-- Select from Gains --</option>
                    {gains.map(g => (
                      <option key={g.id} value={g.description}>{g.description}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newMatrixRow.desiredGain}
                    onChange={e => setNewMatrixRow({ ...newMatrixRow, desiredGain: e.target.value })}
                    placeholder="Or enter custom gain..."
                    className="w-full mt-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="text-white/40 block mb-1">Evidence / Source</label>
                  <input
                    type="text"
                    value={newMatrixRow.evidence}
                    onChange={e => setNewMatrixRow({ ...newMatrixRow, evidence: e.target.value })}
                    placeholder="e.g. Customer interviews, support tickets, survey"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-white/40 block mb-1">Importance (1-5)</label>
                  <select
                    value={newMatrixRow.importance}
                    onChange={e => setNewMatrixRow({ ...newMatrixRow, importance: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-[#B4F052] focus:outline-none focus:border-[#B4F052]/40 font-bold"
                  >
                    <option value="1">1 - Low</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5 - Critical</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex items-end">
                  <button
                    onClick={addMatrixRow}
                    className="w-full sm:w-auto glass-button px-6 py-3 text-sm flex items-center justify-center gap-2 bg-[#B4F052] text-black font-semibold hover:opacity-90 transition-all"
                  >
                    <Plus size={14} /> Link Row
                  </button>
                </div>
              </div>
            </div>

            {/* Matrix Table */}
            {jtbdMatrix.length === 0 ? (
              <div className="text-center py-6 text-xs text-white/30 bg-black/20 rounded-xl border border-dashed border-white/10">
                No mapping rows added. Connect the customer situations, jobs, obstacles, and gains above.
              </div>
            ) : (
              <div className="overflow-x-auto border border-white/[0.06] rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] text-white/40 uppercase tracking-wider border-b border-white/[0.06]">
                      <th className="p-3">Situation</th>
                      <th className="p-3">Job To Be Done</th>
                      <th className="p-3">Pain Blocking Progress</th>
                      <th className="p-3">Desired Gain</th>
                      <th className="p-3 text-center">Importance</th>
                      <th className="p-3">Evidence</th>
                      <th className="p-3 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {jtbdMatrix.map(row => (
                      <tr key={row.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-3 text-white/90 font-medium">{row.situation || '-'}</td>
                        <td className="p-3 text-white/80">{row.jobToBeDone || '-'}</td>
                        <td className="p-3 text-red-300">{row.painBlockingProgress || '-'}</td>
                        <td className="p-3 text-emerald-300">{row.desiredGain || '-'}</td>
                        <td className="p-3 text-center font-bold text-[#B4F052]">{row.importance}</td>
                        <td className="p-3 text-white/50">{row.evidence || '-'}</td>
                        <td className="p-3 text-center">
                          <button onClick={() => removeMatrixRow(row.id)} className="text-white/30 hover:text-red-400 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 9. Advanced Section: Customer Job Process Map */}
          <div className="glass-card p-6 border border-white/[0.08]">
            <h2 className="text-sm font-bold uppercase text-white/40 tracking-wider mb-2 flex items-center gap-1.5">
              <Activity size={14} className="text-[#B4F052]" />
              Advanced: Map the Customer Job Process (8-Step Process Model)
            </h2>
            <p className="text-xs text-white/50 mb-6 leading-relaxed">
              Deconstruct the customer&rsquo;s timeline from start to finish. Identify actions, pains, and opportunities at each phase. 
              <br />
              <span className="text-[#B4F052]/80">Note: Keep these as &ldquo;Value Clues&rdquo; and opportunity areas, not product features.</span>
            </p>

            <div className="space-y-3">
              {[
                { step: 'define', title: '1. Define', desc: 'What is the customer trying to formulate, plan, or understand?' },
                { step: 'locate', title: '2. Locate', desc: 'What information, tools, inputs, or resources do they need to find?' },
                { step: 'prepare', title: '3. Prepare', desc: 'What setup, verification, or pre-processing do they need before acting?' },
                { step: 'confirm', title: '4. Confirm', desc: 'What validation, checks, or approvals are needed before proceeding?' },
                { step: 'execute', title: '5. Execute', desc: 'What core action are they completing to achieve the goal?' },
                { step: 'monitor', title: '6. Monitor', desc: 'How do they verify execution quality and check current progress?' },
                { step: 'modify', title: '7. Modify', desc: 'What edits, adjustments, or troubleshooting are needed if issues arise?' },
                { step: 'conclude', title: '8. Conclude', desc: 'How do they finalize, save, repeat, or clean up after completion?' }
              ].map(s => {
                const isExpanded = expandedStep === s.step;
                const data = processMap[s.step] || { customerAction: '', pain: '', desiredGain: '', valueClue: '' };
                const hasData = data.customerAction.trim() || data.pain.trim() || data.desiredGain.trim() || data.valueClue.trim();

                return (
                  <div key={s.step} className="rounded-xl border border-white/[0.06] bg-black/10 overflow-hidden transition-all">
                    <button
                      onClick={() => setExpandedStep(isExpanded ? null : s.step)}
                      className="w-full flex items-center justify-between p-3.5 hover:bg-white/[0.02] text-left transition-colors"
                    >
                      <div>
                        <span className="text-xs font-semibold text-white/95 block flex items-center gap-1.5">
                          {s.title}
                          {hasData && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B4F052]" title="Contains data" />
                          )}
                        </span>
                        <span className="text-[10px] text-white/40 block mt-0.5">{s.desc}</span>
                      </div>
                      <div className="text-white/40">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 border-t border-white/[0.06] bg-black/40 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="text-white/40 block mb-1">Customer Action / Process</label>
                          <textarea
                            value={data.customerAction}
                            onChange={e => updateProcessMap(s.step, 'customerAction', e.target.value)}
                            placeholder="What does the customer do in this step?"
                            rows={2}
                            className="w-full p-2.5 rounded-lg bg-black/60 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                          />
                        </div>
                        <div>
                          <label className="text-red-400 block mb-1">Pain / Obstacle at this step</label>
                          <textarea
                            value={data.pain}
                            onChange={e => updateProcessMap(s.step, 'pain', e.target.value)}
                            placeholder="What blocks or delays them?"
                            rows={2}
                            className="w-full p-2.5 rounded-lg bg-black/60 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                          />
                        </div>
                        <div>
                          <label className="text-emerald-400 block mb-1">Desired Gain at this step</label>
                          <textarea
                            value={data.desiredGain}
                            onChange={e => updateProcessMap(s.step, 'desiredGain', e.target.value)}
                            placeholder="What outcome would delight them?"
                            rows={2}
                            className="w-full p-2.5 rounded-lg bg-black/60 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                          />
                        </div>
                        <div>
                          <label className="text-[#B4F052] block mb-1">Value Clue (Potential Value Area)</label>
                          <textarea
                            value={data.valueClue}
                            onChange={e => updateProcessMap(s.step, 'valueClue', e.target.value)}
                            placeholder="Where/how can a potential tool ease their workload?"
                            rows={2}
                            className="w-full p-2.5 rounded-lg bg-black/60 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 10. Checklist & Complete Button */}
          <div className="glass-card p-6 border border-[#B4F052]/20 bg-[#B4F052]/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B4F052]/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Check size={18} className="text-[#B4F052]" />
              Completion Checklist
            </h2>
            <p className="text-xs text-white/50 mb-4">
              Satisfy these conditions to finalize your customer problem mapping deliverables:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {checklistItems.map(item => {
                const complete = checklist[item.key as keyof typeof checklist];
                return (
                  <div key={item.key} className="flex items-start gap-2.5 text-xs text-white/80">
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${complete ? 'bg-[#B4F052] border-[#B4F052] text-black' : 'border-white/20'}`}>
                      {complete && <Check size={10} />}
                    </div>
                    <span className={complete ? 'text-white/40 line-through' : 'text-white/80'}>{item.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
              <div>
                <span className="text-xs text-white/40 block">Progress</span>
                <span className="text-sm font-bold text-white/95">
                  {Object.values(checklist).filter(v => v === true).length} of {Object.values(checklist).length} Complete
                </span>
              </div>
              <button
                onClick={handleCompleteTask}
                className="w-full sm:w-auto glass-button px-6 py-3 text-sm flex items-center justify-center gap-2 animate-pulse-glow"
              >
                <Check size={16} /> Complete Task 4 and continue to Task 5
              </button>
            </div>
            <PhasePDFGenerator phase={1} />
            <p className="text-[10px] text-white/40 mt-3 text-right">
              In the next task, you will use this customer understanding to define vision, mission and core values.
            </p>
          </div>
        </div>
      ) : (
        <div className="glass-card p-6 text-center text-white/40 border border-white/[0.08]">
          Confirm the Focus Problem Statement above in Section 1 to unlock the rest of Task 4 details.
        </div>
      )}
    </div>
  );
}
