'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, ArrowRight, Layers, Star, AlertTriangle, Sparkles, Save, LayoutGrid, Award, ShieldAlert } from 'lucide-react';
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

interface BMCCanvas {
  ideaId: string;
  keyPartners: string;
  keyActivities: string;
  keyResources: string;
  valuePropositions: string;
  customerRelationships: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
}

interface VPCCanvas {
  ideaId: string;
  customerJobs: string;
  customerPains: string;
  customerGains: string;
  productsServices: string;
  painRelievers: string;
  gainCreators: string;
}

interface CanvasRisk {
  ideaId: string;
  assumptions: string;
  criticalRisks: string;
  mitigationPlan: string;
}

const DEFAULT_SHORTLISTED = [
  { id: 'raw_1', name: 'AI-Powered SME Compliance Auditor' },
  { id: 'raw_2', name: 'B2B Contract Trust Verification Engine' },
  { id: 'raw_3', name: 'Legal Document Risk Analyzer' }
];

export default function Task17Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput, completedTasks } = useGarage();

  const isTask16Complete = completedTasks.includes(16);

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

  // --- Task 17 States ---
  const [activeTab, setActiveTab] = useState(1);
  const [selectedIdeaIdState, setSelectedIdeaId] = useState<string>('');

  const selectedIdeaId = shortlistedIdeas.some(x => x.ideaId === selectedIdeaIdState)
    ? selectedIdeaIdState
    : (shortlistedIdeas[0]?.ideaId || '');

  // 1. BMC Canvases
  const [canvases, setCanvases] = useState<BMCCanvas[]>(() => {
    const raw = getTaskInput(17, 'businessModelCanvases');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return shortlistedIdeas.map(idea => ({
      ideaId: idea.ideaId,
      keyPartners: 'Regional accounting platforms (Xero/QuickBooks), Audit associations, legal advisors.',
      keyActivities: 'Continuous compliance algorithm updates, cloud server maintenance, user support.',
      keyResources: 'Compliance audit code repositories, secure API gateways, founder advisory credentials.',
      valuePropositions: 'Real-time transaction compliance auditing for SMEs at 10% of consulting fees.',
      customerRelationships: 'Automated digital onboarding dashboards, automated weekly alert notifications.',
      channels: 'Direct online channel, accounting plugin directory marketplaces, Slack workflows integration.',
      customerSegments: 'High-growth SME leaders, fintech startup founders, e-commerce ops directors.',
      costStructure: 'Hosting infrastructure charges, API connection limits, expert QA adviser payouts.',
      revenueStreams: 'Subscription tier packages starting from $99/month, transaction spot audit commission.'
    }));
  });

  // 2. VPC Canvases
  const [vpcs, setVpcs] = useState<VPCCanvas[]>(() => {
    const raw = getTaskInput(17, 'valuePropositionCanvases');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return shortlistedIdeas.map(idea => ({
      ideaId: idea.ideaId,
      customerJobs: 'Verify bookkeeping records, maintain compliance before auditor reviews.',
      customerPains: 'High hourly cost of accountants, delayed audits, risk of regulatory fines.',
      customerGains: 'Instant review confirmation, reduced audit preparation weeks, complete data security.',
      productsServices: 'Continuous database crawler audit dashboard, compliance seal certification.',
      painRelievers: 'Automate error checks, outline risk levels, reduce billable auditor review hours.',
      gainCreators: 'Generate verified export files, live audit alerts, automated badge generation.'
    }));
  });

  // 3. Canvas Risks
  const [risks, setRisks] = useState<CanvasRisk[]>(() => {
    const raw = getTaskInput(17, 'canvasRisks');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return shortlistedIdeas.map(idea => ({
      ideaId: idea.ideaId,
      assumptions: 'Accounting systems provide reliable transaction logs, users trust automated scores.',
      criticalRisks: 'API outages, false positives, legal liability for miss-classified items.',
      mitigationPlan: 'Incorporate expert-in-the-loop overrides, secure comprehensive liability insurance.'
    }));
  });

  // Sync state values on changes
  const saveAll = React.useCallback(() => {
    setTaskInput(17, 'businessModelCanvases', JSON.stringify(canvases));
    setTaskInput(17, 'valuePropositionCanvases', JSON.stringify(vpcs));
    setTaskInput(17, 'canvasRisks', JSON.stringify(risks));

    // Compile markdown canvases comparison report
    const mdLines: string[] = [
      '# Business Model Canvases Report',
      ''
    ];

    shortlistedIdeas.forEach(idea => {
      const name = getIdeaName(idea.ideaId);
      const bmc = canvases.find(c => c.ideaId === idea.ideaId);
      const vpc = vpcs.find(v => v.ideaId === idea.ideaId);
      const rsk = risks.find(r => r.ideaId === idea.ideaId);
      if (bmc && vpc) {
        mdLines.push(`## Business Model Canvas: ${name}`);
        mdLines.push(`- **Key Partners:** ${bmc.keyPartners}`);
        mdLines.push(`- **Key Activities:** ${bmc.keyActivities}`);
        mdLines.push(`- **Key Resources:** ${bmc.keyResources}`);
        mdLines.push(`- **Value Propositions:** ${bmc.valuePropositions}`);
        mdLines.push(`- **Customer Relationships:** ${bmc.customerRelationships}`);
        mdLines.push(`- **Channels:** ${bmc.channels}`);
        mdLines.push(`- **Customer Segments:** ${bmc.customerSegments}`);
        mdLines.push(`- **Cost Structure:** ${bmc.costStructure}`);
        mdLines.push(`- **Revenue Streams:** ${bmc.revenueStreams}`);
        mdLines.push('');
        mdLines.push(`### Value Proposition Canvas: ${name}`);
        mdLines.push(`- **Customer Jobs:** ${vpc.customerJobs}`);
        mdLines.push(`- **Customer Pains:** ${vpc.customerPains}`);
        mdLines.push(`- **Customer Gains:** ${vpc.customerGains}`);
        mdLines.push(`- **Products & Services:** ${vpc.productsServices}`);
        mdLines.push(`- **Pain Relievers:** ${vpc.painRelievers}`);
        mdLines.push(`- **Gain Creators:** ${vpc.gainCreators}`);
        mdLines.push('');
        mdLines.push(`### Risk & Mitigation Strategy: ${name}`);
        mdLines.push(`- **Assumptions:** ${rsk?.assumptions || '—'}`);
        mdLines.push(`- **Critical Risks:** ${rsk?.criticalRisks || '—'}`);
        mdLines.push(`- **Mitigation Plan:** ${rsk?.mitigationPlan || '—'}`);
        mdLines.push('');
      }
    });

    setTaskInput(17, 'notes', mdLines.join('\n'));
    setTaskInput(17, 'deliverable', 'Business Model Canvas (per idea)');
  }, [canvases, vpcs, risks, shortlistedIdeas, setTaskInput]);

  useEffect(() => {
    saveAll();
  }, [saveAll]);

  const currentBMC = useMemo(() => canvases.find(c => c.ideaId === selectedIdeaId) || canvases[0], [canvases, selectedIdeaId]);
  const currentVPC = useMemo(() => vpcs.find(v => v.ideaId === selectedIdeaId) || vpcs[0], [vpcs, selectedIdeaId]);
  const currentRisk = useMemo(() => risks.find(r => r.ideaId === selectedIdeaId) || risks[0], [risks, selectedIdeaId]);

  const updateBMCBlock = (field: keyof BMCCanvas, val: string) => {
    setCanvases(prev => prev.map(c => c.ideaId === selectedIdeaId ? { ...c, [field]: val } : c));
  };

  const updateVPCBlock = (field: keyof VPCCanvas, val: string) => {
    setVpcs(prev => prev.map(v => v.ideaId === selectedIdeaId ? { ...v, [field]: val } : v));
  };

  const updateRiskBlock = (field: keyof CanvasRisk, val: string) => {
    setRisks(prev => prev.map(r => r.ideaId === selectedIdeaId ? { ...r, [field]: val } : r));
  };

  const handleComplete = () => {
    saveAll();
    completeTask(17);
    router.push('/tasks');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 text-white animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-8">
        <div>
          <div className="text-[#B4F052] text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Layers size={12} />
            Task 17 Redesign
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Compare Using Business Model Canvases</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Describe, visualize, and compare the strategic logic for each shortlisted model. Map customer value pools side-by-side.
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
              <span className="ml-1 text-white font-medium">Beginner (~6h)</span>
            </div>
          </div>
          <div>
            <div className="text-white/40 mb-0.5">Shortlist Count</div>
            <div className="text-white font-semibold">{shortlistedIdeas.length} Shortlisted</div>
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
              { id: 1, label: '1. Business Model Canvas' },
              { id: 2, label: '2. Value Proposition Canvas' },
              { id: 3, label: '3. Canvas Risk Mapping' },
              { id: 4, label: '4. Side-by-Side Comparison' }
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
            {/* Step 1: Business Model Canvas Grid */}
            {activeTab === 1 && currentBMC && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base font-bold text-[#B4F052]">Business Model Canvas</h3>
                  <span className="text-xs text-white/40">Visualizing structural logic</span>
                </div>

                <div className="grid grid-cols-5 gap-3 text-[11px]">
                  {/* Partners */}
                  <div className="col-span-1 row-span-2 p-3 rounded-lg bg-white/[0.01] border border-white/[0.06] space-y-1">
                    <span className="font-bold text-[#B4F052]/80">Key Partners</span>
                    <textarea value={currentBMC.keyPartners} onChange={e => updateBMCBlock('keyPartners', e.target.value)} className="w-full h-[120px] bg-transparent resize-none focus:outline-none" />
                  </div>
                  {/* Activities */}
                  <div className="col-span-1 p-3 rounded-lg bg-white/[0.01] border border-white/[0.06] space-y-1">
                    <span className="font-bold text-[#B4F052]/80">Key Activities</span>
                    <textarea value={currentBMC.keyActivities} onChange={e => updateBMCBlock('keyActivities', e.target.value)} className="w-full h-[50px] bg-transparent resize-none focus:outline-none" />
                  </div>
                  {/* Value Prop */}
                  <div className="col-span-1 row-span-2 p-3 rounded-lg bg-white/[0.02] border border-[#B4F052]/20 space-y-1">
                    <span className="font-bold text-[#B4F052] block mb-1">Value Propositions</span>
                    <textarea value={currentBMC.valuePropositions} onChange={e => updateBMCBlock('valuePropositions', e.target.value)} className="w-full h-[120px] bg-transparent resize-none font-medium focus:outline-none" />
                  </div>
                  {/* Relations */}
                  <div className="col-span-1 p-3 rounded-lg bg-white/[0.01] border border-white/[0.06] space-y-1">
                    <span className="font-bold text-[#B4F052]/80">Relationships</span>
                    <textarea value={currentBMC.customerRelationships} onChange={e => updateBMCBlock('customerRelationships', e.target.value)} className="w-full h-[50px] bg-transparent resize-none focus:outline-none" />
                  </div>
                  {/* Segments */}
                  <div className="col-span-1 row-span-2 p-3 rounded-lg bg-white/[0.01] border border-white/[0.06] space-y-1">
                    <span className="font-bold text-[#B4F052]/80">Customer Segments</span>
                    <textarea value={currentBMC.customerSegments} onChange={e => updateBMCBlock('customerSegments', e.target.value)} className="w-full h-[120px] bg-transparent resize-none focus:outline-none" />
                  </div>

                  {/* Second Row for center columns */}
                  <div className="col-span-1 p-3 rounded-lg bg-white/[0.01] border border-white/[0.06] space-y-1">
                    <span className="font-bold text-[#B4F052]/80">Key Resources</span>
                    <textarea value={currentBMC.keyResources} onChange={e => updateBMCBlock('keyResources', e.target.value)} className="w-full h-[50px] bg-transparent resize-none focus:outline-none" />
                  </div>
                  <div className="col-span-1 p-3 rounded-lg bg-white/[0.01] border border-white/[0.06] space-y-1">
                    <span className="font-bold text-[#B4F052]/80">Channels</span>
                    <textarea value={currentBMC.channels} onChange={e => updateBMCBlock('channels', e.target.value)} className="w-full h-[50px] bg-transparent resize-none focus:outline-none" />
                  </div>

                  {/* Cost & Revenue */}
                  <div className="col-span-2.5 p-3 rounded-lg bg-white/[0.01] border border-white/[0.06] space-y-1">
                    <span className="font-bold text-[#B4F052]/80">Cost Structure</span>
                    <textarea value={currentBMC.costStructure} onChange={e => updateBMCBlock('costStructure', e.target.value)} className="w-full h-[55px] bg-transparent resize-none focus:outline-none" />
                  </div>
                  <div className="col-span-2.5 p-3 rounded-lg bg-white/[0.01] border border-white/[0.06] space-y-1">
                    <span className="font-bold text-[#B4F052]/80">Revenue Streams</span>
                    <textarea value={currentBMC.revenueStreams} onChange={e => updateBMCBlock('revenueStreams', e.target.value)} className="w-full h-[55px] bg-transparent resize-none focus:outline-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Value Proposition Canvas */}
            {activeTab === 2 && currentVPC && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#B4F052] mb-1">Value Proposition Canvas</h3>
                  <p className="text-xs text-white/60">Fit core offering with target customer jobs, pains, and gains.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Customer Profile */}
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.06] space-y-3">
                    <span className="text-xs font-extrabold text-[#B4F052] block border-b border-white/[0.06] pb-1">Customer Profile</span>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] text-white/40 block mb-0.5">Customer Jobs</label>
                        <textarea value={currentVPC.customerJobs} onChange={e => updateVPCBlock('customerJobs', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded p-2" rows={2} />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/40 block mb-0.5">Customer Pains</label>
                        <textarea value={currentVPC.customerPains} onChange={e => updateVPCBlock('customerPains', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded p-2" rows={2} />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/40 block mb-0.5">Customer Gains</label>
                        <textarea value={currentVPC.customerGains} onChange={e => updateVPCBlock('customerGains', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded p-2" rows={2} />
                      </div>
                    </div>
                  </div>

                  {/* Value Map */}
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.06] space-y-3">
                    <span className="text-xs font-extrabold text-[#B4F052] block border-b border-white/[0.06] pb-1">Value Map</span>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] text-white/40 block mb-0.5">Products & Services</label>
                        <textarea value={currentVPC.productsServices} onChange={e => updateVPCBlock('productsServices', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded p-2" rows={2} />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/40 block mb-0.5">Pain Relievers</label>
                        <textarea value={currentVPC.painRelievers} onChange={e => updateVPCBlock('painRelievers', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded p-2" rows={2} />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/40 block mb-0.5">Gain Creators</label>
                        <textarea value={currentVPC.gainCreators} onChange={e => updateVPCBlock('gainCreators', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded p-2" rows={2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Canvas Risks */}
            {activeTab === 3 && currentRisk && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#B4F052] mb-1">Canvas Risk Mapping</h3>
                  <p className="text-xs text-white/60">Identify critical validation points and key assumptions.</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#B4F052] block font-bold">Key Assumptions to Validate</label>
                      <textarea
                        value={currentRisk.assumptions}
                        onChange={e => updateRiskBlock('assumptions', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-rose-400 block font-bold">Critical Risks Identified</label>
                      <textarea
                        value={currentRisk.criticalRisks}
                        onChange={e => updateRiskBlock('criticalRisks', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-rose-300"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 block">Mitigation Plan</label>
                      <textarea
                        value={currentRisk.mitigationPlan}
                        onChange={e => updateRiskBlock('mitigationPlan', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Side-by-Side Comparison */}
            {activeTab === 4 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#B4F052]">Business Model Canvas Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-white/40">
                        <th className="py-2 pr-4">Idea</th>
                        <th className="py-2 pr-4">Value Proposition</th>
                        <th className="py-2 pr-4">Channel strategy</th>
                        <th className="py-2 pr-4">Revenue Structure</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shortlistedIdeas.map(idea => {
                        const bmc = canvases.find(c => c.ideaId === idea.ideaId);
                        return (
                          <tr key={idea.ideaId} className="border-b border-white/[0.04] hover:bg-white/[0.01]">
                            <td className="py-3 pr-4 font-bold text-[#B4F052]">{getIdeaName(idea.ideaId)}</td>
                            <td className="py-3 pr-4 text-white/80">{bmc?.valuePropositions}</td>
                            <td className="py-3 pr-4 text-white/60 font-mono text-[10px]">{bmc?.channels}</td>
                            <td className="py-3 pr-4 text-white/70">{bmc?.revenueStreams}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Preview Panel */}
        <div className="space-y-6">
          {/* Active Canvas Quick stats */}
          <div className="glass-card p-4 border border-white/[0.08] space-y-3">
            <span className="text-xs font-bold text-white/40 block uppercase">Canvas Health Overview</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Value Proposition Fit</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1"><Check size={12} /> Complete</span>
              </div>
              <div className="flex justify-between">
                <span>Revenue Validation</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1"><Check size={12} /> Defined</span>
              </div>
              <div className="flex justify-between">
                <span>Partner Connections</span>
                <span className="text-[#B4F052] font-semibold">Ready</span>
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
              Save Canvas Draft
            </button>
            <button
              onClick={handleComplete}
              className="w-full py-3 rounded-xl bg-[#B4F052] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 hover:opacity-95 transition-all shadow-md shadow-[#B4F052]/10"
            >
              Complete Task 17 and continue
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
