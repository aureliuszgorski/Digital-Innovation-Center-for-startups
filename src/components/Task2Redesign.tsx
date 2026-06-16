'use client';
import React, { useState, useEffect } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, ArrowRight, Layers, Info, RefreshCw, Star, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getTask } from '@/data/tasks';

interface ExplorationAnswers {
  frustrating: string;
  who: string;
  when: string;
  how: string;
  changed: string;
  other: string;
}

interface ProblemItem {
  id: string;
  statement: string;
  who: string;
  where: string;
  painful: string;
  opportunityTypes: ('Need-based' | 'Trend-based' | 'Technology-based')[];
  explorationAnswers: ExplorationAnswers;
}

interface TrendSignalItem {
  id: string;
  trend: string;
  where: string;
  note: string;
}

interface ProblemEvaluation {
  painIntensity: number;
  frequency: number;
  urgency: number;
  alternatives: number;
  trendMomentum: number;
  marketReach: number;
  willingnessToPay: number;
  founderInsight: number;
  whyScore: string;
  evidence: string;
  uncertainty: string;
  reviewed: boolean;
}

const CRITERIA = [
  { key: 'painIntensity' as const, label: 'Pain Intensity', desc: 'How painful is this problem?' },
  { key: 'frequency' as const, label: 'Frequency', desc: 'How often does this problem appear?' },
  { key: 'urgency' as const, label: 'Urgency', desc: 'How quickly do people want this solved?' },
  { key: 'alternatives' as const, label: 'Existing Alternatives', desc: 'How weak or frustrating are current workarounds?' },
  { key: 'trendMomentum' as const, label: 'Trend Momentum', desc: 'Is this problem growing due to market/tech shifts?' },
  { key: 'marketReach' as const, label: 'Market Reach', desc: 'How many people/organizations experience this?' },
  { key: 'willingnessToPay' as const, label: 'Willingness to Pay/Change', desc: 'Would they pay or switch tools to solve it?' },
  { key: 'founderInsight' as const, label: 'Founder Insight', desc: 'How close are you to this problem and market?' }
];

export default function Task2Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput } = useGarage();

  // State
  const [problems, setProblems] = useState<ProblemItem[]>(() => {
    const raw = getTaskInput(1, 'problems');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return [];
  });

  const [trends, setTrends] = useState<TrendSignalItem[]>(() => {
    const raw = getTaskInput(1, 'trends');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return [];
  });

  const [evaluations, setEvaluations] = useState<Record<string, ProblemEvaluation>>(() => {
    const raw = getTaskInput(2, 'evaluations');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return {};
  });

  const [hydrated, setHydrated] = useState(false);

  // Selected problem for active evaluation
  const [activeProblemId, setActiveProblemId] = useState<string | null>(null);

  // Form states for active evaluation
  const [scores, setScores] = useState<Record<string, number>>({
    painIntensity: 0,
    frequency: 0,
    urgency: 0,
    alternatives: 0,
    trendMomentum: 0,
    marketReach: 0,
    willingnessToPay: 0,
    founderInsight: 0
  });
  const [whyScore, setWhyScore] = useState('');
  const [evidence, setEvidence] = useState('');
  const [uncertainty, setUncertainty] = useState('');

  // Sorting state for Evaluation Matrix
  const [sortByScore, setSortByScore] = useState<'desc' | 'asc' | null>('desc');

  useEffect(() => {
    const timer = setTimeout(() => {
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const saveEvaluationsMap = (map: Record<string, ProblemEvaluation>) => {
    setEvaluations(map);
    setTaskInput(2, 'evaluations', JSON.stringify(map));
  };

  const handleRefresh = () => {
    const rawProblems = getTaskInput(1, 'problems');
    const rawTrends = getTaskInput(1, 'trends');
    if (rawProblems) {
      try { setProblems(JSON.parse(rawProblems)); } catch {}
    }
    if (rawTrends) {
      try { setTrends(JSON.parse(rawTrends)); } catch {}
    }
    alert('Refreshed data from Task 1!');
  };

  // Start evaluating a problem
  const startEvaluating = (problemId: string) => {
    setActiveProblemId(problemId);
    const ev = evaluations[problemId];

    if (ev) {
      setScores({
        painIntensity: ev.painIntensity,
        frequency: ev.frequency,
        urgency: ev.urgency,
        alternatives: ev.alternatives,
        trendMomentum: ev.trendMomentum,
        marketReach: ev.marketReach,
        willingnessToPay: ev.willingnessToPay,
        founderInsight: ev.founderInsight
      });
      setWhyScore(ev.whyScore);
      setEvidence(ev.evidence);
      setUncertainty(ev.uncertainty);
    } else {
      setScores({
        painIntensity: 0,
        frequency: 0,
        urgency: 0,
        alternatives: 0,
        trendMomentum: 0,
        marketReach: 0,
        willingnessToPay: 0,
        founderInsight: 0
      });
      setWhyScore('');
      setEvidence('');
      setUncertainty('');
    }
    document.getElementById('scoring-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Save current scores & evidence
  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProblemId) return;

    // Validate that all criteria are scored
    const missingScore = Object.values(scores).some(s => s === 0);
    if (missingScore) {
      alert('Please score all evaluation criteria (1-5) before saving.');
      return;
    }

    const updatedEv: ProblemEvaluation = {
      painIntensity: scores.painIntensity,
      frequency: scores.frequency,
      urgency: scores.urgency,
      alternatives: scores.alternatives,
      trendMomentum: scores.trendMomentum,
      marketReach: scores.marketReach,
      willingnessToPay: scores.willingnessToPay,
      founderInsight: scores.founderInsight,
      whyScore: whyScore,
      evidence: evidence,
      uncertainty: uncertainty,
      reviewed: true
    };

    const nextMap = {
      ...evaluations,
      [activeProblemId]: updatedEv
    };

    saveEvaluationsMap(nextMap);
    setActiveProblemId(null);
  };

  const getProblemStatus = (p: ProblemItem) => {
    if (!p.who || p.who.trim() === '') return { label: 'Missing User Segment', color: 'text-amber-400 bg-amber-500/10' };
    if (!p.painful || p.painful.trim() === '') return { label: 'Missing Pain Description', color: 'text-amber-400 bg-amber-500/10' };
    // We check if trend is set either in relatedTrend or exploration
    const hasTrend = p.opportunityTypes?.includes('Trend-based') || p.statement.toLowerCase().includes('trend') || trends.length > 0;
    if (!hasTrend) return { label: 'Missing Trend Signal', color: 'text-amber-400 bg-amber-500/10' };
    return { label: 'Ready to evaluate', color: 'text-emerald-400 bg-emerald-500/10' };
  };

  const getProblemTotalScore = (problemId: string) => {
    const ev = evaluations[problemId];
    if (!ev) return 0;
    return (
      ev.painIntensity +
      ev.frequency +
      ev.urgency +
      ev.alternatives +
      ev.trendMomentum +
      ev.marketReach +
      ev.willingnessToPay +
      ev.founderInsight
    );
  };

  if (!hydrated) {
    return <div className="text-center py-20 text-white/40">Loading Task 2...</div>;
  }

  // If Task 1 has not produced enough problems (< 5)
  if (problems.length < 5) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-6">
        <AlertTriangle size={48} className="mx-auto text-amber-500 animate-bounce" />
        <h2 className="text-xl font-bold text-white">Task 1 Requirements Not Met</h2>
        <p className="text-sm text-white/60 leading-relaxed">
          You need to complete Task 1 first. Add at least 5 problems in Task 1 before evaluating them here. (Currently: {problems.length} problems added).
        </p>
        <Link href="/tasks/1" className="glass-button inline-flex items-center gap-2 text-xs">
          Go to Task 1
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  // Checklist Calculations
  const hasImportedProblems = problems.length >= 5;
  const allProblemsReviewed = problems.every(p => evaluations[p.id]?.reviewed);
  const eachProblemHasScores = problems.every(p => {
    const ev = evaluations[p.id];
    return ev &&
      ev.painIntensity > 0 &&
      ev.frequency > 0 &&
      ev.urgency > 0 &&
      ev.alternatives > 0 &&
      ev.trendMomentum > 0 &&
      ev.marketReach > 0 &&
      ev.willingnessToPay > 0 &&
      ev.founderInsight > 0;
  });
  const eachProblemHasEvidence = problems.every(p => {
    const ev = evaluations[p.id];
    return ev &&
      ev.whyScore?.trim().length > 0 &&
      ev.evidence?.trim().length > 0 &&
      ev.uncertainty?.trim().length > 0;
  });
  const scoringMatrixGenerated = eachProblemHasScores;

  const checklistItems = [
    { label: 'Imported problems from Task 1', done: hasImportedProblems, current: `${problems.length} problems` },
    { label: 'Reviewed all imported problems', done: allProblemsReviewed, current: `${problems.filter(p => evaluations[p.id]?.reviewed).length}/${problems.length} reviewed` },
    { label: 'Defined evaluation criteria', done: true, current: '8 criteria set' },
    { label: 'Scored each problem using the criteria', done: eachProblemHasScores, current: `${problems.filter(p => {
      const ev = evaluations[p.id];
      return ev && ev.painIntensity > 0;
    }).length}/${problems.length} scored` },
    { label: 'Added evidence notes or assumptions', done: eachProblemHasEvidence, current: `${problems.filter(p => {
      const ev = evaluations[p.id];
      return ev && ev.whyScore?.trim().length > 0;
    }).length}/${problems.length} with notes` },
    { label: 'Generated the scored problem evaluation matrix', done: scoringMatrixGenerated, current: scoringMatrixGenerated ? 'Generated' : 'Pending scores' }
  ];

  const totalChecks = checklistItems.filter(x => x.done).length;
  const checkProgress = Math.round((totalChecks / checklistItems.length) * 100);
  const allCompleted = totalChecks === checklistItems.length;

  const handleCompleteTask = () => {
    if (!allCompleted) return;
    completeTask(2);
    router.push('/tasks/3');
  };

  // Compile sorted list of evaluations for Matrix display
  const scoredProblemsList = [...problems].map(p => ({
    problem: p,
    totalScore: getProblemTotalScore(p.id),
    ev: evaluations[p.id]
  }));

  if (sortByScore === 'desc') {
    scoredProblemsList.sort((a, b) => b.totalScore - a.totalScore);
  } else if (sortByScore === 'asc') {
    scoredProblemsList.sort((a, b) => a.totalScore - b.totalScore);
  }

  // Count problems with missing context
  const missingContextCount = problems.filter(p => getProblemStatus(p).label !== 'Ready to evaluate').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* 1. Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider">
            <Link href="/tasks" className="hover:text-[#B4F052]">Tasks</Link>
            <span>/</span>
            <span className="text-[#22c55e]">SETUP</span>
            <span>/</span>
            <span>Task 2</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Evaluate Problems and Trends
          </h1>
          <p className="text-[#B4F052] font-semibold text-lg">
            Score and compare the problems collected in Task 1.
          </p>
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-sm text-amber-200/80 leading-relaxed max-w-2xl">
            <span className="font-bold text-amber-400 block mb-1">Important Warning:</span>
            Do not choose your focus problem yet. This task only creates the evaluation matrix. The final decision happens in Task 3.
          </div>
        </div>

        {/* Cockpit Card */}
        <div className="glass-card p-5 border border-[#22c55e]/20 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs border-b border-white/[0.06] pb-2">
              <span className="text-white/40">Stage</span>
              <span className="text-[#22c55e] font-semibold">SETUP</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-white/[0.06] pb-2">
              <span className="text-white/40">Sub-stage</span>
              <span className="text-white/80">Start with Problems</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-white/[0.06] pb-2">
              <span className="text-white/40">Function</span>
              <span className="text-white/80">Business</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-white/[0.06] pb-2">
              <span className="text-white/40">Difficulty</span>
              <span className="text-[#B4F052]">Beginner</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-white/[0.06] pb-2">
              <span className="text-white/40">Est. Time</span>
              <span className="text-white/80">~4h</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/40">Deliverable</span>
              <span className="text-[#B4F052] font-semibold">Scored Evaluation Matrix</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <Link href="/tasks/3" className="flex items-center justify-between text-xs text-white/40 hover:text-[#B4F052] transition-colors">
              <span>Next Task: Select Focus Problem</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Imported Problems Panel & Framework */}
      <div className="glass-card p-6 border border-white/[0.06] space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-[#B4F052]" />
            <h2 className="text-lg font-bold text-white">Imported from Task 1</h2>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#B4F052] transition-colors"
          >
            <RefreshCw size={12} />
            Refresh from Task 1
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
            <div className="text-xs text-white/40">Problems Imported</div>
            <div className="text-3xl font-extrabold text-white mt-1">{problems.length}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
            <div className="text-xs text-white/40">Trend Signals Imported</div>
            <div className="text-3xl font-extrabold text-white mt-1">{trends.length}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
            <div className="text-xs text-white/40">Problems Missing Context</div>
            <div className="text-3xl font-extrabold text-amber-500 mt-1">{missingContextCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] text-xs text-white/60 leading-relaxed">
          <span className="font-bold text-white block mb-1">Evaluation Methodology:</span>
          In this task, you evaluate the problems collected in Task 1 using clear criteria. The goal is not to choose the final problem yet, but to understand the relative strength, weakness and evidence behind each problem. By the end of this task, you will have a scored evaluation matrix that will help you make a better focus decision in Task 3.
        </div>
      </div>

      {/* Step 1: Review Imported Problems */}
      <div className="glass-card p-6 border border-white/[0.06] space-y-4">
        <h3 className="text-base font-bold text-white border-b border-white/[0.06] pb-3 flex items-center justify-between">
          <span>Step 1: Review Imported Problems</span>
          <span className="text-xs text-white/40">Verify completeness of raw problem details</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-white/40">
                <th className="py-3 px-2 w-10">#</th>
                <th className="py-3 px-3">Problem</th>
                <th className="py-3 px-3">User Segment</th>
                <th className="py-3 px-3">Pain Description</th>
                <th className="py-3 px-3">Trend Signal</th>
                <th className="py-3 px-3">Types</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {problems.map((p, idx) => {
                const status = getProblemStatus(p);
                const ev = evaluations[p.id];
                const totalScore = getProblemTotalScore(p.id);
                return (
                  <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-3 px-2 text-white/40">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-white leading-relaxed max-w-[200px]">{p.statement}</td>
                    <td className="py-3 px-3 text-white/80">{p.who || <span className="text-amber-500 italic">Empty</span>}</td>
                    <td className="py-3 px-3 text-white/60 leading-relaxed max-w-[200px]">{p.painful || <span className="text-amber-500 italic">Empty</span>}</td>
                    <td className="py-3 px-3 text-white/60">
                      {p.explorationAnswers?.changed || trends[idx % (trends.length || 1)]?.trend || <span className="text-amber-500 italic">None</span>}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {p.opportunityTypes?.map(ot => (
                          <span key={ot} className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[#B4F052] text-[9px] border border-[#B4F052]/10 whitespace-nowrap">
                            {ot.split('-')[0]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => startEvaluating(p.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all whitespace-nowrap ${
                          ev?.reviewed
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-[#B4F052] text-black hover:opacity-90'
                        }`}
                      >
                        {ev?.reviewed ? `Scored (${totalScore}/40)` : 'Evaluate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step 2 & 3: Score each problem and Add Evidence Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Active Evaluation Form */}
        <div id="scoring-section" className="lg:col-span-2 space-y-6">
          {activeProblemId ? (
            <div className="glass-card p-6 border border-[#B4F052]/30 bg-black/40 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#B4F052] uppercase font-bold tracking-wider">Step 2 &amp; 3: Problem Evaluation</span>
                  <h3 className="text-sm font-bold text-white leading-relaxed">
                    Evaluating: &ldquo;{problems.find(p => p.id === activeProblemId)?.statement}&rdquo;
                  </h3>
                </div>
                <button
                  onClick={() => setActiveProblemId(null)}
                  className="text-xs text-white/40 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveEvaluation} className="space-y-6">
                {/* 8 Scoring Criteria */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-[#B4F052]">Step 2: Score criteria (1 = Weakest, 5 = Strongest)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CRITERIA.map(criterion => {
                      const currentVal = scores[criterion.key] || 0;
                      return (
                        <div key={criterion.key} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-2">
                          <div className="flex justify-between items-start">
                            <label className="text-xs font-bold text-white">{criterion.label}</label>
                            <span className="text-xs font-semibold text-[#B4F052]">{currentVal > 0 ? `${currentVal}/5` : 'Unrated'}</span>
                          </div>
                          <p className="text-[10px] text-white/40 leading-relaxed min-h-[30px]">{criterion.desc}</p>
                          <div className="flex gap-1.5 pt-1">
                            {[1, 2, 3, 4, 5].map(val => {
                              const active = currentVal === val;
                              return (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => setScores(prev => ({ ...prev, [criterion.key]: val }))}
                                  className={`flex-1 py-1 rounded-lg font-bold text-xs transition-all ${
                                    active
                                      ? 'bg-[#B4F052] text-black'
                                      : 'bg-white/[0.03] border border-white/[0.06] text-white/60 hover:bg-white/[0.06] hover:text-white'
                                  }`}
                                >
                                  {val}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Evidence Notes */}
                <div className="space-y-4 border-t border-white/[0.06] pt-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-[#B4F052]">Step 3: Add Evidence Notes</h4>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-white/50 block mb-1 font-semibold">Why did you give this score?</label>
                      <textarea
                        value={whyScore}
                        onChange={e => setWhyScore(e.target.value)}
                        placeholder="Explain your score choices briefly..."
                        className="w-full min-h-[60px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs text-white/50 block mb-1 font-semibold">What evidence supports this?</label>
                      <textarea
                        value={evidence}
                        onChange={e => setEvidence(e.target.value)}
                        placeholder="Customer quotes, trend signals, statistics, personal observations..."
                        className="w-full min-h-[60px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs text-white/50 block mb-1 font-semibold">What is still uncertain?</label>
                      <textarea
                        value={uncertainty}
                        onChange={e => setUncertainty(e.target.value)}
                        placeholder="Assumptions, lack of data, questions to validate..."
                        className="w-full min-h-[60px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-white/[0.06] pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveProblemId(null)}
                    className="px-4 py-2 rounded-xl text-xs bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="glass-button text-xs py-2"
                  >
                    Save Score &amp; Evidence
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="glass-card p-8 border border-dashed border-white/[0.08] text-center space-y-3">
              <Star size={36} className="mx-auto text-white/20 animate-pulse" />
              <h4 className="text-sm font-bold text-white">Select a problem above to start scoring</h4>
              <p className="text-xs text-white/40 max-w-sm mx-auto">
                Each problem in your list needs to be evaluated on our 8-point startup scale before generating the scored matrix.
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Checklist Panel (right) */}
        <div className="space-y-6">
          <div className="glass-card p-6 border border-white/[0.06] space-y-4">
            <h3 className="text-base font-bold text-white border-b border-white/[0.06] pb-3 flex items-center justify-between">
              <span>Completion Checklist</span>
              <span className="text-xs text-white/40">{totalChecks}/{checklistItems.length}</span>
            </h3>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#B4F052] transition-all duration-300"
                  style={{ width: `${checkProgress}%` }}
                />
              </div>
              <div className="text-[10px] text-white/40 text-right">{checkProgress}% Complete</div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3 pt-2">
              {checklistItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      item.done ? 'bg-[#B4F052] border-[#B4F052] text-black' : 'border-white/20 text-transparent'
                    }`}
                  >
                    <Check size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${item.done ? 'text-white/40 line-through' : 'text-white/80 font-medium'}`}>
                      {item.label}
                    </p>
                    <span className="text-[9px] text-[#B4F052]/60 mt-0.5 block">{item.current}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Complete Task Button */}
            <div className="pt-4 border-t border-white/[0.06]">
              <button
                onClick={handleCompleteTask}
                disabled={!allCompleted}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  allCompleted
                    ? 'bg-[#B4F052] text-black hover:opacity-95 shadow-lg shadow-[#B4F052]/10 active:scale-98 animate-pulse-glow cursor-pointer'
                    : 'bg-white/[0.04] border border-white/[0.08] text-white/20 cursor-not-allowed'
                }`}
              >
                <Check size={16} />
                Complete Task 2 and continue to Task 3
              </button>
              <p className="text-[10px] text-white/30 text-center mt-2">
                In Task 3, you will use this matrix to select the problem to focus on.
              </p>
            </div>
          </div>

          {/* Info recommendation */}
          <div className="glass-card p-5 border border-[#B4F052]/10 bg-white/[0.01] flex gap-3">
            <Info size={16} className="text-[#B4F052] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">Validation Reminder</h4>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Be honest when scoring criteria like <strong>Willingness to Pay</strong> and <strong> founder insight</strong>. The matrix will serve as the base roadmap for choosing your core startup theme next.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: Generate Evaluation Matrix */}
      <div className="glass-card p-6 border border-white/[0.06] space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-[#B4F052]" />
            <h3 className="text-base font-bold text-white">Scored Problem Evaluation Matrix</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Sort by Score:</span>
            <select
              value={sortByScore || 'none'}
              onChange={e => {
                const val = e.target.value;
                setSortByScore(val === 'none' ? null : (val as 'desc' | 'asc'));
              }}
              className="px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none bg-black"
            >
              <option value="desc" className="bg-black text-white">Highest Total First</option>
              <option value="asc" className="bg-black text-white">Lowest Total First</option>
              <option value="none" className="bg-black text-white">Unsorted</option>
            </select>
          </div>
        </div>

        {/* Visual Bar Chart */}
        {scoredProblemsList.length > 0 && (
          <div className="space-y-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <h4 className="text-xs font-semibold text-white/80">Candidate Problems Total Score Comparison</h4>
            <div className="space-y-2">
              {scoredProblemsList.map((item) => {
                const { problem, totalScore, ev } = item;
                const evaluated = !!(ev && ev.reviewed);
                const percentage = Math.min(100, Math.max(0, (totalScore / 40) * 100));
                return (
                  <div key={problem.id} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-white/70 font-medium truncate max-w-[250px] md:max-w-[400px]">
                        {problem.statement}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-semibold uppercase tracking-wider ${evaluated ? 'bg-[#B4F052]/10 text-[#B4F052]' : 'bg-white/10 text-white/40'}`}>
                          {evaluated ? 'Evaluated' : 'Not Evaluated'}
                        </span>
                        <span className="font-mono text-white font-semibold">{totalScore}/40</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${evaluated ? 'bg-[#B4F052]' : 'bg-white/20'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Matrix table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-white/[0.06] text-white/40 font-mono text-[9px] uppercase tracking-wider">
                <th className="py-3 px-2 w-10">#</th>
                <th className="py-3 px-3 min-w-[150px]">Problem Candidate</th>
                <th className="py-3 px-2 text-center">Pain</th>
                <th className="py-3 px-2 text-center">Freq</th>
                <th className="py-3 px-2 text-center">Urgency</th>
                <th className="py-3 px-2 text-center">Alts</th>
                <th className="py-3 px-2 text-center">Trend</th>
                <th className="py-3 px-2 text-center">Reach</th>
                <th className="py-3 px-2 text-center">Pay</th>
                <th className="py-3 px-2 text-center">Insight</th>
                <th className="py-3 px-3 text-center text-[#B4F052]">Total Score</th>
                <th className="py-3 px-3 min-w-[200px]">Evidence Notes &amp; Assumptions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {scoredProblemsList.map((item, index) => {
                const { problem, totalScore, ev } = item;
                const evaluated = ev && ev.reviewed;
                return (
                  <tr key={problem.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-3 px-2 text-white/40 font-mono">{index + 1}</td>
                    <td className="py-3 px-3 font-semibold text-white leading-relaxed">
                      {problem.statement}
                      <span className="block text-[10px] text-white/40 font-normal mt-0.5">Segment: {problem.who}</span>
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-bold">{evaluated ? ev.painIntensity : '-'}</td>
                    <td className="py-3 px-2 text-center font-mono font-bold">{evaluated ? ev.frequency : '-'}</td>
                    <td className="py-3 px-2 text-center font-mono font-bold">{evaluated ? ev.urgency : '-'}</td>
                    <td className="py-3 px-2 text-center font-mono font-bold">{evaluated ? ev.alternatives : '-'}</td>
                    <td className="py-3 px-2 text-center font-mono font-bold">{evaluated ? ev.trendMomentum : '-'}</td>
                    <td className="py-3 px-2 text-center font-mono font-bold">{evaluated ? ev.marketReach : '-'}</td>
                    <td className="py-3 px-2 text-center font-mono font-bold">{evaluated ? ev.willingnessToPay : '-'}</td>
                    <td className="py-3 px-2 text-center font-mono font-bold">{evaluated ? ev.founderInsight : '-'}</td>
                    <td className="py-3 px-3 text-center font-bold text-sm text-[#B4F052] font-mono">
                      {evaluated ? `${totalScore}/40` : 'Not evaluated'}
                    </td>
                    <td className="py-3 px-3 text-white/60 leading-relaxed text-[10px]">
                      {evaluated ? (
                        <div className="space-y-1">
                          <div><strong>Rationale:</strong> {ev.whyScore}</div>
                          <div><strong>Evidence:</strong> {ev.evidence}</div>
                          <div><strong>Uncertainty:</strong> {ev.uncertainty}</div>
                        </div>
                      ) : (
                        <span className="text-white/20 italic">No notes added. Click Evaluate above to add notes.</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="text-[10px] text-white/40 pt-2 text-center">
          Sorted by evaluation score. Compare scores to understand strengths, but do not designate the final focus problem yet.
        </div>
      </div>
    </div>
  );
}
