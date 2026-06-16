'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, ArrowRight, Layers, Star, AlertTriangle, Sparkles, Save, Info, Bookmark, HelpCircle } from 'lucide-react';
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

interface TenTypesAnalysis {
  ideaId: string;
  configuration: {
    profitModel: string;
    network: string;
    structure: string;
    process: string;
  };
  offering: {
    productPerformance: string;
    productSystem: string;
  };
  experience: {
    service: string;
    channel: string;
    brand: string;
    customerEngagement: string;
  };
}

interface StrongestLever {
  ideaId: string;
  innovationType: string;
  whyItMatters: string;
  howItCreatesDifferentiation: string;
  whatMustBeTrue: string;
  riskOrUncertainty: string;
}

interface InnovationScore {
  ideaId: string;
  innovationDepth: number;
  differentiationPotential: number;
  customerValue: number;
  businessModelStrength: number;
  executionFeasibility: number;
  horizonAlignment: number;
  strategicCoherence: number;
  totalScore: number;
}

interface WeakArea {
  ideaId: string;
  weakOrMissingTypes: string[];
  isThisAProblem: string;
  overDependencyOnSingleLever: string;
  whatToInvestigateInTask16: string;
}

const DEFAULT_SHORTLISTED = [
  { id: 'raw_1', name: 'AI-Powered SME Compliance Auditor', desc: 'Automatically audit financial transactions against regional tax regulations.' },
  { id: 'raw_2', name: 'B2B Contract Trust Verification Engine', desc: 'Smart contracts coupled with AI to verify SLA compliance and trust rules.' },
  { id: 'raw_3', name: 'Legal Document Risk Analyzer', desc: 'Scan legal agreements for high-risk clauses and suggest safer alternatives.' }
];

const TEN_TYPES_CATALOG = {
  configuration: [
    { name: 'Profit Model', desc: 'How you make money. Examples: Subscriptions, usage-based pricing, freemium models.', question: 'How can we generate recurring, high-margin revenues?', trap: 'Relying on one-time payments for a continuous service.' },
    { name: 'Network', desc: 'Value-creating partnerships. Examples: Integrations, expert networks, data exchange alliances.', question: 'Who can we partner with to instantly add trust or value?', trap: 'Building everything from scratch without partner leverage.' },
    { name: 'Structure', desc: 'Organizing physical, human, or intellectual assets. Examples: Solo founder + AI teams, outsourced experts.', question: 'How can we organize our talent and tools to cut overhead?', trap: 'Hiring heavy full-time headcount before product-market fit.' },
    { name: 'Process', desc: 'Automating or optimizing workflows. Examples: AI auto-drafts, automated compliance checkers.', question: 'What manual processes can be automated or run 10x faster?', trap: 'Using human agents for repetitive tasks that AI can resolve.' }
  ],
  offering: [
    { name: 'Product Performance', desc: 'Core product features & speed. Examples: Real-time analysis, instant compliance scores.', question: 'How can our core product perform faster or more accurately?', trap: 'Over-indexing on features that customers do not value.' },
    { name: 'Product System', desc: 'Complementary tools & ecosystems. Examples: Templates, checklist modules, API integration layer.', question: 'How can we connect multiple tools into a cohesive product suite?', trap: 'Offering a single point tool that is easily copied.' }
  ],
  experience: [
    { name: 'Service', desc: 'Support and customer success. Examples: Hybrid expert reviews, guided onboarding walkthroughs.', question: 'How can we support users before, during, and after value delivery?', trap: 'Assuming users will self-onboard onto complex regulatory tools.' },
    { name: 'Channel', desc: 'How you reach buyers. Examples: Embedded billing systems, Slack-app integrations, HR portals.', question: 'How can we reach customers in their existing workflows?', trap: 'Forcing customers to log into another external portal.' },
    { name: 'Brand', desc: 'Trust, identity, and movement. Examples: Verified Compliance Badges, Certifications.', question: 'What trust symbol can we create for our users?', trap: 'Generic styling that fails to establish authority.' },
    { name: 'Customer Engagement', desc: 'Interactive elements and habit-building. Examples: Active notifications, cash-runway alerts.', question: 'How do we design returning loops to make this a daily habit?', trap: 'Spamming notifications without providing value.' }
  ]
};

export default function Task15Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput, completedTasks } = useGarage();

  const isTask14Complete = completedTasks.includes(14);

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
    // Overwrite with imported if matching
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

  // --- Task 15 States ---
  const [activeTab, setActiveTab] = useState(1);

  // 1. 10 Types Analysis
  const [analysis, setAnalysis] = useState<TenTypesAnalysis[]>(() => {
    const raw = getTaskInput(15, 'tenTypesAnalysis');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return shortlistedIdeas.map(idea => ({
      ideaId: idea.ideaId,
      configuration: {
        profitModel: 'Subscription tier based on transaction volume, plus a 1% certification success commission.',
        network: 'Integrate directly with regional accounting APIs (Xero/QuickBooks) and legal advisory firms.',
        structure: 'Solo founder + AI workflow agent infrastructure. Outsourced expert network on-demand.',
        process: 'Leverage auto-clustering AI pipelines to categorize transactions without human reviewers.'
      },
      offering: {
        productPerformance: 'Real-time classification audits taking under 3 seconds per check.',
        productSystem: 'A compliance suite including audit history logging, policy templates, and PDF exporter.'
      },
      experience: {
        service: 'On-demand human expert QA checks for flagged high-risk anomalies.',
        channel: 'Embedded direct-billing dashboard within client accounting tools.',
        brand: 'The Certified Compliant Seal badge for client email footers.',
        customerEngagement: 'Weekly compliance diagnostics emailed directly to the CFO.'
      }
    }));
  });

  // 2. Strongest Levers
  const [levers, setLevers] = useState<StrongestLever[]>(() => {
    const raw = getTaskInput(15, 'strongestInnovationLevers');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return shortlistedIdeas.map(idea => ({
      ideaId: idea.ideaId,
      innovationType: 'Process',
      whyItMatters: 'Using AI to automate compliance reviews entirely cuts out lawyer billable hours.',
      howItCreatesDifferentiation: 'No other platform offers instant, fully automated checks at this price point.',
      whatMustBeTrue: 'AI models maintain an accuracy rating above 98.5%.',
      riskOrUncertainty: 'Liability if an automated audit misses a critical compliance error.'
    }));
  });

  // 3. Innovation Scores
  const [scores, setScores] = useState<InnovationScore[]>(() => {
    const raw = getTaskInput(15, 'innovationPotentialScores');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return shortlistedIdeas.map(idea => ({
      ideaId: idea.ideaId,
      innovationDepth: 4,
      differentiationPotential: 4,
      customerValue: 4,
      businessModelStrength: 3,
      executionFeasibility: 4,
      horizonAlignment: 5,
      strategicCoherence: 4,
      totalScore: 28
    }));
  });

  // 4. Weak areas
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>(() => {
    const raw = getTaskInput(15, 'weakInnovationAreas');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return shortlistedIdeas.map(idea => ({
      ideaId: idea.ideaId,
      weakOrMissingTypes: ['Network', 'Structure'],
      isThisAProblem: 'Yes, because without API network integrations, user data insertion remains manual.',
      overDependencyOnSingleLever: 'Over-dependent on Product Performance.',
      whatToInvestigateInTask16: 'Competitor pricing models and APIs available in the market.'
    }));
  });

  // Calculate live scores
  const scoreMap = useMemo(() => {
    const map = new Map<string, number>();
    scores.forEach(s => {
      const tot = s.innovationDepth + s.differentiationPotential + s.customerValue + s.businessModelStrength + s.executionFeasibility + s.horizonAlignment + s.strategicCoherence;
      map.set(s.ideaId, tot);
    });
    return map;
  }, [scores]);

  // Sync state values on changes
  const saveAll = React.useCallback(() => {
    setTaskInput(15, 'tenTypesAnalysis', JSON.stringify(analysis));
    setTaskInput(15, 'strongestInnovationLevers', JSON.stringify(levers));
    setTaskInput(15, 'innovationPotentialScores', JSON.stringify(scores));
    setTaskInput(15, 'weakInnovationAreas', JSON.stringify(weakAreas));

    // Compile markdown opportunity matrix
    const mdLines: string[] = [
      '# Innovation Opportunity Matrix',
      '',
      '## 10 Types of Innovation Analysis per Idea',
      ''
    ];

    shortlistedIdeas.forEach(idea => {
      const name = getIdeaName(idea.ideaId);
      const ana = analysis.find(a => a.ideaId === idea.ideaId);
      const lev = levers.find(l => l.ideaId === idea.ideaId);
      const scoreVal = scoreMap.get(idea.ideaId) || 0;
      if (ana) {
        mdLines.push(`### Idea: ${name} (Innovation Score: ${scoreVal})`);
        mdLines.push(`- **Profit Model Strategy:** ${ana.configuration.profitModel}`);
        mdLines.push(`- **Network strategy:** ${ana.configuration.network}`);
        mdLines.push(`- **Process Automation:** ${ana.configuration.process}`);
        mdLines.push(`- **Product System:** ${ana.offering.productSystem}`);
        mdLines.push(`- **Channel Delivery:** ${ana.experience.channel}`);
        mdLines.push(`- **Strongest Innovation Lever:** ${lev?.innovationType || 'Process'} (${lev?.whyItMatters || ''})`);
        mdLines.push('');
      }
    });

    setTaskInput(15, 'notes', mdLines.join('\n'));
    setTaskInput(15, 'deliverable', 'Innovation Opportunity Matrix');
  }, [analysis, levers, scores, weakAreas, shortlistedIdeas, scoreMap, setTaskInput]);

  useEffect(() => {
    saveAll();
  }, [saveAll]);

  const handleComplete = () => {
    saveAll();
    completeTask(15);
    router.push('/tasks');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 text-white animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-8">
        <div>
          <div className="text-[#B4F052] text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Layers size={12} />
            Task 15 Redesign
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Compare How to Innovate (10 Types)</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Analyze each shortlisted idea through Doblin&apos;s framework to identify configuration, offering, and experience differentiation.
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
              { id: 1, label: '1. Shortlist Overview' },
              { id: 2, label: '2. 10 Types Guide' },
              { id: 3, label: '3. Configuration' },
              { id: 4, label: '4. Offering & Experience' },
              { id: 5, label: '5. Strongest Levers' },
              { id: 6, label: '6. Score & Compare' }
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
            {/* Step 1: Shortlist Overview */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#B4F052]">Shortlisted Ideas from Task 14</h3>
                <div className="space-y-3">
                  {shortlistedIdeas.map((idea, idx) => (
                    <div key={idea.ideaId} className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
                      <h4 className="text-sm font-bold text-white mb-2">{idx+1}. {getIdeaName(idea.ideaId)}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-white/70">
                        <div>
                          <span className="text-white/40 block mb-0.5">Key Assumption</span>
                          <p>{idea.keyAssumption}</p>
                        </div>
                        <div>
                          <span className="text-white/40 block mb-0.5">Biggest Risk</span>
                          <p className="text-rose-300">{idea.biggestRisk}</p>
                        </div>
                        <div>
                          <span className="text-white/40 block mb-0.5">Strategic Selection Rationale</span>
                          <p>{idea.whyShortlisted}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: 10 Types Catalog */}
            {activeTab === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#B4F052] mb-1">The 10 Types of Innovation Catalog</h3>
                  <p className="text-xs text-white/60">A structured framework to design defensible business models.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Configuration */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-[#B4F052]/80 border-b border-white/[0.08] pb-1 block">Configuration (Back-End)</span>
                    {TEN_TYPES_CATALOG.configuration.map(t => (
                      <div key={t.name} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] text-xs space-y-1">
                        <span className="font-bold text-white block">{t.name}</span>
                        <p className="text-white/60 text-[11px]">{t.desc}</p>
                        <p className="text-[10px] text-[#B4F052] italic">Ask: {t.question}</p>
                      </div>
                    ))}
                  </div>

                  {/* Offering */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-[#B4F052]/80 border-b border-white/[0.08] pb-1 block">Offering (Core)</span>
                    {TEN_TYPES_CATALOG.offering.map(t => (
                      <div key={t.name} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] text-xs space-y-1">
                        <span className="font-bold text-white block">{t.name}</span>
                        <p className="text-white/60 text-[11px]">{t.desc}</p>
                        <p className="text-[10px] text-[#B4F052] italic">Ask: {t.question}</p>
                      </div>
                    ))}
                  </div>

                  {/* Experience */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-[#B4F052]/80 border-b border-white/[0.08] pb-1 block">Experience (Front-End)</span>
                    {TEN_TYPES_CATALOG.experience.map(t => (
                      <div key={t.name} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] text-xs space-y-1">
                        <span className="font-bold text-white block">{t.name}</span>
                        <p className="text-white/60 text-[11px]">{t.desc}</p>
                        <p className="text-[10px] text-[#B4F052] italic">Ask: {t.question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Configuration Analysis */}
            {activeTab === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#B4F052] mb-1">Configuration Innovation</h3>
                  <p className="text-xs text-white/60">How the business operates behind the scenes.</p>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {analysis.map((idea, idx) => (
                    <div key={idea.ideaId} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                      <h4 className="text-sm font-bold text-white">{idx+1}. {getIdeaName(idea.ideaId)}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">Profit Model Strategy</label>
                          <textarea
                            value={idea.configuration.profitModel}
                            onChange={e => setAnalysis(prev => prev.map(a => a.ideaId === idea.ideaId ? { ...a, configuration: { ...a.configuration, profitModel: e.target.value } } : a))}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">Network & Partnerships</label>
                          <textarea
                            value={idea.configuration.network}
                            onChange={e => setAnalysis(prev => prev.map(a => a.ideaId === idea.ideaId ? { ...a, configuration: { ...a.configuration, network: e.target.value } } : a))}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">Structure / Resource Setup</label>
                          <textarea
                            value={idea.configuration.structure}
                            onChange={e => setAnalysis(prev => prev.map(a => a.ideaId === idea.ideaId ? { ...a, configuration: { ...a.configuration, structure: e.target.value } } : a))}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">Process / Automation Workflow</label>
                          <textarea
                            value={idea.configuration.process}
                            onChange={e => setAnalysis(prev => prev.map(a => a.ideaId === idea.ideaId ? { ...a, configuration: { ...a.configuration, process: e.target.value } } : a))}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Offering & Experience Analysis */}
            {activeTab === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#B4F052] mb-1">Offering & Experience Innovation</h3>
                  <p className="text-xs text-white/60">How the product performs and how customers interface with it.</p>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {analysis.map((idea, idx) => (
                    <div key={idea.ideaId} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                      <h4 className="text-sm font-bold text-white border-b border-white/[0.04] pb-1">{idx+1}. {getIdeaName(idea.ideaId)}</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {/* Offering */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold text-[#B4F052] block uppercase tracking-wider">Offering</span>
                          <div className="space-y-1">
                            <label className="text-[10px] text-white/40 block">Product Performance</label>
                            <textarea
                              value={idea.offering.productPerformance}
                              onChange={e => setAnalysis(prev => prev.map(a => a.ideaId === idea.ideaId ? { ...a, offering: { ...a.offering, productPerformance: e.target.value } } : a))}
                              className="w-full px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-white/40 block">Product System</label>
                            <textarea
                              value={idea.offering.productSystem}
                              onChange={e => setAnalysis(prev => prev.map(a => a.ideaId === idea.ideaId ? { ...a, offering: { ...a.offering, productSystem: e.target.value } } : a))}
                              className="w-full px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                              rows={2}
                            />
                          </div>
                        </div>

                        {/* Experience */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold text-[#B4F052] block uppercase tracking-wider">Experience</span>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[10px] text-white/40 block">Service</label>
                              <input
                                type="text"
                                value={idea.experience.service}
                                onChange={e => setAnalysis(prev => prev.map(a => a.ideaId === idea.ideaId ? { ...a, experience: { ...a.experience, service: e.target.value } } : a))}
                                className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-[11px]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-white/40 block">Channel</label>
                              <input
                                type="text"
                                value={idea.experience.channel}
                                onChange={e => setAnalysis(prev => prev.map(a => a.ideaId === idea.ideaId ? { ...a, experience: { ...a.experience, channel: e.target.value } } : a))}
                                className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-[11px]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-white/40 block">Brand</label>
                              <input
                                type="text"
                                value={idea.experience.brand}
                                onChange={e => setAnalysis(prev => prev.map(a => a.ideaId === idea.ideaId ? { ...a, experience: { ...a.experience, brand: e.target.value } } : a))}
                                className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-[11px]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-white/40 block">Engagement</label>
                              <input
                                type="text"
                                value={idea.experience.customerEngagement}
                                onChange={e => setAnalysis(prev => prev.map(a => a.ideaId === idea.ideaId ? { ...a, experience: { ...a.experience, customerEngagement: e.target.value } } : a))}
                                className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-[11px]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Strongest Levers */}
            {activeTab === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#B4F052] mb-1">Strongest Innovation Levers</h3>
                  <p className="text-xs text-white/60">Identify the top 2-3 innovation levers that drive differentiation.</p>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {levers.map((lever, idx) => (
                    <div key={lever.ideaId} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 text-xs">
                      <h4 className="text-sm font-bold text-white">{idx+1}. {getIdeaName(lever.ideaId)}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-[#B4F052] block mb-1">Primary Innovation Type</label>
                          <select
                            value={lever.innovationType}
                            onChange={e => setLevers(prev => prev.map(l => l.ideaId === lever.ideaId ? { ...l, innovationType: e.target.value } : l))}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-1.5 text-white"
                          >
                            <option value="Profit Model">Profit Model</option>
                            <option value="Network">Network</option>
                            <option value="Structure">Structure</option>
                            <option value="Process">Process</option>
                            <option value="Product Performance">Product Performance</option>
                            <option value="Product System">Product System</option>
                            <option value="Service">Service</option>
                            <option value="Channel">Channel</option>
                            <option value="Brand">Brand</option>
                            <option value="Customer Engagement">Customer Engagement</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">Why it matters</label>
                          <input
                            type="text"
                            value={lever.whyItMatters}
                            onChange={e => setLevers(prev => prev.map(l => l.ideaId === lever.ideaId ? { ...l, whyItMatters: e.target.value } : l))}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-1.5"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">How it creates differentiation</label>
                          <input
                            type="text"
                            value={lever.howItCreatesDifferentiation}
                            onChange={e => setLevers(prev => prev.map(l => l.ideaId === lever.ideaId ? { ...l, howItCreatesDifferentiation: e.target.value } : l))}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-1.5"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">What must be true / Risks</label>
                          <input
                            type="text"
                            value={lever.riskOrUncertainty}
                            onChange={e => setLevers(prev => prev.map(l => l.ideaId === lever.ideaId ? { ...l, riskOrUncertainty: e.target.value } : l))}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Score & Compare */}
            {activeTab === 6 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-[#B4F052]">Evaluate Innovation Scores</h3>
                  <span className="text-xs text-white/40">Compares strength across shortlist</span>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {scores.map((scoreCard, idx) => (
                    <div key={scoreCard.ideaId} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4 text-xs">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-white">{idx+1}. {getIdeaName(scoreCard.ideaId)}</h4>
                        <div className="text-sm font-extrabold text-[#B4F052] bg-[#B4F052]/10 px-3 py-1 rounded-lg">
                          Innovation Total: {scoreMap.get(scoreCard.ideaId) || 0} / 35
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                        {([
                          { label: 'Depth', key: 'innovationDepth' },
                          { label: 'Diff.', key: 'differentiationPotential' },
                          { label: 'Cust. Value', key: 'customerValue' },
                          { label: 'Monetization', key: 'businessModelStrength' },
                          { label: 'Feasibility', key: 'executionFeasibility' },
                          { label: 'Horizon Fit', key: 'horizonAlignment' },
                          { label: 'Coherence', key: 'strategicCoherence' },
                        ] as Array<{ label: string; key: keyof InnovationScore }>).map(c => (
                          <div key={c.label} className="space-y-1">
                            <label className="text-[10px] text-white/40 block text-center">{c.label}</label>
                            <select
                              value={scoreCard[c.key] as number}
                              onChange={e => setScores(prev => prev.map(s => s.ideaId === scoreCard.ideaId ? ({ ...s, [c.key]: parseInt(e.target.value) } as InnovationScore) : s))}
                              className="w-full bg-white/[0.02] border border-white/[0.08] px-2 py-1 rounded text-center text-white"
                            >
                              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>

                      {/* Weak areas inputs */}
                      <div className="border-t border-white/[0.04] pt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 block">Is this over-dependent on a single lever?</label>
                          <input
                            type="text"
                            value={weakAreas.find(w => w.ideaId === scoreCard.ideaId)?.overDependencyOnSingleLever || ''}
                            onChange={e => setWeakAreas(prev => prev.map(w => w.ideaId === scoreCard.ideaId ? { ...w, overDependencyOnSingleLever: e.target.value } : w))}
                            className="w-full bg-white/[0.02] border border-white/[0.08] rounded px-3 py-1"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 block">What should we investigate in Task 16?</label>
                          <input
                            type="text"
                            value={weakAreas.find(w => w.ideaId === scoreCard.ideaId)?.whatToInvestigateInTask16 || ''}
                            onChange={e => setWeakAreas(prev => prev.map(w => w.ideaId === scoreCard.ideaId ? { ...w, whatToInvestigateInTask16: e.target.value } : w))}
                            className="w-full bg-white/[0.02] border border-white/[0.08] rounded px-3 py-1"
                          />
                        </div>
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
          {/* Opportunity Matrix Preview */}
          <div className="glass-card p-4 border border-white/[0.08] space-y-3 bg-black/40">
            <span className="text-xs font-bold text-white/40 block uppercase">Innovation Opportunity Map</span>
            <div className="space-y-2.5">
              {shortlistedIdeas.map((idea, idx) => {
                const name = getIdeaName(idea.ideaId);
                const scoreVal = scoreMap.get(idea.ideaId) || 0;
                const lev = levers.find(l => l.ideaId === idea.ideaId);
                return (
                  <div key={idea.ideaId} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-[#B4F052]">{name}</span>
                      <span className="text-[10px] bg-[#B4F052]/15 text-[#B4F052] px-2 py-0.5 rounded font-mono">{scoreVal} pts</span>
                    </div>
                    <div className="text-[10px] text-white/50 flex justify-between">
                      <span>Lever: {lev?.innovationType || 'Process'}</span>
                      <span className="text-rose-400">Risk: Moderate</span>
                    </div>
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
              Save Innovation Matrix
            </button>
            <button
              onClick={handleComplete}
              className="w-full py-3 rounded-xl bg-[#B4F052] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 hover:opacity-95 transition-all shadow-md shadow-[#B4F052]/10"
            >
              Complete Task 15 and continue
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
