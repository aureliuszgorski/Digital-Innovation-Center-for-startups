export interface Challenge {
  id: string;
  index: number;
  title: string;
  category: string;
  ambition: 'A1' | 'A2' | 'A3';
  description: string;
  whyItMatters: string;
  timeline: 'short' | 'medium' | 'long';
  tags: string[];
  impact: string;
}

export const CHALLENGES: Challenge[] = [
  {
    "index": 1,
    "title": "Building Flexibility OS",
    "category": "Energy/Climate",
    "ambition": "A3",
    "description": "Build a platform that connects BMS, HVAC, chargers, and energy storage to automatically shift consumption outside peak hours. The MVP can start with one building type and a single dynamic tariff.",
    "whyItMatters": "Ambitious because it can become the operating layer for thousands of buildings and distributed energy assets.",
    "timeline": "medium",
    "tags": [
      "energy analytics",
      "IoT integration",
      "B2B sales"
    ],
    "impact": "peak demand reduction, energy cost savings, active buildings count",
    "id": "building-flexibility-os"
  },
  {
    "index": 2,
    "title": "AI for Heat Pump Optimization",
    "category": "Energy/Climate",
    "ambition": "A2",
    "description": "Create a heat pump control system that learns the thermal inertia of a building and energy prices. The first product wedge is bill reduction without compromising comfort.",
    "whyItMatters": "Ambitious because it targets the massive heating electrification market and can reduce emissions across real estate portfolios.",
    "timeline": "medium",
    "tags": [
      "time series ML",
      "HVAC",
      "edge/IoT"
    ],
    "impact": "energy savings (kWh), comfort maintenance, customer retention",
    "id": "ai-for-heat-pump-optimization"
  },
  {
    "index": 3,
    "title": "Peak Reduction Marketplace for SMEs",
    "category": "Energy/Climate",
    "ambition": "A3",
    "description": "Build a marketplace where SMEs offer demand reduction or shifting on call from an aggregator or operator. The MVP can work on simple devices and rules instead of full automation.",
    "whyItMatters": "Ambitious because it creates a new flexibility market on the demand side.",
    "timeline": "long",
    "tags": [
      "energy markets",
      "API integration",
      "enterprise sales"
    ],
    "impact": "MW of contracted flexibility, cost per MW acquired, activation success rate",
    "id": "peak-reduction-marketplace-for-smes"
  },
  {
    "index": 4,
    "title": "EV Fleet Charging Planner",
    "category": "Energy/Climate",
    "ambition": "A2",
    "description": "Create a fleet charging planner that combines route schedules, battery state, maintenance windows, and connection capacity. The MVP can focus on urban delivery or buses.",
    "whyItMatters": "Ambitious because it can become the operating system for fleet electrification, not just a dashboard.",
    "timeline": "short",
    "tags": [
      "optimization",
      "fleet software",
      "payments and billing"
    ],
    "impact": "% of on-time completed routes, energy cost per km, grid capacity utilization",
    "id": "ev-fleet-charging-planner"
  },
  {
    "index": 5,
    "title": "Local Grid Digital Twin",
    "category": "Energy/Climate",
    "ambition": "A3",
    "description": "Build a digital twin of a local grid for a developer, municipality, or campus operator to simulate PV, storage, EV, and loads. The MVP can start with one neighborhood or campus.",
    "whyItMatters": "Ambitious because it accelerates investment decisions in critical infrastructure.",
    "timeline": "long",
    "tags": [
      "power systems",
      "simulation",
      "GIS & data engineering"
    ],
    "impact": "analysis preparation time, overload forecast accuracy, number of planned investments",
    "id": "local-grid-digital-twin"
  },
  {
    "index": 6,
    "title": "Thermal Retrofit Underwriting",
    "category": "Energy/Climate",
    "ambition": "A2",
    "description": "Create a thermal retrofit underwriting engine that predicts savings and project risk from building data, invoices, and weather. The MVP should generate a reliable business plan for banks or ESCOs.",
    "whyItMatters": "Ambitious because it unlocks financing for retrofits, which usually fail due to uncertainty of results.",
    "timeline": "medium",
    "tags": [
      "financial-energy modeling",
      "data engineering",
      "partnerships"
    ],
    "impact": "offer generation time, savings forecast error, conversion to financing",
    "id": "thermal-retrofit-underwriting"
  },
  {
    "index": 7,
    "title": "Battery Second-Life Circulation",
    "category": "Energy/Climate",
    "ambition": "A3",
    "description": "Build a platform for second-life battery circulation: sourcing, testing, grading, and matching for stationary applications. The MVP can handle one battery type and one customer category.",
    "whyItMatters": "Ambitious because it connects circular economy with energy storage.",
    "timeline": "long",
    "tags": [
      "hardware operations",
      "battery analytics",
      "marketplace operations"
    ],
    "impact": "number of processed packs, margin per pack, uptime of deployed storage",
    "id": "battery-second-life-circulation"
  },
  {
    "index": 8,
    "title": "Waste Heat Exchange",
    "category": "Energy/Climate",
    "ambition": "A3",
    "description": "Create a waste heat exchange connecting industrial plants with heat or cold off-takers. The MVP can start with a geographic matching engine and feasibility calculator.",
    "whyItMatters": "Ambitious because it turns a wasted resource into local energy infrastructure.",
    "timeline": "medium",
    "tags": [
      "industrial engineering",
      "GIS & matching",
      "B2B enterprise BD"
    ],
    "impact": "MWh of recovered heat, number of matched projects, payback period",
    "id": "waste-heat-exchange"
  },
  {
    "index": 9,
    "title": "Carbon-Aware IT Scheduler",
    "category": "Energy/Climate",
    "ambition": "A2",
    "description": "Build an IT workload scheduler that runs tasks when the energy mix is cleaner and cheaper. The MVP can start with batch jobs, model training, or rendering.",
    "whyItMatters": "Ambitious because it addresses the rising energy and emission costs of computing.",
    "timeline": "short",
    "tags": [
      "cloud engineering",
      "emission data",
      "DevOps"
    ],
    "impact": "emission reduction per workload, cloud cost savings, % of shifted tasks",
    "id": "carbon-aware-it-scheduler"
  },
  {
    "index": 10,
    "title": "Microgrid as a Service for Industrial Parks",
    "category": "Energy/Climate",
    "ambition": "A3",
    "description": "Create a microgrid-as-a-service model for industrial parks or large campuses, combining design, simulation, financing, and operations. The MVP can start with a design and dispatch software layer.",
    "whyItMatters": "Ambitious because it scales like an infrastructure platform and improves energy resilience.",
    "timeline": "long",
    "tags": [
      "energy project finance",
      "microgrid design",
      "B2B partnerships"
    ],
    "impact": "number of pipeline projects, design time reduction, project IRR",
    "id": "microgrid-as-a-service-for-industrial-parks"
  },
  {
    "index": 11,
    "title": "AI Triage for Primary Care",
    "category": "Health",
    "ambition": "A3",
    "description": "Build an AI triage system for primary care clinics that collects symptoms, history, and red flags before the visit, providing a clean summary to the doctor. The MVP should act as an assistant, not an autonomous diagnostician.",
    "whyItMatters": "Ambitious because it increases primary care capacity and improves first-contact quality.",
    "timeline": "medium",
    "tags": [
      "clinical workflow",
      "LLM/NLP",
      "healthtech integration"
    ],
    "impact": "doctor time saved per visit, escalation accuracy, patient satisfaction",
    "id": "ai-triage-for-primary-care"
  },
  {
    "index": 12,
    "title": "Chronic Disease Copilot",
    "category": "Health",
    "ambition": "A2",
    "description": "Create a copilot for patients with diabetes, hypertension, or COPD that combines monitoring, habits, and contact with the medical team. The MVP can focus on one disease and one intervention protocol.",
    "whyItMatters": "Ambitious because improving adherence and self-control scales to millions of patients.",
    "timeline": "medium",
    "tags": [
      "behavioral design",
      "mobile health",
      "product analytics"
    ],
    "impact": "adherence rate, reduction in hospitalizations/flares, monthly active users",
    "id": "chronic-disease-copilot"
  },
  {
    "index": 13,
    "title": "Medication Adherence OS",
    "category": "Health",
    "ambition": "A2",
    "description": "Build a medication adherence OS with reminders, simple refill control, and abandonment risk alerts. The MVP can integrate with e-prescriptions or a partner pharmacy.",
    "whyItMatters": "Ambitious because it directly affects therapy outcomes and system costs.",
    "timeline": "short",
    "tags": [
      "mobile product",
      "pharma partnerships",
      "data analytics"
    ],
    "impact": "on-time refill rate, therapy maintenance at 90 days, CAC per active patient",
    "id": "medication-adherence-os"
  },
  {
    "index": 14,
    "title": "Senior Care Coordinator",
    "category": "Health",
    "ambition": "A3",
    "description": "Create a senior care coordinator that connects family, caregivers, doctors, and home services in one workflow. The MVP can start with a care plan, meds, and task calendar.",
    "whyItMatters": "Ambitious because it addresses population aging and care staff shortages.",
    "timeline": "medium",
    "tags": [
      "care management",
      "marketplace operations",
      "health UX"
    ],
    "impact": "active care plans count, missed visits reduction, family NPS",
    "id": "senior-care-coordinator"
  },
  {
    "index": 15,
    "title": "Hospital Patient Flow Engine",
    "category": "Health",
    "ambition": "A3",
    "description": "Build a patient flow engine for hospitals that predicts discharges, bed blocks, and diagnostic bottlenecks. The MVP can operate on one ward and one patient pathway.",
    "whyItMatters": "Ambitious because it affects one of the most expensive processes in healthcare.",
    "timeline": "long",
    "tags": [
      "operations research",
      "HL7/FHIR",
      "change management"
    ],
    "impact": "average length of stay, bed occupancy rate, cancelled admissions count",
    "id": "hospital-patient-flow-engine"
  },
  {
    "index": 16,
    "title": "Smartphone Vision Screening",
    "category": "Health",
    "ambition": "A2",
    "description": "Create a smartphone-based vision screening tool for schools, employers, or optical chains, with simple results and routing to a specialist. The MVP can start with visual acuity and risk screening.",
    "whyItMatters": "Ambitious because it lowers screening costs and expands access beyond clinics.",
    "timeline": "short",
    "tags": [
      "computer vision",
      "mobile app",
      "clinical validation"
    ],
    "impact": "screening cost per person, anomaly detection rate, referral conversion rate",
    "id": "smartphone-vision-screening"
  },
  {
    "index": 17,
    "title": "AMR Data Network for Labs",
    "category": "Health",
    "ambition": "A3",
    "description": "Build an antimicrobial resistance (AMR) data network for labs and hospitals, with local outbreak alerts and treatment recommendations based on antibiograms. The MVP can connect a few regional labs.",
    "whyItMatters": "Ambitious because it builds a data layer for the fight against rising drug resistance.",
    "timeline": "long",
    "tags": [
      "bioinformatics",
      "lab integration",
      "healthcare regulation"
    ],
    "impact": "integrated labs count, time from result to alert, recommendation adoption rate",
    "id": "amr-data-network-for-labs"
  },
  {
    "index": 18,
    "title": "Oncology Patient Monitoring",
    "category": "Health",
    "ambition": "A2",
    "description": "Create a remote monitoring system for oncology patients post-chemo or immunotherapy to detect adverse events early. The MVP can support one therapy line and a few symptoms.",
    "whyItMatters": "Ambitious because it improves therapy safety and relieves outpatient clinics.",
    "timeline": "medium",
    "tags": [
      "remote monitoring",
      "oncology workflow",
      "product analytics"
    ],
    "impact": "adverse event detection time, avoided ER visits, weekly active patients",
    "id": "oncology-patient-monitoring"
  },
  {
    "index": 19,
    "title": "Stepped Care for Mental Health",
    "category": "Health",
    "ambition": "A2",
    "description": "Build a stepped care platform for mental health that matches users to self-help, groups, therapists, or psychiatrists based on risk and progress. The MVP can focus on anxiety and burnout.",
    "whyItMatters": "Ambitious because it organizes scattered demand and shortens time to appropriate help.",
    "timeline": "short",
    "tags": [
      "matching algorithms",
      "clinical psychology",
      "consumer design"
    ],
    "impact": "time to first intervention, PHQ/GAD score improvement, support cost per user",
    "id": "stepped-care-for-mental-health"
  },
  {
    "index": 20,
    "title": "Remote Physical Therapy with CV",
    "category": "Health",
    "ambition": "A2",
    "description": "Create a remote physical therapy tool using computer vision to evaluate exercise quality and progress. The MVP can start with one joint, like the knee or shoulder.",
    "whyItMatters": "Ambitious because it increases rehabilitation scale without proportional staff growth.",
    "timeline": "short",
    "tags": [
      "computer vision",
      "motion analysis",
      "rehabilitation"
    ],
    "impact": "program completion rate, movement accuracy, therapy cost per patient",
    "id": "remote-physical-therapy-with-cv"
  },
  {
    "index": 21,
    "title": "AI Mentor for Vocational Schools",
    "category": "Education/Work",
    "ambition": "A2",
    "description": "Build an AI mentor for vocational schools that explains workshop tasks, safety, and work standards. The MVP can cover one trade, like electrician or CNC operator.",
    "whyItMatters": "Ambitious because it brings mentoring quality to professions with chronic staff shortages.",
    "timeline": "short",
    "tags": [
      "LLM application design",
      "instructional design",
      "EdTech sales"
    ],
    "impact": "training time to independence, module pass rate, student activity",
    "id": "ai-mentor-for-vocational-schools"
  },
  {
    "index": 22,
    "title": "University & Employer Skill Graph",
    "category": "Education/Work",
    "ambition": "A3",
    "description": "Create a skill graph connecting university curricula, bootcamps, and real employer requirements. The MVP should generate skill gaps and curriculum recommendations.",
    "whyItMatters": "Ambitious because it can become a shared data layer for the education and job markets.",
    "timeline": "medium",
    "tags": [
      "knowledge graphs",
      "labor market data",
      "platform development"
    ],
    "impact": "mapped roles count, recommendation accuracy, number of using institutions",
    "id": "university-employer-skill-graph"
  },
  {
    "index": 23,
    "title": "Practical Competence Assessment",
    "category": "Education/Work",
    "ambition": "A2",
    "description": "Build a practical skill assessment engine based on video, logs, and simulation tasks. The MVP can handle one manual or technical skill.",
    "whyItMatters": "Ambitious because it solves the problem of reliably measuring actual skills, not just declared knowledge.",
    "timeline": "medium",
    "tags": [
      "assessment design",
      "computer vision",
      "psychometrics"
    ],
    "impact": "accuracy vs. expert assessment, evaluation time, cost per assessment",
    "id": "practical-competence-assessment"
  },
  {
    "index": 24,
    "title": "Green Jobs Reskilling",
    "category": "Education/Work",
    "ambition": "A2",
    "description": "Create a green jobs reskilling platform that maps a user's current skills to the shortest entry path for green trades. The MVP can start with installation operators, auditors, or technicians.",
    "whyItMatters": "Ambitious because it aligns with the green transformation and addresses real labor shortages.",
    "timeline": "short",
    "tags": [
      "career matching",
      "program design",
      "partnerships"
    ],
    "impact": "completed paths count, placement rate, cost per hire",
    "id": "green-jobs-reskilling"
  },
  {
    "index": 25,
    "title": "Teacher Personalization Copilot",
    "category": "Education/Work",
    "ambition": "A2",
    "description": "Build a teacher copilot to personalize exercises, feedback, and difficulty levels. The MVP should save the teacher's time, not add configuration complexity.",
    "whyItMatters": "Ambitious because it can become a daily tool in schools, not just a content add-on.",
    "timeline": "short",
    "tags": [
      "GenAI",
      "teacher UX",
      "content operations"
    ],
    "impact": "lesson prep time, teacher adoption rate, student performance improvement",
    "id": "teacher-personalization-copilot"
  },
  {
    "index": 26,
    "title": "Corporate Reskilling Marketplace",
    "category": "Education/Work",
    "ambition": "A3",
    "description": "Create a corporate reskilling marketplace where companies buy specific training outcomes, not course hours. The MVP can focus on one vertical, like data literacy or automation.",
    "whyItMatters": "Ambitious because it changes corporate training procurement to an outcome-based model.",
    "timeline": "medium",
    "tags": [
      "B2B marketplace",
      "LMS integration",
      "outcome analytics"
    ],
    "impact": "outcome-based programs count, completion rate, productivity lift at 90 days",
    "id": "corporate-reskilling-marketplace"
  },
  {
    "index": 27,
    "title": "Language + Work for Migrants",
    "category": "Education/Work",
    "ambition": "A2",
    "description": "Build a language + work product for migrants, combining micro-lessons with vocational vocabulary and onboarding to their first job. The MVP can cover logistics, retail, or care.",
    "whyItMatters": "Ambitious because it combines social integration with job market entry and quick employer ROI.",
    "timeline": "short",
    "tags": [
      "language learning",
      "job matching",
      "trust and compliance"
    ],
    "impact": "time to employment, retention at 6 months, language proficiency improvement",
    "id": "language-work-for-migrants"
  },
  {
    "index": 28,
    "title": "Lifelong Learning Wallet",
    "category": "Education/Work",
    "ambition": "A2",
    "description": "Create a lifelong learning wallet that collects certificates, projects, and skill evidence, showing the ROI of subsequent courses. The MVP can start by validating micro-credentials.",
    "whyItMatters": "Ambitious because it can become the financial and reputational layer of lifelong learning.",
    "timeline": "medium",
    "tags": [
      "wallet & identity",
      "credentialing",
      "consumer fintech"
    ],
    "impact": "verified credentials count, MAU, course conversion rate",
    "id": "lifelong-learning-wallet"
  },
  {
    "index": 29,
    "title": "High-Risk Job Simulators",
    "category": "Education/Work",
    "ambition": "A3",
    "description": "Build high-risk job simulators for emergency services, medicine, or production, with decision-making assessment under pressure. The MVP can be desktop-based, without full VR.",
    "whyItMatters": "Ambitious because it moves expensive training into scalable software.",
    "timeline": "long",
    "tags": [
      "XR and simulation",
      "domain training",
      "enterprise sales"
    ],
    "impact": "training sessions count, pre/post score improvement, training cost per participant",
    "id": "high-risk-job-simulators"
  },
  {
    "index": 30,
    "title": "SME Internship & Apprenticeship OS",
    "category": "Education/Work",
    "ambition": "A2",
    "description": "Create an internship and apprenticeship OS for SMEs: recruitment, scheduling, documents, mentors, and assessments. The MVP can start with one industry and region.",
    "whyItMatters": "Ambitious because it unlocks small business participation in talent training.",
    "timeline": "short",
    "tags": [
      "workflow SaaS",
      "educational partnerships",
      "operations"
    ],
    "impact": "internship slots count, completion rate, repeat employer rate",
    "id": "sme-internship-apprenticeship-os"
  },
  {
    "index": 31,
    "title": "Open-Finance SME Scoring",
    "category": "Fintech/Legaltech",
    "ambition": "A3",
    "description": "Build an open-finance scoring model for SMEs based on cash flows, seasonality, and payment behavior instead of just credit history. The MVP can support one business category, like e-commerce or services.",
    "whyItMatters": "Ambitious because it lowers the cost of capital for a segment consistently undervalued by traditional models.",
    "timeline": "medium",
    "tags": [
      "credit modeling",
      "open finance API",
      "risk and compliance"
    ],
    "impact": "default rate, approval rate, credit decision time",
    "id": "open-finance-sme-scoring"
  },
  {
    "index": 32,
    "title": "Invoice Factoring & Protection for Micro-Businesses",
    "category": "Fintech/Legaltech",
    "ambition": "A2",
    "description": "Create factoring and invoice protection for micro-businesses where risk assessment includes contractor status and project delivery status. The MVP can start with short-cycle industries.",
    "whyItMatters": "Ambitious because improving micro-business liquidity has a large economic effect with a simple product wedge.",
    "timeline": "medium",
    "tags": [
      "financing operations",
      "fraud controls",
      "SME sales"
    ],
    "impact": "funding payout time, fraud loss rate, returning customer rate",
    "id": "invoice-factoring-protection-for-micro-businesses"
  },
  {
    "index": 33,
    "title": "Embedded Treasury for Exporters",
    "category": "Fintech/Legaltech",
    "ambition": "A3",
    "description": "Build an embedded treasury solution for exporters with FX monitoring, light hedging, and liquidity forecasting. The MVP can start with exporters using one currency and one bank.",
    "whyItMatters": "Ambitious because it provides small exporters with treasury-grade tools without a large back-office organization.",
    "timeline": "long",
    "tags": [
      "FX & risk tech",
      "bank integrations",
      "B2B sales"
    ],
    "impact": "cashflow forecast accuracy, FX margin, active businesses count",
    "id": "embedded-treasury-for-exporters"
  },
  {
    "index": 34,
    "title": "Cross-Border Payroll for Contractors",
    "category": "Fintech/Legaltech",
    "ambition": "A2",
    "description": "Create a cross-border payroll tool for contractors and small teams, combining payments, taxes, and documents in one workflow. The MVP can support three countries and two contract models.",
    "whyItMatters": "Ambitious because cross-border work is growing faster than operational tools for small firms.",
    "timeline": "medium",
    "tags": [
      "payroll tech",
      "compliance",
      "payments"
    ],
    "impact": "payroll close time, billing error rate, supported countries count",
    "id": "cross-border-payroll-for-contractors"
  },
  {
    "index": 35,
    "title": "Anti-Fraud Merchant Onboarding",
    "category": "Fintech/Legaltech",
    "ambition": "A2",
    "description": "Build an anti-fraud merchant onboarding flow that combines KYC, device signals, geolocation, and industry risk. The MVP should shorten onboarding without increasing fraud losses.",
    "whyItMatters": "Ambitious because it removes a key friction point in fintech and e-commerce growth.",
    "timeline": "short",
    "tags": [
      "identity verification",
      "risk data",
      "API product"
    ],
    "impact": "onboarding time, manual review rate, fraud loss rate",
    "id": "anti-fraud-merchant-onboarding"
  },
  {
    "index": 36,
    "title": "Usage-Based Fleet Insurance",
    "category": "Fintech/Legaltech",
    "ambition": "A2",
    "description": "Create usage-based insurance for fleets based on telematics, driving style, and vehicle utilization. The MVP can start with last-mile delivery fleets.",
    "whyItMatters": "Ambitious because better pricing can quickly change the economics of the entire mobility category.",
    "timeline": "medium",
    "tags": [
      "telematics",
      "pricing models",
      "insurtech partnerships"
    ],
    "impact": "loss ratio, device adoption rate, policy retention rate",
    "id": "usage-based-fleet-insurance"
  },
  {
    "index": 37,
    "title": "Parametric Climate Cover",
    "category": "Fintech/Legaltech",
    "ambition": "A3",
    "description": "Build parametric climate insurance for farmers, cities, or small businesses based on weather indices and simple payout triggers. The MVP can start with one risk, like drought or hail.",
    "whyItMatters": "Ambitious because it creates a scalable resilience product where traditional insurance is too expensive or slow.",
    "timeline": "long",
    "tags": [
      "actuarial modeling",
      "weather data",
      "distribution partnerships"
    ],
    "impact": "payout time, renewal rate, risk coverage vs. actual damage",
    "id": "parametric-climate-cover"
  },
  {
    "index": 38,
    "title": "Financial Resilience Coach",
    "category": "Fintech/Legaltech",
    "ambition": "A2",
    "description": "Create a financial resilience coach that builds a cash cushion, alerts to risks, and suggests micro-actions instead of aggressive product cross-selling. The MVP can start with freelancers.",
    "whyItMatters": "Ambitious because it targets long-term user financial health, not just one transaction.",
    "timeline": "short",
    "tags": [
      "behavioral economics",
      "consumer app",
      "data science"
    ],
    "impact": "savings growth, weekly product retention, churn rate",
    "id": "financial-resilience-coach"
  },
  {
    "index": 39,
    "title": "SME Claims Automation",
    "category": "Fintech/Legaltech",
    "ambition": "A2",
    "description": "Build a claims automation engine for SMEs for simple property and operational losses, using document AI and decision recommendations. The MVP can start with one policy type and insurer.",
    "whyItMatters": "Ambitious because it shortens the most expensive stage of customer contact with insurance.",
    "timeline": "medium",
    "tags": [
      "document AI",
      "claims operations",
      "insurer integrations"
    ],
    "impact": "decision time, claims handling cost, customer satisfaction",
    "id": "sme-claims-automation"
  },
  {
    "index": 40,
    "title": "Contractual Commitment Copilot",
    "category": "Fintech/Legaltech",
    "ambition": "A2",
    "description": "Create a contractual commitment copilot for SMBs that detects deadlines, SLAs, penalties, and obligations in current work. The MVP can operate on sales and supply contracts.",
    "whyItMatters": "Ambitious because it turns legal ops from a reactive cost into an early warning system.",
    "timeline": "short",
    "tags": [
      "document NLP",
      "workflow automation",
      "legal tech"
    ],
    "impact": "detected risks count, commitment compliance rate, team time saved",
    "id": "contractual-commitment-copilot"
  },
  {
    "index": 41,
    "title": "SME Cyber Hygiene Autopilot",
    "category": "Cybersecurity",
    "ambition": "A2",
    "description": "Build a cyber hygiene autopilot for SMBs that detects missing MFA, backups, updates, and SaaS misconfigurations, providing a single-click fix checklist.",
    "whyItMatters": "Ambitious because the massive SMB segment is too small for expensive security, but too important to remain unprotected.",
    "timeline": "short",
    "tags": [
      "security automation",
      "endpoint & cloud",
      "SMB GTM"
    ],
    "impact": "time to patch critical vulnerabilities, policy activations, monthly active admins",
    "id": "sme-cyber-hygiene-autopilot"
  },
  {
    "index": 42,
    "title": "Generative Phishing Defense",
    "category": "Cybersecurity",
    "ambition": "A2",
    "description": "Create a generative phishing defense combining personalized attack simulation and in-context micro-training. The MVP can start with email and one attack type.",
    "whyItMatters": "Ambitious because AI increases the scale of social engineering faster than user awareness grows.",
    "timeline": "short",
    "tags": [
      "email security",
      "behavioral training",
      "machine learning"
    ],
    "impact": "click rate in simulations, incident report time, employee coverage %",
    "id": "generative-phishing-defense"
  },
  {
    "index": 43,
    "title": "SaaS Access & Identity Governance",
    "category": "Cybersecurity",
    "ambition": "A2",
    "description": "Build a SaaS access governance tool that detects excessive access, abandoned accounts, and risky role combinations. The MVP can integrate with Google, Microsoft, and Slack.",
    "whyItMatters": "Ambitious because identity sprawl is becoming a core problem for modern companies.",
    "timeline": "short",
    "tags": [
      "identity security",
      "SaaS API",
      "enterprise security sales"
    ],
    "impact": "removed excessive permissions count, offboarding time, integrated apps count",
    "id": "saas-access-identity-governance"
  },
  {
    "index": 44,
    "title": "Sensitive Data Clean Room",
    "category": "Cybersecurity",
    "ambition": "A3",
    "description": "Create a clean room for sensitive data, allowing multiple parties to run joint analyses without exposing raw records. The MVP can start with a healthcare or finance use case.",
    "whyItMatters": "Ambitious because it unlocks data collaboration where legal and reputational risks currently block it.",
    "timeline": "long",
    "tags": [
      "privacy tech",
      "data engineering",
      "regulated sector sales"
    ],
    "impact": "joint analyses run, data sharing preparation time, revenue per workspace",
    "id": "sensitive-data-clean-room"
  },
  {
    "index": 45,
    "title": "SBOM Monitor for Software Vendors",
    "category": "Cybersecurity",
    "ambition": "A2",
    "description": "Build an SBOM monitor that tracks software dependencies, CVEs, and remediation priorities for vendors. The MVP should integrate with repositories, build pipelines, and ticketing.",
    "whyItMatters": "Ambitious because the software supply chain has become a management problem, not just a developer one.",
    "timeline": "medium",
    "tags": [
      "AppSec",
      "supply chain security",
      "developer tools"
    ],
    "impact": "CVE remediation time, repository coverage %, % of dependencies risk-assessed",
    "id": "sbom-monitor-for-software-vendors"
  },
  {
    "index": 46,
    "title": "Zero Trust for Field Workers",
    "category": "Cybersecurity",
    "ambition": "A2",
    "description": "Create a zero trust solution for field workers with simple device identity, dynamic access, and offline fallback. The MVP can start with service technicians or construction crews.",
    "whyItMatters": "Ambitious because it moves modern security beyond offices and corporate laptops.",
    "timeline": "medium",
    "tags": [
      "identity/access",
      "mobile security",
      "B2B deployments"
    ],
    "impact": "secured sessions count, access incidents decrease, user onboarding time",
    "id": "zero-trust-for-field-workers"
  },
  {
    "index": 47,
    "title": "Deepfake Audio & Video Detection",
    "category": "Cybersecurity",
    "ambition": "A3",
    "description": "Build a deepfake audio and video detector for contact centers, fintechs, or remote onboarding. The MVP can start with voice and one high-risk process.",
    "whyItMatters": "Ambitious because synthetic attacks strike directly at digital trust channels.",
    "timeline": "medium",
    "tags": [
      "multimodal ML",
      "signal processing",
      "fraud operations"
    ],
    "impact": "precision/recall, blocked fraud attempts, false positive rate",
    "id": "deepfake-audio-video-detection"
  },
  {
    "index": 48,
    "title": "OT Anomaly Detection Light",
    "category": "Cybersecurity",
    "ambition": "A3",
    "description": "Create a lightweight OT anomaly detection tool for plants and buildings without multi-month enterprise deployment. The MVP can focus on a few protocols and one object type.",
    "whyItMatters": "Ambitious because it connects cyber and operational security in critical infrastructure.",
    "timeline": "long",
    "tags": [
      "industrial protocols",
      "anomaly detection",
      "deployment engineering"
    ],
    "impact": "time to detect anomalies, deployed objects count, incident reduction",
    "id": "ot-anomaly-detection-light"
  },
  {
    "index": 49,
    "title": "Privacy-Preserving Age & Consent Identity",
    "category": "Cybersecurity",
    "ambition": "A2",
    "description": "Build a privacy-preserving age and consent identity wallet that verifies eligibility without exposing full personal data. The MVP can start with e-commerce or social platforms.",
    "whyItMatters": "Ambitious because it answers privacy, compliance, and minor safety requirements simultaneously.",
    "timeline": "medium",
    "tags": [
      "identity/wallet",
      "privacy-by-design",
      "policy/legal"
    ],
    "impact": "verification time, conversion rate, privately verified transactions count",
    "id": "privacy-preserving-age-consent-identity"
  },
  {
    "index": 50,
    "title": "IR Marketplace + Cyber Cover",
    "category": "Cybersecurity",
    "ambition": "A2",
    "description": "Create an Incident Response (IR) marketplace + cyber cover for SMBs, combining fast post-incident help with a simple subscription or policy. The MVP can run on a network of experts model.",
    "whyItMatters": "Ambitious because it sells peace of mind and response, not just prevention.",
    "timeline": "medium",
    "tags": [
      "IR operations",
      "insurance partnerships",
      "platform operations"
    ],
    "impact": "post-incident response time, average handling cost, subscription renewal rate",
    "id": "ir-marketplace-cyber-cover"
  },
  {
    "index": 51,
    "title": "Factory Downtime Copilot",
    "category": "Industry/Logistics",
    "ambition": "A2",
    "description": "Build a factory downtime copilot that combines machine data, service logs, and production schedules to predict failures and suggest actions. The MVP can support one line or asset class.",
    "whyItMatters": "Ambitious because even a small uptime improvement directly impacts plant EBITDA.",
    "timeline": "medium",
    "tags": [
      "predictive maintenance",
      "industrial data",
      "change management"
    ],
    "impact": "unplanned downtime reduction, alert accuracy, deployment ROI",
    "id": "factory-downtime-copilot"
  },
  {
    "index": 52,
    "title": "Foundation Quality Control for SMEs",
    "category": "Industry/Logistics",
    "ambition": "A3",
    "description": "Create a foundation visual quality control system for manufacturing SMEs, trained on a small number of defect examples. The MVP can start with one visual inspection process.",
    "whyItMatters": "Ambitious because it gives small plants automation levels previously reserved for large factories.",
    "timeline": "medium",
    "tags": [
      "computer vision",
      "manufacturing",
      "edge deployments"
    ],
    "impact": "defect detection rate, model retraining time, deployed stations count",
    "id": "foundation-quality-control-for-smes"
  },
  {
    "index": 53,
    "title": "On-Demand Spare Parts Network",
    "category": "Industry/Logistics",
    "ambition": "A3",
    "description": "Build an on-demand spare parts network connecting manufacturers, 3D printing hubs, and local plants. The MVP can start with low-complexity, high-downtime-cost parts.",
    "whyItMatters": "Ambitious because it shifts parts logistics from storage to intelligent availability.",
    "timeline": "long",
    "tags": [
      "supply chain operations",
      "3D printing",
      "marketplace"
    ],
    "impact": "parts delivery time, value of avoided downtime, active SKU count",
    "id": "on-demand-spare-parts-network"
  },
  {
    "index": 54,
    "title": "Early Warning Procurement Risk",
    "category": "Industry/Logistics",
    "ambition": "A2",
    "description": "Create an early warning procurement risk tool that monitors suppliers, geopolitics, weather, and financial signals. The MVP can cover one high-risk purchasing category.",
    "whyItMatters": "Ambitious because it turns procurement from an order log into a corporate resilience function.",
    "timeline": "short",
    "tags": [
      "risk analytics",
      "supplier data",
      "B2B SaaS"
    ],
    "impact": "detected risks before disruption, response time, budget share monitored",
    "id": "early-warning-procurement-risk"
  },
  {
    "index": 55,
    "title": "Warehouse Efficiency OS",
    "category": "Industry/Logistics",
    "ambition": "A2",
    "description": "Build a warehouse efficiency OS for mid-sized operators without complex WMS, recommending slotting, crews, and pick waves. The MVP can act as an analytical layer over existing data.",
    "whyItMatters": "Ambitious because warehouses are still full of hard but solvable operational problems.",
    "timeline": "short",
    "tags": [
      "warehouse optimization",
      "BI & data",
      "operational sales"
    ],
    "impact": "lines per labor hour, picking error rate, space utilization",
    "id": "warehouse-efficiency-os"
  },
  {
    "index": 56,
    "title": "Product Material & Emission Footprint",
    "category": "Industry/Logistics",
    "ambition": "A3",
    "description": "Create a product material and emission footprint tracker from supplier to finished good, ready for reporting and procurement. The MVP can start with one SKU and a few suppliers.",
    "whyItMatters": "Ambitious because compliance and decarbonization increasingly require product-level data.",
    "timeline": "medium",
    "tags": [
      "traceability data",
      "LCA & domain",
      "enterprise integrations"
    ],
    "impact": "BOM data coverage, report preparation time, data-backed purchasing decisions",
    "id": "product-material-emission-footprint"
  },
  {
    "index": 57,
    "title": "Robotics as a Subscription",
    "category": "Industry/Logistics",
    "ambition": "A3",
    "description": "Build a robotics-as-a-subscription model with ready deployment playbooks for simple warehouse or production tasks. The MVP can combine leasing and fleet management software.",
    "whyItMatters": "Ambitious because it lowers the automation entry barrier for mid-sized firms.",
    "timeline": "long",
    "tags": [
      "robotics operations",
      "financing",
      "deployment playbooks"
    ],
    "impact": "contract-to-start time, monthly ARR per robot, fleet uptime",
    "id": "robotics-as-a-subscription"
  },
  {
    "index": 58,
    "title": "Computer Vision for HSE & Ergonomics",
    "category": "Industry/Logistics",
    "ambition": "A2",
    "description": "Create computer vision for HSE and ergonomics that detects hazard zones, unsafe behaviors, and repetitive strain. The MVP can start with one risk scenario.",
    "whyItMatters": "Ambitious because workplace safety is simultaneously a requirement and a source of savings.",
    "timeline": "short",
    "tags": [
      "computer vision",
      "HSE operations",
      "edge cameras"
    ],
    "impact": "detected risky events, accident rate reduction, shift manager adoption rate",
    "id": "computer-vision-for-hse-ergonomics"
  },
  {
    "index": 59,
    "title": "Production Scheduler with Energy Prices",
    "category": "Industry/Logistics",
    "ambition": "A2",
    "description": "Build a production scheduler linked to energy prices, orders, and line constraints. The MVP can recommend schedules first, rather than executing autonomously.",
    "whyItMatters": "Ambitious because it connects operations with real-time energy costs and margins.",
    "timeline": "medium",
    "tags": [
      "optimization",
      "ERP integrations",
      "energy data"
    ],
    "impact": "gross margin per shift, energy consumption per unit, recommendation accuracy",
    "id": "production-scheduler-with-energy-prices"
  },
  {
    "index": 60,
    "title": "Refurbishment & Returns OS",
    "category": "Industry/Logistics",
    "ambition": "A2",
    "description": "Create a refurbishment and returns OS for brands looking to recover value from post-sale products. The MVP can start with consumer electronics or appliances.",
    "whyItMatters": "Ambitious because the returns economy is growing and requires better operations than spreadsheets and email.",
    "timeline": "short",
    "tags": [
      "reverse logistics",
      "workflow SaaS",
      "marketplace operations"
    ],
    "impact": "return-to-resale time, recovered value, % of re-introduced products",
    "id": "refurbishment-returns-os"
  },
  {
    "index": 61,
    "title": "Plant Disease Diagnostics",
    "category": "AgriFood/Water",
    "ambition": "A2",
    "description": "Build mobile plant disease diagnostics from photos that provide not just the name of the problem, but also action priority and error cost. The MVP can start with one crop group.",
    "whyItMatters": "Ambitious because a simple phone becomes a consultant for a scattered market of growers.",
    "timeline": "short",
    "tags": [
      "computer vision",
      "agronomy",
      "mobile product"
    ],
    "impact": "diagnostic accuracy, active farms count, seasonal churn",
    "id": "plant-disease-diagnostics"
  },
  {
    "index": 62,
    "title": "Precision Crop Irrigation",
    "category": "AgriFood/Water",
    "ambition": "A3",
    "description": "Create precision irrigation based on sensors, weather, and growth stage, with simple recommendations for farms. The MVP can operate on one crop and region.",
    "whyItMatters": "Ambitious because water is becoming a production constraint, and software can genuinely reduce consumption.",
    "timeline": "medium",
    "tags": [
      "IoT sensors",
      "agronomic modeling",
      "field operations"
    ],
    "impact": "m3 of water saved, yield per hectare, hectares under management",
    "id": "precision-crop-irrigation"
  },
  {
    "index": 63,
    "title": "Regenerative Agriculture MRV",
    "category": "AgriFood/Water",
    "ambition": "A3",
    "description": "Build an MRV platform for regenerative agriculture combining satellite, management, and field data to verify practices and effects. The MVP can start with one program and methodology.",
    "whyItMatters": "Ambitious because without trusted MRV, the market for practice and carbon payments cannot scale.",
    "timeline": "long",
    "tags": [
      "remote sensing",
      "carbon/agri modeling",
      "farmer partnerships"
    ],
    "impact": "MRV cost per farm, verified hectares count, audit time",
    "id": "regenerative-agriculture-mrv"
  },
  {
    "index": 64,
    "title": "Food Surplus Exchange",
    "category": "AgriFood/Water",
    "ambition": "A2",
    "description": "Create a food surplus exchange for retail, gastronomy, and food rescue organizations, with logistics and simple compliance. The MVP can operate locally with daily pickup windows.",
    "whyItMatters": "Ambitious because it targets margin, waste, and food security simultaneously.",
    "timeline": "short",
    "tags": [
      "two-sided marketplace",
      "cold chain operations",
      "retail partnerships"
    ],
    "impact": "tons of saved food, GMV or recovered value, active partners count",
    "id": "food-surplus-exchange"
  },
  {
    "index": 65,
    "title": "Seasonal Work & Compliance OS",
    "category": "AgriFood/Water",
    "ambition": "A2",
    "description": "Build a seasonal work and compliance OS for farms: recruitment, housing, schedules, documents, and settlements. The MVP can start with one fruit or vegetable supply chain.",
    "whyItMatters": "Ambitious because it organizes a critical, often analog process in labor-intensive agriculture.",
    "timeline": "short",
    "tags": [
      "HR operations",
      "compliance",
      "mobile workflow"
    ],
    "impact": "vacancy fill time, admin cost per worker, document compliance rate",
    "id": "seasonal-work-compliance-os"
  },
  {
    "index": 66,
    "title": "Aquaculture Health & Feeding",
    "category": "AgriFood/Water",
    "ambition": "A2",
    "description": "Create health and feeding monitoring in aquaculture based on water, behavior, and pond history. The MVP can start with one species and one critical parameter.",
    "whyItMatters": "Ambitious because aquaculture is growing, and biological losses are still poorly monitored.",
    "timeline": "medium",
    "tags": [
      "IoT & water analytics",
      "aquaculture",
      "hardware operations"
    ],
    "impact": "FCR, mortality rate, monitored ponds count",
    "id": "aquaculture-health-feeding"
  },
  {
    "index": 67,
    "title": "Alternative Protein Formulation Studio",
    "category": "AgriFood/Water",
    "ambition": "A3",
    "description": "Build a B2B alternative protein formulation studio that shortens formulation iterations and sensory tests. The MVP does not need to produce food - just software and a lab network.",
    "whyItMatters": "Ambitious because it targets the massive new food market and difficult R&D advantages.",
    "timeline": "long",
    "tags": [
      "food science",
      "formulation software",
      "enterprise BD"
    ],
    "impact": "time to formulation prototype, commercial PoCs count, repeat manufacturer revenue",
    "id": "alternative-protein-formulation-studio"
  },
  {
    "index": 68,
    "title": "Micro Cold Chain Sensors",
    "category": "AgriFood/Water",
    "ambition": "A2",
    "description": "Create micro cold chain sensors for perishable food with alerts and batch quality scoring. The MVP can start with one category, like dairy or fresh vegetables.",
    "whyItMatters": "Ambitious because it helps reduce quality losses at every stage of the supply chain.",
    "timeline": "short",
    "tags": [
      "IoT hardware",
      "analytics",
      "supply chain sales"
    ],
    "impact": "monitored batches count, loss reduction, monitoring cost per shipment",
    "id": "micro-cold-chain-sensors"
  },
  {
    "index": 69,
    "title": "Wastewater Reuse Platform",
    "category": "AgriFood/Water",
    "ambition": "A3",
    "description": "Build a wastewater reuse platform for municipalities and industry that calculates feasibility, quality requirements, and reuse routing. The MVP can start with one city or plant.",
    "whyItMatters": "Ambitious because using treated wastewater is of strategic importance in water management.",
    "timeline": "long",
    "tags": [
      "water engineering",
      "simulation",
      "public-private sales"
    ],
    "impact": "m3 of reused water deployed, decision prep time, investment projects count",
    "id": "wastewater-reuse-platform"
  },
  {
    "index": 70,
    "title": "Biochar Marketplace with MRV",
    "category": "AgriFood/Water",
    "ambition": "A3",
    "description": "Create a biochar marketplace with MRV connecting producers, off-takers, and carbon verification paths. The MVP can start with one feedstock and off-taker type.",
    "whyItMatters": "Ambitious because it connects climate, soils, and a new materials market.",
    "timeline": "medium",
    "tags": [
      "carbon MRV",
      "supply marketplace",
      "industrial partnerships"
    ],
    "impact": "tons of biochar sold, tCO2e verified, platform margin",
    "id": "biochar-marketplace-with-mrv"
  },
  {
    "index": 71,
    "title": "Permit-to-BIM Copilot",
    "category": "Construction/UrbanTech",
    "ambition": "A3",
    "description": "Build a permit-to-BIM copilot that extracts requirements from formal documents and zoning regulations into a project structure. The MVP can focus on document analysis, not full BIM generation.",
    "whyItMatters": "Ambitious because it reduces major cost friction at the start of almost every investment.",
    "timeline": "medium",
    "tags": [
      "document AI",
      "BIM/CAD",
      "construction workflow"
    ],
    "impact": "document analysis time, detected conflicts count, designer adoption rate",
    "id": "permit-to-bim-copilot"
  },
  {
    "index": 72,
    "title": "Housing Feasibility Engine",
    "category": "Construction/UrbanTech",
    "ambition": "A3",
    "description": "Create a housing feasibility engine for residential and PRS developers, calculating density, parking, build costs, energy, and plot yield. The MVP can run in one city with good spatial data.",
    "whyItMatters": "Ambitious because improving entry-level decisions has massive capital value.",
    "timeline": "medium",
    "tags": [
      "geospatial data",
      "financial modeling",
      "proptech sales"
    ],
    "impact": "time to first-pass analysis, budget estimation accuracy, monthly analyses run",
    "id": "housing-feasibility-engine"
  },
  {
    "index": 73,
    "title": "Building Renovation Passport",
    "category": "Construction/UrbanTech",
    "ambition": "A2",
    "description": "Build a building renovation passport with action priority, costs, financing, and contractors. The MVP can start with multi-family buildings of one typology.",
    "whyItMatters": "Ambitious because it creates a clear path for the mass retrofit market.",
    "timeline": "short",
    "tags": [
      "building analytics",
      "workflow SaaS",
      "partner networks"
    ],
    "impact": "generated passports count, retrofit work conversion rate, average project value",
    "id": "building-renovation-passport"
  },
  {
    "index": 74,
    "title": "Drone Construction Progress Verification",
    "category": "Construction/UrbanTech",
    "ambition": "A2",
    "description": "Create drone-and-AI-based construction progress verification that turns photos into a risk, deviation, and milestone verification report. The MVP can start with raw structure or installations.",
    "whyItMatters": "Ambitious because construction still suffers from low transparency and poor progress data.",
    "timeline": "medium",
    "tags": [
      "drones & CV",
      "construction operations",
      "reporting"
    ],
    "impact": "reporting time, deviation detection accuracy, active projects count",
    "id": "drone-construction-progress-verification"
  },
  {
    "index": 75,
    "title": "Leakage & Installation Health OS",
    "category": "Construction/UrbanTech",
    "ambition": "A2",
    "description": "Build a leakage and installation health OS for commercial or residential buildings, with alerts and failure predictions. The MVP can focus on water and one sensor type.",
    "whyItMatters": "Ambitious because it has a quick ROI and a broad market in real estate portfolios.",
    "timeline": "short",
    "tags": [
      "IoT sensors",
      "anomaly detection",
      "facility sales"
    ],
    "impact": "detected incidents count, value of avoided damage, covered units count",
    "id": "leakage-installation-health-os"
  },
  {
    "index": 76,
    "title": "Demolition Materials Exchange",
    "category": "Construction/UrbanTech",
    "ambition": "A3",
    "description": "Create a demolition materials exchange with quality assessment, logistics, and origin passports. The MVP can start with high-value categories like steel, joinery, and fixtures.",
    "whyItMatters": "Ambitious because it creates a real circular market for construction.",
    "timeline": "medium",
    "tags": [
      "marketplace",
      "material data",
      "logistics operations"
    ],
    "impact": "tons of recovered material, GMV, active suppliers and buyers count",
    "id": "demolition-materials-exchange"
  },
  {
    "index": 77,
    "title": "Tenant & Energy Assistant",
    "category": "Construction/UrbanTech",
    "ambition": "A2",
    "description": "Build a tenant and energy assistant for multi-family buildings that collects issues, controls simple settings, and provides consumption cost feedback. The MVP can start with one community or PRS operator.",
    "whyItMatters": "Ambitious because it connects tenant experience with building economics.",
    "timeline": "short",
    "tags": [
      "consumer app",
      "proptech integration",
      "behavioral UX"
    ],
    "impact": "tenant retention rate, repeat issue ticket reduction, energy consumption change",
    "id": "tenant-energy-assistant"
  },
  {
    "index": 78,
    "title": "Solar-EV-Storage Designer for Developers",
    "category": "Construction/UrbanTech",
    "ambition": "A2",
    "description": "Create a solar-EV-storage configuration designer for developers and asset managers. The MVP can generate recommendations without full technical simulation.",
    "whyItMatters": "Ambitious because it supports real estate transitioning from passive assets to energy nodes.",
    "timeline": "short",
    "tags": [
      "energy modeling",
      "proptech sales",
      "optimization"
    ],
    "impact": "concept prep time, ROI accuracy, valued projects count",
    "id": "solar-ev-storage-designer-for-developers"
  },
  {
    "index": 79,
    "title": "Ground & Foundation Risk Engine",
    "category": "Construction/UrbanTech",
    "ambition": "A3",
    "description": "Build a ground and foundation risk engine based on geotechnical, historical, and geospatial data. The MVP can support due diligence before land purchase.",
    "whyItMatters": "Ambitious because ground errors are expensive, and decisions are often made on incomplete data.",
    "timeline": "medium",
    "tags": [
      "geotechnical data",
      "ML & GIS",
      "construction BD"
    ],
    "impact": "due diligence time, detected red flags count, average value of supported projects",
    "id": "ground-foundation-risk-engine"
  },
  {
    "index": 80,
    "title": "Indoor Air Quality in Schools & Offices",
    "category": "Construction/UrbanTech",
    "ambition": "A2",
    "description": "Create indoor air quality monitoring for schools and offices with simple ventilation recommendations and reports. The MVP can start with CO2, temperature, and humidity.",
    "whyItMatters": "Ambitious because it affects health, comfort, and productivity in spaces used daily.",
    "timeline": "short",
    "tags": [
      "IoT analytics",
      "IAQ & health",
      "B2G/B2B sales"
    ],
    "impact": "time outside CO2 norms, active rooms count, user complaints decrease",
    "id": "indoor-air-quality-in-schools-offices"
  },
  {
    "index": 81,
    "title": "Municipal Challenges Marketplace",
    "category": "GovTech/Resilience",
    "ambition": "A3",
    "description": "Build a marketplace for municipal challenges where cities publish specific problems and pilot paths, and startups apply using a single standard. The MVP can start with energy, transit, and waste.",
    "whyItMatters": "Ambitious because it organizes scattered B2G demand and lowers the entry barrier to the public sector.",
    "timeline": "short",
    "tags": [
      "platform design",
      "public procurement",
      "ecosystem operations"
    ],
    "impact": "published challenges count, time to shortlist, launched pilots count",
    "id": "municipal-challenges-marketplace"
  },
  {
    "index": 82,
    "title": "Citizen Request Triage",
    "category": "GovTech/Resilience",
    "ambition": "A2",
    "description": "Create a citizen request triage system that classifies incoming cases, removes duplicates, and suggests the responsible department. The MVP can run on email and city forms.",
    "whyItMatters": "Ambitious because it improves daily public service efficiency without heavy IT transformation.",
    "timeline": "short",
    "tags": [
      "NLP, case management",
      "public sector UX"
    ],
    "impact": "response time, % of correctly classified cases, citizen satisfaction",
    "id": "citizen-request-triage"
  },
  {
    "index": 83,
    "title": "Public Benefits Navigator",
    "category": "GovTech/Resilience",
    "ambition": "A2",
    "description": "Build a public benefits navigator that guides citizens through eligibility, documents, and deadlines in simple language. The MVP can start with family or social benefits.",
    "whyItMatters": "Ambitious because it simplifies access to the state when procedural complexity hurts the most.",
    "timeline": "short",
    "tags": [
      "rules engine",
      "conversational UX",
      "privacy & compliance"
    ],
    "impact": "application completion rate, time to submit, formal error rate",
    "id": "public-benefits-navigator"
  },
  {
    "index": 84,
    "title": "Evacuation & Shelter in Crisis",
    "category": "GovTech/Resilience",
    "ambition": "A3",
    "description": "Create an evacuation and shelter platform in crisis situations, combining routing, shelter capacities, transport availability, and field updates. The MVP can start with one scenario, like fire or flood.",
    "whyItMatters": "Ambitious because it directly improves institutional response capability in high-stakes situations.",
    "timeline": "medium",
    "tags": [
      "route optimization",
      "GIS",
      "emergency operations"
    ],
    "impact": "plan update time, connected resources count, drill performance score",
    "id": "evacuation-shelter-in-crisis"
  },
  {
    "index": 85,
    "title": "Crowd + AI for Infrastructure Maintenance",
    "category": "GovTech/Resilience",
    "ambition": "A2",
    "description": "Build a crowd + AI platform for infrastructure maintenance where citizens report issues and the system evaluates urgency and location. The MVP can cover local roads or public fixtures.",
    "whyItMatters": "Ambitious because it increases public inspection coverage without proportional cost growth.",
    "timeline": "short",
    "tags": [
      "mobile crowdsourcing",
      "computer vision",
      "municipal operations"
    ],
    "impact": "time to repair, inspection cost per km/object, active reports count",
    "id": "crowd-ai-for-infrastructure-maintenance"
  },
  {
    "index": 86,
    "title": "Public Document Automation",
    "category": "GovTech/Resilience",
    "ambition": "A2",
    "description": "Create public document automation for simple, high-volume processes, generating draft responses and decisions. The MVP can start with one case type.",
    "whyItMatters": "Ambitious because even small automation in large volumes has a massive public administration effect.",
    "timeline": "short",
    "tags": [
      "document AI",
      "workflow automation",
      "gov integrations"
    ],
    "impact": "case handling time, % of semi-automatically handled cases, clerk satisfaction",
    "id": "public-document-automation"
  },
  {
    "index": 87,
    "title": "Business Licensing & Permits API",
    "category": "GovTech/Resilience",
    "ambition": "A3",
    "description": "Build a business licensing and permits API to track status, completeness, and requirements without manual calls. The MVP can start with one regulated industry.",
    "whyItMatters": "Ambitious because it turns an unpredictable administrative process into a transparent workflow for entrepreneurs.",
    "timeline": "medium",
    "tags": [
      "API workflow",
      "public sector integrations",
      "product management"
    ],
    "impact": "time to decision, API-monitored cases count, manual query reduction",
    "id": "business-licensing-permits-api"
  },
  {
    "index": 88,
    "title": "Heat & Flood Resilience Planning",
    "category": "GovTech/Resilience",
    "ambition": "A3",
    "description": "Create a heat and flood resilience planning system for cities, with risk maps, investment priorities, and intervention scenarios. The MVP can operate at the neighborhood level.",
    "whyItMatters": "Ambitious because it connects climate, public health, and infrastructure spending.",
    "timeline": "medium",
    "tags": [
      "climate risk analytics",
      "GIS",
      "B2G sales"
    ],
    "impact": "prioritized projects count, plan preparation time, recommendation adoption rate",
    "id": "heat-flood-resilience-planning"
  },
  {
    "index": 89,
    "title": "School Transport Optimization",
    "category": "GovTech/Resilience",
    "ambition": "A2",
    "description": "Build school transport optimization for municipalities considering travel times, occupancy, and safety. The MVP can focus on one county or municipality.",
    "whyItMatters": "Ambitious because even local school transport is a large and constant public operation.",
    "timeline": "short",
    "tags": [
      "routing",
      "public sector data",
      "operations tech"
    ],
    "impact": "cost per student, average transit time, seat utilization %",
    "id": "school-transport-optimization"
  },
  {
    "index": 90,
    "title": "Municipal Waste Digital Twin",
    "category": "GovTech/Resilience",
    "ambition": "A3",
    "description": "Create a digital twin for municipal waste combining routes, fill levels, waste fractions, and recovery rates. The MVP can start with one fraction or operator.",
    "whyItMatters": "Ambitious because waste management is increasingly becoming a data-driven municipal service.",
    "timeline": "medium",
    "tags": [
      "IoT & GIS",
      "operational analytics",
      "public-private BD"
    ],
    "impact": "collection cost per ton, container overflows, recovery rate",
    "id": "municipal-waste-digital-twin"
  },
  {
    "index": 91,
    "title": "Back-Office Agents for Regulated Sectors",
    "category": "AI for Business",
    "ambition": "A3",
    "description": "Build back-office agents for regulated sectors that perform multi-step document and system tasks with full audit logs. The MVP can start with one rule-based process like customer onboarding.",
    "whyItMatters": "Ambitious because it does not just replace a single AI function, but an entire repetitive knowledge workflow.",
    "timeline": "medium",
    "tags": [
      "LLM orchestration",
      "workflow design",
      "compliance"
    ],
    "impact": "process completion time, % of cases closed without manual work, auditability score",
    "id": "back-office-agents-for-regulated-sectors"
  },
  {
    "index": 92,
    "title": "Meeting-to-Execution OS",
    "category": "AI for Business",
    "ambition": "A2",
    "description": "Create a meeting-to-execution OS that generates tasks, decisions, and follow-ups from conversations and monitors completion. The MVP can work on popular communication stacks.",
    "whyItMatters": "Ambitious because it targets the universal problem of context loss and blurred responsibility.",
    "timeline": "short",
    "tags": [
      "productivity SaaS",
      "integrations",
      "agentic workflows"
    ],
    "impact": "task completion rate, time to follow-up, active teams count",
    "id": "meeting-to-execution-os"
  },
  {
    "index": 93,
    "title": "Customer Service Quality Copilot",
    "category": "AI for Business",
    "ambition": "A2",
    "description": "Build a customer service quality copilot with conversation analysis, scoring, and specific coaching for agents. The MVP can start with voice or chat, not both.",
    "whyItMatters": "Ambitious because it scales customer service quality better than manual listening and reporting.",
    "timeline": "short",
    "tags": [
      "speech analytics",
      "contact center",
      "AI engineering"
    ],
    "impact": "CSAT uplift, QA time per agent, recommendation adoption rate",
    "id": "customer-service-quality-copilot"
  },
  {
    "index": 94,
    "title": "Observability & Lineage for AI",
    "category": "AI for Business",
    "ambition": "A3",
    "description": "Create observability and lineage for AI, showing data sources, prompt versions, models, and change effects in the pipeline. The MVP can start with one class of RAG workflow.",
    "whyItMatters": "Ambitious because companies need trust in agents and models, not just automation demos.",
    "timeline": "medium",
    "tags": [
      "data engineering",
      "MLOps",
      "developer tools"
    ],
    "impact": "debugging time, early-detected incidents count, pipeline coverage %",
    "id": "observability-lineage-for-ai"
  },
  {
    "index": 95,
    "title": "Autonomous RFP Responses",
    "category": "AI for Business",
    "ambition": "A2",
    "description": "Build autonomous RFP and security questionnaire responses with source and company knowledge control. The MVP can support repetitive sections and human review workflows.",
    "whyItMatters": "Ambitious because it shortens critical sales cycles in companies with long enterprise cycles.",
    "timeline": "short",
    "tags": [
      "document search",
      "LLM workflow",
      "enterprise sales"
    ],
    "impact": "RFP response time, win rate, answer library reuse rate",
    "id": "autonomous-rfp-responses"
  },
  {
    "index": 96,
    "title": "AI Sales Engineer for Deeptech",
    "category": "AI for Business",
    "ambition": "A2",
    "description": "Create an AI sales engineer for deeptech and B2B software that translates products to client industry terms and builds custom demo cases. The MVP can start with one vertical.",
    "whyItMatters": "Ambitious because it increases the capacity of expensive, hard-to-scale pre-sales roles.",
    "timeline": "short",
    "tags": [
      "AI for technical content",
      "CRM integrations",
      "B2B GTM"
    ],
    "impact": "demo prep time, demos per SE, post-demo conversion rate",
    "id": "ai-sales-engineer-for-deeptech"
  },
  {
    "index": 97,
    "title": "B2B Pricing & Discount Optimizer",
    "category": "AI for Business",
    "ambition": "A2",
    "description": "Build a B2B pricing and discount optimizer based on transaction history, demand elasticity, and business rules. The MVP can provide recommendations first, rather than automated decisions.",
    "whyItMatters": "Ambitious because pricing is one of the strongest margin levers but often operates on intuition.",
    "timeline": "medium",
    "tags": [
      "pricing analytics",
      "causal inference",
      "ERP/CRM integrations"
    ],
    "impact": "gross margin, recommendation acceptance rate, revenue uplift",
    "id": "b2b-pricing-discount-optimizer"
  },
  {
    "index": 98,
    "title": "Compliance Ops for AI Act, GDPR, & NIS2",
    "category": "AI for Business",
    "ambition": "A3",
    "description": "Create a compliance ops tool for AI Act, GDPR, and NIS2 that maps controls, evidence, and responsibilities in one system. The MVP can start with one regulation and control type.",
    "whyItMatters": "Ambitious because the avalanche of requirements is creating a new category of permanent operational software.",
    "timeline": "medium",
    "tags": [
      "regtech",
      "control automation",
      "policy/legal"
    ],
    "impact": "audit prep time, control coverage %, automatically collected evidence count",
    "id": "compliance-ops-for-ai-act-gdpr-nis2"
  },
  {
    "index": 99,
    "title": "Knowledge Capture from Outgoing Experts",
    "category": "AI for Business",
    "ambition": "A2",
    "description": "Build a system to capture knowledge from outgoing experts through interviews, documents, and shadowing workflows. The MVP can focus on one department with high know-how loss risk.",
    "whyItMatters": "Ambitious because aging workforces and turnover create a quiet, systemic productivity problem.",
    "timeline": "short",
    "tags": [
      "knowledge management",
      "LLM/RAG",
      "change management"
    ],
    "impact": "created playbooks count, onboarding time for new hires, knowledge reuse rate",
    "id": "knowledge-capture-from-outgoing-experts"
  },
  {
    "index": 100,
    "title": "AI-Native ERP Lite for SMEs",
    "category": "AI for Business",
    "ambition": "A3",
    "description": "Create an AI-native ERP lite for SMEs combining sales, operations, purchasing, and finance in simple agentic workflows. The MVP can start with one service industry or light manufacturing.",
    "whyItMatters": "Ambitious because it has the potential to become the central operating system of small businesses, not just another add-on.",
    "timeline": "medium",
    "tags": [
      "workflow product",
      "integrations",
      "SMB distribution"
    ],
    "impact": "active modules per customer, ARPA, monthly net retention",
    "id": "ai-native-erp-lite-for-smes"
  }
];
