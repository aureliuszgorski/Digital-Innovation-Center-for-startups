'use client';
import React, { useState, useEffect } from 'react';
import { useGarage } from '@/context/GarageContext';
import { ArrowRight, Layers, Star, AlertTriangle, Save, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ValidationRow {
  assumption: string;
  type: 'Functional' | 'Operational' | 'Legal' | 'Financial';
  method: string;
  targetMetric: string;
  status: 'Pending' | 'Passed' | 'Failed';
}

interface WireframeScreen {
  id: string;
  title: string;
  description: string;
  components: string;
}

export default function Task20Redesign() {
  const router = useRouter();
  const { completeTask, setTaskInput, getTaskInput } = useGarage();


  // --- Import winning business model ---
  const winningModelName = getTaskInput(19, 'winningBusinessModelName') || 'AI-Powered SME Compliance Auditor';

  // --- Task 20 States ---
  const [activeTab, setActiveTab] = useState(1);

  // 1. PoC Scope Planner
  const [pocScope, setPocScope] = useState(() => {
    const raw = getTaskInput(20, 'pocScopeDetails');
    if (raw) return raw;
    return 'A web portal where users upload a CSV of bookkeeping transactions and receive a color-coded PDF compliance audit report matching 3 tax regulations. Fully automated backend without active ledger integrations.';
  });

  // 2. Feasibility Validation Matrix
  const [matrix, setMatrix] = useState<ValidationRow[]>(() => {
    const raw = getTaskInput(20, 'feasibilityValidationMatrix');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [
      { assumption: 'AI algorithms can parse ledger CSV schemas automatically.', type: 'Functional', method: 'Test parsing script against 5 distinct client-provided CSV exports.', targetMetric: '100% column matching accuracy', status: 'Passed' },
      { assumption: 'Tax audit rules can be codified in structured JSON arrays.', type: 'Functional', method: 'Verify JSON outputs against tax compliance guidelines.', targetMetric: 'Zero missed regulatory mismatch codes', status: 'Passed' },
      { assumption: 'Client database link conforms with local data privacy guidelines.', type: 'Legal', method: 'Review draft terms with compliance counsel advisor.', targetMetric: 'Counsel sign-off on anonymization pipeline', status: 'Passed' },
      { assumption: 'Founders can maintain cloud hosting costs below $50/month.', type: 'Financial', method: 'Review server resource allocations and API call limits.', targetMetric: 'Total operational costs < $30/month', status: 'Passed' }
    ];
  });

  // 3. Wireframe / Screens Mockup
  const [screens, setScreens] = useState<WireframeScreen[]>(() => {
    const raw = getTaskInput(20, 'wireframeScreens');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [
      {
        id: 'screen_1',
        title: 'Landing Page & LOI Signup',
        description: 'Presents the Value Proposition and lets users enter email to request pilot sandbox access.',
        components: 'Headline, 3 bullet USPs, Email input, LOI checkmark, "Request Auditing Sandbox" button.'
      },
      {
        id: 'screen_2',
        title: 'Sandbox CSV Upload Portal',
        description: 'Simulates the user dashboard. Users drop standard transaction sheets to trigger mock audit checks.',
        components: 'Drag & Drop CSV area, status spinner, "Run AI Compliance Audit" button.'
      },
      {
        id: 'screen_3',
        title: 'Audit Diagnostic Scorecard',
        description: 'Renders compliance rating, list of mismatched anomalies, and PDF download action.',
        components: 'Auditor rating meter, anomaly table, "Download PDF Certificate" trigger, LOI sign trigger.'
      }
    ];
  });

  // 4. Fast-to-Fail / Pivot Conditions
  const [failConditions, setFailConditions] = useState(() => {
    const raw = getTaskInput(20, 'failConditions');
    if (raw) return raw;
    return 'If client CSV column structures are too unstructured for auto-parsing, we will pivot to standard accounting plugin SDK integrations instead of generic file upload formats.';
  });

  // Sync state values on changes
  const saveAll = React.useCallback(() => {
    setTaskInput(20, 'pocScopeDetails', pocScope);
    setTaskInput(20, 'feasibilityValidationMatrix', JSON.stringify(matrix));
    setTaskInput(20, 'wireframeScreens', JSON.stringify(screens));
    setTaskInput(20, 'failConditions', failConditions);

    // Compile markdown PoC validation report
    const mdLines: string[] = [
      '# Proof of Concept & Validation Results',
      '',
      `**Crowned Business Model:** ${winningModelName}`,
      '',
      '## 1. Rudimentary PoC Scope',
      pocScope,
      '',
      '## 2. Feasibility Validation Matrix',
      '| Assumption | Type | Validation Method | Target Metric | Status |',
      '| ---------- | ---- | ----------------- | ------------- | ------ |'
    ];

    matrix.forEach(row => {
      mdLines.push(`| ${row.assumption} | ${row.type} | ${row.method} | ${row.targetMetric} | ${row.status} |`);
    });

    mdLines.push('', '## 3. Mock Wireframe Screens');
    screens.forEach(s => {
      mdLines.push(`### Screen: ${s.title}`);
      mdLines.push(`- **Description:** ${s.description}`);
      mdLines.push(`- **Components:** ${s.components}`);
      mdLines.push('');
    });

    mdLines.push('## 4. Fast-to-Fail / Pivot Conditions', failConditions);

    setTaskInput(20, 'notes', mdLines.join('\n'));
    setTaskInput(20, 'deliverable', 'Proof of Concept');
  }, [pocScope, matrix, screens, failConditions, winningModelName, setTaskInput]);

  useEffect(() => {
    saveAll();
  }, [saveAll]);

  const handleComplete = () => {
    saveAll();
    completeTask(20);
    router.push('/tasks');
  };

  const handleUpdateMatrixStatus = (idx: number, status: 'Pending' | 'Passed' | 'Failed') => {
    setMatrix(prev => prev.map((row, i) => i === idx ? { ...row, status } : row));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 text-white animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-8">
        <div>
          <div className="text-[#B4F052] text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Layers size={12} />
            Task 20 Redesign
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Build Proof of Concept</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Confirm feasibility before engineering. Scope your PoC, codify your wireframe modules, and outline your fast-to-fail parameters.
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
            <div className="text-white/40 mb-0.5">Winner Model</div>
            <div className="text-[#B4F052] font-semibold truncate max-w-[150px]">{winningModelName}</div>
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
              { id: 1, label: '1. PoC Scope Planner' },
              { id: 2, label: '2. Feasibility Matrix' },
              { id: 3, label: '3. Wireframe Screens' },
              { id: 4, label: '4. Fail / Pivot Rules' }
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
            {/* Step 1: PoC Scope */}
            {activeTab === 1 && (
              <div className="space-y-4 text-xs">
                <h3 className="text-base font-bold text-[#B4F052]">PoC Scope Planner</h3>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <label className="text-[10px] text-white/40 block">Define Rudimentary Demonstration Scope</label>
                  <textarea
                    value={pocScope}
                    onChange={e => setPocScope(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded p-3 text-white"
                    rows={4}
                  />
                  <p className="text-[10px] text-white/40 italic flex items-center gap-1.5 mt-1">
                    <Info size={12} className="text-[#B4F052]" />
                    Note: A PoC is a conceptual feasibility mockup. Avoid heavy coding or third-party paid subscriptions.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Feasibility Matrix */}
            {activeTab === 2 && (
              <div className="space-y-4 text-xs">
                <h3 className="text-base font-bold text-[#B4F052]">Feasibility Validation Matrix</h3>
                <div className="space-y-3">
                  {matrix.map((row, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <span className="font-bold text-white block">{row.assumption}</span>
                        <div className="flex gap-2 text-[9px] font-mono text-white/50">
                          <span className="bg-white/[0.06] px-1.5 py-0.5 rounded uppercase">{row.type}</span>
                          <span>Method: {row.method}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-[10px] font-medium text-[#B4F052]">Target: {row.targetMetric}</div>
                        <select
                          value={row.status}
                          onChange={e => handleUpdateMatrixStatus(idx, e.target.value as 'Pending' | 'Passed' | 'Failed')}
                          className={`bg-white/[0.02] border border-white/[0.08] rounded px-2.5 py-1 text-[11px] font-bold ${
                            row.status === 'Passed' ? 'text-emerald-400' : row.status === 'Failed' ? 'text-rose-400' : 'text-amber-400'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Passed">Passed</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Wireframe Screens */}
            {activeTab === 3 && (
              <div className="space-y-4 text-xs">
                <h3 className="text-base font-bold text-[#B4F052]">PoC Wireframe Mockups</h3>
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {screens.map((screen, idx) => (
                    <div key={screen.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-[#B4F052]">Screen #{idx + 1}: {screen.title}</span>
                      </div>
                      <div>
                        <label className="text-[9px] text-white/40 block mb-0.5">Screen Purpose / Description</label>
                        <input
                          type="text"
                          value={screen.description}
                          onChange={e => setScreens(prev => prev.map(s => s.id === screen.id ? { ...s, description: e.target.value } : s))}
                          className="w-full bg-white/[0.02] border border-white/[0.08] rounded px-3 py-1"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-white/40 block mb-0.5">Mock Components List</label>
                        <input
                          type="text"
                          value={screen.components}
                          onChange={e => setScreens(prev => prev.map(s => s.id === screen.id ? { ...s, components: e.target.value } : s))}
                          className="w-full bg-white/[0.02] border border-white/[0.08] rounded px-3 py-1 font-mono text-[10px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Fail / Pivot Rules */}
            {activeTab === 4 && (
              <div className="space-y-4 text-xs">
                <h3 className="text-base font-bold text-[#B4F052]">Fast-to-Fail / Pivot Conditions</h3>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <label className="text-[10px] text-rose-400 block font-bold">Define Fail conditions & Pivot thresholds</label>
                  <textarea
                    value={failConditions}
                    onChange={e => setFailConditions(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded p-3 text-white text-rose-200"
                    rows={4}
                  />
                  <p className="text-[10px] text-white/40 italic flex items-center gap-1.5 mt-1">
                    <AlertTriangle size={12} className="text-rose-400" />
                    Fail fast is a core lean startup asset. Knowing when to pivot saves runway hours.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Preview Panel */}
        <div className="space-y-6">
          {/* PoC validation stats */}
          <div className="glass-card p-4 border border-white/[0.08] space-y-3 bg-black/40">
            <span className="text-xs font-bold text-white/40 block uppercase">PoC Feasibility Status</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Total Assumptions</span>
                <span>{matrix.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Passed / Verified</span>
                <span className="text-emerald-400 font-semibold">{matrix.filter(x => x.status === 'Passed').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Feasibility Rate</span>
                <span className="text-[#B4F052] font-semibold">
                  {Math.round((matrix.filter(x => x.status === 'Passed').length / matrix.length) * 100)}%
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
              Save PoC Draft
            </button>
            <button
              onClick={handleComplete}
              className="w-full py-3 rounded-xl bg-[#B4F052] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 hover:opacity-95 transition-all shadow-md shadow-[#B4F052]/10"
            >
              Complete Task 20 and finalize
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
