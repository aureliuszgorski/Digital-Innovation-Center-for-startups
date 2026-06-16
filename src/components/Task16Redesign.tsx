'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, ArrowRight, Layers, Star, AlertTriangle, Sparkles, Save, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ShortlistedIdea {
  ideaId: string;
  rank: number;
  whyShortlisted: string;
  whatMakesItPromising: string;
  biggestRisk: string;
  keyAssumption: string;
  nextAnalysisTask: string;
}

interface CompetitorMap {
  ideaId: string;
  directCompetitors: string;
  indirectAlternatives: string;
  currentWorkaround: string;
  doNothingCost: string;
}

interface ValueFactor {
  id: string;
  name: string;
  whyItMatters: string;
  marketLevel: number; // 1-5
  importance: number; // 1-5
}

interface StrategyCanvasScore {
  ideaId: string;
  factorId: string;
  currentMarket: number;
  bestAlternative: number;
  workaround: number;
  ourIdea: number;
}

interface ERRCGrid {
  ideaId: string;
  eliminate: string;
  reduce: string;
  raise: string;
  create: string;
}

interface DifferentiationLogic {
  ideaId: string;
  insteadOfCompetingOn: string;
  weCompeteBy: string;
  soTargetCustomerCan: string;
  withLessPainCost: string;
}

interface BlueOceanScore {
  ideaId: string;
  valueInnovation: number;
  differentiationClarity: number;
  nonCustomerPotential: number;
  competitionAvoidance: number;
  costAdvantage: number;
  adoptionSimplicity: number;
  strategicFit: number;
  defensibility: number;
  totalScore: number;
}

const DEFAULT_SHORTLISTED = [
  { id: 'raw_1', name: 'AI-Powered SME Compliance Auditor' },
  { id: 'raw_2', name: 'B2B Contract Trust Verification Engine' },
  { id: 'raw_3', name: 'Legal Document Risk Analyzer' }
];

const DEFAULT_VALUE_FACTORS: ValueFactor[] = [
  { id: 'factor_1', name: 'Price / Licensing Cost', whyItMatters: 'Upfront license fees and recurring overhead for small companies.', marketLevel: 5, importance: 4 },
  { id: 'factor_2', name: 'Onboarding Speed', whyItMatters: 'Days/weeks to fully set up client and database integration.', marketLevel: 4, importance: 5 },
  { id: 'factor_3', name: 'Accuracy & False Positives', whyItMatters: 'Missing a compliance issue creates regulatory penalties.', marketLevel: 4, importance: 5 },
  { id: 'factor_4', name: 'Human Review Dependency', whyItMatters: 'Waiting on attorneys or experts to manually verify reports.', marketLevel: 5, importance: 4 },
  { id: 'factor_5', name: 'Trust Badge legitimacy', whyItMatters: 'Proving compliance validation to third-party partners.', marketLevel: 2, importance: 4 },
  { id: 'factor_6', name: 'SLA Automation', whyItMatters: 'Triggering payments automatically based on verified logs.', marketLevel: 1, importance: 5 }
];

export default function Task16Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput, completedTasks } = useGarage();

  const isTask15Complete = completedTasks.includes(15);

  // --- Import from Task 14 & 15 ---
  const rawShortlist = getTaskInput(14, 'shortlistedIdeas');
  const shortlistedIdeas: ShortlistedIdea[] = useMemo(() => {
    if (rawShortlist) {
      try {
        const parsed = JSON.parse(rawShortlist);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return DEFAULT_SHORTLISTED.map((x, i) => ({
      ideaId: x.id,
      rank: i + 1,
      whyShortlisted: 'Top performer in filtering criteria.',
      whatMakesItPromising: 'Clear target segment pain and high feasibility.',
      biggestRisk: 'Data access constraints.',
      keyAssumption: 'SMEs will grant read access to database logs.',
      nextAnalysisTask: 'task_15'
    }));
  }, [rawShortlist]);

  // Names dictionary
  const ideaNames = useMemo(() => {
    const map = new Map<string, string>();
    DEFAULT_SHORTLISTED.forEach(x => map.set(x.id, x.name));
    const rawNormalized = getTaskInput(14, 'normalizedIdeaCards');
    if (rawNormalized) {
      try {
        const parsed = JSON.parse(rawNormalized);
        if (parsed.length > 0) {
          parsed.forEach((x: { ideaId?: string; id?: string; ideaName?: string; name?: string }) => {
            map.set(x.ideaId || x.id || '', x.ideaName || x.name || '');
          });
        }
      } catch {}
    }
    return map;
  }, [getTaskInput]);

  const getIdeaName = (id: string) => ideaNames.get(id) || DEFAULT_SHORTLISTED.find(x => x.id === id)?.name || id;

  // --- Task 16 States ---
  const [activeTab, setActiveTab] = useState(1);

  // 1. Competitor Map
  const [competitors, setCompetitors] = useState<CompetitorMap[]>(() => {
    const raw = getTaskInput(16, 'competitorMap');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return shortlistedIdeas.map(idea => ({
      ideaId: idea.ideaId,
      directCompetitors: 'Legacy compliance consultants, local accounting boutiques.',
      indirectAlternatives: 'In-house legal interns reviewing manual Excel spreadsheets.',
      currentWorkaround: 'Spot-checking 5% of monthly contracts manually.',
      doNothingCost: 'Fines, transaction delays, and loss of partner trust.'
    }));
  });

  // 2. Value Factors
  const [valueFactors, setValueFactors] = useState<ValueFactor[]>(() => {
    const raw = getTaskInput(16, 'valueFactors');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return DEFAULT_VALUE_FACTORS;
  });

  // 3. Strategy Canvas Scores
  const [canvasScores, setCanvasScores] = useState<StrategyCanvasScore[]>(() => {
    const raw = getTaskInput(16, 'strategyCanvasScores');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    const list: StrategyCanvasScore[] = [];
    shortlistedIdeas.forEach(idea => {
      DEFAULT_VALUE_FACTORS.forEach(f => {
        list.push({
          ideaId: idea.ideaId,
          factorId: f.id,
          currentMarket: f.marketLevel,
          bestAlternative: 4,
          workaround: 2,
          ourIdea: f.id === 'factor_1' ? 2 : f.id === 'factor_4' ? 1 : 5 // reduce price and human dependency, raise others
        });
      });
    });
    return list;
  });

  // 4. ERRC Grid
  const [errc, setErrc] = useState<ERRCGrid[]>(() => {
    const raw = getTaskInput(16, 'errcGrid');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return shortlistedIdeas.map(idea => ({
      ideaId: idea.ideaId,
      eliminate: 'Eliminate hourly legal consultation retainer requirements.',
      reduce: 'Reduce manual document uploads and setup processing times.',
      raise: 'Raise real-time audit coverage to 100% of transaction logs.',
      create: 'Create an automated transaction compliance score badge for audit reports.'
    }));
  });

  // 5. Differentiation Logic
  const [logic, setLogic] = useState<DifferentiationLogic[]>(() => {
    const raw = getTaskInput(16, 'differentiationLogic');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return shortlistedIdeas.map(idea => ({
      ideaId: idea.ideaId,
      insteadOfCompetingOn: 'custom consulting hours and expensive legal retainers',
      weCompeteBy: 'real-time AI database transaction audits and instant compliance ratings',
      soTargetCustomerCan: 'monitor regulatory adherence 24/7 without delays',
      withLessPainCost: '90% lower legal billable fees and zero compliance fines'
    }));
  });

  // 6. Blue Ocean Scores
  const [scores, setScores] = useState<BlueOceanScore[]>(() => {
    const raw = getTaskInput(16, 'blueOceanScores');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return shortlistedIdeas.map(idea => ({
      ideaId: idea.ideaId,
      valueInnovation: 4,
      differentiationClarity: 4,
      nonCustomerPotential: 4,
      competitionAvoidance: 5,
      costAdvantage: 4,
      adoptionSimplicity: 3,
      strategicFit: 5,
      defensibility: 4,
      totalScore: 33
    }));
  });

  // Calculate live scores
  const scoreMap = useMemo(() => {
    const map = new Map<string, number>();
    scores.forEach(s => {
      const tot = s.valueInnovation + s.differentiationClarity + s.nonCustomerPotential + s.competitionAvoidance + s.costAdvantage + s.adoptionSimplicity + s.strategicFit + s.defensibility;
      map.set(s.ideaId, tot);
    });
    return map;
  }, [scores]);

  // Sync state values on changes
  const saveAll = React.useCallback(() => {
    setTaskInput(16, 'competitorMap', JSON.stringify(competitors));
    setTaskInput(16, 'valueFactors', JSON.stringify(valueFactors));
    setTaskInput(16, 'strategyCanvasScores', JSON.stringify(canvasScores));
    setTaskInput(16, 'errcGrid', JSON.stringify(errc));
    setTaskInput(16, 'differentiationLogic', JSON.stringify(logic));
    setTaskInput(16, 'blueOceanScores', JSON.stringify(scores));

    // Compile markdown Blue Ocean report
    const mdLines: string[] = [
      '# Blue Ocean Opportunity Map',
      '',
      '## Value Curves & Differentiation Logic per Idea',
      ''
    ];

    shortlistedIdeas.forEach(idea => {
      const name = getIdeaName(idea.ideaId);
      const com = competitors.find(c => c.ideaId === idea.ideaId);
      const grid = errc.find(g => g.ideaId === idea.ideaId);
      const log = logic.find(l => l.ideaId === idea.ideaId);
      const scoreVal = scoreMap.get(idea.ideaId) || 0;
      if (grid && log) {
        mdLines.push(`### Idea: ${name} (Blue Ocean Score: ${scoreVal})`);
        mdLines.push(`- **Alternatives:** ${com?.directCompetitors} vs ${com?.indirectAlternatives}`);
        mdLines.push(`- **ERRC Grid:**`);
        mdLines.push(`  - *Eliminate:* ${grid.eliminate}`);
        mdLines.push(`  - *Reduce:* ${grid.reduce}`);
        mdLines.push(`  - *Raise:* ${grid.raise}`);
        mdLines.push(`  - *Create:* ${grid.create}`);
        mdLines.push(`- **Differentiation Formula:** Instead of competing on *${log.insteadOfCompetingOn}*, we compete by *${log.weCompeteBy}*, so that our customers can *${log.soTargetCustomerCan}* with less *${log.withLessPainCost}*.`);
        mdLines.push('');
      }
    });

    setTaskInput(16, 'notes', mdLines.join('\n'));
    setTaskInput(16, 'deliverable', 'Blue Ocean Opportunity Map');
  }, [competitors, valueFactors, canvasScores, errc, logic, scores, shortlistedIdeas, scoreMap, setTaskInput]);

  useEffect(() => {
    saveAll();
  }, [saveAll]);

  const handleComplete = () => {
    saveAll();
    completeTask(16);
    router.push('/tasks');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 text-white animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-8">
        <div>
          <div className="text-[#B4F052] text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Layers size={12} />
            Task 16 Redesign
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Blue Ocean Strategy Canvas</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Design an uncontested market space where the competition is irrelevant. Eliminate high costs and create new value metrics.
          </p>
        </div>

        {/* Cockpit */}
        <div className="glass-card p-4 border border-white/[0.08] flex items-center gap-6 text-xs bg-black/40 backdrop-blur-md">
          <div className="border-r border-white/[0.08] pr-4">
            <div className="text-white/40 mb-0.5">Stage / Sub-Stage</div>
            <div className="text-[#B4F052] font-semibold">SETUP / Determine Models</div>
          </div>
          <div className="border-r border-white/[0.08] pr-4">
            <div className="text-white/40 mb-0.5">Difficulty / Duration</div>
            <div className="flex gap-0.5 text-[#B4F052]">
              <Star size={12} className="fill-[#B4F052]" />
              <span className="ml-1 text-white font-medium">Beginner (~4h)</span>
            </div>
          </div>
          <div>
            <div className="text-white/40 mb-0.5">Shortlist Count</div>
            <div className="text-white font-semibold">{shortlistedIdeas.length} Shortlisted</div>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Wizard Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-white/[0.08] overflow-x-auto pb-px gap-2">
            {[
              { id: 1, label: '1. Competitors Map' },
              { id: 2, label: '2. Value Factors' },
              { id: 3, label: '3. Strategy Canvas' },
              { id: 4, label: '4. ERRC Grid' },
              { id: 5, label: '5. Differentiation' },
              { id: 6, label: '6. Blue Ocean Score' }
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

          <div className="glass-card p-6 border border-white/[0.08] bg-black/20">
            {/* Step 1: Competitors Map */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#B4F052]">Identify Current Alternatives</h3>
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                  {competitors.map((com, idx) => (
                    <div key={com.ideaId} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 text-xs">
                      <h4 className="text-sm font-bold text-white border-b border-white/[0.04] pb-1">{idx+1}. {getIdeaName(com.ideaId)}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">Direct Competitors (Who else does this?)</label>
                          <input
                            type="text"
                            value={com.directCompetitors}
                            onChange={e => setCompetitors(prev => prev.map(c => c.ideaId === com.ideaId ? { ...c, directCompetitors: e.target.value } : c))}
                            className="w-full bg-white/[0.02] border border-white/[0.08] rounded px-3 py-1.5"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">Indirect Alternatives (Different approach)</label>
                          <input
                            type="text"
                            value={com.indirectAlternatives}
                            onChange={e => setCompetitors(prev => prev.map(c => c.ideaId === com.ideaId ? { ...c, indirectAlternatives: e.target.value } : c))}
                            className="w-full bg-white/[0.02] border border-white/[0.08] rounded px-3 py-1.5"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">Current Workaround (Manual hacks)</label>
                          <input
                            type="text"
                            value={com.currentWorkaround}
                            onChange={e => setCompetitors(prev => prev.map(c => c.ideaId === com.ideaId ? { ...c, currentWorkaround: e.target.value } : c))}
                            className="w-full bg-white/[0.02] border border-white/[0.08] rounded px-3 py-1.5"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">Do-Nothing Cost (Risk of leaving unresolved)</label>
                          <input
                            type="text"
                            value={com.doNothingCost}
                            onChange={e => setCompetitors(prev => prev.map(c => c.ideaId === com.ideaId ? { ...c, doNothingCost: e.target.value } : c))}
                            className="w-full bg-white/[0.02] border border-white/[0.08] rounded px-3 py-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Value Factors */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-[#B4F052]">Define Value Factors</h3>
                  <span className="text-xs text-white/40">Competitor comparison standards</span>
                </div>

                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                  {valueFactors.map((f, idx) => (
                    <div key={f.id} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      <div className="md:w-1/4">
                        <span className="font-bold text-white">{idx+1}. {f.name}</span>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={f.whyItMatters}
                          onChange={e => setValueFactors(prev => prev.map(x => x.id === f.id ? { ...x, whyItMatters: e.target.value } : x))}
                          className="w-full bg-transparent border-none focus:ring-0 p-0 text-white/70 italic text-[11px]"
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-white/40">Market Level:</span>
                          <select
                            value={f.marketLevel}
                            onChange={e => setValueFactors(prev => prev.map(x => x.id === f.id ? { ...x, marketLevel: parseInt(e.target.value) } : x))}
                            className="bg-white/[0.02] border border-white/[0.08] px-2 py-0.5 rounded text-[11px]"
                          >
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-[#B4F052]/60">Importance:</span>
                          <select
                            value={f.importance}
                            onChange={e => setValueFactors(prev => prev.map(x => x.id === f.id ? { ...x, importance: parseInt(e.target.value) } : x))}
                            className="bg-white/[0.02] border border-white/[0.08] px-2 py-0.5 rounded text-[11px]"
                          >
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Strategy Canvas */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#B4F052]">Strategy Canvas Scores</h3>
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                  {shortlistedIdeas.map((idea, idx) => (
                    <div key={idea.ideaId} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 text-xs">
                      <h4 className="text-sm font-bold text-white border-b border-white/[0.04] pb-1">{idx+1}. {getIdeaName(idea.ideaId)}</h4>

                      <div className="overflow-x-auto">
                        <table className="w-full text-center border-collapse">
                          <thead>
                            <tr className="border-b border-white/[0.08] text-white/40 text-[10px]">
                              <th className="text-left py-2">Factor</th>
                              <th className="py-2">Current Market</th>
                              <th className="py-2">Best Alternative</th>
                              <th className="py-2">Manual Workaround</th>
                              <th className="py-2 text-[#B4F052] font-bold">Our Blue Ocean Idea</th>
                            </tr>
                          </thead>
                          <tbody>
                            {valueFactors.map(f => {
                              const score = canvasScores.find(s => s.ideaId === idea.ideaId && s.factorId === f.id) || { currentMarket: 3, bestAlternative: 3, workaround: 2, ourIdea: 4 };
                              const updateScore = (field: keyof StrategyCanvasScore, val: number) => {
                                setCanvasScores(prev => prev.map(s => s.ideaId === idea.ideaId && s.factorId === f.id ? { ...s, [field]: val } : s));
                              };
                              return (
                                <tr key={f.id} className="border-b border-white/[0.04] hover:bg-white/[0.01] text-[11px]">
                                  <td className="text-left py-2.5 font-medium text-white">{f.name}</td>
                                  <td className="py-2.5">
                                    <select value={score.currentMarket} onChange={e => updateScore('currentMarket', parseInt(e.target.value))} className="bg-white/[0.02] border border-white/[0.08] rounded px-1.5 py-0.5">
                                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                  </td>
                                  <td className="py-2.5">
                                    <select value={score.bestAlternative} onChange={e => updateScore('bestAlternative', parseInt(e.target.value))} className="bg-white/[0.02] border border-white/[0.08] rounded px-1.5 py-0.5">
                                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                  </td>
                                  <td className="py-2.5">
                                    <select value={score.workaround} onChange={e => updateScore('workaround', parseInt(e.target.value))} className="bg-white/[0.02] border border-white/[0.08] rounded px-1.5 py-0.5">
                                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                  </td>
                                  <td className="py-2.5 text-[#B4F052]">
                                    <select value={score.ourIdea} onChange={e => updateScore('ourIdea', parseInt(e.target.value))} className="bg-[#B4F052]/10 border border-[#B4F052]/30 rounded px-1.5 py-0.5 text-[#B4F052]">
                                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: ERRC Grid */}
            {activeTab === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#B4F052] mb-1">ERRC Grid Formulation</h3>
                  <p className="text-xs text-white/60">Eliminate, Reduce, Raise, and Create strategic moves.</p>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {errc.map((item, idx) => (
                    <div key={item.ideaId} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 text-xs">
                      <h4 className="text-sm font-bold text-white border-b border-white/[0.04] pb-1">{idx+1}. {getIdeaName(item.ideaId)}</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-rose-400 block font-bold">Eliminate (Stop doing entirely)</label>
                          <textarea
                            value={item.eliminate}
                            onChange={e => setErrc(prev => prev.map(x => x.ideaId === item.ideaId ? { ...x, eliminate: e.target.value } : x))}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                            rows={2}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-orange-400 block font-bold">Reduce (Lower below standards)</label>
                          <textarea
                            value={item.reduce}
                            onChange={e => setErrc(prev => prev.map(x => x.ideaId === item.ideaId ? { ...x, reduce: e.target.value } : x))}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                            rows={2}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-sky-400 block font-bold">Raise (Boost above standards)</label>
                          <textarea
                            value={item.raise}
                            onChange={e => setErrc(prev => prev.map(x => x.ideaId === item.ideaId ? { ...x, raise: e.target.value } : x))}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                            rows={2}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-emerald-400 block font-bold">Create (Introduce brand new values)</label>
                          <textarea
                            value={item.create}
                            onChange={e => setErrc(prev => prev.map(x => x.ideaId === item.ideaId ? { ...x, create: e.target.value } : x))}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Differentiation */}
            {activeTab === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#B4F052] mb-1">Define Differentiation Formulas</h3>
                  <p className="text-xs text-white/60">Express the unique value curve clearly in one statement.</p>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {logic.map((l, idx) => (
                    <div key={l.ideaId} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 text-xs">
                      <h4 className="text-sm font-bold text-white border-b border-white/[0.04] pb-1">{idx+1}. {getIdeaName(l.ideaId)}</h4>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span>Instead of competing on</span>
                          <input
                            type="text"
                            value={l.insteadOfCompetingOn}
                            onChange={e => setLogic(prev => prev.map(x => x.ideaId === l.ideaId ? { ...x, insteadOfCompetingOn: e.target.value } : x))}
                            className="bg-white/[0.03] border border-white/[0.08] rounded px-3 py-1 text-white flex-1 min-w-[200px]"
                          />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span>we compete by</span>
                          <input
                            type="text"
                            value={l.weCompeteBy}
                            onChange={e => setLogic(prev => prev.map(x => x.ideaId === l.ideaId ? { ...x, weCompeteBy: e.target.value } : x))}
                            className="bg-white/[0.03] border border-white/[0.08] rounded px-3 py-1 text-white flex-1 min-w-[200px]"
                          />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span>so target customers can</span>
                          <input
                            type="text"
                            value={l.soTargetCustomerCan}
                            onChange={e => setLogic(prev => prev.map(x => x.ideaId === l.ideaId ? { ...x, soTargetCustomerCan: e.target.value } : x))}
                            className="bg-white/[0.03] border border-white/[0.08] rounded px-3 py-1 text-white flex-1 min-w-[200px]"
                          />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span>with less</span>
                          <input
                            type="text"
                            value={l.withLessPainCost}
                            onChange={e => setLogic(prev => prev.map(x => x.ideaId === l.ideaId ? { ...x, withLessPainCost: e.target.value } : x))}
                            className="bg-white/[0.03] border border-white/[0.08] rounded px-3 py-1 text-white flex-1 min-w-[200px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Blue Ocean Score */}
            {activeTab === 6 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#B4F052] mb-1">Blue Ocean Potential Scores</h3>
                  <p className="text-xs text-white/60">Evaluate model potential on a 1-5 scale.</p>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {scores.map((scoreCard, idx) => (
                    <div key={scoreCard.ideaId} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4 text-xs">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-white">{idx+1}. {getIdeaName(scoreCard.ideaId)}</h4>
                        <div className="text-sm font-extrabold text-[#B4F052] bg-[#B4F052]/10 px-3 py-1 rounded-lg">
                          Blue Ocean Total: {scoreMap.get(scoreCard.ideaId) || 0} / 40
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-8 gap-2">
                        {([
                          { label: 'Value Innovation', key: 'valueInnovation' },
                          { label: 'Diff. Clarity', key: 'differentiationClarity' },
                          { label: 'Non-Customer', key: 'nonCustomerPotential' },
                          { label: 'Avoidance', key: 'competitionAvoidance' },
                          { label: 'Cost Adv.', key: 'costAdvantage' },
                          { label: 'Adoption', key: 'adoptionSimplicity' },
                          { label: 'Strategic Fit', key: 'strategicFit' },
                          { label: 'Defensibility', key: 'defensibility' },
                        ] as Array<{ label: string; key: keyof BlueOceanScore }>).map(c => (
                          <div key={c.label} className="space-y-1">
                            <label className="text-[10px] text-white/40 block text-center leading-tight">{c.label}</label>
                            <select
                              value={scoreCard[c.key] as number}
                              onChange={e => setScores(prev => prev.map(s => s.ideaId === scoreCard.ideaId ? ({ ...s, [c.key]: parseInt(e.target.value) } as BlueOceanScore) : s))}
                              className="w-full bg-white/[0.02] border border-white/[0.08] px-2 py-1 rounded text-center text-white"
                            >
                              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Preview Panel */}
        <div className="space-y-6">
          {/* Blue Ocean Opportunity Map Preview */}
          <div className="glass-card p-4 border border-white/[0.08] space-y-3 bg-black/40">
            <span className="text-xs font-bold text-white/40 block uppercase">Blue Ocean Map</span>
            <div className="space-y-3">
              {shortlistedIdeas.map((idea, idx) => {
                const name = getIdeaName(idea.ideaId);
                const scoreVal = scoreMap.get(idea.ideaId) || 0;
                const log = logic.find(l => l.ideaId === idea.ideaId);
                return (
                  <div key={idea.ideaId} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-[#B4F052]">{name}</span>
                      <span className="text-[10px] bg-[#B4F052]/15 text-[#B4F052] px-2 py-0.5 rounded font-mono">{scoreVal} pts</span>
                    </div>
                    {log && (
                      <p className="text-[10px] text-white/60 italic leading-tight mt-1">
                        &quot;Instead of competing on {log.insteadOfCompetingOn.substring(0, 30)}..., we compete by {log.weCompeteBy.substring(0, 30)}...&quot;
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={saveAll}
              className="w-full py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.02] transition-all flex items-center justify-center gap-1.5 text-xs font-bold"
            >
              <Save size={14} />
              Save Blue Ocean Map
            </button>
            <button
              onClick={handleComplete}
              className="w-full py-3 rounded-xl bg-[#B4F052] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 hover:opacity-95 transition-all shadow-md shadow-[#B4F052]/10"
            >
              Complete Task 16 and continue
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
