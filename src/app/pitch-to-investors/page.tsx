'use client';
import { useState, useEffect } from 'react';
import { useGarage } from '@/context/GarageContext';
import { 
  Briefcase, TrendingUp, Target, DollarSign, Sparkles, 
  ArrowLeft, ArrowRight, Shield, Award, HelpCircle, Eye, EyeOff 
} from 'lucide-react';

interface QuestionCard {
  q: string;
  a: string;
}

const INVESTOR_QUESTIONS: QuestionCard[] = [
  {
    q: "How will you protect your margins if cloud compute and GPU prices rise?",
    a: "We minimize inference costs by using specialized open-weight models fine-tuned for our specific workflow, rather than querying generic LLM APIs. Our local telemetry caching and batching processes also keep API request volumes low."
  },
  {
    q: "Why are you launching as a single-founder/one-person garage?",
    a: "Using coordinated AI agent frameworks allows a single founder to achieve the operational throughput of an 8-person team. This maximizes capital efficiency and allows us to reach MVP and pilot validation before diluting equity."
  },
  {
    q: "How do you defend against Microsoft or OpenAI adding this to their bundles?",
    a: "Our defensibility lies in proprietary telemetry datasets and custom integrations. While generic models understand language, they lack the specific, fine-grained sequence data of a company's internal operations and custom legacy APIs."
  },
  {
    q: "What is your primary customer acquisition channel?",
    a: "We leverage a land-and-expand co-development strategy. By offering corporate partners a low-friction 4-week sandbox pilot program with concrete ROI guarantees, we secure long-term B2B contracts with zero upfront CAC."
  }
];

export default function PitchToInvestorsPage() {
  const { startupName, founderName } = useGarage();
  
  // Market size inputs (in Millions)
  const [tamValue, setTamValue] = useState(2500); // 2.5B
  const [samValue, setSamValue] = useState(500);  // 500M
  const [somValue, setSomValue] = useState(80);   // 80M

  // Financial projections inputs
  const [annualContractValue, setAnnualContractValue] = useState(24000); // $24k/yr
  const [customersY1, setCustomersY1] = useState(10);
  const [customersY2, setCustomersY2] = useState(45);
  const [customersY3, setCustomersY3] = useState(180);

  const [revY1, setRevY1] = useState(240000);
  const [revY2, setRevY2] = useState(1080000);
  const [revY3, setRevY3] = useState(4320000);

  // Funding ask input
  const [fundingAsk, setFundingAsk] = useState(1200000); // $1.2M

  // Presentation slides state
  const [activeSlide, setActiveSlide] = useState(0);
  const slidesCount = 10;

  // Q&A simulator state
  const [revealedQ, setRevealedQ] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setRevY1(annualContractValue * customersY1);
    setRevY2(annualContractValue * customersY2);
    setRevY3(annualContractValue * customersY3);
  }, [annualContractValue, customersY1, customersY2, customersY3]);

  const toggleRevealQ = (idx: number) => {
    setRevealedQ(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getSlideTitle = (idx: number) => {
    switch (idx) {
      case 0: return '1. Executive Summary';
      case 1: return '2. The Problem';
      case 2: return '3. The Solution';
      case 3: return '4. Market Size (TAM/SAM/SOM)';
      case 4: return '5. Business Model';
      case 5: return '6. Proprietary Moat';
      case 6: return '7. Go-To-Market (GTM)';
      case 7: return '8. Competitors';
      case 8: return '9. Financial Projections';
      case 9: default: return '10. The Ask & Timeline';
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4F052]/10 border border-[#B4F052]/20 text-xs font-semibold text-[#B4F052] mb-3">
          <Briefcase size={12} />
          <span>VENTURE CAPITAL DECK BUILDER</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Pitch to Investors</h1>
        <p className="text-white/60 text-sm max-w-2xl">
          Tweak your TAM metrics, model 3-year revenue projections, configure seed funding asks, and rehearse answers to tough VC questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column: Controls and modelers */}
        <div className="space-y-6">
          {/* Market Size Scoping */}
          <div className="glass-card p-6">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Target size={16} className="text-[#B4F052]" />
              <span>Market Sizing Modeler (TAM / SAM / SOM)</span>
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">TAM ($ Millions)</label>
                <input
                  type="number"
                  value={tamValue}
                  onChange={(e) => setTamValue(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#B4F052]/50 text-white rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">SAM ($ Millions)</label>
                <input
                  type="number"
                  value={samValue}
                  onChange={(e) => setSamValue(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#B4F052]/50 text-white rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">SOM ($ Millions)</label>
                <input
                  type="number"
                  value={somValue}
                  onChange={(e) => setSomValue(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#B4F052]/50 text-white rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>
            </div>
            <p className="text-[10px] text-white/45 mt-3 leading-normal">
              * TAM: Total Addressable Market. SAM: Serviceable Addressable Market. SOM: Serviceable Obtainable Market (our target share).
            </p>
          </div>

          {/* Revenue Projection Scoping */}
          <div className="glass-card p-6">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#B4F052]" />
              <span>3-Year Financial Projections</span>
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Average ACV ($ / Year)</label>
                <input
                  type="number"
                  value={annualContractValue}
                  onChange={(e) => setAnnualContractValue(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#B4F052]/50 text-white rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Target Funding Round Ask ($)</label>
                <input
                  type="number"
                  value={fundingAsk}
                  onChange={(e) => setFundingAsk(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#B4F052]/50 text-white rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1 bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl text-center">
                <label className="text-[9px] font-bold text-white/30 uppercase">Y1 Customers</label>
                <input
                  type="number"
                  value={customersY1}
                  onChange={(e) => setCustomersY1(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-transparent border-0 text-center font-bold text-white text-sm outline-none mt-1"
                />
                <div className="text-[10px] text-white/40 mt-1">${(revY1/1000).toFixed(0)}k ARR</div>
              </div>
              <div className="space-y-1 bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl text-center">
                <label className="text-[9px] font-bold text-white/30 uppercase">Y2 Customers</label>
                <input
                  type="number"
                  value={customersY2}
                  onChange={(e) => setCustomersY2(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-transparent border-0 text-center font-bold text-white text-sm outline-none mt-1"
                />
                <div className="text-[10px] text-white/40 mt-1">${(revY2/1000000).toFixed(2)}M ARR</div>
              </div>
              <div className="space-y-1 bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl text-center">
                <label className="text-[9px] font-bold text-white/30 uppercase">Y3 Customers</label>
                <input
                  type="number"
                  value={customersY3}
                  onChange={(e) => setCustomersY3(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-transparent border-0 text-center font-bold text-white text-sm outline-none mt-1"
                />
                <div className="text-[10px] text-white/40 mt-1">${(revY3/1000000).toFixed(2)}M ARR</div>
              </div>
            </div>
          </div>

          {/* Q&A Simulator training */}
          <div className="glass-card p-6">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle size={16} className="text-[#B4F052]" />
              <span>Investor Q&A Simulator</span>
            </h2>
            <div className="space-y-4">
              {INVESTOR_QUESTIONS.map((item, idx) => {
                const isRevealed = !!revealedQ[idx];
                return (
                  <div key={idx} className="bg-white/[0.01] border border-white/[0.06] p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-xs font-bold text-white leading-normal">
                        &ldquo;{item.q}&rdquo;
                      </h4>
                      <button 
                        onClick={() => toggleRevealQ(idx)}
                        className="p-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white"
                        title={isRevealed ? "Hide response" : "Reveal recommended answer"}
                      >
                        {isRevealed ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    </div>
                    {isRevealed && (
                      <p className="text-[11px] text-[#B4F052] leading-normal pt-2 border-t border-white/[0.04] animate-fade-in">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: 10-slide Deck Preview */}
        <div className="space-y-6">
          <div className="glass-card p-6 flex flex-col justify-between h-[450px]">
            {/* Slide container */}
            <div className="flex-1 flex flex-col justify-center bg-black/40 border border-white/[0.06] rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B4F052]/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />

              <div className="absolute top-4 left-4 text-[9px] font-mono text-white/30 tracking-wider">
                {getSlideTitle(activeSlide)}
              </div>

              {/* Cover Slide */}
              {activeSlide === 0 && (
                <div className="text-center space-y-4 animate-fade-in">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4F052]/10 border border-[#B4F052]/20 text-[#B4F052] text-[10px] font-mono">
                    <Sparkles size={10} />
                    <span>PRE-SEED/SEED ROUND DECK</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight leading-none pt-2">
                    {startupName}
                  </h3>
                  <p className="text-xs text-white/60 max-w-xs mx-auto leading-relaxed">
                    Solving civilization-scale startup challenges with automated coordinates and single-founder workflows.
                  </p>
                  <div className="text-[10px] text-white/30 border-t border-white/[0.08] pt-4 max-w-[200px] mx-auto">
                    Presented by: {founderName}
                  </div>
                </div>
              )}

              {/* Problem Slide */}
              {activeSlide === 1 && (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-[9px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">Problem</span>
                  <h4 className="text-lg font-bold text-white leading-snug pt-1">
                    Startups waste months prescribing solutions to problems that do not exist.
                  </h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    80% of founders fail to quantitatively validate their market pain points. They lack integration tools to run sandbox pilot programs early in their lifecycle, leading to false starts.
                  </p>
                </div>
              )}

              {/* Solution Slide */}
              {activeSlide === 2 && (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Solution</span>
                  <h4 className="text-lg font-bold text-white leading-snug pt-1">
                    The Digital Innovation Center Operational Cockpit
                  </h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    A data-driven playbook built on 100 structured tasks, unified with specialized AI co-founders, sandbox metrics engines, and structured pilot scoping algorithms to validate and deploy code at scale.
                  </p>
                </div>
              )}

              {/* Market Size Slide (TAM/SAM/SOM concentric circles visualization) */}
              {activeSlide === 3 && (
                <div className="space-y-4 animate-fade-in flex flex-col justify-center h-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">Market Size</span>
                      <h4 className="text-sm font-bold text-white mt-1">Total TAM/SAM/SOM Scope</h4>
                    </div>
                  </div>
                  {/* Concentric styled diagram */}
                  <div className="flex items-center gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/60 font-semibold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />TAM</span>
                        <span className="font-bold text-white">${(tamValue/1000).toFixed(1)}B</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/60 font-semibold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500" />SAM</span>
                        <span className="font-bold text-white">${samValue}M</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/60 font-semibold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#B4F052]" />SOM</span>
                        <span className="font-bold text-[#B4F052]">${somValue}M</span>
                      </div>
                    </div>
                    {/* Concentric visualization boxes */}
                    <div className="w-28 h-28 relative flex items-center justify-center border border-white/[0.06] rounded-2xl bg-white/[0.01]">
                      {/* TAM circle outline */}
                      <div className="absolute inset-2 border border-blue-500/30 rounded-full flex items-center justify-center bg-blue-500/[0.02]">
                        {/* SAM circle outline */}
                        <div className="absolute inset-4 border border-cyan-500/40 rounded-full flex items-center justify-center bg-cyan-500/[0.03]">
                          {/* SOM circle outline */}
                          <div className="absolute inset-4 border border-[#B4F052]/50 rounded-full bg-[#B4F052]/10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Business Model Slide */}
              {activeSlide === 4 && (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">Business Model</span>
                  <h4 className="text-sm font-bold text-white mt-1">SaaS Subscriptions & Co-development</h4>
                  <div className="space-y-2 text-xs text-white/50 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B4F052]" />
                      <span><strong>SaaS License</strong>: Average of ${annualContractValue.toLocaleString()}/yr ACV contract.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B4F052]" />
                      <span><strong>Discovery Grants</strong>: Shortlist co-funding from partner sandboxes.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B4F052]" />
                      <span><strong>Success Share</strong>: Up to 10% commission on direct pilot cost savings.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Proprietary Moat Slide */}
              {activeSlide === 5 && (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-[9px] font-mono text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded">Moat</span>
                  <h4 className="text-lg font-bold text-white leading-snug pt-1">
                    Proprietary Telemetry & Active Sandbox Access
                  </h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    By running structured sandboxes, we capture proprietary sequence data. Our custom local models fine-tune automatically based on direct execution telemetry, making our system-level workflow impossible to duplicate.
                  </p>
                </div>
              )}

              {/* GTM Slide */}
              {activeSlide === 6 && (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-[9px] font-mono text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">Go-To-Market</span>
                  <h4 className="text-sm font-bold text-white mt-1">Land & Expand Pilot Loops</h4>
                  <div className="space-y-2 text-xs text-white/50 pt-1">
                    <div className="flex items-start gap-2">
                      <span className="mt-1 px-1 py-0.5 rounded bg-white/5 font-mono text-[9px] text-white/40">1</span>
                      <span>Target corporate sectors from the 100 Challenges index.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 px-1 py-0.5 rounded bg-white/5 font-mono text-[9px] text-white/40">2</span>
                      <span>Convert them via zero-friction 4-week sandbox pilot programs.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 px-1 py-0.5 rounded bg-white/5 font-mono text-[9px] text-white/40">3</span>
                      <span>Convert validated pilots to multi-year contracts with ARR scaling.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Competition Slide */}
              {activeSlide === 7 && (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-[9px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">Competition</span>
                  <h4 className="text-sm font-bold text-white mt-1">Competitive Matrix & Moat</h4>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div className="bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl">
                      <div className="text-[9px] text-white/40 font-bold uppercase">Legacy Systems</div>
                      <p className="text-[10px] text-white/50 leading-relaxed mt-1">High configuration friction, manual scripting, slow deployment.</p>
                    </div>
                    <div className="bg-[#B4F052]/5 border border-[#B4F052]/20 p-2.5 rounded-xl">
                      <div className="text-[9px] text-[#B4F052] font-bold uppercase">{startupName}</div>
                      <p className="text-[10px] text-white/70 leading-relaxed mt-1">Immediate sandbox setup, AI co-founders, telemetry loop, low margin cost.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Projections Slide (Dynamic chart visualization) */}
              {activeSlide === 8 && (
                <div className="space-y-3 animate-fade-in flex flex-col justify-center h-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded">Projections</span>
                      <h4 className="text-sm font-bold text-white mt-1">Projected ARR Growth</h4>
                    </div>
                  </div>
                  {/* Dynamic CSS Bar Chart */}
                  <div className="flex items-end justify-around h-24 pt-4 border-b border-white/[0.08] relative">
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-8 bg-cyan-500/80 rounded-t-md transition-all duration-700" style={{ height: '10%' }} />
                      <span className="text-[9px] font-bold text-white/40 mt-1">Y1: ${(revY1/1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-8 bg-blue-500/80 rounded-t-md transition-all duration-700" style={{ height: '30%' }} />
                      <span className="text-[9px] font-bold text-white/40 mt-1">Y2: ${(revY2/1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-8 bg-[#B4F052] rounded-t-md transition-all duration-700 animate-pulse-glow" style={{ height: '75%' }} />
                      <span className="text-[9px] font-bold text-[#B4F052] mt-1">Y3: ${(revY3/1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Ask Slide */}
              {activeSlide === 9 && (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-[9px] font-mono text-lime-400 bg-lime-500/10 border border-lime-500/20 px-2 py-0.5 rounded">The Ask</span>
                  <h4 className="text-base font-extrabold text-white leading-snug pt-1">
                    Seeking ${fundingAsk.toLocaleString()} USD Seed Funding
                  </h4>
                  <div className="space-y-2 text-xs text-white/50 pt-1">
                    <div className="flex justify-between items-center">
                      <span>Product & Engineering (60%)</span>
                      <span className="font-bold text-white">${(fundingAsk * 0.6).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Growth & Sales (25%)</span>
                      <span className="font-bold text-white">${(fundingAsk * 0.25).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Ops & Compliance (15%)</span>
                      <span className="font-bold text-white">${(fundingAsk * 0.15).toLocaleString()}</span>
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

          {/* Allocation Bar */}
          <div className="glass-card p-6">
            <h2 className="text-base font-bold text-white mb-4">Capital Allocation Roadmap</h2>
            <div className="space-y-4">
              <div className="w-full h-4 bg-white/[0.05] rounded-full overflow-hidden flex">
                <div className="h-full bg-[#B4F052]" style={{ width: '60%' }} title="Product & Engineering: 60%" />
                <div className="h-full bg-cyan-500" style={{ width: '25%' }} title="Growth & Sales: 25%" />
                <div className="h-full bg-blue-500" style={{ width: '15%' }} title="Ops & Compliance: 15%" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="flex flex-col">
                  <span className="font-bold text-[#B4F052]">60%</span>
                  <span className="text-white/40">Product/Eng</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-cyan-500">25%</span>
                  <span className="text-white/40">Growth/Sales</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-blue-500">15%</span>
                  <span className="text-white/40">Ops/Compliance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
