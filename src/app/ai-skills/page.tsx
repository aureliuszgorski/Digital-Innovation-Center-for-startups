'use client';
import { Sparkles, BookOpen, GraduationCap, ArrowRight, Zap, Target, Award } from 'lucide-react';

export default function AISkillsPage() {
  const recommendedCourses = [
    {
      id: 'course-1',
      title: 'Prompt Engineering for Founders',
      duration: '2 hours',
      level: 'Beginner',
      desc: 'Learn how to communicate effectively with large language models, construct structured output prompts, and design custom instructions for your startup ideas.'
    },
    {
      id: 'course-2',
      title: 'Agentic Workflow Automation',
      duration: '4 hours',
      level: 'Intermediate',
      desc: 'Understand how to orchestrate multiple autonomous AI agents in a sequence to execute complex tasks like market research, copy drafting, and compliance auditing.'
    },
    {
      id: 'course-3',
      title: 'AI Product Scoping & Low-Code MVPs',
      duration: '3 hours',
      level: 'Advanced',
      desc: 'Master the art of integrating AI features into your web applications and launching functional MVPs with low-code and no-code tools rapidly.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="relative w-full h-[240px] rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl mb-8 flex flex-col justify-end p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/20 via-transparent to-transparent z-10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B4F052]/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-25 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4F052]/10 border border-[#B4F052]/20 text-xs font-semibold text-[#B4F052] w-fit">
            <Sparkles size={12} className="animate-pulse" />
            <span>AI COMPETENCY ACCELERATOR</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-none">
            Rozwijaj Swoje Kompetencje AI
          </h1>
          <p className="text-xs md:text-sm text-white/75 max-w-xl">
            Developing your AI skills is the fastest way to automate operations, ship products, and scale your startup cockpit.
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Zap size={20} />
          </div>
          <h3 className="font-bold text-white text-sm">Szybsza Realizacja</h3>
          <p className="text-white/50 text-xs leading-relaxed">
            Poszerzanie wiedzy o sztucznej inteligencji pozwala szybciej przechodzić przez kolejne etapy i zadania w programie.
          </p>
        </div>

        <div className="glass-card p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#B4F052]/10 flex items-center justify-center text-[#B4F052]">
            <Target size={20} />
          </div>
          <h3 className="font-bold text-white text-sm">Automatyzacja Pracy</h3>
          <p className="text-white/50 text-xs leading-relaxed">
            Zamiast robić wszystko ręcznie, nauczysz się delegować zadania do wirtualnych agentów AI w Twoim startupie.
          </p>
        </div>

        <div className="glass-card p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Award size={20} />
          </div>
          <h3 className="font-bold text-white text-sm">Lepsze Wyniki (MVP)</h3>
          <p className="text-white/50 text-xs leading-relaxed">
            Zdobędziesz praktyczne umiejętności, które przełożą się bezpośrednio na jakość Twojego produktu i skuteczność prezentacji.
          </p>
        </div>
      </div>

      {/* Recommended Courses Title */}
      <div className="space-y-2 mb-6 border-b border-white/[0.08] pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <GraduationCap size={20} className="text-[#B4F052]" />
          <span>Rekomendowane Szkolenia i Kursy</span>
        </h2>
        <p className="text-xs text-white/50">
          Poniżej znajduje się lista szkoleń rekomendowanych przez mentorów Digital Innovation Center for Startups @ District.org (szczegółowa lista zostanie udostępniona wkrótce).
        </p>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {recommendedCourses.map(course => (
          <div 
            key={course.id}
            className="glass-card p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden group hover:border-[#B4F052]/30 duration-300"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-sm text-white group-hover:text-[#B4F052] transition-colors">
                  {course.title}
                </h3>
                <span className="text-[9px] font-mono text-white/40 border border-white/[0.08] px-1.5 py-0.5 rounded">
                  {course.duration}
                </span>
                <span className="text-[9px] font-mono text-[#B4F052] bg-[#B4F052]/10 border border-[#B4F052]/20 px-1.5 py-0.5 rounded">
                  {course.level}
                </span>
              </div>
              <p className="text-white/50 text-xs leading-relaxed max-w-2xl">
                {course.desc}
              </p>
            </div>
            <button 
              disabled
              className="opacity-50 text-[10px] font-bold text-white border border-white/10 px-3 py-1.5 rounded-lg whitespace-nowrap"
            >
              Coming Soon
            </button>
          </div>
        ))}
      </div>

      {/* Info Warning */}
      <div className="mt-8 bg-white/[0.02] border border-white/[0.06] p-4 rounded-2xl flex items-start gap-3">
        <BookOpen className="text-white/40 flex-shrink-0 mt-0.5" size={16} />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white/70">Więcej materiałów wkrótce</h4>
          <p className="text-[11px] text-white/40 leading-normal">
            Pełny sylabus szkoleń, interaktywne testy wiedzy oraz linki do zewnętrznych platform edukacyjnych zostaną zaktualizowane w następnej wersji panelu.
          </p>
        </div>
      </div>
    </div>
  );
}
