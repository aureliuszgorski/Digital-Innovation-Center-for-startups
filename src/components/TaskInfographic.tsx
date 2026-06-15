'use client';
import React from 'react';
import { 
  TrendingUp, Target, Users, Settings, Check, ArrowRight, ArrowDown, 
  Layers, Sparkles, AlertTriangle, Shield, DollarSign, LineChart, 
  Activity, Zap, Compass, CheckCircle, HelpCircle, Eye, Search, 
  ShieldAlert, Mail, PenTool
} from 'lucide-react';

// Premium UI Primitives

// 1. GlassCard
export const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className = '', hover = false }) => {
  return (
    <div className={`rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md transition-all duration-300 ${hover ? 'hover:bg-white/[0.05] hover:border-[#B4F052]/40 hover:shadow-lg hover:shadow-[#B4F052]/5 hover:-translate-y-0.5' : ''} ${className}`}>
      {children}
    </div>
  );
};

// 2. Badge
export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'green' | 'purple' | 'gray' | 'blue' | 'red';
  className?: string;
}> = ({ children, variant = 'green', className = '' }) => {
  const styles = {
    green: 'bg-[#B4F052]/10 border border-[#B4F052]/30 text-[#B4F052]',
    purple: 'bg-purple-500/10 border border-purple-500/30 text-purple-400',
    gray: 'bg-white/5 border border-white/10 text-white/60',
    blue: 'bg-blue-500/10 border border-blue-500/30 text-blue-400',
    red: 'bg-red-500/10 border border-red-500/30 text-red-400',
  };
  return (
    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// 3. Button
export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}> = ({ children, onClick, variant = 'primary', className = '' }) => {
  const styles = {
    primary: 'bg-[#B4F052] hover:bg-[#B4F052]/90 text-black font-semibold',
    secondary: 'bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:border-[#B4F052]/30',
  };
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-xl text-xs transition-all duration-300 cursor-pointer ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
};

// 4. Grid
export const Grid: React.FC<{
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}> = ({ children, cols = 3, className = '' }) => {
  const colStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
  };
  return (
    <div className={`grid gap-4 ${colStyles[cols]} ${className}`}>
      {children}
    </div>
  );
};

// 5. Timeline
export interface TimelineStep {
  title: string;
  description: string;
  badge?: string;
  isCompleted?: boolean;
}

export const Timeline: React.FC<{
  steps: TimelineStep[];
  className?: string;
}> = ({ steps, className = '' }) => {
  return (
    <div className={`relative border-l border-white/[0.08] ml-4 pl-6 space-y-6 ${className}`}>
      {steps.map((step, idx) => (
        <div key={idx} className="relative">
          <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border border-white/20 bg-black flex items-center justify-center">
            <div className={`w-1.5 h-1.5 rounded-full ${step.isCompleted ? 'bg-[#B4F052]' : 'bg-white/40'}`} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white">{step.title}</span>
              {step.badge && <Badge variant="green">{step.badge}</Badge>}
            </div>
            <p className="text-xs text-white/60">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// 6. ComparisonTable
export interface ComparisonColumn {
  key: string;
  label: string;
  isPrimary?: boolean;
}

export interface ComparisonRow {
  label: string;
  values: Record<string, string | boolean | number>;
  highlight?: boolean;
}

export const ComparisonTable: React.FC<{
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  className?: string;
}> = ({ columns, rows, className = '' }) => {
  return (
    <div className={`overflow-x-auto rounded-xl border border-white/[0.08] ${className}`}>
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-white/[0.08] bg-white/[0.02]">
            {columns.map(col => (
              <th key={col.key} className={`p-3 font-semibold ${col.isPrimary ? 'text-[#B4F052]' : 'text-white/60'}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {rows.map((row, idx) => (
            <tr key={idx} className={`hover:bg-white/[0.01] ${row.highlight ? 'bg-[#B4F052]/5' : ''}`}>
              {columns.map(col => {
                const val = col.key === 'label' ? row.label : row.values[col.key];
                return (
                  <td key={col.key} className={`p-3 ${col.key === 'label' ? 'font-semibold text-white/80' : 'text-white/60'}`}>
                    {typeof val === 'boolean' ? (
                      val ? (
                        <Check size={14} className="text-[#B4F052]" />
                      ) : (
                        <span className="text-white/20">-</span>
                      )
                    ) : (
                      val
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 7. Flowchart
export interface FlowchartNode {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  badge?: string;
}

export const Flowchart: React.FC<{
  nodes: FlowchartNode[];
  direction?: 'horizontal' | 'vertical';
  className?: string;
}> = ({ nodes, direction = 'horizontal', className = '' }) => {
  return (
    <div className={`flex ${direction === 'horizontal' ? 'flex-col md:flex-row items-center md:items-stretch justify-between gap-4' : 'flex-col gap-4'} ${className}`}>
      {nodes.map((node, idx) => (
        <React.Fragment key={node.id}>
          <GlassCard className="flex-1 p-4 flex flex-col justify-between min-w-[200px]" hover>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                {node.icon ? <div className="text-[#B4F052]">{node.icon}</div> : <div />}
                {node.badge && <Badge>{node.badge}</Badge>}
              </div>
              <div className="font-semibold text-sm text-white">{node.title}</div>
              <p className="text-xs text-white/60">{node.description}</p>
            </div>
          </GlassCard>
          {idx < nodes.length - 1 && (
            <div className="flex items-center justify-center p-2">
              {direction === 'horizontal' ? (
                <>
                  <ArrowRight size={16} className="hidden md:block text-[#B4F052]/60" />
                  <ArrowDown size={16} className="block md:hidden text-[#B4F052]/60" />
                </>
              ) : (
                <ArrowDown size={16} className="text-[#B4F052]/60" />
              )}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// 8. Funnel
export interface FunnelStage {
  label: string;
  value: string;
  percentage?: number;
  color?: string;
}

export const Funnel: React.FC<{
  stages: FunnelStage[];
  className?: string;
}> = ({ stages, className = '' }) => {
  return (
    <div className={`space-y-2 max-w-md mx-auto ${className}`}>
      {stages.map((stage, idx) => {
        const widthPercent = stage.percentage || (100 - idx * 12);
        return (
          <div
            key={idx}
            className="flex items-center gap-3"
          >
            <div className="w-24 text-right text-xs font-semibold text-white/60">{stage.label}</div>
            <div className="flex-1">
              <div
                style={{ width: `${widthPercent}%` }}
                className="h-9 bg-gradient-to-r from-[#B4F052]/20 to-[#B4F052]/5 border border-[#B4F052]/30 rounded-lg flex items-center justify-between px-4 transition-all hover:border-[#B4F052] duration-300"
              >
                <span className="text-xs font-semibold text-white">{stage.value}</span>
                {stage.percentage !== undefined && (
                  <span className="text-[10px] text-[#B4F052]">{stage.percentage}%</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 9. Pyramid
export interface PyramidLayer {
  level: string;
  title: string;
  description: string;
}

export const Pyramid: React.FC<{
  layers: PyramidLayer[];
  className?: string;
}> = ({ layers, className = '' }) => {
  return (
    <div className={`flex flex-col items-center gap-2 max-w-lg mx-auto ${className}`}>
      {layers.map((layer, idx) => {
        const widthPercent = 40 + (idx * (60 / Math.max(1, layers.length - 1)));
        return (
          <div
            key={idx}
            style={{ width: `${widthPercent}%` }}
            className="p-3 border border-white/[0.08] bg-white/[0.02] rounded-lg text-center transition-all hover:border-[#B4F052]/40 duration-300"
          >
            <div className="text-[9px] uppercase tracking-widest text-[#B4F052] font-bold">{layer.level}</div>
            <div className="text-xs font-semibold text-white">{layer.title}</div>
            <p className="text-[10px] text-white/60 mt-1">{layer.description}</p>
          </div>
        );
      })}
    </div>
  );
};

interface TaskInfographicProps {
  taskNumber: number;
}

export default function TaskInfographic({ taskNumber }: TaskInfographicProps) {
  switch (taskNumber) {
    case 1:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">1. Identify Problems and Trends</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Grid cols={3}>
            <GlassCard hover className="p-4 border-l-2 border-l-[#B4F052]">
              <div className="flex items-center gap-2 mb-2 text-[#B4F052]">
                <HelpCircle size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Need-based</span>
              </div>
              <p className="text-xs text-white/80">Addressing underserved, painful user requirements. (e.g. Zoom zoom-in on remote communication during pandemic)</p>
            </GlassCard>
            <GlassCard hover className="p-4 border-l-2 border-l-[#B4F052]">
              <div className="flex items-center gap-2 mb-2 text-[#B4F052]">
                <TrendingUp size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Trend-based</span>
              </div>
              <p className="text-xs text-white/80">Capitalizing on structural market changes. (e.g. Remote work, Fintech, AI automation)</p>
            </GlassCard>
            <GlassCard hover className="p-4 border-l-2 border-l-[#B4F052]">
              <div className="flex items-center gap-2 mb-2 text-[#B4F052]">
                <Settings size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Technology-based</span>
              </div>
              <p className="text-xs text-white/80">Using technology platforms to create scalable solutions. (e.g. Cloud storage, SaaS architecture)</p>
            </GlassCard>
          </Grid>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2">
            <div className="text-xs font-semibold text-[#B4F052]">Core Objective:</div>
            <p className="text-xs text-white/70">Start with the problem you want to solve, NOT with the idea! Brainstorm 5+ answers to key validation questions.</p>
          </div>
        </div>
      );
    case 2:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">2. Evaluate Problems and Trends</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Problem Evaluation Matrix (10-Point Distribution Rule):</div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Evaluation Metrics' },
              { key: 'unaddressed', label: 'Is Unaddressed?' },
              { key: 'pain', label: 'Pain Intensity' },
              { key: 'size', label: 'Market Size' },
              { key: 'fit', label: 'Founder Fit' }
            ]}
            rows={[
              { label: 'Problem #1 (Top Scored)', values: { unaddressed: 'Yes', pain: 'High (willing to pay)', size: '1M+ users', fit: 'Adjacent experience' }, highlight: true },
              { label: 'Problem #2', values: { unaddressed: 'Yes', pain: 'Medium', size: '500k users', fit: 'Out of box touch' } },
              { label: 'Problem #3', values: { unaddressed: 'No', pain: 'Low', size: '100k users', fit: 'No experience' } }
            ]}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <GlassCard className="p-3 text-center text-xs">
              <div className="font-semibold text-white">1. Industry Expert</div>
              <p className="text-white/60 mt-1">Knows newest trends from inside.</p>
            </GlassCard>
            <GlassCard className="p-3 text-center text-xs">
              <div className="font-semibold text-white">2. Outsider Touch</div>
              <p className="text-white/60 mt-1">Thinks out of the box easily.</p>
            </GlassCard>
            <GlassCard className="p-3 text-center text-xs">
              <div className="font-semibold text-white">3. Direct Face</div>
              <p className="text-white/60 mt-1">Addressing own personal pain.</p>
            </GlassCard>
          </div>
        </div>
      );
    case 3:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">3. Select Problem to Focus on</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Customer Discovery & Stakeholder Research Flow:</div>
          <Flowchart 
            nodes={[
              { id: '1', title: 'Top Ranked Problem', description: 'Select top problem from evaluation matrix.', icon: <Target size={14} /> },
              { id: '2', title: 'Stakeholder Segment', description: 'B2C end consumers vs. B2B domain experts.', icon: <Users size={14} /> },
              { id: '3', title: 'Field Discovery', description: 'Gather qualitative insights (WhatsApp, social channels).', icon: <Search size={14} /> }
            ]}
          />
          <div className="p-4 rounded-xl bg-[#B4F052]/5 border border-[#B4F052]/20 text-xs text-white/80 mt-4">
            <span className="font-bold text-[#B4F052]">Example:</span> Gorillas used a simple WhatsApp group to understand grocery shopping pain points before writing code.
          </div>
        </div>
      );
    case 4:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">4. Pinpoint Pains & Gains and Determine &quot;Jobs to Be Done&quot;</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Grid cols={2} className="mb-4">
            <GlassCard className="p-4 border-l-2 border-l-red-500/50">
              <div className="text-xs font-bold text-red-400 mb-2 uppercase">Customer Pains</div>
              <p className="text-xs text-white/70">Negative emotions, high risks, undesired costs, and workflow obstacles. Rank them by intensity and frequency.</p>
            </GlassCard>
            <GlassCard className="p-4 border-l-2 border-l-green-500/50">
              <div className="text-xs font-bold text-green-400 mb-2 uppercase">Customer Gains</div>
              <p className="text-xs text-white/70">Desired benefits, functional utility, social status, and cost/time savers. Segment by level of value.</p>
            </GlassCard>
          </Grid>
          <div className="text-xs font-semibold text-white/70 mb-2">The 8 Stages of &quot;Jobs-to-be-Done&quot;:</div>
          <Timeline 
            steps={[
              { title: '1. Plan & Define', description: 'Define user goals and schedule resources.' },
              { title: '2. Gather Items', description: 'Ease collection and ensure asset availability.' },
              { title: '3. Setup', description: 'Minimize setup difficulties.' },
              { title: '4. Verify', description: 'Confirm environment is ready to start.' },
              { title: '5. Execute', description: 'Execute core task seamlessly.' },
              { title: '6. Check', description: 'Monitor execution results and metrics.' },
              { title: '7. Improve', description: 'Reduce deviations and make adjustments.' },
              { title: '8. Repeat', description: 'Simplify task iteration and save settings.' }
            ]}
          />
        </div>
      );
    case 5:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">5. Define Overall Vision, Mission, and Core Values</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Grid cols={2}>
            <GlassCard className="p-4 border-l-2 border-l-[#B4F052]">
              <div className="text-xs font-bold text-[#B4F052] uppercase mb-2">Mission Statement</div>
              <p className="text-xs text-white/80">&quot;To organize the world&apos;s information...&quot; (Google). A formal summary of what the company does and why it exists. Grounded in present action.</p>
            </GlassCard>
            <GlassCard className="p-4 border-l-2 border-l-purple-400">
              <div className="text-xs font-bold text-purple-400 uppercase mb-2">Vision Statement</div>
              <p className="text-xs text-white/80">&quot;To be Earth&apos;s most customer-centric company...&quot; (Amazon). An ideal future achievement that gives purpose to current initiatives.</p>
            </GlassCard>
          </Grid>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] mt-4 space-y-3">
            <div className="text-xs font-semibold text-[#B4F052] uppercase tracking-wider">Core Corporate Values:</div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="green">Quality Products</Badge>
              <Badge variant="purple">Positive Social Impact</Badge>
              <Badge variant="gray">Adventure Together</Badge>
            </div>
          </div>
        </div>
      );
    case 6:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">6. Gather All Steps</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">3-Year Milestones Roadmap:</div>
          <Timeline 
            steps={[
              { title: 'Year 1: Foundation', description: 'Focus on validation, building POC/MVP, initial user onboarding.', badge: 'Setup' },
              { title: 'Year 2: Product Expansion', description: 'Fleshing out product ecosystem, scaling features, raising pre-seed/seed.', badge: 'Launch' },
              { title: 'Year 3: Scale & Growth', description: 'Establishing operations, marketing automation, expanding user base.', badge: 'Scale' }
            ]}
          />
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[11px] text-white/60 mt-4">
            <span className="font-semibold text-white">7 Brainstorming Rules:</span> Stay focused, involve everyone, include obvious steps, suspend judgment, invite wild thinking, allow repetitions, cross-fertilize.
          </div>
        </div>
      );
    case 7:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">7. Streamline Steps</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Streamlining Roadmap Tasks:</div>
          <ComparisonTable 
            columns={[
              { key: 'type', label: 'Priority Type' },
              { key: 'example', label: 'Action Example' },
              { key: 'rationale', label: 'Decision Logic' }
            ]}
            rows={[
              { label: 'Must-Haves', values: { type: 'Core MVP Development', example: 'Build transactional workflow', rationale: 'Necessary for launch and validation' }, highlight: true },
              { label: 'Nice-to-Haves', values: { type: 'Extended Research', example: 'Analyze etymology of name', rationale: 'Delete or postpone to after-launch' } },
              { label: 'Dependencies', values: { type: 'Legal Incorporation', example: 'Establish bank accounts first', rationale: 'Long lead time, higher sequence priority' } }
            ]}
          />
        </div>
      );
    case 8:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">8. Master Founder Fundamentals</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Mindset Checklist (Endurance and Performance):</div>
          <Grid cols={3} className="mb-4">
            <GlassCard className="p-3 text-center text-xs">
              <span className="text-lg">😴</span>
              <div className="font-bold text-white mt-1">1. Value Sleep</div>
              <p className="text-white/60 mt-1">Foundation of high performance.</p>
            </GlassCard>
            <GlassCard className="p-3 text-center text-xs">
              <span className="text-lg">🧘‍♂️</span>
              <div className="font-bold text-white mt-1">2. Meditation</div>
              <p className="text-white/60 mt-1">Keep a clear business focus.</p>
            </GlassCard>
            <GlassCard className="p-3 text-center text-xs">
              <span className="text-lg">❤️</span>
              <div className="font-bold text-white mt-1">3. Relationships</div>
              <p className="text-white/60 mt-1">Watch Waldinger Ted Talk.</p>
            </GlassCard>
          </Grid>
          <div className="text-xs font-semibold text-white/70 mb-2">5 Layers to Work On (Consulting.com):</div>
          <Flowchart 
            nodes={[
              { id: '1', title: '1. Mental Awareness', description: 'Identity and belief systems.' },
              { id: '2', title: '2. Mental Cognition', description: 'Problem solving and prioritization.' },
              { id: '3', title: '3. Business Principles', description: 'Rules representing values.' },
              { id: '4', title: '4. Business Disciplines', description: 'Core functional branches.' }
            ]}
            direction="vertical"
          />
        </div>
      );
    case 9:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">9. Round Out Founding Team</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Founding Team Fit:</div>
            <Grid cols={2}>
              <GlassCard className="p-4 border-l-2 border-l-[#B4F052]">
                <div className="text-xs font-bold text-[#B4F052] uppercase mb-2">Hacker (Technical)</div>
                <p className="text-xs text-white/80">Builds the MVP, controls tech stack, processes and product systems. Focus on scalability and security.</p>
              </GlassCard>
              <GlassCard className="p-4 border-l-2 border-l-purple-400">
                <div className="text-xs font-bold text-purple-400 uppercase mb-2">Hustler (Business)</div>
                <p className="text-xs text-white/80">Drives sales, customer acquisition, investor pitches, and marketing campaign coordination.</p>
              </GlassCard>
            </Grid>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white/75 mt-3">
              <span className="font-semibold text-white">Ideal Team Profile:</span> 2-4 members, complementary skill sets, even equity splits, strong cultural fit.
            </div>
        </div>
      );
    case 10:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">10. Secure Mentorship</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-[#B4F052] mb-3 font-bold uppercase">Mentor Recruitment Pipeline:</div>
          <Flowchart 
            nodes={[
              { id: '1', title: 'Map Target Profile', description: 'Angel investor, founder experience, aligned values.', icon: <Search size={14} /> },
              { id: '2', title: 'Network Outreach', description: 'Tap private/professional circles, start-up events.', icon: <Mail size={14} /> },
              { id: '3', title: 'Equity Compensation', description: 'Offer advisory equity instead of cash.', icon: <DollarSign size={14} /> }
            ]}
          />
        </div>
      );
    case 11:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">11. Decide on One of &quot;Three Horizons&quot;</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Three Horizons of Growth:</div>
          <Timeline 
            steps={[
              { title: 'Horizon 1: Core Business', description: 'Extend and defend core operations to secure short-term profitability.', badge: 'Present' },
              { title: 'Horizon 2: Emerging Opportunities', description: 'Nurture rising ventures to capture medium-term business lines.', badge: 'Next' },
              { title: 'Horizon 3: Viable Options', description: 'Invest in disruptive future ecosystems and technology shifts.', badge: 'Future' }
            ]}
          />
        </div>
      );
    case 12:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">12. Transfer Proven Business Models to Ecosystems of Future Growth</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Business Model Ecosystem Transfer Loop:</div>
          <Flowchart 
            nodes={[
              { id: '1', title: 'Identify Proven Model', description: 'Take successful models from legacy industries (e.g. SaaS, sharing economy).' },
              { id: '2', title: 'Map to Future Trend', description: 'Cross-reference with emerging tech (AI, speech recognition, web3).' },
              { id: '3', title: 'Validate ecosystem', description: 'Modify values and rules for next-gen market requirements.' }
            ]}
          />
        </div>
      );
    case 13:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">13. Generate &quot;Long List&quot; of Ideas</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Timeline 
            steps={[
              { title: 'Step 1: Trend Extraction', description: 'Identify growth sectors using market data.' },
              { title: 'Step 2: Pain Point Intersection', description: 'Map trends against documented customer problems.' },
              { title: 'Step 3: Quantity-First Brainstorm', description: 'Generate a long list of potential ideas without filtering.' }
            ]}
          />
        </div>
      );
    case 14:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">14. Distil into &quot;Short List&quot;</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Idea Scoring Table (TAM, SAM, SOM analysis):</div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Business Idea' },
              { key: 'tam', label: 'TAM' },
              { key: 'sam', label: 'SAM' },
              { key: 'fit', label: 'Founder-Market Fit' }
            ]}
            rows={[
              { label: 'Idea A (Target)', values: { idea: 'Idea A', tam: '$10B+', sam: '$500M', fit: 'Excellent (7+ yrs exp)' }, highlight: true },
              { label: 'Idea B', values: { idea: 'Idea B', tam: '$2B', sam: '$100M', fit: 'Good' } },
              { label: 'Idea C', values: { idea: 'Idea C', tam: '$500M', sam: '$50M', fit: 'Poor' } }
            ]}
          />
        </div>
      );
    case 15:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">15. Compare How to Innovate (&quot;10 Types of Innovation&quot;) for &quot;Short List&quot;</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Doblin&apos;s 10 Types of Innovation:</div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Category' },
              { key: 'types', label: 'Innovation Types' },
              { key: 'description', label: 'Focus' }
            ]}
            rows={[
              { label: 'Configuration', values: { category: 'Configuration', types: 'Profit Model, Network, Structure, Process', description: 'Back-end operational structure and business networks.' } },
              { label: 'Offering', values: { category: 'Offering', types: 'Product Performance, Product System', description: 'Core features and product ecosystem.' }, highlight: true },
              { label: 'Experience', values: { category: 'Experience', types: 'Service, Channel, Brand, Customer Engagement', description: 'Direct customer-facing touchpoints and perceptions.' } }
            ]}
          />
        </div>
      );
    case 16:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">16. Blue Ocean</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Grid cols={2}>
            <GlassCard className="p-4 border-l-2 border-l-red-500/50">
              <div className="text-xs font-bold text-red-400 mb-2 uppercase">Red Oceans (Overcrowded)</div>
              <ul className="text-xs text-white/70 space-y-1">
                <li>• Compete in existing market space</li>
                <li>• Beat the competition directly</li>
                <li>• Capture existing demand</li>
                <li>• Choose between low cost OR differentiation</li>
              </ul>
            </GlassCard>
            <GlassCard className="p-4 border-l-2 border-l-[#B4F052]">
              <div className="text-xs font-bold text-[#B4F052] mb-2 uppercase">Blue Oceans (Uncontested)</div>
              <ul className="text-xs text-white/80 space-y-1">
                <li>• Create uncontested market space</li>
                <li>• Make the competition irrelevant</li>
                <li>• Create and capture new demand</li>
                <li>• Pursue low cost AND differentiation</li>
              </ul>
            </GlassCard>
          </Grid>
        </div>
      );
    case 17:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">17. Compare Using &quot;Business Model Canvas&quot; for &quot;Short List&quot;</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs font-semibold text-white/80 mb-3 uppercase tracking-wider">Business Model Canvas Overview:</div>
          <Grid cols={3} className="gap-2 text-xs">
            <GlassCard className="p-3">
              <div className="text-[#B4F052] font-semibold mb-1">Key Partners</div>
              <p className="text-white/60">Key suppliers, alliances.</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="text-[#B4F052] font-semibold mb-1">Key Activities</div>
              <p className="text-white/60">Core actions to deliver value.</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="text-[#B4F052] font-semibold mb-1">Value Proposition</div>
              <p className="text-white/60">What distinguishes your offering.</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="text-purple-400 font-semibold mb-1">Customer Segments</div>
              <p className="text-white/60">Targeted customer groups.</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="text-purple-400 font-semibold mb-1">Channels</div>
              <p className="text-white/60">Direct/indirect distribution.</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="text-purple-400 font-semibold mb-1">Revenue Streams</div>
              <p className="text-white/60">Sales, subscriptions.</p>
            </GlassCard>
          </Grid>
        </div>
      );
    case 18:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">18. Compare Using &quot;Customer Discovery&quot;</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Hypothesis Testing Matrix:</div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Step' },
              { key: 'action', label: 'Core Action' },
              { key: 'goal', label: 'Validation Goal' }
            ]}
            rows={[
              { label: '1', values: { step: '1. State Hypotheses', action: 'Define core assumptions', goal: 'Establish test baselines' } },
              { label: '2', values: { step: '2. Problem Hypothesis', action: 'Conduct discovery interviews', goal: 'Verify pain urgency' }, highlight: true },
              { label: '3', values: { step: '3. Product Concept', action: 'Present mockups/POCs', goal: 'Confirm utility value' } },
              { label: '4', values: { step: '4. Business Model Pivot', action: 'Synthesize findings', goal: 'Determine scale path' } }
            ]}
          />
        </div>
      );
    case 19:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">19. Rank Business Models on &quot;Short List&quot;</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
            nodes={[
              { id: '1', title: 'Gather Long List', description: 'Consolidate generated options.' },
              { id: '2', title: 'Apply TAM/SAM Filtering', description: 'Rule out low potential options.' },
              { id: '3', title: 'Rank by Founder Fit', description: 'Score on team alignment and expertise.' }
            ]}
          />
        </div>
      );
    case 20:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">20. Build and Adapt Proof of Concept of #1 Business Model</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
            nodes={[
              { id: '1', title: 'Paper Prototype', description: 'Define flows and key fields.' },
              { id: '2', title: 'Interactive Wireframe', description: 'Mock UI elements and feedback hooks.' },
              { id: '3', title: 'User Walkthrough', description: 'Record real user interactions and adapt.' }
            ]}
          />
        </div>
      );
    case 21:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">21. Define Your USPs</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">USP Positioning Table:</div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Dimension' },
              { key: 'competitors', label: 'Competitors Offer' },
              { key: 'us', label: 'Our USP Solution' }
            ]}
            rows={[
              { label: 'Value Prop', values: { dimension: 'Core Value', competitors: 'Standard features, high cost', us: 'Automated workflow, 10x faster' }, highlight: true },
              { label: 'Pricing', values: { dimension: 'Cost structure', competitors: 'Enterprise subscription', us: 'Pay per use model' } },
              { label: 'Delivery', values: { dimension: 'Onboarding time', competitors: '2-4 weeks installation', us: 'Instant self-setup' } }
            ]}
          />
        </div>
      );
    case 22:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">22. Assemble Focus Group and Follow &quot;Lean Start-up&quot; Loop</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Lean Startup Loop Phases:</div>
          <Grid cols={3}>
            <GlassCard className="p-4 text-center border-t-2 border-t-[#B4F052]">
              <span className="text-lg">🛠️</span>
              <div className="font-bold text-white mt-1">BUILD</div>
              <p className="text-white/60 mt-1 text-xs">Transform ideas into MVP code quickly.</p>
            </GlassCard>
            <GlassCard className="p-4 text-center border-t-2 border-t-purple-400">
              <span className="text-lg">📊</span>
              <div className="font-bold text-purple-400 mt-1">MEASURE</div>
              <p className="text-white/60 mt-1 text-xs">Gather quantitative usage metrics.</p>
            </GlassCard>
            <GlassCard className="p-4 text-center border-t-2 border-t-blue-400">
              <span className="text-lg">🧠</span>
              <div className="font-bold text-blue-400 mt-1">LEARN</div>
              <p className="text-white/60 mt-1 text-xs">Synthesize user feedback and pivot.</p>
            </GlassCard>
          </Grid>
        </div>
      );
    case 23:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">23. ESGs</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Grid cols={3}>
            <GlassCard className="p-3 text-center border-l-2 border-l-green-500">
              <div className="font-semibold text-green-400 text-xs uppercase">Environmental</div>
              <p className="text-white/60 text-[11px] mt-1">Resource consumption, carbon footprint, sustainability.</p>
            </GlassCard>
            <GlassCard className="p-3 text-center border-l-2 border-l-blue-500">
              <div className="font-semibold text-blue-400 text-xs uppercase">Social Impact</div>
              <p className="text-white/60 text-[11px] mt-1">Employee wellness, diversity, community support.</p>
            </GlassCard>
            <GlassCard className="p-3 text-center border-l-2 border-l-purple-500">
              <div className="font-semibold text-purple-400 text-xs uppercase">Governance</div>
              <p className="text-white/60 text-[11px] mt-1">Ethical conduct, regulatory compliance, audits.</p>
            </GlassCard>
          </Grid>
        </div>
      );
    case 24:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">24. Build Financial Model</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Grid cols={3}>
            <GlassCard className="p-3 text-center">
              <div className="text-[10px] text-white/50 uppercase font-semibold">Top Line Metrics</div>
              <div className="text-xl font-bold text-[#B4F052] mt-1">ARR / MRR</div>
              <p className="text-[10px] text-white/60 mt-1">Recurring subscription revenue drivers.</p>
            </GlassCard>
            <GlassCard className="p-3 text-center">
              <div className="text-[10px] text-white/50 uppercase font-semibold">Efficiency Metrics</div>
              <div className="text-xl font-bold text-purple-400 mt-1">LTV / CAC</div>
              <p className="text-[10px] text-white/60 mt-1">Customer lifetime value vs cost of acquisition.</p>
            </GlassCard>
            <GlassCard className="p-3 text-center">
              <div className="text-[10px] text-white/50 uppercase font-semibold">Health Metrics</div>
              <div className="text-xl font-bold text-blue-400 mt-1">Burn Rate</div>
              <p className="text-[10px] text-white/60 mt-1">Monthly cash consumption & runway weeks.</p>
            </GlassCard>
          </Grid>
        </div>
      );
    case 25:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">25. Create Pitch Deck</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Pitch Deck Slides Checklist:</div>
          <Grid cols={4}>
            <GlassCard className="p-3">
              <div className="font-semibold text-[#B4F052] text-xs">1. Problem</div>
              <p className="text-[10px] text-white/60 mt-1">Define target market pain points.</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="font-semibold text-[#B4F052] text-xs">2. Solution</div>
              <p className="text-[10px] text-white/60 mt-1">Present your product concept.</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="font-semibold text-purple-400 text-xs">3. Business Model</div>
              <p className="text-[10px] text-white/60 mt-1">Explain revenue and pricing.</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="font-semibold text-purple-400 text-xs">4. Team</div>
              <p className="text-[10px] text-white/60 mt-1">Highlight key execution roles.</p>
            </GlassCard>
          </Grid>
        </div>
      );
    case 26:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">26. Specify MVP</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Timeline 
            steps={[
              { title: 'Define Core Value Hypothesis', description: 'What single function must solve the main pain?' },
              { title: 'Determine MVP Features', description: 'Filter features into must-haves, nice-to-haves (discard).' },
              { title: 'Define Success Metrics', description: 'Establish clear target parameters for MVP test.' }
            ]}
          />
        </div>
      );
    case 27:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">27. Determine Tool Stack</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Pyramid 
            layers={[
              { level: 'Tier 1: Frontend', title: 'React, Next.js, TailwindCSS', description: 'Visually responsive user experience.' },
              { level: 'Tier 2: Backend & Logic', title: 'Node.js, Serverless Functions', description: 'Handles data flow and transactional processes.' },
              { level: 'Tier 3: Database & Auth', title: 'PostgreSQL, Supabase', description: 'Secure user authentication and structured storage.' }
            ]}
          />
        </div>
      );
    case 28:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">28. Set Up Lean PMO</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Timeline 
            steps={[
              { title: '1. Establish Board Layout', description: 'Configure Backlog, To Do, In Progress, Review, and Done columns.' },
              { title: '2. Set Up Agile Routines', description: 'Kick off weekly sprint planning & 10-minute daily standups.' },
              { title: '3. Track Velocity', description: 'Monitor story points completed per sprint to adjust deadlines.' }
            ]}
          />
        </div>
      );
    case 29:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">29. Perform Legal Check of Business Model & Key Documents</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Legal Area' },
              { key: 'checklist', label: 'Key Document/Action' },
              { key: 'risk', label: 'Risk Rating' }
            ]}
            rows={[
              { label: 'IP Ownership', values: { area: 'Intellectual Property', checklist: 'Assign IP to entity prior to build', risk: 'High' }, highlight: true },
              { label: 'Employment', values: { area: 'Founder Agreements', checklist: 'Define vesting schedules and cliffs', risk: 'High' } },
              { label: 'Regulatory', values: { area: 'Data Privacy (GDPR/CCPA)', checklist: 'Create Terms and Privacy policy', risk: 'Medium' } }
            ]}
          />
        </div>
      );
    case 30:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">30. Calculate Costs for MVP Development</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Cost Category' },
              { key: 'software', label: 'Services' },
              { key: 'budget', label: 'Est. Monthly Cost' }
            ]}
            rows={[
              { label: 'Development Infrastructure', values: { category: 'Hosting & Serverless', software: 'Vercel, Supabase, Cloudflare', budget: '$50 - $100' } },
              { label: 'Development Tooling', values: { category: 'APIs & AI', software: 'OpenAI, Stripe, Resend', budget: '$100 - $200' }, highlight: true },
              { label: 'Developer Resources', values: { category: 'Hired Help / Co-founders', software: 'Freelancers/Internal team', budget: 'Sweat equity' } }
            ]}
          />
        </div>
      );
    case 31:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">31. Develop MVP</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Development Phase' },
              { key: 'focus', label: 'Sprint Focus' },
              { key: 'deliverable', label: 'Output' }
            ]}
            rows={[
              { label: 'Sprint 1', values: { stage: 'Auth & Data Schema', focus: 'Database structure & user signup', deliverable: 'Working login portal' } },
              { label: 'Sprint 2', values: { stage: 'Core Workflow', focus: 'Main action screen & database read/write', deliverable: 'Fully functional dashboard' }, highlight: true },
              { label: 'Sprint 3', values: { stage: 'Integration', focus: 'Stripe payments & automated emails', deliverable: 'Live transactional flow' } }
            ]}
          />
        </div>
      );
    case 32:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">32. Define Your Brand</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Grid cols={3}>
            <GlassCard className="p-3 text-center border-b-2 border-b-[#B4F052]">
              <span className="text-lg">🎨</span>
              <div className="font-semibold text-white mt-1">Color Palette</div>
              <p className="text-white/60 text-[10px] mt-1">Signature green, dark tones, white accents.</p>
            </GlassCard>
            <GlassCard className="p-3 text-center border-b-2 border-b-[#B4F052]">
              <span className="text-lg">🗣️</span>
              <div className="font-semibold text-white mt-1">Tone & Voice</div>
              <p className="text-white/60 text-[10px] mt-1">Professional, ambitious, clear, direct.</p>
            </GlassCard>
            <GlassCard className="p-3 text-center border-b-2 border-b-[#B4F052]">
              <span className="text-lg">📄</span>
              <div className="font-semibold text-white mt-1">Brand Assets</div>
              <p className="text-white/60 text-[10px] mt-1">Logo variations, fonts, typography.</p>
            </GlassCard>
          </Grid>
        </div>
      );
    case 33:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">33. Establish an Online Footprint</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Grid cols={3}>
            <GlassCard className="p-3">
              <div className="text-xs text-[#B4F052] font-semibold mb-1">Web Domain</div>
              <p className="text-[11px] text-white/70">Secure .com or .ai domain registration. Check handles.</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="text-xs text-[#B4F052] font-semibold mb-1">Social Accounts</div>
              <p className="text-[11px] text-white/77">Create LinkedIn, Twitter, GitHub profiles for corporate brand.</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="text-xs text-[#B4F052] font-semibold mb-1">Landing Page</div>
              <p className="text-[11px] text-white/70">Deploy basic waitlist page to gather email signups.</p>
            </GlassCard>
          </Grid>
        </div>
      );
    case 34:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">34. Create Design & Wireframes</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
            nodes={[
              { id: '1', title: '1. User Flow Map', description: 'Determine core user screen transitions.', icon: <Compass size={14} /> },
              { id: '2', title: '2. Low-fi Sketch', description: 'Draw UI structures on paper or Balsamiq.', icon: <PenTool size={14} /> },
              { id: '3', title: '3. Hi-fi Interactive', description: 'Build mockups in Figma with active components.', icon: <Eye size={14} /> }
            ]}
          />
        </div>
      );
    case 35:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">35. Finish Logo and Creatives</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Design Asset' },
              { key: 'specs', label: 'Specifications' },
              { key: 'formats', label: 'Required Formats' }
            ]}
            rows={[
              { label: 'Primary Logo', values: { asset: 'Primary Logo', specs: 'Vector version, optimized dark theme', formats: 'SVG, transparent PNG' }, highlight: true },
              { label: 'Favicon', values: { asset: 'Favicon', specs: '16x16, 32x32 pixel sizes', formats: 'ICO, PNG' } },
              { label: 'Social Banner', values: { asset: 'LinkedIn/Twitter Banner', specs: '1500x500 standard dimensions', formats: 'JPEG, PNG' } }
            ]}
          />
        </div>
      );
    case 36:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">36. Consider Various Funding Options</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Funding Source' },
              { key: 'equity', label: 'Equity Cost' },
              { key: 'control', label: 'Control Impact' },
              { key: 'time', label: 'Time-to-Cash' }
            ]}
            rows={[
              { label: 'Bootstrapping', values: { source: 'Bootstrapping', equity: '0%', control: 'Full Control', time: 'Instant' } },
              { label: 'Angel Investors', values: { source: 'Angel Investors', equity: '10% - 20%', control: 'Minor advisory role', time: '1 - 3 months' }, highlight: true },
              { label: 'VC Funding', values: { source: 'Venture Capital', equity: '20% - 30%', control: 'Board seat requirements', time: '3 - 6 months' } },
              { label: 'Govt Grants', values: { source: 'Government Grants', equity: '0%', control: 'Reporting constraints', time: '4 - 9 months' } }
            ]}
          />
        </div>
      );
    case 37:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">37. Calculate Required Funding Amount and Valuation</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Use of Funds' },
              { key: 'allocation', label: 'Allocation' },
              { key: 'runway', label: 'Est. Runway' }
            ]}
            rows={[
              { label: 'Core Dev & Stack', values: { use: 'Product Development', allocation: '50% of round', runway: '12 - 18 months' }, highlight: true },
              { label: 'Marketing & CAC', values: { use: 'Customer Acquisition', allocation: '30% of round', runway: '12 - 18 months' } },
              { label: 'G&A, Legal', values: { use: 'Operations & legal compliance', allocation: '20% of round', runway: '12 - 18 months' } }
            ]}
          />
        </div>
      );
    case 38:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">38. Determine Non-financial Investor Requirements</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Requirements' },
              { key: 'desc', label: 'Value Addition' },
              { key: 'impact', label: 'Significance' }
            ]}
            rows={[
              { label: 'Strategic Network', values: { type: 'Access to target customers', desc: 'Introduces company to enterprise buyers', impact: 'Very High' }, highlight: true },
              { label: 'Recruiting Aid', values: { type: 'Executive hiring pipeline', desc: 'Helps source experienced managers', impact: 'High' } },
              { label: 'Domain Expertise', values: { type: 'Industry knowledge', desc: 'Saves founder from rookie errors', impact: 'Medium' } }
            ]}
          />
        </div>
      );
    case 39:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">39. Identify Relevant Investor Types</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Grid cols={3}>
            <GlassCard className="p-3">
              <div className="font-semibold text-xs text-[#B4F052]">Business Angels</div>
              <p className="text-[10px] text-white/70 mt-1">High-net-worth individuals, fast decisions, small checks ($25k-$200k).</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="font-semibold text-xs text-[#B4F052]">Pre-Seed VCs</div>
              <p className="text-[10px] text-white/70 mt-1">Institutional funds, slower diligence, larger checks ($500k-$2M).</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="font-semibold text-xs text-[#B4F052]">Accelerators</div>
              <p className="text-[10px] text-white/70 mt-1">Cohort-based mentorship, small standard equity checks ($100k-$150k).</p>
            </GlassCard>
          </Grid>
        </div>
      );
    case 40:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">40. Prepare and Pitch to Potential Investors</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
            nodes={[
              { id: '1', title: 'Warm Intro Hunt', description: 'Leverage current advisors & LinkedIn networks.', icon: <Search size={14} /> },
              { id: '2', title: '1st Intro Call', description: 'Pitch slide deck & demonstrate POC/MVP metrics.', icon: <Mail size={14} /> },
              { id: '3', title: 'Data Room Audits', description: 'Share financials, cap table, and legal docs.', icon: <Shield size={14} /> }
            ]}
          />
        </div>
      );
    case 41:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">41. Evaluate Potentially Interested Investors</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Investor Group' },
              { key: 'fit', label: 'Value Fit' },
              { key: 'reputation', label: 'Reference check' }
            ]}
            rows={[
              { label: 'Angel Group A', values: { investor: 'Angel A', fit: 'High (domain expert)', reputation: 'Excellent' }, highlight: true },
              { label: 'Micro VC B', values: { investor: 'Micro VC B', fit: 'Medium', reputation: 'Good' } },
              { label: 'Seed Fund C', values: { investor: 'Seed Fund C', fit: 'Low (dumb money)', reputation: 'Mixed' } }
            ]}
          />
        </div>
      );
    case 42:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">42. Secure (Pre-)Seed Investment</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
            nodes={[
              { id: '1', title: 'Term Sheet Sign', description: 'Validate valuation, vesting, and liquidation preferences.' },
              { id: '2', title: 'Due Diligence', description: 'Verify background, cap table, and contracts.' },
              { id: '3', title: 'Close Round', description: 'Execute final docs and wire funds.' }
            ]}
          />
        </div>
      );
    case 43:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">43. Define Target Organizational Chart</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Role Title' },
              { key: 'reporting', label: 'Reports To' },
              { key: 'responsibilities', label: 'Primary KPI Focus' }
            ]}
            rows={[
              { label: 'CEO (Hustler)', values: { role: 'Chief Executive Officer', reporting: 'Board / Co-founders', responsibilities: 'Fundraising, overall vision, sales pipeline' }, highlight: true },
              { label: 'CTO (Hacker)', values: { role: 'Chief Technology Officer', reporting: 'CEO', responsibilities: 'MVP deployment, system architecture, database security' } },
              { label: 'VP Operations', values: { role: 'Operations Lead', reporting: 'CEO', responsibilities: 'Accounting workflows, legal filings, facility setups' } }
            ]}
          />
        </div>
      );
    case 44:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">44. Gather Requirements for Each Function</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Grid cols={3}>
            <GlassCard className="p-3">
              <div className="font-semibold text-xs text-[#B4F052] uppercase">Product & Engineering</div>
              <p className="text-[10px] text-white/60 mt-1">SaaS product specifications, QA test automation suite.</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="font-semibold text-xs text-[#B4F052] uppercase">Sales & Marketing</div>
              <p className="text-[10px] text-white/60 mt-1">Lead generation templates, CRM databases, paid campaign tools.</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="font-semibold text-xs text-[#B4F052] uppercase">Finance & Admin</div>
              <p className="text-[10px] text-white/60 mt-1">Bank credentials, invoice pipelines, accounting systems.</p>
            </GlassCard>
          </Grid>
        </div>
      );
    case 45:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">45. Design Operating Model</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Operating Unit' },
              { key: 'inputs', label: 'Input Channels' },
              { key: 'outputs', label: 'Delivery Outputs' }
            ]}
            rows={[
              { label: 'Product Dev', values: { unit: 'Product Dev', inputs: 'User usability feedback, metrics analysis', outputs: 'Weekly code deploys, UI bug fixes' }, highlight: true },
              { label: 'Customer Support', values: { unit: 'Customer Support', inputs: 'Support email inbox, chatbot alerts', outputs: 'SLA resolution under 2 hours' } },
              { label: 'Sales Pipeline', values: { unit: 'Sales Pipeline', inputs: 'Landing waitlist page email leads', outputs: 'Automated CRM follow-up emails' } }
            ]}
          />
        </div>
      );
    case 46:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">46. Incorporate Legal Entity</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Grid cols={2}>
            <GlassCard className="p-4 border-l-2 border-l-[#B4F052]">
              <div className="text-xs font-semibold text-[#B4F052] mb-1">Corporate Charter</div>
              <p className="text-xs text-white/80">Draft Articles of Incorporation, define initial share count and board members.</p>
            </GlassCard>
            <GlassCard className="p-4 border-l-2 border-l-[#B4F052]">
              <div className="text-xs font-semibold text-[#B4F052] mb-1">Bylaws & Vesting</div>
              <p className="text-xs text-white/80">Adopt bylaws, sign stock purchase agreements with vesting restrictions (standard 4-year / 1-year cliff).</p>
            </GlassCard>
          </Grid>
        </div>
      );
    case 47:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">47. Set Up Bank Accounts</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Grid cols={2}>
            <GlassCard className="p-4 border-l-2 border-l-purple-400">
              <div className="text-xs font-semibold text-purple-400 mb-1">Corporate Bank Account</div>
              <p className="text-xs text-white/80">Submit tax ID (EIN), articles of incorporation to opening institution (e.g. SVB, Mercury).</p>
            </GlassCard>
            <GlassCard className="p-4 border-l-2 border-l-purple-400">
              <div className="text-xs font-semibold text-purple-400 mb-1">Credit & Expense Setup</div>
              <p className="text-xs text-white/80">Configure corporate credit card platform (Brex, Ramp) with spending limits per department.</p>
            </GlassCard>
          </Grid>
        </div>
      );
    case 48:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">48. Set Up Accounting</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
            nodes={[
              { id: '1', title: '1. Select Software', description: 'Deploy cloud accounting platform (e.g. QuickBooks Online).', icon: <DollarSign size={14} /> },
              { id: '2', title: '2. Link Accounts', description: 'Connect bank feeds and Stripe processor payouts.', icon: <Check size={14} /> },
              { id: '3', title: '3. Chart of Accounts', description: 'Define categories for revenues, software, payroll, and CAC.', icon: <Layers size={14} /> }
            ]}
          />
        </div>
      );
    case 49:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">49. Define Central and Local Logistics Value Streams</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
            nodes={[
              { id: '1', title: 'Supplier to Central', description: 'Bulk shipment processing from factory to main warehouse.' },
              { id: '2', title: 'Sort & Inventory', description: 'Validate SKU quantity, inspect items, store in inventory.' },
              { id: '3', title: 'Last Mile Dispatch', description: 'Trigger courier shipping (FedEx/DHL) to final user destination.' }
            ]}
          />
        </div>
      );
    case 50:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">50. Select Payment Service Provider</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Payment Service Provider (PSP) Evaluation Pipeline:</div>
          <Funnel 
            stages={[
              { label: 'Longlist', value: '10 Providers evaluated (Stripe, Adyen, Braintree, PayPal)', percentage: 100 },
              { label: 'Shortlist', value: '3 Providers matching checkout APIs & low fraud rates', percentage: 70 },
              { label: 'Final Selected', value: 'Stripe (Easiest API integration)', percentage: 30 }
            ]}
          />
        </div>
      );
    case 51:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">51. Register Trademark</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Grid cols={3}>
            <GlassCard className="p-3">
              <div className="font-semibold text-[#B4F052] text-xs">1. Conflict Search</div>
              <p className="text-[10px] text-white/60 mt-1">Search USPTO databases for matching business marks.</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="font-semibold text-[#B4F052] text-xs">2. Classification</div>
              <p className="text-[10px] text-white/60 mt-1">Determine international class codes (e.g., Class 42 for SaaS).</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="font-semibold text-[#B4F052] text-xs">3. Application</div>
              <p className="text-[10px] text-white/60 mt-1">File application with specimen of logo in use.</p>
            </GlassCard>
          </Grid>
        </div>
      );
    case 52:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">52. Perform Capacity-Planning for Facility</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
            nodes={[
              { id: '1', title: 'Forecast Demand', description: 'Estimate transactions and unit sales per month.' },
              { id: '2', title: 'Compute Space Ratio', description: 'Calculate required square footage for storage & packaging.' },
              { id: '3', title: 'Reserve Overhead', description: 'Add 30% margin buffer to prevent shipping lockouts.' }
            ]}
          />
        </div>
      );
    case 53:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">53. Set Up Content Production</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
            nodes={[
              { id: '1', title: 'Topic Ideation', description: 'Keyword research matching customer problems.' },
              { id: '2', title: 'Copywriting & Draft', description: 'Write script drafts, blog text, social media snippets.' },
              { id: '3', title: 'Quality Assurance', description: 'Review formatting, links, and SEO metadata.' },
              { id: '4', title: 'Publish & Index', description: 'Upload to CMS (WordPress/Webflow) and request index.' }
            ]}
          />
        </div>
      );
    case 54:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">54. Build Supply Chain</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Supplier Vendor' },
              { key: 'leadtime', label: 'Manufacturing Lead Time' },
              { key: 'cost', label: 'Unit Cost (Est)' },
              { key: 'quality', label: 'Defect Rate' }
            ]}
            rows={[
              { label: 'Supplier A (Core)', values: { vendor: 'Supplier A', leadtime: '14 Days', cost: '$4.50', quality: '0.1%' }, highlight: true },
              { label: 'Supplier B (Backup)', values: { vendor: 'Supplier B', leadtime: '30 Days', cost: '$3.80', quality: '1.2%' } }
            ]}
          />
        </div>
      );
    case 55:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">55. Organize Distribution</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Distribution Channel' },
              { key: 'margin', label: 'Gross Margin' },
              { key: 'complexity', label: 'Setup Overhead' }
            ]}
            rows={[
              { label: 'Direct SaaS Portal', values: { channel: 'Direct online portal', margin: '90%', complexity: 'Low' }, highlight: true },
              { label: 'B2B Enterprise Sales', values: { channel: 'Sales representative hires', margin: '75%', complexity: 'High' } },
              { label: 'Partner Channels', values: { channel: 'Third-party resellers', margin: '60%', complexity: 'Medium' } }
            ]}
          />
        </div>
      );
    case 56:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">56. Institute Sales Funnel</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">AARRR Sales Funnel Framework:</div>
          <Funnel 
            stages={[
              { label: 'Acquisition', value: 'Traffic landing on waitlist page', percentage: 100 },
              { label: 'Activation', value: 'Sign up for free tier / download POC', percentage: 40 },
              { label: 'Retention', value: 'Daily active logins within 30 days', percentage: 25 },
              { label: 'Referral', value: 'User invite links shared with peers', percentage: 10 },
              { label: 'Revenue', value: 'Convert to subscription payment tier', percentage: 5 }
            ]}
          />
        </div>
      );
    case 57:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">57. Prepare Cross-Channel Marketing & Sales Strategy</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Marketing Channel' },
              { key: 'target', label: 'Audience Focus' },
              { key: 'cac', label: 'Est. Initial CAC' }
            ]}
            rows={[
              { label: 'LinkedIn Ads', values: { channel: 'LinkedIn Ads', target: 'B2B decision makers, managers', cac: 'High ($200+)' } },
              { label: 'Search Ads (Google)', values: { channel: 'Google Search Ads', target: 'Active solution searchers', cac: 'Medium ($50)' }, highlight: true },
              { label: 'Content SEO', values: { channel: 'Blogging & tutorials', target: 'Developers, researchers', cac: 'Low ($10)' } }
            ]}
          />
        </div>
      );
    case 58:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">58. Ramp Up Facility</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Operational Phase' },
              { key: 'kpi', label: 'Target Output Rate' },
              { key: 'quality', label: 'Target Defect Rate' }
            ]}
            rows={[
              { label: 'Phase 1: Soft Launch', values: { milestone: '100 units/day processing', kpi: '100 units', quality: '< 2.0%' } },
              { label: 'Phase 2: Scale', values: { milestone: '1000 units/day processing', kpi: '1000 units', quality: '< 0.5%' }, highlight: true }
            ]}
          />
        </div>
      );
    case 59:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">59. Set Up Customer Care</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
            nodes={[
              { id: '1', title: 'Tier 1 Support', description: 'Automated chatbots, FAQ docs, setup guides.', icon: <Activity size={14} /> },
              { id: '2', title: 'Tier 2 Support', description: 'Customer support reps, email ticket workflows.', icon: <Mail size={14} /> },
              { id: '3', title: 'Tier 3 Support', description: 'Product managers, developers for code bugs.', icon: <Settings size={14} /> }
            ]}
          />
        </div>
      );
    case 60:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">60. Prepare Tech Infrastructure and Security</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Security Domain' },
              { key: 'action', label: 'Hardening Step' },
              { key: 'compliance', label: 'Standard' }
            ]}
            rows={[
              { label: 'Data Transit', values: { area: 'TLS/HTTPS Encryption', action: 'Enforce SSL certificates everywhere', compliance: 'SOC2 / GDPR' }, highlight: true },
              { label: 'Storage Security', values: { area: 'Encrypted database drives', action: 'AES-256 database records encryption', compliance: 'SOC2 / HIPAA' } },
              { label: 'Identity Auth', values: { area: 'Multi-factor authentication', action: 'Enforce SSO for team and user portals', compliance: 'SOC2' } }
            ]}
          />
        </div>
      );
    case 61:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">61. Define Top 20 KPIs</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Top KPI Categories & Targets:</div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'KPI Category' },
              { key: 'kpi', label: 'Primary Indicator' },
              { key: 'target', label: 'Target Value' }
            ]}
            rows={[
              { label: 'Financial', values: { category: 'Financial', kpi: 'Monthly Recurring Revenue (MRR)', target: '+$20k/month' }, highlight: true },
              { label: 'Marketing', values: { category: 'Marketing', kpi: 'Customer Acquisition Cost (CAC)', target: '<$80' } },
              { label: 'Customer', values: { category: 'Customer Care', kpi: 'Net Promoter Score (NPS)', target: '>50' } },
              { label: 'Product', values: { category: 'Product', kpi: 'Churn Rate', target: '<3.0%/month' } }
            ]}
          />
        </div>
      );
    case 62:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">62. Set Up Data Warehouse</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Data Warehouse Tier' },
              { key: 'tool', label: 'Services' },
              { key: 'purpose', label: 'Usage' }
            ]}
            rows={[
              { label: 'Ingestion pipeline', values: { layer: 'Ingestion (ETL)', tool: 'Stripe Webhooks, Segment, Fivetran', purpose: 'Load database records to central store' } },
              { label: 'Central Storage', values: { layer: 'Database Warehouse', tool: 'BigQuery / Snowflake', purpose: 'Stores chronological performance data' }, highlight: true },
              { label: 'Visualization BI', values: { layer: 'BI Dashboard', tool: 'Looker / Streamlit', purpose: 'Daily, weekly reporting graphics' } }
            ]}
          />
        </div>
      );
    case 63:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">63. Prepare Daily, Weekly, and Monthly Reports</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
      columns={[
        { key: 'label', label: 'Report Frequency' },
        { key: 'metrics', label: 'Monitored Metrics' },
        { key: 'audience', label: 'Primary Readership' }
      ]}
      rows={[
        { label: 'Daily Report', values: { type: 'Daily', metrics: 'Signups, website traffic, server exceptions', audience: 'Engineering & support teams' } },
        { label: 'Weekly Report', values: { type: 'Weekly', metrics: 'MRR movement, new customers, CAC vs LTV', audience: 'Founders, department heads' }, highlight: true },
        { label: 'Monthly Report', values: { type: 'Monthly', metrics: 'Cash burn, runway weeks remaining, NPS score', audience: 'Advisors, early investors' } }
      ]}
    />
        </div>
      );
    case 64:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">64. Set Hiring Targets</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Timeline 
      steps={[
        { title: 'Month 1: Core Technical Hires', description: 'Recruit lead software engineers to scale the MVP codebase.' },
        { title: 'Month 3: Sales Representatives', description: 'Acquire outbound sales reps to build enterprise pipelines.' },
        { title: 'Month 6: Customer Care Reps', description: 'Scale customer support team to match rising user onboarding.' }
      ]}
    />
        </div>
      );
    case 65:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">65. Stress Test & Bug-Fix Across Functions</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
      nodes={[
        { id: '1', title: '1. Load Simulation', description: 'Simulate high transaction rates using load testing scripts.', icon: <Zap size={14} /> },
        { id: '2', title: '2. Exception Logging', description: 'Record slow database queries, database timeout errors.', icon: <AlertTriangle size={14} /> },
        { id: '3', title: '3. Patch Deployment', description: 'Optimise query indexes, release software patch.', icon: <CheckCircle size={14} /> }
      ]}
    />
        </div>
      );
    case 66:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">66. Prepare Press List</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Grid cols={3}>
            <GlassCard className="p-3">
              <div className="font-semibold text-xs text-[#B4F052]">Tech Journalists</div>
              <p className="text-[10px] text-white/60 mt-1">TechCrunch, VentureBeat tech writers covering pre-seed rounds.</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="font-semibold text-xs text-[#B4F052]">Industry Newsletters</div>
              <p className="text-[10px] text-white/60 mt-1">Niche sector digests, substack publications read by buyers.</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="font-semibold text-xs text-[#B4F052]">Local Business Hubs</div>
              <p className="text-[10px] text-white/60 mt-1">Regional newspapers covering local entrepreneurial launches.</p>
            </GlassCard>
          </Grid>
        </div>
      );
    case 67:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">67. Start KPI Reporting</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Reporting Task' },
              { key: 'schedule', label: 'Timing Schedule' },
              { key: 'tool', label: 'Reporting Interface' }
            ]}
            rows={[
              { label: 'Automated Ingestion', values: { workflow: 'Automated data load', schedule: 'Every night at 1:00 AM', tool: 'Fivetran ETL pipelines' } },
              { label: 'KPI Dashboard Refresh', values: { workflow: 'Dashboard refresh', schedule: 'Every morning at 7:00 AM', tool: 'Looker / Slack alerts' }, highlight: true }
            ]}
          />
        </div>
      );
    case 68:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">68. Conduct Launch PR Campaign & Paid Marketing</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
      nodes={[
        { id: '1', title: 'Embargo Press Release', description: 'Share news with selected writers under embargo.' },
        { id: '2', title: 'Launch Paid Ads', description: 'Kick off Google/LinkedIn search keyword campaigns.' },
        { id: '3', title: 'Waitlist Onboarding', description: 'Gradually release invites to waitlist signup cohort.' }
      ]}
    />
        </div>
      );
    case 69:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">69. Continue Testing & Bug-Fixing</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
      nodes={[
        { id: '1', title: 'Monitor Errors', description: 'Track live backend errors using Sentry.', icon: <ShieldAlert size={14} /> },
        { id: '2', title: 'Triage & Assign', description: 'Assess bug severity, assign to software sprint.', icon: <Users size={14} /> },
        { id: '3', title: 'Continuous Deploy', description: 'Push weekly fixes to production without downtime.', icon: <CheckCircle size={14} /> }
      ]}
    />
        </div>
      );
    case 70:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">70. Secure Growth Investment</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
      nodes={[
        { id: '1', title: 'Pitch Deck Refresh', description: 'Add actual MRR growth metrics and customer count.' },
        { id: '2', title: 'Series A VC Meetings', description: 'Schedule introductory calls with institutional funds.' },
        { id: '3', title: 'Close Funding', description: 'Review new term sheet clauses, close capital infusion.' }
      ]}
    />
        </div>
      );
    case 71:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">71. Set Up Employee Participation Program</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Pyramid 
            layers={[
              { level: 'Tier 1: Option Pool Allocation', title: '10% - 15% ESOP pool size', description: 'Reserved option pool approved by board.' },
              { level: 'Tier 2: Vesting Rules', title: '4-year vesting, 1-year cliff', description: 'Standard vesting schedule to ensure long-term retention.' },
              { level: 'Tier 3: Strike Price Plan', title: 'Fair Market Value strike price', description: 'Set strike price based on 409A valuation.' }
            ]}
          />
        </div>
      );
    case 72:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">72. Design and Track Hiring Process</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Interview Stage' },
              { key: 'interviewer', label: 'Evaluator' },
              { key: 'focus', label: 'Evaluation Target' }
            ]}
            rows={[
              { label: 'Screening Call', values: { stage: 'HR recruiter', interviewer: 'HR / Recruiter', focus: 'Salary check, visa requirements, culture fit' } },
              { label: 'Technical Assessment', values: { stage: 'Lead Developer', interviewer: 'CTO / Senior dev', focus: 'Coding skills, system architecture logic' }, highlight: true },
              { label: 'Founder Interview', values: { stage: 'Co-founder', interviewer: 'CEO', focus: 'Long-term vision alignment, chemistry' } }
            ]}
          />
        </div>
      );
    case 73:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">73. Foster People Development</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Development Program' },
              { key: 'schedule', label: 'Frequency' },
              { key: 'benefit', label: 'Target Benefit' }
            ]}
            rows={[
              { label: '1-on-1 Feedback', values: { initiative: '1-on-1 manager talk', schedule: 'Every 2 weeks', benefit: 'Identify obstacles, align work expectations' }, highlight: true },
              { label: 'Training Budgets', values: { initiative: 'Skill courses / conferences', schedule: 'Annual allocation', benefit: 'Upgrade technical knowledge' } }
            ]}
          />
        </div>
      );
    case 74:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">74. Create and Maintain Company Culture</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
      nodes={[
        { id: '1', title: 'Document Core Values', description: 'Publish team code of conduct and principles.' },
        { id: '2', title: 'Structured Onboarding', description: 'Provide new hires with setup guides and culture briefs.' },
        { id: '3', title: 'Conduct Retrospectives', description: 'Hold open post-mortem sessions after major releases.' }
      ]}
    />
        </div>
      );
    case 75:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">75. Navigate Using Daily, Weekly, & Monthly Reports</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
      nodes={[
        { id: '1', title: 'Review Alerts', description: 'Check Slack automated metrics reports daily.', icon: <Activity size={14} /> },
        { id: '2', title: 'Weekly Review', description: 'Compare actual indicators against monthly goals.', icon: <LineChart size={14} /> },
        { id: '3', title: 'Monthly Strategy', description: 'Re-budget resources based on cash runway changes.', icon: <Shield size={14} /> }
      ]}
    />
        </div>
      );
    case 76:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">76. Dig Deeper Using Ad Hoc Reports for Each Function</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Ad-Hoc Analysis' },
              { key: 'metric', label: 'Investigated Metric' },
              { key: 'reason', label: 'Trigger Event' }
            ]}
            rows={[
              { label: 'Churn cohort analysis', values: { query: 'Cohort retention analysis', metric: 'User retention rate by sign-up month', reason: 'Sudden spike in monthly churn rate' }, highlight: true },
              { label: 'Ad campaign ROI', values: { query: 'Channel conversion analysis', metric: 'CAC split by marketing campaign', reason: 'Customer Acquisition Cost exceeds target' } }
            ]}
          />
        </div>
      );
    case 77:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">77. Analyze Progress Toward Financial Targets</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Financial Target' },
              { key: 'current', label: 'Current Performance' },
              { key: 'status', label: 'Analysis Status' }
            ]}
            rows={[
              { label: 'MRR Growth +15%', values: { target: 'Monthly Recurring Revenue', current: '+12% ARR growth', status: 'On track (minor gap)' }, highlight: true },
              { label: 'Cash runway > 12m', values: { target: 'Operating Runway', current: '9 months runway remaining', status: 'Needs attention / cost control' } }
            ]}
          />
        </div>
      );
    case 78:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">78. Focus on Cross-Channel Marketing Mix that Works</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Marketing Mix Performance Funnel:</div>
          <Funnel 
            stages={[
              { label: 'Organic SEO', value: '50% of traffic - Cost: $0', percentage: 95 },
              { label: 'Google Ads', value: '30% of traffic - CAC: $45', percentage: 65 },
              { label: 'LinkedIn Ads', value: '10% of traffic - CAC: $220', percentage: 35 },
              { label: 'Referrals', value: '10% of traffic - Cost: $0', percentage: 15 }
            ]}
          />
        </div>
      );
    case 79:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">79. Analyze Customer Engagement with Product</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">User Product Activation Funnel:</div>
          <Funnel 
            stages={[
              { label: 'Signup Completed', value: '100% of user cohort', percentage: 100 },
              { label: 'Account Verified', value: '80% of signups', percentage: 80 },
              { label: 'Core Action Taken', value: '45% of users (1st document setup)', percentage: 45 },
              { label: 'Repeat Activation', value: '25% of users (Active 3+ times/week)', percentage: 25 }
            ]}
          />
        </div>
      );
    case 80:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">80. Re-design Operating Model According to Data</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
      nodes={[
        { id: '1', title: '1. Pinpoint Bottlenecks', description: 'Analyze where support tickets or product delivery lags.', icon: <AlertTriangle size={14} /> },
        { id: '2', title: '2. Restructure Operations', description: 'Shift development resources to core features.', icon: <Users size={14} /> },
        { id: '3', title: '3. Track Improvement', description: 'Monitor new workflow SLA times.', icon: <CheckCircle size={14} /> }
      ]}
    />
        </div>
      );
    case 81:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">81. Establish Proper Financial Reporting, Controlling, & Compliance</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Grid cols={3}>
            <GlassCard className="p-3 text-center border-l-2 border-l-[#B4F052]">
              <div className="text-[10px] text-white/50 uppercase font-semibold">Taxes</div>
              <div className="text-sm font-bold text-white mt-1">VAT & Tax Audits</div>
              <p className="text-[10px] text-white/60 mt-1">Prepare regulatory quarterly tax declarations.</p>
            </GlassCard>
            <GlassCard className="p-3 text-center border-l-2 border-l-[#B4F052]">
              <div className="text-[10px] text-white/50 uppercase font-semibold">Controlling</div>
              <div className="text-sm font-bold text-white mt-1">Variance Audits</div>
              <p className="text-[10px] text-white/60 mt-1">Compare actual cash spend to original projections.</p>
            </GlassCard>
            <GlassCard className="p-3 text-center border-l-2 border-l-[#B4F052]">
              <div className="text-[10px] text-white/50 uppercase font-semibold">Reporting</div>
              <div className="text-sm font-bold text-white mt-1">Monthly Investor Pack</div>
              <p className="text-[10px] text-white/60 mt-1">P&L, Balance Sheet, Cash Flow summary reports.</p>
            </GlassCard>
          </Grid>
        </div>
      );
    case 82:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">82. Groom & Prioritize Product Roadmap</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Feature Candidate' },
              { key: 'reach', label: 'Estimated Reach' },
              { key: 'effort', label: 'Development Effort' },
              { key: 'score', label: 'RICE Score' }
            ]}
            rows={[
              { label: 'Feature A (Payment integration)', values: { feature: 'Multi-currency checkout', reach: '80% of users', effort: '2 weeks', score: '8.5 / 10' }, highlight: true },
              { label: 'Feature B (UX Enhancement)', values: { feature: 'Animated transition pages', reach: '100% of users', effort: '4 weeks', score: '4.2 / 10' } }
            ]}
          />
        </div>
      );
    case 83:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">83. Enhance UI/UX According to Usability Tests</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Usability Feedback Funnel:</div>
          <Funnel 
            stages={[
              { label: 'Identified Issues', value: '15 UI bottlenecks logged', percentage: 100 },
              { label: 'Figma Redesigns', value: '10 layouts updated', percentage: 70 },
              { label: 'Implemented Fixes', value: '6 priority deploys released', percentage: 40 }
            ]}
          />
        </div>
      );
    case 84:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">84. Boost Tech Stack&apos;s Scalability, Availability, Speed, & Security</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Grid cols={3}>
            <GlassCard className="p-3 text-center border-l-2 border-l-purple-400">
              <div className="text-[10px] text-white/50 uppercase">Speed</div>
              <div className="text-lg font-bold text-white mt-1">Query Latency</div>
              <p className="text-[10px] text-white/60 mt-1">Add DB indexes to get under 100ms response.</p>
            </GlassCard>
            <GlassCard className="p-3 text-center border-l-2 border-l-purple-400">
              <div className="text-[10px] text-white/50">Availability</div>
              <div className="text-lg font-bold text-white mt-1">Server Uptime</div>
              <p className="text-[10px] text-white/60 mt-1">Targeting 99.9% availability SLA.</p>
            </GlassCard>
            <GlassCard className="p-3 text-center border-l-2 border-l-purple-400">
              <div className="text-[10px] text-white/50">Security</div>
              <div className="text-lg font-bold text-white mt-1">Pen Testing</div>
              <p className="text-[10px] text-white/60 mt-1">Automated vulnerability scans on releases.</p>
            </GlassCard>
          </Grid>
        </div>
      );
    case 85:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">85. Eliminate Operational Bottlenecks</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Operational Bottleneck' },
              { key: 'rootcause', label: 'Root Cause' },
              { key: 'solution', label: 'Resolution Action' }
            ]}
            rows={[
              { label: 'Support queues backlogged', values: { bottleneck: 'Delayed customer support tickets', rootcause: 'Manual invoice creation requests', solution: 'Automate invoice generation in Stripe' }, highlight: true }
            ]}
          />
        </div>
      );
    case 86:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">86. Re-assess Suppliers & Partners</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
      nodes={[
        { id: '1', title: 'Audit Vendor SLAs', description: 'Verify actual delivery times vs agreements.', icon: <Activity size={14} /> },
        { id: '2', title: 'Renegotiate Terms', description: 'Request discount for larger recurring order volumes.', icon: <DollarSign size={14} /> },
        { id: '3', title: 'Setup Backup Vendor', description: 'Sign secondary supplier agreement to cover supply risks.', icon: <Shield size={14} /> }
      ]}
    />
        </div>
      );
    case 87:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">87. Optimize Payment Mix, Fees, Checkout Funnel & Fraud Prevention</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Conversion checkout drop-offs:</div>
          <Funnel 
            stages={[
              { label: 'Cart Viewed', value: '100% of checkouts started', percentage: 100 },
              { label: 'Address Input', value: '70% completed (30% drop-off)', percentage: 70 },
              { label: 'Payment Input', value: '55% completed (15% drop-off)', percentage: 55 },
              { label: 'Transaction Complete', value: '50% completed (5% fraud/declines)', percentage: 50 }
            ]}
          />
        </div>
      );
    case 88:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">88. Improve Management of Sales Funnel</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Sales CRM pipeline:</div>
          <Funnel 
            stages={[
              { label: 'Cold Lead Contact', value: '500 leads contacted', percentage: 100 },
              { label: 'Meeting Scheduled', value: '100 intro calls booked', percentage: 20 },
              { label: 'Proposal Sent', value: '40 pricing options sent', percentage: 8 },
              { label: 'Deal Closed', value: '10 enterprise signups closed', percentage: 2 }
            ]}
          />
        </div>
      );
    case 89:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">89. Optimize CAC vs CLV</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Metric Category' },
              { key: 'current', label: 'Performance Indicator' },
              { key: 'ratio', label: 'CLV/CAC Ratio' }
            ]}
            rows={[
              { label: 'Target Goal', values: { metric: 'Industry standard targets', current: 'CAC: $50, CLV: $200', ratio: '4.0x (Highly viable)' }, highlight: true },
              { label: 'Actual Performance', values: { metric: 'Current business stats', current: 'CAC: $80, CLV: $160', ratio: '2.0x (Needs optimization)' } }
            ]}
          />
        </div>
      );
    case 90:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">90. Enhance CRM</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
      nodes={[
        { id: '1', title: 'Data Cleaning', description: 'De-duplicate customer email and account records.', icon: <CheckCircle size={14} /> },
        { id: '2', title: 'Automated Triggers', description: 'Configure automated email follow-ups for idle trial accounts.', icon: <Activity size={14} /> },
        { id: '3', title: 'Analytics Sync', description: 'Sync CRM database records directly to analytics dashboard.', icon: <LineChart size={14} /> }
      ]}
    />
        </div>
      );
    case 91:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">91. Build Brand & Execute PR Strategy</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Grid cols={3}>
            <GlassCard className="p-3">
              <div className="font-semibold text-xs text-[#B4F052]">Thought Leadership</div>
              <p className="text-[10px] text-white/60 mt-1">Publish insightful case studies and articles on industry trends.</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="font-semibold text-xs text-[#B4F052]">Conference Panels</div>
              <p className="text-[10px] text-white/60 mt-1">Submit founder abstracts to speak at sector events.</p>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="font-semibold text-xs text-[#B4F052]">PR Placements</div>
              <p className="text-[10px] text-white/60 mt-1">Coordinate coverage with leading trade newsletters.</p>
            </GlassCard>
          </Grid>
        </div>
      );
    case 92:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">92. Improve Customer Care Processes to Maximize NPS</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
      nodes={[
        { id: '1', title: 'Deliver NPS Survey', description: 'Send automated feedback forms 14 days after signup.' },
        { id: '2', title: 'Triage Detractors', description: 'Directly contact users giving ratings under 6 to solve their issues.' },
        { id: '3', title: 'Reward Promoters', description: 'Leverage user ratings of 9+ for referral marketing campaigns.' }
      ]}
    />
        </div>
      );
    case 93:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">93. Automate Important Manual Processes</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Manual Process' },
              { key: 'automation', label: 'Automation Tool' },
              { key: 'time', label: 'Time Saved / Week' }
            ]}
            rows={[
              { label: 'Support Ticket Assignments', values: { process: 'Manual ticket assignments', automation: 'Zendesk auto-routing triggers', time: '5 hours/week' } },
              { label: 'CRM lead imports', values: { process: 'CSV lead files import', automation: 'Zapier Webhook integrations', time: '4 hours/week' }, highlight: true }
            ]}
          />
        </div>
      );
    case 94:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">94. Accelerate Workforce</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
      nodes={[
        { id: '1', title: 'Identify Skill Gaps', description: 'Review training requests during team reviews.' },
        { id: '2', title: 'Fund Education', description: 'Approve jobs/courses, certifications, and technical books.' },
        { id: '3', title: 'Peer Review', description: 'Organize internal lunch & learn knowledge sharing.' }
      ]}
    />
        </div>
      );
    case 95:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">95. Phase in OKR System</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
      nodes={[
        { id: '1', title: 'Set Corporate OKRs', description: 'Define 3 company objectives with measurable key results.' },
        { id: '2', title: 'Align Teams', description: 'Have each department write OKRs supporting company goals.' },
        { id: '3', title: 'Quarterly Audit', description: 'Score results and adjust next quarterly planning cycles.' }
      ]}
    />
        </div>
      );
    case 96:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">96. Define Best Practices for Each Function</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <div className="text-xs text-white/60 mb-3 font-semibold">Best Practices Integration Stages:</div>
          <Funnel 
            stages={[
              { label: 'Identify standard', value: 'Compare workflows against industry peers', percentage: 95 },
              { label: 'Document Guide', value: 'Create Notion wiki SOP playbooks', percentage: 65 },
              { label: 'Train Team', value: 'Mandatory workshop walkthroughs', percentage: 35 }
            ]}
          />
        </div>
      );
    case 97:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">97. Implement Best Practices</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Timeline 
      steps={[
        { title: 'Week 1: Audit Workflows', description: 'Analyze current manual tasks, identify inefficiencies.' },
        { title: 'Week 2: Document standard SOPs', description: 'Publish standard operation procedures for core functions.' },
        { title: 'Week 3: Continuous Auditing', description: 'Verify process compliance during monthly reviews.' }
      ]}
    />
        </div>
      );
    case 98:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">98. Implement Ongoing Knowledge Sharing</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <Flowchart 
      nodes={[
        { id: '1', title: 'SOP Documentation', description: 'Record standard steps for repeat operations.' },
        { id: '2', title: 'Weekly Demos', description: 'Demonstrate new tools and code features to the team.' },
        { id: '3', title: 'Retrospective Log', description: 'Log project post-mortems for future developer onboarding.' }
      ]}
    />
        </div>
      );
    case 99:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">99. Achieve Product-Market Fit</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'PMF Metric Indicator' },
              { key: 'target', label: 'Target Ratio' },
              { key: 'current', label: 'Current Performance' }
            ]}
            rows={[
              { label: 'Sean Ellis PMF Survey', values: { indicator: 'Sean Ellis survey question', target: '>40% "very disappointed" without product', current: '44% (Achieved)' }, highlight: true },
              { label: 'Cohort Retention', values: { indicator: 'User cohort retention (month 6)', target: '>20% active retention curve', current: '22% (Achieved)' } }
            ]}
          />
        </div>
      );
    case 100:
      return (
        <div className="space-y-6 animate-fade-in p-4 rounded-2xl bg-[#090D10]/80 border border-white/[0.04] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4F052]" />
              <h3 className="text-md font-bold text-white">100. Constantly Evaluate Further Growth & Expansion Options</h3>
            </div>
            <Badge variant="green">Slide Info-Card</Badge>
          </div>
          <ComparisonTable 
            columns={[
              { key: 'label', label: 'Expansion Vector' },
              { key: 'effort', label: 'Development Effort' },
              { key: 'upside', label: 'Estimated Growth Upside' }
            ]}
            rows={[
              { label: 'Geographic Rollout', values: { direction: 'New region launch (EU/US)', effort: 'High (requires legal/compliance setups)', upside: '2.5x current revenue potential' }, highlight: true },
              { label: 'Horizontal Product', values: { direction: 'Launch complementary features', effort: 'Medium', upside: '1.8x revenue' } },
              { label: 'Vertical Integration', values: { direction: 'Acquire raw supplier systems', effort: 'Very High', upside: '0.4x (cost efficiency focus)' } }
            ]}
          />
        </div>
      );
    default:
      return <div className="text-xs text-white/40">Infographic for Task {taskNumber} is currently unavailable.</div>;
  }
}
