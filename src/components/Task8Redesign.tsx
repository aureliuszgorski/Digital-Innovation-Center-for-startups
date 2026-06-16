'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, ArrowRight, Layers, Star, AlertTriangle, Sparkles, FileText, Save, Info, Brain, Activity, User, ShieldAlert, Zap, ClipboardList, BookOpen, Clock, Heart, Award, Copy } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SkillGap {
  skillArea: string;
  currentLevel: number;
  neededLevel: number;
  gap: number;
  howToCover: string;
}

interface FounderReadinessArea {
  area: string;
  score: number;
  evidence: string;
  risk: string;
  improvementAction: string;
}

interface AiLeverageItem {
  workArea: string;
  founderRole: string;
  aiSupport: string;
  humanSupportNeeded: string;
  notes: string;
}

interface EnergyWellbeingItem {
  area: string;
  minimumStandard: string;
  warningSignal: string;
  recoveryAction: string;
}

const SKILL_AREAS = [
  { key: 'customer_discovery', label: 'Customer Discovery' },
  { key: 'product_thinking', label: 'Product Thinking' },
  { key: 'ai_tooling', label: 'AI Tooling' },
  { key: 'sales', label: 'Sales' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'finance', label: 'Finance' },
  { key: 'legal_compliance', label: 'Legal / Compliance' },
  { key: 'operations', label: 'Operations' },
  { key: 'leadership', label: 'Leadership' },
  { key: 'fundraising', label: 'Fundraising' },
  { key: 'technical_execution', label: 'Technical Execution' },
  { key: 'data_analytics', label: 'Data / Analytics' }
];

const READINESS_AREAS = [
  { key: 'clarity', label: 'Clarity', desc: 'Do I understand the problem, customer and direction?' },
  { key: 'execution', label: 'Execution', desc: 'Can I turn ideas into weekly progress?' },
  { key: 'customer_access', label: 'Customer Access', desc: 'Can I talk to users regularly?' },
  { key: 'learning_speed', label: 'Learning Speed', desc: 'Can I update my assumptions quickly?' },
  { key: 'resilience', label: 'Resilience', desc: 'Can I handle rejection, ambiguity and slow progress?' },
  { key: 'focus', label: 'Focus', desc: 'Can I avoid distraction and shiny-object syndrome?' },
  { key: 'communication', label: 'Communication', desc: 'Can I explain the problem and mission clearly?' },
  { key: 'leadership', label: 'Leadership', desc: 'Can I attract help, feedback and trust?' }
];

const DEFAULT_ENERGY_WELLBEING: EnergyWellbeingItem[] = [
  { area: 'Sleep', minimumStandard: '7h average sleep', warningSignal: 'Reactive decisions, brain fog', recoveryAction: 'No late screens, reset evening schedule' },
  { area: 'Movement', minimumStandard: '3x active exercise / week', warningSignal: 'Sluggish energy, physical tension', recoveryAction: 'Short morning walk or stretching session' },
  { area: 'Mental Reset', minimumStandard: 'Daily 10m breathing / meditation', warningSignal: 'High anxiety, rushing through tasks', recoveryAction: 'Block afternoon for quiet reflection' },
  { area: 'Relationships', minimumStandard: 'Weekly quality time with close people', warningSignal: 'Isolation, feeling disconnected', recoveryAction: 'Schedule offline dinner or call' }
];

export default function Task8Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput, completedTasks } = useGarage();

  // Prerequisite check: Task 7 must be complete
  const isTask7Complete = completedTasks.includes(7);

  // Load Task 7 data
  const rawSteps = getTaskInput(7, 'steps_cleaned');
  const rawFeedbackLoops = getTaskInput(7, 'feedbackLoops');
  const rawPriorities = getTaskInput(7, 'priorities');
  
  const importedRoadmap = useMemo(() => {
    let stepsList: { id: string; title: string; milestoneId: string; dependency?: string }[] = [];
    let loops: Record<string, string> = {};
    let priors: Record<string, string> = {};
    try {
      if (rawSteps) stepsList = JSON.parse(rawSteps);
      if (rawFeedbackLoops) loops = JSON.parse(rawFeedbackLoops);
      if (rawPriorities) priors = JSON.parse(rawPriorities);
    } catch (e) {}
    return { steps: stepsList, feedbackLoops: loops, priorities: priors };
  }, [rawSteps, rawFeedbackLoops, rawPriorities]);

  // Tab State
  const [activeTab, setActiveTab] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  // Execution Challenge
  const [energizingParts, setEnergizingParts] = useState(() => getTaskInput(8, 'energizingParts'));
  const [drainingParts, setDrainingParts] = useState(() => getTaskInput(8, 'drainingParts'));
  const [outsideSkillSet, setOutsideSkillSet] = useState(() => getTaskInput(8, 'outsideSkillSet'));
  const [requiresOtherPeople, setRequiresOtherPeople] = useState(() => getTaskInput(8, 'requiresOtherPeople'));
  const [aiSupportPotential, setAiSupportPotential] = useState(() => getTaskInput(8, 'aiSupportPotential'));

  // Readiness Check
  const [readinessSnapshot, setReadinessSnapshot] = useState<FounderReadinessArea[]>(() => {
    const raw = getTaskInput(8, 'readinessSnapshot');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return READINESS_AREAS.map(area => ({
      area: area.key,
      score: 3,
      evidence: '',
      risk: '',
      improvementAction: ''
    }));
  });

  // Work Rhythm
  const [workRhythm, setWorkRhythm] = useState(() => {
    const raw = getTaskInput(8, 'workRhythm');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return {
      deepWorkBlocks: 'Mon-Wed mornings (8:00 - 11:30)',
      customerDiscoveryBlocks: 'Tue & Thu afternoons',
      reviewBlock: 'Friday afternoon roadmap and metrics sync',
      learningBlock: 'Thursday morning learning block',
      adminBlock: 'Friday morning general operational tasks',
      recoveryBlock: 'Saturday rest and family time',
      dailyStartupMinimum: 'Talk to one user, improve one product artifact, or clear one backlog bottleneck'
    };
  });

  // Energy & Wellbeing
  const [energyWellbeing, setEnergyWellbeing] = useState<EnergyWellbeingItem[]>(() => {
    const raw = getTaskInput(8, 'energyWellbeing');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return DEFAULT_ENERGY_WELLBEING;
  });
  const [stressSignals, setStressSignals] = useState(() => getTaskInput(8, 'stressSignals') || 'Working past 10 PM, skipping meals, feeling defensive about feedback');
  const [recoveryProtocol, setRecoveryProtocol] = useState(() => getTaskInput(8, 'recoveryProtocol') || 'Complete work shutdown for 24 hours, sleep baseline reset, talk to a mentor');

  // Skill Gap Map
  const [skillGapMap, setSkillGapMap] = useState<SkillGap[]>(() => {
    const raw = getTaskInput(8, 'skillGapMap');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return SKILL_AREAS.map(skill => ({
      skillArea: skill.key,
      currentLevel: 3,
      neededLevel: 4,
      gap: 1,
      howToCover: 'learn'
    }));
  });

  // AI Leverage & Delegation Map
  const [aiLeverageMap, setAiLeverageMap] = useState<AiLeverageItem[]>(() => {
    const raw = getTaskInput(8, 'aiLeverageMap');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [
      { workArea: 'Customer discovery summaries', founderRole: 'Lead interviews', aiSupport: 'Summarize transcript and highlight insights', humanSupportNeeded: 'None', notes: 'Speeds up synthesis' },
      { workArea: 'Product MVP coding', founderRole: 'Architect and validate', aiSupport: 'Write component boilerplates', humanSupportNeeded: 'Fractional Developer', notes: 'Speeds up development' },
      { workArea: 'Financial & Pricing calculations', founderRole: 'Set assumptions', aiSupport: 'Build initial model templates', humanSupportNeeded: 'Advisor review', notes: 'Checks math logic' },
      { workArea: 'Legal & setup documents', founderRole: 'Make decision', aiSupport: 'Review boilerplate templates', humanSupportNeeded: 'Lawyer required', notes: 'Never delegate legal completely' }
    ];
  });

  // Personal Founder Rules
  const [rules, setRules] = useState(() => {
    const raw = getTaskInput(8, 'personalFounderRules');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return {
      iWillProtect: 'Sleep (minimum 7 hours) and Sunday offline recovery.',
      iWillNotSacrifice: 'Long-term health and time with my family.',
      iWillAskForHelpWhen: 'A technical blocker delays us by more than 3 days, or my energy drops below 3/10.',
      iWillReviewProgressEvery: 'Friday afternoon.',
      iWillStopDoing: 'Unstructured context-switching and scrolling without goals.'
    };
  });

  const generatedOSMarkdown = useMemo(() => {
    const readinessLines = readinessSnapshot.map(r => {
      const areaObj = READINESS_AREAS.find(x => x.key === r.area);
      return `| ${areaObj?.label || r.area} | ${r.score}/5 | ${r.evidence || 'N/A'} | ${r.risk || 'N/A'} | ${r.improvementAction || 'N/A'} |`;
    }).join('\n');

    const gapLines = skillGapMap.map(g => {
      const skillObj = SKILL_AREAS.find(x => x.key === g.skillArea);
      return `| ${skillObj?.label || g.skillArea} | ${g.currentLevel}/5 | ${g.neededLevel}/5 | ${g.gap} | ${g.howToCover} |`;
    }).join('\n');

    const aiLines = aiLeverageMap.map(a => {
      return `| ${a.workArea} | ${a.founderRole} | ${a.aiSupport} | ${a.humanSupportNeeded} | ${a.notes} |`;
    }).join('\n');

    const energyLines = energyWellbeing.map(e => {
      return `| ${e.area} | ${e.minimumStandard} | ${e.warningSignal} | ${e.recoveryAction} |`;
    }).join('\n');

    return `# Founder Operating System

## 1. Founder Readiness Snapshot
| Area | Score | Evidence | Risk | Improvement Action |
| --- | :---: | --- | --- | --- |
${readinessLines}

## 2. Weekly Work Rhythm
- **Deep Work Blocks**: ${workRhythm.deepWorkBlocks}
- **Customer Discovery Blocks**: ${workRhythm.customerDiscoveryBlocks}
- **Review Block**: ${workRhythm.reviewBlock}
- **Learning Block**: ${workRhythm.learningBlock}
- **Admin Block**: ${workRhythm.adminBlock}
- **Recovery Block**: ${workRhythm.recoveryBlock}
- **Daily Startup Minimum**: ${workRhythm.dailyStartupMinimum}

## 3. Energy & Wellbeing Standards
| Area | Minimum Standard | Warning Signal | Recovery Action |
| --- | --- | --- | --- |
${energyLines}

**Stress Warning Signals**: ${stressSignals}
**Recovery Protocol**: ${recoveryProtocol}

## 4. Skill Gap Map (vs Streamlined Roadmap)
| Skill Area | Current Level | Needed Level | Gap | How to Cover |
| --- | :---: | :---: | :---: | --- |
${gapLines}

## 5. AI Leverage & Delegation Plan
| Work Area | Founder Role | AI Support | Human Support Needed | Notes |
| --- | --- | --- | --- | --- |
${aiLines}

## 6. Personal Founder Rules
- **I will protect**: ${rules.iWillProtect}
- **I will not sacrifice**: ${rules.iWillNotSacrifice}
- **I will ask for help when**: ${rules.iWillAskForHelpWhen}
- **I will review progress every**: ${rules.iWillReviewProgressEvery}
- **I will stop doing**: ${rules.iWillStopDoing}
`;
  }, [readinessSnapshot, workRhythm, energyWellbeing, stressSignals, recoveryProtocol, skillGapMap, aiLeverageMap, rules]);

  // Sync inputs to context on changes
  const saveAll = () => {
    setTaskInput(8, 'energizingParts', energizingParts);
    setTaskInput(8, 'drainingParts', drainingParts);
    setTaskInput(8, 'outsideSkillSet', outsideSkillSet);
    setTaskInput(8, 'requiresOtherPeople', requiresOtherPeople);
    setTaskInput(8, 'aiSupportPotential', aiSupportPotential);
    setTaskInput(8, 'readinessSnapshot', JSON.stringify(readinessSnapshot));
    setTaskInput(8, 'workRhythm', JSON.stringify(workRhythm));
    setTaskInput(8, 'energyWellbeing', JSON.stringify(energyWellbeing));
    setTaskInput(8, 'stressSignals', stressSignals);
    setTaskInput(8, 'recoveryProtocol', recoveryProtocol);
    setTaskInput(8, 'skillGapMap', JSON.stringify(skillGapMap));
    setTaskInput(8, 'aiLeverageMap', JSON.stringify(aiLeverageMap));
    setTaskInput(8, 'personalFounderRules', JSON.stringify(rules));
    
    // Save compiled output documents
    setTaskInput(8, 'notes', generatedOSMarkdown);
    setTaskInput(8, 'deliverable', 'Founder Operating System Document');
  };

  useEffect(() => {
    saveAll();
  }, [energizingParts, drainingParts, outsideSkillSet, requiresOtherPeople, aiSupportPotential, readinessSnapshot, workRhythm, energyWellbeing, stressSignals, recoveryProtocol, skillGapMap, aiLeverageMap, rules, generatedOSMarkdown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOSMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = () => {
    saveAll();
    completeTask(8);
    router.push('/tasks/9');
  };

  if (!isTask7Complete) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="glass-card p-8 border border-white/[0.08] inline-block max-w-lg bg-black/40">
          <AlertTriangle className="mx-auto mb-4 text-[#B4F052]" size={48} />
          <h2 className="text-xl font-bold mb-2">Task 7 Incomplete</h2>
          <p className="text-white/60 mb-6 text-sm">
            Please finish and mark Task 7 (Streamline Steps) as complete to get the Streamlined Roadmap. Task 8 acts as the execution readiness assessment for that roadmap.
          </p>
          <Link href="/tasks/7" className="inline-flex items-center gap-2 glass-button px-6 py-3 rounded-xl text-sm font-semibold transition-all">
            Go to Task 7
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 animate-fade-in text-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-8">
        <div>
          <div className="text-[#B4F052] text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Layers size={12} />
            Task 8
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Master Founder Fundamentals</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Build your personal founder operating system. Check your execution readiness, define your week rhythm, and map skill gaps before structuring the support team.
          </p>
        </div>

        {/* Cockpit Card */}
        <div className="glass-card p-4 border border-white/[0.08] flex items-center gap-6 text-xs bg-black/40 backdrop-blur-md">
          <div className="border-r border-white/[0.08] pr-4">
            <div className="text-white/40 mb-0.5">Stage</div>
            <div className="text-[#B4F052] font-semibold uppercase tracking-wider">Setup</div>
          </div>
          <div className="border-r border-white/[0.08] pr-4">
            <div className="text-white/40 mb-0.5">Difficulty</div>
            <div className="flex gap-0.5 text-[#B4F052]">
              <Star size={12} className="fill-[#B4F052]" />
              <span className="ml-1 text-white font-medium">Beginner</span>
            </div>
          </div>
          <div>
            <div className="text-white/40 mb-0.5">Estimated Time</div>
            <div className="text-white font-semibold">~2 hours</div>
          </div>
        </div>
      </div>

      {/* Warning callout */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] border-l-4 border-l-[#B4F052] mb-8 text-sm flex gap-3">
        <Info className="text-[#B4F052] flex-shrink-0 mt-0.5" size={18} />
        <div>
          <span className="font-bold text-white">Important:</span> This is not about becoming a perfect founder. It is about understanding how you work, where you need support and how you will stay effective over time.
        </div>
      </div>

      {/* Main Layout: Tabs (Left) & Imported Roadmap (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Wizard Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs header */}
          <div className="flex border-b border-white/[0.08] overflow-x-auto pb-px gap-2">
            {[
              { id: 1, label: '1. Challenge' },
              { id: 2, label: '2. Readiness' },
              { id: 3, label: '3. Rhythm' },
              { id: 4, label: '4. Wellbeing' },
              { id: 5, label: '5. Skills Gap' },
              { id: 6, label: '6. AI & Delegation' },
              { id: 7, label: '7. Rules & Final OS' }
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

          <div className="glass-card p-6 border border-white/[0.06] space-y-6 bg-black/40">
            {/* Step 1: Execution Challenge */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <ClipboardList size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 1: Review Execution Challenge</h3>
                </div>
                <p className="text-xs text-white/60">
                  Contrast your streamlined roadmap with your personal bandwidth. Analyze what it takes to validate issues, build MVPs, and sustain growth.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Which parts of this roadmap feel energizing?</label>
                    <textarea
                      value={energizingParts}
                      onChange={e => setEnergizingParts(e.target.value)}
                      placeholder="e.g., User interviews, prototyping features, coding the MVP..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Which parts feel draining?</label>
                    <textarea
                      value={drainingParts}
                      onChange={e => setDrainingParts(e.target.value)}
                      placeholder="e.g., Cold LinkedIn outreach, setting up legal compliance, writing privacy policies..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Which parts are outside your current skill set?</label>
                    <textarea
                      value={outsideSkillSet}
                      onChange={e => setOutsideSkillSet(e.target.value)}
                      placeholder="e.g., Financial modeling, technical infrastructure setup..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Which parts require other people?</label>
                    <textarea
                      value={requiresOtherPeople}
                      onChange={e => setRequiresOtherPeople(e.target.value)}
                      placeholder="e.g., Tax legal review, specific B2B marketing channels..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Which parts could be supported by AI?</label>
                    <textarea
                      value={aiSupportPotential}
                      onChange={e => setAiSupportPotential(e.target.value)}
                      placeholder="e.g., Generating landing page copies, writing boilerplate code, synthesizing notes..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#B4F052]/40"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Readiness Check */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <User size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 2: Founder Readiness Check</h3>
                </div>
                <p className="text-xs text-white/60">
                  Assess your operational readiness. Score yourself from 1 (weak / unclear) to 5 (strong / highly prepared) across key categories.
                </p>

                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                  {READINESS_AREAS.map((area, idx) => {
                    const snap = readinessSnapshot.find(r => r.area === area.key) || { score: 3, evidence: '', risk: '', improvementAction: '' };
                    return (
                      <div key={area.key} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-white block">{area.label}</span>
                            <span className="text-[10px] text-white/40">{area.desc}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(scoreVal => (
                              <button
                                key={scoreVal}
                                type="button"
                                onClick={() => {
                                  setReadinessSnapshot(prev => prev.map(p => p.area === area.key ? { ...p, score: scoreVal } : p));
                                }}
                                className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all ${
                                  snap.score === scoreVal
                                    ? 'bg-[#B4F052] text-black'
                                    : 'bg-white/5 text-white/40 hover:text-white'
                                }`}
                              >
                                {scoreVal}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[9px] text-white/40 block mb-0.5">Evidence (Why this score?)</label>
                            <input
                              type="text"
                              value={snap.evidence}
                              onChange={e => {
                                const val = e.target.value;
                                setReadinessSnapshot(prev => prev.map(p => p.area === area.key ? { ...p, evidence: val } : p));
                              }}
                              placeholder="e.g., Talked to 5 users this week"
                              className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-[10px] text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-white/40 block mb-0.5">Risk Factor</label>
                            <input
                              type="text"
                              value={snap.risk}
                              onChange={e => {
                                const val = e.target.value;
                                setReadinessSnapshot(prev => prev.map(p => p.area === area.key ? { ...p, risk: val } : p));
                              }}
                              placeholder="e.g., May waste time on non-target niches"
                              className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-[10px] text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-white/40 block mb-0.5">Improvement Action</label>
                            <input
                              type="text"
                              value={snap.improvementAction}
                              onChange={e => {
                                const val = e.target.value;
                                setReadinessSnapshot(prev => prev.map(p => p.area === area.key ? { ...p, improvementAction: val } : p));
                              }}
                              placeholder="e.g., Set up 3 interviews next Monday"
                              className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-[10px] text-white focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Personal Work Rhythm */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Clock size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 3: Personal Work Rhythm</h3>
                </div>
                <p className="text-xs text-white/60">
                  Build your recurring weekly operational flow. Plan deep building blocks, recovery times, and define your smallest daily action to maintain momentum.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Deep work blocks (building/coding/planning)</label>
                    <input
                      type="text"
                      value={workRhythm.deepWorkBlocks}
                      onChange={e => setWorkRhythm({ ...workRhythm, deepWorkBlocks: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Customer discovery blocks (calls/interviews)</label>
                    <input
                      type="text"
                      value={workRhythm.customerDiscoveryBlocks}
                      onChange={e => setWorkRhythm({ ...workRhythm, customerDiscoveryBlocks: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Review block (roadmap alignment, metrics review)</label>
                    <input
                      type="text"
                      value={workRhythm.reviewBlock}
                      onChange={e => setWorkRhythm({ ...workRhythm, reviewBlock: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Learning block (leveling up gaps)</label>
                    <input
                      type="text"
                      value={workRhythm.learningBlock}
                      onChange={e => setWorkRhythm({ ...workRhythm, learningBlock: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Admin block (invoices, legal setups, compliance)</label>
                    <input
                      type="text"
                      value={workRhythm.adminBlock}
                      onChange={e => setWorkRhythm({ ...workRhythm, adminBlock: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Recovery block (deliberate sleep, digital detox)</label>
                    <input
                      type="text"
                      value={workRhythm.recoveryBlock}
                      onChange={e => setWorkRhythm({ ...workRhythm, recoveryBlock: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 bg-[#B4F052]/5 border border-[#B4F052]/20 p-4 rounded-xl space-y-2">
                    <label className="text-xs font-bold text-[#B4F052] block">Daily Startup Minimum</label>
                    <p className="text-[10px] text-white/60">
                      What is the absolute smallest action you can take daily to sustain traction and avoid going stagnant?
                    </p>
                    <input
                      type="text"
                      value={workRhythm.dailyStartupMinimum}
                      onChange={e => setWorkRhythm({ ...workRhythm, dailyStartupMinimum: e.target.value })}
                      placeholder="e.g., Speak to one user, write one product artifact, or clear one backlog bottleneck..."
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-[#B4F052] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Energy & Wellbeing System */}
            {activeTab === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Heart size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 4: Energy & Wellbeing System</h3>
                </div>
                <p className="text-xs text-white/60">
                  Protecting founder sustainability. Define your minimum standards for sleep, movement, and relationship maintenance to build a long-term engine.
                </p>

                <div className="space-y-3">
                  {energyWellbeing.map((item, idx) => (
                    <div key={item.area} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                      <div className="flex items-center font-bold text-[#B4F052]">{item.area}</div>
                      <div>
                        <label className="text-[9px] text-white/40 block mb-0.5">Minimum Standard</label>
                        <input
                          type="text"
                          value={item.minimumStandard}
                          onChange={e => {
                            const val = e.target.value;
                            setEnergyWellbeing(prev => prev.map((it, i) => i === idx ? { ...it, minimumStandard: val } : it));
                          }}
                          className="w-full bg-transparent border-b border-white/20 focus:border-[#B4F052] text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-white/40 block mb-0.5">Warning Signal</label>
                        <input
                          type="text"
                          value={item.warningSignal}
                          onChange={e => {
                            const val = e.target.value;
                            setEnergyWellbeing(prev => prev.map((it, i) => i === idx ? { ...it, warningSignal: val } : it));
                          }}
                          className="w-full bg-transparent border-b border-white/20 focus:border-[#B4F052] text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-white/40 block mb-0.5">Recovery Action</label>
                        <input
                          type="text"
                          value={item.recoveryAction}
                          onChange={e => {
                            const val = e.target.value;
                            setEnergyWellbeing(prev => prev.map((it, i) => i === idx ? { ...it, recoveryAction: val } : it));
                          }}
                          className="w-full bg-transparent border-b border-white/20 focus:border-[#B4F052] text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Stress Signals (How do you know you are overextended?)</label>
                      <textarea
                        value={stressSignals}
                        onChange={e => setStressSignals(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Recovery Protocol (What will you do when your energy drops?)</label>
                      <textarea
                        value={recoveryProtocol}
                        onChange={e => setRecoveryProtocol(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 mt-2">
                    <span className="text-xs font-bold text-white block mb-1">Optional Reflection Resource</span>
                    <p className="text-[10px] text-white/40 mb-3">
                      Review Robert Waldinger’s Harvard Study on Adult Development (TED Talk: &ldquo;What Makes a Good Life&rdquo;) focusing on relationship maintenance.
                    </p>
                    <a
                      href="https://www.ted.com/talks/robert_waldinger_what_makes_a_good_life_lessons_from_the_longest_study_on_happiness"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#B4F052] hover:underline"
                    >
                      <BookOpen size={12} />
                      Watch TED Talk: What Makes a Good Life
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Skill Gap Map */}
            {activeTab === 5 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Award size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 5: Skill Gap Map</h3>
                </div>
                <p className="text-xs text-white/60">
                  Compare the capabilities needed to execute your streamlined roadmap against your current skill levels.
                </p>

                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-white/40 border-b border-white/10 pb-1 mb-2 px-2">
                    <span className="col-span-4">Skill Area</span>
                    <span className="col-span-2 text-center">Current Level</span>
                    <span className="col-span-2 text-center">Needed Level</span>
                    <span className="col-span-1 text-center">Gap</span>
                    <span className="col-span-3">How to Cover</span>
                  </div>
                  
                  {skillGapMap.map((g, idx) => {
                    const skillObj = SKILL_AREAS.find(x => x.key === g.skillArea);
                    return (
                      <div key={g.skillArea} className="grid grid-cols-12 gap-2 text-xs items-center p-2 rounded bg-white/[0.01] hover:bg-white/[0.02]">
                        <span className="col-span-4 font-semibold text-white/80">{skillObj?.label || g.skillArea}</span>
                        <div className="col-span-2 flex justify-center">
                          <select
                            value={g.currentLevel}
                            onChange={e => {
                              const curr = parseInt(e.target.value);
                              setSkillGapMap(prev => prev.map((item, i) => i === idx ? { ...item, currentLevel: curr, gap: Math.max(0, item.neededLevel - curr) } : item));
                            }}
                            className="bg-black border border-white/20 text-xs rounded px-1.5 py-0.5 text-white focus:outline-none"
                          >
                            {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <select
                            value={g.neededLevel}
                            onChange={e => {
                              const need = parseInt(e.target.value);
                              setSkillGapMap(prev => prev.map((item, i) => i === idx ? { ...item, neededLevel: need, gap: Math.max(0, need - item.currentLevel) } : item));
                            }}
                            className="bg-black border border-white/20 text-xs rounded px-1.5 py-0.5 text-white focus:outline-none"
                          >
                            {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                        <span className={`col-span-1 text-center font-bold ${g.gap > 0 ? 'text-[#B4F052]' : 'text-white/30'}`}>{g.gap}</span>
                        <div className="col-span-3">
                          <select
                            value={g.howToCover}
                            onChange={e => {
                              const how = e.target.value;
                              setSkillGapMap(prev => prev.map((item, i) => i === idx ? { ...item, howToCover: how } : item));
                            }}
                            className="w-full bg-black border border-white/20 text-[10px] rounded px-1 py-0.5 text-white focus:outline-none"
                          >
                            <option value="learn">learn</option>
                            <option value="use AI">use AI</option>
                            <option value="find co-founder">find co-founder</option>
                            <option value="hire contractor">hire contractor</option>
                            <option value="ask mentor">ask mentor</option>
                            <option value="partner">partner</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 6: AI Leverage Map */}
            {activeTab === 6 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Zap size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 6: AI Leverage & Delegation</h3>
                </div>
                <p className="text-xs text-white/60">
                  Identify specific leverage zones where AI workflows can accelerate output, and separate them from areas requiring human support.
                </p>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {aiLeverageMap.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] space-y-2 text-xs">
                      <div className="font-semibold text-[#B4F052] flex justify-between">
                        <span>Work Area: {item.workArea}</span>
                        <button
                          type="button"
                          onClick={() => setAiLeverageMap(prev => prev.filter((_, i) => i !== idx))}
                          className="text-white/30 hover:text-rose-400 text-[10px] uppercase font-mono"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Founder Role</label>
                          <input
                            type="text"
                            value={item.founderRole}
                            onChange={e => {
                              const val = e.target.value;
                              setAiLeverageMap(prev => prev.map((it, i) => i === idx ? { ...it, founderRole: val } : it));
                            }}
                            className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">AI Support Capabilities</label>
                          <input
                            type="text"
                            value={item.aiSupport}
                            onChange={e => {
                              const val = e.target.value;
                              setAiLeverageMap(prev => prev.map((it, i) => i === idx ? { ...it, aiSupport: val } : it));
                            }}
                            className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Human Support Needed</label>
                          <input
                            type="text"
                            value={item.humanSupportNeeded}
                            onChange={e => {
                              const val = e.target.value;
                              setAiLeverageMap(prev => prev.map((it, i) => i === idx ? { ...it, humanSupportNeeded: val } : it));
                            }}
                            className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Notes</label>
                          <input
                            type="text"
                            value={item.notes}
                            onChange={e => {
                              const val = e.target.value;
                              setAiLeverageMap(prev => prev.map((it, i) => i === idx ? { ...it, notes: val } : it));
                            }}
                            className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setAiLeverageMap(prev => [...prev, { workArea: 'New area', founderRole: '', aiSupport: '', humanSupportNeeded: '', notes: '' }]);
                    }}
                    className="w-full border border-dashed border-white/20 hover:border-[#B4F052]/50 hover:bg-[#B4F052]/5 transition-all py-2 rounded-xl text-xs flex justify-center items-center gap-1.5"
                  >
                    Add Custom Work Area
                  </button>
                </div>
              </div>
            )}

            {/* Step 7: Rules & Final OS */}
            {activeTab === 7 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <ShieldAlert size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 7: Personal Founder Rules & Operating System</h3>
                </div>
                <p className="text-xs text-white/60">
                  Establish non-negotiable personal rules to shield execution from burn out. Preview and copy your Founder Operating System file.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs text-white/40 block mb-1">I will protect...</label>
                    <input
                      type="text"
                      value={rules.iWillProtect}
                      onChange={e => setRules({ ...rules, iWillProtect: e.target.value })}
                      placeholder="e.g., Sleep, Sunday offline time..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">I will not sacrifice...</label>
                    <input
                      type="text"
                      value={rules.iWillNotSacrifice}
                      onChange={e => setRules({ ...rules, iWillNotSacrifice: e.target.value })}
                      placeholder="e.g., Long-term health, family relationships..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">I will ask for help when...</label>
                    <input
                      type="text"
                      value={rules.iWillAskForHelpWhen}
                      onChange={e => setRules({ ...rules, iWillAskForHelpWhen: e.target.value })}
                      placeholder="e.g., Blocked on code for > 3 days, or energy level is < 3/10..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">I will review progress every...</label>
                    <input
                      type="text"
                      value={rules.iWillReviewProgressEvery}
                      onChange={e => setRules({ ...rules, iWillReviewProgressEvery: e.target.value })}
                      placeholder="e.g., Friday afternoon during reviews..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-white/40 block mb-1">I will stop doing...</label>
                    <input
                      type="text"
                      value={rules.iWillStopDoing}
                      onChange={e => setRules({ ...rules, iWillStopDoing: e.target.value })}
                      placeholder="e.g., Context-switching, checking analytics hourly..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-white/[0.06] pt-4 mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#B4F052] uppercase tracking-wider flex items-center gap-1">
                      <FileText size={14} /> Output Preview: Founder Operating System
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="text-[10px] text-white/60 hover:text-white border border-white/20 rounded-lg px-2.5 py-1 flex items-center gap-1 transition-all"
                    >
                      <Copy size={12} />
                      {copied ? 'Copied!' : 'Copy Markdown'}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl border border-white/[0.08] bg-black/80 font-mono text-[10px] text-white/70 overflow-x-auto whitespace-pre-wrap max-h-72">
                    {generatedOSMarkdown}
                  </pre>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
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
                onClick={() => setActiveTab(prev => Math.min(7, prev + 1))}
                disabled={activeTab === 7}
                className="px-4 py-2 rounded-xl text-xs bg-[#B4F052] text-black font-semibold hover:opacity-90 disabled:opacity-40 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Live Roadmap Summary Sidepanel */}
        <div className="space-y-6">
          <div className="glass-card p-6 border border-white/[0.08] bg-black/60 backdrop-blur-md space-y-6">
            <div className="border-b border-white/[0.08] pb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FileText size={16} className="text-[#B4F052]" />
                <h3 className="text-sm font-bold text-white">Task 7 Roadmap Input</h3>
              </div>
              <span className="text-[9px] font-mono text-[#B4F052]">Imported</span>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 text-xs">
              {importedRoadmap.steps.length === 0 ? (
                <div className="text-xs text-white/40 italic">No roadmap steps found in Task 7. Verify you saved the streamlined roadmap.</div>
              ) : (
                importedRoadmap.steps.map(s => {
                  const priority = importedRoadmap.priorities[s.id] || 'Must-Have';
                  return (
                    <div key={s.id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex justify-between items-center text-[10px] font-bold text-white/80">
                        <span>• {s.title}</span>
                        <span className={`text-[8px] px-1 rounded ${
                          priority === 'Must-Have' ? 'bg-[#B4F052]/20 text-[#B4F052]' : 'bg-white/10 text-white/50'
                        }`}>{priority}</span>
                      </div>
                      {(s as { dependency?: string }).dependency && (
                        <div className="text-[9px] text-white/40 mt-1">Dependency: {(s as { dependency?: string }).dependency}</div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Completion and Controls */}
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <button
                onClick={saveAll}
                className="w-full py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-white/80 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Save size={14} />
                Save OS Draft
              </button>

              <button
                onClick={handleComplete}
                className="w-full py-3 rounded-xl bg-[#B4F052] hover:opacity-95 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-[#B4F052]/10"
              >
                <Check size={14} />
                Complete Task 8 & Continue
              </button>
              <p className="text-[10px] text-center text-white/40">
                In Task 9, you will use this Founder Operating System to round out your founding team support models.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
