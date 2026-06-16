/* eslint-disable */
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Check, ArrowRight, Layers, Star, AlertTriangle, Sparkles, FileText, Save, Info, Brain, Activity, User, ShieldAlert, Zap, ClipboardList, BookOpen, Clock, Heart, Award, Copy, CheckSquare, Search, MessageSquare, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PhasePDFGenerator from '@/components/PhasePDFGenerator';

interface MentorshipNeed {
  area: string;
  whyNeeded: string;
  mentorQuestion: string;
  urgency: string;
}

interface NeedMapping {
  needArea: string;
  bestMentorType: string;
  why: string;
  priority: string;
}

interface MentorCandidate {
  id: string;
  name: string;
  roleType: string;
  whyThisPerson: string;
  whatCanTheyHelpWith: string;
  firstQuestion: string;
  source: string;
  warmIntroPossible: string;
  status: string;
  
  // Fit scores
  experienceFit: number;
  networkFit: number;
  problemFit: number;
  trustFit: number;
  availabilityFit: number;
  valuesFit: number;
  conflictRisk: number; // 5 = no risk, 1 = high risk
}

const MENTOR_TYPES = [
  { key: 'startup_mentor', label: 'Startup Mentor' },
  { key: 'industry_mentor', label: 'Industry Mentor' },
  { key: 'customer_access', label: 'Customer Access Mentor' },
  { key: 'product_mentor', label: 'Product Mentor' },
  { key: 'technical_mentor', label: 'Technical Mentor' },
  { key: 'sales_growth', label: 'Sales / Growth Mentor' },
  { key: 'fundraising_mentor', label: 'Fundraising Mentor' },
  { key: 'legal_compliance', label: 'Legal / Compliance Mentor' },
  { key: 'wellbeing_mentor', label: 'Founder Wellbeing Mentor' }
];

const RELATIONSHIP_SOURCES = [
  'Personal network', 'LinkedIn', 'Investor referral', 'Founder referral',
  'Coworking space', 'Accelerator', 'University', 'Industry community',
  'Public expert', 'Customer network'
];

const MENTOR_STATUSES = [
  'Idea', 'To research', 'Ready to contact', 'Contacted', 'Replied', 'Meeting scheduled', 'Active mentor'
];

const DEFAULT_CRITERIA_LIST = [
  { key: 'relevant_exp', label: 'Relevant experience', desc: 'Has built, scaled, invested in or advised something similar.' },
  { key: 'problem_under', label: 'Problem understanding', desc: 'Understands the customer problem or market.' },
  { key: 'network_acc', label: 'Network access', desc: 'Can open useful doors to customers or capital.' },
  { key: 'honest_feed', label: 'Honest feedback', desc: 'Can challenge weak assumptions directly and constructively.' },
  { key: 'avail', label: 'Availability', desc: 'Can realistically meet or respond regularly.' },
  { key: 'values_fit', label: 'Values fit', desc: 'Shares the founder’s principles and respects the mission.' },
  { key: 'conflict_risk', label: 'No conflict of interest', desc: 'Does not create strategic, legal or competitive risk.' },
  { key: 'interest', label: 'Genuine interest', desc: 'Actually cares about the founder, customer or problem.' }
];

export default function Task10Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput, completedTasks } = useGarage();

  const isTask9Complete = completedTasks.includes(9);

  // Load Task 9 inputs
  const rawMentorshipNeeds = getTaskInput(9, 'mentorshipNeedsForTask10');
  const rawNeededRoles = getTaskInput(9, 'neededRoles');

  const importedBlueprint = useMemo(() => {
    let needsList: MentorshipNeed[] = [];
    let rolesList: any[] = [];
    try {
      if (rawMentorshipNeeds) needsList = JSON.parse(rawMentorshipNeeds);
      if (rawNeededRoles) rolesList = JSON.parse(rawNeededRoles);
    } catch (e) {}
    return { mentorshipNeeds: needsList, neededRoles: rolesList };
  }, [rawMentorshipNeeds, rawNeededRoles]);

  // Tab State
  const [activeTab, setActiveTab] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  // Section 1: Review Mentorship Needs
  const [mentorshipDecisionsNotes, setMentorshipDecisionsNotes] = useState(() => getTaskInput(10, 'mentorshipDecisionsNotes') || 'Need mentor review on SaaS tier pricing structure.');
  const [mentorshipRisksNotes, setMentorshipRisksNotes] = useState(() => getTaskInput(10, 'mentorshipRisksNotes') || 'Technical architecture complexity is the highest risk.');
  const [mentorshipDomainNotes, setMentorshipDomainNotes] = useState(() => getTaskInput(10, 'mentorshipDomainNotes') || 'Specific industry experience in B2B enterprise sales is required.');
  const [mentorshipCredibilityNotes, setMentorshipCredibilityNotes] = useState(() => getTaskInput(10, 'mentorshipCredibilityNotes') || 'An advisor from a well-known local tech incubator.');
  const [mentorshipAccessNotes, setMentorshipAccessNotes] = useState(() => getTaskInput(10, 'mentorshipAccessNotes') || 'Looking for introductions to CTOs at local mid-size startups.');

  // Section 2: Define Mentor Role Types
  const [mentorRoleMappings, setMentorRoleMappings] = useState<NeedMapping[]>(() => {
    const raw = getTaskInput(10, 'mentorRoleMappings');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    // Pre-populate with mentorship needs from Task 9
    return importedBlueprint.mentorshipNeeds.map(n => ({
      needArea: n.area,
      bestMentorType: 'startup_mentor',
      why: n.whyNeeded,
      priority: 'must_have'
    }));
  });

  // Section 3: Create Mentor Criteria Ratings
  const [criteriaRatings, setCriteriaRatings] = useState<Record<string, { score: number; evidence: string }>>(() => {
    const raw = getTaskInput(10, 'criteriaRatings');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    const defaultRatings: Record<string, { score: number; evidence: string }> = {};
    DEFAULT_CRITERIA_LIST.forEach(c => {
      defaultRatings[c.key] = { score: 4, evidence: 'Evaluated in candidate fit checks' };
    });
    return defaultRatings;
  });

  // Section 4 & 5: Mentor Shortlist & Scoring
  const [mentorShortlist, setMentorShortlist] = useState<MentorCandidate[]>(() => {
    const raw = getTaskInput(10, 'mentorShortlist');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [
      {
        id: 'candidate_1',
        name: 'Anna Kowalska',
        roleType: 'startup_mentor',
        whyThisPerson: 'Built and exited a B2B analytics startup',
        whatCanTheyHelpWith: 'Sales strategy & GTM sequencing',
        firstQuestion: 'How did you land your first 5 enterprise pilots?',
        source: 'LinkedIn',
        warmIntroPossible: 'yes',
        status: 'Ready to contact',
        experienceFit: 5,
        networkFit: 4,
        problemFit: 4,
        trustFit: 5,
        availabilityFit: 4,
        valuesFit: 5,
        conflictRisk: 5
      },
      {
        id: 'candidate_2',
        name: 'John Doe',
        roleType: 'technical_mentor',
        whyThisPerson: 'CTO at scaling fintech platform',
        whatCanTheyHelpWith: 'Database structure & AWS hosting optimization',
        firstQuestion: 'What are the main scaling risks of serverless databases?',
        source: 'Personal network',
        warmIntroPossible: 'yes',
        status: 'Idea',
        experienceFit: 4,
        networkFit: 3,
        problemFit: 5,
        trustFit: 4,
        availabilityFit: 3,
        valuesFit: 4,
        conflictRisk: 4
      }
    ];
  });

  // Section 6: Outreach Plan
  const [outreachMessageDraft, setOutreachMessageDraft] = useState(() => {
    return getTaskInput(10, 'outreachMessageDraft') || `Hi [Mentor Name],

I hope this message finds you well.

I’ve been following your startup achievements, specifically your work on scaling enterprise B2B sales.

I’m a founder at the Innovation Center at BusinessHUB / District.org, and we are working on a critical decision around validation and early pricing models for tech incubators. Given your experience exit, your advice would be invaluable to help us avoid early pitfalls.

Would you be open to a brief, 15-minute chat next week to share your thoughts on early sales feedback loops?

Best,
[Founder Name]`;
  });

  // Section 7: Operating Rules
  const [operatingRules, setOperatingRules] = useState(() => {
    const raw = getTaskInput(10, 'operatingRules');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return {
      meetingCadence: 'Bi-weekly 30-minute sync calls, with ad-hoc Slack updates',
      advisoryEquity: 'Advisory shares split of 0.2% - 0.5% vesting monthly over 2 years, based on FAST agreement framework',
      feedbackLoops: 'Summarize meeting action items, log them in our weekly review checklist, and send a progress report ahead of the next sync.'
    };
  });

  // Sync mappings if imported list changes
  useEffect(() => {
    if (importedBlueprint.mentorshipNeeds.length > 0 && mentorRoleMappings.length === 0) {
      setMentorRoleMappings(importedBlueprint.mentorshipNeeds.map(n => ({
        needArea: n.area,
        bestMentorType: 'startup_mentor',
        why: n.whyNeeded,
        priority: 'must_have'
      })));
    }
  }, [importedBlueprint.mentorshipNeeds]);

  const generatedPlanMarkdown = useMemo(() => {
    const mappingRows = mentorRoleMappings.map(m => {
      return `| ${m.needArea} | ${m.bestMentorType} | ${m.why} | ${m.priority} |`;
    }).join('\n');

    const criteriaRows = DEFAULT_CRITERIA_LIST.map(c => {
      const rating = criteriaRatings[c.key] || { score: 4, evidence: '' };
      return `| ${c.label} | ${rating.score}/5 | ${rating.evidence || 'N/A'} |`;
    }).join('\n');

    const candidateRows = mentorShortlist.map(c => {
      const totalScore = c.experienceFit + c.networkFit + c.problemFit + c.trustFit + c.availabilityFit + c.valuesFit + c.conflictRisk;
      return `### Candidate: ${c.name}
- **Mentor Type**: ${c.roleType}
- **Shortlist Status**: ${c.status}
- **Why Them**: ${c.whyThisPerson}
- **Help Area**: ${c.whatCanTheyHelpWith}
- **First Question**: ${c.firstQuestion}
- **Fit Scoring (Total: ${totalScore}/35)**:
  - Experience Fit: ${c.experienceFit}/5
  - Network Fit: ${c.networkFit}/5
  - Problem Fit: ${c.problemFit}/5
  - Trust Fit: ${c.trustFit}/5
  - Availability Fit: ${c.availabilityFit}/5
  - Values Fit: ${c.valuesFit}/5
  - Conflict Risk Rating (5 = no risk): ${c.conflictRisk}/5`;
    }).join('\n\n');

    return `# Mentorship Network Plan

## 1. Review of Mentorship Gaps
- **Decisions Requiring Mentor Review**: ${mentorshipDecisionsNotes}
- **Roadmap Risks Requiring Expert Feedback**: ${mentorshipRisksNotes}
- **Domain Areas Requiring Industry Experience**: ${mentorshipDomainNotes}
- **Credibility/Validation Needs**: ${mentorshipCredibilityNotes}
- **Access Gaps (Customers/Capital)**: ${mentorshipAccessNotes}

## 2. Mentor Role Mappings
| Need Area | Best Mentor Profile | Rationale | Priority |
| --- | --- | --- | --- |
${mappingRows}

## 3. General Mentor Assessment Standards
| Selection Criteria | Target Score | Evidence / Justification |
| --- | :---: | --- |
${criteriaRows}

## 4. Mentor Candidate Shortlist & Fit Scores
${candidateRows}

## 5. Outreach Strategy & Template
- **Message Angle**: Specific problem advice request.
- **Message Pitch Draft**:
\`\`\`text
${outreachMessageDraft}
\`\`\`

## 6. Mentorship Operating Rules & Cadence
- **Meeting Cadence**: ${operatingRules.meetingCadence}
- **Advisory Agreement Split**: ${operatingRules.advisoryEquity}
- **Feedback & Loop Protocol**: ${operatingRules.feedbackLoops}
`;
  }, [mentorshipDecisionsNotes, mentorshipRisksNotes, mentorshipDomainNotes, mentorshipCredibilityNotes, mentorshipAccessNotes, mentorRoleMappings, criteriaRatings, mentorShortlist, outreachMessageDraft, operatingRules]);

  // Sync to context
  const saveAll = () => {
    setTaskInput(10, 'mentorshipDecisionsNotes', mentorshipDecisionsNotes);
    setTaskInput(10, 'mentorshipRisksNotes', mentorshipRisksNotes);
    setTaskInput(10, 'mentorshipDomainNotes', mentorshipDomainNotes);
    setTaskInput(10, 'mentorshipCredibilityNotes', mentorshipCredibilityNotes);
    setTaskInput(10, 'mentorshipAccessNotes', mentorshipAccessNotes);
    setTaskInput(10, 'mentorRoleMappings', JSON.stringify(mentorRoleMappings));
    setTaskInput(10, 'criteriaRatings', JSON.stringify(criteriaRatings));
    setTaskInput(10, 'mentorShortlist', JSON.stringify(mentorShortlist));
    setTaskInput(10, 'outreachMessageDraft', outreachMessageDraft);
    setTaskInput(10, 'operatingRules', JSON.stringify(operatingRules));

    // Save final compiled reports
    setTaskInput(10, 'notes', generatedPlanMarkdown);
    setTaskInput(10, 'deliverable', 'Mentorship Network Plan');
  };

  useEffect(() => {
    saveAll();
  }, [mentorshipDecisionsNotes, mentorshipRisksNotes, mentorshipDomainNotes, mentorshipCredibilityNotes, mentorshipAccessNotes, mentorRoleMappings, criteriaRatings, mentorShortlist, outreachMessageDraft, operatingRules, generatedPlanMarkdown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPlanMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = () => {
    saveAll();
    completeTask(10);
    router.push('/tasks');
  };

  if (!isTask9Complete) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="glass-card p-8 border border-white/[0.08] inline-block max-w-lg bg-black/40">
          <AlertTriangle className="mx-auto mb-4 text-[#B4F052]" size={48} />
          <h2 className="text-xl font-bold mb-2">Task 9 Incomplete</h2>
          <p className="text-white/60 mb-6 text-sm">
            Please finish and complete Task 9 (Round Out Founding Team) to map out your core builder roles and establish your support blueprint first.
          </p>
          <Link href="/tasks/9" className="inline-flex items-center gap-2 glass-button px-6 py-3 rounded-xl text-sm font-semibold transition-all">
            Go to Task 9
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
            Task 10
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Secure Mentorship</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Build a mentorship matching network. Contrast target candidates, score fit levels across criteria, formulate advisory split principles, and compile the final plan.
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
            <div className="text-white font-semibold">~6 hours</div>
          </div>
        </div>
      </div>

      {/* Warning Callout */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] border-l-4 border-l-[#B4F052] mb-8 text-sm flex gap-3">
        <Info className="text-[#B4F052] flex-shrink-0 mt-0.5" size={18} />
        <div>
          <span className="font-bold text-white">Rule:</span> Do not look for a generic mentor. Match mentors to specific decisions, risks and skill gaps identified in your support blueprint.
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Wizard Panel (Col Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs header */}
          <div className="flex border-b border-white/[0.08] overflow-x-auto pb-px gap-2">
            {[
              { id: 1, label: '1. Review Needs' },
              { id: 2, label: '2. Mentor Types' },
              { id: 3, label: '3. Selection Criteria' },
              { id: 4, label: '4. Shortlist' },
              { id: 5, label: '5. Score Fit' },
              { id: 6, label: '6. Outreach Plan' },
              { id: 7, label: '7. Rules & FAST' },
              { id: 8, label: '8. Network Plan' }
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
            {/* Tab 1: Review Needs */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <ClipboardList size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 1: Review Mentorship Gaps</h3>
                </div>
                <p className="text-xs text-white/60">
                  Formulate critical questions and domains where advisor input can reduce execution risks.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Which decisions need mentor input soon?</label>
                    <textarea
                      value={mentorshipDecisionsNotes}
                      onChange={e => setMentorshipDecisionsNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Which risks could be reduced by expert feedback?</label>
                    <textarea
                      value={mentorshipRisksNotes}
                      onChange={e => setMentorshipRisksNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Which gaps require industry-specific experience?</label>
                    <textarea
                      value={mentorshipDomainNotes}
                      onChange={e => setMentorshipDomainNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Which mentors would increase credibility/validation?</label>
                    <textarea
                      value={mentorshipCredibilityNotes}
                      onChange={e => setMentorshipCredibilityNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Which mentors would improve access to customers, partners or capital?</label>
                    <textarea
                      value={mentorshipAccessNotes}
                      onChange={e => setMentorshipAccessNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Define Mentor Role Types */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Brain size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 2: Map Mentor Role Profiles</h3>
                </div>
                <p className="text-xs text-white/60">
                  Assign specific role types to each gap area. Avoid generic advisors; look for domain specialists.
                </p>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {mentorRoleMappings.map((mapping, idx) => (
                    <div key={mapping.needArea} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] space-y-2 text-xs">
                      <div className="font-bold text-[#B4F052]">Need Area: {mapping.needArea}</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Best Mentor Profile Type</label>
                          <select
                            value={mapping.bestMentorType}
                            onChange={e => {
                              const val = e.target.value;
                              setMentorRoleMappings(prev => prev.map((item, i) => i === idx ? { ...item, bestMentorType: val } : item));
                            }}
                            className="w-full bg-black border border-white/20 text-xs rounded px-2 py-1 text-white focus:outline-none"
                          >
                            {MENTOR_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Priority</label>
                          <select
                            value={mapping.priority}
                            onChange={e => {
                              const val = e.target.value;
                              setMentorRoleMappings(prev => prev.map((item, i) => i === idx ? { ...item, priority: val } : item));
                            }}
                            className="w-full bg-black border border-white/20 text-xs rounded px-2 py-1 text-white focus:outline-none"
                          >
                            <option value="must_have">Must-Have</option>
                            <option value="nice_to_have">Nice-To-Have</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-[9px] text-white/40 block mb-0.5">Specific Rationale / Help Needed</label>
                          <input
                            type="text"
                            value={mapping.why}
                            onChange={e => {
                              const val = e.target.value;
                              setMentorRoleMappings(prev => prev.map((item, i) => i === idx ? { ...item, why: val } : item));
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

            {/* Tab 3: Selection Criteria */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Award size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 3: Define Selection Criteria</h3>
                </div>
                <p className="text-xs text-white/60">
                  Establish standards to rate potential advisors. Look for honest critique and genuine interest over popular branding.
                </p>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {DEFAULT_CRITERIA_LIST.map((criteria) => {
                    const rating = criteriaRatings[criteria.key] || { score: 4, evidence: '' };
                    return (
                      <div key={criteria.key} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-white block">{criteria.label}</span>
                            <span className="text-[10px] text-white/40">{criteria.desc}</span>
                          </div>
                          <select
                            value={rating.score}
                            onChange={e => {
                              const val = parseInt(e.target.value);
                              setCriteriaRatings(prev => ({ ...prev, [criteria.key]: { ...rating, score: val } }));
                            }}
                            className="bg-black border border-white/20 text-xs rounded px-1.5 py-0.5 text-[#B4F052] font-bold focus:outline-none"
                          >
                            {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>Grade: {v}/5</option>)}
                          </select>
                        </div>
                        <input
                          type="text"
                          value={rating.evidence}
                          onChange={e => {
                            const val = e.target.value;
                            setCriteriaRatings(prev => ({ ...prev, [criteria.key]: { ...rating, evidence: val } }));
                          }}
                          placeholder="Evidence standard / benchmark..."
                          className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-[10px] text-white focus:outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 4: Shortlist */}
            {activeTab === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Search size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 4: Build Mentor Shortlist</h3>
                </div>
                <p className="text-xs text-white/60">
                  Maintain a list of potential mentors, track warm intro channels, and organize your progress statuses.
                </p>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {mentorShortlist.map((candidate, idx) => (
                    <div key={candidate.id} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] space-y-2 text-xs">
                      <div className="font-bold text-[#B4F052] flex justify-between">
                        <span>Candidate: {candidate.name}</span>
                        <button
                          type="button"
                          onClick={() => setMentorShortlist(prev => prev.filter(c => c.id !== candidate.id))}
                          className="text-white/30 hover:text-rose-400 text-[10px] uppercase font-mono"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Name</label>
                          <input
                            type="text"
                            value={candidate.name}
                            onChange={e => {
                              const val = e.target.value;
                              setMentorShortlist(prev => prev.map(c => c.id === candidate.id ? { ...c, name: val } : c));
                            }}
                            className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Profile Type</label>
                          <select
                            value={candidate.roleType}
                            onChange={e => {
                              const val = e.target.value;
                              setMentorShortlist(prev => prev.map(c => c.id === candidate.id ? { ...c, roleType: val } : c));
                            }}
                            className="w-full bg-black border border-white/20 text-xs rounded px-2 py-1 text-white focus:outline-none"
                          >
                            {MENTOR_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Intro Path / Source</label>
                          <select
                            value={candidate.source}
                            onChange={e => {
                              const val = e.target.value;
                              setMentorShortlist(prev => prev.map(c => c.id === candidate.id ? { ...c, source: val } : c));
                            }}
                            className="w-full bg-black border border-white/20 text-xs rounded px-2 py-1 text-white focus:outline-none"
                          >
                            {RELATIONSHIP_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5">Status</label>
                          <select
                            value={candidate.status}
                            onChange={e => {
                              const val = e.target.value;
                              setMentorShortlist(prev => prev.map(c => c.id === candidate.id ? { ...c, status: val } : c));
                            }}
                            className="w-full bg-black border border-white/20 text-xs rounded px-2 py-1 text-[#B4F052] font-bold focus:outline-none"
                          >
                            {MENTOR_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-[9px] text-white/40 block mb-0.5">What question should we ask them first?</label>
                          <input
                            type="text"
                            value={candidate.firstQuestion}
                            onChange={e => {
                              const val = e.target.value;
                              setMentorShortlist(prev => prev.map(c => c.id === candidate.id ? { ...c, firstQuestion: val } : c));
                            }}
                            className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => {
                      const randId = 'c_' + Date.now();
                      setMentorShortlist(prev => [...prev, {
                        id: randId,
                        name: 'New Candidate',
                        roleType: 'startup_mentor',
                        whyThisPerson: '',
                        whatCanTheyHelpWith: '',
                        firstQuestion: '',
                        source: 'LinkedIn',
                        warmIntroPossible: 'unknown',
                        status: 'Idea',
                        experienceFit: 3,
                        networkFit: 3,
                        problemFit: 3,
                        trustFit: 3,
                        availabilityFit: 3,
                        valuesFit: 3,
                        conflictRisk: 5
                      }]);
                    }}
                    className="w-full border border-dashed border-white/20 hover:border-[#B4F052]/50 hover:bg-[#B4F052]/5 py-2 rounded-xl text-xs flex justify-center items-center gap-1.5 transition-all"
                  >
                    <Plus size={14} /> Add Candidate
                  </button>
                </div>
              </div>
            )}

            {/* Tab 5: Score Fit */}
            {activeTab === 5 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <Star size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 5: Score Mentor Candidate Fit</h3>
                </div>
                <p className="text-xs text-white/60">
                  Calculate fit scores (out of 35 total) for candidates across 7 alignment parameters.
                </p>

                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {mentorShortlist.map((candidate) => {
                    const total = candidate.experienceFit + candidate.networkFit + candidate.problemFit + candidate.trustFit + candidate.availabilityFit + candidate.valuesFit + candidate.conflictRisk;
                    return (
                      <div key={candidate.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 text-xs">
                        <div className="flex justify-between items-center border-b border-white/5 pb-1 font-bold text-white">
                          <span>{candidate.name}</span>
                          <span className="text-[#B4F052] font-mono">Fit Score: {total}/35</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px]">
                          {[
                            { key: 'experienceFit', label: 'Experience' },
                            { key: 'networkFit', label: 'Network' },
                            { key: 'problemFit', label: 'Problem' },
                            { key: 'trustFit', label: 'Trust' },
                            { key: 'availabilityFit', label: 'Availability' },
                            { key: 'valuesFit', label: 'Values' },
                            { key: 'conflictRisk', label: 'No Conflict Risk' }
                          ].map(f => {
                            const val = (candidate as any)[f.key] as number;
                            return (
                              <div key={f.key} className="space-y-1">
                                <label className="text-white/40 block">{f.label}</label>
                                <select
                                  value={val}
                                  onChange={e => {
                                    const score = parseInt(e.target.value);
                                    setMentorShortlist(prev => prev.map(c => c.id === candidate.id ? { ...c, [f.key]: score } : c));
                                  }}
                                  className="bg-black border border-white/20 text-[10px] rounded px-1 py-0.5 text-white w-full focus:outline-none"
                                >
                                  {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 6: Outreach Plan */}
            {activeTab === 6 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <MessageSquare size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 6: Outreach Message Strategy</h3>
                </div>
                <p className="text-xs text-white/60">
                  Formulate a custom template strategy targeting shortlist candidate needs. Keep pitches direct, brief, and query-centered.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Outreach Pitch Template Draft</label>
                    <textarea
                      value={outreachMessageDraft}
                      onChange={e => setOutreachMessageDraft(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none font-mono"
                      rows={8}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 7: Rules & FAST */}
            {activeTab === 7 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <ShieldAlert size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 7: Define Mentorship Operating Rules</h3>
                </div>
                <p className="text-xs text-white/60">
                  Establish guidelines for cadence and compensation to keep interactions structured.
                </p>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Meeting Cadence & Sync Formats</label>
                    <input
                      type="text"
                      value={operatingRules.meetingCadence}
                      onChange={e => setOperatingRules({ ...operatingRules, meetingCadence: e.target.value })}
                      placeholder="e.g., Monthly 45m review call..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Advisory Equity Compensation Guidelines (e.g., Founder Advisor Standard Template - FAST splits)</label>
                    <input
                      type="text"
                      value={operatingRules.advisoryEquity}
                      onChange={e => setOperatingRules({ ...operatingRules, advisoryEquity: e.target.value })}
                      placeholder="e.g., 0.2% - 0.5% with a 2-year monthly vesting..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Feedback Loop / Action Item Logs</label>
                    <input
                      type="text"
                      value={operatingRules.feedbackLoops}
                      onChange={e => setOperatingRules({ ...operatingRules, feedbackLoops: e.target.value })}
                      placeholder="e.g., Send summary emails within 24 hours of meetings..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 8: Network Plan */}
            {activeTab === 8 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                  <FileText size={18} className="text-[#B4F052]" />
                  <h3 className="text-sm font-bold">Step 8: Generate Mentorship Network Plan</h3>
                </div>
                <p className="text-xs text-white/60">
                  Verify the final plan document and copy it for deployment planning.
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#B4F052] uppercase tracking-wider flex items-center gap-1">
                      <FileText size={14} /> Output Preview: Mentorship Network Plan
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="text-[10px] text-white/60 hover:text-white border border-white/20 rounded-lg px-2.5 py-1 flex items-center gap-1 transition-all"
                    >
                      <Copy size={12} />
                      {copied ? 'Copied!' : 'Copy Plan'}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl border border-white/[0.08] bg-black/80 font-mono text-[9px] text-white/70 overflow-x-auto whitespace-pre-wrap max-h-72">
                    {generatedPlanMarkdown}
                  </pre>
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

        {/* Live imported Blueprint Info Panel */}
        <div className="space-y-6">
          <div className="glass-card p-6 border border-white/[0.08] bg-black/60 backdrop-blur-md space-y-6">
            <div className="border-b border-white/[0.08] pb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FileText size={16} className="text-[#B4F052]" />
                <h3 className="text-sm font-bold text-white">Blueprint Input</h3>
              </div>
              <span className="text-[9px] font-mono text-[#B4F052]">Task 9</span>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 text-xs">
              <div className="space-y-1">
                <span className="font-bold block text-[10px] text-white/50 uppercase">Imported Support Roles:</span>
                {importedBlueprint.neededRoles.length === 0 ? (
                  <div className="text-[10px] text-white/40 italic">No roles imported.</div>
                ) : (
                  importedBlueprint.neededRoles.map((r: any) => (
                    <div key={r.roleId} className="p-2 rounded bg-white/[0.02] border border-white/[0.04] text-[10px] flex justify-between items-center">
                      <span className="text-white/80">{r.roleName}</span>
                      <span className="text-[#B4F052] font-semibold text-[9px] uppercase">{r.supportType}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-1">
                <span className="font-bold block text-[10px] text-white/50 uppercase">Imported Mentorship Gaps:</span>
                {importedBlueprint.mentorshipNeeds.length === 0 ? (
                  <div className="text-[10px] text-white/40 italic">No needs imported.</div>
                ) : (
                  importedBlueprint.mentorshipNeeds.map((m, idx) => (
                    <div key={idx} className="p-2 rounded bg-white/[0.02] border border-white/[0.04] text-[9px]">
                      <div className="font-semibold text-white">{m.area}</div>
                      <div className="text-white/50 mt-0.5 font-italic">{m.mentorQuestion}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Document Controls */}
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <button
                onClick={saveAll}
                className="w-full py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-white/80 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Save size={14} />
                Save Plan Draft
              </button>

              <button
                onClick={handleComplete}
                className="w-full py-3 rounded-xl bg-[#B4F052] hover:opacity-95 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-[#B4F052]/10"
              >
                <Check size={14} />
                Complete Task 10 & Sync
              </button>
              <PhasePDFGenerator phase={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
