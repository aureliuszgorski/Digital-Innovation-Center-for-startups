'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, ArrowRight, Layers, Star, AlertTriangle, Sparkles, FileText, Save, Brain, ChevronLeft, ChevronRight, HelpCircle, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HorizonDefinition {
  horizon: 'H1' | 'H2' | 'H3';
  name: string;
  description: string;
  typicalRisk: string;
  typicalUpside: string;
  whenItFits: string;
  commonTrap: string;
}

const HORIZON_DEFINITIONS: HorizonDefinition[] = [
  {
    horizon: 'H1',
    name: 'Horizon 1 - Improve the Existing',
    description: 'You improve an existing process, experience or business model. The market already exists. The customer already understands the problem.',
    typicalRisk: 'Lower differentiation, high competitive pressure, price war risk.',
    typicalUpside: 'Lower validation risk, clearer path to early revenue, fast feedback loop.',
    whenItFits: 'Customer pain is clear, market is actively spending money, and you can execute faster or better.',
    commonTrap: 'Becoming a commodity by only making incremental changes that are easily copied.'
  },
  {
    horizon: 'H2',
    name: 'Horizon 2 - Extend or Transfer',
    description: 'You take an existing model, technology or behavior and apply it to a new segment, niche or context.',
    typicalRisk: 'Analogies may break; customer behavior might not translate to the new context.',
    typicalUpside: 'Highly defensible differentiation, moderate risk, potential to dominate a new category.',
    whenItFits: 'Customer understands parts of the problem, but category is forming. Strong underlying trends.',
    commonTrap: 'Forcing a business model transfer that doesn\'t align with customer behavior.'
  },
  {
    horizon: 'H3',
    name: 'Horizon 3 - Transform or Create',
    description: 'You create a new category, behavior or market logic.',
    typicalRisk: 'Extremely high execution risk, slow adoption, high customer education costs.',
    typicalUpside: 'Huge scalability, category creator advantage, massive enterprise value.',
    whenItFits: 'Strong macro trends are developing, and existing paradigms fail to address the core problem.',
    commonTrap: 'Underestimating the time and cash needed to educate customers and prove traction.'
  }
];

export default function Task11Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput, completedTasks } = useGarage();

  const isTask10Complete = completedTasks.includes(10);
  const isSetupComplete = completedTasks.includes(3) && completedTasks.includes(4) && completedTasks.includes(5);

  // --- Imported Context from previous tasks ---
  const selectedProblem = useMemo(() => {
    const raw = getTaskInput(3, 'selectedProblemStatement');
    if (!raw) return 'No problem selected in Task 3';
    try {
      const parsed = JSON.parse(raw);
      return parsed.description || parsed.statement || (typeof parsed === 'string' ? parsed : raw);
    } catch {
      return raw;
    }
  }, [getTaskInput]);

  const targetCustomer = useMemo(() => {
    const raw = getTaskInput(3, 'targetCustomer');
    if (!raw) return 'No target customer defined in Task 3';
    try {
      const parsed = JSON.parse(raw);
      return parsed.specificPersona || parsed.primarySegment || (typeof parsed === 'string' ? parsed : raw);
    } catch {
      return raw;
    }
  }, [getTaskInput]);

  const problemContext = getTaskInput(3, 'problemContext') || 'No context details defined.';
  const mainJTBD = getTaskInput(4, 'notes') || 'No Job to Be Done logged.';
  const visionStatement = getTaskInput(5, 'vision') || 'No vision statement drafted.';
  const missionStatement = getTaskInput(5, 'mission') || 'No mission statement drafted.';
  const founderResources = getTaskInput(8, 'notes') || 'No resources logged.';
  const supportGaps = getTaskInput(9, 'deliverable') || 'No support gaps documented.';
  const mentorInsights = getTaskInput(10, 'notes') || 'No mentor insights documented.';
  const roadmapConstraints = getTaskInput(7, 'notes') || 'No roadmap constraints defined.';

  // --- Task 11 Wizard State ---
  const [activeTab, setActiveTab] = useState<number>(1);

  // Problem Mapping
  const [h1Angle, setH1Angle] = useState(() => getTaskInput(11, 'h1Angle') || '');
  const [h2Angle, setH2Angle] = useState(() => getTaskInput(11, 'h2Angle') || '');
  const [h3Angle, setH3Angle] = useState(() => getTaskInput(11, 'h3Angle') || '');

  // Strategic Fit Scores (1-5 scale)
  const [scores, setScores] = useState<{
    H1: Record<string, number>;
    H2: Record<string, number>;
    H3: Record<string, number>;
  }>(() => {
    const raw = getTaskInput(11, 'strategicFitScores');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return {
      H1: { customerReadiness: 4, marketTiming: 4, founderFit: 3, teamFit: 3, mentorSupport: 3, diffPotential: 2, speedToLearning: 5, capitalIntensity: 2, executionComplexity: 2, customerEducationBurden: 1, timingRisk: 1 },
      H2: { customerReadiness: 3, marketTiming: 3, founderFit: 4, teamFit: 3, mentorSupport: 4, diffPotential: 4, speedToLearning: 4, capitalIntensity: 3, executionComplexity: 3, customerEducationBurden: 3, timingRisk: 2 },
      H3: { customerReadiness: 1, marketTiming: 2, founderFit: 4, teamFit: 2, mentorSupport: 3, diffPotential: 5, speedToLearning: 2, capitalIntensity: 5, executionComplexity: 5, customerEducationBurden: 5, timingRisk: 4 }
    };
  });

  // Resource & Timing Fit Questions
  const [timeToProve, setTimeToProve] = useState(() => getTaskInput(11, 'timeToProve') || '');
  const [capitalAccess, setCapitalAccess] = useState(() => getTaskInput(11, 'capitalAccess') || '');
  const [customerEducation, setCustomerEducation] = useState(() => getTaskInput(11, 'customerEducation') || '');
  const [marketCredibility, setMarketCredibility] = useState(() => getTaskInput(11, 'marketCredibility') || '');
  const [earlyBelievers, setEarlyBelievers] = useState(() => getTaskInput(11, 'earlyBelievers') || '');
  const [revenueUrgency, setRevenueUrgency] = useState(() => getTaskInput(11, 'revenueUrgency') || '');
  const [mentorshipSupport, setMentorshipSupport] = useState(() => getTaskInput(11, 'mentorshipSupport') || '');
  const [fitStatus, setFitStatus] = useState(() => getTaskInput(11, 'fitStatus') || 'workable_fit');

  // Primary Selection
  const [primaryHorizon, setPrimaryHorizon] = useState<'H1' | 'H2' | 'H3' | ''>(() => {
    return (getTaskInput(11, 'primaryHorizon') as 'H1' | 'H2' | 'H3') || '';
  });
  const [secondaryHorizon, setSecondaryHorizon] = useState<'H1' | 'H2' | 'H3' | 'none'>(() => {
    return (getTaskInput(11, 'secondaryHorizon') as 'H1' | 'H2' | 'H3' | 'none') || 'none';
  });
  const [whyThisHorizon, setWhyThisHorizon] = useState(() => getTaskInput(11, 'whyThisHorizon') || '');
  const [whyNotOtherHorizons, setWhyNotOtherHorizons] = useState(() => getTaskInput(11, 'whyNotOtherHorizons') || '');
  const [keyAssumptions, setKeyAssumptions] = useState(() => getTaskInput(11, 'keyAssumptions') || '');
  const [risksCreated, setRisksCreated] = useState(() => getTaskInput(11, 'risksCreated') || '');
  const [evidenceNeeded, setEvidenceNeeded] = useState(() => getTaskInput(11, 'evidenceNeeded') || '');
  const [implicationsForIdeation, setImplicationsForIdeation] = useState(() => getTaskInput(11, 'implicationsForIdeation') || '');

  // Checklist Completion
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    const raw = getTaskInput(11, 'checklistCompleted');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return {
      reviewedContext: false,
      understoodDefinitions: false,
      mappedProblem: false,
      scoredFit: false,
      checkedResources: false,
      assessedRiskSlider: false,
      selectedPrimary: false,
      writtenRationale: false,
      generatedDecisionDoc: false
    };
  });

  const updateScore = (horizon: 'H1' | 'H2' | 'H3', key: string, val: number) => {
    setScores(prev => ({
      ...prev,
      [horizon]: {
        ...prev[horizon],
        [key]: val
      }
    }));
  };

  const calculatedRiskScore = (horizon: 'H1' | 'H2' | 'H3') => {
    const hScores = scores[horizon];
    return hScores.capitalIntensity + hScores.executionComplexity + hScores.customerEducationBurden + hScores.timingRisk;
  };

  const calculatedOpportunityScore = (horizon: 'H1' | 'H2' | 'H3') => {
    const hScores = scores[horizon];
    return hScores.customerReadiness + hScores.marketTiming + hScores.founderFit + hScores.teamFit + hScores.mentorSupport + hScores.diffPotential + hScores.speedToLearning;
  };

  // Compile Innovation Horizon Decision
  const generatedPlanMarkdown = useMemo(() => {
    const primaryDef = HORIZON_DEFINITIONS.find(d => d.horizon === primaryHorizon);
    const secondaryDef = HORIZON_DEFINITIONS.find(d => d.horizon === secondaryHorizon);
    return `# Innovation Horizon Decision

**Selected Problem:** ${selectedProblem}
**Target Customer:** ${targetCustomer}

## Strategic Choice
- **Primary Horizon:** ${primaryHorizon ? primaryDef?.name : 'None selected'}
- **Secondary Horizon:** ${secondaryHorizon !== 'none' ? secondaryDef?.name : 'None selected'}

## Strategic Rationale
### Why this horizon?
${whyThisHorizon || 'No rationale logged.'}

### Why not the other two horizons?
${whyNotOtherHorizons || 'No comparison notes logged.'}

## Resource and Timing Fit
- **Resource Fit Level:** ${fitStatus.replace('_', ' ').toUpperCase()}
- **Time Window to Traction:** ${timeToProve || 'Not specified'}
- **Access to Capital:** ${capitalAccess || 'Not specified'}
- **Customer Education Capacity:** ${customerEducation || 'Not specified'}

## Key Validation Assumptions
${keyAssumptions || 'No validation assumptions logged.'}

## Evidence to Hunt for
${evidenceNeeded || 'No evidence points logged.'}

## Implications for Ideation (Task 12 & 13)
${implicationsForIdeation || 'No specific parameters set.'}
`;
  }, [selectedProblem, targetCustomer, primaryHorizon, secondaryHorizon, whyThisHorizon, whyNotOtherHorizons, fitStatus, timeToProve, capitalAccess, customerEducation, keyAssumptions, evidenceNeeded, implicationsForIdeation]);

  const saveAll = React.useCallback(() => {
    setTaskInput(11, 'h1Angle', h1Angle);
    setTaskInput(11, 'h2Angle', h2Angle);
    setTaskInput(11, 'h3Angle', h3Angle);
    setTaskInput(11, 'strategicFitScores', JSON.stringify(scores));
    setTaskInput(11, 'timeToProve', timeToProve);
    setTaskInput(11, 'capitalAccess', capitalAccess);
    setTaskInput(11, 'customerEducation', customerEducation);
    setTaskInput(11, 'marketCredibility', marketCredibility);
    setTaskInput(11, 'earlyBelievers', earlyBelievers);
    setTaskInput(11, 'revenueUrgency', revenueUrgency);
    setTaskInput(11, 'mentorshipSupport', mentorshipSupport);
    setTaskInput(11, 'fitStatus', fitStatus);
    setTaskInput(11, 'primaryHorizon', primaryHorizon);
    setTaskInput(11, 'secondaryHorizon', secondaryHorizon);
    setTaskInput(11, 'whyThisHorizon', whyThisHorizon);
    setTaskInput(11, 'whyNotOtherHorizons', whyNotOtherHorizons);
    setTaskInput(11, 'keyAssumptions', keyAssumptions);
    setTaskInput(11, 'risksCreated', risksCreated);
    setTaskInput(11, 'evidenceNeeded', evidenceNeeded);
    setTaskInput(11, 'implicationsForIdeation', implicationsForIdeation);
    setTaskInput(11, 'checklistCompleted', JSON.stringify(completedSteps));
    setTaskInput(11, 'notes', generatedPlanMarkdown);
    setTaskInput(11, 'deliverable', 'Innovation Horizon Decision');
  }, [h1Angle, h2Angle, h3Angle, scores, timeToProve, capitalAccess, customerEducation, marketCredibility, earlyBelievers, revenueUrgency, mentorshipSupport, fitStatus, primaryHorizon, secondaryHorizon, whyThisHorizon, whyNotOtherHorizons, keyAssumptions, risksCreated, evidenceNeeded, implicationsForIdeation, completedSteps, generatedPlanMarkdown, setTaskInput]);

  useEffect(() => {
    saveAll();
  }, [saveAll]);

  const toggleStep = (key: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleComplete = () => {
    saveAll();
    completeTask(11);
    router.push('/tasks/12');
  };

  const currentAmbitionDescription = () => {
    if (primaryHorizon === 'H1') {
      return 'Horizon 1 - Incremental Improvement. Faster feedback loop, lower capital requirement. Target is efficiency or immediate convenience.';
    }
    if (primaryHorizon === 'H2') {
      return 'Horizon 2 - Model Transfer/Expansion. Adapt a proven pattern from another market/industry. Balanced validation speed and differentiation.';
    }
    if (primaryHorizon === 'H3') {
      return 'Horizon 3 - Transformational Category Creation. High capital intensity, massive education needed, but massive potential lock-in.';
    }
    return 'Please select a primary horizon below.';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 animate-fade-in text-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-8">
        <div>
          <div className="text-[#B4F052] text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Layers size={12} />
            Task 11 Redesign
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Decide on One of &quot;Three Horizons&quot;</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Choose the innovation ambition level that fits your problem, customer, resources and founder strategy.
          </p>
        </div>

        {/* Cockpit Card */}
        <div className="glass-card p-4 border border-white/[0.08] flex items-center gap-6 text-xs bg-black/40 backdrop-blur-md">
          <div className="border-r border-white/[0.08] pr-4">
            <div className="text-white/40 mb-0.5">Stage</div>
            <div className="text-[#B4F052] font-semibold uppercase tracking-wider">Setup</div>
          </div>
          <div className="border-r border-white/[0.08] pr-4">
            <div className="text-white/40 mb-0.5">Sub-stage</div>
            <div className="text-white font-semibold">Collect Ideas</div>
          </div>
          <div>
            <div className="text-white/40 mb-0.5">Time Estimate</div>
            <div className="text-white font-semibold">~3 hours</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left column: Imported Context */}
        <div className="space-y-6">
          <div className="glass-card p-5 border border-white/[0.08] bg-black/50 space-y-4">
            <div className="border-b border-white/[0.08] pb-2 flex items-center gap-2">
              <FileText size={14} className="text-[#B4F052]" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Imported Context</h3>
            </div>

            {!isSetupComplete && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 leading-relaxed">
                <AlertTriangle size={14} className="inline mr-1" />
                Problem statement, customer, or vision are incomplete. Decide strategically, but verify inputs.
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-white/40 block">Selected Problem:</span>
                <p className="text-white/80 font-medium">{selectedProblem}</p>
              </div>

              <div>
                <span className="text-white/40 block">Target Customer:</span>
                <p className="text-white/80 font-medium">{targetCustomer}</p>
              </div>

              <div>
                <span className="text-white/40 block">Main JTBD:</span>
                <p className="text-white/70 line-clamp-2">{mainJTBD}</p>
              </div>

              <div>
                <span className="text-white/40 block">Vision:</span>
                <p className="text-white/70 line-clamp-2">{visionStatement}</p>
              </div>

              <div>
                <span className="text-white/40 block">Mission:</span>
                <p className="text-white/70 line-clamp-2">{missionStatement}</p>
              </div>

              {isTask10Complete ? (
                <div className="pt-2 border-t border-white/[0.05] space-y-2">
                  <div>
                    <span className="text-white/40 block">Mentor Insights:</span>
                    <p className="text-white/70 line-clamp-3 italic">&ldquo;{mentorInsights.substring(0, 100)}...&rdquo;</p>
                  </div>
                </div>
              ) : (
                <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04] text-[10px] text-white/40">
                  You can explore horizons, but mentorship context from Task 10 is missing.
                </div>
              )}
            </div>
          </div>

          {/* Checklist Panel */}
          <div className="glass-card p-5 border border-white/[0.08]">
            <div className="border-b border-white/[0.08] pb-2 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider">Task 11 Checklist</h3>
            </div>
            <div className="space-y-2">
              {[
                { key: 'reviewedContext', label: 'Reviewed problem & customer' },
                { key: 'understoodDefinitions', label: 'Understood H1, H2, H3 definitions' },
                { key: 'mappedProblem', label: 'Mapped problem against 3 horizons' },
                { key: 'scoredFit', label: 'Scored strategic fit parameters' },
                { key: 'checkedResources', label: 'Checked resource & timing fit' },
                { key: 'assessedRiskSlider', label: 'Assessed risk & ambition level' },
                { key: 'selectedPrimary', label: 'Selected primary innovation horizon' },
                { key: 'writtenRationale', label: 'Wrote strategic rationale' },
                { key: 'generatedDecisionDoc', label: 'Generated Horizon Decision doc' }
              ].map(step => (
                <button
                  key={step.key}
                  onClick={() => toggleStep(step.key)}
                  className="flex items-center gap-2 w-full text-left p-1 rounded hover:bg-white/[0.02] text-xs transition-all"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                    completedSteps[step.key] ? 'bg-[#B4F052] border-[#B4F052] text-black' : 'border-white/30'
                  }`}>
                    {completedSteps[step.key] && <Check size={10} />}
                  </div>
                  <span className={completedSteps[step.key] ? 'text-white/40 line-through' : 'text-white/80'}>
                    {step.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wizard Panel (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-white/[0.08] overflow-x-auto pb-px gap-2">
            {[
              { id: 1, label: '1. Learn Horizons' },
              { id: 2, label: '2. Map Problem' },
              { id: 3, label: '3. Compare Fit' },
              { id: 4, label: '4. Resource Check' },
              { id: 5, label: '5. Risk Slider' },
              { id: 6, label: '6. Decision Form' },
              { id: 7, label: '7. Output Decision' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-[#B4F052] text-[#B4F052] bg-white/[0.02]'
                    : 'border-transparent text-white/40 hover:text-white/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="glass-card p-6 border border-white/[0.06] bg-black/30 min-h-[400px]">
            {/* Tab 1: Understand Definitions */}
            {activeTab === 1 && (
              <div className="space-y-6">
                <div className="border-b border-white/[0.06] pb-2">
                  <h2 className="text-base font-bold text-[#B4F052] flex items-center gap-2">
                    <Brain size={18} />
                    Understand the Three Horizons
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {HORIZON_DEFINITIONS.map(d => (
                    <div key={d.horizon} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold text-[#B4F052] px-2 py-0.5 rounded bg-[#B4F052]/10">{d.horizon}</span>
                        <span className="text-[10px] text-white/40">Ambition level</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white mb-1">{d.name.split(' - ')[1]}</h4>
                        <p className="text-[11px] text-white/70 leading-relaxed">{d.description}</p>
                      </div>
                      <div className="text-[10px] space-y-1 pt-2 border-t border-white/[0.04]">
                        <div>
                          <span className="text-emerald-400 block font-semibold">Typical Upside:</span>
                          <span className="text-white/60">{d.typicalUpside}</span>
                        </div>
                        <div>
                          <span className="text-rose-400 block font-semibold">Typical Risk:</span>
                          <span className="text-white/60">{d.typicalRisk}</span>
                        </div>
                        <div>
                          <span className="text-[#B4F052]/80 block font-semibold">Trap:</span>
                          <span className="text-white/50 italic">{d.commonTrap}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Map Problem */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2">
                  <h2 className="text-base font-bold text-[#B4F052]">Map Problem Against Horizons</h2>
                  <p className="text-xs text-white/60">Define the angle your problem statement takes on each horizon.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-4 text-xs">
                  <span className="text-[#B4F052] font-semibold block mb-1">Core Problem:</span>
                  <span className="text-white/80">{selectedProblem}</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white block">Horizon 1 Angle (Improve the current process)</label>
                    <textarea
                      value={h1Angle}
                      onChange={e => setH1Angle(e.target.value)}
                      placeholder="e.g. How can we make the existing manual process 5x faster, cheaper, or cleaner?"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-[#B4F052]/40"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white block">Horizon 2 Angle (Transfer model from another sector)</label>
                    <textarea
                      value={h2Angle}
                      onChange={e => setH2Angle(e.target.value)}
                      placeholder="e.g. How can we apply a platform matching model or subscription delivery scheme to this problem?"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-[#B4F052]/40"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white block">Horizon 3 Angle (Transform category logic)</label>
                    <textarea
                      value={h3Angle}
                      onChange={e => setH3Angle(e.target.value)}
                      placeholder="e.g. How can we use emergent tech (e.g. AI-agents) to make the traditional paradigm obsolete?"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-[#B4F052]/40"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Compare Fit */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2">
                  <h2 className="text-base font-bold text-[#B4F052]">Score Horizon Strategic Fit (1-5)</h2>
                  <p className="text-xs text-white/60">Rate the strategic advantages and risks for each horizon path.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-white/40">
                        <th className="py-2">Fit/Risk Parameter</th>
                        <th className="py-2 text-center">H1</th>
                        <th className="py-2 text-center">H2</th>
                        <th className="py-2 text-center">H3</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {[
                        { key: 'customerReadiness', label: 'Customer readiness (Is customer looking for it?)' },
                        { key: 'marketTiming', label: 'Market timing (Is the trend mature?)' },
                        { key: 'founderFit', label: 'Founder fit (Do we have domain authority?)' },
                        { key: 'teamFit', label: 'Team fit (Can we execute it now?)' },
                        { key: 'mentorSupport', label: 'Mentor support (Do we have guides?)' },
                        { key: 'diffPotential', label: 'Differentiation potential' },
                        { key: 'speedToLearning', label: 'Speed to learning (How fast is feedback?)' }
                      ].map(row => (
                        <tr key={row.key} className="hover:bg-white/[0.01]">
                          <td className="py-2 pr-2 text-white/80">{row.label}</td>
                          {['H1', 'H2', 'H3'].map((h) => (
                            <td key={h} className="py-2 text-center">
                              <select
                                value={scores[h as 'H1'|'H2'|'H3'][row.key]}
                                onChange={e => updateScore(h as 'H1'|'H2'|'H3', row.key, parseInt(e.target.value))}
                                className="bg-black border border-white/[0.1] rounded px-1 py-0.5 text-xs text-white focus:outline-none"
                              >
                                {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                              </select>
                            </td>
                          ))}
                        </tr>
                      ))}

                      {/* Risk factors header */}
                      <tr className="border-t border-white/[0.08] text-rose-400 font-bold bg-rose-500/5">
                        <td className="py-2 px-2" colSpan={4}>Risk Parameters (Higher is riskier)</td>
                      </tr>

                      {[
                        { key: 'capitalIntensity', label: 'Capital intensity risk' },
                        { key: 'executionComplexity', label: 'Execution complexity' },
                        { key: 'customerEducationBurden', label: 'Customer education burden' },
                        { key: 'timingRisk', label: 'Timing risk (Category may lock late)' }
                      ].map(row => (
                        <tr key={row.key} className="hover:bg-white/[0.01]">
                          <td className="py-2 pr-2 text-white/80">{row.label}</td>
                          {['H1', 'H2', 'H3'].map((h) => (
                            <td key={h} className="py-2 text-center">
                              <select
                                value={scores[h as 'H1'|'H2'|'H3'][row.key]}
                                onChange={e => updateScore(h as 'H1'|'H2'|'H3', row.key, parseInt(e.target.value))}
                                className="bg-black border border-white/[0.1] rounded px-1 py-0.5 text-xs text-rose-300 focus:outline-none"
                              >
                                {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                              </select>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/[0.08] text-center">
                  {['H1', 'H2', 'H3'].map((h) => (
                    <div key={h} className="p-2.5 rounded bg-white/[0.01] border border-white/[0.04]">
                      <span className="text-[10px] text-white/40 block uppercase">{h} Strategic Summary</span>
                      <div className="flex justify-around items-center mt-1 text-xs">
                        <div>
                          <span className="text-emerald-400 block font-mono font-bold">{calculatedOpportunityScore(h as 'H1'|'H2'|'H3')}</span>
                          <span className="text-[9px] text-white/40">Opps</span>
                        </div>
                        <div className="border-l border-white/[0.06] h-6" />
                        <div>
                          <span className="text-rose-400 block font-mono font-bold">{calculatedRiskScore(h as 'H1'|'H2'|'H3')}</span>
                          <span className="text-[9px] text-white/40">Risk</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Resource Check */}
            {activeTab === 4 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2">
                  <h2 className="text-base font-bold text-[#B4F052]">Check Resource & Timing Fit</h2>
                  <p className="text-xs text-white/60">Validate if you have the runway, authority, and mentorship to sustain the ambition.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-white/40 block">How much time do you have to prove traction?</label>
                    <input
                      type="text"
                      value={timeToProve}
                      onChange={e => setTimeToProve(e.target.value)}
                      placeholder="e.g. 6 months, 1 year"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/40 block">How much capital can you access?</label>
                    <input
                      type="text"
                      value={capitalAccess}
                      onChange={e => setCapitalAccess(e.target.value)}
                      placeholder="e.g. self-funded, seed networks"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/40 block">How much customer education can you afford?</label>
                    <input
                      type="text"
                      value={customerEducation}
                      onChange={e => setCustomerEducation(e.target.value)}
                      placeholder="e.g. very little (H1), moderate (H2)"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/40 block">How strong is your credibility here?</label>
                    <input
                      type="text"
                      value={marketCredibility}
                      onChange={e => setMarketCredibility(e.target.value)}
                      placeholder="e.g. 5 years in sector, outsider perspective"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-white block mb-1">Generated Resource Fit Status</label>
                    <select
                      value={fitStatus}
                      onChange={e => setFitStatus(e.target.value)}
                      className="bg-black border border-white/[0.08] text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B4F052]/40"
                    >
                      <option value="strong_fit">Strong Fit (Runway and resources match ambition)</option>
                      <option value="workable_fit">Workable Fit (Resource gaps exist but are manageable)</option>
                      <option value="risky_fit">Risky Fit (Very tight timeline or low capital for ambition)</option>
                      <option value="not_ready">Not Ready Yet (Critical assets missing to validate path)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Risk Slider */}
            {activeTab === 5 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2">
                  <h2 className="text-base font-bold text-[#B4F052] flex items-center gap-1.5">
                    <ShieldAlert size={18} />
                    Risk and Ambition Assessment
                  </h2>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] space-y-4">
                  <label className="text-xs font-bold text-white block mb-2">Ambition Level Selector</label>
                  
                  <div className="flex justify-between text-xs font-semibold px-2">
                    <button
                      onClick={() => setPrimaryHorizon('H1')}
                      className={`px-3 py-1.5 rounded-lg border ${primaryHorizon === 'H1' ? 'bg-[#B4F052] text-black border-[#B4F052]' : 'border-white/20 text-white/50'}`}
                    >
                      Horizon 1
                    </button>
                    <button
                      onClick={() => setPrimaryHorizon('H2')}
                      className={`px-3 py-1.5 rounded-lg border ${primaryHorizon === 'H2' ? 'bg-[#B4F052] text-black border-[#B4F052]' : 'border-white/20 text-white/50'}`}
                    >
                      Horizon 2
                    </button>
                    <button
                      onClick={() => setPrimaryHorizon('H3')}
                      className={`px-3 py-1.5 rounded-lg border ${primaryHorizon === 'H3' ? 'bg-[#B4F052] text-black border-[#B4F052]' : 'border-white/20 text-white/50'}`}
                    >
                      Horizon 3
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs">
                    <span className="text-[#B4F052] uppercase font-mono tracking-wider text-[10px] block font-bold mb-1">Horizon Consequences</span>
                    <p className="text-white/80 leading-relaxed">{currentAmbitionDescription()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 6: Decision Form */}
            {activeTab === 6 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2">
                  <h2 className="text-base font-bold text-[#B4F052]">Select Primary Horizon & Rationale</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-white block mb-1">Primary Horizon</label>
                    <select
                      value={primaryHorizon}
                      onChange={e => setPrimaryHorizon(e.target.value as 'H1'|'H2'|'H3')}
                      className="w-full bg-black border border-white/[0.08] text-xs rounded-xl px-3 py-2 text-white focus:outline-none"
                    >
                      <option value="">-- Select primary --</option>
                      <option value="H1">Horizon 1 - Improve</option>
                      <option value="H2">Horizon 2 - Transfer</option>
                      <option value="H3">Horizon 3 - Transform</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white block mb-1">Secondary Horizon (Optional)</label>
                    <select
                      value={secondaryHorizon}
                      onChange={e => setSecondaryHorizon(e.target.value as 'H1'|'H2'|'H3'|'none')}
                      className="w-full bg-black border border-white/[0.08] text-xs rounded-xl px-3 py-2 text-white focus:outline-none"
                    >
                      <option value="none">None</option>
                      <option value="H1">Horizon 1 - Improve</option>
                      <option value="H2">Horizon 2 - Transfer</option>
                      <option value="H3">Horizon 3 - Transform</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white block">Why this primary horizon?</label>
                    <textarea
                      value={whyThisHorizon}
                      onChange={e => setWhyThisHorizon(e.target.value)}
                      placeholder="Identify the strategic rationale behind this ambition choice..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white block">Why not the other horizons?</label>
                    <textarea
                      value={whyNotOtherHorizons}
                      onChange={e => setWhyNotOtherHorizons(e.target.value)}
                      placeholder="Why did you reject the other choices? e.g. H3 is too slow to monetise..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white block">Key Assumptions</label>
                      <textarea
                        value={keyAssumptions}
                        onChange={e => setKeyAssumptions(e.target.value)}
                        placeholder="What assumptions must hold true for this choice to work?"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white block">Evidence Needed</label>
                      <textarea
                        value={evidenceNeeded}
                        onChange={e => setEvidenceNeeded(e.target.value)}
                        placeholder="What evidence should we look for in subsequent tasks to validate this?"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 7: Output Decision */}
            {activeTab === 7 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2 flex justify-between items-center">
                  <h2 className="text-base font-bold text-[#B4F052]">Innovation Horizon Decision</h2>
                  <span className="text-[10px] text-white/30">Review Summary</span>
                </div>

                <div className="p-4 rounded-xl border border-white/[0.08] bg-black/40 text-xs font-mono max-h-[250px] overflow-y-auto whitespace-pre-wrap leading-relaxed text-white/70">
                  {generatedPlanMarkdown}
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    onClick={saveAll}
                    className="px-4 py-2 text-xs rounded-xl border border-white/[0.08] hover:bg-white/[0.02] transition-all flex items-center gap-1.5"
                  >
                    <Save size={12} />
                    Save Draft
                  </button>

                  <button
                    onClick={handleComplete}
                    className="px-6 py-2.5 rounded-xl bg-[#B4F052] text-black font-extrabold text-xs flex items-center gap-1.5 hover:opacity-95 shadow-md shadow-[#B4F052]/10"
                  >
                    Complete Task 11 and continue to Task 12
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
