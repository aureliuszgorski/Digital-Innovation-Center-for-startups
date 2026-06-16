'use client';
import { useState, useRef, useEffect } from 'react';
import { useGarage } from '@/context/GarageContext';
import { 
  Brain, BarChart3, Swords, Microscope, PenTool, ClipboardList, Code2, 
  Sparkles, Send, ArrowLeft, ChevronRight, Check, Target, Info,
  Users, Coins, Compass, PhoneCall, LineChart, Shield, Wallet, Cpu, Database, MapPin,
  HelpCircle, type LucideIcon
} from 'lucide-react';

interface TeamMember {
  id: string;
  locationId: string;
  locationName: string;
  label: string;
  name: string;
  icon: LucideIcon;
  color: string;
  story: string;
  goTo: string[];
  cta: string;
  desc: string;
  quote: string;
  personality: string;
  biography: string;
  skills: string[];
  whenToConsult: string;
}


const TEAM_ROLES: TeamMember[] = [
  { 
    id: 'mentor', 
    locationId: 'window',
    locationName: 'Window Table',
    label: 'The Mentor by the Window', 
    name: 'Marcus',
    icon: Brain, 
    color: '#10b981', 
    story: 'Marcus sits by the window with black coffee and an old notebook. He helps founders slow down, choose priorities and make better decisions.',
    goTo: [
      'you feel overwhelmed',
      'you need strategic clarity',
      'you need to choose priorities',
      'you want a plan for the next sprint'
    ],
    cta: 'Talk to Marcus',
    desc: 'Experienced mentor from the coworking space. Helps you see the bigger picture, select priorities, and make difficult decisions.',
    quote: "Let's pause for a second. What actually is the most important thing here?",
    personality: 'Calm, experienced, slightly dry but very supportive. Never panics, avoids motivational slogans, and helps you find your direction.',
    biography: 'Marcus always sits at the window table with an old notebook, black coffee, and the calm expression of someone who has seen dozens of startup crises. He is the mentor you go to when you have too many ideas, too little time, and don\'t know what really matters.',
    skills: ['Strategic planning', 'De-cluttering chaos', 'Prioritization', 'Weekly/sprint planning', 'Focus retention'],
    whenToConsult: 'Talk to Marcus when you feel overwhelmed, need feedback on your roadmap, or need to regain focus.'
  },
  { 
    id: 'analyst', 
    locationId: 'numbers',
    locationName: 'Numbers Desk',
    label: 'The Numbers Person', 
    name: 'Elena',
    icon: BarChart3, 
    color: '#3b82f6', 
    story: 'Elena sits at the numbers desk analyzing market metrics. She checks if your business concept has actual customer demand and a path to scalability.',
    goTo: [
      'you want to size your market potential',
      'you need business model logic validation',
      'you want to run KPI checks and metrics setup'
    ],
    cta: 'Analyze with Elena',
    desc: 'Coworking analyst. Helps you verify numbers, market sizing, KPIs, and the realistic potential of your startup.',
    quote: "Let's put it in numbers. Without that, we're just guessing.",
    personality: 'Precise, analytical, concrete. Ruthless towards generalizations, but incredibly helpful when you want to understand if a concept has business potential.',
    biography: 'Elena\'s desk is full of charts, spreadsheets, and sticky notes. She believes that a startup cannot be built on wishful thinking, and is always the first to ask for hard numbers and concrete market sizing.',
    skills: ['Market sizing', 'Competitor analysis', 'Business model verification', 'KPI assessment', 'Financial modeling', 'Assumption testing'],
    whenToConsult: 'Talk to Elena when you need to calculate market potential, score your business options, or define startup KPIs.'
  },
  { 
    id: 'marta', 
    locationId: 'numbers',
    locationName: 'Numbers Desk',
    label: 'The Startup CFO', 
    name: 'Marta',
    icon: Wallet, 
    color: '#14b8a6', 
    story: 'Marta organizes spreadsheets and monitors financial health. She helps founders figure out their exact runway, burn rate, and hiring budget.',
    goTo: [
      'you need to calculate runway or burn rate',
      'you want to build scenario spreadsheets',
      'you need to plan a budget for your next hires'
    ],
    cta: 'Review finances with Marta',
    desc: 'Startup CFO from the coworking space. Helps you manage runway, burn rate, budgeting, financial scenarios, and cost planning.',
    quote: "You don't have to know all the answers. But you must know how much time you have.",
    personality: 'Calm, objective, precise. Does not judge. Organizes finances so the founder can make decisions clearly.',
    biography: 'Marta has the cleanest desk. No chaos, just one spreadsheet, one notebook, and one question: "How many months of runway does the company have left?" She makes financial planning clear.',
    skills: ['Runway calculation', 'Burn rate analysis', 'Financial planning', 'Scenario building', 'Cost planning', 'Use of funds', 'Hiring budget'],
    whenToConsult: 'Consult Marta to analyze your cash flow, plan hiring budgets, or build financial forecasts.'
  },
  { 
    id: 'sparring', 
    locationId: 'bench',
    locationName: 'Founder Bench',
    label: 'The Founder Next Door', 
    name: 'Victor',
    icon: Swords, 
    color: '#ef4444', 
    story: 'Victor is building his own startup two desks away. He started earlier, made painful mistakes already, and will tell you what the market will probably tell you later.',
    goTo: [
      'you want to stress-test your idea',
      'you need hard, unfiltered feedback',
      'you are preparing for a pitch',
      'you want to find weak assumptions'
    ],
    cta: 'Spar with Victor',
    desc: 'Founder from the next desk. He runs a similar startup, just started earlier, and stress-tests your ideas before the market does.',
    quote: "Okay, now let's assume this completely fails. Why did it happen?",
    personality: 'Direct, fast-paced, slightly provocative. Loves to challenge assumptions. His style is "I will tell you now so that a customer doesn\'t tell you later, but worse".',
    biography: 'Victor sits two desks away. He has already gone through the first demos, first clients, first rejections, and first painful pivots. He is not a classic consultant but a sparring partner who knows where the market hits hardest.',
    skills: ['Challenging assumptions', 'Finding weak points', 'Pitch preparation', 'Market criticism prep', 'Exposing self-delusions'],
    whenToConsult: 'Consult Victor before making key product or strategy decisions to stress-test them.'
  },
  { 
    id: 'richard', 
    locationId: 'bench',
    locationName: 'Founder Bench',
    label: 'The Boardroom Voice', 
    name: 'Richard',
    icon: Shield, 
    color: '#b91c1c', 
    story: 'Richard looks at early startups with the critical eyes of an investor and board member. He asks hard questions about runway, risks, and founder accountability.',
    goTo: [
      'you want to assess key operational risks',
      'you are preparing for a board review',
      'you want to pivot or make serious decisions'
    ],
    cta: 'Review with Richard',
    desc: 'A voice from the boardroom. Helps you look at your startup like an investor, a board member, and the person responsible for the survival of the company.',
    quote: "What could kill this company in the next three months?",
    personality: 'Cool, calm, highly demanding. Speaks rarely but hits the nail on the head.',
    biography: 'Richard appears in the coworking space every now and then when founders need to make serious decisions. His questions help avoid expensive mistakes. He looks at runway, risks, and founder accountability.',
    skills: ['Board reviews', 'Risk analysis', 'Decision making', 'Runway assessment', 'Decision memos', 'Strategy testing', 'Founder accountability'],
    whenToConsult: 'Talk to Richard when you need to make difficult pivots, review financial runways, or structure governance.'
  },
  { 
    id: 'researcher', 
    locationId: 'nook',
    locationName: 'Research Nook',
    label: 'The Research Desk', 
    name: 'Sarah',
    icon: Microscope, 
    color: '#a855f7', 
    story: 'Sarah sits in the quietest corner of the coworking space surrounded by maps and competitor research. She helps you identify market gaps and trends.',
    goTo: [
      'you want to map the competitive landscape',
      'you need trend analysis or benchmarks',
      'you are starting a new product stage'
    ],
    cta: 'Research with Sarah',
    desc: 'Researcher from the quiet corner. Helps you understand the market, trends, competitors, and industry benchmarks.',
    quote: "Before we start building, let's see who has already tried to do this.",
    personality: 'Curious, calm, inquisitive. Loves digging into the second and third layers of information. Never settles for the first search result.',
    biography: 'Sarah sits in the quietest corner of the coworking space with open reports and market maps. She acts as a human market radar, always ready to deliver competitive landscape insights and trend maps.',
    skills: ['Market research', 'Competitor mapping', 'Trend analysis', 'Benchmarks search', 'Inspiration gathering', 'Category mapping'],
    whenToConsult: 'Go to Sarah when starting a new product stage, researching competitors, or mapping your market.'
  },
  { 
    id: 'nina', 
    locationId: 'nook',
    locationName: 'Research Nook',
    label: 'The Data Strategist', 
    name: 'Nina',
    icon: Database, 
    color: '#3b82f6', 
    story: 'Nina helps you design tracking, metrics, and data systems. She makes sure you build products that gather the right data for a long-term data moat.',
    goTo: [
      'you need to design tracking plans',
      'you want to structure product metrics',
      'you want to plan data strategies for AI products'
    ],
    cta: 'Plan data with Nina',
    desc: 'Data strategist. Helps design tracking, metrics, dashboards, and data needed to build AI products.',
    quote: "If we don't measure it, we won't be able to improve it later.",
    personality: 'Systemic, analytical, attentive. Thinks long-term. Hates random data collection.',
    biography: 'Nina asks about data before everyone starts talking about AI. She believes most startups want to build intelligent products but don\'t know what data they collect, why they collect it, or how they will use it to build a data moat.',
    skills: ['Data strategy', 'Tracking plans', 'Product metrics', 'Dashboard design', 'AI readiness', 'Data moat definition', 'User events tracking'],
    whenToConsult: 'Consult Nina when designing product analytics, setting up KPI dashboards, or structuring AI data moats.'
  },
  { 
    id: 'copywriter', 
    locationId: 'table',
    locationName: 'Shared Table',
    label: 'The Copy Table', 
    name: 'Chloe',
    icon: PenTool, 
    color: '#f59e0b', 
    story: 'Chloe helps founders turn messy descriptions into clear landing pages, taglines, cold emails, and posts that regular people understand.',
    goTo: [
      'you need a punchy tagline or headline',
      'you are writing landing page copy',
      'you want to draft a cold outreach email'
    ],
    cta: 'Write with Chloe',
    desc: 'Copywriter at the shared table. Helps you turn chaos into clear landing pages, taglines, cold emails, and posts.',
    quote: "Let's say it in a way that a normal person can understand in five seconds.",
    personality: 'Creative, fast, concrete. Impatient with buzzwords. In love with simple, direct language.',
    biography: 'Chloe sits at the shared table where everyone asks her for help explaining their product. She transforms long, chaotic explanations into crisp sentences that clearly explain the business value.',
    skills: ['Landing page copy', 'Tagline generation', 'Communication alignment', 'Cold email writing', 'Post drafting', 'Product simplification', 'Founder story'],
    whenToConsult: 'Talk to Chloe when writing copy, landing pages, cold pitches, or taglines.'
  },
  { 
    id: 'nora', 
    locationId: 'table',
    locationName: 'Shared Table',
    label: 'The Brand Strategist on the Sofa', 
    name: 'Nora',
    icon: Compass, 
    color: '#8b5cf6', 
    story: 'Nora sits on the common area sofa drinking tea, helping founders discover their category, clear market positioning, and brand narrative.',
    goTo: [
      'you want to define your category',
      'you need a brand story framework',
      'you want to craft unique positioning'
    ],
    cta: 'Shape brand with Nora',
    desc: 'Brand strategist from the coworking sofa. Helps define positioning, category, brand narrative, and key differentiators.',
    quote: "The problem is not in the text. The problem is you don't know what category you are building yet.",
    personality: 'Creative, strategic, calm, slightly mysterious. Spots patterns much faster than others.',
    biography: 'Nora sits on the common area sofa. She seems to just drink tea, but she can drop a single sentence that sets the entire branding direction. She helps you understand who you are on the market and why people should care.',
    skills: ['Positioning', 'Category design', 'Brand narrative', 'Nomenclature / naming', 'Tone of voice', 'Differentiators', 'Company story'],
    whenToConsult: 'Talk to Nora when crafting your positioning, brand story, or market messaging.'
  },
  { 
    id: 'pm', 
    locationId: 'wall',
    locationName: 'Product Wall',
    label: 'The Post-it PM', 
    name: 'David',
    icon: ClipboardList, 
    color: '#ec4899', 
    story: 'David stands by the sticky note wall mapping out user stories. He is obsessed with cutting product scope down to a simple, functional MVP.',
    goTo: [
      'you need to define your MVP scope',
      'you want to prioritize your roadmap',
      'you want to plan a sprint'
    ],
    cta: 'Plan with David',
    desc: 'Experienced PM. Helps you turn a massive vision into a simple MVP, clear roadmap, structured backlog, and sprints.',
    quote: "That can be a vision for later. For now, let's find the smallest version that actually works.",
    personality: 'Practical, organized, patient. Obsessed with MVPs and clean, simple user journeys.',
    biography: 'David always has a pack of colored sticky notes with him. He prevents founders from over-scoping their first versions, saving them from building too much too early.',
    skills: ['MVP definition', 'Roadmap planning', 'User story mapping', 'Backlog creation', 'Feature prioritization', 'User journey mapping', 'Sprint planning'],
    whenToConsult: 'Talk to David when you need to scope your MVP, write user stories, or plan a sprint.'
  },
  { 
    id: 'maya', 
    locationId: 'wall',
    locationName: 'Product Wall',
    label: 'The Customer Whisperer', 
    name: 'Maya',
    icon: Users, 
    color: '#f43f5e', 
    story: 'Maya is always near the coffee machine, pushing founders to talk to users. She helps you design interviews that validate real demand.',
    goTo: [
      'you need to validate your idea',
      'you are preparing discovery questions',
      'you need to draft interview scripts'
    ],
    cta: 'Validate with Maya',
    desc: 'Customer validation expert. Helps you verify if the problem really exists and if users are willing to pay for the solution.',
    quote: "Don't ask if they like it. Ask how they are solving this problem today.",
    personality: 'Empathetic, attentive, highly inquisitive. Warm in conversation but tough on false validation.',
    biography: 'Maya spends half her day talking to users. If a founder sits at their desk for too long without talking to a customer, Maya will grab them by the coffee machine and ask: "Who did you talk to today?"',
    skills: ['Customer interviews', 'Discovery questions', 'Segment selection', 'Feedback analysis', 'Spotting real demand', 'Willingness-to-pay checks'],
    whenToConsult: 'Consult Maya to prepare customer interviews, discovery questions, and validate user interest.'
  },
  { 
    id: 'bruno', 
    locationId: 'wall',
    locationName: 'Product Wall',
    label: 'The Business Model Guy', 
    name: 'Bruno',
    icon: Coins, 
    color: '#eab308', 
    story: 'Bruno designs business models and monetization tiers. He checks who is actually going to pay and whether the numbers add up.',
    goTo: [
      'you need to choose a monetization model',
      'you want to test pricing options',
      'you need help with B2B pricing packages'
    ],
    cta: 'Design model with Bruno',
    desc: 'Business model strategist. Helps you find who pays, what they pay for, and how to turn an idea into a sustainable business.',
    quote: "A user is not always a customer. Who is actually paying here?",
    personality: 'Pragmatic, metrics-driven, slightly provocative. Prefers simple models and fast monetization tests.',
    biography: 'Bruno sits at a small table with a sheet of paper. When you explain your product, he draws three monetization models and asks: "These are three different businesses. Which one are you building?"',
    skills: ['Business model design', 'Pricing strategy', 'Packaging', 'Monetization analysis', 'Unit economics', 'B2B/B2C strategy', 'Initial offer design'],
    whenToConsult: 'Talk to Bruno when designing your business model, pricing, or B2B sales strategy.'
  },
  { 
    id: 'sofia', 
    locationId: 'whiteboard',
    locationName: 'Whiteboard Zone',
    label: 'The Sales Closer', 
    name: 'Sofia',
    icon: PhoneCall, 
    color: '#10b981', 
    story: 'Sofia is always between calls. She believes most founders wait too long before selling. Her job is to get you in front of customers before the product becomes another excuse.',
    goTo: [
      'you need first customers',
      'you want to write outbound templates',
      'you need a sales script',
      'you are preparing a demo'
    ],
    cta: 'Sell with Sofia',
    desc: 'Sales coach from the coworking space. Helps you acquire first clients, write outbound copy, run demos, and close sales.',
    quote: "Let's send this to 20 clients and see what happens.",
    personality: 'Dynamic, direct, highly practical. Energetic but never pushy. Teaches sales with clarity and confidence.',
    biography: 'Sofia is always either finishing a sales call or preparing for one. When a founder says "I\'m not ready to sell yet," Sofia smiles and says "The market might not be ready to wait either." She pushes you to get out there.',
    skills: ['Cold emailing', 'Sales scripting', 'Demo preparation', 'Offer building', 'Follow-up design', 'Discovery calls', 'Pipeline organization'],
    whenToConsult: 'Talk to Sofia when you need to write outbound messages, script a sales demo, or close your first customers.'
  },
  { 
    id: 'leo', 
    locationId: 'whiteboard',
    locationName: 'Whiteboard Zone',
    label: 'The Growth Whiteboard', 
    name: 'Leo',
    icon: LineChart, 
    color: '#f97316', 
    story: 'Leo stands at the whiteboard drawing funnels and growth loops. He designs rapid, low-budget marketing experiments to find early traction.',
    goTo: [
      'you want to plan acquisition channels',
      'you need to build user funnels',
      'you want to design growth experiments'
    ],
    cta: 'Grow with Leo',
    desc: 'Growth strategist at the whiteboard. Helps design experiments, customer acquisition channels, funnels, and early traction.',
    quote: "Let's not guess. Let's run a small test in seven days.",
    personality: 'Fast-paced, experimental, creative, slightly chaotic but highly effective at finding early traction.',
    biography: 'Leo is always at the whiteboard drawing funnels, channels, experiments, and growth loops. He does not believe in six-month marketing plans without market contact; he believes in fast testing.',
    skills: ['Growth experiments', 'Channel selection', 'Funnel building', 'Landing page testing', 'Content planning', 'Referral loops', 'Activation & retention'],
    whenToConsult: 'Go to Leo to design quick growth hacks, plan traffic channels, or structure acquisition funnels.'
  },
  { 
    id: 'emma', 
    locationId: 'whiteboard',
    locationName: 'Whiteboard Zone',
    label: 'The Community Host', 
    name: 'Emma',
    icon: Users, 
    color: '#06b6d4', 
    story: 'Emma knows everyone. She helps you design user rituals, community onboarding flows, and ambassador programs that turn users into advocates.',
    goTo: [
      'you want to build a product community',
      'you need to establish user onboarding rituals',
      'you want to design ambassador perks'
    ],
    cta: 'Build community with Emma',
    desc: 'Community host of the coworking. Helps build community, rituals, engagement, and ambassador programs.',
    quote: "People don't return to platforms. They return to people, rituals, and a sense of belonging.",
    personality: 'Warm, relational, attentive, yet highly systematic. Views community as a living organism.',
    biography: 'Emma knows everyone. She knows what you are working on, who you should meet, and who can help you. For Emma, a community is not a Discord channel, but relations, status, and connection.',
    skills: ['Community strategy', 'Onboarding design', 'Ritual creation', 'Event planning', 'Ambassador programs', 'Member activation', 'Product-led community'],
    whenToConsult: 'Consult Emma when designing a community around your product, establishing user rituals, or launching ambassador programs.'
  },
  { 
    id: 'cto', 
    locationId: 'build',
    locationName: 'Build Corner',
    label: 'The Freelance CTO in the Corner', 
    name: 'Alex',
    icon: Code2, 
    color: '#06b6d4', 
    story: "Alex usually works with headphones on. He says little, but when he hears a founder choosing the wrong tech stack, he turns around and quietly says: 'Don't do that to yourself.'",
    goTo: [
      'you need a tech stack',
      'you are planning MVP architecture',
      'you are talking to developers',
      'you want to avoid over-engineering'
    ],
    cta: 'Ask Alex',
    desc: 'Freelance CTO from the corner desk. Helps you choose a stack, design your architecture, and avoid over-engineering.',
    quote: "We can do this simpler. And we probably should.",
    personality: 'Quiet, technical, slightly sarcastic but highly supportive. Has a strong allergy to over-engineering.',
    biography: 'Alex sits in the corner, usually in headphones. But when he hears a discussion about a bad tech stack, he turns his chair around to save you from burning time and money. He believes the best stack is the one that delivers value fast.',
    skills: ['Stack selection', 'Architecture design', 'Feasibility checks', 'Technical MVP planning', 'No-code / low-code strategy', 'Technical risk management', 'Developer communication'],
    whenToConsult: 'Go to Alex before choosing tools, designing databases, or scaling infrastructure.'
  },
  { 
    id: 'kai', 
    locationId: 'build',
    locationName: 'Build Corner',
    label: 'The Automation Guy', 
    name: 'Kai',
    icon: Cpu, 
    color: '#f43f5e', 
    story: 'Kai has too many tools open and somehow all of them are connected. If you do the same task manually three times, he will try to turn it into a workflow.',
    goTo: [
      'you repeat the same task too often',
      'you want to build AI workflows',
      'you need automation',
      'you want to act like a bigger team'
    ],
    cta: 'Automate with Kai',
    desc: 'Automation builder from the coworking space. Helps turn repetitive tasks into AI workflows, agents, and systems of work.',
    quote: "This is not a task. This is a process that needs to be turned into a system.",
    personality: 'Experimental, fast, technical, hacker-minded. Always looks for a smart shortcut to build leverage.',
    biography: 'Kai has a desk full of cables, open tools, and automations he built over the weekend. If you do something manually for the third time, Kai will ask: "Why isn\'t this a workflow?" He helps you work like a larger team.',
    skills: ['AI workflows', 'Automation design', 'Prompt engineering', 'Tool integration', 'Agent setup', 'Research/ops automation', 'Founder operating system'],
    whenToConsult: 'Go to Kai when you want to automate operations, content workflows, or set up automated research.'
  },
  { 
    id: 'orion', 
    locationId: 'build',
    locationName: 'Build Corner',
    label: 'The Agent Architect', 
    name: 'Orion',
    icon: Cpu, 
    color: '#a855f7', 
    story: 'Orion designs multi-agent workflows, digital coworkers, custom prompt sequences, and validation guardrails.',
    goTo: [
      'you want to design multi-agent workflows',
      'you need to set up digital coworkers',
      'you want to build human-in-the-loop guardrails'
    ],
    cta: 'Design agents with Orion',
    desc: 'AI agent architect. Helps design digital coworkers, multi-agent workflows, memory, tools, and guardrails.',
    quote: "Agent without boundaries and quality evaluation is not an employee. It's a risk.",
    personality: 'Quiet, precise, systemic. More of an architect than a programmer. Sees the whole mechanism before the first prompt.',
    biography: 'Orion is the most futuristic person in the Garage. He doesn\'t think about single prompts, but about entire teams of agents, their memory, tools, and human-in-the-loop validation.',
    skills: ['AI agent design', 'Agent role play', 'Multi-agent workflows', 'Memory & tools setup', 'Guardrails design', 'Human-in-the-loop systems', 'Operational procedures'],
    whenToConsult: 'Go to Orion to design multi-agent workflows, custom agent architectures, or guardrails for production.'
  },
  { 
    id: 'olivia', 
    locationId: 'investor',
    locationName: 'Investor Room',
    label: 'The Investor Whisperer', 
    name: 'Olivia',
    icon: Coins, 
    color: '#3b82f6', 
    story: 'Olivia sits in the glass investor room. She transforms product descriptions into investable stories, refining pitch decks and round strategies.',
    goTo: [
      'you need to build an investable story',
      'you are refining a pitch deck',
      'you are planning a funding round'
    ],
    cta: 'Prepare with Olivia',
    desc: 'Fundraising advisor. Helps you prepare your pitch deck, investor narrative, round strategy, and VC Q&As.',
    quote: "This is not an investment story yet. This is just a product description.",
    personality: 'Elegant, demanding, highly concrete. Can be tough, but she makes your pitch deck ten times stronger.',
    biography: 'Olivia shows up when someone is preparing a pitch deck. She looks at the first slide and says: "An investor won\'t understand why this matters now." She helps you build a compelling investment thesis, not just a list of features.',
    skills: ['Pitch deck design', 'Investor narrative', 'Q&A preparation', 'Round sizing', 'Use of funds', 'Traction story', 'VC meeting prep'],
    whenToConsult: 'Consult Olivia when planning a funding round, refining a pitch deck, or preparing for investor meetings.'
  }
];

const SUGGESTIONS: Record<string, string[]> = {
  mentor: [
    'What should be my focus this week?',
    'How do I avoid common startup mistakes?',
    'How do I stay motivated as a solo founder?'
  ],
  analyst: [
    'How do I calculate TAM/SAM/SOM?',
    'What key metrics should I track right now?',
    'Help me build an evaluation matrix.'
  ],
  sparring: [
    'Stress-test my business idea.',
    'Why will my startup fail?',
    'Challenge my pricing strategy.'
  ],
  researcher: [
    'What are the latest SaaS market trends?',
    'How do I find gaps in existing solutions?',
    'Suggest resources for competitive intelligence.'
  ],
  copywriter: [
    'Help me write a tagline.',
    'Draft a landing page headline.',
    'Write a cold outreach email template.'
  ],
  pm: [
    'How do I define my MVP scope?',
    'Draft user stories for onboarding.',
    'Help me prioritize my feature roadmap.'
  ],
  cto: [
    'Suggest a simple database schema.',
    'What tech stack should I choose?',
    'How do I build a secure authentication flow?'
  ],
  maya: [
    'Help me prepare discovery questions.',
    'Draft a customer interview script.',
    'How do I identify my beachhead segment?'
  ],
  bruno: [
    'Help me choose a monetization model.',
    'Suggest a pricing strategy for B2B SaaS.',
    'How do I calculate customer lifetime value (LTV)?'
  ],
  nora: [
    'Help me define my startup positioning.',
    'Draft a brand story framework.',
    'Suggest a tone of voice guide.'
  ],
  sofia: [
    'Write a cold sales email.',
    'Script a 5-minute product demo.',
    'How do I handle pricing objections?'
  ],
  leo: [
    'Design a growth experiment for this week.',
    'Suggest acquisition channels for B2B.',
    'How do I build a viral loop?'
  ],
  emma: [
    'Draft a community onboarding flow.',
    'Design a weekly community ritual.',
    'Suggest ambassador program perks.'
  ],
  olivia: [
    'Review my pitch deck structure.',
    'How do I explain my traction?',
    'Draft a use of funds slide.'
  ],
  richard: [
    'Help me prepare for a board review.',
    'How do I assess key operational risks?',
    'Draft a founder accountability framework.'
  ],
  marta: [
    'How do I calculate my runway and burn rate?',
    'Build a basic financial plan template.',
    'Help me budget for my first hire.'
  ],
  kai: [
    'Suggest an automated research workflow.',
    'How do I build an AI content pipeline?',
    'Connect my tools with Zapier/Make.'
  ],
  nina: [
    'Draft a tracking plan for product events.',
    'What metrics should go on my dashboard?',
    'How do I build a data moat?'
  ],
  orion: [
    'Design a multi-agent workflow.',
    'Suggest tools and memory for an agent.',
    'How do I build human-in-the-loop guardrails?'
  ]
};

function getMockResponse(roleId: string, userText: string, founderName: string, startupName: string): string {
  const startup = startupName || 'your startup';
  const founder = founderName || 'Founder';
  
  switch (roleId) {
    case 'mentor':
      return `[Marcus] That's a crucial point for ${startup}, ${founder}. In my experience, early-stage founders often lose focus by trying to build too many things at once. I recommend choosing one metric that matters right now and focusing entirely on it. What's your primary goal this week?`;
    case 'analyst':
      return `[Elena] Looking at the numbers for ${startup}, ${founder}, we should evaluate the opportunity size systematically. If we can quantify the frequency and pain intensity of the problem, we can rank your options and calculate the TAM (Total Addressable Market). Let me know if you want to run a quick market size simulation.`;
    case 'sparring':
      return `[Victor] Let's be brutally honest here, ${founder}. If we look at this from a competitor's perspective, they could easily copy this feature in a week. What is your actual unfair advantage at ${startup}? Is it proprietary distribution, deep domain expertise, or something else? Let's stress-test this assumption.`;
    case 'researcher':
      return `[Sarah] I've been looking at the landscape for ${startup}, ${founder}. Similar companies in this space usually run a marketplace or subscription model, but we might find a Blue Ocean by shifting focus to B2B integration. Let me know which competitor or trend you'd like me to analyze next.`;
    case 'copywriter':
      return `[Chloe] Let's make that hook much punchier for ${startup}! Instead of saying "We provide platform services," let's state the exact value: "Build your startup from idea to first investment in 100 structured tasks." That speaks directly to ${founder}'s ambition. Should we draft a landing page header?`;
    case 'pm':
      return `[David] To get the MVP out for ${startup}, we need to aggressively trim the scope. Let's list all features and keep only the "must-haves" that solve the core problem for ${founder}. Everything else goes into the backlog. What is the single most important user action?`;
    case 'cto':
      return `[Alex] For ${startup}, I'd recommend keeping the tech stack simple and highly productive. Next.js, Tailwind, and a managed database (like Supabase or Vercel Postgres) will let us iterate incredibly fast. No need to over-engineer microservices at this stage. What integrations do we need to plan for?`;
    case 'maya':
      return `[Maya] Let's design a customer discovery script for ${startup}, ${founder}. Remember: do not ask if they like the idea. Instead, ask how they solve this pain today, how much they spent, and what is the hardest part of it. What is the main assumption you want to validate?`;
    case 'bruno':
      return `[Bruno] To build a sustainable model for ${startup}, we need to align the pricing with value metrics. If we charge a flat subscription, it might not scale with usage. Let's outline the unit economics and see which B2B tier works best for ${founder}.`;
    case 'nora':
      return `[Nora] Positioning is everything, ${founder}. For ${startup}, we shouldn't just enter an existing category; we should define a new sub-category that makes competitors irrelevant. What's the main narrative you want customers to remember?`;
    case 'sofia':
      return `[Sofia] Let's get to the outreach, ${founder}! For ${startup}, we'll write a simple 3-sentence email that asks for a quick 10-minute feedback call, not a sales pitch. Who are the first 10 prospects on LinkedIn we can send this to?`;
    case 'leo':
      return `[Leo] Let's design a 7-day growth experiment for ${startup}, ${founder}. We will test one acquisition channel, set a budget of $50, and measure the conversion rate. What channel do you think your target audience uses most?`;
    case 'emma':
      return `[Emma] Communities are built on connection, ${founder}. For ${startup}, let's design a weekly ritual (like a feedback Friday) that gets members talking to each other, not just to you. How can we make them feel part of the mission?`;
    case 'olivia':
      return `[Olivia] When pitching ${startup} to investors, ${founder}, the team slide and the traction story are what they care about most. They want to see that you are moving fast and have founder-market fit. Shall we review the problem slide of your pitch deck?`;
    case 'richard':
      return `[Richard] Let's look at the operational risks for ${startup}, ${founder}. With your current burn rate, how many months of runway do we have, and what are the three key milestones we must hit before the next round? Let's stay accountable.`;
    case 'marta':
      return `[Marta] Let's calculate ${startup}'s exact burn rate and runway, ${founder}. We'll build a simple budget model to plan your next 18 months, accounting for hosting costs, marketing experiments, and potential contractor hires.`;
    case 'kai':
      return `[Kai] We can automate that in minutes for ${startup}, ${founder}! Let's build a workflow that listens to user feedback, filters it using OpenAI, and dumps actionable tasks directly into your project backlog. What tool do you want to connect first?`;
    case 'nina':
      return `[Nina] Data is your future moat for ${startup}, ${founder}. Let's design a tracking plan to capture the key user events (onboarding complete, task check, active session). This will help us measure activation rates accurately.`;
    case 'orion':
      return `[Orion] For a multi-agent system in ${startup}, we need to define clear boundaries, inputs, and outputs for each agent, ${founder}. We'll design a supervisor workflow with a human-in-the-loop check to ensure quality.`;
    default:
      return `I'm here to help you scale ${startup}, ${founder}. Let's work together!`;
  }
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface AvatarImageProps {
  name: string;
  color: string;
  size: number;
  className?: string;
}

const AvatarImage = ({ name, color, size, className = "rounded-full" }: AvatarImageProps) => {
  const [error, setError] = useState(false);
  const [prevName, setPrevName] = useState(name);

  if (name !== prevName) {
    setPrevName(name);
    setError(false);
  }

  const src = `/images/coworking/${name.toLowerCase()}.png`;

  if (error) {
    return (
      <div 
        className={`w-full h-full flex items-center justify-center bg-white/[0.02] border border-white/[0.08] backdrop-blur-md shadow-inner ${className}`} 
        style={{ color }}
      >
        <svg 
          viewBox="0 0 100 100" 
          className="w-[60%] h-[60%] text-current"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="50" cy="36" r="16" strokeWidth="6" />
          <path d="M18 80c0-12 12-20 32-20s32 8 32 20" />
        </svg>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src={src} 
      alt={name} 
      width={size}
      height={size}
      className={`object-cover w-full h-full bg-white/[0.02] border border-white/[0.08] backdrop-blur-md shadow-inner ${className}`}
      onError={() => setError(true)}
    />
  );
};

export default function CoworkingPage() {
  const { startupName, founderName } = useGarage();
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [chatActiveForRole, setChatActiveForRole] = useState<Record<string, boolean>>({});
  const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedRole = TEAM_ROLES.find(r => r.id === activeRole);
  const isChatActive = activeRole ? chatActiveForRole[activeRole] : false;
  const messages = selectedRole ? chatHistories[selectedRole.id] || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeRole && isChatActive) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [activeRole, isChatActive, messages.length]);

  const sendMsg = (text: string) => {
    if (!text.trim() || !activeRole) return;

    const userMsg: Message = { role: 'user', text };
    const aiMsg: Message = { role: 'ai', text: getMockResponse(activeRole, text, founderName, startupName) };

    setChatHistories(prev => ({
      ...prev,
      [activeRole]: [...(prev[activeRole] || []), userMsg, aiMsg]
    }));
    setInput('');
  };

  const handleStartChat = () => {
    if (activeRole) {
      setChatActiveForRole(prev => ({ ...prev, [activeRole]: true }));
    }
  };

  // Helper shortcut handler
  const selectPersonForTopic = (personId: string) => {
    setActiveRole(personId);
    setChatActiveForRole(prev => ({ ...prev, [personId]: true }));
  };

  // 1. FLOOR PLAN & DIRECTORY VIEW
  if (!activeRole) {
    const peopleToDisplay = TEAM_ROLES;

    return (
      <div className="max-w-5xl mx-auto animate-fade-in space-y-10 pb-16">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 md:p-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#B4F052]/5 rounded-full filter blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full filter blur-[80px] pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B4F052] bg-[#B4F052]/10 px-2.5 py-1 rounded-full">
              Digital Coworking Space
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome to the Innovation Center</h1>
            <p className="text-sm text-white/80 leading-relaxed max-w-3xl">
              A digital coworking space for solo founders and AI-native builders. Meet the people, and ask the right person for help with the challenge you are facing now.
            </p>
            <p className="text-xs text-white/50 leading-relaxed max-w-3xl pt-2 border-t border-white/[0.05]">
              This is not a directory of AI assistants. It feels more like walking into a startup coworking space full of people who are a few steps ahead of you. Some will help you think. Some will challenge you. Some will write with you. Some will build with you. Some will push you to talk to customers, sell earlier, or simplify your product.
              <br />
              <strong className="text-white/80 mt-1 block">You do not need to build alone.</strong>
            </p>
          </div>
        </div>

        {/* Mini Story Narrative */}
        <div className="text-xs text-white/50 italic text-center py-2 bg-white/[0.02] border-y border-white/[0.05] rounded-xl flex items-center justify-center gap-2">
          <Sparkles size={12} className="text-[#B4F052] animate-pulse" />
          <span>You walk in. Marcus is by the window. Leo is at the whiteboard. Alex is in the corner. Chloe is at the shared table.</span>
        </div>

        {/* People You Can Meet Today Grid */}
        <div className="space-y-4 pt-4">
          <div className="border-b border-white/[0.08] pb-3">
            <h2 className="text-lg font-bold text-[#B4F052]">
              People you can meet today
            </h2>
            <p className="text-xs text-white/40 mt-0.5">
              Every mentor in the Innovation Center has their own desk, style and way of helping founders. Pick the person who fits your current challenge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {peopleToDisplay.map(r => {
              const IconComp = r.icon;
              const hasChatHistory = (chatHistories[r.id]?.length || 0) > 0;
              return (
                <div 
                  key={r.id}
                  onClick={() => setActiveRole(r.id)}
                  className="glass-card p-6 cursor-pointer hover:border-[#B4F052]/30 hover:shadow-lg hover:shadow-[#B4F052]/5 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Glowing background stripe */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-30 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, ${r.color}, transparent)` }}
                  />

                  <div>
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-4">
                        {/* 56px rounded avatar container */}
                        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 relative border border-white/[0.08] bg-black/40">
                          <AvatarImage name={r.name} color={r.color} size={56} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white group-hover:text-[#B4F052] transition-colors flex items-center gap-1.5">
                            {r.name}
                            <span className="text-white/40 font-normal">({r.label})</span>
                          </h3>
                          {/* Location Badge */}
                          <div className="mt-1.5 inline-flex items-center gap-1 text-[9px] text-[#B4F052] bg-[#B4F052]/5 border border-[#B4F052]/10 px-2 py-0.5 rounded-full font-semibold">
                            <MapPin size={10} />
                            {r.locationName}
                          </div>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${r.color}15` }}>
                        <IconComp size={16} style={{ color: r.color }} />
                      </div>
                    </div>

                    {/* Backstory */}
                    <p className="text-xs text-white/50 italic border-l-2 border-white/10 pl-2.5 my-3.5 leading-relaxed">
                      &ldquo;{r.story}&rdquo;
                    </p>

                    {/* Go to Marcus when... list */}
                    <div className="space-y-1.5 mt-4">
                      <p className="text-[9px] uppercase font-bold text-white/30 tracking-wider">Go to {r.name} when:</p>
                      {r.goTo.map((bullet, i) => (
                        <div key={i} className="text-xs text-white/50 flex items-start gap-1.5 leading-snug">
                          <Check size={11} className="text-[#B4F052] mt-0.5 flex-shrink-0" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-6 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                    {hasChatHistory ? (
                      <span className="text-[10px] text-[#B4F052] bg-[#B4F052]/10 px-2 py-0.5 rounded-full font-semibold">
                        Active Session
                      </span>
                    ) : <span />}

                    <div className="text-[11px] text-[#B4F052] font-semibold flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <span>{r.cta}</span>
                      <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Not Sure Where to Start Shortcut Helper */}
        <div className="glass-card p-6 bg-gradient-to-br from-white/[0.02] to-transparent border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-[#B4F052]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Not sure where to start?</h3>
          </div>
          <p className="text-xs text-white/40">Select what you are currently working on, and we will place you at the right table immediately:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            <button 
              onClick={() => selectPersonForTopic('mentor')}
              className="text-left p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-[#B4F052]/5 hover:border-[#B4F052]/20 transition-all text-xs flex justify-between items-center group"
            >
              <span className="text-white/70 group-hover:text-[#B4F052]">I need clarity</span>
              <span className="text-[10px] text-white/30 group-hover:text-white/60">Talk to Marcus</span>
            </button>
            <button 
              onClick={() => selectPersonForTopic('maya')}
              className="text-left p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-[#B4F052]/5 hover:border-[#B4F052]/20 transition-all text-xs flex justify-between items-center group"
            >
              <span className="text-white/70 group-hover:text-[#B4F052]">I need to validate my idea</span>
              <span className="text-[10px] text-white/30 group-hover:text-white/60">Talk to Maya</span>
            </button>
            <button 
              onClick={() => selectPersonForTopic('pm')}
              className="text-left p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-[#B4F052]/5 hover:border-[#B4F052]/20 transition-all text-xs flex justify-between items-center group"
            >
              <span className="text-white/70 group-hover:text-[#B4F052]">I need to define my MVP</span>
              <span className="text-[10px] text-white/30 group-hover:text-white/60">Talk to David</span>
            </button>
            <button 
              onClick={() => selectPersonForTopic('sofia')}
              className="text-left p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-[#B4F052]/5 hover:border-[#B4F052]/20 transition-all text-xs flex justify-between items-center group"
            >
              <span className="text-white/70 group-hover:text-[#B4F052]">I need first customers</span>
              <span className="text-[10px] text-white/30 group-hover:text-white/60">Talk to Sofia</span>
            </button>
            <button 
              onClick={() => selectPersonForTopic('kai')}
              className="text-left p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-[#B4F052]/5 hover:border-[#B4F052]/20 transition-all text-xs flex justify-between items-center group"
            >
              <span className="text-white/70 group-hover:text-[#B4F052]">I need to automate my work</span>
              <span className="text-[10px] text-white/30 group-hover:text-white/60">Talk to Kai</span>
            </button>
            <button 
              onClick={() => selectPersonForTopic('olivia')}
              className="text-left p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-[#B4F052]/5 hover:border-[#B4F052]/20 transition-all text-xs flex justify-between items-center group"
            >
              <span className="text-white/70 group-hover:text-[#B4F052]">I need investor readiness</span>
              <span className="text-[10px] text-white/30 group-hover:text-white/60">Talk to Olivia</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. CHAT & PROFILE WORKSPACE CONTAINER
  const suggestions = SUGGESTIONS[selectedRole!.id] || [];

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex gap-4 animate-fade-in">
      {/* Team Sidebar (Left Column) */}
      <div className="w-64 glass-card p-3 flex flex-col justify-between hidden md:flex">
        <div className="space-y-4">
          <button 
            onClick={() => setActiveRole(null)} 
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white/50 hover:text-white hover:bg-white/[0.05] transition-all"
          >
            <ArrowLeft size={14} />
            Back to Directory
          </button>
          
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-3 mb-2">Coworking Space</p>
            {TEAM_ROLES.map(r => {
              const active = r.id === activeRole;
              const RIcon = r.icon;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setActiveRole(r.id);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all duration-200 ${
                    active ? 'bg-[#B4F052]/20 text-[#B4F052] font-semibold' : 'text-white/50 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <RIcon size={14} style={{ color: active ? '#B4F052' : r.color }} />
                  <span className="flex-1 text-left truncate">{r.name} ({r.locationName})</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl text-[10px] text-white/30">
          Working next to professionals at the Innovation Center.
        </div>
      </div>

      {/* Main Workspace Area (Right Column) */}
      <div className="flex-1 glass-card flex flex-col h-full overflow-hidden">
        
        {/* Workspace Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveRole(null)} className="md:hidden p-1 text-white/40 hover:text-white mr-1">
              <ArrowLeft size={18} />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative border border-white/[0.08] bg-black/40">
              <AvatarImage name={selectedRole!.name} color={selectedRole!.color} size={40} />
            </div>
            <div>
              <div className="text-sm font-semibold flex items-center gap-2">
                <span>{selectedRole!.name} -- <span className="text-xs text-white/40 font-normal">{selectedRole!.label}</span></span>
                {isChatActive && (
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/50 tracking-wider">In conversation</span>
                )}
              </div>
              <div className="text-xs text-white/40">{selectedRole!.desc}</div>
            </div>
          </div>
          {isChatActive && (
            <button 
              onClick={() => setChatActiveForRole(prev => ({ ...prev, [selectedRole!.id]: false }))}
              className="text-xs text-white/40 hover:text-white bg-white/[0.05] hover:bg-white/[0.08] px-3 py-1.5 rounded-xl border border-white/[0.08] transition-all flex items-center gap-1.5"
            >
              <Info size={13} />
              View Profile
            </button>
          )}
        </div>

        {/* Workspace Body */}
        {!isChatActive ? (
          /* Profile Detail View */
          <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Persona Overview Card */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden flex-shrink-0 relative border border-white/[0.08] bg-black/40">
                  <AvatarImage name={selectedRole!.name} color={selectedRole!.color} size={144} className="rounded-2xl" />
                </div>
                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <h2 className="text-lg font-bold text-white">Meet {selectedRole!.name}</h2>
                  <div className="text-xs italic pl-3 border-l-2 border-[#B4F052]/40 text-white/70 text-left">
                    &ldquo;{selectedRole!.quote}&rdquo;
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed font-semibold" style={{ color: selectedRole!.color }}>
                    {selectedRole!.personality}
                  </p>
                  <p className="text-xs text-white/40 leading-relaxed mt-1 text-left">
                    {selectedRole!.biography}
                  </p>
                </div>
              </div>

              {/* Persona Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/30 flex items-center gap-1.5">
                    <Target size={14} /> Core Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedRole!.skills.map((skill, index) => (
                      <span key={index} className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 flex items-center gap-1.5">
                        <Check size={12} className="text-[#B4F052]" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/30 flex items-center gap-1.5">
                    <Info size={14} /> Guidelines
                  </h4>
                  <p className="text-xs text-white/50 leading-relaxed pt-1">
                    {selectedRole!.whenToConsult}
                  </p>
                </div>
              </div>
            </div>

            {/* Start Chat CTA Action */}
            <div className="pt-6 border-t border-white/[0.06] flex justify-end">
              <button 
                onClick={handleStartChat}
                className="glass-button animate-pulse-glow flex items-center gap-2 px-8 py-3 text-sm hover:scale-[1.02] active:scale-95"
              >
                <Send size={16} />
                {selectedRole!.cta}
              </button>
            </div>
          </div>
        ) : (
          /* Active Chat View */
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="max-w-md mx-auto mt-8 space-y-6">
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center space-y-3">
                    <Sparkles className="mx-auto text-[#B4F052] animate-pulse" size={24} />
                    <h3 className="text-sm font-semibold text-white">Let&apos;s collaborate, {founderName}!</h3>
                    <p className="text-xs text-white/50 leading-relaxed">
                      I&apos;m your coworker <strong>{selectedRole!.name}</strong>. Let&apos;s work together on your startup <strong>{startupName || 'DistrictStartup'}</strong>. Choose a scenario or type a message below.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 px-1">Startup Scenarios:</p>
                    {suggestions.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => sendMsg(s)} 
                        className="block w-full text-left text-xs p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-[#B4F052]/5 hover:border-[#B4F052]/30 transition-all text-white/70"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`text-sm p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-[#B4F052]/10 border border-[#B4F052]/20 text-[#B4F052]' 
                        : 'bg-white/[0.04] border border-white/[0.06] text-white/95 shadow-md shadow-black/10'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-white/[0.08] bg-black/40">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMsg(input)}
                  placeholder={`Ask ${selectedRole!.name}...`}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#B4F052]/40"
                />
                <button 
                  onClick={() => sendMsg(input)} 
                  className="px-4 py-3 rounded-xl bg-[#B4F052] text-black font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
