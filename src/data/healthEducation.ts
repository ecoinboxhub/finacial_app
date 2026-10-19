export interface HealthEducationTopic {
  id: string;
  title: string;
  category: 'Health Basics' | 'Health Insurance' | 'Health Financial Planning';
  readTime: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
}

export const HEALTH_EDUCATION_TOPICS: HealthEducationTopic[] = [
  {
    id: 'health_fundamentals',
    title: 'Health Fundamentals: Why Health Is Your First Wealth',
    category: 'Health Basics',
    readTime: '4 min',
    summary:
      'Health is the foundation of productivity and financial stability. Learn how healthcare costs affect households and why protection matters.',
    content: [
      'Health is the engine of your earning power. In Nigeria and across Africa, a single serious illness can wipe out years of savings when paid for out of pocket. Studies show that a large share of households face catastrophic health spending each year, pushing families into poverty.',
      'Common healthcare cost drivers include: hospital admissions and surgery, long-term management of chronic conditions such as hypertension and diabetes, maternal and child care (antenatal, delivery, immunisation), malaria and infectious disease treatment, and medicines not covered by insurance.',
      'The financial protection strategy is three-legged: (1) health insurance to handle large hospital bills, (2) an emergency health fund for deductibles, co-pays and uncovered items, and (3) preventive care to reduce the likelihood of expensive illnesses.',
      'Preventive habits are the cheapest "insurance" you can buy: regular check-ups, vaccination, malaria prevention, safe drinking water, nutrition, exercise and adequate sleep all lower your lifetime healthcare bill.',
      'As your AI coach will remind you: protect your health budget the same way you protect your investment portfolio — early, consistently and with a plan.',
    ],
    keyTakeaways: [
      'One hospital bill can erase years of savings — protection is not optional.',
      'Three legs of protection: insurance + emergency fund + prevention.',
      'Preventive care is the cheapest form of health finance.',
      'Budget for health the same way you budget for rent and food.',
    ],
  },
  {
    id: 'preventive_care',
    title: 'Preventive Care & Wellness Habits',
    category: 'Health Basics',
    readTime: '4 min',
    summary:
      'Simple, low-cost preventive measures that keep you out of expensive hospital admissions and reduce your insurance claims.',
    content: [
      'Preventive care means acting before illness becomes a crisis. It costs far less than treatment: a malaria test and early treatment costs a fraction of a complicated admission; managing pre-diabetes with diet avoids insulin costs for years.',
      'Core preventive practices: annual medical check-ups (blood pressure, blood sugar, cholesterol), full vaccination schedules for adults and children, malaria prevention (nets, prophylaxis in season, prompt testing), dental and eye check-ups, and screening for breast, cervical and prostate cancers from recommended ages.',
      'Lifestyle factors with the biggest financial impact: tobacco and alcohol use, physical inactivity, processed food and sugary drinks, and untreated stress. These drive hypertension, diabetes and heart disease — the most expensive chronic conditions to manage.',
      'Women and families: antenatal care from the first trimester, delivery with a skilled attendant, postnatal care, and child immunisation are the highest-return health investments for families. Check that your chosen HMO plan includes maternity cover before you need it.',
      'Use your Emergency Health Fund not just for hospital bills but for preventive items your plan may not cover: vitamins, spectacles, dental cleaning, and check-up co-pays.',
    ],
    keyTakeaways: [
      'Prevention costs a fraction of treatment.',
      'Annual check-ups catch expensive conditions early.',
      'Maternity and immunisation cover should be checked before enrolling.',
      'Your emergency fund also funds prevention, not just emergencies.',
    ],
  },
  {
    id: 'health_insurance_101',
    title: 'Health Insurance 101: How It Actually Works',
    category: 'Health Insurance',
    readTime: '5 min',
    summary:
      'Premiums, coverage, cashless vs reimbursement — the fundamentals of how health insurance protects your money.',
    content: [
      'Health insurance is a contract: you pay a regular premium, and the insurer (in Nigeria usually an HMO) pays for covered healthcare services according to your plan. Instead of facing a million-naira bill at once, you pay a small, predictable amount every month or year.',
      'Key mechanics: the premium is what you pay to stay enrolled; the sum assured or benefit limit is the maximum the plan pays per year; co-pay is the small percentage you contribute at the point of service; the waiting period is the time after enrollment before certain benefits become active; and exclusions are services the plan never covers.',
      'Cashless care: you receive treatment at a network (panel) hospital and the HMO pays the hospital directly — you only pay your co-pay. This is the standard model for HMO plans in Nigeria and is the most common experience for members.',
      'Reimbursement: you pay the hospital yourself, then send the bill to the insurer for repayment. This model appears in indemnity-style plans and some corporate top-ups, and it requires you to have cash or savings available upfront — another reason the emergency health fund matters.',
      'What plans typically cover: outpatient consultations and medicines, hospitalisation and surgery, maternity (often with its own waiting period), child immunisation, and sometimes dental, optical and vision. What they typically exclude: cosmetic procedures, experimental treatments, self-inflicted injuries, and pre-existing conditions during the initial waiting period.',
      'Health insurance is not savings and not an investment — it is risk transfer. Your savings and investments stay separate; the insurance simply stops one bad event from destroying them.',
    ],
    keyTakeaways: [
      'Premium in, covered care out — you trade an uncertain large bill for a small certain payment.',
      'Cashless at panel hospitals is the norm for HMO plans.',
      'Know your waiting period, co-pay and exclusions before you need care.',
      'Insurance transfers risk; it does not replace your emergency fund.',
    ],
  },
  {
    id: 'hmo_basics',
    title: 'Understanding HMOs & NHIA in Nigeria',
    category: 'Health Insurance',
    readTime: '5 min',
    summary:
      'What an HMO is, the capitation model, NHIA regulation, and state health schemes like the Lagos State Health Scheme.',
    content: [
      'A Health Maintenance Organisation (HMO) is the organisation that sells health insurance plans in Nigeria. You choose an HMO, pick a plan tier, and it manages a network of hospitals and clinics (your "panel") that treat you under the scheme.',
      'The HMO business model is capitation: the HMO pays panel hospitals a fixed amount per member per period to keep members healthy, regardless of how often each member visits. This incentivises prevention and primary care, and it keeps premiums affordable for individuals and families.',
      'Regulation: the National Health Insurance Authority (NHIA) Act 2022 regulates the industry and accredits HMOs. You can verify an HMO is registered before enrolling. The NHIA also runs the Basic Health Care Provision Fund (BHCPF) for vulnerable Nigerians through Primary Health Centres.',
      'State schemes: states such as Lagos (Lagos State Health Scheme) run their own mandatory or contributory schemes for residents and civil servants. These can be cheaper entry points and are worth checking before buying a private plan.',
      'Corporate vs individual: employer (corporate) plans are usually group policies with better rates and fewer medical questions; individual and family plans you buy yourself give you portability when you change jobs. Many people keep an individual plan as a safety net even while covered at work.',
      'Use the Health Insurance tab in this app to browse verified NHIA-registered HMOs, compare coverage types, and contact them directly. EcoFinApp helps you discover and connect — the HMO itself determines coverage, terms and eligibility.',
    ],
    keyTakeaways: [
      'HMOs sell plans and manage panel hospitals; NHIA regulates and accredits them.',
      'Capitation model keeps premiums predictable and affordable.',
      'Check state schemes (e.g. LSHS) and BHCPF as low-cost options.',
      'Keep an individual plan even if you have a corporate one.',
    ],
  },
  {
    id: 'insurance_terms',
    title: 'Key Insurance Terms — Simple Glossary',
    category: 'Health Insurance',
    readTime: '4 min',
    summary:
      'Premium, deductible, co-pay, waiting period, exclusions, capitation — plain-language definitions you will use when comparing plans.',
    content: [
      'Premium: the regular payment (monthly or annually) that keeps your cover active. Miss it and your plan can lapse.',
      'Co-pay (co-payment): a small fixed amount or percentage you pay at the hospital for each covered service, e.g. 10% of the bill. Plans with lower premiums often have higher co-pays.',
      'Deductible: the amount you must pay yourself each year before the insurer starts paying. Common in indemnity plans; less common in Nigerian HMO capitation plans.',
      'Waiting period: the time after enrollment before you can claim certain benefits — commonly about 30 days for general services and 9 to 12 months for maternity. Enrol early so the clock runs before you need care.',
      'Pre-existing conditions: medical conditions you already had when you enrolled. Plans may impose a waiting period or loading for these. Always declare them honestly — non-disclosure can void claims.',
      'Exclusions: services the plan never pays for (cosmetic surgery, experimental therapy, and others listed in your policy booklet).',
      'Capitation: the fixed per-member payment an HMO makes to panel hospitals — the model behind most Nigerian HMO plans.',
      'Sum assured / benefit limit: the maximum amount the plan pays per year. Choose a limit that matches realistic worst-case costs, not just the cheapest premium.',
      'Panel / network hospital: the hospitals and clinics contracted by your HMO. Care outside the network is usually not covered (except emergencies, per plan rules).',
      'Underwriting: the insurer’s assessment of your risk before acceptance. Individual plans may ask health questions; group plans usually skip this.',
    ],
    keyTakeaways: [
      'Co-pay = your share at service; deductible = your annual threshold; waiting period = delay before benefits start.',
      'Declare pre-existing conditions honestly to protect your claims.',
      'Read exclusions and benefit limits, not just the premium.',
      'Panel hospitals define where you can use cashless care.',
    ],
  },
  {
    id: 'choosing_hmo',
    title: 'How to Choose the Right HMO & Plan',
    category: 'Health Insurance',
    readTime: '5 min',
    summary:
      'A practical checklist: network, tiers, dependants, maternity, dental/optical, NHIA accreditation, and total cost of care.',
    content: [
      'Start with the network. List the hospitals you and your family actually use (near home, near work, your preferred teaching or private hospital) and confirm they are on the HMO’s panel before paying anything.',
      'Match the tier to your life stage. Bronze/basic plans suit young, healthy individuals; silver plans add maternity and better outpatient limits; gold/premium plans raise limits and add dental, optical and international evacuation options. Pay for the coverage you will actually use.',
      'Cover your dependants correctly. Confirm whether a spouse and children are included or require riders, and check age limits for children on the plan.',
      'Check maternity terms if family planning is in your horizon: waiting period length, number of antenatal visits covered, delivery package, and newborn cover.',
      'Verify NHIA accreditation and read recent member reviews. An accredited HMO with a strong claims reputation is worth a slightly higher premium.',
      'Compare total cost, not just premium: premium + co-pays + likely uncovered items. A cheap plan with a small network far from your home can cost more in transport and denied claims.',
      'Use this app: the Health Insurance tab lists verified NHIA-registered HMOs with websites and phone numbers — contact two or three, ask for their current plan schedule, and compare side by side. The Insurance Guide tab walks you through enrollment step by step.',
      'Once enrolled, record your member ID, panel hospitals and emergency line — and start your Emergency Health Fund for co-pays and uncovered costs.',
    ],
    keyTakeaways: [
      'Choose the HMO whose panel includes your real hospitals.',
      'Match plan tier to life stage; don’t overbuy or underbuy.',
      'Check maternity, dental and optical terms explicitly.',
      'Compare total cost of care, verify NHIA accreditation, then enroll.',
    ],
  },
  {
    id: 'health_emergency_fund',
    title: 'Emergency Health Fund: Your Second Line of Defence',
    category: 'Health Financial Planning',
    readTime: '4 min',
    summary:
      'Why insurance alone is not enough, how much to save, and how to use this app’s calculator and contribution tracker.',
    content: [
      'Even with insurance you will still face out-of-pocket costs: co-pays, medicines not on the formulary, diagnostics outside the plan, transport, and care during waiting periods. The Emergency Health Fund covers these gaps so a small bill never becomes a debt crisis.',
      'How much to target: a practical rule is 3 to 6 months of essential expenses if you are uninsured, or about 3 months if you are covered by an HMO. For healthcare specifically, target at least 3 to 6 times your typical monthly healthcare and essentials cost.',
      'How to build it: automate a fixed transfer on payday (start with whatever you can — consistency beats amount), log every deposit in the Emergency Fund tab of this app, and redirect windfalls (bonuses, gifts) into the fund until the target is met.',
      'Where to keep it: a separate high-yield savings account or a liquid money-market fund — accessible within a day or two, not locked in long investments.',
      'When to use it: co-pays and deductibles, medicines and diagnostics not covered, dental and optical care, transport to hospital, and medical costs during insurance waiting periods. Replenish it as soon as you can after any withdrawal.',
      'The Emergency Health Fund tab computes a suggested target from your income, essentials and insurance status, tracks contributions with history, and shows your progress toward the goal.',
    ],
    keyTakeaways: [
      'Insurance has gaps — the fund covers co-pays, uncovered items and waiting periods.',
      'Target 3-6 months of essentials (3 months if insured).',
      'Automate deposits and log them in the app; keep the money liquid.',
      'Replenish the fund immediately after any withdrawal.',
    ],
  },
];

export const HEALTH_EDUCATION_CATEGORIES = [
  'All',
  'Health Basics',
  'Health Insurance',
  'Health Financial Planning',
] as const;
