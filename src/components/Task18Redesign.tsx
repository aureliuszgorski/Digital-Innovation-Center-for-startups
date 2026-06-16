'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, ArrowRight, Layers, Star, AlertTriangle, Sparkles, Save, MessageSquare, Plus, Trash2 } from 'lucide-react';
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

interface Questionnaire {
  ideaId: string;
  targetPersona: string;
  problemQuestion: string;
  solutionQuestion: string;
  pricingQuestion: string;
}

interface Interview {
  id: string;
  ideaId: string;
  customerName: string;
  customerRole: string;
  companyName: string;
  painValidation: 'High' | 'Medium' | 'Low' | 'None';
  verbatimQuote: string;
  notes: string;
}

interface HypothesisStatus {
  ideaId: string;
  personaHypothesis: 'Validated' | 'Partially' | 'Rejected' | 'Inconclusive';
  problemHypothesis: 'Validated' | 'Partially' | 'Rejected' | 'Inconclusive';
  valueHypothesis: 'Validated' | 'Partially' | 'Rejected' | 'Inconclusive';
}

const DEFAULT_SHORTLISTED = [
  { id: 'raw_1', name: 'AI-Powered SME Compliance Auditor' },
  { id: 'raw_2', name: 'B2B Contract Trust Verification Engine' },
  { id: 'raw_3', name: 'Legal Document Risk Analyzer' }
];

export default function Task18Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput, completedTasks } = useGarage();

  const isTask17Complete = completedTasks.includes(17);

  // --- Import from Task 14 ---
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

  // --- Task 18 States ---
  const [activeTab, setActiveTab] = useState(1);
  const [selectedIdeaIdState, setSelectedIdeaId] = useState<string>('');

  const selectedIdeaId = shortlistedIdeas.some(x => x.ideaId === selectedIdeaIdState)
    ? selectedIdeaIdState
    : (shortlistedIdeas[0]?.ideaId || '');

  // 1. Questionnaires
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>(() => {
    const raw = getTaskInput(18, 'questionnaires');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return shortlistedIdeas.map(idea => ({
      ideaId: idea.ideaId,
      targetPersona: 'SME CFO or Operations Director with active API connections.',
      problemQuestion: 'How many hours does your team spend preparing transaction audit trails each month?',
      solutionQuestion: 'Would an automated continuous ledger auditor that links to your bank API resolve this?',
      pricingQuestion: 'What is your current monthly budget for external auditor review billable hours?'
    }));
  });

  // 2. Interviews Logger
  const [interviews, setInterviews] = useState<Interview[]>(() => {
    const raw = getTaskInput(18, 'interviewsList');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    // Default mock interviews
    const list: Interview[] = [];
    shortlistedIdeas.forEach(idea => {
      list.push(
        {
          id: `${idea.ideaId}_int_1`,
          ideaId: idea.ideaId,
          customerName: 'Sarah Jenkins',
          customerRole: 'CFO',
          companyName: 'Acme Logistics Ltd.',
          painValidation: 'High',
          verbatimQuote: 'We spend over 40 hours manually matching invoices at the end of each quarter. It is painful and error-prone.',
          notes: 'Strong interest in a pilot program. Ready to integrate sandbox endpoints.'
        },
        {
          id: `${idea.ideaId}_int_2`,
          ideaId: idea.ideaId,
          customerName: 'Michael Chen',
          customerRole: 'Operations Director',
          companyName: 'Zenith FinTech',
          painValidation: 'Medium',
          verbatimQuote: 'Our main compliance issue is API logging consistency. Standard auditor bills are expensive.',
          notes: 'Needs custom security guarantees before linking production data.'
        }
      );
    });
    return list;
  });

  // 3. Hypothesis Status
  const [hypotheses, setHypotheses] = useState<HypothesisStatus[]>(() => {
    const raw = getTaskInput(18, 'hypothesisStatuses');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return shortlistedIdeas.map(idea => ({
      ideaId: idea.ideaId,
      personaHypothesis: 'Validated',
      problemHypothesis: 'Validated',
      valueHypothesis: 'Partially'
    }));
  });



  // Sync state values on changes
  const saveAll = React.useCallback(() => {
    setTaskInput(18, 'questionnaires', JSON.stringify(questionnaires));
    setTaskInput(18, 'interviewsList', JSON.stringify(interviews));
    setTaskInput(18, 'hypothesisStatuses', JSON.stringify(hypotheses));

    // Compile markdown report
    const mdLines: string[] = [
      '# Customer Discovery Report',
      '',
      '## Consolidated Interview Summaries',
      ''
    ];

    shortlistedIdeas.forEach(idea => {
      const name = getIdeaName(idea.ideaId);
      const q = questionnaires.find(x => x.ideaId === idea.ideaId);
      const ideaInterviews = interviews.filter(x => x.ideaId === idea.ideaId);
      const h = hypotheses.find(x => x.ideaId === idea.ideaId);
      if (q && h) {
        mdLines.push(`### Idea: ${name}`);
        mdLines.push(`- **Target Persona:** ${q.targetPersona}`);
        mdLines.push(`- **Core Questions:**`);
        mdLines.push(`  - *Problem:* ${q.problemQuestion}`);
        mdLines.push(`  - *Solution:* ${q.solutionQuestion}`);
        mdLines.push(`- **Hypothesis Validation:**`);
        mdLines.push(`  - *Persona:* ${h.personaHypothesis}`);
        mdLines.push(`  - *Problem:* ${h.problemHypothesis}`);
        mdLines.push(`  - *Value:* ${h.valueHypothesis}`);
        mdLines.push(`- **Interviews Conducted (${ideaInterviews.length}):**`);
        ideaInterviews.forEach((item, i) => {
          mdLines.push(`  ${i+1}. **${item.customerName}** (${item.customerRole} @ ${item.companyName}) - Pain: *${item.painValidation}*`);
          mdLines.push(`     *Quote:* &quot;${item.verbatimQuote}&quot;`);
        });
        mdLines.push('');
      }
    });

    setTaskInput(18, 'notes', mdLines.join('\n'));
    setTaskInput(18, 'deliverable', 'Customer Discovery Report');
  }, [questionnaires, interviews, hypotheses, shortlistedIdeas, setTaskInput]);

  useEffect(() => {
    saveAll();
  }, [saveAll]);

  const currentQ = useMemo(() => questionnaires.find(x => x.ideaId === selectedIdeaId) || questionnaires[0], [questionnaires, selectedIdeaId]);
  const currentHyp = useMemo(() => hypotheses.find(x => x.ideaId === selectedIdeaId) || hypotheses[0], [hypotheses, selectedIdeaId]);
  const currentInterviews = useMemo(() => interviews.filter(x => x.ideaId === selectedIdeaId), [interviews, selectedIdeaId]);

  const updateQuestionnaire = (field: keyof Questionnaire, val: string) => {
    setQuestionnaires(prev => prev.map(x => x.ideaId === selectedIdeaId ? { ...x, [field]: val } : x));
  };

  const updateHypothesis = (field: keyof HypothesisStatus, val: string) => {
    setHypotheses(prev => prev.map(x => x.ideaId === selectedIdeaId ? { ...x, [field]: val } : x));
  };

  const handleAddInterview = () => {
    const next: Interview = {
      id: Date.now().toString(),
      ideaId: selectedIdeaId,
      customerName: 'New Contact',
      customerRole: 'Compliance Lead',
      companyName: 'SME Inc.',
      painValidation: 'Medium',
      verbatimQuote: 'Compliance tracking takes too much manual review.',
      notes: ''
    };
    setInterviews(prev => [...prev, next]);
  };

  const handleRemoveInterview = (id: string) => {
    setInterviews(prev => prev.filter(x => x.id !== id));
  };

  const handleUpdateInterview = (id: string, field: keyof Interview, val: string) => {
    setInterviews(prev => prev.map(x => x.id === id ? { ...x, [field]: val } : x));
  };

  const handleComplete = () => {
    saveAll();
    completeTask(18);
    router.push('/tasks');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 text-white animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-8">
        <div>
          <div className="text-[#B4F052] text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Layers size={12} />
            Task 18 Redesign
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Qualitative Customer Discovery</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Validate critical assumptions before building. Log user feedback and verify if the pain point is severe enough.
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
              <span className="ml-1 text-white font-medium">Beginner (~8h)</span>
            </div>
          </div>
          <div>
            <div className="text-white/40 mb-0.5">Interviews Logged</div>
            <div className="text-white font-semibold">{interviews.length} Total</div>
          </div>
        </div>
      </div>

      {/* Idea Selector Tab Bar */}
      <div className="flex gap-2 mb-6 border-b border-white/[0.08] pb-3 overflow-x-auto">
        {shortlistedIdeas.map((idea, idx) => (
          <button
            key={idea.ideaId}
            onClick={() => setSelectedIdeaId(idea.ideaId)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              selectedIdeaId === idea.ideaId
                ? 'bg-[#B4F052]/20 border-[#B4F052]/40 text-[#B4F052] shadow-sm'
                : 'bg-white/[0.02] border-white/[0.08] text-white/40 hover:text-white/60'
            }`}
          >
            #{idx + 1}: {getIdeaName(idea.ideaId)}
          </button>
        ))}
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Wizard Panel (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-white/[0.08] overflow-x-auto pb-px gap-2">
            {[
              { id: 1, label: '1. Discovery Questionnaire' },
              { id: 2, label: '2. Log Customer Interviews' },
              { id: 3, label: '3. Hypothesis Verification' }
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
            {/* Step 1: Questionnaire Builder */}
            {activeTab === 1 && currentQ && (
              <div className="space-y-4 text-xs">
                <h3 className="text-base font-bold text-[#B4F052]">Discovery Questionnaire Builder</h3>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div>
                    <label className="text-[10px] text-white/40 block mb-1">Target Customer Persona Archetype</label>
                    <input type="text" value={currentQ.targetPersona} onChange={e => updateQuestionnaire('targetPersona', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-1.5" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 block mb-1">Problem Validation Question</label>
                    <textarea value={currentQ.problemQuestion} onChange={e => updateQuestionnaire('problemQuestion', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded p-2" rows={2} />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 block mb-1">Solution Presentation / Concept Question</label>
                    <textarea value={currentQ.solutionQuestion} onChange={e => updateQuestionnaire('solutionQuestion', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded p-2" rows={2} />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 block mb-1">Monetization / Pricing validation question</label>
                    <textarea value={currentQ.pricingQuestion} onChange={e => updateQuestionnaire('pricingQuestion', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded p-2" rows={2} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Interviews Logger */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-[#B4F052]">Log Customer Interviews</h3>
                  <button
                    onClick={handleAddInterview}
                    className="px-3 py-1 rounded bg-[#B4F052] text-black font-extrabold text-[10px] flex items-center gap-1 hover:opacity-90 transition-all"
                  >
                    <Plus size={10} />
                    Add Interview
                  </button>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {currentInterviews.map((item, idx) => (
                    <div key={item.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 text-xs">
                      <div className="flex justify-between items-center gap-4">
                        <span className="font-bold text-white">Interview #{idx + 1}</span>
                        <button onClick={() => handleRemoveInterview(item.id)} className="text-rose-400 hover:text-rose-300">
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div>
                          <label className="text-[10px] text-white/40 block">Contact Name</label>
                          <input type="text" value={item.customerName} onChange={e => handleUpdateInterview(item.id, 'customerName', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-2 py-0.5 text-[11px]" />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block">Contact Role</label>
                          <input type="text" value={item.customerRole} onChange={e => handleUpdateInterview(item.id, 'customerRole', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-2 py-0.5 text-[11px]" />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block">Company Name</label>
                          <input type="text" value={item.companyName} onChange={e => handleUpdateInterview(item.id, 'companyName', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-2 py-0.5 text-[11px]" />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block">Pain Validation</label>
                          <select
                            value={item.painValidation}
                            onChange={e => handleUpdateInterview(item.id, 'painValidation', e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-2 py-0.5 text-[11px]"
                          >
                            <option value="High">High Pain</option>
                            <option value="Medium">Medium Pain</option>
                            <option value="Low">Low Pain</option>
                            <option value="None">No Pain</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-[#B4F052]/60 block mb-0.5">Verbatim Quote</label>
                        <input type="text" value={item.verbatimQuote} onChange={e => handleUpdateInterview(item.id, 'verbatimQuote', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-1 text-[11px] italic" />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/40 block mb-0.5">Notes & Opportunities</label>
                        <input type="text" value={item.notes} onChange={e => handleUpdateInterview(item.id, 'notes', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-1 text-[11px]" />
                      </div>
                    </div>
                  ))}
                  {currentInterviews.length === 0 && (
                    <p className="text-xs text-white/30 italic text-center py-4">No interviews logged for this idea.</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Hypothesis Verification */}
            {activeTab === 3 && currentHyp && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#B4F052] mb-1">Hypothesis Verification Scorecard</h3>
                  <p className="text-xs text-white/60">Decide if your validation targets have been met.</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 block">Persona Hypothesis</label>
                      <select
                        value={currentHyp.personaHypothesis}
                        onChange={e => updateHypothesis('personaHypothesis', e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded p-2"
                      >
                        <option value="Validated">Validated</option>
                        <option value="Partially">Partially Validated</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Inconclusive">Inconclusive</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 block">Problem Hypothesis</label>
                      <select
                        value={currentHyp.problemHypothesis}
                        onChange={e => updateHypothesis('problemHypothesis', e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded p-2"
                      >
                        <option value="Validated">Validated</option>
                        <option value="Partially">Partially Validated</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Inconclusive">Inconclusive</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 block">Value Proposition Hypothesis</label>
                      <select
                        value={currentHyp.valueHypothesis}
                        onChange={e => updateHypothesis('valueHypothesis', e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded p-2"
                      >
                        <option value="Validated">Validated</option>
                        <option value="Partially">Partially Validated</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Inconclusive">Inconclusive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Preview Panel */}
        <div className="space-y-6">
          {/* Active Discovery Stats */}
          <div className="glass-card p-4 border border-white/[0.08] space-y-3 bg-black/40">
            <span className="text-xs font-bold text-white/40 block uppercase">Discovery Insights</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Interviews logged</span>
                <span className="text-[#B4F052] font-semibold">{currentInterviews.length}</span>
              </div>
              <div className="flex justify-between">
                <span>High Pain Ratio</span>
                <span className="text-emerald-400 font-semibold">
                  {currentInterviews.length > 0
                    ? `${Math.round((currentInterviews.filter(x => x.painValidation === 'High').length / currentInterviews.length) * 100)}%`
                    : '0%'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={saveAll}
              className="w-full py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.02] transition-all flex items-center justify-center gap-1.5 text-xs font-bold"
            >
              <Save size={14} />
              Save Discovery Report
            </button>
            <button
              onClick={handleComplete}
              className="w-full py-3 rounded-xl bg-[#B4F052] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 hover:opacity-95 transition-all shadow-md shadow-[#B4F052]/10"
            >
              Complete Task 18 and continue
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
