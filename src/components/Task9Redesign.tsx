/* eslint-disable */
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, ArrowRight, Layers, Star, AlertTriangle, Sparkles, FileText, Save, Info, Users, ShieldAlert, Zap, ClipboardList, BookOpen, Clock, Heart, Award, Copy, CheckSquare, Search, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface GapSummaryRow {
  gapArea: string;
  neededLevel: number;
  currentLevel: number;
  gap: number;
  roadmapRisk: string;
  suggestedSupport: string;
}

interface SupportModelRow {
  gapArea: string;
  supportModel: string;
  whyThisModel: string;
  urgency: string;
  riskIfMissing: string;
}

interface NeededRole {
  roleId: string;
  roleName: string;
  whyNeeded: string;
  roadmapRiskReduced: string;
  requiredCapabilities: string[];
  expectedContribution: string;
  supportType: string;
  timeHorizon: string;
  priority: string;
}

interface CoFounderAssess {
  roleId: string;
  roleName: string;
  centralToCompanyFuture: boolean;
  coreStrategicDecisionMaker: boolean;
  weeklyJudgmentNeeded: boolean;
  longTermOwnershipNeeded: boolean;
  equityJustified: boolean;
  alternativeSupportPossible: boolean;
  outcome: string;
}

interface CandidateCriteria {
  roleId: string;
  roleName: string;
  mustHaveSkills: string;
  mustHaveExperience: string;
  founderMindsetSignals: string;
  valuesAlignment: string;
  redFlags: string;
  networkAccessAdvantage: string;
  availabilityExpectations: string;
  riskTolerance: string;
  communicationStyle: string;
  decisionMakingStyle: string;
}

interface SearchChannelRow {
  channel: string;
  targetPeople: string;
  messageAngle: string;
  conversationGoal: number;
  deadline: string;
  status: string;
}

interface MentorshipNeed {
  area: string;
  whyNeeded: string;
  mentorQuestion: string;
  urgency: string;
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

const SUPPORT_MODELS = [
  { key: 'founder_learns', label: 'Founder learns it' },
  { key: 'ai_workflow', label: 'AI-assisted workflow' },
  { key: 'mentor', label: 'Mentor' },
  { key: 'advisor', label: 'Advisor' },
  { key: 'contractor', label: 'Contractor' },
  { key: 'fractional', label: 'Fractional expert' },
  { key: 'partner', label: 'Partner' },
  { key: 'employee_later', label: 'Employee later' },
  { key: 'co_founder', label: 'Co-founder' }
];

const PREDEFINED_ROLES = [
  { key: 'tech_builder', label: 'Technical Builder' },
  { key: 'product_thinker', label: 'Product Thinker' },
  { key: 'discovery_lead', label: 'Customer Discovery Lead' },
  { key: 'sales_lead', label: 'Growth / Sales Lead' },
  { key: 'ops_lead', label: 'Operations Lead' },
  { key: 'finance_support', label: 'Finance / Fundraising Support' },
  { key: 'legal_support', label: 'Legal / Compliance Support' },
  { key: 'ai_architect', label: 'AI Workflow Architect' },
  { key: 'brand_builder', label: 'Design / Brand Builder' },
  { key: 'partnership_builder', label: 'Community / Partnership Builder' }
];

const SEARCH_CHANNELS = [
  'Personal network', 'LinkedIn', 'Coworking spaces', 'Startup hubs', 'Founder communities',
  'University / research networks', 'Accelerators', 'Hackathons', 'Angel / investor referrals',
  'Industry communities', 'Co-founder platforms'
];

export default function Task9Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput, completedTasks } = useGarage();

  const isTask8Complete = completedTasks.includes(8);

  // Load Task 8 inputs
  const rawReadiness = getTaskInput(8, 'readinessSnapshot');
  const rawSkillGaps = getTaskInput(8, 'skillGapMap');
  const rawAiLeverage = getTaskInput(8, 'aiLeverageMap');
  const rawRules = getTaskInput(8, 'personalFounderRules');
  const stressSignals = getTaskInput(8, 'stressSignals') || 'Working past 10 PM, skipping meals, feeling defensive about feedback';

  // Load Task 5 context (North Star)
  const task5Vision = getTaskInput(5, 'vision') || 'No vision defined yet';
  const task5Mission = getTaskInput(5, 'mission') || 'No mission defined yet';
  const task5Values = getTaskInput(5, 'values') || 'No core values defined yet';

  const importedFOS = useMemo(() => {
    let readiness: any[] = [];
    let gaps: any[] = [];
    let aiMap: any[] = [];
    let rulesObj: any = {};
    try {
      if (rawReadiness) readiness = JSON.parse(rawReadiness);
      if (rawSkillGaps) gaps = JSON.parse(rawSkillGaps);
      if (rawAiLeverage) aiMap = JSON.parse(rawAiLeverage);
      if (rawRules) rulesObj = JSON.parse(rawRules);
    } catch (e) {}
    return { readiness, gaps, aiMap, rules: rulesObj };
  }, [rawReadiness, rawSkillGaps, rawAiLeverage, rawRules]);

  // Tab State
  const [activeTab, setActiveTab] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  // Section 1: Review Gaps & Questions
  const [strategicGapsNotes, setStrategicGapsNotes] = useState(() => getTaskInput(9, 'strategicGapsNotes') || 'Strategic gaps are engineering execution and pricing validation.');
  const [temporaryGapsNotes, setTemporaryGapsNotes] = useState(() => getTaskInput(9, 'temporaryGapsNotes') || 'Legal compliance and company incorporation are temporary.');
  const [aiGapsNotes, setAiGapsNotes] = useState(() => getTaskInput(9, 'aiGapsNotes') || 'Social media drafts and basic landing page assets can be done by AI.');
  const [humanTrustNotes, setHumanTrustNotes] = useState(() => getTaskInput(9, 'humanTrustNotes') || 'High trust is required for B2B contracts and core architectural design.');
  const [blockingGapsNotes, setBlockingGapsNotes] = useState(() => getTaskInput(9, 'blockingGapsNotes') || 'A lack of sales/user discovery would block roadmap phase 1.');

  // Section 2: Support Models
  const [supportModels, setSupportModels] = useState<SupportModelRow[]>(() => {
    const raw = getTaskInput(9, 'supportModels');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    // Pre-populate with gaps from Task 8
    const task8Gaps = importedFOS.gaps.filter((g: any) => g.gap > 0) || [];
    return task8Gaps.map((g: any) => ({
      gapArea: g.skillArea,
      supportModel: g.howToCover || 'learn',
      whyThisModel: `Covering gap in ${g.skillArea}`,
      urgency: 'medium',
      riskIfMissing: 'Delays MVP delivery'
    }));
  });

  // Section 3: Needed Roles
  const [neededRoles, setNeededRoles] = useState<NeededRole[]>(() => {
    const raw = getTaskInput(9, 'neededRoles');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [
      {
        roleId: 'tech_builder',
        roleName: 'Technical Builder',
        whyNeeded: 'Need someone to execute the MVP code',
        roadmapRiskReduced: 'Delays in coding',
        requiredCapabilities: ['Next.js', 'Typescript', 'Database configuration'],
        expectedContribution: 'Building product iterations',
        supportType: 'fractional',
        timeHorizon: 'now',
        priority: 'must_have'
      }
    ];
  });

  // Section 4: Co-founder Need Assessment
  const [coFounderAssessment, setCoFounderAssessment] = useState<CoFounderAssess[]>(() => {
    const raw = getTaskInput(9, 'coFounderAssessment');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [];
  });

  // Sync co-founder assessments when neededRoles changes
  useEffect(() => {
    setCoFounderAssessment(prev => {
      return neededRoles.map(role => {
        const existing = prev.find(p => p.roleId === role.roleId);
        if (existing) return { ...existing, roleName: role.roleName };
        return {
          roleId: role.roleId,
          roleName: role.roleName,
          centralToCompanyFuture: false,
          coreStrategicDecisionMaker: false,
          weeklyJudgmentNeeded: false,
          longTermOwnershipNeeded: false,
          equityJustified: false,
          alternativeSupportPossible: true,
          outcome: 'advisor_or_fractional_is_enough'
        };
      });
    });
  }, [neededRoles]);

  // Section 5: Candidate Criteria
  const [candidateCriteria, setCandidateCriteria] = useState<CandidateCriteria[]>(() => {
    const raw = getTaskInput(9, 'candidateCriteria');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [];
  });

  // Sync criteria when neededRoles changes
  useEffect(() => {
    setCandidateCriteria(prev => {
      return neededRoles.map(role => {
        const existing = prev.find(p => p.roleId === role.roleId);
        if (existing) return { ...existing, roleName: role.roleName };
        return {
          roleId: role.roleId,
          roleName: role.roleName,
          mustHaveSkills: 'Full-stack development, API integration',
          mustHaveExperience: 'Shipped at least one SaaS product or MVP',
          founderMindsetSignals: 'High agency, builds in public, tolerates ambiguity',
          valuesAlignment: 'Shares customer empathy and transparency',
          redFlags: 'Requires high salary upfront, low communication bandwidth',
          networkAccessAdvantage: 'Access to developer communities',
          availabilityExpectations: 'Part-time (20h/week) testing phase, scaling to full-time',
          riskTolerance: 'Willing to work for equity during early validation',
          communicationStyle: 'Asynchronous updates, direct feedback',
          decisionMakingStyle: 'Consent-based, data-driven'
        };
      });
    });
  }, [neededRoles]);

  // Section 6: Collaboration Principles
  const [collaborationPrinciples, setCollaborationPrinciples] = useState(() => {
    const raw = getTaskInput(9, 'collaborationPrinciples');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return {
      testBeforeFormalizing: 'A 2-week paid or milestone-based sandbox project where we build a minor feature together.',
      proofBeforeEquity: 'Vesting schedule with a 1-year cliff based on hitting functional milestones.',
      decisionsMadeTogether: 'Strategic direction, core feature scope, funding models, equity splits.',
      founderLedDecisions: 'Day-to-day operations, marketing copy, AI tool integrations.',
      conflictHandling: 'Direct honest conversation, escalation to a mutual advisor if blocked.',
      commitmentDefinition: 'Consistent weekly hours committed and attendance at Friday retros.',
      partnershipFailureSignals: 'Lack of updates for 3 days, missed sandboxing targets, misalignment on equity.'
    };
  });

  // Section 7: Equity Discussion Principles
  const [equityPrinciples, setEquityPrinciples] = useState(() => {
    const raw = getTaskInput(9, 'equityPrinciples');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return {
      longTermCommitment: 'Equity is earned over time (4-year vesting schedule with a 1-year cliff).',
      riskTaken: 'Early co-founders taking zero salary receive higher equity shares than later hires.',
      strategicImportance: 'Core technical or growth co-founders receive substantial stakes.',
      contributionLevel: 'Measured by execution speed, customer discovery access, and proprietary IP creation.',
      timingOfJoining: 'The earliest stages represent the highest risk, which is rewarded accordingly.',
      replaceabilityOfRole: 'Hard-to-hire skills get premium consideration.',
      vestingAndCliffs: 'Vesting is non-negotiable to protect the company from early departures.'
    };
  });

  // Section 8: Search & Outreach Plan
  const [searchOutreachPlan, setSearchOutreachPlan] = useState<SearchChannelRow[]>(() => {
    const raw = getTaskInput(9, 'searchOutreachPlan');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [
      { channel: 'LinkedIn', targetPeople: 'Fractional developers / builders', messageAngle: 'Problem validation in AI-driven startups', conversationGoal: 5, deadline: 'End of next week', status: 'not_started' },
      { channel: 'Co-founder platforms', targetPeople: 'SaaS engineers with design interest', messageAngle: 'Shared mission to simplify tool operations', conversationGoal: 3, deadline: '2 weeks out', status: 'not_started' }
    ];
  });
  const [outreachMessageDraft, setOutreachMessageDraft] = useState(() => {
    return getTaskInput(9, 'outreachMessageDraft') || `Hi [Name],

I saw your portfolio of building lightweight tools and loved your project on [X].

I’m building a project at the Innovation Center at BusinessHUB / District.org, solving the operational checklist overload for early founders. I'm looking for a partner with strong technical builder capabilities who aligns with our core mission of democratizing startup setups.

Would you be open to a 15-minute virtual coffee to share feedback or explore a sandbox collaboration?

Best,
[Founder Name]`;
  });

  // Mentorship Needs for Task 10
  const [mentorshipNeeds, setMentorshipNeeds] = useState<MentorshipNeed[]>(() => {
    const raw = getTaskInput(9, 'mentorshipNeedsForTask10');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [
      { area: 'Technical Architecture', whyNeeded: 'Evaluating serverless vs database limits for scaling checklist inventories', mentorQuestion: 'What setup provides the lowest server maintenance overhead for a solo founder?', urgency: 'medium' },
      { area: 'B2B Sales', whyNeeded: 'Negotiating pilot programs with local startup hubs', mentorQuestion: 'How should we structure early pilot terms to ensure high feedback participation?', urgency: 'high' }
    ];
  });

  // Re-populate support models if imported gaps list changes
  useEffect(() => {
    if (importedFOS.gaps.length > 0 && supportModels.length === 0) {
      const activeGaps = importedFOS.gaps.filter((g: any) => g.gap > 0) || [];
      setSupportModels(activeGaps.map((g: any) => ({
        gapArea: g.skillArea,
        supportModel: g.howToCover || 'learn',
        whyThisModel: `Calculated gap level is ${g.gap}`,
        urgency: 'medium',
        riskIfMissing: 'Delays validation'
      })));
    }
  }, [importedFOS.gaps]);

  const generatedBlueprintMarkdown = useMemo(() => {
    const gapRows = supportModels.map(s => {
      return `| ${s.gapArea} | ${s.supportModel} | ${s.whyThisModel} | ${s.urgency} | ${s.riskIfMissing} |`;
    }).join('\n');

    const roleRows = neededRoles.map(r => {
      return `| ${r.roleName} | ${r.supportType} | ${r.priority} | ${r.timeHorizon} | ${r.roadmapRiskReduced} |`;
    }).join('\n');

    const cofounderRows = coFounderAssessment.map(c => {
      return `| ${c.roleName} | Central: ${c.centralToCompanyFuture ? 'Y' : 'N'} | Strategic: ${c.coreStrategicDecisionMaker ? 'Y' : 'N'} | Judgment: ${c.weeklyJudgmentNeeded ? 'Y' : 'N'} | Equity Justified: ${c.equityJustified ? 'Y' : 'N'} | Outcome: ${c.outcome} |`;
    }).join('\n');

    const criteriaRows = candidateCriteria.map(cc => {
      return `### Candidate Profile: ${cc.roleName}
- **Must-Have Skills**: ${cc.mustHaveSkills}
- **Experience**: ${cc.mustHaveExperience}
- **Mindset Signals**: ${cc.founderMindsetSignals}
- **Values Alignment**: ${cc.valuesAlignment}
- **Red Flags**: ${cc.redFlags}
- **Availability & Risk**: Availability: ${cc.availabilityExpectations}, Risk Tolerance: ${cc.riskTolerance}
- **Communication & Style**: Comm Style: ${cc.communicationStyle}, Decisions: ${cc.decisionMakingStyle}`;
    }).join('\n\n');

    const searchRows = searchOutreachPlan.map(s => {
      return `| ${s.channel} | ${s.targetPeople} | ${s.messageAngle} | Goal: ${s.conversationGoal} | ${s.deadline} | ${s.status} |`;
    }).join('\n');

    const mentorRows = mentorshipNeeds.map(m => {
      return `| ${m.area} | ${m.whyNeeded} | ${m.mentorQuestion} | ${m.urgency} |`;
    }).join('\n');

    return `# Founding Team & Support Blueprint

## 1. Skill Gap & Support Models
| Gap Area | Selected Support Model | Rationale | Urgency | Risk if Missing |
| --- | --- | --- | --- | --- |
${gapRows}

## 2. Needed Founding Capabilities & Roles
| Role Name | Support Type | Priority | Timing | Roadmap Risk Reduced |
| --- | --- | --- | --- | --- |
${roleRows}

## 3. Co-founder Necessity Assessment
| Role | Central Future? | Decision Maker? | Weekly Judgment? | Equity Justified? | Final Support Outcome |
| --- | :---: | :---: | :---: | :---: | --- |
${cofounderRows}

## 4. Candidate Criteria Profiles
${criteriaRows}

## 5. Collaboration Sandbox Principles
- **Sandbox Test**: ${collaborationPrinciples.testBeforeFormalizing}
- **Milestone Proof**: ${collaborationPrinciples.proofBeforeEquity}
- **Joint Decisions**: ${collaborationPrinciples.decisionsMadeTogether}
- **Founder-led Decisions**: ${collaborationPrinciples.founderLedDecisions}
- **Conflict Protocol**: ${collaborationPrinciples.conflictHandling}
- **Commitment Definition**: ${collaborationPrinciples.commitmentDefinition}
- **Failure Signals**: ${collaborationPrinciples.partnershipFailureSignals}

## 6. Non-Legal Equity Principles
- **Vesting Policy**: ${equityPrinciples.vestingAndCliffs}
- **Commitment weight**: ${equityPrinciples.longTermCommitment}
- **Risk weighting**: ${equityPrinciples.riskTaken}
- **Strategic value**: ${equityPrinciples.strategicImportance}
- **IP / Contribution value**: ${equityPrinciples.contributionLevel}
- **Replaceability factor**: ${equityPrinciples.replaceabilityOfRole}

*Note: This is a guide to align conversations, not a binding legal split.*

## 7. Search & Outreach Strategy
| Channel | Target Profile | Message Focus | Conversation Goal | Target Date | Status |
| --- | --- | --- | --- | --- | --- |
${searchRows}

### Outreach Pitch Draft
\`\`\`text
${outreachMessageDraft}
\`\`\`

## 8. Mentorship Requirements for Task 10
| Domain Area | Context / Need | Core Mentor Question | Urgency |
| --- | --- | --- | --- |
${mentorRows}
`;
  }, [supportModels, neededRoles, coFounderAssessment, candidateCriteria, collaborationPrinciples, equityPrinciples, searchOutreachPlan, outreachMessageDraft, mentorshipNeeds]);

  // Sync local states to Context
  const saveAll = () => {
    setTaskInput(9, 'strategicGapsNotes', strategicGapsNotes);
    setTaskInput(9, 'temporaryGapsNotes', temporaryGapsNotes);
    setTaskInput(9, 'aiGapsNotes', aiGapsNotes);
    setTaskInput(9, 'humanTrustNotes', humanTrustNotes);
    setTaskInput(9, 'blockingGapsNotes', blockingGapsNotes);
    setTaskInput(9, 'supportModels', JSON.stringify(supportModels));
    setTaskInput(9, 'neededRoles', JSON.stringify(neededRoles));
    setTaskInput(9, 'coFounderAssessment', JSON.stringify(coFounderAssessment));
    setTaskInput(9, 'candidateCriteria', JSON.stringify(candidateCriteria));
    setTaskInput(9, 'collaborationPrinciples', JSON.stringify(collaborationPrinciples));
    setTaskInput(9, 'equityPrinciples', JSON.stringify(equityPrinciples));
    setTaskInput(9, 'searchOutreachPlan', JSON.stringify(searchOutreachPlan));
    setTaskInput(9, 'outreachMessageDraft', outreachMessageDraft);
    setTaskInput(9, 'mentorshipNeedsForTask10', JSON.stringify(mentorshipNeeds));

    // Save final compiled reports
    setTaskInput(9, 'notes', generatedBlueprintMarkdown);
    setTaskInput(9, 'deliverable', 'Founding Team & Support Blueprint');
  };

  useEffect(() => {
    saveAll();
  }, [strategicGapsNotes, temporaryGapsNotes, aiGapsNotes, humanTrustNotes, blockingGapsNotes, supportModels, neededRoles, coFounderAssessment, candidateCriteria, collaborationPrinciples, equityPrinciples, searchOutreachPlan, outreachMessageDraft, mentorshipNeeds, generatedBlueprintMarkdown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedBlueprintMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = () => {
    saveAll();
    completeTask(9);
    router.push('/tasks/10');
  };

  if (!isTask8Complete) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="glass-card p-8 border border-white/[0.08] inline-block max-w-lg bg-black/40">
          <AlertTriangle className="mx-auto mb-4 text-[#B4F052]" size={48} />
          <h2 className="text-xl font-bold mb-2">Task 8 Incomplete</h2>
          <p className="text-white/60 mb-6 text-sm">
            Please finish and complete Task 8 (Master Founder Fundamentals) to compile your personal readiness snapshot, skill gaps, and energy standards.
          </p>
          <Link href="/tasks/8" className="inline-flex items-center gap-2 glass-button px-6 py-3 rounded-xl text-sm font-semibold transition-all">
            Go to Task 8
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
            Task 9
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Round Out Founding Team</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Design your founding support blueprint. Assess co-founder necessity, classify skills support models, establish sandboxing principles, and outline outreach pitches.
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
            <div className="text-white font-semibold">~8 hours</div>
          </div>
        </div>
      </div>

      {/* Warning Callout */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] border-l-4 border-l-[#B4F052] mb-8 text-sm flex gap-3">
        <Info className="text-[#B4F052] flex-shrink-0 mt-0.5" size={18} />
        <div>
          <span className="font-bold text-white">Rule:</span> Do not assume you need a co-founder by default. First identify the gaps, then decide whether each gap needs a co-founder, advisor, contractor, mentor, partner, employee or AI-assisted workflow.
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Wizard Form Panel (Col Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs header */}
          <div className="flex border-b border-white/[0.08] overflow-x-auto pb-px gap-2">
            {[
              { id: 1, label: '1. Review Gaps' },
              { id: 2, label: '2. Support Model' },
              { id: 3, label: '3. Define Roles' },
              { id: 4, label: '4. Co-founder Assessment' },
              { id: 5, label: '5. Candidate Criteria' },
              { id: 6, label: '6. Collaboration' },
              { id: 7, label: '7. Equity' },
              { id: 8, label: '8. Outreach & Output' }
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
            {/* Tab 1: Review Gaps */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <ClipboardList size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 1: Review Founder Skill Gaps</h3>
                </div>
                <p className="text-xs text-white/60">
                  Analyze skill gaps against the streamlined roadmap. Differentiate between long-term strategic support and short-term project tasks.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Which gaps are strategic and long-term?</label>
                    <textarea
                      value={strategicGapsNotes}
                      onChange={e => setStrategicGapsNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Which gaps are temporary or project-based?</label>
                    <textarea
                      value={temporaryGapsNotes}
                      onChange={e => setTemporaryGapsNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Which gaps can be covered by AI workflows?</label>
                    <textarea
                      value={aiGapsNotes}
                      onChange={e => setAiGapsNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Which gaps require high human trust, judgment or network?</label>
                    <textarea
                      value={humanTrustNotes}
                      onChange={e => setHumanTrustNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Which gaps would block roadmap progress if left unsolved?</label>
                    <textarea
                      value={blockingGapsNotes}
                      onChange={e => setBlockingGapsNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#B4F052]/40"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Support Models */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Zap size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 2: Decide Support Models</h3>
                </div>
                <p className="text-xs text-white/60">
                  Assign support models to each of your active gaps. Avoid hiring co-founders for narrow, temporary tasks.
                </p>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {supportModels.map((item, idx) => {
                    const skillObj = SKILL_AREAS.find(s => s.key === item.gapArea);
                    return (
                      <div key={item.gapArea} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] space-y-2 text-xs">
                        <div className="font-bold text-[#B4F052]">Gap: {skillObj?.label || item.gapArea}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] text-white/40 block mb-0.5">Best Support Model</label>
                            <select
                              value={item.supportModel}
                              onChange={e => {
                                const val = e.target.value;
                                setSupportModels(prev => prev.map((it, i) => i === idx ? { ...it, supportModel: val } : it));
                              }}
                              className="w-full bg-black border border-white/20 text-xs rounded px-2 py-1 text-white focus:outline-none focus:border-[#B4F052]/40"
                            >
                              {SUPPORT_MODELS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] text-white/40 block mb-0.5">Urgency</label>
                            <select
                              value={item.urgency}
                              onChange={e => {
                                const val = e.target.value;
                                setSupportModels(prev => prev.map((it, i) => i === idx ? { ...it, urgency: val } : it));
                              }}
                              className="w-full bg-black border border-white/20 text-xs rounded px-2 py-1 text-white focus:outline-none focus:border-[#B4F052]/40"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[9px] text-white/40 block mb-0.5">Why this model & Risk if missing</label>
                            <input
                              type="text"
                              value={item.whyThisModel}
                              onChange={e => {
                                const val = e.target.value;
                                setSupportModels(prev => prev.map((it, i) => i === idx ? { ...it, whyThisModel: val } : it));
                              }}
                              className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                              placeholder="Describe your reasoning..."
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: Define Roles */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Users size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 3: Define Core Roles</h3>
                </div>
                <p className="text-xs text-white/60">
                  Translate support needs into core capability roles. Detail expected contributions and priority.
                </p>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {neededRoles.map((role, idx) => (
                    <div key={role.roleId} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] space-y-2 text-xs">
                      <div className="font-semibold text-[#B4F052] flex justify-between">
                        <span>Role: {role.roleName}</span>
                        <button
                          type="button"
                          onClick={() => setNeededRoles(prev => prev.filter((_, i) => i !== idx))}
                          className="text-white/30 hover:text-rose-400 text-[10px] uppercase font-mono"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Role Name</label>
                          <input
                            type="text"
                            value={role.roleName}
                            onChange={e => {
                              const val = e.target.value;
                              setNeededRoles(prev => prev.map((it, i) => i === idx ? { ...it, roleName: val } : it));
                            }}
                            className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Expected Contribution</label>
                          <input
                            type="text"
                            value={role.expectedContribution}
                            onChange={e => {
                              const val = e.target.value;
                              setNeededRoles(prev => prev.map((it, i) => i === idx ? { ...it, expectedContribution: val } : it));
                            }}
                            className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Support Type</label>
                          <select
                            value={role.supportType}
                            onChange={e => {
                              const val = e.target.value;
                              setNeededRoles(prev => prev.map((it, i) => i === idx ? { ...it, supportType: val } : it));
                            }}
                            className="w-full bg-black border border-white/20 text-xs rounded px-2 py-1 text-white focus:outline-none"
                          >
                            <option value="co-founder">Co-founder</option>
                            <option value="advisor">Advisor</option>
                            <option value="contractor">Contractor</option>
                            <option value="fractional">Fractional expert</option>
                            <option value="partner">Partner</option>
                            <option value="later_hire">Later hire</option>
                            <option value="ai-assisted">AI-assisted</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Time Horizon</label>
                          <select
                            value={role.timeHorizon}
                            onChange={e => {
                              const val = e.target.value;
                              setNeededRoles(prev => prev.map((it, i) => i === idx ? { ...it, timeHorizon: val } : it));
                            }}
                            className="w-full bg-black border border-white/20 text-xs rounded px-2 py-1 text-[#B4F052] focus:outline-none font-bold"
                          >
                            <option value="now">Now</option>
                            <option value="next 3 months">Next 3 months</option>
                            <option value="3-6 months">3-6 months</option>
                            <option value="later">Later</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Priority</label>
                          <select
                            value={role.priority}
                            onChange={e => {
                              const val = e.target.value;
                              setNeededRoles(prev => prev.map((it, i) => i === idx ? { ...it, priority: val } : it));
                            }}
                            className="w-full bg-black border border-white/20 text-xs rounded px-2 py-1 text-white focus:outline-none"
                          >
                            <option value="must_have">Must-Have</option>
                            <option value="nice_to_have">Nice-To-Have</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Roadmap Risk Reduced</label>
                          <input
                            type="text"
                            value={role.roadmapRiskReduced}
                            onChange={e => {
                              const val = e.target.value;
                              setNeededRoles(prev => prev.map((it, i) => i === idx ? { ...it, roadmapRiskReduced: val } : it));
                            }}
                            className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <select
                      onChange={e => {
                        const val = e.target.value;
                        if (val) {
                          const roleLabel = PREDEFINED_ROLES.find(r => r.key === val)?.label || 'Custom Role';
                          setNeededRoles(prev => [...prev, {
                            roleId: val,
                            roleName: roleLabel,
                            whyNeeded: '',
                            roadmapRiskReduced: '',
                            requiredCapabilities: [],
                            expectedContribution: '',
                            supportType: 'fractional',
                            timeHorizon: 'now',
                            priority: 'must_have'
                          }]);
                        }
                      }}
                      className="bg-black border border-white/20 text-xs rounded px-3 py-2 text-white focus:outline-none"
                      defaultValue=""
                    >
                      <option value="" disabled>Add from role list...</option>
                      {PREDEFINED_ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const randomId = 'custom_' + Date.now();
                        setNeededRoles(prev => [...prev, {
                          roleId: randomId,
                          roleName: 'Custom Builder Role',
                          whyNeeded: '',
                          roadmapRiskReduced: '',
                          requiredCapabilities: [],
                          expectedContribution: '',
                          supportType: 'fractional',
                          timeHorizon: 'now',
                          priority: 'must_have'
                        }]);
                      }}
                      className="border border-dashed border-white/20 hover:border-[#B4F052]/50 hover:bg-[#B4F052]/5 transition-all text-xs font-semibold py-2 rounded-xl"
                    >
                      Add Custom Role
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Co-founder Assessment */}
            {activeTab === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <ShieldAlert size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 4: Co-founder Need Assessment</h3>
                </div>
                <p className="text-xs text-white/60">
                  Assess if you truly need a co-founder for each of your defined builder roles, protecting precious early-stage equity.
                </p>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {coFounderAssessment.map((assess, idx) => (
                    <div key={assess.roleId} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 text-xs">
                      <div className="font-extrabold text-[#B4F052] border-b border-white/5 pb-1">
                        Assess necessity for: {assess.roleName}
                      </div>
                      <div className="space-y-2">
                        {[
                          { key: 'centralToCompanyFuture', label: 'Is this gap central to the company’s future?' },
                          { key: 'coreStrategicDecisionMaker', label: 'Will this person make core strategic decisions with you?' },
                          { key: 'weeklyJudgmentNeeded', label: 'Do you need this person’s judgment every week?' },
                          { key: 'longTermOwnershipNeeded', label: 'Would this person own a critical part of the company for years?' },
                          { key: 'equityJustified', label: 'Is the relationship important enough to justify equity?' },
                          { key: 'alternativeSupportPossible', label: 'Could this need be solved by advisor, contractor, partner or AI instead?' }
                        ].map(q => {
                          const val = (assess as any)[q.key] as boolean;
                          return (
                            <div key={q.key} className="flex justify-between items-center text-[11px]">
                              <span className="text-white/80">{q.label}</span>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCoFounderAssessment(prev => prev.map(p => p.roleId === assess.roleId ? { ...p, [q.key]: true } : p));
                                  }}
                                  className={`px-2 py-0.5 rounded font-bold uppercase ${val ? 'bg-[#B4F052] text-black' : 'bg-white/5 text-white/40'}`}
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCoFounderAssessment(prev => prev.map(p => p.roleId === assess.roleId ? { ...p, [q.key]: false } : p));
                                  }}
                                  className={`px-2 py-0.5 rounded font-bold uppercase ${!val ? 'bg-rose-500 text-white' : 'bg-white/5 text-white/40'}`}
                                >
                                  No
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                        <span className="text-[10px] text-white/40">Calculated Assessment Model Outcome:</span>
                        <select
                          value={assess.outcome}
                          onChange={e => {
                            const val = e.target.value;
                            setCoFounderAssessment(prev => prev.map(p => p.roleId === assess.roleId ? { ...p, outcome: val } : p));
                          }}
                          className="bg-black border border-white/20 text-xs rounded px-2 py-1 text-[#B4F052] focus:outline-none font-bold"
                        >
                          <option value="co_founder_strongly_needed">Co-founder strongly needed</option>
                          <option value="potential_co_founder">Potential co-founder, validate first</option>
                          <option value="advisor_or_fractional_is_enough">Advisor / fractional expert is enough</option>
                          <option value="contractor_is_enough">Contractor is enough</option>
                          <option value="ai_and_learning_is_enough">AI + founder learning is enough</option>
                          <option value="later_hire">Later hire</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Candidate Criteria */}
            {activeTab === 5 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Award size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 5: Define Candidate Criteria</h3>
                </div>
                <p className="text-xs text-white/60">
                  Build criteria profiles for candidates. Ensure values alignment by checking imported Task 5 statements.
                </p>

                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {candidateCriteria.map((cc, idx) => (
                    <div key={cc.roleId} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 text-xs">
                      <div className="font-extrabold text-[#B4F052] border-b border-white/5 pb-1">
                        Criteria for: {cc.roleName}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Must-Have Skills</label>
                          <input
                            type="text"
                            value={cc.mustHaveSkills}
                            onChange={e => {
                              const val = e.target.value;
                              setCandidateCriteria(prev => prev.map(p => p.roleId === cc.roleId ? { ...p, mustHaveSkills: val } : p));
                            }}
                            className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Must-Have Experience</label>
                          <input
                            type="text"
                            value={cc.mustHaveExperience}
                            onChange={e => {
                              const val = e.target.value;
                              setCandidateCriteria(prev => prev.map(p => p.roleId === cc.roleId ? { ...p, mustHaveExperience: val } : p));
                            }}
                            className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Founder Mindset Signals (High agency/Ownership)</label>
                          <input
                            type="text"
                            value={cc.founderMindsetSignals}
                            onChange={e => {
                              const val = e.target.value;
                              setCandidateCriteria(prev => prev.map(p => p.roleId === cc.roleId ? { ...p, founderMindsetSignals: val } : p));
                            }}
                            className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Values Alignment (Check Task 5: {task5Values.slice(0, 30)}...)</label>
                          <input
                            type="text"
                            value={cc.valuesAlignment}
                            onChange={e => {
                              const val = e.target.value;
                              setCandidateCriteria(prev => prev.map(p => p.roleId === cc.roleId ? { ...p, valuesAlignment: val } : p));
                            }}
                            className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Red Flags / Dealbreakers</label>
                          <input
                            type="text"
                            value={cc.redFlags}
                            onChange={e => {
                              const val = e.target.value;
                              setCandidateCriteria(prev => prev.map(p => p.roleId === cc.roleId ? { ...p, redFlags: val } : p));
                            }}
                            className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Decision-Making Style</label>
                          <input
                            type="text"
                            value={cc.decisionMakingStyle}
                            onChange={e => {
                              const val = e.target.value;
                              setCandidateCriteria(prev => prev.map(p => p.roleId === cc.roleId ? { ...p, decisionMakingStyle: val } : p));
                            }}
                            className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 6: Collaboration sandbox */}
            {activeTab === 6 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Clock size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 6: Collaboration Sandboxing Principles</h3>
                </div>
                <p className="text-xs text-white/60">
                  Establish parameters to test collaboration in a sandbox before making the team structure formal.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-white/40 block mb-1">How will we test collaboration before making it formal?</label>
                    <textarea
                      value={collaborationPrinciples.testBeforeFormalizing}
                      onChange={e => setCollaborationPrinciples({ ...collaborationPrinciples, testBeforeFormalizing: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">What should this person prove before receiving significant equity?</label>
                    <textarea
                      value={collaborationPrinciples.proofBeforeEquity}
                      onChange={e => setCollaborationPrinciples({ ...collaborationPrinciples, proofBeforeEquity: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">What decisions must be made together?</label>
                    <textarea
                      value={collaborationPrinciples.decisionsMadeTogether}
                      onChange={e => setCollaborationPrinciples({ ...collaborationPrinciples, decisionsMadeTogether: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">What decisions remain founder-led?</label>
                    <textarea
                      value={collaborationPrinciples.founderLedDecisions}
                      onChange={e => setCollaborationPrinciples({ ...collaborationPrinciples, founderLedDecisions: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">What would make this partnership fail?</label>
                    <textarea
                      value={collaborationPrinciples.partnershipFailureSignals}
                      onChange={e => setCollaborationPrinciples({ ...collaborationPrinciples, partnershipFailureSignals: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 7: Equity Discussion */}
            {activeTab === 7 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Heart size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 7: Equity Discussion Principles</h3>
                </div>
                <p className="text-xs text-white/60">
                  Outline basic split variables to guide candidate alignments. Equity splits should align with contribution levels and vesting schedules.
                </p>

                <div className="p-3 bg-rose-500/5 border border-rose-500/20 text-[10px] text-rose-200/80 rounded-xl mb-4">
                  Note: This is not a legal agreement. Use this to prepare for founder conversations and later legal review.
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Vesting & Cliff policy guidelines (e.g., 4 years vesting with a 1-year cliff)</label>
                    <input
                      type="text"
                      value={equityPrinciples.vestingAndCliffs}
                      onChange={e => setEquityPrinciples({ ...equityPrinciples, vestingAndCliffs: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">How will long-term commitment affect splits?</label>
                    <input
                      type="text"
                      value={equityPrinciples.longTermCommitment}
                      onChange={e => setEquityPrinciples({ ...equityPrinciples, longTermCommitment: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">How will the timing of joining (first day vs 6 months later) be rewarded?</label>
                    <input
                      type="text"
                      value={equityPrinciples.timingOfJoining}
                      onChange={e => setEquityPrinciples({ ...equityPrinciples, timingOfJoining: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">How will risk taken (working for zero salary) weigh in?</label>
                    <input
                      type="text"
                      value={equityPrinciples.riskTaken}
                      onChange={e => setEquityPrinciples({ ...equityPrinciples, riskTaken: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 8: Outreach & Output */}
            {activeTab === 8 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Search size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 8: Search Plan & Support Blueprint</h3>
                </div>
                <p className="text-xs text-white/60">
                  Track outreach channels, customize target candidate messages, and generate the final support blueprint.
                </p>

                <div className="space-y-3">
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    {searchOutreachPlan.map((channelItem, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white/[0.01] border border-white/[0.04] grid grid-cols-6 gap-2 text-[10px] items-center">
                        <span className="col-span-1 font-bold text-white">{channelItem.channel}</span>
                        <input
                          type="text"
                          value={channelItem.targetPeople}
                          onChange={e => {
                            const val = e.target.value;
                            setSearchOutreachPlan(prev => prev.map((s, i) => i === idx ? { ...s, targetPeople: val } : s));
                          }}
                          placeholder="Target profiles"
                          className="col-span-2 bg-transparent border-b border-white/20 focus:border-[#B4F052] text-white focus:outline-none"
                        />
                        <input
                          type="number"
                          value={channelItem.conversationGoal}
                          onChange={e => {
                            const val = parseInt(e.target.value) || 0;
                            setSearchOutreachPlan(prev => prev.map((s, i) => i === idx ? { ...s, conversationGoal: val } : s));
                          }}
                          placeholder="Goal"
                          className="col-span-1 bg-transparent border-b border-white/20 focus:border-[#B4F052] text-white focus:outline-none text-center"
                        />
                        <select
                          value={channelItem.status}
                          onChange={e => {
                            const val = e.target.value;
                            setSearchOutreachPlan(prev => prev.map((s, i) => i === idx ? { ...s, status: val } : s));
                          }}
                          className="col-span-2 bg-black border border-white/20 rounded text-[9px] text-[#B4F052] focus:outline-none font-bold"
                        >
                          <option value="not_started">Not Started</option>
                          <option value="active">Active</option>
                          <option value="completed">Done</option>
                        </select>
                      </div>
                    ))}
                    
                    <div className="flex gap-2">
                      <select
                        onChange={e => {
                          const val = e.target.value;
                          if (val) {
                            setSearchOutreachPlan(prev => [...prev, { channel: val, targetPeople: '', messageAngle: '', conversationGoal: 5, deadline: '', status: 'not_started' }]);
                          }
                        }}
                        className="bg-black border border-white/20 text-[10px] rounded px-2 py-1 text-white focus:outline-none"
                        defaultValue=""
                      >
                        <option value="" disabled>Add channel...</option>
                        {SEARCH_CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/40 block mb-1">Outreach Message Draft</label>
                    <textarea
                      value={outreachMessageDraft}
                      onChange={e => setOutreachMessageDraft(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none font-mono"
                      rows={4}
                    />
                  </div>

                  <div className="border-t border-white/[0.06] pt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#B4F052] uppercase tracking-wider flex items-center gap-1">
                        <FileText size={14} /> Output Preview: founding team blueprint
                      </span>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="text-[10px] text-white/60 hover:text-white border border-white/20 rounded-lg px-2.5 py-1 flex items-center gap-1 transition-all"
                      >
                        <Copy size={12} />
                        {copied ? 'Copied!' : 'Copy Blueprint'}
                      </button>
                    </div>
                    <pre className="p-4 rounded-xl border border-white/[0.08] bg-black/80 font-mono text-[9px] text-white/70 overflow-x-auto whitespace-pre-wrap max-h-48">
                      {generatedBlueprintMarkdown}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
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
                onClick={() => setActiveTab(prev => Math.min(8, prev + 1))}
                disabled={activeTab === 8}
                className="px-4 py-2 rounded-xl text-xs bg-[#B4F052] text-black font-semibold hover:opacity-90 disabled:opacity-40 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Live Support Blueprint Info Sidepanel */}
        <div className="space-y-6">
          <div className="glass-card p-6 border border-white/[0.08] bg-black/60 backdrop-blur-md space-y-6">
            <div className="border-b border-white/[0.08] pb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FileText size={16} className="text-[#B4F052]" />
                <h3 className="text-sm font-bold text-white">Founder OS Input</h3>
              </div>
              <span className="text-[9px] font-mono text-[#B4F052]">Task 8</span>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 text-xs">
              <div className="bg-[#B4F052]/5 border border-[#B4F052]/10 p-2.5 rounded-xl space-y-1">
                <span className="font-bold block text-[10px] text-[#B4F052] uppercase">Wellbeing Guard stress signals:</span>
                <p className="text-[10px] text-white/70 italic">"{getTaskInput(8, 'stressSignals') || 'Working past 10 PM, skipping meals, feeling defensive about feedback'}"</p>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold block text-[10px] text-white/50 uppercase">Imported Skill Gaps:</span>
                {importedFOS.gaps.length === 0 ? (
                  <div className="text-[10px] text-white/40 italic">No gaps loaded. Verify Task 8 is complete.</div>
                ) : (
                  importedFOS.gaps.map(g => (
                    <div key={g.skillArea} className="p-2 rounded bg-white/[0.01] border border-white/[0.03] text-[10px] flex justify-between">
                      <span className="text-white/80">{g.skillArea.replace('_', ' ')}</span>
                      <span className="text-rose-400 font-bold">Gap: {g.gap}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Mentorship requirements sync info */}
            <div className="bg-[#B4F052]/5 border border-[#B4F052]/10 p-3 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#B4F052]">
                <MessageSquare size={13} />
                <span>Mentorship Gaps for Task 10</span>
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto text-[10px] text-white/60">
                {mentorshipNeeds.map(m => (
                  <div key={m.area} className="border-b border-white/5 py-1">
                    <span className="font-bold text-white">{m.area}</span>: {m.mentorQuestion}
                  </div>
                ))}
              </div>
            </div>

            {/* Document Controls */}
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <button
                onClick={saveAll}
                className="w-full py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-white/80 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Save size={14} />
                Save Blueprint Draft
              </button>

              <button
                onClick={handleComplete}
                className="w-full py-3 rounded-xl bg-[#B4F052] hover:opacity-95 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-[#B4F052]/10"
              >
                <Check size={14} />
                Complete Task 9 & Continue
              </button>
              <p className="text-[10px] text-center text-white/40">
                In Task 10, you will translate these mentorship needs into a verified shortlist of target advisors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
