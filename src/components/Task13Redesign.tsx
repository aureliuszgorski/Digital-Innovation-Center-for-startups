'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, ArrowRight, Layers, Star, AlertTriangle, Sparkles, FileText, Save, Brain, ChevronLeft, ChevronRight, HelpCircle, Plus, Trash2, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PhasePDFGenerator from '@/components/PhasePDFGenerator';
import Link from 'next/link';

interface IdeaCard {
  id: string;
  name: string;
  description: string;
  sourceMechanism: string;
  targetSegment: string;
  ecosystemAngle: string;
  horizonAlignment: string;
  comments: string;
  notes: string;
}

export default function Task13Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput, completedTasks } = useGarage();

  const isTask12Complete = completedTasks.includes(12);

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

  const mainJTBD = getTaskInput(4, 'notes') || 'No Job to Be Done logged.';
  const primaryHorizon = getTaskInput(11, 'primaryHorizon') || 'H1';
  
  const rawMechanisms = getTaskInput(12, 'transferableMechanisms');
  const extractedMechanisms = useMemo(() => {
    if (!rawMechanisms) return [];
    try {
      return JSON.parse(rawMechanisms);
    } catch {
      return [];
    }
  }, [rawMechanisms]);

  const rawStakeholders = getTaskInput(12, 'ecosystemStakeholders');
  const stakeholdersList = useMemo(() => {
    if (!rawStakeholders) return [];
    try {
      return JSON.parse(rawStakeholders);
    } catch {
      return [];
    }
  }, [rawStakeholders]);

  // --- Task 13 State ---
  const [activeTab, setActiveTab] = useState<number>(1);

  // Idea list repository
  const [ideas, setIdeas] = useState<IdeaCard[]>(() => {
    const raw = getTaskInput(13, 'ideasLongList');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [
      {
        id: '1',
        name: 'Turnkey SaaS Analytics Dashboard',
        description: 'Provide an automated dashboard targeting customer pain points.',
        sourceMechanism: 'Infrastructure abstraction',
        targetSegment: 'Professional users',
        ecosystemAngle: 'Core buyer',
        horizonAlignment: 'Horizon 1',
        comments: 'Highly feasible, low education needed.',
        notes: 'Needs developer integrations.'
      }
    ];
  });

  // Individual generators state
  const [newIdeaName, setNewIdeaName] = useState('');
  const [newIdeaDesc, setNewIdeaDesc] = useState('');
  const [newIdeaMech, setNewIdeaMech] = useState('');
  const [newIdeaSeg, setNewIdeaSeg] = useState('');
  const [newIdeaEco, setNewIdeaEco] = useState('');
  const [newIdeaHorizon, setNewIdeaHorizon] = useState('Horizon 1');

  // Comments / Sparring
  const [teamComments, setTeamComments] = useState(() => getTaskInput(13, 'teamComments') || '');
  const [notesForTask14, setNotesForTask14] = useState(() => getTaskInput(13, 'notesForTask14') || '');

  // Add custom idea
  const addIdea = () => {
    if (!newIdeaName.trim()) {
      alert('Please enter an idea name.');
      return;
    }
    const next: IdeaCard = {
      id: Date.now().toString(),
      name: newIdeaName,
      description: newIdeaDesc,
      sourceMechanism: newIdeaMech || 'Brainstorm',
      targetSegment: newIdeaSeg || targetCustomer,
      ecosystemAngle: newIdeaEco || 'Core customer',
      horizonAlignment: newIdeaHorizon,
      comments: '',
      notes: ''
    };
    setIdeas(prev => [...prev, next]);
    setNewIdeaName('');
    setNewIdeaDesc('');
    setNewIdeaMech('');
    setNewIdeaSeg('');
    setNewIdeaEco('');
  };

  const removeIdea = (id: string) => {
    setIdeas(prev => prev.filter(x => x.id !== id));
  };

  const updateIdeaField = (id: string, field: keyof IdeaCard, val: string) => {
    setIdeas(prev => prev.map(x => x.id === id ? { ...x, [field]: val } : x));
  };

  // Compile long list markdown
  const generatedPlanMarkdown = useMemo(() => {
    const listLines = ideas.map((idea, idx) => `### Idea ${idx + 1}: ${idea.name} (${idea.horizonAlignment})
- **Description:** ${idea.description}
- **Source Mechanism:** ${idea.sourceMechanism}
- **Segment Alignment:** ${idea.targetSegment}
- **Ecosystem Angle:** ${idea.ecosystemAngle}
- **Notes:** ${idea.notes}
`).join('\n');

    return `# Idea Long List Repository

**Problem Context:** ${selectedProblem}
**Strategic Ambition Lens:** ${primaryHorizon}

## Consolidated Raw Ideas (${ideas.length} total)

${listLines || 'No ideas added yet.'}

## Collaborative Feedback
### Team & Mentor Sparring Comments:
${teamComments || 'No comments collected.'}

### Guidelines for distillation (Task 14):
${notesForTask14 || 'None logged.'}
`;
  }, [ideas, selectedProblem, primaryHorizon, teamComments, notesForTask14]);

  const saveAll = React.useCallback(() => {
    setTaskInput(13, 'ideasLongList', JSON.stringify(ideas));
    setTaskInput(13, 'teamComments', teamComments);
    setTaskInput(13, 'notesForTask14', notesForTask14);
    setTaskInput(13, 'notes', generatedPlanMarkdown);
    setTaskInput(13, 'deliverable', 'Idea Long List Repository');
  }, [ideas, teamComments, notesForTask14, generatedPlanMarkdown, setTaskInput]);

  useEffect(() => {
    saveAll();
  }, [saveAll]);

  const handleComplete = () => {
    saveAll();
    completeTask(13);
    router.push('/tasks');
  };

  // Check if minimum target is reached (min 20 recommended, min 5 required to complete)
  const isTargetMet = ideas.length >= 5;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 text-white animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-8">
        <div>
          <div className="text-[#B4F052] text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Layers size={12} />
            Task 13 Redesign
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Generate &quot;Long List&quot; of Ideas</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Brainstorm a wide set of business model variations and idea cards using your strategic lens and mechanisms.
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
            <div className="text-white font-semibold">~4 hours</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left column: Ideation Fuel */}
        <div className="space-y-6">
          <div className="glass-card p-5 border border-white/[0.08] bg-black/50 space-y-4">
            <div className="border-b border-white/[0.08] pb-2 flex items-center gap-2">
              <FileText size={14} className="text-[#B4F052]" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Ideation Fuel</h3>
            </div>

            {!isTask12Complete && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 leading-relaxed">
                <AlertTriangle size={14} className="inline mr-1" />
                Transfer map from Task 12 not completed.
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-white/40 block">Problem Statement:</span>
                <p className="text-white/80 font-medium">{selectedProblem}</p>
              </div>

              <div>
                <span className="text-white/40 block">Primary Horizon Lens:</span>
                <span className="text-[#B4F052] font-mono font-bold uppercase">{primaryHorizon}</span>
              </div>

              {extractedMechanisms.length > 0 && (
                <div>
                  <span className="text-white/40 block">Available Mechanisms:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {extractedMechanisms.map((m: { id: string | number; name: string }) => (
                      <span key={m.id} className="text-[9px] bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.5 rounded text-white/70">
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rules and target count */}
          <div className="glass-card p-5 border border-white/[0.08] bg-black/40 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b border-white/[0.08] pb-2">Ideation Rules</h3>
            <ul className="text-[10px] space-y-1 text-white/70 list-disc pl-4">
              <li>Generate many ideas before judging.</li>
              <li>Build variations, not perfect answers.</li>
              <li>Use mechanisms from Task 12.</li>
              <li>Do not select the winner yet.</li>
            </ul>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-white/50">Idea Count:</span>
              <span className={`font-extrabold font-mono ${isTargetMet ? 'text-[#B4F052]' : 'text-amber-400'}`}>
                {ideas.length} / 20 recommended
              </span>
            </div>
            <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
              <div className="h-full bg-[#B4F052]" style={{ width: `${Math.min(100, (ideas.length / 20) * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Wizard Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex border-b border-white/[0.08] overflow-x-auto pb-px gap-2">
            {[
              { id: 1, label: '1. Rules & Setup' },
              { id: 2, label: '2. Mechanism Ideas' },
              { id: 3, label: '3. Stakeholder Ideas' },
              { id: 4, label: '4. Jobs/Pains/Gains' },
              { id: 5, label: '5. Comments' },
              { id: 6, label: '6. Output List' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
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
            {/* Tab 1: Rules & Setup */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2">
                  <h2 className="text-base font-bold text-[#B4F052]">Set Ideation Rules</h2>
                  <p className="text-xs text-white/60">Initialize the creative sandbox. Focus on width and volume of ideas.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] text-xs leading-relaxed space-y-2 text-white/80">
                  <p>1. **Suspend Judgement**: Do not criticize any idea yet. Quantity produces quality.</p>
                  <p>2. **Fail Fast on Paper**: List ideas that feel risky or incomplete. We will distill them in Task 14.</p>
                  <p>3. **Mix & Match**: Adapt the mechanisms you extracted from Stripe, Airbnb, or Coursera to your problem statement.</p>
                </div>
              </div>
            )}

            {/* Tab 2: Ideas from Mechanisms */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2">
                  <h2 className="text-base font-bold text-[#B4F052]">Generate Ideas from Mechanisms</h2>
                  <p className="text-xs text-white/60">Create variations using the transferable mechanisms from Task 12.</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-white/40 block">Idea Name</label>
                      <input
                        value={newIdeaName}
                        onChange={e => setNewIdeaName(e.target.value)}
                        className="w-full px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08]"
                        placeholder="e.g. Verified Expert Network"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-white/40 block">Inspired by Mechanism</label>
                      <select
                        value={newIdeaMech}
                        onChange={e => setNewIdeaMech(e.target.value)}
                        className="w-full bg-black border border-white/[0.08] text-xs rounded px-2.5 py-1"
                      >
                        <option value="">-- Choose mechanism --</option>
                        {extractedMechanisms.map((m: { id: string | number; name: string }) => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                        <option value="Custom Mechanism">Custom Mechanism</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/40 block">Brief Description</label>
                    <textarea
                      value={newIdeaDesc}
                      onChange={e => setNewIdeaDesc(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-white/[0.03] border border-white/[0.08] text-xs"
                      rows={2}
                      placeholder="Describe the value exchange..."
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="text-white/40 mr-2">Horizon:</span>
                      <select value={newIdeaHorizon} onChange={e => setNewIdeaHorizon(e.target.value)} className="bg-black border border-white/[0.08] rounded px-1.5 py-0.5">
                        <option value="Horizon 1">Horizon 1</option>
                        <option value="Horizon 2">Horizon 2</option>
                        <option value="Horizon 3">Horizon 3</option>
                      </select>
                    </div>
                    <button onClick={addIdea} className="px-4 py-1.5 bg-[#B4F052] text-black font-bold rounded">
                      + Add Idea to Long List
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Ideas from Stakeholders */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2">
                  <h2 className="text-base font-bold text-[#B4F052]">Generate Ideas from Stakeholders</h2>
                  <p className="text-xs text-white/60">Brainstorm ideas from ecosystem partner or supplier value flows.</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-white/40 block">Idea Name</label>
                      <input
                        value={newIdeaName}
                        onChange={e => setNewIdeaName(e.target.value)}
                        className="w-full px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08]"
                        placeholder="e.g. Partner Portal integration"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-white/40 block">Ecosystem Stakeholder</label>
                      <select
                        value={newIdeaEco}
                        onChange={e => setNewIdeaEco(e.target.value)}
                        className="w-full bg-black border border-white/[0.08] text-xs rounded px-2.5 py-1"
                      >
                        <option value="">-- Choose stakeholder --</option>
                        {stakeholdersList.map((s: { id: string | number; name: string; category: string }) => (
                          <option key={s.id} value={s.name}>{s.name} ({s.category})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/40 block">Description</label>
                    <textarea
                      value={newIdeaDesc}
                      onChange={e => setNewIdeaDesc(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-white/[0.03] border border-white/[0.08] text-xs"
                      rows={2}
                    />
                  </div>

                  <button onClick={addIdea} className="px-4 py-1.5 bg-[#B4F052] text-black font-bold rounded block ml-auto text-xs">
                    + Add Idea to Long List
                  </button>
                </div>
              </div>
            )}

            {/* Tab 4: Jobs/Pains/Gains */}
            {activeTab === 4 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2">
                  <h2 className="text-base font-bold text-[#B4F052]">Generate Ideas from Customer Profile</h2>
                  <p className="text-xs text-white/60">Generate variations focused specifically on alleviating a pain or unlocking a gain.</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1 col-span-2">
                      <label className="text-white/40 block">Idea Name</label>
                      <input
                        value={newIdeaName}
                        onChange={e => setNewIdeaName(e.target.value)}
                        className="w-full px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/40 block">How does this solve the JTBD/Pain?</label>
                    <textarea
                      value={newIdeaDesc}
                      onChange={e => setNewIdeaDesc(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-white/[0.03] border border-white/[0.08] text-xs"
                      rows={2}
                    />
                  </div>

                  <button onClick={addIdea} className="px-4 py-1.5 bg-[#B4F052] text-black font-bold rounded block ml-auto text-xs">
                    + Add Idea to Long List
                  </button>
                </div>
              </div>
            )}

            {/* Tab 5: Comments */}
            {activeTab === 5 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2">
                  <h2 className="text-base font-bold text-[#B4F052]">Collaborative feedback</h2>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-white/40 block">Team and Mentor Sparring Comments</label>
                    <textarea
                      value={teamComments}
                      onChange={e => setTeamComments(e.target.value)}
                      placeholder="Add inputs from advisor meetings or team discussions..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/[0.08] text-white"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/40 block">Notes for distillation filter in Task 14</label>
                    <textarea
                      value={notesForTask14}
                      onChange={e => setNotesForTask14(e.target.value)}
                      placeholder="What parameters should we prioritize when choosing the winner?"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/[0.08] text-white"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 6: Output List */}
            {activeTab === 6 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2 flex justify-between items-center">
                  <h2 className="text-base font-bold text-[#B4F052]">Idea Long List Repository</h2>
                  <span className="text-[10px] text-white/30">{ideas.length} ideas consolidated</span>
                </div>

                {/* Ideas Repository */}
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {ideas.map((idea) => (
                    <div key={idea.id} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] text-xs flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="font-bold text-white">{idea.name}</span>
                        <span className="text-[9px] bg-white/[0.06] text-[#B4F052] px-1.5 py-0.5 rounded font-mono ml-2 uppercase">
                          {idea.horizonAlignment}
                        </span>
                        <p className="text-[11px] text-white/70 mt-1">{idea.description}</p>
                      </div>
                      <button onClick={() => removeIdea(idea.id)} className="text-rose-400 p-1">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {ideas.length === 0 && (
                    <p className="text-xs text-white/30 italic text-center py-4">No ideas generated yet. Brainstorm in previous tabs!</p>
                  )}
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
                    disabled={!isTargetMet}
                    className="px-6 py-2.5 rounded-xl bg-[#B4F052] text-black font-extrabold text-xs flex items-center gap-1.5 hover:opacity-95 disabled:opacity-40 transition-all shadow-md shadow-[#B4F052]/10"
                  >
                    Complete Task 13 and finalize
                    <ArrowRight size={14} />
                  </button>
                  <PhasePDFGenerator phase={4} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
