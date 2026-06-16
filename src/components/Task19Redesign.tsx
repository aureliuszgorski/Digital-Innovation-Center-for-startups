'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useGarage } from '@/context/GarageContext';
import { ArrowRight, Layers, Star, Save, Award, ChevronUp, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ShortlistedIdea {
  ideaId: string;
  rank: number;
  whyShortlisted: string;
  whatMakesItPromising: string;
  biggestRisk: string;
  keyAssumption: string;
  nextAnalysisTask: string;
}

interface RankedIdea {
  ideaId: string;
  rank: number; // 1, 2, 3
  rationale: string;
  riskRating: 'High' | 'Medium' | 'Low';
  feasibilityRating: 'High' | 'Medium' | 'Low';
}

interface SelectionDetails {
  championRationale: string;
  contingencyPlan: string;
  immediateMilestone: string;
}

const DEFAULT_SHORTLISTED = [
  { id: 'raw_1', name: 'AI-Powered SME Compliance Auditor' },
  { id: 'raw_2', name: 'B2B Contract Trust Verification Engine' },
  { id: 'raw_3', name: 'Legal Document Risk Analyzer' }
];

export default function Task19Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput } = useGarage();

  // --- Import shortlist ---
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

  const getIdeaName = useCallback((id: string) => ideaNames.get(id) || DEFAULT_SHORTLISTED.find(x => x.id === id)?.name || id, [ideaNames]);

  // --- Task 19 States ---
  const [activeTab, setActiveTab] = useState(1);

  // 1. Rankings
  const [rankings, setRankings] = useState<RankedIdea[]>(() => {
    const raw = getTaskInput(19, 'finalShortlistRankings');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return shortlistedIdeas.map((idea, idx) => ({
      ideaId: idea.ideaId,
      rank: idx + 1,
      rationale: idx === 0
        ? 'Direct problem-solution fit, validated high client pain, and lowest barrier to initial pilot contracts.'
        : idx === 1
        ? 'High long-term defensibility, but relies heavily on partner integrations.'
        : 'Solves an expensive legal cost, but has liability risks for automated errors.',
      riskRating: idx === 0 ? 'Low' : idx === 1 ? 'Medium' : 'High',
      feasibilityRating: idx === 0 ? 'High' : idx === 1 ? 'Medium' : 'Medium'
    }));
  });

  // 2. Selection Details
  const [selection, setSelection] = useState<SelectionDetails>(() => {
    const rawChampion = getTaskInput(19, 'championSelectionDetails');
    if (rawChampion) {
      try { return JSON.parse(rawChampion); } catch {}
    }
    return {
      championRationale: 'The SME Compliance Auditor scored highest across value validation, pricing interest, and execution speed. Initial focus groups confirmed high willingness to try.',
      contingencyPlan: 'If bank API integrations prove too slow to acquire, pivot to the B2B Contract Verification Engine, leveraging manual doc upload workflows.',
      immediateMilestone: 'Deploy a clickable wireframe mockup to focus group members and sign 3 letter-of-intent (LOI) agreements by week 7.'
    };
  });

  // Sync state values on changes
  const saveAll = React.useCallback(() => {
    setTaskInput(19, 'finalShortlistRankings', JSON.stringify(rankings));
    setTaskInput(19, 'championSelectionDetails', JSON.stringify(selection));

    // Compile markdown selection document
    const winningIdeaId = rankings.find(r => r.rank === 1)?.ideaId || shortlistedIdeas[0]?.ideaId;
    const runnerUpIdeaId = rankings.find(r => r.rank === 2)?.ideaId || shortlistedIdeas[1]?.ideaId;

    const winningName = getIdeaName(winningIdeaId);
    const runnerUpName = getIdeaName(runnerUpIdeaId);

    const mdLines: string[] = [
      '# Final Selection Document',
      '',
      `## Crowned Champion Business Model: **${winningName}**`,
      '',
      '### Selection Rationale',
      selection.championRationale,
      '',
      `### Runner-Up Contingency Model: **${runnerUpName}**`,
      selection.contingencyPlan,
      '',
      '### Immediate Action Milestones',
      selection.immediateMilestone,
      '',
      '## Side-by-Side Validation Summary',
      '| Rank | Business Model | Risk Level | Feasibility | Rationale |',
      '| ---- | -------------- | ---------- | ----------- | --------- |'
    ];

    rankings.sort((a,b) => a.rank - b.rank).forEach(r => {
      mdLines.push(`| #${r.rank} | ${getIdeaName(r.ideaId)} | ${r.riskRating} | ${r.feasibilityRating} | ${r.rationale} |`);
    });

    setTaskInput(19, 'notes', mdLines.join('\n'));
    setTaskInput(19, 'deliverable', 'Final Selection Document');
    setTaskInput(19, 'winningBusinessModelName', winningName);
  }, [rankings, selection, shortlistedIdeas, setTaskInput, getIdeaName]);

  useEffect(() => {
    saveAll();
  }, [saveAll]);

  // Handle re-ordering
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...rankings];
    const temp = next[idx];
    next[idx] = next[idx - 1];
    next[idx - 1] = temp;
    // reset rank index
    next.forEach((x, i) => x.rank = i + 1);
    setRankings(next);
  };

  const moveDown = (idx: number) => {
    if (idx === rankings.length - 1) return;
    const next = [...rankings];
    const temp = next[idx];
    next[idx] = next[idx + 1];
    next[idx + 1] = temp;
    next.forEach((x, i) => x.rank = i + 1);
    setRankings(next);
  };

  const handleComplete = () => {
    saveAll();
    completeTask(19);
    router.push('/tasks');
  };

  const championName = getIdeaName(rankings.find(r => r.rank === 1)?.ideaId || '');

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 text-white animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-8">
        <div>
          <div className="text-[#B4F052] text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Layers size={12} />
            Task 19 Redesign
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Rank Shortlist & Crown Champion</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Compare qualitative discovery and quantitative evaluations side-by-side. Rank the concepts, choose your winner, and outline backup strategies.
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
              <span className="ml-1 text-white font-medium">Beginner (~3h)</span>
            </div>
          </div>
          <div>
            <div className="text-white/40 mb-0.5">Shortlist Count</div>
            <div className="text-white font-semibold">{shortlistedIdeas.length} Models</div>
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
              { id: 1, label: '1. Validation Outcomes Dashboard' },
              { id: 2, label: '2. Rank Shortlist' },
              { id: 3, label: '3. Selection Rationale' }
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
            {/* Step 1: Validation Outcomes Dashboard */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#B4F052]">Validation Outcomes Dashboard</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-white/40 text-[10px]">
                        <th className="py-2 pr-4 text-left">Business Model</th>
                        <th className="py-2 pr-4">10 Types Score</th>
                        <th className="py-2 pr-4">Blue Ocean Score</th>
                        <th className="py-2 pr-4 font-bold text-[#B4F052]">Customer discovery feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shortlistedIdeas.map(idea => (
                        <tr key={idea.ideaId} className="border-b border-white/[0.04] hover:bg-white/[0.01]">
                          <td className="py-3 pr-4 font-bold text-white">{getIdeaName(idea.ideaId)}</td>
                          <td className="py-3 pr-4 text-white/70">High Innovation depth (~28 pts)</td>
                          <td className="py-3 pr-4 text-white/70">Uncontested curve (~33 pts)</td>
                          <td className="py-3 pr-4 text-[#B4F052] font-semibold">Validated High Pain point (80% ratio)</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Step 2: Rank Shortlist */}
            {activeTab === 2 && (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base font-bold text-[#B4F052]">Rank Shortlist Options</h3>
                  <span className="text-[10px] text-white/40">Use arrows to adjust ranks</span>
                </div>

                <div className="space-y-3">
                  {rankings.map((r, idx) => (
                    <div key={r.ideaId} className={`p-4 rounded-xl border flex gap-4 items-start ${r.rank === 1 ? 'bg-[#B4F052]/5 border-[#B4F052]/20' : 'bg-white/[0.01] border-white/[0.06]'}`}>
                      <div className="flex flex-col items-center justify-center gap-1.5 pt-1.5">
                        <button onClick={() => moveUp(idx)} disabled={idx === 0} className="text-white/40 hover:text-white disabled:opacity-20"><ChevronUp size={16} /></button>
                        <span className="font-extrabold text-sm">{idx + 1}</span>
                        <button onClick={() => moveDown(idx)} disabled={idx === rankings.length - 1} className="text-white/40 hover:text-white disabled:opacity-20"><ChevronDown size={16} /></button>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <span className="font-extrabold text-white text-sm">{getIdeaName(r.ideaId)}</span>
                          {r.rank === 1 && <span className="text-[9px] bg-[#B4F052] text-black px-2 py-0.5 rounded font-bold uppercase tracking-wider">Crowned Champion</span>}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-white/40">
                          <div>
                            <span>Risk Level:</span>
                            <select value={r.riskRating} onChange={e => setRankings(prev => prev.map(x => x.ideaId === r.ideaId ? { ...x, riskRating: e.target.value as RankedIdea['riskRating'] } : x))} className="bg-white/[0.02] border border-white/[0.08] ml-2 text-rose-300 font-bold">
                              <option value="High">High Risk</option>
                              <option value="Medium">Medium Risk</option>
                              <option value="Low">Low Risk</option>
                            </select>
                          </div>
                          <div>
                            <span>Feasibility:</span>
                            <select value={r.feasibilityRating} onChange={e => setRankings(prev => prev.map(x => x.ideaId === r.ideaId ? { ...x, feasibilityRating: e.target.value as RankedIdea['feasibilityRating'] } : x))} className="bg-white/[0.02] border border-white/[0.08] ml-2 text-[#B4F052] font-bold">
                              <option value="High">High Feasibility</option>
                              <option value="Medium">Medium Feasibility</option>
                              <option value="Low">Low Feasibility</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Ranking Rationale</label>
                          <input type="text" value={r.rationale} onChange={e => setRankings(prev => prev.map(x => x.ideaId === r.ideaId ? { ...x, rationale: e.target.value } : x))} className="w-full bg-white/[0.02] border border-white/[0.08] rounded px-2.5 py-1 text-[11px]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Selection Rationale */}
            {activeTab === 3 && (
              <div className="space-y-4 text-xs">
                <h3 className="text-base font-bold text-[#B4F052]">Selection Rationale & Contingency</h3>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div>
                    <label className="text-[10px] text-[#B4F052] block mb-1 font-bold">Champion Selection Rationale</label>
                    <textarea
                      value={selection.championRationale}
                      onChange={e => setSelection(prev => ({ ...prev, championRationale: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded p-2"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 block mb-1">Contingency Backup Pivot Plan</label>
                    <textarea
                      value={selection.contingencyPlan}
                      onChange={e => setSelection(prev => ({ ...prev, contingencyPlan: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded p-2"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 block mb-1">Immediate Milestone (Week 7 Launch Target)</label>
                    <textarea
                      value={selection.immediateMilestone}
                      onChange={e => setSelection(prev => ({ ...prev, immediateMilestone: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded p-2"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Preview Panel */}
        <div className="space-y-6">
          {/* Winner Card */}
          <div className="glass-card p-4 border border-[#B4F052]/20 space-y-3 bg-[#B4F052]/5 text-center">
            <Award className="mx-auto text-[#B4F052]" size={36} />
            <div>
              <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-0.5">Selected Business Model</span>
              <h4 className="font-extrabold text-sm text-[#B4F052]">{championName || 'None'}</h4>
            </div>
            <p className="text-[10px] text-white/60 leading-tight">Crowned as champion model for launch execution.</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={saveAll}
              className="w-full py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.02] transition-all flex items-center justify-center gap-1.5 text-xs font-bold"
            >
              <Save size={14} />
              Save Selection Document
            </button>
            <button
              onClick={handleComplete}
              className="w-full py-3 rounded-xl bg-[#B4F052] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 hover:opacity-95 transition-all shadow-md shadow-[#B4F052]/10"
            >
              Complete Task 19 and continue
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
