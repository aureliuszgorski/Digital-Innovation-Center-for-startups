'use client';
import { useState, use } from 'react';
import Link from 'next/link';
import { getTask, TYPE_COLORS, STAGE_COLORS } from '@/data/tasks';
import { useGarage } from '@/context/GarageContext';
import { Brain, BarChart3, Swords, Microscope, PenTool, ClipboardList, Code2, X, Send, Check, Star, ChevronLeft, ChevronRight, FileText, Sparkles } from 'lucide-react';
import TaskInfographic from '@/components/TaskInfographic';
import Task1Redesign from '@/components/Task1Redesign';
import Task2Redesign from '@/components/Task2Redesign';
import Task3Redesign from '@/components/Task3Redesign';
import Task4Redesign from '@/components/Task4Redesign';
import Task5Redesign from '@/components/Task5Redesign';
import Task6Redesign from '@/components/Task6Redesign';
import Task7Redesign from '@/components/Task7Redesign';
import Task8Redesign from '@/components/Task8Redesign';
import Task9Redesign from '@/components/Task9Redesign';
import Task10Redesign from '@/components/Task10Redesign';
import Task11Redesign from '@/components/Task11Redesign';
import Task12Redesign from '@/components/Task12Redesign';
import Task13Redesign from '@/components/Task13Redesign';
import Task14Redesign from '@/components/Task14Redesign';
import Task15Redesign from '@/components/Task15Redesign';
import Task16Redesign from '@/components/Task16Redesign';
import Task17Redesign from '@/components/Task17Redesign';
import Task18Redesign from '@/components/Task18Redesign';
import Task19Redesign from '@/components/Task19Redesign';
import Task20Redesign from '@/components/Task20Redesign';
import TasksRedesigns from '@/components/TasksRedesigns';



const AI_ROLES = [
  { id: 'mentor', label: 'Mentor', icon: Brain, desc: 'Strategic coaching and guidance' },
  { id: 'analyst', label: 'Analyst', icon: BarChart3, desc: 'Data analysis and insights' },
  { id: 'sparring', label: 'Sparring', icon: Swords, desc: 'Challenge your assumptions' },
  { id: 'researcher', label: 'Researcher', icon: Microscope, desc: 'Market research and competitive intel' },
  { id: 'copywriter', label: 'Copywriter', icon: PenTool, desc: 'Content, copy, and messaging' },
  { id: 'pm', label: 'PM', icon: ClipboardList, desc: 'Product roadmaps and user stories' },
  { id: 'cto', label: 'CTO', icon: Code2, desc: 'Technical architecture and stack' },
];

function AIMentorPanel({ taskNum, taskTitle }: { taskNum: number; taskTitle: string }) {
  const [role, setRole] = useState('mentor');
  const [messages, setMessages] = useState<{role:string;text:string}[]>([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  const getSuggestions = () => {
    if (taskNum === 5) {
      return [
        "How do I balance core business values with rapid execution requirements?",
        "What are common pitfalls when drafting a startup's vision statement?",
        "How can I define decision principles that actually prevent scope creep?",
        "Can you suggest behavior vs anti-behavior pairs for a Customer Empathy value?"
      ];
    }
    if (taskNum === 6) {
      return [
        "How do I know if a milestone belongs in Month 3 vs Month 6?",
        "What are typical dependencies that delay the MVP Launch phase?",
        "Can you suggest three Solution Validation steps from the 100-tasks framework?",
        "How should I log open questions so they stay actionable?"
      ];
    }
    if (taskNum === 7) {
      return [
        "What criteria should I use to distinguish Must-Haves from Should-Haves?",
        "How do I determine realistic lead times for initial developer setup tasks?",
        "What is the best feedback loop for the Solution Definition phase?",
        "How often should I review and update this roadmap during early validation?"
      ];
    }
    return [
      `What should I focus on most in "${taskTitle}"?`,
      `What are common mistakes founders make here?`,
      `Can you give me a template to start with?`,
      `How do I know when this task is truly done?`,
    ];
  };

  const suggestions = getSuggestions();

  const sendMsg = (text: string) => {
    if (!text.trim()) return;
    const r = AI_ROLES.find(x => x.id === role)!;
    
    let aiResponse = `[${r.label}] That's a great question about Task ${taskNum}. For "${taskTitle}", I would recommend focusing on the key deliverables and ensuring you have concrete outputs before moving on. This is a mock response -- connect a real AI API to get personalized guidance.`;
    
    const roleLower = role.toLowerCase();
    if (taskNum === 5) {
      if (roleLower === 'mentor') {
        aiResponse = `[Mentor] In Task 5 (Founder North Star), values must constrain behavior. Make sure your values reject certain profitable but distracting opportunities. For instance, Empathy-First should ban building before speaking to users.`;
      } else if (roleLower === 'pm') {
        aiResponse = `[PM] As a Product Manager, I advise keeping your vision statement tightly anchored on the core pain. A world where users can achieve their desired outcome without the major pain is your guide for features.`;
      }
    } else if (taskNum === 6) {
      if (roleLower === 'pm') {
        aiResponse = `[PM] For Task 6 (Operational Backlog), focus on breaking down your milestones into steps of 2-5 days lead time. Use the 100-tasks framework suggestions to ensure you don't miss essential validation steps.`;
      } else if (roleLower === 'cto') {
        aiResponse = `[CTO] Keep technical dependencies minimal. Build your database and auth setups only when solution interest is proven. Concierge validation is your friend.`;
      }
    } else if (taskNum === 7) {
      if (roleLower === 'analyst') {
        aiResponse = `[Analyst] When prioritizing, limit your Must-Haves to the absolute critical path of validation. Should-Haves and Nice-To-Haves should wait until you have baseline conversion metrics.`;
      } else if (roleLower === 'mentor') {
        aiResponse = `[Mentor] Ensure your feedback loops are fast. If a feedback loop in the Problem Clarity phase takes a month, you are moving too slowly. Keep validation loops under a week.`;
      }
    }

    setMessages(m => [...m, { role: 'user', text }, { role: 'ai', text: aiResponse }]);
    setInput('');
  };

  if (!open) return (
    <button onClick={() => setOpen(true)} className="fixed right-6 bottom-6 w-14 h-14 rounded-2xl bg-[#B4F052] text-black flex items-center justify-center shadow-lg shadow-[#B4F052]/20 hover:scale-105 transition-transform z-50">
      <Brain size={22} />
    </button>
  );

  return (
    <div className="fixed right-6 bottom-6 w-96 h-[500px] glass-card flex flex-col z-50 shadow-2xl">
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
        <div className="text-sm font-semibold">AI Mentor</div>
        <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white">
          <X size={18} />
        </button>
      </div>
      <div className="flex gap-1 p-2 overflow-x-auto border-b border-white/[0.08]">
        {AI_ROLES.map(r => {
          const Icon = r.icon;
          return (
            <button key={r.id} onClick={() => setRole(r.id)} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg whitespace-nowrap transition-all ${role === r.id ? 'bg-[#B4F052]/20 text-[#B4F052]' : 'text-white/40 hover:text-white/60'}`}>
              <Icon size={12} />
              {r.label}
            </button>
          );
        })}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-xs text-white/30">Suggested questions:</p>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => sendMsg(s)} className="block w-full text-left text-xs p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-[#B4F052]/30 transition-all text-white/60">{s}</button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`text-sm p-3 rounded-xl max-w-[85%] ${m.role === 'user' ? 'ml-auto bg-[#B4F052]/10 text-[#B4F052]' : 'bg-white/[0.05] text-white/80'}`}>{m.text}</div>
        ))}
      </div>
      <div className="p-3 border-t border-white/[0.08] flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg(input)} placeholder="Ask anything..." className="flex-1 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#B4F052]/40" />
        <button onClick={() => sendMsg(input)} className="px-3 py-2 rounded-xl bg-[#B4F052] text-black hover:opacity-90">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

function TaskInputForm({ taskNum }: { taskNum: number }) {
  const { setTaskInput, getTaskInput } = useGarage();
  const val = (field: string) => getTaskInput(taskNum, field);
  const set = (field: string, v: string) => setTaskInput(taskNum, field, v);

  const inputClass = "w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#B4F052]/40 resize-none";

  if (taskNum === 5) return (
    <div className="space-y-4">
      <div><label className="text-xs text-white/40 block mb-1">Vision Statement</label><textarea value={val('vision')} onChange={e => set('vision', e.target.value)} placeholder="In 5 years, we will..." className={inputClass} rows={3} /></div>
      <div><label className="text-xs text-white/40 block mb-1">Mission Statement</label><textarea value={val('mission')} onChange={e => set('mission', e.target.value)} placeholder="We exist to..." className={inputClass} rows={3} /></div>
      <div><label className="text-xs text-white/40 block mb-1">Core Values (one per line)</label><textarea value={val('values')} onChange={e => set('values', e.target.value)} placeholder="1. Innovation\n2. Integrity\n3. ..." className={inputClass} rows={4} /></div>
    </div>
  );

  if (taskNum === 17) return (
    <div className="grid grid-cols-3 gap-2">
      {['Key Partners','Key Activities','Key Resources','Value Propositions','Customer Relationships','Channels','Customer Segments','Cost Structure','Revenue Streams'].map(block => (
        <div key={block} className={`p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] ${block === 'Value Propositions' || block === 'Customer Segments' ? 'row-span-2' : ''}`}>
          <label className="text-xs text-[#B4F052]/60 block mb-1">{block}</label>
          <textarea value={val(block)} onChange={e => set(block, e.target.value)} className="w-full bg-transparent text-xs text-white/80 resize-none focus:outline-none" rows={3} placeholder={`Enter ${block.toLowerCase()}...`} />
        </div>
      ))}
    </div>
  );

  if (taskNum === 26) return (
    <div className="space-y-4">
      <div><label className="text-xs text-white/40 block mb-1">Product Name</label><input value={val('productName')} onChange={e => set('productName', e.target.value)} placeholder="Your product name" className={inputClass} /></div>
      <div><label className="text-xs text-white/40 block mb-1">Core Features (one per line)</label><textarea value={val('features')} onChange={e => set('features', e.target.value)} placeholder="1. Feature A\n2. Feature B\n3. Feature C" className={inputClass} rows={4} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs text-white/40 block mb-1">Target User</label><input value={val('targetUser')} onChange={e => set('targetUser', e.target.value)} placeholder="Who is this for?" className={inputClass} /></div>
        <div><label className="text-xs text-white/40 block mb-1">Key Metric</label><input value={val('keyMetric')} onChange={e => set('keyMetric', e.target.value)} placeholder="North star metric" className={inputClass} /></div>
      </div>
    </div>
  );

  if (taskNum === 61) return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-2 text-xs text-white/40"><span>KPI Name</span><span>Target</span><span>Current</span></div>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="grid grid-cols-3 gap-2 mb-2">
          <input value={val(`kpi-${i}-name`)} onChange={e => set(`kpi-${i}-name`, e.target.value)} placeholder={`KPI ${i+1}`} className={inputClass} />
          <input value={val(`kpi-${i}-target`)} onChange={e => set(`kpi-${i}-target`, e.target.value)} placeholder="Target" className={inputClass} />
          <input value={val(`kpi-${i}-current`)} onChange={e => set(`kpi-${i}-current`, e.target.value)} placeholder="Current" className={inputClass} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div><label className="text-xs text-white/40 block mb-1">Notes and Key Insights</label><textarea value={val('notes')} onChange={e => set('notes', e.target.value)} placeholder="Your notes, thoughts, and key insights for this task..." className={inputClass} rows={5} /></div>
      <div><label className="text-xs text-white/40 block mb-1">Key Deliverable</label><input value={val('deliverable')} onChange={e => set('deliverable', e.target.value)} placeholder="What's the main output?" className={inputClass} /></div>
    </div>
  );
}

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const taskNum = parseInt(id);
  const task = getTask(taskNum);
  const { completedTasks, completeTask, subtaskChecks, toggleSubtask } = useGarage();
  const [showCelebration, setShowCelebration] = useState(false);
  const [prevTaskNum, setPrevTaskNum] = useState(taskNum);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showTextAlt, setShowTextAlt] = useState(false);
  const [showPlainTextView, setShowPlainTextView] = useState(false);

  if (taskNum !== prevTaskNum) {
    setPrevTaskNum(taskNum);
    setActiveSlideIdx(0);
    setIsLightboxOpen(false);
    setShowTextAlt(false);
    setShowPlainTextView(false);
  }

  if (!task) return <div className="text-center py-20 text-white/40">Task not found</div>;

  if (taskNum === 1) {
    return (
      <>
        <Task1Redesign />
        <AIMentorPanel taskNum={1} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 2) {
    return (
      <>
        <Task2Redesign />
        <AIMentorPanel taskNum={2} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 3) {
    return (
      <>
        <Task3Redesign />
        <AIMentorPanel taskNum={3} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 4) {
    return (
      <>
        <Task4Redesign />
        <AIMentorPanel taskNum={4} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 5) {
    return (
      <>
        <Task5Redesign />
        <AIMentorPanel taskNum={5} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 6) {
    return (
      <>
        <Task6Redesign />
        <AIMentorPanel taskNum={6} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 7) {
    return (
      <>
        <Task7Redesign />
        <AIMentorPanel taskNum={7} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 8) {
    return (
      <>
        <Task8Redesign />
        <AIMentorPanel taskNum={8} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 9) {
    return (
      <>
        <Task9Redesign />
        <AIMentorPanel taskNum={9} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 10) {
    return (
      <>
        <Task10Redesign />
        <AIMentorPanel taskNum={10} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 11) {
    return (
      <>
        <Task11Redesign />
        <AIMentorPanel taskNum={11} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 12) {
    return (
      <>
        <Task12Redesign />
        <AIMentorPanel taskNum={12} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 13) {
    return (
      <>
        <Task13Redesign />
        <AIMentorPanel taskNum={13} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 14) {
    return (
      <>
        <Task14Redesign />
        <AIMentorPanel taskNum={14} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 15) {
    return (
      <>
        <Task15Redesign />
        <AIMentorPanel taskNum={15} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 16) {
    return (
      <>
        <Task16Redesign />
        <AIMentorPanel taskNum={16} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 17) {
    return (
      <>
        <Task17Redesign />
        <AIMentorPanel taskNum={17} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 18) {
    return (
      <>
        <Task18Redesign />
        <AIMentorPanel taskNum={18} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 19) {
    return (
      <>
        <Task19Redesign />
        <AIMentorPanel taskNum={19} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum === 20) {
    return (
      <>
        <Task20Redesign />
        <AIMentorPanel taskNum={20} taskTitle={task.title} />
      </>
    );
  }

  if (taskNum >= 21 && taskNum <= 100) {
    return (
      <>
        <TasksRedesigns taskNum={taskNum} />
        <AIMentorPanel taskNum={taskNum} taskTitle={task.title} />
      </>
    );
  }



  const done = completedTasks.includes(taskNum);
  const prev = taskNum > 1 ? getTask(taskNum - 1) : null;
  const next = taskNum < 100 ? getTask(taskNum + 1) : null;
  const checkedCount = task.keyPoints.filter((_, i) => subtaskChecks[`${taskNum}-${i}`]).length;
  const checkProgress = task.keyPoints.length > 0 ? Math.round((checkedCount / task.keyPoints.length) * 100) : 0;

  const handleComplete = () => {
    completeTask(taskNum);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-slide-up">
            <Sparkles size={48} className="mx-auto mb-4 text-[#B4F052]" />
            <div className="text-2xl font-bold text-[#B4F052]">+10 Points!</div>
            <div className="text-white/60">Task {taskNum} Complete</div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
        <Link href="/tasks" className="hover:text-[#B4F052]">Tasks</Link>
        <ChevronRight size={12} />
        <span style={{ color: STAGE_COLORS[task.stage] }}>{task.stage}</span>
        <ChevronRight size={12} />
        <span>{task.subStage}</span>
        <ChevronRight size={12} />
        <span className="text-white/60">Task {taskNum}</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">{task.title}</h1>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: STAGE_COLORS[task.stage] + '20', color: STAGE_COLORS[task.stage] }}>{task.stage}</span>
        <span className="text-xs px-3 py-1 rounded-full border border-white/[0.08]" style={{ color: TYPE_COLORS[task.type] }}>{task.type}</span>
        <span className="text-xs px-3 py-1 rounded-full bg-white/[0.05] flex items-center gap-1">
          {Array.from({ length: task.difficulty }, (_, i) => <Star key={i} size={10} className="fill-white/40 text-white/40" />)}
          <span className="ml-1">{['Beginner','Intermediate','Advanced'][task.difficulty-1]}</span>
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-white/[0.05] text-white/40">Weeks {task.startWeek}--{task.endWeek}</span>
        <span className="text-xs px-3 py-1 rounded-full bg-white/[0.05] text-white/40">~{task.estimatedHours}h</span>
        {done && <span className="text-xs px-3 py-1 rounded-full bg-[#B4F052]/20 text-[#B4F052] font-semibold flex items-center gap-1"><Check size={12} /> Completed</span>}
      </div>

      {/* Introduction */}
      {task.intro && (
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-[#B4F052]" />
            <span className="text-xs text-[#B4F052] uppercase tracking-wider font-semibold">Introduction</span>
          </div>
          <div className="text-sm text-white/80 leading-relaxed space-y-4">
            {task.intro.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      {/* Slide Viewer / Carousel */}
      {task.slides && task.slides.length > 0 && (
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={16} className="text-[#B4F052]" />
            <span className="text-xs text-[#B4F052] uppercase tracking-wider font-semibold">Slide Presentation Summary</span>
          </div>

          {/* Graphical Slide Viewer Container */}
          <div className="relative group overflow-hidden rounded-xl border border-white/[0.08] bg-black/40 aspect-[16/9] flex items-center justify-center">
            {/* Slide Image */}
            <img
              src={`/slides/slide_${task.slides[activeSlideIdx]}.png`}
              alt={`Slide ${activeSlideIdx + 1} for Task ${task.number}: ${task.title}`}
              className="w-full h-full object-contain cursor-zoom-in hover:scale-[1.01] transition-transform duration-300"
              onClick={() => setIsLightboxOpen(true)}
            />

            {/* Navigation buttons (if multiple slides) */}
            {task.slides.length > 1 && (
              <>
                <button
                  onClick={() => setActiveSlideIdx((prev) => (prev === 0 ? task.slides.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/60 text-white/80 hover:text-white border border-white/[0.08] hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setActiveSlideIdx((prev) => (prev === task.slides.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/60 text-white/80 hover:text-white border border-white/[0.08] hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Next slide"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Slide Count Indicator (if multiple slides) */}
            {task.slides.length > 1 && (
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/60 border border-white/[0.08] text-xs text-white/80 backdrop-blur-md">
                Slide {activeSlideIdx + 1} of {task.slides.length}
              </div>
            )}
          </div>

          {/* Collapsible Slide Text Alternative */}
          {task.slidesContent && task.slidesContent.length > 0 && (
            <div className="mt-4 space-y-4">
              <button
                onClick={() => setShowTextAlt(!showTextAlt)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] transition-all text-xs font-semibold text-white/70 hover:text-white"
              >
                <span>{showTextAlt ? 'Hide Slide Text Alternative' : 'Show Slide Text Alternative'}</span>
                {showTextAlt ? <ChevronRight size={14} className="rotate-90 transition-transform" /> : <ChevronRight size={14} className="transition-transform" />}
              </button>

              {showTextAlt && (
                <div className="space-y-4 animate-slide-down">
                  {/* Custom Handcrafted Infographic Diagram */}
                  <div className="p-1 rounded-xl border border-white/[0.06] bg-black/20">
                    <TaskInfographic taskNumber={taskNum} />
                  </div>

                  {/* Toggle for Plain Text View */}
                  <div className="border border-white/[0.08] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setShowPlainTextView(!showPlainTextView)}
                      className="w-full flex items-center justify-between px-4 py-2 bg-white/[0.02] hover:bg-white/[0.04] transition-all text-xs font-semibold text-white/50 hover:text-white"
                    >
                      <span>Plain Text View (Accessibility)</span>
                      {showPlainTextView ? <ChevronRight size={12} className="rotate-90 transition-transform" /> : <ChevronRight size={12} className="transition-transform" />}
                    </button>
                    {showPlainTextView && (
                      <div className="p-4 bg-white/[0.01] border-t border-white/[0.06] space-y-3 max-h-96 overflow-y-auto">
                        {task.slidesContent.map((line, index) => {
                          const trimmed = line.trim();
                          if (!trimmed) return null;
                          
                          if (trimmed.startsWith("Example") || trimmed.startsWith("Example:")) {
                            return (
                              <div key={index} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] border-l-2 border-l-[#B4F052]/50 my-2 text-sm text-white/70 italic">
                                {line}
                              </div>
                            );
                          }
                          
                          if (trimmed.startsWith("Key Principles") || trimmed.startsWith("Important!") || trimmed.endsWith(":")) {
                            return (
                              <div key={index} className="text-sm font-semibold text-[#B4F052]/80 mt-4 mb-2 first:mt-0">
                                {line}
                              </div>
                            );
                          }
                          
                          return (
                            <div key={index} className="flex items-start gap-2.5 text-sm text-white/80 leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B4F052] mt-2 flex-shrink-0" />
                              <span>{line}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && task.slides && task.slides.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md">
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all z-[110]"
            aria-label="Close fullscreen view"
          >
            <X size={24} />
          </button>

          {/* Lightbox Slide Image Container */}
          <div className="relative max-w-[90vw] max-h-[85vh] aspect-[16/9] w-full flex items-center justify-center">
            <img
              src={`/slides/slide_${task.slides[activeSlideIdx]}.png`}
              alt={`Fullscreen Slide ${activeSlideIdx + 1} for Task ${task.number}: ${task.title}`}
              className="w-full h-full object-contain"
            />

            {/* Lightbox Prev/Next Navigation (if multiple slides) */}
            {task.slides.length > 1 && (
              <>
                <button
                  onClick={() => setActiveSlideIdx((prev) => (prev === 0 ? task.slides.length - 1 : prev - 1))}
                  className="absolute left-[-5vw] md:left-[-4rem] top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={() => setActiveSlideIdx((prev) => (prev === task.slides.length - 1 ? 0 : prev + 1))}
                  className="absolute right-[-5vw] md:right-[-4rem] top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all"
                  aria-label="Next slide"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            {/* Lightbox Slide Count Indicator */}
            {task.slides.length > 1 && (
              <div className="absolute bottom-[-5vh] left-1/2 -translate-x-1/2 text-white/60 text-sm">
                Slide {activeSlideIdx + 1} of {task.slides.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Why This Matters */}
      {task.description && (
        <div className="glass-card p-5 mb-6 border-l-4 border-l-[#B4F052]">
          <div className="text-xs text-[#B4F052] uppercase tracking-wider mb-2">Why This Matters</div>
          <p className="text-sm text-white/70 leading-relaxed">{task.description}</p>
        </div>
      )}

      {/* Step-by-Step */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-white/40 uppercase tracking-wider">Step-by-Step Checklist</div>
          <div className="text-xs text-white/40">{checkedCount}/{task.keyPoints.length} / {checkProgress}%</div>
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
                  {checked && <Check size={12} />}
                </div>
                <span className={`text-sm ${checked ? 'text-white/40 line-through' : 'text-white/80'}`}>{kp}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Your Input */}
      <div className="glass-card p-6 mb-6">
        <div className="text-xs text-white/40 uppercase tracking-wider mb-4">Your Input</div>
        <TaskInputForm taskNum={taskNum} />
      </div>

      {/* Outputs */}
      <div className="glass-card p-6 mb-6">
        <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Expected Outputs</div>
        <div className="space-y-2">
          {task.outputs.map((o, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <FileText size={14} className="text-[#B4F052] flex-shrink-0" />
              <span className="text-white/70">{o}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-4">
          {!done ? (
            <button onClick={handleComplete} className="glass-button px-6 py-2.5 text-sm animate-pulse-glow flex items-center gap-2">
              <Check size={14} /> Mark as Complete (+10pts)
            </button>
          ) : (
            <div className="text-sm text-[#B4F052] font-semibold flex items-center gap-2"><Check size={14} /> Task Completed</div>
          )}
        </div>
      </div>

      {/* AI Roles */}
      <div className="glass-card p-6 mb-6">
        <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Recommended AI Roles</div>
        <div className="flex flex-wrap gap-2">
          {task.aiRoles.map(r => {
            const roleData = AI_ROLES.find(x => x.id === r.toLowerCase());
            const Icon = roleData?.icon;
            return (
              <span key={r} className="text-xs px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/60 flex items-center gap-1.5">
                {Icon && <Icon size={12} />}
                {roleData?.label || r}
              </span>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between py-6">
        {prev ? (
          <Link href={`/tasks/${prev.number}`} className="flex items-center gap-2 text-sm text-white/40 hover:text-[#B4F052] transition-colors">
            <ChevronLeft size={16} /><span>Task {prev.number}: {prev.title}</span>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/tasks/${next.number}`} className="flex items-center gap-2 text-sm text-white/40 hover:text-[#B4F052] transition-colors">
            <span>Task {next.number}: {next.title}</span><ChevronRight size={16} />
          </Link>
        ) : <div />}
      </div>

      {/* AI Panel */}
      <AIMentorPanel taskNum={taskNum} taskTitle={task.title} />
    </div>
  );
}
