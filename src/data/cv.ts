/**
 * The /cv/ page's content: Summary, Experience, Education, Skills,
 * Achievements, and the "Projects (brief)" list.
 *
 * Source of truth: epic.md §4 (factual content block) and §5.3 (CV page
 * spec). Company-neutral: no name from the tailored-CV set (Aumovio,
 * Infineon, Tetra Pak, Acronis, ThunderSoft, Chubb, WeComms) appears here.
 * Schneider Electric and the other employers below are from §4's verified
 * full work history, not the tailored set, and are explicitly required.
 *
 * No phone number anywhere in this file, ever.
 */

import { identity } from './site';

export interface LinkItem {
  label: string;
  href: string;
}

/** Contact block for the CV page (epic §5.3). Lowercase "open" — verbatim per epic, distinct from the hero's capitalised meta line in site.ts. */
export const cvContactLine = 'Canberra, Australia · open to relocation, including Singapore';

export const cvContact = {
  email: identity.email,
  emailHref: identity.emailHref,
  linkedin: identity.linkedin,
  linkedinLabel: identity.linkedinLabel,
  github: identity.github,
  githubLabel: identity.githubLabel,
  locationLine: cvContactLine,
};

export const downloadCvLabel = 'Download CV (PDF)';

/** CV page <h1>. Exactly one <h1> per page (epic invariant). */
export const cvH1 = `${identity.fullName} — CV`;

/**
 * Summary paragraph, adapted from the Aumovio CV's professional summary and
 * made company-neutral per epic §5.3 — facts and order preserved, no
 * employer name.
 */
export const cvSummary =
  'Master of Machine Learning and Computer Vision student at the Australian National University (LPDP scholarship) with hands-on deep learning built from the ground up in PyTorch: generative, reinforcement-learning and language models implemented straight from research papers, trained under fixed GPU budgets and benchmarked across datasets and decoding regimes. Formal computer vision training paired with robotics systems work: built the perception-adjacent virtual-robot subsystem in ROS2 with nav2 navigation for an autonomous fleet, containerised in Docker on AWS. Backed by an electronics and sensor-hardware engineering background — radar control boards and low-noise amplifiers, IoT and embedded PCB design — that maps directly onto sensor and perception systems.';

export interface ExperienceEntry {
  role: string;
  org: string;
  location: string;
  dates: string;
  bullets: string[];
}

/** Full work history, newest first (epic §4, client-confirmed "yes, full history"). */
export const experience: ExperienceEntry[] = [
  {
    role: 'Research and Development',
    org: 'AkLab Nurse Call System',
    location: 'Garut, Indonesia',
    dates: 'Apr 2024 – Jan 2025',
    bullets: [
      'Led a team building a new nurse-call system product end to end.',
      'Designed customised PCBs and developed comprehensive test programs to validate functionality and performance.',
      'Established detailed testing process standards that improved QA consistency and accuracy.',
      'Implemented Modbus RTU and Modbus TCP/IP communication plus PoE between components.',
      'Coordinated SMT PCB manufacturing setup.',
    ],
  },
  {
    role: 'Maintenance Technician',
    org: 'Schneider Electric',
    location: 'Batam, Indonesia',
    dates: 'Aug 2021 – Feb 2024',
    bullets: [
      'Modified PLC logic to raise Overall Equipment Effectiveness (OEE).',
      'Built an internal automation application in .NET, including database setup and Modbus communication.',
      'Kept production free of electrical, mechanical and pneumatic defects.',
      'Proposed Kaizen / continuous-improvement changes for stability, quality, capability and cycle time.',
      'Recorded maintenance on the MES and tracked personal KPIs (MTTR, MTBF).',
      'Implemented Total Productive Maintenance and analysed processes with Statistical Process Control.',
    ],
  },
  {
    role: 'Hardware Engineer',
    org: 'PT Radar Telekomunikasi Indonesia',
    location: 'Bandung, Indonesia',
    dates: 'May 2021 – Jul 2021',
    bullets: [
      'Designed and built control boards and low-noise amplifiers for military radar systems, using circuit design, microprocessors and communication protocols.',
      'Carried out hands-on troubleshooting and repair of the sensor electronics feeding real-time perception.',
    ],
  },
  {
    role: 'Hardware Engineer',
    org: 'Edu+ Project',
    location: 'Cimahi, Indonesia',
    dates: 'Nov 2020 – Feb 2021',
    bullets: [
      'IoT product developer for XL Future Leaders X-Camp.',
      'Designed electronic PCBs and schematics, and selected materials with cost-balance justification.',
      'Assembled and soldered SMD components, and evaluated and troubleshot IoT devices.',
    ],
  },
  {
    role: 'Test Engineer Internship',
    org: 'PT Telekomunikasi Indonesia',
    location: 'Bandung, Indonesia',
    dates: 'Sep 2019 – Feb 2020',
    bullets: [
      'Verified optical devices — fibre termination management, optical distribution points, optical distribution cabinets, fibre optic — against product and service quality standards for the Indonesian market.',
    ],
  },
  {
    role: 'Maintenance Technician',
    org: 'CV Afal Medika Sejahtera',
    location: 'Bandung, Indonesia',
    dates: 'Apr 2016 – Oct 2017',
    bullets: [
      'Maintained, examined, troubleshot and reported on electronic medical devices (infusion and syringe pumps, ECG machines, patient monitors) at Immanuel Hospital and the Hospital Region of Cicalengka, as a sub-contractor.',
    ],
  },
];

export interface EducationEntry {
  institution: string;
  qualification: string;
  location: string;
  dates: string;
  details: string[];
}

/** Education, newest first (epic §4). */
export const education: EducationEntry[] = [
  {
    institution: 'Australian National University',
    qualification: 'Master of Machine Learning and Computer Vision',
    location: 'Canberra, Australia',
    dates: 'Feb 2025 – expected Dec 2026',
    details: [
      'LPDP (Indonesia Government) scholarship awardee.',
      'Coursework across computer vision, deep learning, and advanced ML topics.',
    ],
  },
  {
    institution: 'Islam Nusantara University',
    qualification: 'Bachelor of Electrical and Electronics Engineering',
    location: 'Bandung, Indonesia',
    dates: 'Jul 2016 – Oct 2020',
    details: [
      'GPA 3.26, focus in electromedical engineering.',
      'Best Undergraduate Thesis, Batch 2016: "Design of IoT Data Logger for Symptoms COVID-19 Observation".',
    ],
  },
  {
    institution: 'SMK Negeri 1 Cimahi',
    qualification: 'Diploma, Instrumentation Process Control',
    location: 'Cimahi, Indonesia',
    dates: 'Jul 2012 – Apr 2016',
    details: [
      'Four-year industrial-instrument program: PID control, PLC fundamentals, control valves, transmitters.',
    ],
  },
];

export interface SkillGroup {
  heading: string;
  items: string[];
}

/** Skills, grouped as in epic §4. */
export const skills: SkillGroup[] = [
  {
    heading: 'AI & Machine Learning',
    items: [
      'Python',
      'PyTorch',
      'Deep learning',
      'LLMs and generative models',
      'LLM fine-tuning',
      'Computer vision',
      'Reinforcement learning',
      'Model evaluation and benchmarking',
      'Hyperparameter tuning',
      'Git/GitHub',
      'Docker',
    ],
  },
  {
    heading: 'Robotics & Systems',
    items: ['ROS2', 'nav2', 'Robotics simulation', 'Microcontrollers', 'IoT / embedded devices', 'AWS'],
  },
  {
    heading: 'Sensor & Electronics',
    items: [
      'Radar control boards',
      'Low-noise amplifiers',
      'Circuit and PCB design',
      'Altium Designer',
      'Autodesk Eagle',
      'KiCAD',
      'PLC programming',
      'Codesys',
      'Modbus RTU/TCP',
      'Instrument calibration',
    ],
  },
  {
    heading: 'Data & Tools',
    items: ['SQL', 'Statistical Process Control', 'Tableau', 'Power BI', '.NET (Visual Basic)', 'Microsoft Office'],
  },
  {
    heading: 'Manufacturing',
    items: ['SMT / PCB manufacturing', 'Total Productive Maintenance', 'Kaizen / continuous improvement', 'Laser systems'],
  },
];

export interface AchievementEntry {
  date: string;
  description: string;
}

/** Achievements, per epic §4. */
export const achievements: AchievementEntry[] = [
  {
    date: 'Nov 2024',
    description:
      'LPDP (Indonesia Government) scholarship awardee for the Master of Machine Learning and Computer Vision at the Australian National University.',
  },
  {
    date: 'Jan 2023',
    description:
      '4th Runner-up, Good Sharing Schneider East Asia & Pacific 2022 Continuous Improvement Contest; led Team Cahaya Tower to the QCC International final.',
  },
  { date: 'May 2023', description: 'Recognised for driving the tester-traceability modification on the RMC line.' },
  {
    date: 'Apr 2023',
    description: 'Implemented improvements to the sequence-packing scanning program for the XB5 family.',
  },
  { date: 'Mar 2023', description: 'Recognised for assistance implementing Laser Marking EV0.' },
  { date: 'Feb 2023', description: 'Implemented the change-series cycle-time reduction on the RMC2 second line.' },
  { date: '2020', description: 'Best Undergraduate Thesis, Batch 2016, Islam Nusantara University.' },
];
