'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, ArrowRight, Layers, Star, AlertTriangle, Sparkles, FileText, Save, Info, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PatternCard {
  key: string;
  label: string;
  description: string;
  whenItWorks: string;
  commonTrap: string;
  example: string;
}

const PREDEFINED_PATTERNS: PatternCard[] = [
  { key: 'marketplace', label: 'Marketplace', description: 'Connects fragmented supply and demand.', whenItWorks: 'High fragmentation on both sides; trust is low without intermediary.', commonTrap: 'Chicken-and-egg problem (acquiring supply vs demand).', example: 'Airbnb, Uber' },
  { key: 'platform', label: 'Platform', description: 'Enables others to build, transact, or interact.', whenItWorks: 'Third parties can build valuable add-ons or widgets.', commonTrap: 'Siphoning too much value early, discouraging developers.', example: 'Shopify, iOS App Store' },
  { key: 'subscription', label: 'Subscription', description: 'Recurring payment for continuous access.', whenItWorks: 'High usage frequency; continuous value addition.', commonTrap: 'Subscriber churn if utility drops.', example: 'Netflix, Spotify' },
  { key: 'freemium', label: 'Freemium', description: 'Free tier with premium upsells.', whenItWorks: 'Low marginal cost of serving free users; large addressable market.', commonTrap: 'Giving away too much value for free; low conversion.', example: 'Duolingo, Slack' },
  { key: 'usage_based', label: 'Usage-Based', description: 'Charges based on activity or volume.', whenItWorks: 'Unpredictable user demand; clear cost-of-goods-sold scaling.', commonTrap: 'Unpredictable cash flows for both builder and client.', example: 'AWS, Twilio' },
  { key: 'transaction_fee', label: 'Transaction Fee', description: 'Charges percentage or flat fee per transaction.', whenItWorks: 'Facilitating secure financial exchanges.', commonTrap: 'Users bypassing the platform to transact directly (disintermediation).', example: 'Stripe, PayPal' },
  { key: 'saas', label: 'SaaS', description: 'Software hosted in the cloud, billed periodically.', whenItWorks: 'B2B workflows; multi-user collaboration.', commonTrap: 'Building complex features instead of solving one core problem.', example: 'Salesforce, HubSpot' },
  { key: 'data_network', label: 'Data Network', description: 'Monetizes aggregated data insights.', whenItWorks: 'Proprietary access to high-value data pools.', commonTrap: 'Data privacy and security regulations.', example: 'Kensho, Bloomberg' },
  { key: 'community_led', label: 'Community-Led', description: 'Leverages peer support and contributions.', whenItWorks: 'High user passion; shared learning requirements.', commonTrap: 'Moderation overload or toxic behavior.', example: 'GitHub, StackOverflow' },
  { key: 'bundling_unbundling', label: 'Bundling / Unbundling', description: 'Aggregates or separates services.', whenItWorks: 'Fragmented offerings or bloated legacy platforms.', commonTrap: 'Pricing bundles too high for average consumers.', example: 'Substack, Cable TV' },
  { key: 'managed_service', label: 'Managed Service', description: 'Combines tech with operational support.', whenItWorks: 'High task complexity; customer lacks skills.', commonTrap: 'Low gross margins due to labor intensity.', example: 'Scale AI, ALD Vacuum' },
  { key: 'ai_agentic', label: 'AI-Agentic Service', description: 'AI agents perform work that required humans.', whenItWorks: 'High cognitive repetition; clear API boundaries.', commonTrap: 'Hallucination liability in critical outputs.', example: 'Cognition AI, Harvey' },
  { key: 'infrastructure', label: 'Infrastructure Layer', description: 'Enabling tools for other companies.', whenItWorks: 'Standardizing complex plumbing for a whole sector.', commonTrap: 'Long sales cycles and complex API support.', example: 'Stripe, Twilio' },
  { key: 'education', label: 'Education / Certification', description: 'Monetizes capability development.', whenItWorks: 'New technology shifts requiring professional retraining.', commonTrap: 'Low student completion rates.', example: 'Coursera, Reforge' },
  { key: 'orchestration', label: 'Ecosystem Orchestration', description: 'Coordinates multiple independent actors.', whenItWorks: 'Shared value chains where actors cannot coordinate.', commonTrap: 'Lack of authority or lock-in mechanisms.', example: 'Android, Expedia' }
];

interface ModelExample {
  id: string;
  companyName: string;
  industry: string;
  modelType: string;
  problemSolved: string;
  whoPays: string;
  whoBenefits: string;
  valueExchange: string;
  whyItWorks: string;
  ecosystemEffect: string;
  relevance: string;
}

const PREDEFINED_CASE_TEMPLATES: ModelExample[] = [
  { id: 'stripe', companyName: 'Stripe', industry: 'Fintech', modelType: 'Infrastructure Layer / Transaction Fee', problemSolved: 'Integrating credit card processing was complex.', whoPays: 'Developers & online businesses', whoBenefits: 'End consumers and digital companies', valueExchange: 'Abstracts payment plumbing for a simple API and small transaction cut.', whyItWorks: 'Extreme ease of integration; developer-first branding.', ecosystemEffect: 'Allows thousands of new startups to launch payment systems instantly.', relevance: 'Can we build infrastructure to abstract our market complexity?' },
  { id: 'shopify', companyName: 'Shopify', industry: 'E-commerce', modelType: 'SaaS / Enablement Platform', problemSolved: 'Building an online store required custom coding.', whoPays: 'Independent merchants', whoBenefits: 'Buyers looking for direct-to-consumer items', valueExchange: 'Recurring SaaS subscription fee + marketplace transaction percentages.', whyItWorks: 'Extensive app store ecosystem and templates.', ecosystemEffect: 'Enables developers, designers and logistics companies to earn money.', relevance: 'How could we create an enablement platform for our segment?' },
  { id: ' duolingo', companyName: 'Duolingo', industry: 'Education', modelType: 'Freemium / Mobile App', problemSolved: 'Language learning was expensive and boring.', whoPays: 'Premium subscribers & advertisers', whoBenefits: 'Language learners', valueExchange: 'Bitesize gamified learning for free, ad-free subscription upgrade.', whyItWorks: 'Extreme habit loop gamification and mass accessibility.', ecosystemEffect: 'Lowers barriers to global translation and migration.', relevance: 'Can we gamify learning loops for our target user?' }
];

interface TransferMechanism {
  id: string;
  name: string;
  sourceModel: string;
  whyItWorks: string;
  possibleApplication: string;
  adaptationNeeds: string;
  mainRisk: string;
}

interface Stakeholder {
  id: string;
  name: string;
  category: string;
  role: string;
  valueGive: string;
  valueReceive: string;
  tension: string;
}

export default function Task12Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput, completedTasks } = useGarage();

  const isTask11Complete = completedTasks.includes(11);

  // --- Imported Context from Task 11 ---
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

  const primaryHorizon = getTaskInput(11, 'primaryHorizon') || 'H1';
  const secondaryHorizon = getTaskInput(11, 'secondaryHorizon') || 'none';
  const horizonRationale = getTaskInput(11, 'whyThisHorizon') || 'No rationale stored.';
  const keyAssumptions = getTaskInput(11, 'keyAssumptions') || 'No assumptions logged.';

  // --- Task 12 State ---
  const [activeTab, setActiveTab] = useState<number>(1);

  // Library of Model Examples
  const [library, setLibrary] = useState<ModelExample[]>(() => {
    const raw = getTaskInput(12, 'provenModelLibrary');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [
      {
        id: '1',
        companyName: 'Shopify',
        industry: 'E-commerce',
        modelType: 'Platform',
        problemSolved: 'Hard for small merchants to set up online shops.',
        whoPays: 'Small businesses',
        whoBenefits: 'Buyers',
        valueExchange: 'Infrastructure for transaction cuts and monthly SaaS fees.',
        whyItWorks: 'Enables non-technical people to create professional sites.',
        ecosystemEffect: 'Creates a secondary market for app builders and designers.',
        relevance: 'Can we build infrastructure to simplify workflow setups?'
      }
    ];
  });

  // Deconstruction details
  const [deconstructed, setDeconstructed] = useState<Record<string, Record<string, string>>>(() => {
    const raw = getTaskInput(12, 'deconstructedModels');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return {
      '1': {
        coreMechanism: 'Enablement platform providing turnkey store infrastructure.',
        supplySide: 'App developers, design templates, shipping vendors.',
        demandSide: 'Merchants building stores; consumers buying goods.',
        trustMechanism: 'Payment security gateways, Shopify brand reputation.',
        growthLoop: 'More merchants attracts more app developers, which improves platform utility.',
        monetization: 'Monthly subscription plans + App store referral cuts.',
        defensibility: 'High ecosystem lock-in through database and app integrations.',
        ecosystemEffect: 'Enables an army of agency consultants and developers.'
      }
    };
  });

  // Transferable Mechanisms
  const [mechanisms, setMechanisms] = useState<TransferMechanism[]>(() => {
    const raw = getTaskInput(12, 'transferableMechanisms');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [
      {
        id: 'mech_1',
        name: 'Trust Layer (Ratings/Badges)',
        sourceModel: 'Airbnb',
        whyItWorks: 'Reduces peer-to-peer transaction risk using shared reviews.',
        possibleApplication: 'Could help target customers trust providers for their JTBD.',
        adaptationNeeds: 'Custom review guidelines tailored to problem accuracy.',
        mainRisk: 'Review manipulation or sybil ratings.'
      }
    ];
  });

  // Ecosystem Stakeholders
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(() => {
    const raw = getTaskInput(12, 'ecosystemStakeholders');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [
      {
        id: 'st_1',
        name: 'Target Customer',
        category: 'customer',
        role: 'Primary end-user experiencing the pain.',
        valueGive: 'Payment fees, usage feedback, database inputs.',
        valueReceive: 'Automatic workflow coordination, reduced manual stress.',
        tension: 'Expects instant load times and low pricing.'
      }
    ];
  });

  // Transfer Fit Scores
  const [fitScores, setFitScores] = useState<Record<string, Record<string, number>>>(() => {
    const raw = getTaskInput(12, 'transferFitScores');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return {};
  });

  // State modifiers
  const addModel = (model: Omit<ModelExample, 'id'>) => {
    const nextId = Date.now().toString();
    setLibrary(prev => [...prev, { ...model, id: nextId }]);
  };

  const removeModel = (id: string) => {
    setLibrary(prev => prev.filter(m => m.id !== id));
    setDeconstructed(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const updateDeconstruction = (modelId: string, field: string, val: string) => {
    setDeconstructed(prev => ({
      ...prev,
      [modelId]: {
        ...(prev[modelId] || {}),
        [field]: val
      }
    }));
  };

  const addMechanism = () => {
    setMechanisms(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: '',
        sourceModel: '',
        whyItWorks: '',
        possibleApplication: '',
        adaptationNeeds: '',
        mainRisk: ''
      }
    ]);
  };

  const removeMechanism = (id: string) => {
    setMechanisms(prev => prev.filter(m => m.id !== id));
  };

  const updateMechanism = (id: string, field: keyof TransferMechanism, val: string) => {
    setMechanisms(prev => prev.map(m => m.id === id ? { ...m, [field]: val } : m));
  };

  const addStakeholder = () => {
    setStakeholders(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: '',
        category: 'customer',
        role: '',
        valueGive: '',
        valueReceive: '',
        tension: ''
      }
    ]);
  };

  const removeStakeholder = (id: string) => {
    setStakeholders(prev => prev.filter(s => s.id !== id));
  };

  const updateStakeholder = (id: string, field: keyof Stakeholder, val: string) => {
    setStakeholders(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const updateFitScore = (modelId: string, param: string, score: number) => {
    setFitScores(prev => ({
      ...prev,
      [modelId]: {
        ...(prev[modelId] || {}),
        [param]: score
      }
    }));
  };

  // Compile prompts for Task 13
  const inspirationPrompts = useMemo(() => {
    return [
      `How could we use a ${mechanisms[0]?.name || 'trust layer'} mechanism from ${mechanisms[0]?.sourceModel || 'Airbnb'} to help ${targetCustomer} solve the problem: "${selectedProblem}"?`,
      `How could we aggregate supply or coordinate ${stakeholders[0]?.name || 'partners'} to automate the core job for ${targetCustomer}?`,
      `If we applied a Platform model, what is the core infrastructure Shopify provides that we could copy for this ecosystem?`
    ];
  }, [mechanisms, stakeholders, targetCustomer, selectedProblem]);

  // Compile final summary document
  const generatedPlanMarkdown = useMemo(() => {
    const libraryLines = library.map(m => `- **${m.companyName} (${m.modelType})**: ${m.relevance}`).join('\n');
    const mechLines = mechanisms.map(m => `- **${m.name}** (from ${m.sourceModel}): Apply by "${m.possibleApplication}"`).join('\n');
    const stLines = stakeholders.map(s => `- **${s.name} (${s.category})**: Gives "${s.valueGive}", Receives "${s.valueReceive}"`).join('\n');
    const promptLines = inspirationPrompts.map(p => `- *${p}*`).join('\n');

    return `# Business Model Transfer Map

## Strategic Lens
- **Problem Statement:** ${selectedProblem}
- **Primary Ambition Horizon:** ${primaryHorizon}

## Study Library
${libraryLines || 'No cases added yet.'}

## Transferable Mechanisms
${mechLines || 'No mechanisms extracted yet.'}

## Ecosystem Stakeholders
${stLines || 'No stakeholders mapped.'}

## Inspiration Prompts for Task 13
${promptLines}
`;
  }, [selectedProblem, primaryHorizon, library, mechanisms, stakeholders, inspirationPrompts]);

  const saveAll = React.useCallback(() => {
    setTaskInput(12, 'provenModelLibrary', JSON.stringify(library));
    setTaskInput(12, 'deconstructedModels', JSON.stringify(deconstructed));
    setTaskInput(12, 'transferableMechanisms', JSON.stringify(mechanisms));
    setTaskInput(12, 'ecosystemStakeholders', JSON.stringify(stakeholders));
    setTaskInput(12, 'transferFitScores', JSON.stringify(fitScores));
    setTaskInput(12, 'notes', generatedPlanMarkdown);
    setTaskInput(12, 'deliverable', 'Business Model Transfer Map');
  }, [library, deconstructed, mechanisms, stakeholders, fitScores, generatedPlanMarkdown, setTaskInput]);

  useEffect(() => {
    saveAll();
  }, [saveAll]);

  const handleComplete = () => {
    saveAll();
    completeTask(12);
    router.push('/tasks/13');
  };

  const importTemplate = (tpl: ModelExample) => {
    if (library.some(m => m.companyName === tpl.companyName)) return;
    setLibrary(prev => [...prev, tpl]);
    // Pre-populate deconstruction
    const defaultDecon: Record<string, string> = {
      stripe: {
        coreMechanism: 'Developer API that abstracts bank gateway systems.',
        supplySide: 'Merchant banks, credit card processors, payment networks.',
        demandSide: 'Startups, online platforms, developers.',
        trustMechanism: 'PCI compliance, global brand status, fraud algorithms.',
        growthLoop: 'Simplifying integration attracts developers, who introduce merchants.',
        monetization: 'Pay-as-you-go credit card cuts (e.g. 2.9% + 30c).',
        defensibility: 'Proprietary APIs, complex financial integrations, data storage.',
        ecosystemEffect: 'Allows platforms to embed complex multi-party splits easily.'
      },
      shopify: {
        coreMechanism: 'Enablement platform providing turnkey store infrastructure.',
        supplySide: 'App developers, design templates, shipping vendors.',
        demandSide: 'Merchants building stores; consumers buying goods.',
        trustMechanism: 'Payment security gateways, Shopify brand reputation.',
        growthLoop: 'More merchants attracts more app developers, which improves platform utility.',
        monetization: 'Monthly subscription plans + App store referral cuts.',
        defensibility: 'High ecosystem lock-in through database and app integrations.',
        ecosystemEffect: 'Enables an army of agency consultants and developers.'
      },
      duolingo: {
        coreMechanism: 'Gamified curriculum learning loops and translations.',
        supplySide: 'Course curriculum designers, translators.',
        demandSide: 'Global language learners.',
        trustMechanism: 'Accreditation exams, social peer scoring.',
        growthLoop: 'Gamification keeps users returning daily, inviting friends.',
        monetization: 'Ad revenue, premium subscriptions, testing fees.',
        defensibility: 'Advanced behavioral data algorithms, huge content database.',
        ecosystemEffect: 'Democratizes language education globally.'
      }
    }[tpl.id] || {};

    setDeconstructed(prev => ({
      ...prev,
      [tpl.companyName]: defaultDecon
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 text-white animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-8">
        <div>
          <div className="text-[#B4F052] text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Layers size={12} />
            Task 12 Redesign
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Transfer Proven Business Models</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Analyze proven patterns and mechanisms across sectors to compile a transfer map. This acts as creative ammunition for ideation.
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
            <div className="text-white font-semibold">~5 hours</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left column: Strategic Lens */}
        <div className="space-y-6">
          <div className="glass-card p-5 border border-white/[0.08] bg-black/50 space-y-4">
            <div className="border-b border-white/[0.08] pb-2 flex items-center gap-2">
              <FileText size={14} className="text-[#B4F052]" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Strategic Lens</h3>
            </div>

            {!isTask11Complete && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 leading-relaxed">
                <AlertTriangle size={14} className="inline mr-1" />
                Horizon decision from Task 11 not completed.
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-white/40 block">Problem:</span>
                <p className="text-white/80 font-medium">{selectedProblem}</p>
              </div>

              <div>
                <span className="text-white/40 block">Target Customer:</span>
                <p className="text-white/80 font-medium">{targetCustomer}</p>
              </div>

              <div>
                <span className="text-white/40 block">Selected Ambition:</span>
                <span className="text-[#B4F052] font-mono uppercase font-bold">{primaryHorizon}</span>
              </div>

              <div>
                <span className="text-white/40 block">Horizon Rationale:</span>
                <p className="text-white/70 line-clamp-3 italic">&ldquo;{horizonRationale}&rdquo;</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wizard Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex border-b border-white/[0.08] overflow-x-auto pb-px gap-2">
            {[
              { id: 1, label: '1. Pattern Cards' },
              { id: 2, label: '2. Case Library' },
              { id: 3, label: '3. Deconstruction' },
              { id: 4, label: '4. Extract Mechanisms' },
              { id: 5, label: '5. Map Ecosystem' },
              { id: 6, label: '6. Fit Assessment' },
              { id: 7, label: '7. Output Map' }
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
            {/* Tab 1: Pattern Cards */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2">
                  <h2 className="text-base font-bold text-[#B4F052]">Understand Business Model Patterns</h2>
                  <p className="text-xs text-white/60">Study these archetypes to inspire structural differentiation.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
                  {PREDEFINED_PATTERNS.map(p => (
                    <div key={p.key} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
                      <h4 className="text-xs font-bold text-white">{p.label}</h4>
                      <p className="text-[11px] text-white/70">{p.description}</p>
                      <div className="text-[9px] pt-1.5 border-t border-white/[0.04] text-white/40">
                        <span className="text-[#B4F052]/80 font-bold block">When: {p.whenItWorks}</span>
                        <span>Example: {p.example}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Case Library */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2 flex justify-between items-center">
                  <h2 className="text-base font-bold text-[#B4F052]">Build Case Library</h2>
                  <span className="text-[10px] text-white/40">{library.length} cases added</span>
                </div>

                {/* Template Importer */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <span className="text-[10px] font-bold text-[#B4F052] block uppercase tracking-wider">Quick Import Predefined Examples</span>
                  <div className="flex flex-wrap gap-2">
                    {PREDEFINED_CASE_TEMPLATES.map(tpl => (
                      <button
                        key={tpl.id}
                        onClick={() => importTemplate(tpl)}
                        className="text-[10px] px-2 py-1 rounded border border-white/20 hover:border-[#B4F052] transition-colors"
                      >
                        + Import {tpl.companyName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Library Table */}
                <div className="space-y-2">
                  {library.map(m => (
                    <div key={m.id} className="p-3.5 rounded-lg bg-white/[0.01] border border-white/[0.04] text-xs flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="font-bold text-white">{m.companyName}</span>
                        <span className="text-[10px] text-white/40 block">Type: {m.modelType} | Industry: {m.industry}</span>
                        <p className="text-[11px] text-white/70 mt-1"><span className="text-[#B4F052] font-semibold">Relevance:</span> {m.relevance}</p>
                      </div>
                      <button
                        onClick={() => removeModel(m.id)}
                        className="text-rose-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Deconstruct */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2">
                  <h2 className="text-base font-bold text-[#B4F052]">Deconstruct Selected Cases</h2>
                </div>

                {library.length === 0 ? (
                  <p className="text-xs text-white/40 italic">Add cases in Tab 2 to deconstruct them here.</p>
                ) : (
                  <div className="space-y-6 max-h-[350px] overflow-y-auto pr-1">
                    {library.map(m => {
                      const dec = deconstructed[m.companyName] || {};
                      return (
                        <div key={m.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                          <span className="font-extrabold text-xs text-[#B4F052] uppercase tracking-wider">{m.companyName} Deconstruction</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1">
                              <label className="text-white/40 block">Core mechanism</label>
                              <input
                                value={dec.coreMechanism || ''}
                                onChange={e => updateDeconstruction(m.companyName, 'coreMechanism', e.target.value)}
                                className="w-full px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white"
                                placeholder="What makes this model work?"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-white/40 block">Supply side</label>
                              <input
                                value={dec.supplySide || ''}
                                onChange={e => updateDeconstruction(m.companyName, 'supplySide', e.target.value)}
                                className="w-full px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white"
                                placeholder="Who provides value?"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-white/40 block">Demand side</label>
                              <input
                                value={dec.demandSide || ''}
                                onChange={e => updateDeconstruction(m.companyName, 'demandSide', e.target.value)}
                                className="w-full px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white"
                                placeholder="Who pays for value?"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-white/40 block">Monetization</label>
                              <input
                                value={dec.monetization || ''}
                                onChange={e => updateDeconstruction(m.companyName, 'monetization', e.target.value)}
                                className="w-full px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white"
                                placeholder="How do they capture value?"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Extract Mechanisms */}
            {activeTab === 4 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2 flex justify-between items-center">
                  <h2 className="text-base font-bold text-[#B4F052]">Extract Transferable Mechanisms</h2>
                  <button onClick={addMechanism} className="text-xs px-2.5 py-1 bg-[#B4F052] text-black rounded font-bold">
                    + Add Mechanism
                  </button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {mechanisms.map(m => (
                    <div key={m.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs relative">
                      <button onClick={() => removeMechanism(m.id)} className="absolute top-4 right-4 text-rose-400">
                        <Trash2 size={12} />
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-white/40 block">Mechanism Name</label>
                          <input
                            value={m.name}
                            onChange={e => updateMechanism(m.id, 'name', e.target.value)}
                            className="w-full px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08]"
                            placeholder="e.g. Trust layer"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-white/40 block">Source Model</label>
                          <input
                            value={m.sourceModel}
                            onChange={e => updateMechanism(m.id, 'sourceModel', e.target.value)}
                            className="w-full px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08]"
                            placeholder="e.g. Airbnb"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-white/40 block">Possible application to our problem</label>
                        <input
                          value={m.possibleApplication}
                          onChange={e => updateMechanism(m.id, 'possibleApplication', e.target.value)}
                          className="w-full px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08]"
                          placeholder="How does it apply to our customer?"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Map Ecosystem */}
            {activeTab === 5 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2 flex justify-between items-center">
                  <h2 className="text-base font-bold text-[#B4F052]">Map Ecosystem Stakeholders</h2>
                  <button onClick={addStakeholder} className="text-xs px-2.5 py-1 bg-[#B4F052] text-black rounded font-bold">
                    + Add Stakeholder
                  </button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {stakeholders.map(s => (
                    <div key={s.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs relative">
                      <button onClick={() => removeStakeholder(s.id)} className="absolute top-4 right-4 text-rose-400">
                        <Trash2 size={12} />
                      </button>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1 col-span-2">
                          <label className="text-white/40 block">Stakeholder Name</label>
                          <input
                            value={s.name}
                            onChange={e => updateStakeholder(s.id, 'name', e.target.value)}
                            className="w-full px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08]"
                            placeholder="e.g. Expert, Partner"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-white/40 block">Category</label>
                          <select
                            value={s.category}
                            onChange={e => updateStakeholder(s.id, 'category', e.target.value)}
                            className="w-full bg-black border border-white/[0.08] text-xs rounded px-2 py-1"
                          >
                            <option value="customer">Customer</option>
                            <option value="partner">Partner</option>
                            <option value="supplier">Supplier</option>
                            <option value="distributor">Distributor</option>
                            <option value="competitor">Competitor</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-white/40 block">Value They Give</label>
                          <input
                            value={s.valueGive}
                            onChange={e => updateStakeholder(s.id, 'valueGive', e.target.value)}
                            className="w-full px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-white/40 block">Value They Receive</label>
                          <input
                            value={s.valueReceive}
                            onChange={e => updateStakeholder(s.id, 'valueReceive', e.target.value)}
                            className="w-full px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 6: Fit Assessment */}
            {activeTab === 6 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2">
                  <h2 className="text-base font-bold text-[#B4F052]">Score Transfer Fit (1-5)</h2>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {library.map(m => {
                    const hScores = fitScores[m.companyName] || { problemFit: 3, horizonFit: 3, ecosystemFit: 3, monetizationFit: 3, executionFit: 3 };
                    return (
                      <div key={m.id} className="p-3.5 rounded-lg bg-white/[0.01] border border-white/[0.04] space-y-2 text-xs">
                        <span className="font-bold text-white">{m.companyName} Model Fit</span>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {['problemFit', 'horizonFit', 'ecosystemFit', 'monetizationFit', 'executionFit'].map(param => (
                            <div key={param} className="space-y-1">
                              <label className="text-[10px] text-white/40 block uppercase">{param.replace('Fit', '')}</label>
                              <select
                                value={hScores[param] || 3}
                                onChange={e => updateFitScore(m.companyName, param, parseInt(e.target.value))}
                                className="w-full bg-black border border-white/[0.08] text-[10px] rounded px-1.5 py-0.5"
                              >
                                {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 7: Output Map */}
            {activeTab === 7 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2 flex justify-between items-center">
                  <h2 className="text-base font-bold text-[#B4F052]">Business Model Transfer Map</h2>
                  <span className="text-[10px] text-white/30">Output Document</span>
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
                    Complete Task 12 and continue to Task 13
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
