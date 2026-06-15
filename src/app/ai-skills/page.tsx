'use client';
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  ArrowUpRight, 
  Zap, 
  Target, 
  Award, 
  Brain, 
  Cpu, 
  Rocket, 
  CheckCircle2, 
  ArrowRight,
  Play
} from 'lucide-react';

export default function AISkillsPage() {
  const learningPaths = [
    {
      level: 'Beginner',
      title: 'AI Fundamentals for Founders',
      desc: 'Start here if you want to understand how AI works, how to use it safely, and how to apply it to your daily work as a founder.',
      recommendedFor: [
        'First-time AI users',
        'Early-stage founders',
        'Solo entrepreneurs',
        'People who want to build confidence with AI'
      ],
      linkText: 'CampusAI Basic Trainings',
      linkUrl: 'https://campus.ai',
      icon: Brain,
      color: '#10b981', // Emerald
      bgLight: 'rgba(16, 185, 129, 0.08)',
      borderLight: 'rgba(16, 185, 129, 0.2)'
    },
    {
      level: 'Intermediate',
      title: 'Prompting, Agents & Workflow Automation',
      desc: 'Once you understand the basics, learn how to create better prompts, structure tasks, automate repeated work, and use AI agents to support your startup operations.',
      recommendedFor: [
        'Founders already using AI tools',
        'People building repeatable workflows',
        'Operators who want to save time',
        'Startup teams looking for automation'
      ],
      linkText: 'CampusAI Intermediate Trainings',
      linkUrl: 'https://campus.ai',
      icon: Cpu,
      color: '#f59e0b', // Amber
      bgLight: 'rgba(245, 158, 11, 0.08)',
      borderLight: 'rgba(245, 158, 11, 0.2)'
    },
    {
      level: 'Advanced',
      title: 'AI-Native Product Building',
      desc: 'This path is for founders who want to build products, services, MVPs, internal tools, or full startup systems with AI as a core layer.',
      recommendedFor: [
        'Product builders',
        'Technical and non-technical founders',
        'Startup teams building MVPs',
        'People designing AI-native business models'
      ],
      linkText: 'CampusAI Advanced Trainings',
      linkUrl: 'https://campus.ai',
      icon: Rocket,
      color: '#ec4899', // Pink
      bgLight: 'rgba(236, 72, 153, 0.08)',
      borderLight: 'rgba(236, 72, 153, 0.2)'
    }
  ];

  const aiRoles = [
    { name: 'Thinking Partner', desc: 'Brainstorm strategy, iterate on design ideas, and challenge business assumptions.' },
    { name: 'Research Assistant', desc: 'Extract market intelligence, analyze competitor data, and summarize papers.' },
    { name: 'Product Co-builder', desc: 'Accelerate coding, prototype user interfaces, and outline technical scope.' },
    { name: 'Marketing Support', desc: 'Draft copy, generate assets, and plan search engine optimization strategies.' },
    { name: 'Automation Layer', desc: 'Eliminate tedious manual tasks and coordinate backend integrations.' },
    { name: 'Strategic Advisor', desc: 'Analyze pricing models, model unit economics, and prepare investor pitches.' }
  ];

  const benefits = [
    'Validate ideas faster.',
    'Understand customers faster.',
    'Create prototypes faster.',
    'Prepare better pitches faster.',
    'Automate more of your daily work.',
    'Build with a level of leverage that was impossible just a few years ago.'
  ];

  return (
    <div className="max-w-6xl mx-auto pb-16 px-4 animate-fade-in space-y-12">
      
      {/* 1. Header Banner Section */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-[#B4F052]/20 glass-card p-8 md:p-12 shadow-[0_0_80px_rgba(180,240,82,0.05)]">
        <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-[#B4F052]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-50%] left-[-10%] w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4F052]/10 border border-[#B4F052]/20 text-xs font-semibold text-[#B4F052] w-fit">
            <Sparkles size={12} className="animate-pulse" />
            <span>AI SKILLS FOUNDATION</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight uppercase">
            Learn AI. Move Faster.<br />
            <span className="text-[#B4F052]">Build Like a OnePerson Unicorn.</span>
          </h1>
          
          <div className="h-[2px] w-24 bg-[#B4F052] my-4" />
          
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            The OnePerson Unicorn concept is simple: one ambitious founder, supported by AI, agents, automation, and the right operating system, can do things that used to require a full team.
          </p>
        </div>
      </div>

      {/* 2. Core Philosophy Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 border-white/[0.06] hover:border-white/10 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#B4F052]/15 border border-[#B4F052]/20 flex items-center justify-center text-[#B4F052]">
              <Target size={24} />
            </div>
            <h2 className="text-xl font-extrabold text-white">Speed Alone is Not Enough</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Speed does not come from tools alone. It comes from knowing how to use intelligence properly.
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              AI can help you research markets, build products, write content, test ideas, automate operations, prepare investor materials, create prototypes, and make better decisions faster.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/[0.04] text-[#B4F052] font-semibold text-xs flex items-center gap-1.5">
            <span>Every task becomes easier, faster, and more scalable</span>
            <ArrowRight size={14} />
          </div>
        </div>

        <div className="glass-card p-8 border-white/[0.06] hover:border-white/10 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Award size={24} />
            </div>
            <h2 className="text-xl font-extrabold text-white">The New Foundation</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              If you learn how to work with AI, every aspect of your startup journey shifts. That is why AI skills are not optional anymore.
            </p>
            <p className="text-[#B4F052] font-bold text-sm bg-[#B4F052]/10 border border-[#B4F052]/25 p-3 rounded-xl leading-relaxed">
              They are the core foundation of building a modern company.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/[0.04] text-white/40 text-xs">
            Powered by CampusAI partnership
          </div>
        </div>
      </div>

      {/* 3. Start From the Fundamentals Section */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl font-black uppercase text-white tracking-tight">Start From the Fundamentals</h2>
          <p className="text-white/60 text-xs md:text-sm leading-relaxed">
            If you do not yet feel confident using AI, start with the basics. 
            <span className="text-white font-bold"> You do not need to be technical. You do not need to know how to code.</span> You need to understand how to think, communicate, and collaborate with AI systems.
          </p>
          <div className="inline-block px-3 py-1 bg-white/[0.04] border border-white/[0.08] rounded-full text-[10px] text-white/50 font-medium">
            CampusAI will help you build these skills step by step:
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiRoles.map((role, idx) => (
            <div 
              key={idx} 
              className="glass-card p-5 border-white/[0.04] hover:border-[#B4F052]/20 hover:scale-[1.01] transition-all group duration-300"
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#B4F052]/10 text-[#B4F052] flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-white group-hover:text-[#B4F052] transition-colors">
                  {role.name}
                </h3>
              </div>
              <p className="text-white/50 text-[11px] leading-relaxed">
                {role.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Recommended Learning Paths Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4">
          <GraduationCap className="text-[#B4F052]" size={22} />
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">Recommended Learning Paths</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {learningPaths.map((path, idx) => {
            const PathIcon = path.icon;
            return (
              <div 
                key={idx}
                className="glass-card p-6 flex flex-col justify-between relative overflow-hidden border-white/[0.05] hover:border-white/20 transition-all duration-300 group"
              >
                {/* Level Accent Bar */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-[4px]" 
                  style={{ backgroundColor: path.color }}
                />

                <div className="space-y-5">
                  {/* Path Header */}
                  <div className="flex items-center justify-between">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase border"
                      style={{ color: path.color, backgroundColor: path.bgLight, borderColor: path.borderLight }}
                    >
                      {path.level}
                    </span>
                    <div 
                      className="p-2 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: path.bgLight, color: path.color }}
                    >
                      <PathIcon size={18} />
                    </div>
                  </div>

                  {/* Path Title */}
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-white group-hover:text-[#B4F052] transition-colors duration-200 leading-snug">
                      {path.title}
                    </h3>
                    <p className="text-white/50 text-xs leading-relaxed min-h-[64px]">
                      {path.desc}
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2 pt-4 border-t border-white/[0.04]">
                    <div className="text-[10px] text-white/30 uppercase font-bold tracking-wider">Recommended for:</div>
                    <ul className="space-y-1.5">
                      {path.recommendedFor.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2 text-white/70 text-xs">
                          <CheckCircle2 size={12} className="text-[#B4F052] mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Path CTA Link */}
                <div className="mt-6 pt-4 border-t border-white/[0.04]">
                  <a 
                    href={path.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-white/[0.02] hover:bg-[#B4F052] text-white hover:text-black border border-white/[0.08] hover:border-transparent rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 group/btn"
                  >
                    <span>{path.linkText}</span>
                    <ArrowUpRight size={13} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Why This Matters Section */}
      <div className="glass-card p-8 md:p-10 border-white/[0.06] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B4F052]/3 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#B4F052]/10 border border-[#B4F052]/20 text-[10px] font-bold text-[#B4F052] w-fit uppercase">
              Leverage
            </div>
            <h2 className="text-2xl font-black uppercase text-white tracking-tight leading-none">Why This Matters</h2>
            <p className="text-white/60 text-xs md:text-sm leading-relaxed">
              In the OnePerson Unicorn Garage, every task is designed to help you move from idea to real company. AI skills help you complete these tasks faster and build with incredible leverage.
            </p>
            <div className="p-4 rounded-xl bg-black border border-white/[0.08] mt-2">
              <p className="text-white/80 text-xs font-semibold leading-relaxed">
                "The goal is not to replace you. <br />
                <span className="text-[#B4F052] font-extrabold">The goal is to make you a much more capable founder.</span>"
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl hover:border-white/10 transition-colors"
              >
                <div className="p-1 rounded bg-[#B4F052]/15 text-[#B4F052] flex-shrink-0">
                  <Zap size={12} className="animate-pulse" />
                </div>
                <span className="text-white/80 text-xs font-semibold leading-snug">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Your Next Step Call to Action Section */}
      <div className="text-center py-6 max-w-xl mx-auto space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">Your Next Step</h2>
          <p className="text-white/50 text-xs leading-relaxed">
            Start learning the AI skills that will help you build your startup faster. Choose your level and begin with the training path that fits you best.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="https://campus.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#B4F052] text-black font-extrabold rounded-xl text-xs hover:opacity-95 shadow-lg shadow-[#B4F052]/10 hover:shadow-[#B4F052]/20 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase font-bold"
          >
            <Play size={12} className="fill-black animate-pulse" />
            <span>Start Learning with CampusAI</span>
          </a>
          
          <a 
            href="https://campus.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 bg-white/[0.03] hover:bg-white/[0.06] text-white hover:text-[#B4F052] border border-white/[0.08] hover:border-white/20 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase"
          >
            <span>Explore AI Skills Roadmap</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>

    </div>
  );
}
