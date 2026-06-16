'use client';
import React, { useState, useEffect } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, Trash2, Plus, Edit3, ArrowRight, BookOpen, Layers, Zap, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TaskInfographic from '@/components/TaskInfographic';
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

const DEFAULT_PROBLEMS: ProblemItem[] = [
  {
    id: 'p-1',
    statement: 'Small businesses struggle to decide which AI tools are safe and useful.',
    who: 'SME owners',
    where: 'Work',
    painful: 'They waste time testing tools, worry about data privacy, and do not know where to start.',
    opportunityTypes: ['Need-based', 'Trend-based', 'Technology-based'],
    explorationAnswers: {
      frustrating: 'Testing tools with no privacy assurance is slow and scary.',
      who: 'SME Owners & Managers',
      when: 'When integrating client data into tools.',
      how: 'Manual review of privacy policies or avoiding AI altogether.',
      changed: 'Rapid release of complex generative AI tools without SME security guidance.',
      other: 'Lack of official training for SME employees.'
    }
  },
  {
    id: 'p-2',
    statement: 'Founders waste time jumping between multiple disconnected tools.',
    who: 'Solo founders',
    where: 'Personal life',
    painful: 'They have to copy-paste context and data constantly, losing momentum.',
    opportunityTypes: ['Need-based', 'Technology-based'],
    explorationAnswers: {
      frustrating: 'Copying prompts and results between 5 open browser tabs.',
      who: 'Solo founders & developers',
      when: 'During feature planning and content drafting.',
      how: 'Using notes apps as an intermediate clipboard.',
      changed: 'Proliferation of single-feature AI wrappers.',
      other: 'Data syncing errors and lost clipboard history.'
    }
  },
  {
    id: 'p-3',
    statement: 'Students cannot turn chaotic lecture notes into structured study guides.',
    who: 'University students',
    where: 'Community',
    painful: 'They feel overwhelmed before exams and fail to extract key terms.',
    opportunityTypes: ['Need-based', 'Trend-based'],
    explorationAnswers: {
      frustrating: 'Organizing 50 pages of raw scribbles is tedious.',
      who: 'Students',
      when: 'Two weeks before exams.',
      how: 'Rewriting notes by hand or hiring tutors.',
      changed: 'Online lectures providing too much raw text.',
      other: 'No automated quiz generation.'
    }
  }
];

const DEFAULT_TRENDS: TrendSignalItem[] = [
  {
    id: 't-1',
    trend: 'AI adoption in small businesses',
    where: 'Hiring market',
    note: 'More companies are hiring AI transformation roles and employees are asking how to use AI at work.'
  },
  {
    id: 't-2',
    trend: 'Proliferation of AI agents and workflow automation',
    where: 'Google Trends',
    note: 'Massive spike in searches and funding rounds for agentic AI architectures.'
  }
];

export default function Task1Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput } = useGarage();
  const task = getTask(1)!;

  // Load state from GarageContext
  const [problems, setProblems] = useState<ProblemItem[]>(() => {
    const rawProblems = getTaskInput(1, 'problems');
    if (rawProblems) {
      try {
        return JSON.parse(rawProblems);
      } catch {
        return DEFAULT_PROBLEMS;
      }
    }
    return DEFAULT_PROBLEMS;
  });

  const [trends, setTrends] = useState<TrendSignalItem[]>(() => {
    const rawTrends = getTaskInput(1, 'trends');
    if (rawTrends) {
      try {
        return JSON.parse(rawTrends);
      } catch {
        return DEFAULT_TRENDS;
      }
    }
    return DEFAULT_TRENDS;
  });

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const saveProblemsList = (list: ProblemItem[]) => {
    setProblems(list);
    setTaskInput(1, 'problems', JSON.stringify(list));
  };

  const saveTrendsList = (list: TrendSignalItem[]) => {
    setTrends(list);
    setTaskInput(1, 'trends', JSON.stringify(list));
  };

  // Form states for Problems
  const [pStatement, setPStatement] = useState('');
  const [pWho, setPWho] = useState('');
  const [pWhere, setPWhere] = useState('Personal life');
  const [pPainful, setPPainful] = useState('');
  const [pTypes, setPTypes] = useState<('Need-based' | 'Trend-based' | 'Technology-based')[]>([]);
  const [editingProblemId, setEditingProblemId] = useState<string | null>(null);

  // Form states for Trends
  const [tTrend, setTTrend] = useState('');
  const [tWhere, setTWhere] = useState('Google Trends');
  const [tNote, setTNote] = useState('');
  const [editingTrendId, setEditingTrendId] = useState<string | null>(null);

  // Exploration Dialog state
  const [exploringProblemId, setExploringProblemId] = useState<string | null>(null);
  const [expFrustrating, setExpFrustrating] = useState('');
  const [expWho, setExpWho] = useState('');
  const [expWhen, setExpWhen] = useState('');
  const [expHow, setExpHow] = useState('');
  const [expChanged, setExpChanged] = useState('');
  const [expOther, setExpOther] = useState('');

  // Slides and display states
  const [showSlides, setShowSlides] = useState(false);
  const [showPlainTextView, setShowPlainTextView] = useState(false);

  if (!hydrated) {
    return <div className="text-center py-20 text-white/40">Loading Task 1...</div>;
  }

  // Handle adding/editing Problem
  const handleSaveProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pStatement.trim()) return;

    if (editingProblemId) {
      const updated = problems.map(p => {
        if (p.id === editingProblemId) {
          return {
            ...p,
            statement: pStatement,
            who: pWho,
            where: pWhere,
            painful: pPainful,
            opportunityTypes: pTypes,
          };
        }
        return p;
      });
      saveProblemsList(updated);
      setEditingProblemId(null);
    } else {
      const newItem: ProblemItem = {
        id: 'p-' + Date.now(),
        statement: pStatement,
        who: pWho,
        where: pWhere,
        painful: pPainful,
        opportunityTypes: pTypes,
        explorationAnswers: { frustrating: '', who: '', when: '', how: '', changed: '', other: '' }
      };
      saveProblemsList([...problems, newItem]);
    }

    // Reset Form
    setPStatement('');
    setPWho('');
    setPWhere('Personal life');
    setPPainful('');
    setPTypes([]);
  };

  const handleEditProblem = (p: ProblemItem) => {
    setEditingProblemId(p.id);
    setPStatement(p.statement);
    setPWho(p.who);
    setPWhere(p.where);
    setPPainful(p.painful);
    setPTypes(p.opportunityTypes || []);
    // Scroll form into view
    document.getElementById('problem-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteProblem = (id: string) => {
    if (confirm('Are you sure you want to delete this problem?')) {
      saveProblemsList(problems.filter(p => p.id !== id));
      if (exploringProblemId === id) setExploringProblemId(null);
    }
  };

  // Handle adding/editing Trend
  const handleSaveTrend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tTrend.trim()) return;

    if (editingTrendId) {
      const updated = trends.map(t => {
        if (t.id === editingTrendId) {
          return { ...t, trend: tTrend, where: tWhere, note: tNote };
        }
        return t;
      });
      saveTrendsList(updated);
      setEditingTrendId(null);
    } else {
      const newItem: TrendSignalItem = {
        id: 't-' + Date.now(),
        trend: tTrend,
        where: tWhere,
        note: tNote
      };
      saveTrendsList([...trends, newItem]);
    }

    // Reset Form
    setTTrend('');
    setTWhere('Google Trends');
    setTNote('');
  };

  const handleEditTrend = (t: TrendSignalItem) => {
    setEditingTrendId(t.id);
    setTTrend(t.trend);
    setTWhere(t.where);
    setTNote(t.note);
    document.getElementById('trend-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteTrend = (id: string) => {
    if (confirm('Are you sure you want to delete this trend signal?')) {
      saveTrendsList(trends.filter(t => t.id !== id));
    }
  };

  // Exploration form actions
  const startExploring = (p: ProblemItem) => {
    setExploringProblemId(p.id);
    setExpFrustrating(p.explorationAnswers?.frustrating || '');
    setExpWho(p.explorationAnswers?.who || '');
    setExpWhen(p.explorationAnswers?.when || '');
    setExpHow(p.explorationAnswers?.how || '');
    setExpChanged(p.explorationAnswers?.changed || '');
    setExpOther(p.explorationAnswers?.other || '');
  };

  const handleSaveExploration = () => {
    if (!exploringProblemId) return;
    const updated = problems.map(p => {
      if (p.id === exploringProblemId) {
        return {
          ...p,
          explorationAnswers: {
            frustrating: expFrustrating,
            who: expWho,
            when: expWhen,
            how: expHow,
            changed: expChanged,
            other: expOther
          }
        };
      }
      return p;
    });
    saveProblemsList(updated);
    setExploringProblemId(null);
  };

  // Toggle Type Selection
  const toggleOpportunityType = (type: 'Need-based' | 'Trend-based' | 'Technology-based') => {
    if (pTypes.includes(type)) {
      setPTypes(pTypes.filter(t => t !== type));
    } else {
      setPTypes([...pTypes, type]);
    }
  };

  // Checklist Calculations
  const countProblems = problems.length;
  const countTrends = trends.length;
  const describedUserSegmentForEach = problems.length > 0 && problems.every(p => p.who && p.who.trim().length > 0);
  const addedPainDescriptionForEach = problems.length > 0 && problems.every(p => p.painful && p.painful.trim().length > 0);
  const classifiedProblemsCount = problems.filter(p => p.opportunityTypes && p.opportunityTypes.length > 0).length;
  const isClassifiedComplete = classifiedProblemsCount >= 5;
  const exploredProblemsCount = problems.filter(p => {
    const ea = p.explorationAnswers;
    return ea &&
      ea.frustrating?.trim() &&
      ea.who?.trim() &&
      ea.when?.trim() &&
      ea.how?.trim() &&
      ea.changed?.trim() &&
      ea.other?.trim();
  }).length;
  const isExplorationComplete = exploredProblemsCount >= 5;

  const isProblemsMinReached = countProblems >= 10;
  const isTrendsMinReached = countTrends >= 5;

  const checklistItems = [
    { label: 'Added at least 10 problems', done: isProblemsMinReached, current: `${countProblems}/10` },
    { label: 'Added at least 5 trend signals', done: isTrendsMinReached, current: `${countTrends}/5` },
    { label: 'Described who experiences each problem', done: describedUserSegmentForEach, current: countProblems > 0 ? 'Yes' : 'No' },
    { label: 'Added pain description to each problem', done: addedPainDescriptionForEach, current: countProblems > 0 ? 'Yes' : 'No' },
    { label: 'Classified problems as need, trend, or tech-based', done: isClassifiedComplete, current: `${classifiedProblemsCount}/5 classified` },
    { label: 'Answered exploration questions for at least 5 problems', done: isExplorationComplete, current: `${exploredProblemsCount}/5 explored` },
  ];

  const totalChecks = checklistItems.filter(x => x.done).length;
  const checkProgress = Math.round((totalChecks / checklistItems.length) * 100);
  const allCompleted = totalChecks === checklistItems.length;

  const handleCompleteTask = () => {
    if (!allCompleted) return;
    completeTask(1);
    router.push('/tasks/2');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* 1. Header & Cockpit */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider">
            <Link href="/tasks" className="hover:text-[#B4F052]">Tasks</Link>
            <span>/</span>
            <span className="text-[#22c55e]">SETUP</span>
            <span>/</span>
            <span>Task 1</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Identify Problems and Trends
          </h1>
          <p className="text-[#B4F052] font-semibold text-lg">
            Build a long list of real problems before thinking about solutions.
          </p>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-white/70 leading-relaxed max-w-2xl">
            <span className="font-bold text-white block mb-1">Important Guideline:</span>
            Do not evaluate, score, or choose the best problem on this page. Your only job in Task 1 is to gather raw materials, observe frustrations, and recognize trend signals. Sorting and selecting will come later in Tasks 2 and 3.
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
              <span className="text-[#B4F052] font-semibold">Problems & Trends Long List</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <Link href="/tasks/2" className="flex items-center justify-between text-xs text-white/40 hover:text-[#B4F052] transition-colors">
              <span>Next Task: Evaluate Problems</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Learn Section */}
      <div className="glass-card p-6 border border-white/[0.06] space-y-6">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <BookOpen size={18} className="text-[#B4F052]" />
          <h2 className="text-lg font-bold text-white">Understand the Framework</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2 p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] transition-colors">
            <div className="text-xs text-[#B4F052] font-semibold tracking-wider uppercase">Method 1</div>
            <h3 className="text-sm font-bold text-white">Start with problems, not ideas</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Most founders start by imagining a solution. In this task, you do the opposite. You collect problems first to bypass building something nobody wants.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] transition-colors">
            <div className="text-xs text-[#B4F052] font-semibold tracking-wider uppercase">Method 2</div>
            <h3 className="text-sm font-bold text-white">Use your own experience</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Look at your work, customers, industry, community, habits and frustrations. Good startup problems often start as repeated personal pain points.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] transition-colors">
            <div className="text-xs text-[#B4F052] font-semibold tracking-wider uppercase">Method 3</div>
            <h3 className="text-sm font-bold text-white">Look for trend signals</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              A problem becomes more interesting when a market, behavior, or technology shift (e.g. AI adoption, remote work) makes it more urgent and scalable.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] transition-colors">
            <div className="text-xs text-[#B4F052] font-semibold tracking-wider uppercase">Method 4</div>
            <h3 className="text-sm font-bold text-white">Classify the Opportunities</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Tag opportunities: <strong>Need-based</strong> (unmet pain), <strong>Trend-based</strong> (market shift), and <strong>Technology-based</strong> (new technical capabilities).
            </p>
          </div>
        </div>

        {/* Collapsible Slides alternative */}
        <div className="pt-2">
          <button
            onClick={() => setShowSlides(!showSlides)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all text-xs font-semibold text-white/80 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <Layers size={14} />
              {showSlides ? 'Hide Slide Presentation Summary' : 'View Slide Presentation Summary (Task 1)'}
            </span>
            <Check size={14} className={`transform transition-transform ${showSlides ? 'rotate-180' : ''}`} />
          </button>

          {showSlides && (
            <div className="mt-4 p-4 rounded-xl border border-white/[0.06] bg-black/40 space-y-4 animate-slide-up">
              <div className="p-1 rounded-xl border border-white/[0.06] bg-black/20">
                <TaskInfographic taskNumber={1} />
              </div>

              {/* Plain Text Toggle */}
              <div className="border border-white/[0.08] rounded-xl overflow-hidden mt-4">
                <button
                  onClick={() => setShowPlainTextView(!showPlainTextView)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-white/[0.02] hover:bg-white/[0.04] transition-all text-xs font-semibold text-white/50 hover:text-white"
                >
                  <span>Plain Text View (Accessibility)</span>
                  <Check size={12} className={`transform transition-transform ${showPlainTextView ? 'rotate-180' : ''}`} />
                </button>
                {showPlainTextView && (
                  <div className="p-4 bg-white/[0.01] border-t border-white/[0.06] space-y-2 text-xs text-white/70 max-h-60 overflow-y-auto">
                    {task.slidesContent.map((line, idx) => (
                      <p key={idx} className="leading-relaxed">• {line}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Work Section - Inventory Builder & Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Forms column (left) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Problem Form */}
          <div id="problem-form" className="glass-card p-6 border border-white/[0.06] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-[#B4F052]" />
                <h3 className="text-base font-bold text-white">
                  {editingProblemId ? 'Edit Problem' : 'Add a Problem'}
                </h3>
              </div>
              {editingProblemId && (
                <button
                  onClick={() => {
                    setEditingProblemId(null);
                    setPStatement('');
                    setPWho('');
                    setPWhere('Personal life');
                    setPPainful('');
                    setPTypes([]);
                  }}
                  className="text-xs text-white/40 hover:text-white"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProblem} className="space-y-4">
              <div>
                <label className="text-xs text-white/50 block mb-1 font-semibold">Problem statement</label>
                <textarea
                  value={pStatement}
                  onChange={e => setPStatement(e.target.value)}
                  placeholder="Example: Small business owners struggle to decide which AI tools are safe and useful."
                  className="w-full min-h-[60px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#B4F052]/40 resize-y"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 block mb-1 font-semibold">Who has this problem?</label>
                  <input
                    type="text"
                    value={pWho}
                    onChange={e => setPWho(e.target.value)}
                    placeholder="Example: SME owners, team leaders, freelancers"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#B4F052]/40"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-white/50 block mb-1 font-semibold">Where did you notice it?</label>
                  <select
                    value={pWhere}
                    onChange={e => setPWhere(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#B4F052]/40 bg-black"
                  >
                    {['Personal life', 'Work', 'Customers', 'Industry', 'Community', 'Market research', 'Other'].map(opt => (
                      <option key={opt} value={opt} className="bg-black text-white">{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 block mb-1 font-semibold">What makes it painful?</label>
                <textarea
                  value={pPainful}
                  onChange={e => setPPainful(e.target.value)}
                  placeholder="Example: They waste time testing tools, worry about data privacy, and do not know where to start."
                  className="w-full min-h-[60px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#B4F052]/40 resize-y"
                  required
                />
              </div>

              {/* Classification types inside add form */}
              <div>
                <label className="text-xs text-white/50 block mb-2 font-semibold">Classify opportunity types (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { type: 'Need-based' as const, desc: 'Real pain or unmet need' },
                    { type: 'Trend-based' as const, desc: 'Market or behavior shift' },
                    { type: 'Technology-based' as const, desc: 'Enabled by new tech' }
                  ].map(item => {
                    const isSelected = pTypes.includes(item.type);
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => toggleOpportunityType(item.type)}
                        className={`flex-1 text-left p-2.5 rounded-xl border text-xs transition-all ${
                          isSelected
                            ? 'border-[#B4F052]/50 bg-[#B4F052]/10 text-white'
                            : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] text-white/60'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{item.type}</span>
                          {isSelected && <Check size={12} className="text-[#B4F052]" />}
                        </div>
                        <div className="text-[10px] opacity-70 mt-0.5">{item.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" className="glass-button w-full flex items-center justify-center gap-2 text-xs py-2.5">
                <Plus size={14} />
                {editingProblemId ? 'Update Problem' : 'Add Problem to Long List'}
              </button>
            </form>
          </div>

          {/* Add Trend Signal Form */}
          <div id="trend-form" className="glass-card p-6 border border-white/[0.06] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-[#B4F052]" />
                <h3 className="text-base font-bold text-white">
                  {editingTrendId ? 'Edit Trend Signal' : 'Add a Trend Signal'}
                </h3>
              </div>
              {editingTrendId && (
                <button
                  onClick={() => {
                    setEditingTrendId(null);
                    setTTrend('');
                    setTWhere('Google Trends');
                    setTNote('');
                  }}
                  className="text-xs text-white/40 hover:text-white"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveTrend} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 block mb-1 font-semibold">Related trend</label>
                  <input
                    type="text"
                    value={tTrend}
                    onChange={e => setTTrend(e.target.value)}
                    placeholder="Example: AI adoption in small businesses"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#B4F052]/40"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-white/50 block mb-1 font-semibold">Where did you observe this?</label>
                  <select
                    value={tWhere}
                    onChange={e => setTWhere(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#B4F052]/40 bg-black"
                  >
                    {[
                      'Google Trends',
                      'LinkedIn',
                      'Hiring market',
                      'News',
                      'Customer conversations',
                      'Competitor activity',
                      'Funding activity',
                      'Personal observation',
                      'Other'
                    ].map(opt => (
                      <option key={opt} value={opt} className="bg-black text-white">{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 block mb-1 font-semibold">Short note</label>
                <textarea
                  value={tNote}
                  onChange={e => setTNote(e.target.value)}
                  placeholder="Example: More companies are hiring AI transformation roles and employees are asking how to use AI at work."
                  className="w-full min-h-[60px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#B4F052]/40 resize-y"
                  required
                />
              </div>

              <button type="submit" className="glass-button w-full flex items-center justify-center gap-2 text-xs py-2.5">
                <Plus size={14} />
                {editingTrendId ? 'Update Trend Signal' : 'Add Trend Signal'}
              </button>
            </form>
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
                Complete Task 1 and continue to Task 2
              </button>
              {!allCompleted && (
                <p className="text-[10px] text-white/30 text-center mt-2">
                  Complete all checklist criteria above to unlock this button.
                </p>
              )}
            </div>
          </div>

          {/* Tips Info card */}
          <div className="glass-card p-5 border border-[#B4F052]/10 bg-white/[0.01] flex gap-3">
            <Info size={16} className="text-[#B4F052] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">AI Copilot Recommendation</h4>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Add various opportunities from your own work or daily life. Focus heavily on details in the <strong>Exploration Questions</strong> for at least 5 problems to understand the pain before jumping into any solution design.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exploration Panel (Conditional details drawers/modals) */}
      {exploringProblemId && (
        <div className="glass-card p-6 border border-[#B4F052]/30 bg-black/40 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="space-y-1">
              <span className="text-[10px] text-[#B4F052] uppercase font-bold tracking-wider">Exploration Questions</span>
              <h3 className="text-sm font-bold text-white">
                Exploring: &ldquo;{problems.find(p => p.id === exploringProblemId)?.statement}&rdquo;
              </h3>
            </div>
            <button
              onClick={() => setExploringProblemId(null)}
              className="text-xs text-white/40 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-white/60 block font-semibold">1. What exactly is frustrating, slow, expensive or confusing?</label>
              <textarea
                value={expFrustrating}
                onChange={e => setExpFrustrating(e.target.value)}
                placeholder="Details of the friction..."
                className="w-full min-h-[80px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/60 block font-semibold">2. Who experiences this most often?</label>
              <textarea
                value={expWho}
                onChange={e => setExpWho(e.target.value)}
                placeholder="Specific personas or niches..."
                className="w-full min-h-[80px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/60 block font-semibold">3. When does this problem happen?</label>
              <textarea
                value={expWhen}
                onChange={e => setExpWhen(e.target.value)}
                placeholder="Trigger conditions or workflows..."
                className="w-full min-h-[80px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/60 block font-semibold">4. How do people solve it today?</label>
              <textarea
                value={expHow}
                onChange={e => setExpHow(e.target.value)}
                placeholder="Manual workarounds, existing tools, spreadsheets..."
                className="w-full min-h-[80px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/60 block font-semibold">5. What changed recently that makes this problem more visible?</label>
              <textarea
                value={expChanged}
                onChange={e => setExpChanged(e.target.value)}
                placeholder="Market shifts, technology changes, laws..."
                className="w-full min-h-[80px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/60 block font-semibold">6. What other related problems might exist around it?</label>
              <textarea
                value={expOther}
                onChange={e => setExpOther(e.target.value)}
                placeholder="Secondary pains, bottlenecks..."
                className="w-full min-h-[80px] px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40 resize-y"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              onClick={() => setExploringProblemId(null)}
              className="px-4 py-2 rounded-xl text-xs bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveExploration}
              className="glass-button text-xs py-2"
            >
              Save Exploration Answers
            </button>
          </div>
        </div>
      )}

      {/* 4. Problem & Trends Inventory List Display */}
      <div className="space-y-6">
        {/* Problems Table Card */}
        <div className="glass-card p-6 border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-[#B4F052]" />
              <h3 className="text-base font-bold text-white">Problems Long List ({countProblems})</h3>
            </div>
            <span className="text-xs text-white/40">Raw Brainstorm Material</span>
          </div>

          {problems.length === 0 ? (
            <div className="text-center py-10 text-white/30 text-xs">No problems added yet. Use the form above to add problems.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-white/40">
                    <th className="py-3 px-2 w-10">#</th>
                    <th className="py-3 px-3 min-w-[200px]">Problem</th>
                    <th className="py-3 px-3">User Segment</th>
                    <th className="py-3 px-3">Pain Description</th>
                    <th className="py-3 px-3">Where Noticed</th>
                    <th className="py-3 px-3">Types</th>
                    <th className="py-3 px-3 text-center">Exploration Questions</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {problems.map((p, index) => {
                    const hasExploration = p.explorationAnswers &&
                      p.explorationAnswers.frustrating?.trim() &&
                      p.explorationAnswers.who?.trim() &&
                      p.explorationAnswers.when?.trim() &&
                      p.explorationAnswers.how?.trim() &&
                      p.explorationAnswers.changed?.trim() &&
                      p.explorationAnswers.other?.trim();
                    return (
                      <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="py-3 px-2 text-white/40">{index + 1}</td>
                        <td className="py-3 px-3 font-semibold text-white leading-relaxed">{p.statement}</td>
                        <td className="py-3 px-3 text-white/80">{p.who}</td>
                        <td className="py-3 px-3 text-white/60 leading-relaxed max-w-[200px]">{p.painful}</td>
                        <td className="py-3 px-3 text-white/60">{p.where}</td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {p.opportunityTypes && p.opportunityTypes.length > 0 ? (
                              p.opportunityTypes.map(ot => (
                                <span key={ot} className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[#B4F052] text-[9px] border border-[#B4F052]/10 whitespace-nowrap">
                                  {ot.split('-')[0]}
                                </span>
                              ))
                            ) : (
                              <span className="text-white/20 italic text-[10px]">None</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => startExploring(p)}
                            className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                              hasExploration
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                : 'bg-[#B4F052]/10 text-[#B4F052] border border-[#B4F052]/20 hover:bg-[#B4F052]/20'
                            }`}
                          >
                            {hasExploration ? 'Explored (Edit)' : 'Answer Questions'}
                          </button>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditProblem(p)}
                              className="p-1 rounded text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
                              title="Edit Problem"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteProblem(p.id)}
                              className="p-1 rounded text-white/40 hover:text-red-400 hover:bg-white/[0.05] transition-all"
                              title="Delete Problem"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Trends Table Card */}
        <div className="glass-card p-6 border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-[#B4F052]" />
              <h3 className="text-base font-bold text-white">Trend Signals Long List ({countTrends})</h3>
            </div>
            <span className="text-xs text-white/40">Market & Behavior Observations</span>
          </div>

          {trends.length === 0 ? (
            <div className="text-center py-10 text-white/30 text-xs">No trend signals added yet. Use the form above to add trends.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-white/40">
                    <th className="py-3 px-2 w-10">#</th>
                    <th className="py-3 px-3 min-w-[150px]">Related Trend</th>
                    <th className="py-3 px-3">Where Observed</th>
                    <th className="py-3 px-3">Short Note</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {trends.map((t, index) => (
                    <tr key={t.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3 px-2 text-white/40">{index + 1}</td>
                      <td className="py-3 px-3 font-semibold text-white">{t.trend}</td>
                      <td className="py-3 px-3 text-white/80">{t.where}</td>
                      <td className="py-3 px-3 text-white/60 leading-relaxed">{t.note}</td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditTrend(t)}
                            className="p-1 rounded text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
                            title="Edit Trend"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteTrend(t.id)}
                            className="p-1 rounded text-white/40 hover:text-red-400 hover:bg-white/[0.05] transition-all"
                            title="Delete Trend"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
