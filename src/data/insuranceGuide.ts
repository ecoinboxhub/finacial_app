export interface InsuranceGuideStep {
  id: string;
  step: number;
  title: string;
  duration: string;
  description: string;
  actions: string[];
  tip?: string;
}

export interface GuideFAQ {
  question: string;
  answer: string;
}

export const INSURANCE_GUIDE_STEPS: InsuranceGuideStep[] = [
  {
    id: 'assess_needs',
    step: 1,
    title: 'Assess Your Health Needs & Budget',
    duration: '10-15 min',
    description:
      'Before comparing plans, know who you are covering and what you can comfortably afford every month. This prevents buying a plan you will drop after three months.',
    actions: [
      'List everyone to cover: yourself, spouse, children, and any dependants.',
      'Note existing medical conditions and regular medications (you must declare these honestly).',
      'Think ahead 12 months: planned surgery, pregnancy, new baby, or elderly parent care?',
      'Set a monthly health budget: aim for roughly 3-10% of monthly income for premiums.',
      'Set a target for your Emergency Health Fund (see the Emergency Fund tab for a calculated recommendation).',
    ],
    tip: 'Buy insurance before you need it — the waiting period only starts counting after you enroll.',
  },
  {
    id: 'learn_types',
    step: 2,
    title: 'Learn the Plan Types & Models',
    duration: '5-10 min',
    description:
      'Know the difference between the main options so sales agents cannot confuse you. Read the Health Insurance 101 and HMO topics in the Education tab if these terms are new.',
    actions: [
      'HMO plan (capitation): fixed premium, cashless care at panel hospitals — the standard for individuals and families in Nigeria.',
      'Indemnity plan: you pay then get reimbursed, wider hospital choice, usually pricier.',
      'NHIA / state schemes (e.g. Lagos State Health Scheme): government-regulated, lower-cost entry points — check eligibility.',
      'Corporate (employer) group plan: usually cheaper; consider a personal plan as a portable backup.',
      'Decide the tier: basic/bronze, mid/silver (adds maternity), or gold/premium (higher limits, dental/optical).',
    ],
    tip: 'For most first-time buyers, an HMO individual or family plan is the right starting point.',
  },
  {
    id: 'compare_hmos',
    step: 3,
    title: 'Compare HMOs & Their Plans',
    duration: '20-30 min',
    description:
      'Shortlist two or three NHIA-registered HMOs and compare them like-for-like. Use the Health Insurance tab in this app as your starting directory.',
    actions: [
      'Open the Health Insurance tab and filter HMOs by location and coverage type.',
      'Confirm each HMO is NHIA-registered (check their website or ask directly).',
      'Check the hospital network: are your usual hospitals on their panel?',
      'Ask for the current plan schedule: premium, co-pay, benefit limits, waiting periods.',
      'Ask specifically about maternity, dental, optical, and ambulance cover.',
      'Read recent member reviews on claims and hospital experience.',
      'Shortlist your top two and note their contact details.',
    ],
    tip: 'A cheap plan with a distant network usually costs more in transport and stress than a slightly costlier local one.',
  },
  {
    id: 'prepare_documents',
    step: 4,
    title: 'Prepare Your Documents',
    duration: '10 min',
    description:
      'Have everything ready before you start enrollment so you can complete it in one sitting and not miss early-enrollment dates.',
    actions: [
      'Valid ID for the principal member: NIN slip, national ID, international passport, or voter’s card.',
      'Passport photographs (digital copy is usually enough for online enrollment).',
      'Dependants: full names, dates of birth, and IDs/photos where required.',
      'Medical history summary: declared conditions and regular medications.',
      'Payment method ready: card, bank transfer, or USSD for the first premium.',
      'Employer letter if enrolling through a corporate scheme.',
    ],
    tip: 'Keep digital copies in your phone — renewal and claims will need them again.',
  },
  {
    id: 'enroll',
    step: 5,
    title: 'Enroll & Select Your Plan',
    duration: '15-30 min',
    description:
      'Complete enrollment with your chosen HMO, pick your tier and dependants, and pay the first premium. Enrollment can usually be done online or at the HMO office.',
    actions: [
      'Fill the enrollment form: principal member, dependants, plan tier.',
      'Declare all pre-existing conditions honestly — non-disclosure can void claims.',
      'Choose your preferred primary/panel hospital where the option exists.',
      'Pay the first premium and keep the receipt.',
      'Receive confirmation: member ID, welcome pack, and e-card (physical card may follow).',
      'Save your member ID, HMO emergency line, and claims procedure in your phone notes.',
    ],
    tip: 'Record the day you enrolled — you will need it to know when waiting periods end.',
  },
  {
    id: 'waiting_period',
    step: 6,
    title: 'Complete the Waiting Period',
    duration: '30 days - 12 months',
    description:
      'Most plans impose a waiting period after enrollment before certain benefits activate. Plan around it so you are never caught out.',
    actions: [
      'General services: commonly about a 30-day waiting period from enrollment.',
      'Maternity: commonly 9 to 12 months — enroll before pregnancy if possible.',
      'Pre-existing conditions: often a 6-12 month waiting period or specific terms in your booklet.',
      'Emergency care: check your plan’s rules — some cover emergencies from day one.',
      'Do not cancel other cover until the new plan is active and verified at your panel hospital.',
      'Use this period to build your Emergency Health Fund contributions.',
    ],
    tip: 'Mark the waiting-period end dates in your calendar the day you enroll.',
  },
  {
    id: 'use_cover',
    step: 7,
    title: 'Use Your Cover: Visits, Referrals & Claims',
    duration: 'As needed',
    description:
      'Know how to actually access care so visits go smoothly and cashless approvals work the first time.',
    actions: [
      'Go to your panel hospital first for non-emergencies — carry your e-card and ID.',
      'Ask about referral rules: some plans require a referral from your primary hospital for specialists.',
      'Prefer cashless (direct billing) where available; keep every receipt either way.',
      'For reimbursement claims, submit forms and receipts within the HMO’s stated deadline.',
      'For emergencies, call your HMO emergency line on the way when possible.',
      'If a service is denied, ask for the reason in writing and appeal through the HMO — NHIA complaint channels exist if unresolved.',
    ],
    tip: 'Save your HMO emergency number in your phone as a contact today.',
  },
  {
    id: 'review_renew',
    step: 8,
    title: 'Review Usage & Renew Every Year',
    duration: 'Annual, 30 min',
    description:
      'Each year, review how the plan worked for you, adjust coverage, and renew on time to avoid lapses and new waiting periods.',
    actions: [
      'Review the year: claims made, hospitals used, services denied and why.',
      'Compare next year’s premium and plan options — switch HMOs if the network or service failed you.',
      'Update dependants: add a new baby, remove a child who no longer needs cover.',
      'Adjust tier if your life stage changed (marriage, pregnancy, new job).',
      'Renew before the expiry date to keep continuous cover and avoid new waiting periods.',
      'Reassess your Emergency Health Fund target and top it up if it was used.',
    ],
    tip: 'Set a calendar reminder two weeks before your renewal date every year.',
  },
];

export const INSURANCE_GUIDE_FAQS: GuideFAQ[] = [
  {
    question: 'How much does health insurance cost in Nigeria?',
    answer:
      'Individual HMO plans commonly range from around ₦30,000 to ₦150,000+ per year depending on tier, age and limits; family plans cost more per additional dependant. Corporate group plans are usually cheaper per person. Always request a current plan schedule from the HMO for exact pricing.',
  },
  {
    question: 'Can I choose any hospital?',
    answer:
      'With HMO capitation plans you use hospitals on the HMO panel (your cashless network). Indemnity-style plans allow wider choice with reimbursement. Always confirm your preferred hospitals are on the panel before enrolling.',
  },
  {
    question: 'Are pre-existing conditions covered?',
    answer:
      'Often after a waiting period (commonly 6-12 months) and sometimes with specific terms or loadings. Declare them honestly at enrollment — non-disclosure can void claims entirely.',
  },
  {
    question: 'What if my claim is denied?',
    answer:
      'Ask the HMO for the denial reason in writing, appeal through their complaints process with your documents, and if unresolved you can escalate through the NHIA complaint channel.',
  },
  {
    question: 'Do I still need an emergency fund if I have insurance?',
    answer:
      'Yes. Insurance does not cover everything: co-pays, uncovered medicines and diagnostics, transport, and costs during waiting periods. Keep 3-6 months of essentials (about 3 months if insured) in your Emergency Health Fund.',
  },
  {
    question: 'What happens if I stop paying my premium?',
    answer:
      'Your cover lapses and a new waiting period may apply when you restart. Renew on time to keep continuous cover.',
  },
];
