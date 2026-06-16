'use client';
import React, { useState, useEffect } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, ArrowRight, Layers, Info, RefreshCw, Star, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function Task3Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput } = useGarage();

  // Load state from context
  const [problems, setProblems] = useState<ProblemItem[]>(() => {
    const rawProblems = getTaskInput(1, 'problems');
    if (rawProblems) {
      try {
        return JSON.parse(rawProblems);
      } catch {}
    }
    return [];
  });

  const [trends, setTrends] = useState<TrendSignalItem[]>(() => {
    const rawTrends = getTaskInput(1, 'trends');
    if (rawTrends) {
      try {
        return JSON.parse(rawTrends);
      } catch {}
    }
    return [];
  });

  const [evaluations, setEvaluations] = useState<Record<string, ProblemEvaluation>>(() => {
    const rawEvaluations = getTaskInput(2, 'evaluations');
    if (rawEvaluations) {
      try {
        return JSON.parse(rawEvaluations);
      } catch {}
    }
    return {};
  });

  const [hydrated, setHydrated] = useState(false);

  // Task 3 Specific State
  const [selectedProblemId, setSelectedProblemId] = useState<string>(() => {
    return getTaskInput(3, 'selectedProblemId') || '';
  });

  const [compareIds, setCompareIds] = useState<string[]>(() => {
    const rawCompare = getTaskInput(3, 'compareIds');
    if (rawCompare) {
      try {
        return JSON.parse(rawCompare);
      } catch {}
    }
    return [];
  });

  const [founderFit, setFounderFit] = useState<Record<string, string>>(() => {
    const rawFit = getTaskInput(3, 'founderFit');
    if (rawFit) {
      try {
        return JSON.parse(rawFit);
      } catch {}
    }
    return {
      personalCloseness: '',
      accessToUsers: '',
      contextUnderstanding: '',
      longTermMotivation: '',
      unfairAdvantage: '',
      whyThisFounder: ''
    };
  });

  const [targetCustomer, setTargetCustomer] = useState<Record<string, string>>(() => {
    const rawCust = getTaskInput(3, 'targetCustomer');
    if (rawCust) {
      try {
        return JSON.parse(rawCust);
      } catch {}
    }
    return {
      primarySegment: '',
      specificPersona: '',
      problemContext: '',
      currentWorkaround: '',
      whyThisSegmentFirst: ''
    };
  });

  const [statementParts, setStatementParts] = useState<Record<string, string>>(() => {
    const rawStmt = getTaskInput(3, 'selectedProblemStatement');
    if (rawStmt) {
      try {
        return JSON.parse(rawStmt);
      } catch {}
    }
    return {
      targetCustomer: '',
      problem: '',
      rootCauseOrContext: '',
      impact: '',
      trendSignal: '',
      finalStatement: ''
    };
  });

  const [decisionRationale, setDecisionRationale] = useState<string>(() => {
    return getTaskInput(3, 'decisionRationale') || '';
  });

  const [confidenceCheck, setConfidenceCheck] = useState<Record<string, string>>(() => {
    const rawConf = getTaskInput(3, 'confidenceCheck');
    if (rawConf) {
      try {
        return JSON.parse(rawConf);
      } catch {}
    }
    return {
      seenInRealConversations: 'not_yet',
      accessToFiveUsers: 'not_yet',
      externalGrowthSignals: 'not_yet',
      alternativesNotEnough: 'not_yet'
    };
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const saveField = (key: string, val: unknown) => {
    setTaskInput(3, key, typeof val === 'string' ? val : JSON.stringify(val));
  };

  const handleRefresh = () => {
    const rawProblems = getTaskInput(1, 'problems');
    const rawTrends = getTaskInput(1, 'trends');
    const rawEvaluations = getTaskInput(2, 'evaluations');
    if (rawProblems) {
      try { setProblems(JSON.parse(rawProblems)); } catch {}
    }
    if (rawTrends) {
      try { setTrends(JSON.parse(rawTrends)); } catch {}
    }
    if (rawEvaluations) {
      try { setEvaluations(JSON.parse(rawEvaluations)); } catch {}
    }
    alert('Refreshed data from Task 2!');
  };

  const toggleCompare = (id: string) => {
    const next = compareIds.includes(id)
      ? compareIds.filter(x => x !== id)
      : [...compareIds, id];
    setCompareIds(next);
    saveField('compareIds', next);
  };

  const selectFocusProblem = (id: string) => {
    setSelectedProblemId(id);
    saveField('selectedProblemId', id);

    // Seed the statement builder with the initial problem and segment if empty
    const p = problems.find(x => x.id === id);
    if (p && !statementParts.problem) {
      const nextParts = {
        ...statementParts,
        problem: p.statement,
        targetCustomer: p.who,
        finalStatement: `For ${p.who}, who experience ${p.statement}, because [root cause / context], this matters because ${p.painful}, and it is becoming more important now because ${p.explorationAnswers?.changed || '[trend signal]'}.`
      };
      setStatementParts(nextParts);
      saveField('selectedProblemStatement', nextParts);
    }
  };

  const updateFounderFit = (key: string, value: string) => {
    const next = { ...founderFit, [key]: value };
    setFounderFit(next);
    saveField('founderFit', next);
  };

  const updateTargetCustomer = (key: string, value: string) => {
    const next = { ...targetCustomer, [key]: value };
    setTargetCustomer(next);
    saveField('targetCustomer', next);
  };

  const updateStatementPart = (key: string, value: string) => {
    const nextParts = { ...statementParts, [key]: value };
    const tc = nextParts.targetCustomer || '[target customer]';
    const pb = nextParts.problem || '[problem]';
    const rc = nextParts.rootCauseOrContext || '[root cause / context]';
    const im = nextParts.impact || '[impact]';
    const ts = nextParts.trendSignal || '[trend signal]';

    nextParts.finalStatement = `For ${tc}, who experience ${pb}, because ${rc}, this matters because ${im}, and it is becoming more important now because ${ts}.`;

    setStatementParts(nextParts);
    saveField('selectedProblemStatement', nextParts);
  };

  const updateFinalStatement = (value: string) => {
    const nextParts = { ...statementParts, finalStatement: value };
    setStatementParts(nextParts);
    saveField('selectedProblemStatement', nextParts);
  };

  const handleSaveRationale = (value: string) => {
    setDecisionRationale(value);
    saveField('decisionRationale', value);
  };

  const updateConfidence = (key: string, value: string) => {
    const next = { ...confidenceCheck, [key]: value };
    setConfidenceCheck(next);
    saveField('confidenceCheck', next);
  };

  // Helper calculations for problem metadata
  const getProblemMetrics = (pId: string) => {
    const ev = evaluations[pId];
    if (!ev) return { pain: 0, trend: 0, fit: 0, total: 0, quality: 'Low' };

    const pain = ev.painIntensity + ev.frequency + ev.urgency;
    const trend = ev.trendMomentum + ev.marketReach;
    const fit = ev.founderInsight + ev.willingnessToPay;
    const total = pain + trend + fit + ev.alternatives;
    
    let quality = 'Low';
    const textLen = (ev.evidence || '').length;
    if (textLen > 50) quality = 'High';
    else if (textLen > 20) quality = 'Medium';

    return { pain, trend, fit, total, quality };
  };

  // Get criteria highlights
  const getHighlights = (pId: string) => {
    const ev = evaluations[pId];
    if (!ev) return { strengths: [], risks: [] };

    const strengths: string[] = [];
    const risks: string[] = [];

    if (ev.painIntensity >= 4) strengths.push('High Pain Intensity');
    if (ev.painIntensity <= 2) risks.push('Weak Pain Intensity');

    if (ev.urgency >= 4) strengths.push('High Urgency');
    if (ev.urgency <= 2) risks.push('Low Urgency');

    if (ev.trendMomentum >= 4) strengths.push('Strong Trend Momentum');
    if (ev.trendMomentum <= 2) risks.push('Stagnant Market Trend');

    if (ev.founderInsight >= 4) strengths.push('Strong Founder Insight');
    if (ev.founderInsight <= 2) risks.push('Low Founder Connection');

    if (ev.willingnessToPay >= 4) strengths.push('Clear Willingness to Pay');
    if (ev.willingnessToPay <= 2) risks.push('Hard to Monetize');

    return { strengths, risks };
  };

  if (!hydrated) {
    return <div className="text-center py-20 text-white/40">Loading Task 3...</div>;
  }

  // Pre-requisite validation check
  const isMatrixReady = problems.length >= 5 && problems.every(p => {
    const ev = evaluations[p.id];
    return ev && ev.reviewed && ev.painIntensity > 0;
  });

  if (!isMatrixReady) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-6">
        <AlertTriangle size={48} className="mx-auto text-amber-500 animate-bounce" />
        <h2 className="text-xl font-bold text-white">Task 2 Evaluations Not Ready</h2>
        <p className="text-sm text-white/60 leading-relaxed">
          You need to complete Task 2 before selecting a focus problem. First evaluate and score all your problems in the Task 2 matrix, then come back here to make the decision.
        </p>
        <button
          onClick={() => router.push('/tasks/2')}
          className="glass-button inline-flex items-center gap-2 text-xs"
        >
          Go to Task 2
          <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  // Statistics for top panel
  const scoresArray = Object.values(evaluations).map(ev => {
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
  });
  const maxScore = scoresArray.length > 0 ? Math.max(...scoresArray) : 0;
  const minScore = scoresArray.length > 0 ? Math.min(...scoresArray) : 0;

  // Sorting evaluated list
  const evaluatedList = problems.map(p => ({
    problem: p,
    metrics: getProblemMetrics(p.id)
  })).sort((a, b) => b.metrics.total - a.metrics.total);

  // Confidence calculations
  const confidenceNoCount = Object.values(confidenceCheck).filter(x => x === 'no' || x === 'not_yet').length;
  const showConfidenceWarning = confidenceNoCount >= 2;

  // Checklist Calculations
  const hasReviewedMatrix = true; // Visually rendered
  const hasComparedCandidates = compareIds.length >= 2;
  const hasProblemSelected = selectedProblemId !== '';
  const hasFounderFit = hasProblemSelected && Object.values(founderFit).every(x => x.trim().length > 0);
  const hasTargetCustomer = hasProblemSelected && Object.values(targetCustomer).every(x => x.trim().length > 0);
  const hasProblemStatement = statementParts.finalStatement?.trim().length > 0 && !statementParts.finalStatement.includes('[problem]');
  const hasRationale = decisionRationale.trim().length >= 10;
  const hasConfidenceCheck = Object.values(confidenceCheck).every(x => x !== 'not_yet');

  const checklistItems = [
    { label: 'Reviewed the evaluation matrix from Task 2', done: hasReviewedMatrix, current: 'Reviewed' },
    { label: 'Compared the strongest problem candidates', done: hasComparedCandidates, current: `${compareIds.length}/2 compared` },
    { label: 'Selected one focus problem candidate', done: hasProblemSelected, current: hasProblemSelected ? 'Selected' : 'None' },
    { label: 'Completed founder fit alignment checklist', done: hasFounderFit, current: hasFounderFit ? 'Complete' : 'Pending' },
    { label: 'Defined target customer segment', done: hasTargetCustomer, current: hasTargetCustomer ? 'Complete' : 'Pending' },
    { label: 'Generated focus problem statement', done: hasProblemStatement, current: hasProblemStatement ? 'Generated' : 'Pending' },
    { label: 'Added selection decision rationale', done: hasRationale, current: hasRationale ? 'Added' : 'Short/None' },
    { label: 'Finished confidence validation check', done: hasConfidenceCheck, current: hasConfidenceCheck ? 'Checked' : 'Pending' }
  ];

  const totalChecks = checklistItems.filter(x => x.done).length;
  const checkProgress = Math.round((totalChecks / checklistItems.length) * 100);
  const allCompleted = totalChecks === checklistItems.length;

  const handleCompleteTask = () => {
    if (!allCompleted) return;
    completeTask(3);
    router.push('/tasks/4');
  };

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
            <span>Task 3</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Select Problem to Focus on
          </h1>
          <p className="text-[#B4F052] font-semibold text-lg">
            Choose one problem from your evaluated matrix and turn it into a clear focus statement.
          </p>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-white/70 leading-relaxed max-w-2xl">
            <span className="font-bold text-white block mb-1">Important Boundary:</span>
            You are choosing the problem, not the solution. Do not design the product, build feature lists, or select templates yet. Focus entirely on pinning down who has the pain and why.
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
              <span className="text-white/80">~2h</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/40">Deliverable</span>
              <span className="text-[#B4F052] font-semibold">Selected Problem Statement</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <button
              onClick={() => router.push('/tasks/4')}
              className="w-full flex items-center justify-between text-xs text-white/40 hover:text-[#B4F052] transition-colors"
            >
              <span>Next Task: Pinpoint Pains &amp; Gains</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Imported Evaluation Panel */}
      <div className="glass-card p-6 border border-white/[0.06] space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-[#B4F052]" />
            <h2 className="text-lg font-bold text-white">Imported Scored Problem Matrix</h2>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#B4F052] transition-colors"
          >
            <RefreshCw size={12} />
            Refresh Matrix Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
            <div className="text-xs text-white/40">Problems Evaluated</div>
            <div className="text-3xl font-extrabold text-white mt-1">{problems.length}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
            <div className="text-xs text-white/40">Highest Matrix Score</div>
            <div className="text-3xl font-extrabold text-[#B4F052] mt-1">{maxScore}/40</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
            <div className="text-xs text-white/40">Lowest Matrix Score</div>
            <div className="text-3xl font-extrabold text-white/60 mt-1">{minScore}/40</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.01] border border-[#22c55e]/20 bg-emerald-500/5">
            <div className="text-xs text-white/40">Decision Status</div>
            <div className="text-lg font-bold text-[#22c55e] mt-2">Ready for selection</div>
          </div>
        </div>
      </div>

      {/* 3. Section 1: Review Evaluation Matrix */}
      <div className="glass-card p-6 border border-white/[0.06] space-y-4">
        <h3 className="text-base font-bold text-white border-b border-white/[0.06] pb-3 flex items-center justify-between">
          <span>Section 1: Review Scored Matrix</span>
          <span className="text-xs text-white/40">Compare raw indicators and check signals</span>
        </h3>
        <p className="text-xs text-white/60">
          The highest score is not always the best focus. Use the matrix as evidence, then make a conscious founder decision. Select candidates below to compare them side-by-side.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-white/40 font-mono text-[9px] uppercase tracking-wider">
                <th className="py-3 px-2 w-10">Rank</th>
                <th className="py-3 px-3">Problem Candidate</th>
                <th className="py-3 px-3">User Segment</th>
                <th className="py-3 px-2 text-center">Pain Score</th>
                <th className="py-3 px-2 text-center">Trend Score</th>
                <th className="py-3 px-2 text-center">Founder Fit</th>
                <th className="py-3 px-2 text-center">Total Score</th>
                <th className="py-3 px-3 text-center">Evidence Quality</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {evaluatedList.map((item, idx) => {
                const { problem, metrics } = item;
                const isComparing = compareIds.includes(problem.id);
                const isSelected = selectedProblemId === problem.id;
                return (
                  <tr key={problem.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-3 px-2 text-white/40 font-mono">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-white leading-relaxed">{problem.statement}</td>
                    <td className="py-3 px-3 text-white/80">{problem.who}</td>
                    <td className="py-3 px-2 text-center font-mono">{metrics.pain}/15</td>
                    <td className="py-3 px-2 text-center font-mono">{metrics.trend}/10</td>
                    <td className="py-3 px-2 text-center font-mono">{metrics.fit}/10</td>
                    <td className="py-3 px-2 text-center font-mono font-bold text-[#B4F052]">{metrics.total}/40</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        metrics.quality === 'High' ? 'text-emerald-400 bg-emerald-500/10' :
                        metrics.quality === 'Medium' ? 'text-amber-400 bg-amber-500/10' : 'text-rose-400 bg-rose-500/10'
                      }`}>
                        {metrics.quality}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleCompare(problem.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all whitespace-nowrap ${
                            isComparing
                              ? 'bg-white/10 text-white hover:bg-white/15'
                              : 'bg-white/[0.03] border border-white/[0.08] text-white/60 hover:bg-[#B4F052]/10 hover:text-[#B4F052]'
                          }`}
                        >
                          {isComparing ? 'Comparing' : 'Compare'}
                        </button>
                        <button
                          onClick={() => selectFocusProblem(problem.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all whitespace-nowrap ${
                            isSelected
                              ? 'bg-emerald-500 text-white cursor-default'
                              : 'bg-[#B4F052] text-black hover:opacity-95'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Section 2: Compare Strongest Candidates */}
      <div className="glass-card p-6 border border-white/[0.06] space-y-4">
        <h3 className="text-base font-bold text-white border-b border-white/[0.06] pb-3">
          Section 2: Compare Strongest Candidates (Need at least 2 to compare)
        </h3>

        {compareIds.length === 0 ? (
          <div className="text-center py-10 text-white/30 text-xs">
            No candidates added to comparison. Click &ldquo;Compare&rdquo; on the table above to add items.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compareIds.map(cId => {
              const p = problems.find(x => x.id === cId);
              if (!p) return null;
              const ev = evaluations[cId];
              const metrics = getProblemMetrics(cId);
              const highlights = getHighlights(cId);
              const isSelected = selectedProblemId === cId;
              return (
                <div key={cId} className={`glass-card p-5 border flex flex-col justify-between ${
                  isSelected ? 'border-[#B4F052]/40 bg-[#B4F052]/5' : 'border-white/[0.06] bg-white/[0.01]'
                }`}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start border-b border-white/[0.06] pb-2">
                      <span className="text-[10px] text-[#B4F052] uppercase font-bold tracking-wider">Candidate</span>
                      <span className="text-xs font-mono font-bold text-[#B4F052]">{metrics.total}/40</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white leading-relaxed">{p.statement}</h4>
                      <p className="text-[10px] text-white/40">Target Segment: {p.who}</p>
                    </div>

                    <div className="space-y-2 text-xs">
                      {highlights.strengths.length > 0 && (
                        <div>
                          <strong className="text-emerald-400 block text-[10px]">Strengths:</strong>
                          <ul className="list-disc pl-4 text-white/60 space-y-0.5 text-[10px]">
                            {highlights.strengths.map(s => <li key={s}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                      {highlights.risks.length > 0 && (
                        <div>
                          <strong className="text-rose-400 block text-[10px]">Risks/Weaknesses:</strong>
                          <ul className="list-disc pl-4 text-white/60 space-y-0.5 text-[10px]">
                            {highlights.risks.map(r => <li key={r}>{r}</li>)}
                          </ul>
                        </div>
                      )}
                      <div>
                        <strong className="text-white/60 block text-[10px]">Evidence Note:</strong>
                        <p className="text-white/40 text-[10px] italic">{ev?.evidence || 'None logged'}</p>
                      </div>
                      <div>
                        <strong className="text-white/60 block text-[10px]">Uncertainties:</strong>
                        <p className="text-white/40 text-[10px] italic">{ev?.uncertainty || 'None logged'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] mt-4 flex gap-2">
                    <button
                      onClick={() => toggleCompare(cId)}
                      className="flex-1 py-2 rounded-xl text-xs bg-white/[0.04] hover:bg-white/[0.08] text-white/60 font-semibold"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => selectFocusProblem(cId)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-white cursor-default'
                          : 'bg-[#B4F052] text-black hover:opacity-95'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Focus here'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t border-white/[0.06] space-y-3">
            {/* Side-by-Side Score Comparison */}
            <h4 className="text-xs font-semibold text-white/80">Side-by-Side Score Comparison</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/[0.08] text-white/40 font-mono text-[9px] uppercase tracking-wider">
                    <th className="py-2 px-3">Metric</th>
                    {compareIds.map(cId => {
                      const p = problems.find(x => x.id === cId);
                      return (
                        <th key={cId} className="py-2 px-3 font-semibold text-white/70 max-w-[200px] truncate">
                          {p?.statement || 'Unknown'}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  <tr>
                    <td className="py-2.5 px-3 text-white/60 font-medium">Pain Score</td>
                    {compareIds.map(cId => {
                      const metrics = getProblemMetrics(cId);
                      return (
                        <td key={cId} className="py-2.5 px-3 font-mono text-white/80">
                          {metrics.pain} <span className="text-[10px] text-white/30">/ 15</span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-white/60 font-medium">Trend Score</td>
                    {compareIds.map(cId => {
                      const metrics = getProblemMetrics(cId);
                      return (
                        <td key={cId} className="py-2.5 px-3 font-mono text-white/80">
                          {metrics.trend} <span className="text-[10px] text-white/30">/ 10</span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-white/60 font-medium">Founder Fit</td>
                    {compareIds.map(cId => {
                      const metrics = getProblemMetrics(cId);
                      return (
                        <td key={cId} className="py-2.5 px-3 font-mono text-white/80">
                          {metrics.fit} <span className="text-[10px] text-white/30">/ 10</span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-white/60 font-medium">Alternatives</td>
                    {compareIds.map(cId => {
                      const ev = evaluations[cId];
                      return (
                        <td key={cId} className="py-2.5 px-3 font-mono text-white/80">
                          {ev?.alternatives || 0} <span className="text-[10px] text-white/30">/ 5</span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="bg-[#B4F052]/5">
                    <td className="py-2.5 px-3 text-[#B4F052] font-semibold">Total Score</td>
                    {compareIds.map(cId => {
                      const metrics = getProblemMetrics(cId);
                      return (
                        <td key={cId} className="py-2.5 px-3 font-mono font-bold text-[#B4F052]">
                          {metrics.total} <span className="text-[10px] text-[#B4F052]/40">/ 40</span>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          </>
        )}
      </div>

      {selectedProblemId ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Detailed Selection Worksheets */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Section 3: Founder Fit Check */}
            <div className="glass-card p-6 border border-white/[0.06] space-y-4">
              <h3 className="text-base font-bold text-white border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#B4F052]/10 text-[#B4F052] text-[10px] rounded">Step 3</span>
                <span>Check Founder Fit</span>
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Confirm your personal connection to the problem candidate. A high-potential idea is worthless without a strong founder alignment.
              </p>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs text-white/70 block mb-1 font-semibold">1. Why are you personally close to this problem?</label>
                  <textarea
                    value={founderFit.personalCloseness}
                    onChange={e => updateFounderFit('personalCloseness', e.target.value)}
                    placeholder="Describe your history, frustrations, or context where you met this problem..."
                    className="w-full min-h-[60px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1 font-semibold">2. Do you have access to people who experience this problem?</label>
                  <textarea
                    value={founderFit.accessToUsers}
                    onChange={e => updateFounderFit('accessToUsers', e.target.value)}
                    placeholder="List channels, communities, networks, or specific clients you can talk to..."
                    className="w-full min-h-[60px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1 font-semibold">3. Do you understand the context deeply enough?</label>
                  <textarea
                    value={founderFit.contextUnderstanding}
                    onChange={e => updateFounderFit('contextUnderstanding', e.target.value)}
                    placeholder="Explain the background knowledge or details you possess about their workflow or pain..."
                    className="w-full min-h-[60px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1 font-semibold">4. Do you care enough to work on this for the next 3-5 years?</label>
                  <textarea
                    value={founderFit.longTermMotivation}
                    onChange={e => updateFounderFit('longTermMotivation', e.target.value)}
                    placeholder="Why will you stay motivated when validation gets hard or slow?"
                    className="w-full min-h-[60px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1 font-semibold">5. What unfair advantage do you have here?</label>
                  <textarea
                    value={founderFit.unfairAdvantage}
                    onChange={e => updateFounderFit('unfairAdvantage', e.target.value)}
                    placeholder="E.g., proprietary datasets, specific technical expertise, existing community trust..."
                    className="w-full min-h-[60px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1 font-semibold">6. What makes you the right person or team to explore this problem?</label>
                  <textarea
                    value={founderFit.whyThisFounder}
                    onChange={e => updateFounderFit('whyThisFounder', e.target.value)}
                    placeholder="Sum up your personal fit with this focus..."
                    className="w-full min-h-[60px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Define Target Customer */}
            <div className="glass-card p-6 border border-white/[0.06] space-y-4">
              <h3 className="text-base font-bold text-white border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#B4F052]/10 text-[#B4F052] text-[10px] rounded">Step 4</span>
                <span>Define Target Customer</span>
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Describe the exact group experiencing the pain. Avoid broad demographics; pin down the specific workflow persona.
              </p>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs text-white/70 block mb-1 font-semibold">Primary customer segment</label>
                  <input
                    type="text"
                    value={targetCustomer.primarySegment}
                    onChange={e => updateTargetCustomer('primarySegment', e.target.value)}
                    placeholder="Example: SME owners with 10-100 employees"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1 font-semibold">Specific user / persona</label>
                  <input
                    type="text"
                    value={targetCustomer.specificPersona}
                    onChange={e => updateTargetCustomer('specificPersona', e.target.value)}
                    placeholder="Example: Founder, operations manager, HR leader"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1 font-semibold">Context where the problem appears</label>
                  <textarea
                    value={targetCustomer.problemContext}
                    onChange={e => updateTargetCustomer('problemContext', e.target.value)}
                    placeholder="Example: When the company starts introducing AI tools without a clear policy..."
                    className="w-full min-h-[60px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1 font-semibold">Current workaround</label>
                  <textarea
                    value={targetCustomer.currentWorkaround}
                    onChange={e => updateTargetCustomer('currentWorkaround', e.target.value)}
                    placeholder="Example: They test random tools, ask employees informally, or avoid using AI because of risk..."
                    className="w-full min-h-[60px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1 font-semibold">Why this segment first?</label>
                  <textarea
                    value={targetCustomer.whyThisSegmentFirst}
                    onChange={e => updateTargetCustomer('whyThisSegmentFirst', e.target.value)}
                    placeholder="Example: They feel the pain strongly and have budget to solve it..."
                    className="w-full min-h-[60px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Selected Problem Statement Builder */}
            <div className="glass-card p-6 border border-white/[0.06] space-y-4">
              <h3 className="text-base font-bold text-white border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#B4F052]/10 text-[#B4F052] text-[10px] rounded">Step 5</span>
                <span>Selected Problem Statement Builder</span>
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Fill in the framework fields below to construct a clear focus statement. You can edit the final string directly in the generated statement text area.
              </p>

              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/60 block mb-1">For [Target Customer]</label>
                    <input
                      type="text"
                      value={statementParts.targetCustomer || ''}
                      onChange={e => updateStatementPart('targetCustomer', e.target.value)}
                      placeholder="SME owners and team leaders"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/60 block mb-1">who experience [Problem]</label>
                    <input
                      type="text"
                      value={statementParts.problem || ''}
                      onChange={e => updateStatementPart('problem', e.target.value)}
                      placeholder="struggle to safely implement AI tools"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/60 block mb-1">because [Root Cause / Context]</label>
                  <input
                    type="text"
                    value={statementParts.rootCauseOrContext || ''}
                    onChange={e => updateStatementPart('rootCauseOrContext', e.target.value)}
                    placeholder="they lack clear policies, trusted workflows and competence"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/60 block mb-1">this matters because [Impact]</label>
                    <input
                      type="text"
                      value={statementParts.impact || ''}
                      onChange={e => updateStatementPart('impact', e.target.value)}
                      placeholder="teams waste time and expose data privacy risks"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/60 block mb-1">and is more important now because [Trend Signal]</label>
                    <input
                      type="text"
                      value={statementParts.trendSignal || ''}
                      onChange={e => updateStatementPart('trendSignal', e.target.value)}
                      placeholder="AI adoption is accelerating across business functions"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                    />
                  </div>
                </div>

                {/* Final Statement Output */}
                <div className="border-t border-white/[0.06] pt-4">
                  <label className="text-xs text-[#B4F052] block mb-1 font-bold">Generated Selected Problem Statement</label>
                  <textarea
                    value={statementParts.finalStatement || ''}
                    onChange={e => updateFinalStatement(e.target.value)}
                    rows={4}
                    placeholder="The builder will automatically generate the statement..."
                    className="w-full px-3 py-2 rounded-xl bg-[#B4F052]/5 border border-[#B4F052]/20 text-xs text-white leading-relaxed focus:outline-none focus:border-[#B4F052] resize-y font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Decision Rationale */}
            <div className="glass-card p-6 border border-white/[0.06] space-y-4">
              <h3 className="text-base font-bold text-white border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#B4F052]/10 text-[#B4F052] text-[10px] rounded">Step 6</span>
                <span>Decision Rationale</span>
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Explain why you selected this problem candidate over others. Reference scores, pain intensity, trend signals, or founder fit.
              </p>

              <div>
                <textarea
                  value={decisionRationale}
                  onChange={e => handleSaveRationale(e.target.value)}
                  placeholder="I selected this problem because it scored highest on pain intensity and urgency. In addition, I have direct network access to this segment..."
                  className="w-full min-h-[80px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
                  required
                />
              </div>
            </div>

            {/* Quick Confidence Check */}
            <div className="glass-card p-6 border border-white/[0.06] space-y-4">
              <h3 className="text-base font-bold text-white border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#B4F052]/10 text-[#B4F052] text-[10px] rounded">Step 7</span>
                <span>Quick Confidence Check</span>
              </h3>

              <div className="space-y-4 pt-2">
                {[
                  { key: 'seenInRealConversations', label: 'Have you seen this problem in real conversations?' },
                  { key: 'accessToFiveUsers', label: 'Do you have access to at least 5 people who may experience it?' },
                  { key: 'externalGrowthSignals', label: 'Have you seen external signals that this problem is growing?' },
                  { key: 'alternativesNotEnough', label: 'Can you explain why existing alternatives are not enough?' }
                ].map(item => {
                  const val = confidenceCheck[item.key] || 'not_yet';
                  return (
                    <div key={item.key} className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.04] gap-2">
                      <span className="text-xs text-white/80 font-medium">{item.label}</span>
                      <div className="flex gap-2">
                        {['yes', 'no', 'not_yet'].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => updateConfidence(item.key, opt)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                              val === opt
                                ? opt === 'yes' ? 'bg-emerald-500 text-white' :
                                  opt === 'no' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-black'
                                : 'bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white'
                            }`}
                          >
                            {opt === 'not_yet' ? 'Not yet' : opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {showConfidenceWarning && (
                  <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 flex gap-3 text-xs text-rose-200/80 leading-relaxed">
                    <AlertTriangle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-rose-400 block mb-0.5">Low Validation Confidence:</span>
                      Several validation indicators are currently &ldquo;No&rdquo; or &ldquo;Not yet&rdquo;. This problem remains a valid focus hypothesis, but your initial risk is high. Consider conducting early validation interviews soon.
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                  Complete Task 3 and continue to Task 4
                </button>
                <p className="text-[10px] text-white/30 text-center mt-2">
                  In Task 4, you will break this selected problem into pains, gains and Jobs To Be Done.
                </p>
              </div>
            </div>

            {/* Info Recommendation Card */}
            <div className="glass-card p-5 border border-[#B4F052]/10 bg-white/[0.01] flex gap-3">
              <Info size={16} className="text-[#B4F052] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Focus Check</h4>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Choosing your focus problem does not mean deleting other ideas forever. It means choosing the single thesis you will aggressively validate first.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-8 border border-dashed border-white/[0.08] text-center space-y-3">
          <Star size={36} className="mx-auto text-white/20 animate-pulse" />
          <h4 className="text-sm font-bold text-white">Select a problem above to define focus worksheets</h4>
          <p className="text-xs text-white/40 max-w-sm mx-auto">
            Choose a problem by clicking &ldquo;Select&rdquo; on the matrix or &ldquo;Focus here&rdquo; on candidate comparison cards to open founder-fit, target segment, and statement builder fields.
          </p>
        </div>
      )}
    </div>
  );
}
