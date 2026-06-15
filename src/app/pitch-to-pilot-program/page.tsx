'use client';
import { useState, useEffect } from 'react';
import { useGarage } from '@/context/GarageContext';
import { 
  Building, Clock, FileText, Clipboard, Check, Sparkles, 
  ArrowLeft, ArrowRight, DollarSign, Heart, AlertCircle 
} from 'lucide-react';

export default function PitchToPilotProgramPage() {
  const { startupName, founderName } = useGarage();
  const [partnerName, setPartnerName] = useState('Acme Corp');
  const [targetSector, setTargetSector] = useState('Logistics & Supply Chain');
  const [pilotWeeks, setPilotWeeks] = useState(4);
  const [problemDescription, setProblemDescription] = useState('Manual delivery dispatch coordination takes 15+ hours per week per facility, causing scheduling overlaps and a 12% delay rate in shipments.');
  const [solutionScope, setSolutionScope] = useState('We will deploy our autonomous delivery coordinator system into 1 facility, integrating with current fleet logs to automate dispatch routing.');
  const [primaryKPI, setPrimaryKPI] = useState('Reduce dispatch coordination time by 40% and bring shipping delays under 3%.');
  const [apiSandboxRequired, setApiSandboxRequired] = useState('Historical fleet logs (CSV or API), read-access to active dispatch schedules.');
  
  // ROI variables
  const [hoursSavedPerWeek, setHoursSavedPerWeek] = useState(15);
  const [employeeLaborRate, setEmployeeLaborRate] = useState(45);
  const [weeklySavings, setWeeklySavings] = useState(675);
  const [totalPilotSavings, setTotalPilotSavings] = useState(2700);

  // Slide state
  const [activeSlide, setActiveSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  // Recalculate ROI whenever hours or rate changes
  useEffect(() => {
    const weekly = hoursSavedPerWeek * employeeLaborRate;
    setWeeklySavings(weekly);
    setTotalPilotSavings(weekly * pilotWeeks);
  }, [hoursSavedPerWeek, employeeLaborRate, pilotWeeks]);

  const slidesCount = 5;

  const handleCopyMarkdown = () => {
    const markdownContent = `# PILOT PROGRAM PROPOSAL
**Prepared by**: ${startupName}
**Founder**: ${founderName}
**Target Partner**: ${partnerName} (${targetSector})
**Duration**: ${pilotWeeks}-Week Structured Co-Development

---

## 1. The Core Pain Point
${problemDescription}

## 2. Proposed MVP Solution & Scope
${solutionScope}

## 3. Weekly Roadmap & Milestones
- **Weeks 1-${Math.ceil(pilotWeeks * 0.25)}**: Data Sandbox Integration & API Configuration
- **Weeks ${Math.ceil(pilotWeeks * 0.25) + 1}-${Math.ceil(pilotWeeks * 0.5)}**: Core Workflow Setup & First Live Testing Run
- **Weeks ${Math.ceil(pilotWeeks * 0.5) + 1}-${Math.ceil(pilotWeeks * 0.75)}**: Parallel Run & Active Feedback Integration
- **Weeks ${Math.ceil(pilotWeeks * 0.75) + 1}-${pilotWeeks}**: Pilot Evaluation, Success Metrics Auditing, and Demo Day

## 4. Success KPIs & ROI Metrics
- **Primary Success Metric**: ${primaryKPI}
- **Required Partner Sandbox Access**: ${apiSandboxRequired}
- **Estimated Operational Savings**:
  - Hours Saved: ${hoursSavedPerWeek} hrs/week
  - Weekly Financial Impact: $${weeklySavings} USD ($${employeeLaborRate}/hr)
  - Cumulative Pilot Operational ROI: $${totalPilotSavings} USD

---
Generated in Digital Innovation Center for Startups @ District.org Pilot Cockpit.`;

    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMilestoneDescription = (phase: number) => {
    switch (phase) {
      case 1:
        return {
          title: 'Phase 1: Sandbox & Setup',
          weeks: `Week 1-${Math.ceil(pilotWeeks * 0.25)}`,
          desc: 'Establish database connections, set up read-only sandbox accounts, and ingest sample logs for testing.'
        };
      case 2:
        return {
          title: 'Phase 2: Core Deployment',
          weeks: `Week ${Math.ceil(pilotWeeks * 0.25) + 1}-${Math.ceil(pilotWeeks * 0.5)}`,
          desc: 'Deploy the MVP coordinator system, sync live telemetry, and run initial simulations to check output stability.'
        };
      case 3:
        return {
          title: 'Phase 3: Active Trial Run',
          weeks: `Week ${Math.ceil(pilotWeeks * 0.5) + 1}-${Math.ceil(pilotWeeks * 0.75)}`,
          desc: 'Incorporate real human-in-the-loop validation, run parallel workflows, and refine algorithms based on telemetry.'
        };
      case 4:
      default:
        return {
          title: 'Phase 4: Audit & Demo Day',
          weeks: `Week ${Math.ceil(pilotWeeks * 0.75) + 1}-${pilotWeeks}`,
          desc: 'Evaluate key success metric achievement, compile final pilot efficiency audit report, and present Demo Day slides.'
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4F052]/10 border border-[#B4F052]/20 text-xs font-semibold text-[#B4F052] mb-3">
            <Building size={12} />
            <span>B2B / B2G PILOT SCOPING ENGINE</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Pitch to Pilot Program</h1>
          <p className="text-white/60 text-sm max-w-xl">
            Configure co-development parameters, model direct ROI, and preview your professional pilot proposal slides in real time.
          </p>
        </div>
        <button
          onClick={handleCopyMarkdown}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-white rounded-xl text-xs font-bold transition-all"
        >
          {copied ? <Check size={14} className="text-[#B4F052]" /> : <Clipboard size={14} />}
          <span>{copied ? 'Proposal Copied!' : 'Export Proposal Markdown'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column: Scoping controls */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <span>Pilot Parameters & Scope</span>
            </h2>

            {/* Target Partner & Sector */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Partner Name</label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#B4F052]/50 text-white rounded-xl px-3 py-2 text-xs outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Target Sector</label>
                <input
                  type="text"
                  value={targetSector}
                  onChange={(e) => setTargetSector(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#B4F052]/50 text-white rounded-xl px-3 py-2 text-xs outline-none transition-all"
                />
              </div>
            </div>

            {/* Duration and sandbox */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Duration (Weeks)</label>
                <input
                  type="number"
                  min="4"
                  max="16"
                  value={pilotWeeks}
                  onChange={(e) => setPilotWeeks(Math.max(4, parseInt(e.target.value) || 4))}
                  className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#B4F052]/50 text-white rounded-xl px-3 py-2 text-xs outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Required APIs/Sandbox</label>
                <input
                  type="text"
                  value={apiSandboxRequired}
                  onChange={(e) => setApiSandboxRequired(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#B4F052]/50 text-white rounded-xl px-3 py-2 text-xs outline-none transition-all text-ellipsis"
                />
              </div>
            </div>

            {/* Problem & Solution Texts */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase">Problem Statement</label>
              <textarea
                rows={2}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#B4F052]/50 text-white rounded-xl p-3 text-xs outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase">Solution Scope (MVP Target)</label>
              <textarea
                rows={2}
                value={solutionScope}
                onChange={(e) => setSolutionScope(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#B4F052]/50 text-white rounded-xl p-3 text-xs outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase">Primary KPI Objective</label>
              <textarea
                rows={2}
                value={primaryKPI}
                onChange={(e) => setPrimaryKPI(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#B4F052]/50 text-white rounded-xl p-3 text-xs outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* ROI Calculator */}
          <div className="glass-card p-6">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign size={16} className="text-[#B4F052]" />
              <span>Pilot ROI & Impact Modeler</span>
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-white/40 uppercase">Estimated Hours Saved / Wk</label>
                  <input
                    type="number"
                    min="1"
                    value={hoursSavedPerWeek}
                    onChange={(e) => setHoursSavedPerWeek(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#B4F052]/50 text-white rounded-xl px-3 py-2 text-xs outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-white/40 uppercase">Internal Employee Rate ($/Hr)</label>
                  <input
                    type="number"
                    min="1"
                    value={employeeLaborRate}
                    onChange={(e) => setEmployeeLaborRate(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#B4F052]/50 text-white rounded-xl px-3 py-2 text-xs outline-none transition-all"
                  />
                </div>
              </div>

              {/* Calculator output summary */}
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-wide">Weekly savings</span>
                  <div className="text-2xl font-bold text-white mt-1">
                    ${weeklySavings.toLocaleString()}<span className="text-xs text-white/40 font-normal"> USD</span>
                  </div>
                </div>
                <div className="border-t border-white/[0.05] pt-3 mt-3">
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-wide">Total Pilot ROI ({pilotWeeks} wks)</span>
                  <div className="text-xl font-bold text-[#B4F052] mt-0.5">
                    ${totalPilotSavings.toLocaleString()} USD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Slide deck preview */}
        <div className="space-y-6">
          <div className="glass-card p-6 flex flex-col justify-between h-[450px]">
            {/* Slide container */}
            <div className="flex-1 flex flex-col justify-center bg-black/40 border border-white/[0.06] rounded-2xl p-8 relative overflow-hidden">
              {/* Slide Background neon details */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B4F052]/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />

              {/* Active slide content */}
              {activeSlide === 0 && (
                <div className="space-y-4 animate-fade-in text-center">
                  <span className="text-[10px] font-mono text-[#B4F052] tracking-widest uppercase bg-[#B4F052]/10 border border-[#B4F052]/20 px-2.5 py-1 rounded-full">
                    Slide 1: Cover
                  </span>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight leading-tight pt-2">
                    Co-development & Pilot Program Proposal
                  </h3>
                  <div className="text-sm font-semibold text-white/60">
                    Prepared for: <span className="text-white">{partnerName}</span>
                  </div>
                  <div className="text-xs text-white/40 border-t border-white/[0.08] pt-4 max-w-[240px] mx-auto">
                    Initiative by {startupName} • {founderName}
                  </div>
                </div>
              )}

              {activeSlide === 1 && (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-[10px] font-mono text-blue-400 tracking-widest uppercase bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full w-fit">
                    Slide 2: The Pain Point
                  </span>
                  <div className="text-xs font-semibold text-white/40 mt-2 uppercase tracking-wide">Target Sector: {targetSector}</div>
                  <h4 className="text-base font-extrabold text-white leading-relaxed">
                    &ldquo;{problemDescription}&rdquo;
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-white/40 bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl mt-4">
                    <AlertCircle size={14} className="text-yellow-500 flex-shrink-0" />
                    <span>Severe operational friction requiring automated telemetry.</span>
                  </div>
                </div>
              )}

              {activeSlide === 2 && (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full w-fit">
                    Slide 3: Proposed Solution
                  </span>
                  <div className="text-xs font-semibold text-white/40 mt-2 uppercase tracking-wide">Scoped MVP Integration</div>
                  <h4 className="text-base font-extrabold text-white leading-relaxed">
                    {solutionScope}
                  </h4>
                  <div className="text-xs text-white/50 bg-[#B4F052]/5 border border-[#B4F052]/10 p-3 rounded-xl mt-4">
                    <strong>Deployment Timeline</strong>: {pilotWeeks} Weeks from Sandbox Integration.
                  </div>
                </div>
              )}

              {activeSlide === 3 && (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-[10px] font-mono text-purple-400 tracking-widest uppercase bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full w-fit">
                    Slide 4: Project Roadmap
                  </span>
                  <div className="text-xs font-semibold text-white/40 mt-2 uppercase tracking-wide">Weekly Project Phases</div>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {[1, 2, 3, 4].map(phase => {
                      const details = getMilestoneDescription(phase);
                      return (
                        <div key={phase} className="bg-white/[0.02] border border-white/[0.05] p-2.5 rounded-xl">
                          <div className="text-[10px] font-bold text-[#B4F052]">{details.weeks}</div>
                          <div className="text-[11px] font-bold text-white truncate">{details.title}</div>
                          <div className="text-[9px] text-white/40 line-clamp-1 leading-normal mt-0.5">{details.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeSlide === 4 && (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full w-fit">
                    Slide 5: Expected Value & ROI
                  </span>
                  <div className="text-[11px] font-bold text-white/40 uppercase tracking-wide mt-2">Success Metric target</div>
                  <div className="text-xs font-bold text-white bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl">
                    {primaryKPI}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="bg-white/[0.02] border border-white/[0.05] p-2.5 rounded-xl">
                      <div className="text-[9px] text-white/40 uppercase">Operational Savings</div>
                      <div className="text-sm font-bold text-white mt-0.5">{hoursSavedPerWeek} hrs/week</div>
                    </div>
                    <div className="bg-white/[0.02] border border-[#B4F052]/20 p-2.5 rounded-xl">
                      <div className="text-[9px] text-white/40 uppercase">Pilot ROI</div>
                      <div className="text-sm font-bold text-[#B4F052] mt-0.5">${totalPilotSavings.toLocaleString()} USD</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Slide Navigation */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-white/40">
                Slide {activeSlide + 1} of {slidesCount}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                  disabled={activeSlide === 0}
                  className="p-2 rounded-xl bg-white/[0.03] disabled:opacity-30 border border-white/[0.08] hover:bg-white/[0.06] text-white/80 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                </button>
                <button
                  onClick={() => setActiveSlide(prev => Math.min(slidesCount - 1, prev + 1))}
                  disabled={activeSlide === slidesCount - 1}
                  className="p-2 rounded-xl bg-white/[0.03] disabled:opacity-30 border border-white/[0.08] hover:bg-white/[0.06] text-white/80 cursor-pointer"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Milestones View */}
          <div className="glass-card p-6">
            <h2 className="text-base font-bold text-white mb-4">Milestone Roadmap</h2>
            <div className="space-y-4 relative pl-4 border-l border-white/[0.08]">
              {[1, 2, 3, 4].map(phase => {
                const details = getMilestoneDescription(phase);
                return (
                  <div key={phase} className="relative space-y-1">
                    {/* Circle bullet on timeline */}
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#B4F052] border-2 border-black" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#B4F052]">{details.weeks}</span>
                      <span className="text-white/30 text-xs">•</span>
                      <h4 className="text-xs font-bold text-white">{details.title}</h4>
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed">{details.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
