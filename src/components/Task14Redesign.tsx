'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, ArrowRight, Layers, Star, AlertTriangle, Sparkles, Save, Trash2, Filter, Info, Play, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
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

interface NormalizedCard {
  ideaId: string;
  ideaName: string;
  oneSentenceDescription: string;
  targetCustomer: string;
  problemPainAddressed: string;
  desiredGainUnlocked: string;
  businessModelPattern: string; // SaaS, marketplace, platform, etc.
  whoPays: string;
  whoBenefits: string;
  firstSimpleVersion: string;
  mainAssumption: string;
  clarityStatus: 'ready_for_scoring' | 'needs_clarification';
}

interface FirstPassDecision {
  ideaId: string;
  decision: 'keep_for_scoring' | 'merge_with_another' | 'park_for_later' | 'reject' | 'needs_clarification';
  reason: string;
  relatedIdeaId?: string;
}

interface IdeaScore {
  ideaId: string;
  problemFit: number;
  customerPainIntensity: number;
  customerReadiness: number;
  marketPotential: number;
  horizonFit: number;
  differentiation: number;
  executionFeasibility: number;
  resourceFit: number;
  revenueClarity: number;
  learningSpeed: number;
  complexityRisk: number; // risk metrics (1-5, where higher means higher risk)
  capitalIntensity: number;
  dependencyRisk: number;
  scoreRationale: string;
  evidence: string;
  uncertainties: string;
}

interface ShortlistedIdea {
  ideaId: string;
  rank: number;
  whyShortlisted: string;
  whatMakesItPromising: string;
  biggestRisk: string;
  keyAssumption: string;
  nextAnalysisTask: 'task_15' | 'task_16' | 'task_17' | 'task_18';
}

interface ParkedRejectedIdea {
  ideaId: string;
  status: 'parked' | 'rejected' | 'merged' | 'needs_evidence';
  reason: string;
  revisitCondition: string;
}

// 20 Mock Raw Ideas in case Task 13 has no ideas
const DEFAULT_RAW_IDEAS: IdeaCard[] = [
  { id: 'raw_1', name: 'AI-Powered SME Compliance Auditor', description: 'Automatically audit financial transactions against regional tax regulations.', sourceMechanism: 'AI workflow automation', targetSegment: 'SME leaders', ecosystemAngle: 'Compliance officers', horizonAlignment: 'Horizon 1', comments: 'Strong pain point around tax season.', notes: '' },
  { id: 'raw_2', name: 'B2B Contract Trust Verification Engine', description: 'Smart contracts coupled with AI to verify SLA compliance and trust rules.', sourceMechanism: 'trust layer', targetSegment: 'Procurement heads', ecosystemAngle: 'Legal counsel', horizonAlignment: 'Horizon 2', comments: 'Needs partner network to verify SLAs.', notes: '' },
  { id: 'raw_3', name: 'Legal Document Risk Analyzer', description: 'Scan legal agreements for high-risk clauses and suggest safer alternatives.', sourceMechanism: 'AI augmentation', targetSegment: 'B2B buyers', ecosystemAngle: 'In-house legal', horizonAlignment: 'Horizon 1', comments: 'Saves hours of attorney review fees.', notes: '' },
  { id: 'raw_4', name: 'Freelance Smart Escrow Marketplace', description: 'A platform to secure payments based on intermediate milestone approvals.', sourceMechanism: 'credentialing', targetSegment: 'Freelancers & buyers', ecosystemAngle: 'Platform admins', horizonAlignment: 'Horizon 2', comments: 'Solves payment defaults.', notes: '' },
  { id: 'raw_5', name: 'Automated AI Code Quality Reviewer', description: 'Real-time pull request analysis for security leaks and code optimization.', sourceMechanism: 'AI workflow automation', targetSegment: 'DevOps managers', ecosystemAngle: 'Software developers', horizonAlignment: 'Horizon 1', comments: 'High developer readiness.', notes: '' },
  { id: 'raw_6', name: 'AI-Augmented Medical Transcriptionist', description: 'Voice-to-text scribe for patient consultations matching local health codes.', sourceMechanism: 'AI augmentation', targetSegment: 'Clinic managers', ecosystemAngle: 'Doctors', horizonAlignment: 'Horizon 1', comments: 'HIPAA compliance risk is high.', notes: '' },
  { id: 'raw_7', name: 'Decentralized Credential Verification Platform', description: 'Verify academic degrees and professional credentials instantly on ledger.', sourceMechanism: 'trust layer', targetSegment: 'HR managers', ecosystemAngle: 'Universities', horizonAlignment: 'Horizon 3', comments: 'Relies on external credential providers.', notes: '' },
  { id: 'raw_8', name: 'AI Agent for SME Financial Forecasting', description: 'Continuous cash flow simulation and burn-rate alert agent.', sourceMechanism: 'AI workflow automation', targetSegment: 'Startup founders', ecosystemAngle: 'CFO advisors', horizonAlignment: 'Horizon 1', comments: 'Highly actionable Cash runway insights.', notes: '' },
  { id: 'raw_9', name: 'Managed Cloud Billing Optimizer', description: 'Automated server scaling and unused resource shutdown recommendation.', sourceMechanism: 'workflow automation', targetSegment: 'IT departments', ecosystemAngle: 'Cloud architects', horizonAlignment: 'Horizon 1', comments: 'Easy to validate ROI.', notes: '' },
  { id: 'raw_10', name: 'AI Real Estate Appraisal Engine', description: 'Predict property rental value using multi-factor local economic data.', sourceMechanism: 'AI augmentation', targetSegment: 'Property investors', ecosystemAngle: 'Real estate brokers', horizonAlignment: 'Horizon 1', comments: 'Requires clean localized data loops.', notes: '' },
  { id: 'raw_11', name: 'No-Code Workflow Builder for Healthcare Providers', description: 'Simplify patient intake processes using standardized visual elements.', sourceMechanism: 'workflow automation', targetSegment: 'Hospital administrators', ecosystemAngle: 'Front desk staff', horizonAlignment: 'Horizon 2', comments: 'Long sales cycle risk.', notes: '' },
  { id: 'raw_12', name: 'Cybersecurity Vulnerability Patching Automation', description: 'Scan and automatically apply verified security hotfixes to servers.', sourceMechanism: 'trust layer', targetSegment: 'Chief Security Officers', ecosystemAngle: 'IT ops', horizonAlignment: 'Horizon 2', comments: 'Fear of automated breaking changes.', notes: '' },
  { id: 'raw_13', name: 'SaaS Platform for Employee Onboarding Checklists', description: 'Gamified onboarding progress tracker for remote employees.', sourceMechanism: 'workflow automation', targetSegment: 'HR coordinators', ecosystemAngle: 'New employees', horizonAlignment: 'Horizon 1', comments: 'Low entry barrier, highly competitive.', notes: '' },
  { id: 'raw_14', name: 'AI Customer Support Co-pilot for E-commerce', description: 'Recommend draft support responses to agents based on catalog data.', sourceMechanism: 'AI augmentation', targetSegment: 'Support leads', ecosystemAngle: 'Support agents', horizonAlignment: 'Horizon 1', comments: 'Directly addresses cost reduction.', notes: '' },
  { id: 'raw_15', name: 'Data Governance Audit Tool for FinTechs', description: 'Monitor database queries to detect unauthorized PII access.', sourceMechanism: 'trust layer', targetSegment: 'Compliance directors', ecosystemAngle: 'Security engineers', horizonAlignment: 'Horizon 1', comments: 'Critical for GDPR/CCPA readiness.', notes: '' },
  { id: 'raw_16', name: 'Community-Led Product Design Platform', description: 'Crowdsource feedback on apparel mockups before manufacturing.', sourceMechanism: 'credentialing', targetSegment: 'Brand owners', ecosystemAngle: 'Design community', horizonAlignment: 'Horizon 2', comments: 'Solves overproduction wastes.', notes: '' },
  { id: 'raw_17', name: 'Automated ESG Score Calculator for Supply Chains', description: 'Track supplier carbon footprints and social scores automatically.', sourceMechanism: 'trust layer', targetSegment: 'Supply chain heads', ecosystemAngle: 'Suppliers', horizonAlignment: 'Horizon 2', comments: 'Heavy compliance push.', notes: '' },
  { id: 'raw_18', name: 'AI Talent Sourcing and Screening Assistant', description: 'Rank candidates against job descriptions based on semantic resume match.', sourceMechanism: 'AI workflow automation', targetSegment: 'Recruiters', ecosystemAngle: 'Hiring managers', horizonAlignment: 'Horizon 1', comments: 'Risk of semantic bias.', notes: '' },
  { id: 'raw_19', name: 'Managed IT Support Layer for Non-profits', description: 'Centralized helpdesk outsourced to specialized tech assistants.', sourceMechanism: 'workflow automation', targetSegment: 'Non-profit directors', ecosystemAngle: 'Staff users', horizonAlignment: 'Horizon 1', comments: 'Low budget segment but loyal.', notes: '' },
  { id: 'raw_20', name: 'AI Content Localization Workflow Engine', description: 'Localize marketing content including images, idioms, and voiceovers.', sourceMechanism: 'AI augmentation', targetSegment: 'Global marketing VPs', ecosystemAngle: 'Translators', horizonAlignment: 'Horizon 2', comments: 'Highly valuable for scaling startups.', notes: '' }
];

export default function Task14Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput, completedTasks } = useGarage();

  const isTask13Complete = completedTasks.includes(13);

  // --- Import from Task 13 ---
  const rawLongList = getTaskInput(13, 'ideasLongList');
  const importedIdeasList: IdeaCard[] = useMemo(() => {
    if (rawLongList) {
      try {
        const parsed = JSON.parse(rawLongList);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return DEFAULT_RAW_IDEAS;
  }, [rawLongList]);

  const selectedProblem = getTaskInput(3, 'notes') || 'No problem statement recorded yet. Complete Task 3.';
  const targetCustomer = getTaskInput(3, 'targetCustomer') || 'SME Business Leaders';
  const primaryHorizon = getTaskInput(11, 'primaryHorizon') || 'Horizon 1 (Incremental)';

  // --- Task 14 States ---
  const [activeTab, setActiveTab] = useState(1);

  // 1. Normalized Cards
  const [normalizedCards, setNormalizedCards] = useState<NormalizedCard[]>(() => {
    const raw = getTaskInput(14, 'normalizedIdeaCards');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    // Pre-populate with normalized versions of the first 8 ideas
    return importedIdeasList.map(idea => ({
      ideaId: idea.id,
      ideaName: idea.name,
      oneSentenceDescription: idea.description,
      targetCustomer: targetCustomer,
      problemPainAddressed: `Friction and manual labor related to ${idea.name.toLowerCase()}`,
      desiredGainUnlocked: 'Efficiency gains, hours saved, and cost reduction',
      businessModelPattern: idea.name.includes('SaaS') ? 'SaaS' : idea.name.includes('Marketplace') ? 'Marketplace' : 'AI workflow',
      whoPays: 'SME Business owners',
      whoBenefits: 'Operations team and leadership',
      firstSimpleVersion: `A simple landing page and manual spreadsheet process ('Concierge MVP')`,
      mainAssumption: 'Customers are willing to trust automated audits and pay a subscription.',
      clarityStatus: 'ready_for_scoring'
    }));
  });

  // 2. First Pass Filter
  const [firstPass, setFirstPass] = useState<FirstPassDecision[]>(() => {
    const raw = getTaskInput(14, 'firstPassFilter');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    // By default keep first 6 for scoring, merge 7 & 8, park the rest
    return importedIdeasList.map((idea, index) => {
      let decision: FirstPassDecision['decision'] = 'keep_for_scoring';
      let reason = 'High strategic alignment and clear customer persona.';
      if (index >= 6 && index < 10) {
        decision = 'park_for_later';
        reason = 'Interesting concept but too operationally complex for a solo founder today.';
      } else if (index >= 10 && index < 15) {
        decision = 'merge_with_another';
        reason = 'Better implemented as a feature inside a broader SaaS engine.';
      } else if (index >= 15) {
        decision = 'reject';
        reason = 'Too far outside our core technical capabilities or low market attractiveness.';
      }
      return { ideaId: idea.id, decision, reason };
    });
  });

  // 3. Scores
  const [scores, setScores] = useState<IdeaScore[]>(() => {
    const raw = getTaskInput(14, 'ideaScores');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return importedIdeasList.map(idea => ({
      ideaId: idea.id,
      problemFit: 4,
      customerPainIntensity: 4,
      customerReadiness: 3,
      marketPotential: 4,
      horizonFit: 5,
      differentiation: 3,
      executionFeasibility: 4,
      resourceFit: 4,
      revenueClarity: 3,
      learningSpeed: 4,
      complexityRisk: 2,
      capitalIntensity: 2,
      dependencyRisk: 2,
      scoreRationale: 'Strong structural alignment with the selected problem, easily verified in Phase 1.',
      evidence: 'Validated through preliminary SME feedback and focus groups.',
      uncertainties: 'Client willingness to share raw transaction logs.'
    }));
  });

  // 4. Shortlisted
  const [shortlisted, setShortlisted] = useState<ShortlistedIdea[]>(() => {
    const raw = getTaskInput(14, 'shortlistedIdeas');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    // Take the top 3 items
    return [
      {
        ideaId: importedIdeasList[0].id,
        rank: 1,
        whyShortlisted: 'Highest score, direct problem fit, low regulatory friction.',
        whatMakesItPromising: 'Scalable SaaS billing pattern, immediate ROI proof.',
        biggestRisk: 'Customer data privacy and API limitations.',
        keyAssumption: 'Customers will link their bank account / accounting suite.',
        nextAnalysisTask: 'task_15'
      },
      {
        ideaId: importedIdeasList[1].id,
        rank: 2,
        whyShortlisted: 'Provides a highly defensible trust layer that competitors lack.',
        whatMakesItPromising: 'Leverages smart automation, high transaction fees.',
        biggestRisk: 'Integrator partner dependency.',
        keyAssumption: 'Integrators will open their endpoints to our trust layer.',
        nextAnalysisTask: 'task_15'
      },
      {
        ideaId: importedIdeasList[2].id,
        rank: 3,
        whyShortlisted: 'Solves an immediate, expensive manual pain (legal review costs).',
        whatMakesItPromising: 'High buyer urgency, direct corporate budget alignment.',
        biggestRisk: 'Liability for automated errors.',
        keyAssumption: 'Legal counsel accepts AI recommendations as drafts.',
        nextAnalysisTask: 'task_15'
      }
    ];
  });

  // 5. Parked & Rejected
  const [parkedRejected, setParkedRejected] = useState<ParkedRejectedIdea[]>(() => {
    const raw = getTaskInput(14, 'parkedRejectedIdeas');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return importedIdeasList.slice(6).map((idea, index) => ({
      ideaId: idea.id,
      status: index % 2 === 0 ? 'parked' : 'rejected',
      reason: 'Low differentiation or excessive capital intensity.',
      revisitCondition: 'Revisit if we secure early seed funding (> $150k).'
    }));
  });

  // Filters for review step
  const [patternFilter, setPatternFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Auto calculate total scores
  const scoreMap = useMemo(() => {
    const map = new Map<string, number>();
    scores.forEach(s => {
      const positiveTotal = s.problemFit + s.customerPainIntensity + s.customerReadiness + s.marketPotential + s.horizonFit + s.differentiation + s.executionFeasibility + s.resourceFit + s.revenueClarity + s.learningSpeed;
      const riskTotal = s.complexityRisk + s.capitalIntensity + s.dependencyRisk;
      const finalScore = positiveTotal - (riskTotal / 3);
      map.set(s.ideaId, Math.round(finalScore * 10) / 10);
    });
    return map;
  }, [scores]);

  // Sync state values on changes
  const saveAll = React.useCallback(() => {
    setTaskInput(14, 'normalizedIdeaCards', JSON.stringify(normalizedCards));
    setTaskInput(14, 'firstPassFilter', JSON.stringify(firstPass));
    setTaskInput(14, 'ideaScores', JSON.stringify(scores));
    setTaskInput(14, 'shortlistedIdeas', JSON.stringify(shortlisted));
    setTaskInput(14, 'parkedRejectedIdeas', JSON.stringify(parkedRejected));

    // Compile markdown decision matrix
    const mdLines: string[] = [
      '# Shortlist Decision Matrix',
      '',
      `**Problem Statement:** ${selectedProblem}`,
      `**Target Segment:** ${targetCustomer}`,
      `**Primary Horizon:** ${primaryHorizon}`,
      '',
      '## Shortlisted Ideas',
      ''
    ];

    shortlisted.forEach(s => {
      const baseIdea = importedIdeasList.find(x => x.id === s.ideaId);
      const normCard = normalizedCards.find(x => x.ideaId === s.ideaId);
      const scoreVal = scoreMap.get(s.ideaId) || 0;
      if (baseIdea) {
        mdLines.push(`### Rank ${s.rank}: ${baseIdea.name} (Score: ${scoreVal})`);
        mdLines.push(`- **One Sentence Description:** ${normCard?.oneSentenceDescription || baseIdea.description}`);
        mdLines.push(`- **Target Customer:** ${normCard?.targetCustomer || targetCustomer}`);
        mdLines.push(`- **Business Pattern:** ${normCard?.businessModelPattern || 'SaaS'}`);
        mdLines.push(`- **Key Assumption:** ${s.keyAssumption}`);
        mdLines.push(`- **Biggest Risk:** ${s.biggestRisk}`);
        mdLines.push(`- **Why Shortlisted:** ${s.whyShortlisted}`);
        mdLines.push('');
      }
    });

    mdLines.push('## Parked / Rejected Ideas');
    mdLines.push('| Idea | Status | Reason | Revisit Condition |');
    mdLines.push('| ---- | ------ | ------ | ----------------- |');
    parkedRejected.forEach(pr => {
      const baseIdea = importedIdeasList.find(x => x.id === pr.ideaId);
      if (baseIdea) {
        mdLines.push(`| ${baseIdea.name} | ${pr.status.toUpperCase()} | ${pr.reason} | ${pr.revisitCondition} |`);
      }
    });

    setTaskInput(14, 'notes', mdLines.join('\n'));
    setTaskInput(14, 'deliverable', 'Shortlist Decision Matrix');
  }, [normalizedCards, firstPass, scores, shortlisted, parkedRejected, selectedProblem, targetCustomer, primaryHorizon, importedIdeasList, scoreMap, setTaskInput]);

  useEffect(() => {
    saveAll();
  }, [saveAll]);

  // AI actions simulation
  const handleAIClarify = (id: string) => {
    setNormalizedCards(prev => prev.map(card => {
      if (card.ideaId === id) {
        const baseIdea = importedIdeasList.find(x => x.id === id);
        return {
          ...card,
          oneSentenceDescription: `A specialized tool to help ${targetCustomer.toLowerCase()} solve ${baseIdea?.description.toLowerCase() || 'friction'} in under 5 minutes.`,
          problemPainAddressed: `Manual processes, human error, and high overhead costs.`,
          desiredGainUnlocked: `90% faster processing and guaranteed compliance.`,
          clarityStatus: 'ready_for_scoring'
        };
      }
      return card;
    }));
  };

  const handleComplete = () => {
    saveAll();
    completeTask(14);
    router.push('/tasks');
  };

  const isTargetMet = shortlisted.length >= 3 && shortlisted.length <= 5;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 text-white animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-8">
        <div>
          <div className="text-[#B4F052] text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Layers size={12} />
            Task 14 Redesign
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Distil into Short List</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Faulkner said &quot;Kill your Darlings&quot;. Filter your long list of {importedIdeasList.length} ideas down to 3-5 high-potential business models.
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
            <div className="text-white/40 mb-0.5">Imported List</div>
            <div className="text-white font-semibold">{importedIdeasList.length} Raw Ideas</div>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Wizard Panel (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-white/[0.08] overflow-x-auto pb-px gap-2">
            {[
              { id: 1, label: '1. Review List' },
              { id: 2, label: '2. Normalize' },
              { id: 3, label: '3. First Pass' },
              { id: 4, label: '4. Scoring Matrix' },
              { id: 5, label: '5. Shortlist' },
              { id: 6, label: '6. Archive' }
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
            {/* Step 1: Review Long List */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <h3 className="text-base font-bold text-[#B4F052]">Review Raw Long List</h3>
                  <div className="flex gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Search ideas..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-white/40">
                        <th className="py-2 pr-4">Idea</th>
                        <th className="py-2 pr-4">Description</th>
                        <th className="py-2 pr-4">Source Mechanism</th>
                        <th className="py-2 pr-4">Horizon</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importedIdeasList
                        .filter(idea => idea.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((idea, idx) => (
                          <tr key={idea.id} className="border-b border-white/[0.04] hover:bg-white/[0.01]">
                            <td className="py-3 pr-4 font-bold text-white">{idx+1}. {idea.name}</td>
                            <td className="py-3 pr-4 text-white/70">{idea.description}</td>
                            <td className="py-3 pr-4 text-white/60 font-mono text-[10px]">{idea.sourceMechanism}</td>
                            <td className="py-3 pr-4 text-[#B4F052] font-semibold">{idea.horizonAlignment}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Step 2: Normalize Cards */}
            {activeTab === 2 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-[#B4F052]">Normalize Idea Formats</h3>
                  <span className="text-[10px] text-white/40">Ensures uniform criteria weightings</span>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {normalizedCards.map((card, idx) => (
                    <div key={card.ideaId} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="text-sm font-bold text-white">{idx + 1}. {card.ideaName}</h4>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAIClarify(card.ideaId)}
                            className="px-2.5 py-1 text-[10px] bg-[#B4F052]/10 border border-[#B4F052]/30 text-[#B4F052] rounded-lg flex items-center gap-1 hover:bg-[#B4F052]/20"
                          >
                            <Sparkles size={10} />
                            AI Clarify
                          </button>
                          <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${card.clarityStatus === 'ready_for_scoring' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {card.clarityStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">One-sentence Description</label>
                          <input
                            type="text"
                            value={card.oneSentenceDescription}
                            onChange={e => setNormalizedCards(prev => prev.map(c => c.ideaId === card.ideaId ? { ...c, oneSentenceDescription: e.target.value } : c))}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">Target Customer</label>
                          <input
                            type="text"
                            value={card.targetCustomer}
                            onChange={e => setNormalizedCards(prev => prev.map(c => c.ideaId === card.ideaId ? { ...c, targetCustomer: e.target.value } : c))}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">Pains & Obstacles</label>
                          <input
                            type="text"
                            value={card.problemPainAddressed}
                            onChange={e => setNormalizedCards(prev => prev.map(c => c.ideaId === card.ideaId ? { ...c, problemPainAddressed: e.target.value } : c))}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">Gains & Desires</label>
                          <input
                            type="text"
                            value={card.desiredGainUnlocked}
                            onChange={e => setNormalizedCards(prev => prev.map(c => c.ideaId === card.ideaId ? { ...c, desiredGainUnlocked: e.target.value } : c))}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">Business Model Pattern</label>
                          <input
                            type="text"
                            value={card.businessModelPattern}
                            onChange={e => setNormalizedCards(prev => prev.map(c => c.ideaId === card.ideaId ? { ...c, businessModelPattern: e.target.value } : c))}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">Key Assumptions</label>
                          <input
                            type="text"
                            value={card.mainAssumption}
                            onChange={e => setNormalizedCards(prev => prev.map(c => c.ideaId === card.ideaId ? { ...c, mainAssumption: e.target.value } : c))}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: First Pass Filter */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-[#B4F052]">First Pass Filter</h3>
                  <span className="text-xs text-white/40">Sort into scoring queue vs archive</span>
                </div>

                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                  {firstPass.map((item, idx) => {
                    const ideaName = importedIdeasList.find(x => x.id === item.ideaId)?.name || 'Unknown';
                    return (
                      <div key={item.ideaId} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                        <div className="md:w-1/3">
                          <span className="font-bold text-white">{idx+1}. {ideaName}</span>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={item.decision}
                            onChange={e => setFirstPass(prev => prev.map(x => x.ideaId === item.ideaId ? { ...x, decision: e.target.value as FirstPassDecision['decision'] } : x))}
                            className="px-2.5 py-1.5 rounded bg-white/[0.03] border border-white/[0.08] text-white text-[11px] focus:outline-none"
                          >
                            <option value="keep_for_scoring">Keep for Scoring</option>
                            <option value="merge_with_another">Merge with another</option>
                            <option value="park_for_later">Park for later</option>
                            <option value="reject">Reject</option>
                            <option value="needs_clarification">Needs Clarification</option>
                          </select>
                        </div>
                        <input
                          type="text"
                          value={item.reason}
                          placeholder="Why this decision?"
                          onChange={e => setFirstPass(prev => prev.map(x => x.ideaId === item.ideaId ? { ...x, reason: e.target.value } : x))}
                          className="flex-1 px-3 py-1 bg-white/[0.02] border border-white/[0.08] rounded text-[11px]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Scoring Matrix */}
            {activeTab === 4 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-[#B4F052]">Multi-Criteria Scoring Matrix</h3>
                  <span className="text-xs text-white/40">Scored on a 1-5 scale</span>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {firstPass
                    .filter(item => item.decision === 'keep_for_scoring')
                    .map((item, idx) => {
                      const scoreCard = scores.find(s => s.ideaId === item.ideaId) || scores[0];
                      const ideaName = importedIdeasList.find(x => x.id === item.ideaId)?.name || 'Unknown';
                      return (
                        <div key={item.ideaId} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold text-white">{idx+1}. {ideaName}</h4>
                            <div className="text-sm font-extrabold text-[#B4F052] bg-[#B4F052]/10 px-3 py-1 rounded-lg">
                              Score: {scoreMap.get(item.ideaId) || 0} / 50
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                            {([
                              { label: 'Problem Fit', key: 'problemFit' },
                              { label: 'Pain Intensity', key: 'customerPainIntensity' },
                              { label: 'Readiness', key: 'customerReadiness' },
                              { label: 'Market Cap', key: 'marketPotential' },
                              { label: 'Horizon Fit', key: 'horizonFit' },
                              { label: 'Differentiation', key: 'differentiation' },
                              { label: 'Feasibility', key: 'executionFeasibility' },
                              { label: 'Resource Fit', key: 'resourceFit' },
                              { label: 'Revenue Clarity', key: 'revenueClarity' },
                              { label: 'Learning Speed', key: 'learningSpeed' },
                            ] as Array<{ label: string; key: keyof IdeaScore }>).map(criterion => (
                              <div key={criterion.label} className="space-y-1">
                                <label className="text-[10px] text-white/40 block">{criterion.label}</label>
                                <select
                                  value={scoreCard[criterion.key] as number}
                                  onChange={e => setScores(prev => prev.map(s => s.ideaId === item.ideaId ? ({ ...s, [criterion.key]: parseInt(e.target.value) } as IdeaScore) : s))}
                                  className="w-full bg-white/[0.02] border border-white/[0.08] px-2 py-1 rounded"
                                >
                                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs border-t border-white/[0.04] pt-3">
                            <div className="space-y-1">
                              <label className="text-[10px] text-rose-400 block font-bold">Complexity Risk</label>
                              <select
                                value={scoreCard.complexityRisk}
                                onChange={e => setScores(prev => prev.map(s => s.ideaId === item.ideaId ? { ...s, complexityRisk: parseInt(e.target.value) } : s))}
                                className="w-full bg-white/[0.02] border border-white/[0.08] px-2 py-1 rounded text-rose-300"
                              >
                                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} (Risk)</option>)}
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-rose-400 block font-bold">Capital Intensity</label>
                              <select
                                value={scoreCard.capitalIntensity}
                                onChange={e => setScores(prev => prev.map(s => s.ideaId === item.ideaId ? { ...s, capitalIntensity: parseInt(e.target.value) } : s))}
                                className="w-full bg-white/[0.02] border border-white/[0.08] px-2 py-1 rounded text-rose-300"
                              >
                                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} (Risk)</option>)}
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-rose-400 block font-bold">Dependency Risk</label>
                              <select
                                value={scoreCard.dependencyRisk}
                                onChange={e => setScores(prev => prev.map(s => s.ideaId === item.ideaId ? { ...s, dependencyRisk: parseInt(e.target.value) } : s))}
                                className="w-full bg-white/[0.02] border border-white/[0.08] px-2 py-1 rounded text-rose-300"
                              >
                                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} (Risk)</option>)}
                              </select>
                            </div>
                          </div>

                          <div className="space-y-2 text-xs border-t border-white/[0.04] pt-3">
                            <label className="text-[10px] text-white/40 block">Scoring Rationale / Key Uncertainties</label>
                            <input
                              type="text"
                              value={scoreCard.scoreRationale}
                              placeholder="Score Rationale"
                              onChange={e => setScores(prev => prev.map(s => s.ideaId === item.ideaId ? { ...s, scoreRationale: e.target.value } : s))}
                              className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] mb-1"
                            />
                            <input
                              type="text"
                              value={scoreCard.uncertainties}
                              placeholder="Key Uncertainties"
                              onChange={e => setScores(prev => prev.map(s => s.ideaId === item.ideaId ? { ...s, uncertainties: e.target.value } : s))}
                              className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Step 5: Create Short List */}
            {activeTab === 5 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-[#B4F052]">Select Top 3-5 Shortlisted Ideas</h3>
                  <span className="text-xs text-white/40">{shortlisted.length} selected</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 max-h-[300px] overflow-y-auto border border-white/[0.08] p-3 rounded-xl">
                    <span className="text-[10px] text-white/40 block mb-2 uppercase">Available Ideas</span>
                    {firstPass
                      .filter(item => item.decision === 'keep_for_scoring')
                      .map(item => {
                        const ideaName = importedIdeasList.find(x => x.id === item.ideaId)?.name || 'Unknown';
                        const scoreVal = scoreMap.get(item.ideaId) || 0;
                        const isChecked = shortlisted.some(x => x.ideaId === item.ideaId);
                        return (
                          <label key={item.ideaId} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/[0.03] cursor-pointer text-xs">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={e => {
                                  if (e.target.checked) {
                                    if (shortlisted.length >= 5) {
                                      alert('Shortlist limited to maximum 5 ideas.');
                                      return;
                                    }
                                    setShortlisted(prev => [...prev, {
                                      ideaId: item.ideaId,
                                      rank: prev.length + 1,
                                      whyShortlisted: 'Top ranking score during multi-criteria evaluation.',
                                      whatMakesItPromising: 'Clear path to validation and high market interest.',
                                      biggestRisk: 'High market competition or operational scaling limits.',
                                      keyAssumption: 'Primary customers will commit to pilot contracts.',
                                      nextAnalysisTask: 'task_15'
                                    }]);
                                  } else {
                                    setShortlisted(prev => prev.filter(x => x.ideaId !== item.ideaId).map((x, i) => ({ ...x, rank: i + 1 })));
                                  }
                                }}
                                className="rounded text-[#B4F052] focus:ring-0"
                              />
                              <span className="font-bold text-white">{ideaName}</span>
                            </div>
                            <span className="text-[10px] text-[#B4F052] font-semibold">{scoreVal} pts</span>
                          </label>
                        );
                      })}
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto border border-white/[0.08] p-3 rounded-xl">
                    <span className="text-[10px] text-white/40 block mb-2 uppercase">Shortlist Ranks & Configuration</span>
                    {shortlisted.map((s, idx) => {
                      const ideaName = importedIdeasList.find(x => x.id === s.ideaId)?.name || 'Unknown';
                      return (
                        <div key={s.ideaId} className="p-3 rounded-lg bg-[#B4F052]/5 border border-[#B4F052]/10 space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-[#B4F052]">Rank {idx + 1}: {ideaName}</span>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-white/40 block">Key Assumption</label>
                            <input
                              type="text"
                              value={s.keyAssumption}
                              onChange={e => setShortlisted(prev => prev.map(x => x.ideaId === s.ideaId ? { ...x, keyAssumption: e.target.value } : x))}
                              className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-2 py-1 text-[11px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-white/40 block">Biggest Risk</label>
                            <input
                              type="text"
                              value={s.biggestRisk}
                              onChange={e => setShortlisted(prev => prev.map(x => x.ideaId === s.ideaId ? { ...x, biggestRisk: e.target.value } : x))}
                              className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-2 py-1 text-[11px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-white/40 block">Next Analysis Task</label>
                            <select
                              value={s.nextAnalysisTask}
                              onChange={e => setShortlisted(prev => prev.map(x => x.ideaId === s.ideaId ? { ...x, nextAnalysisTask: e.target.value as ShortlistedIdea['nextAnalysisTask'] } : x))}
                              className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-2 py-1 text-[11px]"
                            >
                              <option value="task_15">Task 15 - 10 Types of Innovation</option>
                              <option value="task_16">Task 16 - Blue Ocean Strategy</option>
                              <option value="task_17">Task 17 - Business Model Canvas</option>
                              <option value="task_18">Task 18 - Customer Discovery</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Archive */}
            {activeTab === 6 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-[#B4F052]">Parked / Rejected Ideas Archive</h3>
                  <span className="text-xs text-white/40">{parkedRejected.length} in archive</span>
                </div>

                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {parkedRejected.map((item, idx) => {
                    const ideaName = importedIdeasList.find(x => x.id === item.ideaId)?.name || 'Unknown';
                    return (
                      <div key={item.ideaId} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{idx+1}. {ideaName}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase ${item.status === 'parked' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'}`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-white/40 block mb-0.5">Reason for archiving</label>
                            <input
                              type="text"
                              value={item.reason}
                              onChange={e => setParkedRejected(prev => prev.map(x => x.ideaId === item.ideaId ? { ...x, reason: e.target.value } : x))}
                              className="w-full bg-white/[0.02] border border-white/[0.08] rounded px-2.5 py-1 text-[11px]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-white/40 block mb-0.5">Revisit Condition</label>
                            <input
                              type="text"
                              value={item.revisitCondition}
                              onChange={e => setParkedRejected(prev => prev.map(x => x.ideaId === item.ideaId ? { ...x, revisitCondition: e.target.value } : x))}
                              className="w-full bg-white/[0.02] border border-white/[0.08] rounded px-2.5 py-1 text-[11px]"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Preview Panel */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="glass-card p-4 border border-white/[0.08]">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Shortlist Progress</h4>
            <div className="flex justify-between items-center text-xs mb-1">
              <span>Shortlisted Selected (3-5 required)</span>
              <span className={isTargetMet ? 'text-[#B4F052]' : 'text-rose-400'}>{shortlisted.length} / 5</span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${isTargetMet ? 'bg-[#B4F052]' : 'bg-rose-400'}`}
                style={{ width: `${Math.min((shortlisted.length / 5) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Quick List Preview */}
          <div className="glass-card p-4 border border-white/[0.08] space-y-3">
            <span className="text-xs font-bold text-white/40 block uppercase">Shortlist Matrix Preview</span>
            <div className="space-y-2">
              {shortlisted.map((s, idx) => {
                const ideaName = importedIdeasList.find(x => x.id === s.ideaId)?.name || 'Unknown';
                return (
                  <div key={s.ideaId} className="flex justify-between items-center text-xs p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                    <div>
                      <span className="font-bold text-[#B4F052] mr-2">#{idx+1}</span>
                      <span>{ideaName}</span>
                    </div>
                    <span className="text-[10px] text-white/50">{scoreMap.get(s.ideaId) || 0} pts</span>
                  </div>
                );
              })}
              {shortlisted.length === 0 && (
                <p className="text-xs text-white/30 italic text-center py-4">No ideas shortlisted yet.</p>
              )}
            </div>
          </div>

          {/* Save & Complete Button */}
          <div className="space-y-2">
            <button
              onClick={saveAll}
              className="w-full py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.02] transition-all flex items-center justify-center gap-1.5 text-xs font-bold"
            >
              <Save size={14} />
              Save Decision Matrix
            </button>
            <button
              onClick={handleComplete}
              disabled={!isTargetMet}
              className="w-full py-3 rounded-xl bg-[#B4F052] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 hover:opacity-95 disabled:opacity-40 transition-all shadow-md shadow-[#B4F052]/10"
            >
              Complete Task 14 and continue
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
