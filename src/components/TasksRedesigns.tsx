'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGarage } from '@/context/GarageContext';
import { getTask, STAGE_COLORS } from '@/data/tasks';
import { useRouter } from 'next/navigation';
import { 
  Layers, Star, CheckCircle2, ChevronRight, ChevronLeft, 
  Activity
} from 'lucide-react';
import PhasePDFGenerator from '@/components/PhasePDFGenerator';

interface TasksRedesignsProps {
  taskNum: number;
}

export default function TasksRedesigns({ taskNum }: TasksRedesignsProps) {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput, completedTasks, subtaskChecks, toggleSubtask } = useGarage();
  const task = useMemo(() => getTask(taskNum)!, [taskNum]);
  const done = completedTasks.includes(taskNum);

  const prev = taskNum > 1 ? getTask(taskNum - 1) : null;
  const next = taskNum < 100 ? getTask(taskNum + 1) : null;

  // --- Sub-stage classification ---
  const subStageType = useMemo(() => {
    if (taskNum >= 21 && taskNum <= 25) return 'starter-kits';
    if (taskNum >= 26 && taskNum <= 31) return 'mvp';
    if (taskNum >= 32 && taskNum <= 35) return 'brand';
    if (taskNum >= 36 && taskNum <= 42) return 'seed-capital';
    if (taskNum >= 43 && taskNum <= 60) return 'functions';
    if (taskNum >= 61 && taskNum <= 64) return 'kpis';
    if (taskNum >= 65 && taskNum <= 69) return 'go-live';
    if (taskNum >= 70 && taskNum <= 71) return 'growth-capital';
    if (taskNum >= 72 && taskNum <= 74) return 'culture';
    if (taskNum >= 75 && taskNum <= 81) return 'data-learning';
    if (taskNum >= 82 && taskNum <= 94) return 'optimize';
    if (taskNum >= 95 && taskNum <= 96) return 'best-practices';
    if (taskNum >= 97 && taskNum <= 100) return 'independence';
    return 'generic';
  }, [taskNum]);

  const phaseNum = useMemo((): number => {
    switch (subStageType) {
      case 'starter-kits': return 6;
      case 'mvp': return 7;
      case 'brand': return 8;
      case 'seed-capital': return 9;
      case 'functions': return 10;
      case 'kpis': return 11;
      case 'go-live': return 12;
      case 'growth-capital': return 13;
      case 'culture': return 14;
      case 'data-learning': return 15;
      case 'optimize': return 16;
      case 'best-practices': return 17;
      case 'independence': return 18;
      default: return 6;
    }
  }, [subStageType]);

  // --- Common custom states with local persistence via getTaskInput/setTaskInput ---
  
  // 1. Starter-Kits Inputs
  const [headline, setHeadline] = useState(() => getTaskInput(21, 'headline') || 'Next-Gen Automated Tax & Legal Compliance Audit for SMEs');
  const [waitlistCount, setWaitlistCount] = useState(() => getTaskInput(21, 'waitlistCount') || '142');
  const [loiDetails, setLoiDetails] = useState(() => getTaskInput(22, 'loiDetails') || 'Draft LOI specifying pilot sandbox parameters and data privacy protection clauses.');
  const [loiSignedCount, setLoiSignedCount] = useState(() => getTaskInput(22, 'loiSignedCount') || '3');
  const [focusGroupChannels, setFocusGroupChannels] = useState(() => getTaskInput(23, 'focusGroupChannels') || 'Slack community, LinkedIn focus group');
  const [deckOutline, setDeckOutline] = useState(() => getTaskInput(24, 'deckOutline') || 'Slide 1: Problem statement\nSlide 2: Compliance Solution\nSlide 3: Market Size & Opportunity\nSlide 4: Technology & Architecture\nSlide 5: Financial projections & Ask');
  const [onePagerContent, setOnePagerContent] = useState(() => getTaskInput(25, 'onePagerContent') || 'Core Value Prop: Zero-stress tax diagnostic reports in seconds.');

  // 2. MVP Inputs
  const [mvpFeatures, setMvpFeatures] = useState(() => getTaskInput(26, 'mvpFeatures') || '1. PDF Drag & Drop\n2. Financial Transaction Anomalies Parser\n3. Compliance Checker engine\n4. Report download');
  const [techStack, setTechStack] = useState(() => getTaskInput(27, 'techStack') || 'Next.js, TailwindCSS, TypeScript, Node.js, Vercel, Supabase PostgreSQL');
  const [workflowStatus, setWorkflowStatus] = useState(() => getTaskInput(28, 'workflowStatus') || 'GitHub organization created. Pre-commit hooks, Jest unit testing, ESLint lint rules configured.');
  const [userStories, setUserStories] = useState(() => getTaskInput(29, 'userStories') || 'As a small business owner, I want to drag my transaction CSV to see mismatched TAX codes.');
  const [mvpBackendUrl, setMvpBackendUrl] = useState(() => getTaskInput(30, 'mvpBackendUrl') || 'https://api.unicorngarage.co/v1/compliance-checker');
  const [debugLog, setDebugLog] = useState(() => getTaskInput(31, 'debugLog') || 'Parsed 10 client CSV sheets. Handled zero-row CSV bounds error. Deployed fixes successfully.');

  // 3. Brand Inputs
  const [brandValues, setBrandValues] = useState(() => getTaskInput(32, 'brandValues') || 'Reliability, Professionalism, Speed, Integrity');
  const [logoSystem, setLogoSystem] = useState(() => getTaskInput(33, 'logoSystem') || 'Minimalist typography emblem. Primary brand color: HSL #B4F052 (lime-neon), Secondary: Charcoal #121212.');
  const [brandVoice, setBrandVoice] = useState(() => getTaskInput(34, 'brandVoice') || 'Empathetic but authoritative, precise, professional, trustworthy.');
  const [landingUxScore, setLandingUxScore] = useState(() => getTaskInput(35, 'landingUxScore') || 'Aria compliance verified. Core web vitals page speed audit score: 98/100.');

  // 4. Seed Capital Inputs
  const [preSeedAsk, setPreSeedAsk] = useState(() => getTaskInput(36, 'preSeedAsk') || '150000');
  const [runwayTarget, setRunwayTarget] = useState(() => getTaskInput(36, 'runwayTarget') || '18');
  const [allocationAsk, setAllocationAsk] = useState(() => getTaskInput(36, 'allocationAsk') || 'Engineering: 60%, Sales/Marketing: 25%, Admin & Compliance: 15%');
  const [financialProjections, setFinancialProjections] = useState(() => getTaskInput(37, 'financialProjections') || 'Year 1 ARR: $85k, Year 2 ARR: $320k, Year 3 ARR: $1.2M. Break-even: Month 14.');
  const [investorCrm, setInvestorCrm] = useState(() => getTaskInput(38, 'investorCrm') || '1. SpeedInvest (Status: Contacted)\n2. PreSeed Capital (Status: Partner Pitch scheduled)\n3. Startup Angel Alliance (Status: Term Sheet under negotiation)');
  const [pitchRevisions, setPitchRevisions] = useState(() => getTaskInput(39, 'pitchRevisions') || 'Updated cap table slide to reflect 15% ESOP option pool allocations.');
  const [outreachStatus, setOutreachStatus] = useState(() => getTaskInput(40, 'outreachStatus') || 'Sent 24 targeted warm messages. 8 meetings scheduled, 4 pass responses received.');
  const [partnerMeetingNotes, setPartnerMeetingNotes] = useState(() => getTaskInput(41, 'partnerMeetingNotes') || 'Pitching partners at SpeedInvest. Addressed concerns around data access APIs.');
  const [termSheetStatus, setTermSheetStatus] = useState(() => getTaskInput(42, 'termSheetStatus') || 'Signed binding term sheet for $150k seed investment from Lead Angel Fund.');

  // 5. Functions & Operations (Tasks 43-60)
  const [functionsStatus, setFunctionsStatus] = useState(() => getTaskInput(43, 'functionsStatus') || 'Tech Stack: Supabase auth. CRM Pipeline: HubSpot active. Ad Accounts: Google and Meta pixel active. Finance ledger: Quickbooks online integration.');

  // 6. KPIs & Cadence (Tasks 61-64)
  const [kpiTargets, setKpiTargets] = useState(() => getTaskInput(61, 'kpiTargets') || 'Monthly active users target: 200, Signed LOIs target: 10, ARR target: $10,000');
  const [cadenceDetails, setCadenceDetails] = useState(() => getTaskInput(62, 'cadenceDetails') || 'Weekly Monday alignment. Friday retrospective. Monthly strategic board meetings.');
  const [dashboardUrl, setDashboardUrl] = useState(() => getTaskInput(63, 'dashboardUrl') || 'https://dash.unicorngarage.co/compliance-diagnostic');
  const [reportingAutomation, setReportingAutomation] = useState(() => getTaskInput(64, 'reportingAutomation') || 'Metabase dashboard auto-emails weekly client usage to partners.');

  // 7. Go Live (Tasks 65-69)
  const [launchChecklist, setLaunchChecklist] = useState(() => getTaskInput(65, 'launchChecklist') || 'Production build deployed, custom domains setup, Stripe connected, terms of service published.');
  const [marketingCampaign, setMarketingCampaign] = useState(() => getTaskInput(66, 'marketingCampaign') || 'Product Hunt launch set for June 22. Launch newsletter ready for 142 waitlist subscribers.');
  const [prOutreach, setPRStatus] = useState(() => getTaskInput(67, 'prOutreach') || 'Press release sent to TechCrunch and local startup media. Shared with 8 partners.');
  const [userOnboardingUrl, setUserOnboardingUrl] = useState(() => getTaskInput(68, 'userOnboardingUrl') || 'https://unicorngarage.co/onboarding-flow-diagnostic');
  const [launchRetrospective, setLaunchRetrospective] = useState(() => getTaskInput(69, 'launchRetrospective') || '30 active pilots onboarded in week 1. Deployed hotfixes for Stripe metadata parsing.');

  // 8. Growth Capital (Tasks 70-71)
  const [growthFundingTarget, setGrowthFundingTarget] = useState(() => getTaskInput(70, 'growthFundingTarget') || '800000');
  const [growthCapTable, setGrowthCapTable] = useState(() => getTaskInput(71, 'growthCapTable') || 'Founders: 65%, Option Pool: 15%, Angel Investors: 20%.');

  // 9. Company Culture (Tasks 72-74)
  const [cultureValues, setCultureValues] = useState(() => getTaskInput(72, 'cultureValues') || 'Customer-first, Fast to fail, Radically transparent operations.');
  const [hrHandbook, setHrHandbook] = useState(() => getTaskInput(73, 'hrHandbook') || 'Onboarding SOP doc compiled. Compensation bounds, remote days policies established.');
  const [employeeFeedback, setEmployeeFeedback] = useState(() => getTaskInput(74, 'employeeFeedback') || 'Feedback survey setup via Officevibe. Quarterly reviews timeline scheduled.');

  // 10. Data Learning (Tasks 75-81)
  const [analyticsFunnel, setAnalyticsFunnel] = useState(() => getTaskInput(75, 'analyticsFunnel') || 'Landing visit -> CSV upload (54% conv) -> Report diagnostic view (35% conv) -> Paid audit (6% conv)');
  const [cohortRetention, setCohortRetention] = useState(() => getTaskInput(76, 'cohortRetention') || 'Month 1: 45% retention, Month 2: 38% retention, Month 3: 35% retention.');

  // 11. Scale Optimization (Tasks 82-94)
  const [optimizationMetric, setOptimizationMetric] = useState(() => getTaskInput(82, 'optimizationMetric') || 'Optimized CAC from $45 to $18. LTV/CAC ratio stands at 4.2x.');
  const [growthLoops, setGrowthLoops] = useState(() => getTaskInput(83, 'growthLoops') || 'Automated client invite link in PDF audit certificates. Referral discount code loop active.');
  const [automationsStatus, setAutomationsStatus] = useState(() => getTaskInput(93, 'automationsStatus') || 'Zapier flows connect Supabase user actions with HubSpot and Slack alerts.');

  // 12. Best Practices (Tasks 95-96)
  const [okrsList, setOkrsList] = useState(() => getTaskInput(95, 'okrsList') || 'Objective: Maximize SME diagnostic satisfaction. KR1: Achieve NPS > 65. KR2: Automate 90% of compliance rules.');
  const [sopHandbook, setSopHandbook] = useState(() => getTaskInput(96, 'sopHandbook') || 'Completed SOPs: 1. Deploy SOP, 2. Support Ticket escalation SOP, 3. Capital raising accounting SOP.');

  // 13. Independence & Growth (Tasks 97-100)
  const [pmfValidation, setPmfValidation] = useState(() => getTaskInput(97, 'pmfValidation') || 'Sean Ellis score: 58% of active users state they would be "very disappointed" if our service disappeared.');
  const [successionPlan, setSuccessionPlan] = useState(() => getTaskInput(98, 'successionPlan') || 'Appointed Head of Tech Operations. Configured centralized operational dashboards for board review.');
  const [expansionRoadmap, setExpansionRoadmap] = useState(() => getTaskInput(99, 'expansionRoadmap') || 'Strategic plan: 1. Add EU bookkeeping schemas (Q3). 2. Partner with SME banking API providers (Q4).');
  const [finalTargetGoal, setFinalTargetGoal] = useState(() => getTaskInput(100, 'finalTargetGoal') || 'Ready for Series A raising round targeting $1.5M to scale compliance automations.');

  // --- Save callback ---
  const saveAll = useCallback(() => {
    // Save Starter Kits
    setTaskInput(21, 'headline', headline);
    setTaskInput(21, 'waitlistCount', waitlistCount);
    setTaskInput(22, 'loiDetails', loiDetails);
    setTaskInput(22, 'loiSignedCount', loiSignedCount);
    setTaskInput(23, 'focusGroupChannels', focusGroupChannels);
    setTaskInput(24, 'deckOutline', deckOutline);
    setTaskInput(25, 'onePagerContent', onePagerContent);

    // Save MVP
    setTaskInput(26, 'mvpFeatures', mvpFeatures);
    setTaskInput(27, 'techStack', techStack);
    setTaskInput(28, 'workflowStatus', workflowStatus);
    setTaskInput(29, 'userStories', userStories);
    setTaskInput(30, 'mvpBackendUrl', mvpBackendUrl);
    setTaskInput(31, 'debugLog', debugLog);

    // Save Brand
    setTaskInput(32, 'brandValues', brandValues);
    setTaskInput(33, 'logoSystem', logoSystem);
    setTaskInput(34, 'brandVoice', brandVoice);
    setTaskInput(35, 'landingUxScore', landingUxScore);

    // Save Seed Capital
    setTaskInput(36, 'preSeedAsk', preSeedAsk);
    setTaskInput(36, 'runwayTarget', runwayTarget);
    setTaskInput(36, 'allocationAsk', allocationAsk);
    setTaskInput(37, 'financialProjections', financialProjections);
    setTaskInput(38, 'investorCrm', investorCrm);
    setTaskInput(39, 'pitchRevisions', pitchRevisions);
    setTaskInput(40, 'outreachStatus', outreachStatus);
    setTaskInput(41, 'partnerMeetingNotes', partnerMeetingNotes);
    setTaskInput(42, 'termSheetStatus', termSheetStatus);

    // Save Functions & Operations
    setTaskInput(43, 'functionsStatus', functionsStatus);

    // Save KPIs
    setTaskInput(61, 'kpiTargets', kpiTargets);
    setTaskInput(62, 'cadenceDetails', cadenceDetails);
    setTaskInput(63, 'dashboardUrl', dashboardUrl);
    setTaskInput(64, 'reportingAutomation', reportingAutomation);

    // Save Go Live
    setTaskInput(65, 'launchChecklist', launchChecklist);
    setTaskInput(66, 'marketingCampaign', marketingCampaign);
    setTaskInput(67, 'prOutreach', prOutreach);
    setTaskInput(68, 'userOnboardingUrl', userOnboardingUrl);
    setTaskInput(69, 'launchRetrospective', launchRetrospective);

    // Save Growth
    setTaskInput(70, 'growthFundingTarget', growthFundingTarget);
    setTaskInput(71, 'growthCapTable', growthCapTable);

    // Save Culture
    setTaskInput(72, 'cultureValues', cultureValues);
    setTaskInput(73, 'hrHandbook', hrHandbook);
    setTaskInput(74, 'employeeFeedback', employeeFeedback);

    // Save Data
    setTaskInput(75, 'analyticsFunnel', analyticsFunnel);
    setTaskInput(76, 'cohortRetention', cohortRetention);

    // Save Optimize
    setTaskInput(82, 'optimizationMetric', optimizationMetric);
    setTaskInput(83, 'growthLoops', growthLoops);
    setTaskInput(93, 'automationsStatus', automationsStatus);

    // Save OKRs & SOPs
    setTaskInput(95, 'okrsList', okrsList);
    setTaskInput(96, 'sopHandbook', sopHandbook);

    // Save Independence
    setTaskInput(97, 'pmfValidation', pmfValidation);
    setTaskInput(98, 'successionPlan', successionPlan);
    setTaskInput(99, 'expansionRoadmap', expansionRoadmap);
    setTaskInput(100, 'finalTargetGoal', finalTargetGoal);

    // Create a comprehensive markdown report matching the task type
    let docMarkdown = '';
    if (subStageType === 'starter-kits') {
      docMarkdown = `# Starter-Kits Portfolio\n- **Headline:** ${headline}\n- **Waitlist signups:** ${waitlistCount}\n- **LOI parameters:** ${loiDetails}\n- **LOIs signed:** ${loiSignedCount}\n- **Focus group channels:** ${focusGroupChannels}\n- **Pitch deck outline:**\n${deckOutline}\n- **Product One-Pager:** ${onePagerContent}`;
    } else if (subStageType === 'mvp') {
      docMarkdown = `# MVP Specs & Backlog\n- **Must-haves:**\n${mvpFeatures}\n- **Tech Stack:** ${techStack}\n- **CI/CD status:** ${workflowStatus}\n- **User Stories:** ${userStories}\n- **Demo debug logs:** ${debugLog}`;
    } else if (subStageType === 'brand') {
      docMarkdown = `# Brand Book Guide\n- **Brand values:** ${brandValues}\n- **Design specifications:** ${logoSystem}\n- **Copywriting guidelines:** ${brandVoice}\n- **UX Web vitals audits:** ${landingUxScore}`;
    } else if (subStageType === 'seed-capital') {
      docMarkdown = `# Pre-Seed Raise Campaign\n- **Ask:** $${preSeedAsk} (${runwayTarget} months runway)\n- **Allocations:** ${allocationAsk}\n- **Projections:** ${financialProjections}\n- **Investor Pipeline:**\n${investorCrm}\n- **Negotiations status:** ${termSheetStatus}`;
    } else if (subStageType === 'functions') {
      docMarkdown = `# Corporate Infrastructure Setup\n- **Status:** ${functionsStatus}`;
    } else if (subStageType === 'kpis') {
      docMarkdown = `# Metrics Dashboard & Cadence\n- **KPI Targets:** ${kpiTargets}\n- **Meeting cadence:** ${cadenceDetails}\n- **Dashboard Endpoint:** ${dashboardUrl}\n- **Automations:** ${reportingAutomation}`;
    } else if (subStageType === 'go-live') {
      docMarkdown = `# Go Live Launch Report\n- **Launch checklist status:** ${launchChecklist}\n- **Marketing campaign:** ${marketingCampaign}\n- **PR status:** ${prOutreach}\n- **Launch retrospective:** ${launchRetrospective}`;
    } else if (subStageType === 'growth-capital') {
      docMarkdown = `# Growth Funding Strategy\n- **Ask target:** $${growthFundingTarget}\n- **Cap Table breakdown:** ${growthCapTable}`;
    } else if (subStageType === 'culture') {
      docMarkdown = `# Corporate Culture Blueprint\n- **Core values:** ${cultureValues}\n- **HR policies guide:** ${hrHandbook}\n- **Feedback status:** ${employeeFeedback}`;
    } else if (subStageType === 'data-learning') {
      docMarkdown = `# Analytics & Retention Funnel\n- **Core funnel path:** ${analyticsFunnel}\n- **Retention numbers:** ${cohortRetention}`;
    } else if (subStageType === 'optimize') {
      docMarkdown = `# Scaling Optimization Report\n- **LTV / CAC status:** ${optimizationMetric}\n- **Growth virality loop:** ${growthLoops}\n- **Automated Zapier flows:** ${automationsStatus}`;
    } else if (subStageType === 'best-practices') {
      docMarkdown = `# OKRs & Standard Operating Procedures\n- **Active OKRs:** ${okrsList}\n- **Completed SOPs:** ${sopHandbook}`;
    } else if (subStageType === 'independence') {
      docMarkdown = `# PMF Scaling & Succession Roadmap\n- **Sean Ellis PMF score:** ${pmfValidation}\n- **GM delegation succession plan:** ${successionPlan}\n- **Expansion roadmap:** ${expansionRoadmap}\n- **Next Milestone Target:** ${finalTargetGoal}`;
    }

    setTaskInput(taskNum, 'notes', docMarkdown);
    setTaskInput(taskNum, 'deliverable', `Sub-Stage ${task.subStage} Output Document`);
  }, [
    taskNum, task, subStageType, setTaskInput,
    headline, waitlistCount, loiDetails, loiSignedCount, focusGroupChannels, deckOutline, onePagerContent,
    mvpFeatures, techStack, workflowStatus, userStories, mvpBackendUrl, debugLog,
    brandValues, logoSystem, brandVoice, landingUxScore,
    preSeedAsk, runwayTarget, allocationAsk, financialProjections, investorCrm, pitchRevisions, outreachStatus, partnerMeetingNotes, termSheetStatus,
    functionsStatus, kpiTargets, cadenceDetails, dashboardUrl, reportingAutomation,
    launchChecklist, marketingCampaign, prOutreach, userOnboardingUrl, launchRetrospective,
    growthFundingTarget, growthCapTable, cultureValues, hrHandbook, employeeFeedback,
    analyticsFunnel, cohortRetention, optimizationMetric, growthLoops, automationsStatus,
    okrsList, sopHandbook, pmfValidation, successionPlan, expansionRoadmap, finalTargetGoal
  ]);

  // Sync state on change
  useEffect(() => {
    saveAll();
  }, [saveAll]);

  const handleComplete = () => {
    saveAll();
    completeTask(taskNum);
    router.push('/tasks');
  };

  const currentStageColor = STAGE_COLORS[task.stage];

  // Helper inputs CSS classes
  const inputClass = "w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#B4F052]/40 resize-none font-sans";
  const labelClass = "text-xs text-white/40 block mb-1 font-semibold tracking-wide uppercase";

  // --- Sub-stage specific wizard forms ---
  const renderWorkspaceForm = () => {
    switch (subStageType) {
      case 'starter-kits':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#B4F052] mb-2">Starter-Kits Interactive Workspace</h3>
            <div>
              <label className={labelClass}>Landing Page Pitch Headline (Task 21)</label>
              <input value={headline} onChange={e => setHeadline(e.target.value)} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Waitlist Target Signups (Task 21)</label>
                <input value={waitlistCount} onChange={e => setWaitlistCount(e.target.value)} className={inputClass} type="number" />
              </div>
              <div>
                <label className={labelClass}>LOIs Signed (Task 22)</label>
                <input value={loiSignedCount} onChange={e => setLoiSignedCount(e.target.value)} className={inputClass} type="number" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Letter of Intent (LOI) Parameters (Task 22)</label>
              <textarea value={loiDetails} onChange={e => setLoiDetails(e.target.value)} className={inputClass} rows={3} />
            </div>
            <div>
              <label className={labelClass}>Focus Group Setup & Community Channels (Task 23)</label>
              <input value={focusGroupChannels} onChange={e => setFocusGroupChannels(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Pitch Presentation Deck Outline (Task 24)</label>
              <textarea value={deckOutline} onChange={e => setDeckOutline(e.target.value)} className={inputClass} rows={4} />
            </div>
            <div>
              <label className={labelClass}>Product One-Pager Core Value Proposition (Task 25)</label>
              <textarea value={onePagerContent} onChange={e => setOnePagerContent(e.target.value)} className={inputClass} rows={3} />
            </div>
          </div>
        );

      case 'mvp':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#B4F052] mb-2">MVP Specification Workspace</h3>
            <div>
              <label className={labelClass}>MVP Core Features List (Task 26)</label>
              <textarea value={mvpFeatures} onChange={e => setMvpFeatures(e.target.value)} className={inputClass} rows={4} />
            </div>
            <div>
              <label className={labelClass}>Tech Stack Selection (Task 27)</label>
              <input value={techStack} onChange={e => setTechStack(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>GitHub Workflow & Test Pipelines Status (Task 28)</label>
              <input value={workflowStatus} onChange={e => setWorkflowStatus(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Agile User Story (Task 29)</label>
              <textarea value={userStories} onChange={e => setUserStories(e.target.value)} className={inputClass} rows={2} />
            </div>
            <div>
              <label className={labelClass}>Deployed Core Backend API URL (Task 30)</label>
              <input value={mvpBackendUrl} onChange={e => setMvpBackendUrl(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Diagnostic & Demo Debug Logs Summary (Task 31)</label>
              <textarea value={debugLog} onChange={e => setDebugLog(e.target.value)} className={inputClass} rows={3} />
            </div>
          </div>
        );

      case 'brand':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#B4F052] mb-2">Brand Blueprint Workspace</h3>
            <div>
              <label className={labelClass}>Core Brand Values (Task 32)</label>
              <input value={brandValues} onChange={e => setBrandValues(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Logo Concept & Brand Style System (Task 33)</label>
              <textarea value={logoSystem} onChange={e => setLogoSystem(e.target.value)} className={inputClass} rows={3} />
            </div>
            <div>
              <label className={labelClass}>Copywriting Tone of Voice (Task 34)</label>
              <textarea value={brandVoice} onChange={e => setBrandVoice(e.target.value)} className={inputClass} rows={2} />
            </div>
            <div>
              <label className={labelClass}>Landing UX Page Speed & Accessibility Score (Task 35)</label>
              <input value={landingUxScore} onChange={e => setLandingUxScore(e.target.value)} className={inputClass} />
            </div>
          </div>
        );

      case 'seed-capital':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#B4F052] mb-2">Pre-Seed Raising Campaign</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Funding Target Ask ($) (Task 36)</label>
                <input value={preSeedAsk} onChange={e => setPreSeedAsk(e.target.value)} className={inputClass} type="number" />
              </div>
              <div>
                <label className={labelClass}>Runway Target (months) (Task 36)</label>
                <input value={runwayTarget} onChange={e => setRunwayTarget(e.target.value)} className={inputClass} type="number" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Allocation of Raised Capital (Task 36)</label>
              <input value={allocationAsk} onChange={e => setAllocationAsk(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Financial Model 3-Year ARR Projections (Task 37)</label>
              <textarea value={financialProjections} onChange={e => setFinancialProjections(e.target.value)} className={inputClass} rows={3} />
            </div>
            <div>
              <label className={labelClass}>Investor Pipeline CRM Status (Task 38)</label>
              <textarea value={investorCrm} onChange={e => setInvestorCrm(e.target.value)} className={inputClass} rows={4} />
            </div>
            <div>
              <label className={labelClass}>Pitch Presentation Cap Table Revisions (Task 39)</label>
              <input value={pitchRevisions} onChange={e => setPitchRevisions(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Outreach Campaign Metrics (Task 40)</label>
              <input value={outreachStatus} onChange={e => setOutreachStatus(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Investor Meeting Feedback Notes (Task 41)</label>
              <textarea value={partnerMeetingNotes} onChange={e => setPartnerMeetingNotes(e.target.value)} className={inputClass} rows={3} />
            </div>
            <div>
              <label className={labelClass}>Term Sheet Agreement Status (Task 42)</label>
              <input value={termSheetStatus} onChange={e => setTermSheetStatus(e.target.value)} className={inputClass} />
            </div>
          </div>
        );

      case 'functions':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#B4F052] mb-2">Operational Infrastructure Hub</h3>
            <p className="text-xs text-white/50 mb-3">Tasks 43-60 establish the tools, pipelines, structures, and accounts across your startup functions (Tech, Marketing, Sales, HR, Finance, and Support).</p>
            <div>
              <label className={labelClass}>Operational Systems Status Summary</label>
              <textarea value={functionsStatus} onChange={e => setFunctionsStatus(e.target.value)} className={inputClass} rows={6} />
            </div>
          </div>
        );

      case 'kpis':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#B4F052] mb-2">Metrics Dashboard Hub</h3>
            <div>
              <label className={labelClass}>KPI Baseline Goals & Targets (Task 61)</label>
              <textarea value={kpiTargets} onChange={e => setKpiTargets(e.target.value)} className={inputClass} rows={3} />
            </div>
            <div>
              <label className={labelClass}>Reporting & Cadence Plan (Task 62)</label>
              <input value={cadenceDetails} onChange={e => setCadenceDetails(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Diagnostic Dashboard Endpoint URL (Task 63)</label>
              <input value={dashboardUrl} onChange={e => setDashboardUrl(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Automated Reporting System Details (Task 64)</label>
              <input value={reportingAutomation} onChange={e => setReportingAutomation(e.target.value)} className={inputClass} />
            </div>
          </div>
        );

      case 'go-live':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#B4F052] mb-2">Go Live Deployment Hub</h3>
            <div>
              <label className={labelClass}>Production Build Launch Checklist (Task 65)</label>
              <textarea value={launchChecklist} onChange={e => setLaunchChecklist(e.target.value)} className={inputClass} rows={3} />
            </div>
            <div>
              <label className={labelClass}>Product Hunt Launch Campaign Details (Task 66)</label>
              <textarea value={marketingCampaign} onChange={e => setMarketingCampaign(e.target.value)} className={inputClass} rows={3} />
            </div>
            <div>
              <label className={labelClass}>Press Release Outreach Status (Task 67)</label>
              <input value={prOutreach} onChange={e => setPRStatus(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Onboarding Pipeline Flow URL (Task 68)</label>
              <input value={userOnboardingUrl} onChange={e => setUserOnboardingUrl(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Launch Retrospective & Metrics (Task 69)</label>
              <textarea value={launchRetrospective} onChange={e => setLaunchRetrospective(e.target.value)} className={inputClass} rows={3} />
            </div>
          </div>
        );

      case 'growth-capital':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#B4F052] mb-2">Growth Series A Raising Hub</h3>
            <div>
              <label className={labelClass}>Growth Round Target Ask ($) (Task 70)</label>
              <input value={growthFundingTarget} onChange={e => setGrowthFundingTarget(e.target.value)} className={inputClass} type="number" />
            </div>
            <div>
              <label className={labelClass}>Cap Table Breakdown (Task 71)</label>
              <textarea value={growthCapTable} onChange={e => setGrowthCapTable(e.target.value)} className={inputClass} rows={4} />
            </div>
          </div>
        );

      case 'culture':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#B4F052] mb-2">Culture & People Blueprint</h3>
            <div>
              <label className={labelClass}>Culture Handbook Core Principles (Task 72)</label>
              <textarea value={cultureValues} onChange={e => setCultureValues(e.target.value)} className={inputClass} rows={3} />
            </div>
            <div>
              <label className={labelClass}>Onboarding SOP & Policy Guidelines (Task 73)</label>
              <textarea value={hrHandbook} onChange={e => setHrHandbook(e.target.value)} className={inputClass} rows={3} />
            </div>
            <div>
              <label className={labelClass}>Employee Feedback Systems (Task 74)</label>
              <input value={employeeFeedback} onChange={e => setEmployeeFeedback(e.target.value)} className={inputClass} />
            </div>
          </div>
        );

      case 'data-learning':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#B4F052] mb-2">Analytics & Retention Learning</h3>
            <div>
              <label className={labelClass}>Diagnostic User Conversion Funnel (Task 75)</label>
              <textarea value={analyticsFunnel} onChange={e => setAnalyticsFunnel(e.target.value)} className={inputClass} rows={3} />
            </div>
            <div>
              <label className={labelClass}>Cohort Retention Metrics (Task 76)</label>
              <textarea value={cohortRetention} onChange={e => setCohortRetention(e.target.value)} className={inputClass} rows={3} />
            </div>
          </div>
        );

      case 'optimize':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#B4F052] mb-2">Scale Optimization</h3>
            <div>
              <label className={labelClass}>LTV to CAC Optimization Metrics (Task 82)</label>
              <input value={optimizationMetric} onChange={e => setOptimizationMetric(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Referral & Growth Loops (Task 83)</label>
              <textarea value={growthLoops} onChange={e => setGrowthLoops(e.target.value)} className={inputClass} rows={3} />
            </div>
            <div>
              <label className={labelClass}>Automated Zapier / Integration Pipelines (Task 93)</label>
              <textarea value={automationsStatus} onChange={e => setAutomationsStatus(e.target.value)} className={inputClass} rows={3} />
            </div>
          </div>
        );

      case 'best-practices':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#B4F052] mb-2">Company OKRs & SOPs</h3>
            <div>
              <label className={labelClass}>Current Quarter Objectives & Key Results (Task 95)</label>
              <textarea value={okrsList} onChange={e => setOkrsList(e.target.value)} className={inputClass} rows={4} />
            </div>
            <div>
              <label className={labelClass}>SOPs Central Knowledge Index (Task 96)</label>
              <textarea value={sopHandbook} onChange={e => setSopHandbook(e.target.value)} className={inputClass} rows={3} />
            </div>
          </div>
        );

      case 'independence':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#B4F052] mb-2">PMF & Succession Strategy</h3>
            <div>
              <label className={labelClass}>Sean Ellis PMF Scorecard Checklist (Task 97)</label>
              <textarea value={pmfValidation} onChange={e => setPmfValidation(e.target.value)} className={inputClass} rows={3} />
            </div>
            <div>
              <label className={labelClass}>Operations Delegation & Succession Plan (Task 98)</label>
              <textarea value={successionPlan} onChange={e => setSuccessionPlan(e.target.value)} className={inputClass} rows={3} />
            </div>
            <div>
              <label className={labelClass}>Global Expansion Roadmap & Bookkeeping (Task 99)</label>
              <textarea value={expansionRoadmap} onChange={e => setExpansionRoadmap(e.target.value)} className={inputClass} rows={3} />
            </div>
            <div>
              <label className={labelClass}>Next Level ARR Target Goal (Task 100)</label>
              <input value={finalTargetGoal} onChange={e => setFinalTargetGoal(e.target.value)} className={inputClass} />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#B4F052] mb-2">Workspace Inputs</h3>
            <div>
              <label className={labelClass}>Key notes</label>
              <textarea placeholder="Write notes here..." className={inputClass} rows={6} />
            </div>
          </div>
        );
    }
  };

  const checkedCount = task.keyPoints.filter((_, i) => subtaskChecks[`${taskNum}-${i}`]).length;
  const checkProgress = task.keyPoints.length > 0 ? Math.round((checkedCount / task.keyPoints.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 text-white animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-8">
        <div>
          <div className="text-white/40 text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5 font-sans">
            <Layers size={12} style={{ color: currentStageColor }} />
            <span style={{ color: currentStageColor }}>STAGE {task.stage}</span>
            <span>/</span>
            <span>{task.subStage}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Task {taskNum}: {task.title}</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            {task.description}
          </p>
        </div>

        {/* Cockpit Card */}
        <div className="glass-card p-4 border border-white/[0.08] flex items-center gap-6 text-xs bg-black/40 backdrop-blur-md">
          <div className="border-r border-white/[0.08] pr-4">
            <div className="text-white/40 mb-0.5">Estimated Duration</div>
            <div className="text-[#B4F052] font-semibold flex items-center gap-1">
              <Activity size={12} />
              <span>~{task.estimatedHours} Hours</span>
            </div>
          </div>
          <div className="border-r border-white/[0.08] pr-4">
            <div className="text-white/40 mb-0.5">Difficulty Level</div>
            <div className="flex gap-0.5 text-[#B4F052]">
              {Array.from({ length: task.difficulty }, (_, i) => <Star key={i} size={12} className="fill-[#B4F052]" />)}
              <span className="ml-1 text-white font-medium">({['Beginner','Intermediate','Advanced'][task.difficulty-1]})</span>
            </div>
          </div>
          <div>
            <div className="text-white/40 mb-0.5">Task Category</div>
            <div className="text-[#B4F052] font-semibold">{task.type}</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start font-sans">
        {/* Interactive Workspace Panel (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 border border-white/[0.08] bg-white/[0.01]">
            {renderWorkspaceForm()}
          </div>

          {/* Checklist */}
          <div className="glass-card p-6 border border-white/[0.08] bg-white/[0.01]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white/80">Step-by-Step checklist</h3>
              <div className="text-xs text-white/40">{checkedCount} of {task.keyPoints.length} Completed ({checkProgress}%)</div>
            </div>
            <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden mb-4">
              <div className="h-full rounded-full bg-[#B4F052] transition-all duration-300" style={{ width: `${checkProgress}%` }} />
            </div>
            <div className="space-y-2">
              {task.keyPoints.map((kp, i) => {
                const checked = subtaskChecks[`${taskNum}-${i}`];
                return (
                  <button key={i} onClick={() => toggleSubtask(`${taskNum}-${i}`)} className="flex items-start gap-3 w-full text-left p-2 rounded-lg hover:bg-white/[0.03] transition-all">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${checked ? 'bg-[#B4F052] border-[#B4F052] text-black' : 'border-white/20'}`}>
                      {checked && <CheckCircle2 size={12} className="stroke-[3px]" />}
                    </div>
                    <span className={`text-sm ${checked ? 'text-white/40 line-through' : 'text-white/80'}`}>{kp}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Info and Actions Panel */}
        <div className="space-y-6">
          {/* Outputs */}
          <div className="glass-card p-6 border border-white/[0.08] bg-white/[0.01]">
            <h3 className="text-xs text-white/40 font-semibold tracking-wider uppercase mb-3">Expected Outputs</h3>
            <div className="space-y-2">
              {task.outputs.map((o, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B4F052] flex-shrink-0" />
                  <span className="text-white/70">{o}</span>
                </div>
              ))}
            </div>
            
            {/* Complete Task Trigger */}
            <div className="mt-6">
              {!done ? (
                <button onClick={handleComplete} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#B4F052] to-[#8BC34A] text-black font-bold text-sm shadow-lg shadow-[#B4F052]/20 hover:opacity-95 transition-opacity">
                  <CheckCircle2 size={16} />
                  Mark Task as Complete (+10 XP)
                </button>
              ) : (
                <div className="w-full py-3 rounded-xl bg-[#B4F052]/10 border border-[#B4F052]/30 text-[#B4F052] font-semibold text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} />
                  Task Fully Completed
                </div>
              )}
            </div>
          </div>

          {/* Section PDF Exporter */}
          <div className="glass-card p-6 border border-white/[0.08] bg-white/[0.01]">
            <h3 className="text-xs text-white/40 font-semibold tracking-wider uppercase mb-2">Sub-Stage Report</h3>
            <p className="text-xs text-white/60 mb-4 leading-relaxed">
              Export all collected inputs and milestones for the **{task.subStage}** stage into a professionally styled PDF report.
            </p>
            <PhasePDFGenerator phase={phaseNum as 1 | 2 | 3 | 4 | 5} />
          </div>

          {/* recommended mentors */}
          <div className="glass-card p-6 border border-white/[0.08] bg-white/[0.01]">
            <h3 className="text-xs text-white/40 font-semibold tracking-wider uppercase mb-3">Recommended AI Roles</h3>
            <div className="flex flex-wrap gap-2">
              {task.aiRoles.map(r => (
                <span key={r} className="text-xs px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/60 font-sans">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-12 border-t border-white/[0.08] pt-6 font-sans">
        {prev ? (
          <button onClick={() => router.push(`/tasks/${prev.number}`)} className="flex items-center gap-2 text-sm text-white/40 hover:text-[#B4F052] transition-colors">
            <ChevronLeft size={16} />
            <span>Task {prev.number}: {prev.title}</span>
          </button>
        ) : <div />}
        {next ? (
          <button onClick={() => router.push(`/tasks/${next.number}`)} className="flex items-center gap-2 text-sm text-white/40 hover:text-[#B4F052] transition-colors">
            <span>Task {next.number}: {next.title}</span>
            <ChevronRight size={16} />
          </button>
        ) : <div />}
      </div>
    </div>
  );
}
