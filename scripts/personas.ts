import type { PdfLayoutId } from "@/features/resume-editor/domain/presentation/pdf-presentation";

export type Job = {
  company: string;
  position: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
};
export type Project = {
  name: string;
  start: string;
  end: string;
  bullets: string[];
};
export type Cert = { name: string; org: string; date: string };

export type Persona = {
  layoutId: PdfLayoutId;
  /**
   * The curated template this shot advertises. Screenshots render real presets
   * rather than one-off colours, so the gallery and the landing carousel show
   * styles a user can actually pick.
   */
  presetId: string;
  photo: string;
  fullName: string;
  location: string;
  phone: string;
  email: string;
  links: string[];
  summary: string;
  work: Job[];
  skills: { category: string; items: string[] };
  projects: Project[];
  certs: Cert[];
  education: {
    name: string;
    location: string;
    start: string;
    end: string;
    degree: string;
    gpa: string;
    note: string;
  };
};

// 20 personas, one per presets that has a screenshot. Screenshot filename equals
// presetId — public/templates/<presetId>.webp.
export const PERSONAS: Persona[] = [
  // ── Row 1 ──────────────────────────────────────────────────────────────────
  {
    layoutId: "classic",
    presetId: "classic-modern",
    photo: "https://i.pravatar.cc/320?img=13",
    fullName: "David Park",
    location: "San Francisco, CA",
    phone: "+1 (415) 555-0148",
    email: "david.park@hey.com",
    links: [
      "https://www.linkedin.com/in/davidpark",
      "https://davidpark.design",
    ],
    summary:
      "<p>Senior product designer with 8 years crafting intuitive B2B SaaS experiences. I drive design from research to polished UI, partnering closely with engineering to ship measurable improvements. I care deeply about accessible, systematic design and building teams that ship consistently great work.</p>",
    work: [
      {
        company: "Lumen Software",
        position: "Senior Product Designer",
        location: "San Francisco, CA",
        start: "Apr 2021",
        end: "current",
        bullets: [
          "Redesigned the onboarding flow, raising activation by 31% across self-serve plans and reducing time-to-value from 14 to 6 days.",
          "Built and governed a 60-component design system adopted by 12 product teams, with documentation, Figma libraries, and automated accessibility checks.",
          "Established a weekly research practice that shipped 40+ validated improvements a year, cutting usability bug reports by half.",
          "Led cross-functional design sprints that accelerated discovery-to-handoff cycles from 6 weeks to 3 weeks for three major features.",
        ],
      },
      {
        company: "Brightpath",
        position: "Product Designer",
        location: "Oakland, CA",
        start: "Jul 2017",
        end: "Mar 2021",
        bullets: [
          "Owned design for the billing and admin areas of a 500k-user platform, delivering a cohesive experience across 40+ screens.",
          "Partnered with PMs to cut support tickets 24% through clearer flows, better empty states, and contextual inline help.",
          "Conducted 30+ usability sessions that directly informed a major navigation restructuring, reducing task completion time by 35%.",
        ],
      },
      {
        company: "Foundry Labs",
        position: "Product Designer",
        location: "San Francisco, CA",
        start: "Jun 2015",
        end: "Jun 2017",
        bullets: [
          "Shipped the company's first design system and supported 3 product launches, accelerating the design-to-dev handoff by 40%.",
          "Designed and prototyped a mobile-first dashboard that increased daily active engagement by 22% among pilot customers.",
        ],
      },
      {
        company: "Nexus Design",
        position: "Junior Designer",
        location: "San Francisco, CA",
        start: "Aug 2013",
        end: "May 2015",
        bullets: [
          "Produced wireframes, mockups, and clickable prototypes for 8 client engagements across e-commerce and healthcare.",
          "Built reusable UI kits that shortened project kickoff timelines by 2 weeks per engagement.",
        ],
      },
    ],
    skills: {
      category: "Design",
      items: [
        "Figma",
        "Design Systems",
        "User Research",
        "Prototyping",
        "Accessibility",
        "Design Ops",
        "Motion Design",
        "Workshop Facilitation",
      ],
    },
    projects: [
      {
        name: "Insights Suite Redesign",
        start: "Feb 2023",
        end: "Nov 2023",
        bullets: [
          "Led the end-to-end redesign of the analytics suite, validated through 20 usability sessions with power users.",
          "Shipped a WCAG AA–compliant interface that lifted weekly active usage by 18% and reduced time-to-insight by 40%.",
          "Collaborated with engineering to implement a flexible charting architecture, enabling self-serve metric creation.",
        ],
      },
      {
        name: "Design System 2.0",
        start: "Jan 2022",
        end: "Jun 2022",
        bullets: [
          "Unified design tokens across web and mobile, halving design-to-dev handoff time and eliminating visual drift.",
          "Published a contribution framework that onboarded 4 new contributors in the first quarter.",
        ],
      },
      {
        name: "Mobile Wallet Experience",
        start: "Mar 2021",
        end: "Aug 2021",
        bullets: [
          "Designed a mobile-first wallet feature that increased in-app payments adoption by 28% within 3 months.",
          "Iterated through 5 rounds of prototype testing to nail the micro-interactions and error states.",
        ],
      },
    ],
    certs: [
      {
        name: "Certified Usability Analyst",
        org: "Human Factors International",
        date: "Mar 2021",
      },
      { name: "Google UX Design Certificate", org: "Google", date: "Aug 2020" },
      {
        name: "Figma Advanced Prototyping",
        org: "Figma Academy",
        date: "Jan 2022",
      },
    ],
    education: {
      name: "Rhode Island School of Design",
      location: "Providence, RI",
      start: "Aug 2012",
      end: "May 2016",
      degree: "B.F.A. in Graphic Design",
      gpa: "3.8 / 4.0",
      note: "Concentration in interaction design; led the senior thesis exhibition on inclusive interfaces and won the department portfolio award.",
    },
  },
  {
    layoutId: "sidebar",
    presetId: "sidebar-slate",
    photo: "https://i.pravatar.cc/320?img=12",
    fullName: "Ryan O'Brien",
    location: "Dublin, Ireland",
    phone: "+353 85 123 4567",
    email: "ryan.obrien@proton.me",
    links: [
      "https://www.linkedin.com/in/ryanobrien",
      "https://github.com/ryanob",
    ],
    summary:
      "<p>Frontend engineer with 6+ years building performant, accessible web products in e-commerce and SaaS. I specialise in modern React architectures, design-system governance, and developer tooling that raises the whole team's velocity. Passionate about type-safe code and smooth developer experiences.</p>",
    work: [
      {
        company: "TradeDesk Europe",
        position: "Lead Frontend Engineer",
        location: "Dublin, Ireland",
        start: "Mar 2022",
        end: "current",
        bullets: [
          "Led the migration of a 200-page storefront to the Next.js App Router, reducing average page load time by 38% and Core Web Vitals pass rate from 54% to 92%.",
          "Launched a reusable component library used by 6 squads, cutting feature delivery time by 25% and eliminating duplicate patterns across the codebase.",
          "Mentored 4 engineers through architecture reviews and rollout plans for high-traffic releases, improving team onboarding speed by 30%.",
          "Introduced a visual regression testing pipeline with Chromatic that caught 40+ unintended visual changes before production.",
        ],
      },
      {
        company: "SagePay Online",
        position: "Frontend Engineer",
        location: "Dublin, Ireland",
        start: "Aug 2019",
        end: "Feb 2022",
        bullets: [
          "Rebuilt the checkout flow and raised the Lighthouse performance score from 62 to 95, directly contributing to a 12% lift in conversion rate.",
          "Introduced an A/B testing framework adopted across 3 product teams, enabling data-driven decisions on UI changes.",
          "Developed a shared ESLint and Prettier config that standardised code style across 4 repositories.",
        ],
      },
      {
        company: "PixelForge Studio",
        position: "Junior Frontend Engineer",
        location: "Dublin, Ireland",
        start: "Jul 2017",
        end: "Jul 2019",
        bullets: [
          "Built marketing sites for 10+ clients and drove a shared component library that reduced project setup time by 60%.",
          "Implemented responsive layouts and accessible forms that passed WCAG AA audits on every client project.",
        ],
      },
    ],
    skills: {
      category: "Frontend Engineering",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Design Systems",
        "Vitest",
        "Storybook",
        "GraphQL",
      ],
    },
    projects: [
      {
        name: "Merchant Analytics Dashboard",
        start: "Jan 2024",
        end: "Oct 2024",
        bullets: [
          "Built a role-based analytics dashboard with interactive charts, CSV exports, and custom saved filters serving 2,000+ merchants.",
          "Optimised GraphQL query batching, cutting dashboard load time from 5.2s to 1.9s on high-volume accounts.",
          "Implemented real-time data streaming via Server-Sent Events, giving merchants live order and revenue updates.",
        ],
      },
      {
        name: "Design Tokens Pipeline",
        start: "Mar 2023",
        end: "Aug 2023",
        bullets: [
          "Automated theming across 4 apps with a CI-driven token pipeline, removing a recurring source of visual drift.",
          "Built a Figma plugin that lets designers preview and publish token changes directly to the codebase.",
        ],
      },
      {
        name: "Accessibility Audit Tool",
        start: "Jun 2022",
        end: "Nov 2022",
        bullets: [
          "Developed an internal a11y audit tool that automated 80% of WCAG AA checks in CI, catching issues before code review.",
          "Integrated axe-core and Playwright into the pipeline, generating actionable reports per pull request.",
        ],
      },
    ],
    certs: [
      { name: "Meta Front-End Developer", org: "Meta", date: "May 2022" },
      {
        name: "AWS Certified Cloud Practitioner",
        org: "Amazon Web Services",
        date: "Sep 2021",
      },
      { name: "Google Mobile Web Specialist", org: "Google", date: "Mar 2020" },
    ],
    education: {
      name: "Trinity College Dublin",
      location: "Dublin, Ireland",
      start: "Sep 2013",
      end: "May 2017",
      degree: "B.A.I. in Computer Engineering",
      gpa: "First Class Honours",
      note: "Focused on web engineering and human-computer interaction; capstone project on real-time collaborative editing received the faculty innovation award.",
    },
  },
  {
    layoutId: "modern-centered",
    presetId: "centered-ocean",
    photo: "https://i.pravatar.cc/320?img=69",
    fullName: "Marcus Reed",
    location: "New York, NY",
    phone: "+1 (212) 555-0193",
    email: "marcus.reed@gmail.com",
    links: ["https://www.linkedin.com/in/marcusreed", "https://marcusreed.co"],
    summary:
      "<p>Growth marketing manager with a decade scaling demand for consumer and B2B brands. I pair sharp analytics with creative storytelling to build acquisition engines that compound over time. I love turning fuzzy business goals into measurable programs and building teams that own the full marketing funnel.</p>",
    work: [
      {
        company: "Northwind Media",
        position: "Growth Marketing Manager",
        location: "New York, NY",
        start: "Jun 2020",
        end: "current",
        bullets: [
          "Scaled paid acquisition across 6 channels (Google Ads, Meta, LinkedIn, Reddit, TikTok, affiliates), growing qualified leads 2.4x year over year while reducing blended CPA by 18%.",
          "Rebuilt the lifecycle program with behaviour-triggered journeys, lifting trial-to-paid conversion by 22% and reducing churn by 15%.",
          "Led and coached a team of 5 marketers across content, paid, and lifecycle, instituting weekly growth meetings and shared goal-setting.",
          "Implemented a multi-touch attribution model that shifted budget allocation and recovered $320k in annual wasted spend.",
        ],
      },
      {
        company: "Brightwave",
        position: "Marketing Specialist",
        location: "New York, NY",
        start: "Jul 2016",
        end: "May 2020",
        bullets: [
          "Owned SEO strategy and grew organic traffic 3x over two years by building a content hub of 200+ articles and technical SEO improvements.",
          "Launched a referral program that drove 15% of new signups within its first quarter, with a viral coefficient of 0.8.",
          "Managed the email marketing calendar and grew the subscriber base from 40k to 180k through lead-magnet campaigns.",
        ],
      },
      {
        company: "Cobalt Agency",
        position: "Marketing Coordinator",
        location: "New York, NY",
        start: "Jun 2014",
        end: "Jun 2016",
        bullets: [
          "Managed multi-channel campaigns for 8 clients across finance, health, and retail verticals, consistently exceeding ROAS targets.",
          "Built weekly performance reporting dashboards in Google Data Studio, enabling real-time budget reallocation decisions.",
        ],
      },
      {
        company: "Summit Media Group",
        position: "Junior Analyst",
        location: "New York, NY",
        start: "Aug 2012",
        end: "May 2014",
        bullets: [
          "Analysed campaign performance data for a $5M annual ad spend portfolio, identifying optimisation opportunities that improved average ROAS by 25%.",
          "Automated recurring reporting workflows with Python scripts, saving the analytics team 10 hours per week.",
        ],
      },
    ],
    skills: {
      category: "Marketing",
      items: [
        "SEO / SEM",
        "Lifecycle Marketing",
        "Analytics",
        "A/B Testing",
        "HubSpot",
        "Copywriting",
        "Google Ads",
        "Tableau",
      ],
    },
    projects: [
      {
        name: "Lifecycle Revamp",
        start: "Mar 2023",
        end: "Dec 2023",
        bullets: [
          "Rebuilt onboarding and re-engagement journeys across email and push notifications, incorporating behaviour-based segmentation.",
          "Drove a 27% increase in 30-day retention through personalised content recommendations and milestone-triggered messages.",
          "Reduced unsubscribe rate by 18% by introducing preference centres and frequency controls.",
        ],
      },
      {
        name: "Brand Relaunch",
        start: "Jan 2022",
        end: "Jun 2022",
        bullets: [
          "Led a full rebrand and website refresh that increased demo requests by 40% and lifted brand recall scores by 22 points.",
          "Coordinated cross-functional teams across design, engineering, and PR to ship on a 6-month timeline.",
        ],
      },
      {
        name: "Paid Acquisition Engine",
        start: "Sep 2021",
        end: "Feb 2022",
        bullets: [
          "Built a semi-automated campaign creation framework that reduced launch time for new ad experiments from 3 days to 4 hours.",
          "Scaled TikTok from zero to 12% of total lead volume within 4 months through iterative creative testing.",
        ],
      },
      {
        name: "Customer Intelligence Platform",
        start: "Jan 2020",
        end: "Jun 2020",
        bullets: [
          "Selected and deployed a CDP (Segment) to unify customer data across 7 sources, enabling single-customer-view targeting.",
          "Integrated CDP data with HubSpot and Google Analytics, enabling closed-loop campaign attribution.",
        ],
      },
    ],
    certs: [
      {
        name: "HubSpot Inbound Marketing",
        org: "HubSpot Academy",
        date: "Apr 2021",
      },
      {
        name: "Google Analytics Certification",
        org: "Google",
        date: "Feb 2020",
      },
      {
        name: "Meta Certified Digital Marketing Associate",
        org: "Meta",
        date: "Oct 2021",
      },
      {
        name: "Product-Led Growth Certificate",
        org: "ProductLed",
        date: "Aug 2022",
      },
    ],
    education: {
      name: "New York University",
      location: "New York, NY",
      start: "Aug 2010",
      end: "May 2014",
      degree: "B.A. in Communications",
      gpa: "3.7 / 4.0",
      note: "Minor in Marketing; led the student-run media collective, growing its readership to 12k monthly and managing a $25k ad budget.",
    },
  },
  {
    layoutId: "timeline",
    presetId: "timeline-indigo",
    photo: "https://i.pravatar.cc/320?img=15",
    fullName: "James Wilson",
    location: "London, UK",
    phone: "+44 20 7946 0312",
    email: "james.wilson@outlook.com",
    links: [
      "https://www.linkedin.com/in/jameswilson",
      "https://github.com/jwilson",
    ],
    summary:
      "<p>Senior data scientist with 7 years turning messy data into production ML systems across fintech and marketplace domains. I ship models that move core business metrics with a bias for simple, well-monitored systems over clever ones. Experienced in leading technical projects and mentoring junior data scientists.</p>",
    work: [
      {
        company: "Meridian Analytics",
        position: "Senior Data Scientist",
        location: "London, UK",
        start: "Sep 2021",
        end: "current",
        bullets: [
          "Built a churn-prediction model (XGBoost, ROC-AUC 0.91) that informed retention spend and saved an estimated £1.8M annually in preventable churn.",
          "Deployed a real-time feature pipeline with Kafka and Redis, cutting model inference latency by 60% and enabling same-day feature updates.",
          "Mentored 3 analysts to data-scientist level through structured pair-programming, code reviews, and a custom ML curriculum.",
          "Established the team's experimentation standards, including power-analysis templates and a Bayesian A/B testing framework.",
        ],
      },
      {
        company: "FinEdge",
        position: "Data Scientist",
        location: "London, UK",
        start: "Jun 2018",
        end: "Aug 2021",
        bullets: [
          "Developed credit-risk models (gradient boosting, logistic regression) that reduced default rates by 12% within the consumer lending portfolio.",
          "Built an internal experimentation platform with self-serve dashboards that was adopted across 4 product teams, running 200+ experiments per quarter.",
          "Created a feature store (Feast-based) that centralised 150+ features and reduced model development time from 6 weeks to 2 weeks.",
        ],
      },
      {
        company: "Datanova Labs",
        position: "Data Analyst",
        location: "London, UK",
        start: "Jul 2016",
        end: "May 2018",
        bullets: [
          "Built SQL pipelines and executive dashboards in Looker that became the company's metrics source of truth for revenue, retention, and growth.",
          "Collaborated with the product team to instrument event tracking, uncovering a 30% drop-off in the signup funnel that led to a redesigned onboarding flow.",
        ],
      },
    ],
    skills: {
      category: "Data Science",
      items: [
        "Python",
        "SQL",
        "PyTorch",
        "Spark",
        "A/B Testing",
        "MLflow",
        "Kubernetes",
        "Feature Stores",
      ],
    },
    projects: [
      {
        name: "Fraud Detection Engine",
        start: "Apr 2023",
        end: "Jan 2024",
        bullets: [
          "Designed a gradient-boosted fraud model (LightGBM) with a 0.94 ROC-AUC in production, processing 50k transactions per day.",
          "Reduced false positives by 35% while holding recall steady, saving the manual review team 200+ hours per month.",
          "Built a drift-monitoring dashboard that alerted the team to data shifts within 15 minutes, preventing model decay.",
        ],
      },
      {
        name: "Demand Forecasting",
        start: "Feb 2022",
        end: "Oct 2022",
        bullets: [
          "Shipped weekly demand forecasts using Prophet and ARIMA, cutting stockout rates by 19% across 500 SKUs.",
          "Built an automated retraining pipeline that updated models every Sunday with no human intervention.",
        ],
      },
      {
        name: "Customer Segmentation",
        start: "Mar 2021",
        end: "Aug 2021",
        bullets: [
          "Developed an RFM-based segmentation model that identified 6 distinct customer personas, enabling targeted marketing campaigns.",
          "Segmentation-driven campaigns achieved 2.3x higher engagement rates compared to broadcast email sends.",
        ],
      },
    ],
    certs: [
      {
        name: "TensorFlow Developer Certificate",
        org: "Google",
        date: "Jun 2022",
      },
      {
        name: "AWS Certified Machine Learning – Specialty",
        org: "Amazon Web Services",
        date: "Mar 2021",
      },
      {
        name: "Deep Learning Specialisation",
        org: "DeepLearning.AI",
        date: "Nov 2020",
      },
    ],
    education: {
      name: "Imperial College London",
      location: "London, UK",
      start: "Sep 2016",
      end: "Jun 2018",
      degree: "M.Sc. in Statistics (Machine Learning)",
      gpa: "Distinction",
      note: "Dissertation on probabilistic forecasting with deep ensembles; awarded the department prize for best applied research project.",
    },
  },
  {
    layoutId: "academic",
    presetId: "academic-oxford",
    photo: "https://i.pravatar.cc/320?img=14",
    fullName: "Dr. Omar Rahman",
    location: "Boston, MA",
    phone: "+1 (617) 555-0177",
    email: "o.rahman@mit.edu",
    links: [
      "https://www.linkedin.com/in/omarrahman",
      "https://omarrahman.science",
    ],
    summary:
      "<p>Research scientist in machine learning and NLP with 14 peer-reviewed publications. I lead funded studies, advise graduate students, and translate research into deployable, reproducible systems. My work focuses on robust language understanding, low-resource NLP, and open-science practices that accelerate the field.</p>",
    work: [
      {
        company: "MIT Media Lab",
        position: "Postdoctoral Research Scientist",
        location: "Cambridge, MA",
        start: "Aug 2021",
        end: "current",
        bullets: [
          "Lead an NSF-funded study on robust language models, mentoring 4 PhD students and managing a $1.2M grant budget.",
          "Published 8 papers at ACL, NeurIPS, and EMNLP over three years, including 2 oral presentations and 1 best-paper nomination.",
          "Serve as a reviewer for ACL and NeurIPS and co-organise a yearly workshop on evaluation methodologies in NLP.",
          "Developed and open-sourced a benchmark toolkit that has been downloaded 50k+ times and adopted by 30+ research groups.",
        ],
      },
      {
        company: "Allen Institute for AI",
        position: "Research Intern",
        location: "Seattle, WA",
        start: "Jun 2020",
        end: "Aug 2020",
        bullets: [
          "Contributed to an open-source NLP toolkit now used by thousands of researchers, implementing 3 new model architectures.",
          "Led a sub-project on cross-lingual transfer that resulted in a first-author paper at EMNLP 2020.",
        ],
      },
      {
        company: "Stanford NLP Group",
        position: "Graduate Research Assistant",
        location: "Stanford, CA",
        start: "Sep 2016",
        end: "Jun 2021",
        bullets: [
          "Led 3 research projects on adversarial robustness and evaluation, resulting in 5 publications and an open-source benchmark.",
          "TA'd the graduate machine learning course for 4 terms, earning a teaching excellence award.",
          "Mentored 6 undergraduate researchers, 3 of whom went on to PhD programmes at top institutions.",
        ],
      },
    ],
    skills: {
      category: "Research",
      items: [
        "Machine Learning",
        "NLP",
        "Statistical Modeling",
        "PyTorch",
        "Transformers",
        "LaTeX",
        "Python",
        "Open Science",
      ],
    },
    projects: [
      {
        name: "Low-Resource Translation Toolkit",
        start: "Jan 2022",
        end: "Mar 2024",
        bullets: [
          "Developed transfer-learning methods improving BLEU by 6.2 points on 4 low-resource language pairs from the Flores benchmark.",
          "Released an open dataset and fine-tuning toolkit now used by 30+ research groups and 3 industry teams.",
          "Published the work at ACL 2023 with accompanying model weights and evaluation harness.",
        ],
      },
      {
        name: "Robust QA Benchmark",
        start: "Mar 2021",
        end: "Dec 2021",
        bullets: [
          "Released an adversarial QA benchmark with 5k examples spanning 12 distinct perturbation types, adopted by 5 research labs.",
          "Demonstrated that state-of-the-art models at the time dropped 28% in accuracy on the benchmark, sparking follow-up work across the community.",
        ],
      },
      {
        name: "Reproducibility Study",
        start: "Sep 2020",
        end: "Jun 2021",
        bullets: [
          "Systematically reproduced 15 recent NLP papers, finding that only 60% of claimed results were replicable with released code and data.",
          "Co-authored a reproducibility report published at ACL 2021, leading to updated author guidelines at 2 conferences.",
        ],
      },
    ],
    certs: [
      {
        name: "Deep Learning Specialisation",
        org: "DeepLearning.AI",
        date: "Jul 2020",
      },
      {
        name: "Teaching Excellence Certificate",
        org: "Stanford CTL",
        date: "May 2019",
      },
      { name: "Responsible AI Practices", org: "Google AI", date: "Mar 2022" },
    ],
    education: {
      name: "Stanford University",
      location: "Stanford, CA",
      start: "Sep 2015",
      end: "Jun 2021",
      degree: "Ph.D. in Computer Science",
      gpa: "—",
      note: "Dissertation on robust language understanding under distribution shift; recipient of a graduate research fellowship and the School of Engineering outstanding thesis award.",
    },
  },
  {
    layoutId: "minimal",
    presetId: "minimal-air",
    photo: "https://i.pravatar.cc/320?img=33",
    fullName: "Andrew Blake",
    location: "Seattle, WA",
    phone: "+1 (206) 555-0246",
    email: "andrew.blake@fastmail.com",
    links: [
      "https://www.linkedin.com/in/andrewblake",
      "https://github.com/ablake",
    ],
    summary:
      "<p>Staff software engineer focused on distributed systems and developer platforms. I make large systems simpler, faster, and more reliable, and I enjoy turning painful operational work into self-service tooling that teams love. 12 years of experience shipping infrastructure used by thousands of engineers.</p>",
    work: [
      {
        company: "Hibiki Systems",
        position: "Staff Software Engineer",
        location: "Seattle, WA",
        start: "May 2020",
        end: "current",
        bullets: [
          "Led the migration of a 500-microservice fleet to a Kubernetes-based platform, cutting deploy times from 40m to 6m and reducing infrastructure costs by 22%.",
          "Designed a sharded data layer that reduced p99 read latency by 45% under peak load of 1M requests per second.",
          "Mentored 6 engineers through the staff track and ran the internal systems-design review programme for senior hires.",
          "Drove adoption of internal developer platform (IDP) tooling that automated 80% of environment provisioning requests.",
        ],
      },
      {
        company: "Sora Pay",
        position: "Senior Software Engineer",
        location: "Seattle, WA",
        start: "Apr 2016",
        end: "Apr 2020",
        bullets: [
          "Owned a payments service handling 2M daily transactions at 99.98% uptime, implementing circuit breakers and graceful degradation.",
          "Introduced contract testing with Pact that eliminated a recurring class of integration outages across 12 consuming services.",
          "Redesigned the payment reconciliation pipeline, reducing nightly processing time from 4 hours to 25 minutes.",
        ],
      },
      {
        company: "Midori Tech",
        position: "Backend Engineer",
        location: "Seattle, WA",
        start: "Apr 2014",
        end: "Mar 2016",
        bullets: [
          "Built and operated REST services on a 24/7 on-call rotation for a 1M-user messaging app, maintaining 99.95% availability.",
          "Implemented a caching layer with Redis that reduced database load by 60% during traffic spikes.",
        ],
      },
      {
        company: "Bluehaven Software",
        position: "Software Engineer",
        location: "Portland, OR",
        start: "Jun 2011",
        end: "Mar 2014",
        bullets: [
          "Developed the core API for a document collaboration platform serving 50k business users across 3 continents.",
          "Led the migration from a monolithic Rails app to a service-oriented architecture with 8 bounded services.",
        ],
      },
    ],
    skills: {
      category: "Engineering",
      items: [
        "Go",
        "Kubernetes",
        "PostgreSQL",
        "gRPC",
        "AWS",
        "Distributed Systems",
        "Terraform",
        "Observability",
      ],
    },
    projects: [
      {
        name: "Internal Platform CLI",
        start: "Feb 2022",
        end: "Sep 2022",
        bullets: [
          "Built a self-service CLI that automated environment provisioning, service scaffolding, and secret management for 200+ engineers.",
          "Reduced onboarding time for new services from 3 days to under an hour, measured across 40+ service creations in the first quarter.",
          "Designed the CLI as a plug-in system, enabling platform teams to add custom commands without modifying core code.",
        ],
      },
      {
        name: "Observability Stack Rollout",
        start: "Jan 2021",
        end: "Aug 2021",
        bullets: [
          "Rolled out distributed tracing with OpenTelemetry across 200+ services, cutting mean time to recovery from 90 minutes to 22 minutes.",
          "Built custom dashboards and SLO-based alerting that reduced noise from 200+ alerts per day to 15 actionable pages.",
        ],
      },
      {
        name: "Database Sharding Framework",
        start: "Jun 2020",
        end: "Dec 2020",
        bullets: [
          "Architected a generic sharding framework that was adopted by 4 product teams, supporting range-based and hash-based strategies.",
          "Sharded the primary user database from 2TB to 6 shards of 350GB each, eliminating quarterly migration windows.",
        ],
      },
    ],
    certs: [
      {
        name: "Certified Kubernetes Administrator",
        org: "CNCF",
        date: "Aug 2021",
      },
      {
        name: "AWS Certified Solutions Architect – Professional",
        org: "Amazon Web Services",
        date: "Feb 2020",
      },
      {
        name: "HashiCorp Terraform Associate",
        org: "HashiCorp",
        date: "May 2022",
      },
      {
        name: "Google Cloud Professional Data Engineer",
        org: "Google Cloud",
        date: "Nov 2019",
      },
    ],
    education: {
      name: "University of Washington",
      location: "Seattle, WA",
      start: "Sep 2007",
      end: "Jun 2011",
      degree: "B.S. in Computer Science & Engineering",
      gpa: "3.82 / 4.0",
      note: "Specialised in distributed systems and operating systems; senior capstone on a fault-tolerant key-value store published in the UW CSE technical report series.",
    },
  },
  {
    layoutId: "inset",
    presetId: "inset-steel",
    photo: "https://i.pravatar.cc/320?img=68",
    fullName: "Oliver Brandt",
    location: "Berlin, Germany",
    phone: "+49 30 1234 5678",
    email: "oliver.brandt@posteo.de",
    links: [
      "https://www.linkedin.com/in/oliverbrandt",
      "https://oliverbrandt.xyz",
    ],
    summary:
      "<p>Lead UX researcher blending qualitative depth with quantitative rigour. I turn evidence into product decisions that teams actually act on, and I build research practices that scale beyond a single squad. Experienced in health-tech and B2B SaaS with a focus on accessibility and inclusive design.</p>",
    work: [
      {
        company: "Atlas Health",
        position: "Lead UX Researcher",
        location: "Berlin, Germany",
        start: "Jul 2021",
        end: "current",
        bullets: [
          "Ran mixed-methods research that reshaped the care-navigation roadmap for 3 squads, influencing 15+ features that improved task success from 62% to 84%.",
          "Built a searchable research repository (Dovetail + Airtable) that doubled reuse of insights across teams and reduced duplicated studies by 40%.",
          "Mentored 2 junior researchers and standardized the team's study templates, consent forms, and analysis frameworks.",
          "Established a quarterly benchmark study across 6 core flows, tracking usability scores and driving continuous improvement.",
        ],
      },
      {
        company: "Modeo",
        position: "UX Researcher",
        location: "Berlin, Germany",
        start: "Sep 2017",
        end: "Jun 2021",
        bullets: [
          "Ran 100+ studies spanning discovery, usability, and concept testing across web and mobile platforms.",
          "Built and managed a 500-person research panel for rapid participant recruitment, reducing study setup time from 3 weeks to 3 days.",
          "Developed a research prioritisation framework aligned with product OKRs, ensuring the highest-impact questions were addressed first.",
        ],
      },
      {
        company: "Kontor Digital",
        position: "Research Assistant",
        location: "Berlin, Germany",
        start: "Sep 2015",
        end: "Aug 2017",
        bullets: [
          "Coordinated participant recruitment and research scheduling for a 6-person team, managing 40+ concurrent studies.",
          "Assisted with qualitative analysis, coding 200+ interview transcripts and synthesising findings into actionable reports.",
        ],
      },
    ],
    skills: {
      category: "UX Research",
      items: [
        "User Interviews",
        "Survey Design",
        "Usability Testing",
        "Dovetail",
        "Synthesis",
        "Workshops",
        "Quantitative Analysis",
        "ResearchOps",
      ],
    },
    projects: [
      {
        name: "Care Navigation Study",
        start: "Mar 2023",
        end: "Oct 2023",
        bullets: [
          "Led a 40-participant longitudinal diary study that uncovered 5 critical drop-off points in the patient care journey.",
          "Recommendations from the study shipped in 3 consecutive releases, improving overall task success from 62% to 84%.",
          "Presented findings to the executive team, securing buy-in and budget for a dedicated patient experience programme.",
        ],
      },
      {
        name: "Onboarding Benchmark",
        start: "Jan 2022",
        end: "Sep 2022",
        bullets: [
          "Established a quarterly usability benchmark across 6 core flows, with standardised tasks, metrics, and reporting templates.",
          "After 2 benchmark cycles, the team had addressed the top 10 usability issues, lifting mean SUS scores by 18 points.",
        ],
      },
      {
        name: "Accessibility Audit Programme",
        start: "Jan 2021",
        end: "Jun 2021",
        bullets: [
          "Audited the entire product against WCAG 2.1 AA standards, identifying 47 unique accessibility issues across 4 platforms.",
          "Partnered with design and engineering to prioritise fixes, achieving WCAG AA compliance certification within 6 months.",
        ],
      },
    ],
    certs: [
      {
        name: "UX Research Certification",
        org: "Nielsen Norman Group",
        date: "Jun 2021",
      },
      {
        name: "Qualtrics Research Core Expert",
        org: "Qualtrics",
        date: "Mar 2020",
      },
      {
        name: "Certified Usability Analyst",
        org: "Human Factors International",
        date: "Apr 2019",
      },
    ],
    education: {
      name: "Technische Universität Berlin",
      location: "Berlin, Germany",
      start: "Oct 2014",
      end: "Sep 2017",
      degree: "M.A. in Human Factors",
      gpa: "1.3 (German scale)",
      note: "Research focus on mixed-methods evaluation in digital health; thesis on trust calibration in AI-assisted diagnosis received the faculty's best-thesis award.",
    },
  },

  // ── Row 2: alt variants ────────────────────────────────────────────────────
  {
    layoutId: "classic",
    presetId: "classic-executive",
    photo: "https://i.pravatar.cc/320?img=11",
    fullName: "Ethan Foster",
    location: "Austin, TX",
    phone: "+1 (512) 555-0317",
    email: "ethan.foster@hey.com",
    links: [
      "https://www.linkedin.com/in/ethanfoster",
      "https://github.com/efoster",
    ],
    summary:
      "<p>Engineering manager with 10+ years building and leading distributed-systems teams. I combine hands-on technical depth with a passion for growing engineers through coaching, clear expectations, and psychological safety. I believe high-performing teams ship better systems and happier people.</p>",
    work: [
      {
        company: "Stellarite",
        position: "Engineering Manager",
        location: "Austin, TX",
        start: "Jun 2021",
        end: "current",
        bullets: [
          "Managed a team of 8 engineers owning the core platform API, delivering 3 major product launches on schedule while maintaining 99.99% uptime.",
          "Restructured the team from feature teams to stream-aligned teams, reducing handoff delays by 40% and improving cycle time by 35%.",
          "Introduced weekly one-on-ones, growth plans, and a structured promotion process that increased team retention from 70% to 94% over 2 years.",
          "Drove adoption of engineering KPIs (DORA metrics) across the organisation, making delivery performance visible and actionable.",
        ],
      },
      {
        company: "CloudPeak Networks",
        position: "Senior Software Engineer",
        location: "Austin, TX",
        start: "Mar 2017",
        end: "May 2021",
        bullets: [
          "Designed and built a multi-region event-ingestion pipeline handling 500k events/second with Kafka and Flink.",
          "Reduced infrastructure costs by 30% through right-sizing, reserved-instance planning, and adopting spot instances for batch workloads.",
          "Mentored 4 engineers through architecture reviews and code quality initiatives, 2 of whom were promoted to senior within 18 months.",
        ],
      },
      {
        company: "DataBridge Systems",
        position: "Software Engineer",
        location: "Austin, TX",
        start: "Apr 2014",
        end: "Feb 2017",
        bullets: [
          "Built real-time data synchronisation services between on-premise and cloud databases, handling 10TB+ daily transfers.",
          "Developed a circuit-breaker and retry framework that reduced inter-service failure cascades by 80%.",
        ],
      },
      {
        company: "CodeLabs Inc.",
        position: "Junior Software Engineer",
        location: "Dallas, TX",
        start: "Jun 2012",
        end: "Mar 2014",
        bullets: [
          "Developed RESTful microservices in Go and Python for a B2B inventory management platform serving 500+ retail clients.",
          "Built monitoring dashboards and alerting rules that reduced incident response time from 45 minutes to 12 minutes.",
        ],
      },
    ],
    skills: {
      category: "Engineering Leadership",
      items: [
        "Team Management",
        "System Design",
        "Go",
        "Kubernetes",
        "PostgreSQL",
        "Kafka",
        "AWS",
        "Coaching",
      ],
    },
    projects: [
      {
        name: "Platform Migration to Kubernetes",
        start: "Jan 2022",
        end: "Oct 2022",
        bullets: [
          "Led the migration of 30+ services from EC2-based deployment to EKS, achieving zero-downtime cutover with blue-green deployment strategies.",
          "Standardised Helm charts and CI/CD pipelines, reducing new-service deployment setup from 2 weeks to 2 hours.",
          "Trained 5 teams on Kubernetes best practices through workshops and office-hours support.",
        ],
      },
      {
        name: "Engineering Metrics Dashboard",
        start: "Jun 2021",
        end: "Nov 2021",
        bullets: [
          "Built an internal dashboard tracking DORA metrics, sprint health, and team sentiment across 10 engineering teams.",
          "The dashboard became the single source of truth for weekly leadership reviews and quarterly planning.",
        ],
      },
      {
        name: "Incident Response Revamp",
        start: "Feb 2020",
        end: "Jul 2020",
        bullets: [
          "Redesigned the incident response process, introducing severity classifications, escalation paths, and post-mortem templates.",
          "Reduced mean time to acknowledge from 15m to 3m and mean time to resolve from 90m to 38m over 6 months.",
        ],
      },
    ],
    certs: [
      {
        name: "AWS Certified Solutions Architect – Professional",
        org: "Amazon Web Services",
        date: "Mar 2022",
      },
      {
        name: "Certified Kubernetes Administrator",
        org: "CNCF",
        date: "Aug 2021",
      },
      {
        name: "Google Cloud Professional Cloud Architect",
        org: "Google Cloud",
        date: "Nov 2020",
      },
      {
        name: "ICAgile Certified Professional",
        org: "ICAgile",
        date: "Jun 2021",
      },
    ],
    education: {
      name: "University of Texas at Austin",
      location: "Austin, TX",
      start: "Aug 2008",
      end: "May 2012",
      degree: "B.S. in Computer Science",
      gpa: "3.75 / 4.0",
      note: "Specialised in distributed computing; capstone project on consensus algorithms implemented in Go. Led the UT CS student organisation for 2 years.",
    },
  },
  {
    layoutId: "sidebar",
    presetId: "sidebar-forest",
    photo: "https://i.pravatar.cc/320?img=51",
    fullName: "Liam Gallagher",
    location: "Toronto, ON",
    phone: "+1 (416) 555-0425",
    email: "liam.gallagher@outlook.com",
    links: [
      "https://www.linkedin.com/in/liamgallagher",
      "https://github.com/liamg",
    ],
    summary:
      "<p>DevOps engineer with 7 years building reliable, scalable infrastructure for SaaS platforms. I automate everything that can be automated and design systems that fail gracefully. I'm passionate about developer experience, observability, and building platforms that make teams productive and operations boring.</p>",
    work: [
      {
        company: "MapleCloud Services",
        position: "Senior DevOps Engineer",
        location: "Toronto, ON",
        start: "Jan 2022",
        end: "current",
        bullets: [
          "Designed and implemented a multi-cluster Kubernetes architecture across 3 cloud providers, supporting 99.99% uptime SLAs for 50+ microservices.",
          "Built a GitOps pipeline with ArgoCD that eliminated manual deployments, reducing deploy times from 30m to 8m and cutting rollback time to 2m.",
          "Reduced cloud infrastructure costs by $1.2M/year through right-sizing, spot-instance adoption, and commitment-based discounts.",
          "Mentored 4 engineers on DevOps practices, establishing guild sessions, brown-bag talks, and an internal DevOps certification track.",
        ],
      },
      {
        company: "Northbay Tech",
        position: "DevOps Engineer",
        location: "Toronto, ON",
        start: "Jun 2018",
        end: "Dec 2021",
        bullets: [
          "Led the migration from a monolithic data-centre deployment to AWS, achieving zero-downtime cutover for a 2M-user platform.",
          "Implemented comprehensive monitoring and alerting with Prometheus and Grafana, reducing MTTR from 90m to 25m.",
          "Automated CI/CD pipelines with GitHub Actions and Terraform, enabling 30+ developers to deploy independently with confidence.",
        ],
      },
      {
        company: "RocketShip SaaS",
        position: "Junior DevOps Engineer",
        location: "Toronto, ON",
        start: "May 2016",
        end: "May 2018",
        bullets: [
          "Containerised 15 legacy applications using Docker, standardising development environments and eliminating the 'works on my machine' problem.",
          "Built an internal tool for ephemeral preview environments per pull request, adopted by all 5 product teams.",
        ],
      },
    ],
    skills: {
      category: "DevOps",
      items: [
        "Kubernetes",
        "Terraform",
        "ArgoCD",
        "AWS",
        "Docker",
        "Prometheus",
        "GitHub Actions",
        "Linux",
      ],
    },
    projects: [
      {
        name: "Multi-Cloud DR Strategy",
        start: "Mar 2023",
        end: "Dec 2023",
        bullets: [
          "Designed and validated a multi-region disaster recovery plan spanning 2 cloud providers with RPO of 5 minutes and RTO of 30 minutes.",
          "Automated failover drills that ran quarterly, reducing exercise time from 2 days to 4 hours while increasing coverage from 40% to 90% of critical services.",
        ],
      },
      {
        name: "Secrets Management Platform",
        start: "Jan 2022",
        end: "Jun 2022",
        bullets: [
          "Deployed HashiCorp Vault with dynamic secrets generation for database credentials and API keys across 200+ services.",
          "Replaced hardcoded secrets with Vault agent sidecars, passing a SOC 2 audit with zero findings related to secrets management.",
        ],
      },
      {
        name: "Observability Stack Upgrade",
        start: "May 2021",
        end: "Nov 2021",
        bullets: [
          "Upgraded the logging stack from ELK to Loki + Grafana, reducing log storage costs by 60% while maintaining 30-day retention.",
          "Built custom dashboards for each engineering team's SLOs and error budgets, enabling data-driven reliability decisions.",
        ],
      },
      {
        name: "Infrastructure as Code Migration",
        start: "Feb 2020",
        end: "Aug 2020",
        bullets: [
          "Migrated 500+ AWS resources from CloudFormation to Terraform with zero downtime, standardising modules across all teams.",
          "Created a Terraform module registry used by 8 teams, reducing infrastructure setup time from weeks to hours.",
        ],
      },
    ],
    certs: [
      {
        name: "AWS Certified DevOps Engineer – Professional",
        org: "Amazon Web Services",
        date: "Nov 2022",
      },
      {
        name: "Certified Kubernetes Administrator",
        org: "CNCF",
        date: "May 2021",
      },
      {
        name: "HashiCorp Certified: Terraform Associate",
        org: "HashiCorp",
        date: "Mar 2021",
      },
      {
        name: "CKA: Certified Kubernetes Application Developer",
        org: "CNCF",
        date: "Jan 2020",
      },
    ],
    education: {
      name: "University of Toronto",
      location: "Toronto, ON",
      start: "Sep 2012",
      end: "Jun 2016",
      degree: "B.A.Sc. in Computer Engineering",
      gpa: "3.70 / 4.00",
      note: "Focused on networking and distributed systems; thesis on software-defined networking for data centres. Co-captain of the university's cybersecurity competition team.",
    },
  },
  {
    layoutId: "modern-centered",
    presetId: "centered-editorial",
    photo: "https://i.pravatar.cc/320?img=53",
    fullName: "Jack Morrison",
    location: "San Diego, CA",
    phone: "+1 (619) 555-0382",
    email: "jack.morrison@gmail.com",
    links: [
      "https://www.linkedin.com/in/jackmorrison",
      "https://jackmorrison.io",
    ],
    summary:
      "<p>Product manager with 8 years shipping developer tools and SaaS platforms. I bridge technical depth with user empathy to build products that solve real problems. I'm experienced in the full product lifecycle from customer discovery through launch and iteration, with a track record of growing products from zero to millions in ARR.</p>",
    work: [
      {
        company: "CodeStream",
        position: "Senior Product Manager",
        location: "San Diego, CA",
        start: "Feb 2021",
        end: "current",
        bullets: [
          "Owned the product strategy for a developer collaboration platform, growing ARR from $800k to $4.2M over 3 years through new features and market expansion.",
          "Led discovery for a code review AI assistant that became the highest-converting feature in the product, with 40% of new trials citing it as the primary reason for purchasing.",
          "Established a continuous discovery practice with weekly customer interviews, reducing feature rejection rate from 45% to 12%.",
          "Collaborated with engineering to implement a phased rollout strategy that reduced regression incidents by 60% while accelerating release frequency from monthly to weekly.",
        ],
      },
      {
        company: "Vector Labs",
        position: "Product Manager",
        location: "San Diego, CA",
        start: "May 2017",
        end: "Jan 2021",
        bullets: [
          "Launched an API analytics product from concept to GA, achieving 500+ paying customers and $1.2M ARR within 18 months.",
          "Prioritised and shipped 30+ features in the first year by running structured opportunity-solution trees and quarterly OKR planning.",
          "Partnered with marketing to create developer-focused content (docs, tutorials, reference apps) that drove a 3x increase in organic signups.",
        ],
      },
      {
        company: "Brightbyte",
        position: "Associate Product Manager",
        location: "San Diego, CA",
        start: "Aug 2015",
        end: "Apr 2017",
        bullets: [
          "Managed the API integration layer for a payment processing platform, onboarding 15 major enterprise partners.",
          "Defined and tracked product KPIs (activation, retention, NPS) that informed roadmap decisions and quarterly priorities.",
        ],
      },
    ],
    skills: {
      category: "Product Management",
      items: [
        "Product Strategy",
        "User Research",
        "A/B Testing",
        "SQL",
        "Analytics",
        "Roadmapping",
        "API Design",
        "Cross-functional Leadership",
      ],
    },
    projects: [
      {
        name: "Code Review AI Assistant",
        start: "Mar 2023",
        end: "Feb 2024",
        bullets: [
          "Led the discovery, prototyping, and launch of an AI-powered code review assistant that suggests improvements inline.",
          "Achieved 35% adoption among active users within 3 months, with an average rating of 4.6 / 5 in user satisfaction surveys.",
          "The feature contributed to a 28% increase in trial-to-paid conversion for teams evaluating the platform.",
        ],
      },
      {
        name: "Market Expansion to Enterprise",
        start: "Jan 2022",
        end: "Dec 2022",
        bullets: [
          "Developed and executed the enterprise go-to-market strategy, including SSO, RBAC, and audit-log features required by procurement teams.",
          "Closed 3 Fortune 500 accounts in the first 6 months, contributing $600k in new ARR and validating the enterprise segment.",
        ],
      },
      {
        name: "Developer Onboarding Revamp",
        start: "May 2021",
        end: "Oct 2021",
        bullets: [
          "Redesigned the developer onboarding flow based on 40 customer interviews and usability tests, improving time-to-first-API-call from 4 hours to 25 minutes.",
          "The improved onboarding drove a 22% increase in 7-day activation rates and reduced support tickets related to setup by 45%.",
        ],
      },
    ],
    certs: [
      {
        name: "Certified Scrum Product Owner",
        org: "Scrum Alliance",
        date: "Feb 2020",
      },
      {
        name: "Google Project Management Certificate",
        org: "Google",
        date: "Aug 2021",
      },
      { name: "Reforge Product Strategy", org: "Reforge", date: "May 2022" },
      {
        name: "AWS Cloud Practitioner",
        org: "Amazon Web Services",
        date: "Nov 2020",
      },
    ],
    education: {
      name: "University of California, San Diego",
      location: "San Diego, CA",
      start: "Sep 2009",
      end: "Jun 2013",
      degree: "B.S. in Cognitive Science (Specialisation in HCI)",
      gpa: "3.65 / 4.0",
      note: "Minor in Computer Science; designed and evaluated a collaborative coding tool for the senior HCI capstone, winning the department's innovation award.",
    },
  },
  {
    layoutId: "timeline",
    presetId: "timeline-amber",
    photo: "https://i.pravatar.cc/320?img=61",
    fullName: "Benjamin Cole",
    location: "Chicago, IL",
    phone: "+1 (312) 555-0291",
    email: "benjamin.cole@hey.com",
    links: [
      "https://www.linkedin.com/in/benjamincole",
      "https://github.com/bcole",
    ],
    summary:
      "<p>Quantitative analyst turned data engineer with 6 years building data pipelines and financial models. I bridge the gap between quantitative research and production engineering, turning complex models into reliable, well-tested systems. I focus on data quality, reproducibility, and building infrastructure that scales with the business.</p>",
    work: [
      {
        company: "Crossvine Capital",
        position: "Senior Data Engineer",
        location: "Chicago, IL",
        start: "Jul 2021",
        end: "current",
        bullets: [
          "Built a real-time market data pipeline processing 10M+ events per second using Kafka, Flink, and Delta Lake, reducing end-to-end latency from 30s to 2s.",
          "Designed a data quality framework that automated schema validation and anomaly detection, catching 95% of data issues before they reached downstream models.",
          "Led the migration of on-premise data warehouse to Snowflake, cutting query costs by 40% and enabling self-serve analytics for 50+ users.",
          "Mentored 3 data engineers through a structured growth programme, with 2 promoted to senior within 18 months.",
        ],
      },
      {
        company: "Meridian Alpha",
        position: "Data Engineer",
        location: "Chicago, IL",
        start: "Sep 2018",
        end: "Jun 2021",
        bullets: [
          "Developed ETL pipelines aggregating trade, risk, and reference data from 20+ sources into a unified analytics platform.",
          "Reduced pipeline failure rate from 15% to 0.5% by implementing idempotent processing, dead-letter queues, and automated retries.",
          "Collaborated with quantitative researchers to deploy production versions of research models, improving model deployment velocity by 3x.",
        ],
      },
      {
        company: "Lakefront Analytics",
        position: "Data Analyst",
        location: "Chicago, IL",
        start: "Jul 2016",
        end: "Aug 2018",
        bullets: [
          "Built reporting dashboards and ad-hoc analyses for the investment team, supporting portfolio decisions with 200+ reports delivered monthly.",
          "Developed a Python library for automated SEC filing parsing that saved 20 hours of manual work per quarter.",
        ],
      },
    ],
    skills: {
      category: "Data Engineering",
      items: [
        "Python",
        "SQL",
        "Kafka",
        "Spark",
        "Snowflake",
        "Airflow",
        "dbt",
        "Delta Lake",
      ],
    },
    projects: [
      {
        name: "Market Data Lake",
        start: "Apr 2023",
        end: "Mar 2024",
        bullets: [
          "Architected a data lake on AWS S3 + Delta Lake storing 500TB of historical market data with partition pruning and Z-order optimisation.",
          "Reduced ad-hoc query times from 45 minutes to under 2 minutes through careful partitioning and materialised aggregations.",
          "Built a data catalog with Apache Atlas that enabled data discovery and lineage tracking across all engineering teams.",
        ],
      },
      {
        name: "Real-Time Risk Dashboard",
        start: "Jan 2022",
        end: "Sep 2022",
        bullets: [
          "Built a real-time risk exposure dashboard streaming portfolio data at 1-second intervals using Kafka + WebSockets.",
          "The dashboard became the primary tool for the risk committee, replacing a batch-report system that had a 4-hour delay.",
        ],
      },
      {
        name: "Data Pipeline Monitoring",
        start: "May 2021",
        end: "Oct 2021",
        bullets: [
          "Implemented end-to-end pipeline monitoring with Great Expectations and Datadog, tracking data freshness, row counts, and schema changes.",
          "Reduced data incident detection time from hours to minutes, enabling the team to resolve issues before downstream consumers were affected.",
        ],
      },
    ],
    certs: [
      {
        name: "AWS Certified Data Analytics – Specialty",
        org: "Amazon Web Services",
        date: "Sep 2022",
      },
      {
        name: "Snowflake SnowPro Advanced: Data Engineer",
        org: "Snowflake",
        date: "Mar 2023",
      },
      {
        name: "Confluent Certified Developer for Apache Kafka",
        org: "Confluent",
        date: "Jan 2022",
      },
    ],
    education: {
      name: "University of Chicago",
      location: "Chicago, IL",
      start: "Sep 2014",
      end: "Jun 2016",
      degree: "M.S. in Computational Analytics",
      gpa: "3.85 / 4.0",
      note: "Focused on large-scale data systems and machine learning; thesis on real-time anomaly detection in financial time series using streaming algorithms. Research assistant in the Data Science Institute.",
    },
  },
  {
    layoutId: "academic",
    presetId: "academic-burgundy",
    photo: "https://i.pravatar.cc/320?img=53",
    fullName: "Thomas Whitfield",
    location: "Cambridge, UK",
    phone: "+44 1223 555 0135",
    email: "thomas.whitfield@cantab.ac.uk",
    links: [
      "https://www.linkedin.com/in/thomaswhitfield",
      "https://thomaswhitfield.cam",
    ],
    summary:
      "<p>Computational biologist with a decade of experience developing algorithms and pipelines for large-scale genomic data. I work at the intersection of statistics, machine learning, and biology to accelerate drug discovery. Passionate about open-source scientific software and reproducible research practices.</p>",
    work: [
      {
        company: "Cambridge Institute for Medical Research",
        position: "Senior Research Associate",
        location: "Cambridge, UK",
        start: "Oct 2020",
        end: "current",
        bullets: [
          "Lead the development of a cloud-based variant-analysis pipeline processing 10k+ whole-genome sequences per month, used by 15 research groups across the UK.",
          "Published 6 peer-reviewed papers in high-impact journals (Nature Genetics, Bioinformatics) as first or senior author.",
          "Wrote an open-source Python library for statistical genetics (2k+ GitHub stars) that has been integrated into the analysis workflows of 3 pharmaceutical companies.",
          "Supervised 3 PhD students and 4 master's theses on topics ranging from polygenic risk scores to single-cell analysis.",
        ],
      },
      {
        company: "Wellcome Sanger Institute",
        position: "Bioinformatics Scientist",
        location: "Cambridge, UK",
        start: "Jan 2016",
        end: "Sep 2020",
        bullets: [
          "Developed parallelised algorithms for population-scale variant calling, reducing analysis time for 50k samples from 2 weeks to 36 hours.",
          "Contributed to the development of a widely-used genome annotation pipeline, cited in 200+ research publications.",
          "Presented research at 8 international conferences, including ISMB and ASHG, with 3 invited talks.",
        ],
      },
      {
        company: "European Bioinformatics Institute (EMBL-EBI)",
        position: "Research Assistant",
        location: "Hinxton, UK",
        start: "Sep 2013",
        end: "Dec 2015",
        bullets: [
          "Built and maintained automated quality-assurance pipelines for the European Genome-phenome Archive, processing 5TB+ of data per week.",
          "Contributed to the development of a metadata standard that became an international community norm for genomic data sharing.",
        ],
      },
    ],
    skills: {
      category: "Bioinformatics",
      items: [
        "Python",
        "R",
        "Nextflow",
        "Statistical Genetics",
        "Machine Learning",
        "Docker",
        "GWAS",
        "Single-Cell Analysis",
      ],
    },
    projects: [
      {
        name: "Cloud Genomics Platform",
        start: "Jan 2022",
        end: "Dec 2023",
        bullets: [
          "Designed and deployed a cloud-native genomics analysis platform on AWS using Terraform, Nextflow, and Spot Instances, reducing analysis costs by 60%.",
          "The platform was adopted by 5 external research groups and processed 15k whole-genome samples in its first year of operation.",
        ],
      },
      {
        name: "Polygenic Risk Score Toolkit",
        start: "Mar 2021",
        end: "Sep 2022",
        bullets: [
          "Developed and released an open-source Python toolkit for polygenic risk score calculation and validation (2k+ GitHub stars).",
          "The toolkit was featured in a Nature Reviews Genetics methods review article and is used by 50+ research groups worldwide.",
        ],
      },
      {
        name: "Single-Cell RNA-seq Pipeline",
        start: "Jun 2020",
        end: "Feb 2021",
        bullets: [
          "Built a scalable single-cell RNA-seq analysis pipeline using Scanpy and Nextflow, processing 1M+ cells per batch with automated quality reports.",
          "The pipeline was adopted as the standard analysis workflow by the institute, serving 20+ research groups.",
        ],
      },
      {
        name: "Reproducibility Initiative",
        start: "Sep 2019",
        end: "Mar 2020",
        bullets: [
          "Led a lab-wide initiative to containerise all analysis pipelines with Docker and package them with CWL descriptors.",
          "Achieved 100% containerisation of active pipelines and reduced environment-related reproducibility issues by 80%.",
        ],
      },
    ],
    certs: [
      {
        name: "AWS Certified Solutions Architect – Associate",
        org: "Amazon Web Services",
        date: "Jun 2021",
      },
      {
        name: "Coursera Deep Learning Specialisation",
        org: "DeepLearning.AI",
        date: "Mar 2020",
      },
      {
        name: "Software Carpentry Instructor",
        org: "The Carpentries",
        date: "Nov 2018",
      },
      {
        name: "Reproducible Research with R",
        org: "Coursera / Johns Hopkins",
        date: "Aug 2017",
      },
    ],
    education: {
      name: "University of Cambridge",
      location: "Cambridge, UK",
      start: "Sep 2010",
      end: "Jun 2014",
      degree: "Ph.D. in Computational Biology",
      gpa: "—",
      note: "Dissertation on statistical methods for rare-variant association studies. Developed a novel Bayesian framework for gene-based testing that improved power by 30% over existing methods. Published 4 first-author papers from the thesis.",
    },
  },
  {
    layoutId: "minimal",
    presetId: "minimal-warm",
    photo: "https://i.pravatar.cc/320?img=55",
    fullName: "Nathan Cross",
    location: "Denver, CO",
    phone: "+1 (303) 555-0462",
    email: "nathan.cross@proton.me",
    links: [
      "https://www.linkedin.com/in/nathancross",
      "https://nathancross.dev",
    ],
    summary:
      "<p>Solutions architect with 9 years designing and delivering enterprise SaaS platforms. I bridge the gap between business requirements and technical implementation, translating complex stakeholder needs into scalable, maintainable architectures. I thrive on understanding customer workflows and crafting systems that elegantly solve real problems.</p>",
    work: [
      {
        company: "VanguardStack",
        position: "Staff Solutions Architect",
        location: "Denver, CO",
        start: "Aug 2020",
        end: "current",
        bullets: [
          "Designed the enterprise architecture for a multi-tenant SaaS platform handling 5M+ API requests per day, achieving 99.95% uptime across 3 regions.",
          "Led technical pre-sales engagements with 20+ enterprise prospects, contributing to $8M in closed new revenue over 2 years.",
          "Established a solution-review board that standardised architectural decisions across 8 product teams, reducing cross-team integration issues by 55%.",
          "Created and delivered a quarterly architecture training series that was attended by 60+ engineers and earned a 4.8 / 5 satisfaction rating.",
        ],
      },
      {
        company: "Peakflow Technologies",
        position: "Senior Software Engineer",
        location: "Denver, CO",
        start: "Mar 2017",
        end: "Jul 2020",
        bullets: [
          "Led the architecture and implementation of a real-time inventory management service for a B2B supply chain platform serving 2k+ businesses.",
          "Designed an event-sourced CQRS system that improved write throughput by 10x while maintaining strong consistency guarantees.",
          "Mentored 5 engineers through the promotion process to senior engineer, with a 100% promotion rate over 3 years.",
        ],
      },
      {
        company: "Summit Logic",
        position: "Software Engineer",
        location: "Denver, CO",
        start: "May 2014",
        end: "Feb 2017",
        bullets: [
          "Built RESTful microservices in Java and Python for a healthcare claims processing platform handling 500k claims per day.",
          "Implemented a distributed caching strategy with Redis that reduced average API response time from 600ms to 80ms.",
        ],
      },
      {
        company: "Frontier Software",
        position: "Junior Software Engineer",
        location: "Boulder, CO",
        start: "Jun 2012",
        end: "Apr 2014",
        bullets: [
          "Developed web applications for municipal government clients, delivering 5 projects on time and under budget.",
          "Wrote automated test suites that increased test coverage from 25% to 85% across the team's primary projects.",
        ],
      },
    ],
    skills: {
      category: "Solutions Architecture",
      items: [
        "System Design",
        "AWS",
        "TypeScript",
        "PostgreSQL",
        "Event-Driven Architecture",
        "Enterprise Integration",
        "Technical Sales",
        "API Design",
      ],
    },
    projects: [
      {
        name: "Enterprise SSO Integration",
        start: "Mar 2023",
        end: "Nov 2023",
        bullets: [
          "Designed and implemented a multi-protocol SSO gateway supporting SAML, OIDC, and LDAP for a B2B SaaS platform.",
          "The integration was certified by Okta and Azure AD, becoming a requirement listed in 80% of enterprise procurement RFPs.",
        ],
      },
      {
        name: "Multi-Tenant Data Isolation",
        start: "Jun 2022",
        end: "Dec 2022",
        bullets: [
          "Architected a row-level security model in Postgres that ensured strict tenant data isolation while enabling cross-tenant analytics.",
          "The solution passed a SOC 2 Type II audit with zero findings related to data segregation and was adopted as the company-wide standard.",
        ],
      },
      {
        name: "API Rate Limiting Platform",
        start: "Jan 2021",
        end: "Jun 2021",
        bullets: [
          "Designed and implemented a distributed rate-limiting platform using Redis + Lua scripting, handling 100k+ requests per second.",
          "The platform supported multiple rate-limit strategies (fixed window, sliding window, token bucket) configurable per API key.",
        ],
      },
      {
        name: "Developer Portal",
        start: "Feb 2020",
        end: "Oct 2020",
        bullets: [
          "Built a developer portal with interactive API docs, SDK generation, and an API key management dashboard.",
          "The portal reduced developer onboarding time from 2 weeks to 2 days for new integration partners.",
        ],
      },
    ],
    certs: [
      {
        name: "AWS Certified Solutions Architect – Professional",
        org: "Amazon Web Services",
        date: "Mar 2023",
      },
      {
        name: "Google Cloud Professional Cloud Architect",
        org: "Google Cloud",
        date: "Aug 2022",
      },
      { name: "TOGAF 9 Certified", org: "The Open Group", date: "Jan 2022" },
      {
        name: "Microsoft Certified: Azure Solutions Architect Expert",
        org: "Microsoft",
        date: "Jun 2021",
      },
    ],
    education: {
      name: "University of Colorado Boulder",
      location: "Boulder, CO",
      start: "Aug 2008",
      end: "May 2012",
      degree: "B.S. in Computer Science",
      gpa: "3.80 / 4.0",
      note: "Emphasis on software engineering and databases; senior project on fault-tolerant distributed task scheduling. Active in the CU Collegiate Cyber Defense Club, winning 1st place in the regional CCDC competition.",
    },
  },
  {
    layoutId: "inset",
    presetId: "inset-crimson",
    photo: "https://i.pravatar.cc/320?img=67",
    fullName: "Samuel Pierce",
    location: "Portland, OR",
    phone: "+1 (503) 555-0334",
    email: "samuel.pierce@gmail.com",
    links: [
      "https://www.linkedin.com/in/samuelpierce",
      "https://samuelpierce.design",
    ],
    summary:
      "<p>Brand and visual designer with 7 years crafting identities and digital experiences for consumer brands. I combine a craft-oriented approach to typography and color with a strategic understanding of brand systems. I help startups and scale-ups build cohesive visual languages that differentiate them in crowded markets.</p>",
    work: [
      {
        company: "Evergreen Studio",
        position: "Lead Brand Designer",
        location: "Portland, OR",
        start: "Sep 2021",
        end: "current",
        bullets: [
          "Led brand identity projects for 15+ clients spanning tech, CPG, and hospitality, contributing to $3M in annual studio revenue.",
          "Developed a systematic brand identity framework that reduced project delivery time by 30% while maintaining design quality.",
          "Mentored 3 junior designers through structured critiques, skill-building sessions, and career development conversations.",
          "Directed photoshoots and collaborated with illustrators, copywriters, and strategists to deliver cohesive brand stories.",
        ],
      },
      {
        company: "North & Pine Creative",
        position: "Brand Designer",
        location: "Portland, OR",
        start: "Mar 2018",
        end: "Aug 2021",
        bullets: [
          "Designed logos, typography systems, colour palettes, and brand guidelines for 20+ startups during their seed to Series A stages.",
          "Created a modular template system for brand deliverables that allowed the studio to take on 3x more projects without scaling headcount.",
          "Won a GDUSA American Web Design Award for a B2B SaaS brand identity redesign.",
        ],
      },
      {
        company: "Cascade Creative",
        position: "Junior Designer",
        location: "Portland, OR",
        start: "Jun 2015",
        end: "Feb 2018",
        bullets: [
          "Produced visual assets for social media campaigns that achieved an average engagement rate 2.5x above industry benchmarks.",
          "Assisted in rebranding a regional bank, contributing to the visual identity that was rolled out across 50+ branches.",
        ],
      },
    ],
    skills: {
      category: "Brand Design",
      items: [
        "Visual Identity",
        "Typography",
        "Color Theory",
        "Figma",
        "Adobe Creative Suite",
        "Brand Strategy",
        "Art Direction",
        "Motion Design",
      ],
    },
    projects: [
      {
        name: "Startup Brand Launch",
        start: "Feb 2023",
        end: "Sep 2023",
        bullets: [
          "Developed the complete brand identity for a Series A climate-tech startup, including logo, typography, colour system, illustration style, and guidelines.",
          "The brand launched to positive coverage in TechCrunch and Fast Company, with the website redesign achieving a 40% lower bounce rate.",
        ],
      },
      {
        name: "Design System for Non-Designers",
        start: "May 2022",
        end: "Dec 2022",
        bullets: [
          "Created a comprehensive brand design system in Figma with reusable components, auto-layout templates, and detailed documentation for non-design team members.",
          "Adopted by the marketing team, the system reduced time-to-create social assets from 3 hours to 30 minutes.",
        ],
      },
      {
        name: "Rebrand Strategy Project",
        start: "Jan 2021",
        end: "Jun 2021",
        bullets: [
          "Led a full rebrand for a 50-person SaaS company, from research and positioning through visual identity and launch.",
          "The rebrand contributed to a 35% increase in inbound demo requests and a 15% lift in brand recall scores in post-launch surveys.",
        ],
      },
      {
        name: "Sustainable Packaging Redesign",
        start: "Aug 2020",
        end: "Jan 2021",
        bullets: [
          "Designed eco-friendly packaging for a direct-to-consumer brand that reduced material costs by 22% and plastic usage by 90%.",
          "The packaging redesign was featured in a Dieline packaging design article and won a GDUSA Package Design Award.",
        ],
      },
    ],
    certs: [
      {
        name: "Brand Strategy Certificate",
        org: "DMI (Design Management Institute)",
        date: "Nov 2022",
      },
      {
        name: "Advanced Typography",
        org: "Cooper Union Continuing Education",
        date: "May 2021",
      },
      {
        name: "Certified Figma Expert (Advanced Prototyping)",
        org: "Figma",
        date: "Jan 2023",
      },
    ],
    education: {
      name: "Pacific Northwest College of Art",
      location: "Portland, OR",
      start: "Sep 2011",
      end: "May 2015",
      degree: "B.F.A. in Graphic Design",
      gpa: "3.90 / 4.0",
      note: "Valedictorian of the graduating class; thesis project on generative brand systems was exhibited at the Portland Art Museum's annual design showcase. Awarded the department's excellence in design scholarship.",
    },
  },

  // ── New templates: banner ──────────────────────────────────────────────────
  {
    layoutId: "banner",
    presetId: "banner-royal",
    photo: "https://i.pravatar.cc/320?img=12",
    fullName: "Kyle Anderson",
    location: "Los Angeles, CA",
    phone: "+1 (323) 555-0173",
    email: "kyle.anderson@hey.com",
    links: [
      "https://www.linkedin.com/in/kyleanderson",
      "https://kyleanderson.studio",
    ],
    summary:
      "<p>Creative director with 10+ years shaping brand narratives for entertainment and tech clients. I blend strategic thinking with hands-on design execution, leading multidisciplinary teams to produce award-winning campaigns. I believe great creative is grounded in sharp briefs, rigorous craft, and a willingness to take calculated risks.</p>",
    work: [
      {
        company: "Sonder Creative Agency",
        position: "Creative Director",
        location: "Los Angeles, CA",
        start: "Jun 2020",
        end: "current",
        bullets: [
          "Led creative strategy and execution for 30+ campaigns across entertainment, fashion, and SaaS clients, generating $8M in annual billings.",
          "Grew the agency's creative team from 6 to 18, establishing a career ladder, review cadence, and mentorship programme that improved retention by 35%.",
          "Directed a brand campaign for a major streaming platform that won a Gold Clio and drove a 22% lift in subscriber awareness.",
          "Introduced a structured creative development process that reduced iteration cycles from 5 rounds to 2 while improving client satisfaction scores.",
        ],
      },
      {
        company: "Magnet Media",
        position: "Associate Creative Director",
        location: "Los Angeles, CA",
        start: "Apr 2016",
        end: "May 2020",
        bullets: [
          "Conceptualised and produced integrated campaigns for 12 national brands, managing budgets from $200k to $2M.",
          "Built a motion design capability from scratch, hiring 4 directors and winning 3 new clients in the first year.",
          "Collaborated with strategy and production teams to deliver a Super Bowl commercial that ranked in the top 5 most recalled ads.",
        ],
      },
      {
        company: "Bright Idea Studio",
        position: "Senior Designer",
        location: "Los Angeles, CA",
        start: "Aug 2012",
        end: "Mar 2016",
        bullets: [
          "Designed visual identities and campaign assets for startup and mid-market clients across tech, CPG, and hospitality.",
          "Won 2 Communication Arts awards for a brand identity project that was featured in the annual design annual.",
        ],
      },
      {
        company: "Firebrand Collective",
        position: "Junior Designer",
        location: "Los Angeles, CA",
        start: "Jun 2010",
        end: "Jul 2012",
        bullets: [
          "Produced digital and print assets for a portfolio of 15+ clients in the music and lifestyle space.",
          "Assisted on photoshoots and post-production, developing a keen eye for art direction and colour grading.",
        ],
      },
    ],
    skills: {
      category: "Creative Direction",
      items: [
        "Brand Strategy",
        "Art Direction",
        "Campaign Development",
        "Motion Design",
        "Copywriting",
        "Team Leadership",
        "Client Presentations",
        "Adobe Creative Suite",
      ],
    },
    projects: [
      {
        name: "Streaming Platform Rebrand",
        start: "Mar 2023",
        end: "Feb 2024",
        bullets: [
          "Led the creative direction for a global rebrand of a major streaming platform, overseeing a team of 20 across strategy, design, and production.",
          "The campaign launched across 12 markets with a unified creative system, achieving a 34% increase in unaided brand recall.",
          "Won Gold at the Clio Awards and Silver at Cannes Lions in the Brand Experience category.",
        ],
      },
      {
        name: "In-House Agency Build",
        start: "Jan 2022",
        end: "Oct 2022",
        bullets: [
          "Designed and implemented the operating model for the agency's in-house creative team, including workflows, tooling, and resourcing processes.",
          "Reduced external agency spend by $1.5M annually while increasing output velocity by 40%.",
        ],
      },
      {
        name: "Fashion Brand Launch",
        start: "Jun 2021",
        end: "Dec 2021",
        bullets: [
          "Directed the full creative launch for a direct-to-consumer fashion brand, from brand identity and packaging to digital campaigns and runway show.",
          "The launch exceeded first-year revenue targets by 25% and was featured in Vogue and GQ.",
        ],
      },
      {
        name: "Creative Tooling Overhaul",
        start: "Jan 2020",
        end: "May 2020",
        bullets: [
          "Led the agency's transition from Adobe Creative Suite–only workflows to a Figma-centric pipeline, improving cross-disciplinary collaboration.",
          "Trained 25+ creatives on the new tooling, resulting in a 30% reduction in asset production time.",
        ],
      },
    ],
    certs: [
      {
        name: "Certified Brand Strategist",
        org: "DMI (Design Management Institute)",
        date: "Jun 2022",
      },
      {
        name: "Creative Leadership Certificate",
        org: "Adweek Academy",
        date: "Mar 2021",
      },
      {
        name: "Adobe Certified Professional – Visual Design",
        org: "Adobe",
        date: "Sep 2020",
      },
      { name: "Clio Awards Jury Member", org: "Clio Awards", date: "Jan 2023" },
    ],
    education: {
      name: "ArtCenter College of Design",
      location: "Pasadena, CA",
      start: "Sep 2006",
      end: "May 2010",
      degree: "B.F.A. in Graphic Design",
      gpa: "3.85 / 4.0",
      note: "Focus on branding and advertising; senior thesis on the role of generational aesthetics in brand loyalty. Interned at an agency where two spec campaigns were picked up by paying clients.",
    },
  },
  {
    layoutId: "split",
    presetId: "split-midnight",
    photo: "https://i.pravatar.cc/320?img=68",
    fullName: "Patrick Sullivan",
    location: "Austin, TX",
    phone: "+1 (512) 555-0287",
    email: "patrick.sullivan@gmail.com",
    links: [
      "https://www.linkedin.com/in/patricksullivan",
      "https://github.com/psullivan",
    ],
    summary:
      "<p>Full-stack software engineer with 8 years building consumer and SaaS products from concept to scale. I move fluidly across frontend, backend, and infrastructure, and I care deeply about developer experience, testing, and shipping code that's a pleasure to maintain. I thrive in early-stage environments where ownership and impact are high.</p>",
    work: [
      {
        company: "Rivet Software",
        position: "Senior Full-Stack Engineer",
        location: "Austin, TX",
        start: "Sep 2021",
        end: "current",
        bullets: [
          "Built the initial product and scaled it from 0 to 50k users as the third engineering hire, owning the full stack from React frontend to Postgres + Go backend.",
          "Designed and implemented a real-time collaboration engine using WebSockets and CRDTs, enabling multi-user document editing with sub-100ms latency.",
          "Established engineering practices: CI/CD pipeline, code review standards, incident response runbook, and a testing culture that achieved 90% coverage.",
          "Interviewed and onboarded 12 engineers, shaping the engineering team's culture and technical direction from the ground up.",
        ],
      },
      {
        company: "Greenline Financial",
        position: "Full-Stack Engineer",
        location: "Austin, TX",
        start: "Jan 2018",
        end: "Aug 2021",
        bullets: [
          "Led the frontend architecture for a personal finance app serving 500k users, migrating from a legacy jQuery codebase to React + TypeScript.",
          "Designed a GraphQL API layer that unified 6 disparate backend services, reducing frontend data-fetch complexity by 60%.",
          "Implemented a feature flag system that enabled trunk-based development for a team of 15 engineers, cutting release cycle from 3 weeks to 3 days.",
        ],
      },
      {
        company: "Kickstand Digital",
        position: "Software Engineer",
        location: "Austin, TX",
        start: "Mar 2016",
        end: "Dec 2017",
        bullets: [
          "Built and maintained web applications for 8 agency clients across healthcare, education, and e-commerce verticals.",
          "Developed a reusable internal starter kit (React + Node + Postgres) that reduced project setup time by 50% across the engineering team.",
        ],
      },
      {
        company: "Startup Studio",
        position: "Junior Developer",
        location: "Austin, TX",
        start: "Jun 2014",
        end: "Feb 2016",
        bullets: [
          "Contributed to 4 early-stage startup products, shipping production code across frontend, backend, and cloud infrastructure.",
          "Built automated end-to-end test suites using Cypress that caught 30+ regressions before they reached production.",
        ],
      },
    ],
    skills: {
      category: "Full-Stack Engineering",
      items: [
        "React",
        "TypeScript",
        "Go",
        "PostgreSQL",
        "GraphQL",
        "Docker",
        "AWS",
        "Elixir",
      ],
    },
    projects: [
      {
        name: "Real-Time Collaboration Engine",
        start: "Feb 2023",
        end: "Dec 2023",
        bullets: [
          "Designed and implemented a CRDT-based collaboration engine from scratch, supporting concurrent editing with automatic conflict resolution.",
          "Achieved sub-100ms sync latency across US and EU regions using WebSockets with backpressure-aware message batching.",
        ],
      },
      {
        name: "API Gateway Rewrite",
        start: "Apr 2022",
        end: "Sep 2022",
        bullets: [
          "Rewrote the API gateway in Go, reducing p99 latency from 450ms to 80ms and cutting infrastructure costs by 35% through efficient connection pooling.",
          "Implemented rate limiting, authentication, and request logging as middleware, following a plugin architecture that made adding new policies straightforward.",
        ],
      },
      {
        name: "Developer Onboarding Platform",
        start: "Jan 2021",
        end: "Jun 2021",
        bullets: [
          "Built a self-service onboarding platform with sandbox environments, interactive API docs, and sample applications in 5 languages.",
          "Reduced average developer onboarding time from 5 days to 1 day, improving the team's NPS score from 32 to 68.",
        ],
      },
      {
        name: "Legacy Migration Toolkit",
        start: "May 2020",
        end: "Oct 2020",
        bullets: [
          "Developed an automated migration toolkit that analysed jQuery codebases and generated React component equivalents with 80% accuracy.",
          "The toolkit accelerated the legacy migration by 3 months, saving an estimated $180k in engineering costs.",
        ],
      },
    ],
    certs: [
      {
        name: "AWS Certified Developer – Associate",
        org: "Amazon Web Services",
        date: "Mar 2022",
      },
      {
        name: "CKAD: Certified Kubernetes Application Developer",
        org: "CNCF",
        date: "Nov 2021",
      },
      {
        name: "Meta Back-End Developer Certificate",
        org: "Meta",
        date: "Aug 2020",
      },
    ],
    education: {
      name: "University of Texas at Austin",
      location: "Austin, TX",
      start: "Aug 2010",
      end: "May 2014",
      degree: "B.S. in Computer Science",
      gpa: "3.72 / 4.0",
      note: "Minor in Mathematics; senior capstone on collaborative text editing using operational transformation. Active in the ACM programming club and hackathon circuit.",
    },
  },
  {
    layoutId: "bold-type",
    presetId: "bold-citrus",
    photo: "https://i.pravatar.cc/320?img=33",
    fullName: "Calvin Hughes",
    location: "Chicago, IL",
    phone: "+1 (312) 555-0418",
    email: "calvin.hughes@outlook.com",
    links: [
      "https://www.linkedin.com/in/calvinhughes",
      "https://calvinhughes.co",
    ],
    summary:
      "<p>Content strategist and marketing writer with 8 years crafting brand stories for B2B SaaS and consumer tech companies. I translate technical concepts into compelling narratives that drive awareness, engagement, and conversion. I build content operations that scale, from editorial calendars to SEO frameworks to distribution playbooks.</p>",
    work: [
      {
        company: "North Bridge Software",
        position: "Senior Content Strategist",
        location: "Chicago, IL",
        start: "Jun 2021",
        end: "current",
        bullets: [
          "Built the content marketing programme from scratch, growing organic blog traffic from 5k to 120k monthly visits within 18 months through SEO-driven editorial strategy.",
          "Developed a content framework that mapped each stage of the buyer journey, producing 80+ articles, 12 guides, and 6 case studies that contributed to $2.4M in attributed pipeline.",
          "Managed a team of 3 writers and a network of 8 freelance contributors, establishing editorial standards, a content calendar, and a performance review cadence.",
          "Partnered with product marketing to launch 4 product campaigns, writing landing pages, email sequences, and sales collateral that achieved a 22% average conversion rate.",
        ],
      },
      {
        company: "Lakeside Media Group",
        position: "Content Marketing Manager",
        location: "Chicago, IL",
        start: "Jan 2018",
        end: "May 2021",
        bullets: [
          "Led content strategy for a portfolio of 5 B2B tech clients, growing their combined organic traffic by 180% over 2 years.",
          "Wrote and edited 200+ long-form articles, white papers, and eBooks, with 4 pieces ranking #1 for high-volume target keywords.",
          "Implemented a content distribution playbook covering email, LinkedIn, and paid promotion that increased content-generated leads by 3x.",
        ],
      },
      {
        company: "Windy City Content",
        position: "Content Writer",
        location: "Chicago, IL",
        start: "Jul 2015",
        end: "Dec 2017",
        bullets: [
          "Wrote blog posts, case studies, and website copy for 12+ clients in the SaaS, finance, and professional services sectors.",
          "Developed a data-driven approach to content performance analysis, using Google Analytics and Search Console insights to inform editorial strategy.",
        ],
      },
      {
        company: "Midwest Publishing",
        position: "Junior Copywriter",
        location: "Chicago, IL",
        start: "Sep 2013",
        end: "Jun 2015",
        bullets: [
          "Wrote and edited content for 3 trade publications covering technology and business topics, with a monthly output of 20+ articles.",
          "Conducted interviews with industry executives and synthesised insights into reported feature articles.",
        ],
      },
    ],
    skills: {
      category: "Content Strategy",
      items: [
        "SEO",
        "Content Marketing",
        "Editorial Strategy",
        "Copywriting",
        "Brand Voice",
        "Analytics",
        "WordPress",
        "HubSpot",
      ],
    },
    projects: [
      {
        name: "Content Engine Build",
        start: "Jan 2023",
        end: "Dec 2023",
        bullets: [
          "Designed and launched a content engine producing 20+ pieces per month across blog, LinkedIn, and YouTube, growing total content-attributed pipeline by 180%.",
          "Established an editorial workflow with topic clustering, keyword research, first-draft templates, and a data-driven content scoring system.",
          "Reduced content production cost per piece by 35% while maintaining quality scores above 4.5 / 5 in reader satisfaction surveys.",
        ],
      },
      {
        name: "Website Content Overhaul",
        start: "Mar 2022",
        end: "Oct 2022",
        bullets: [
          "Led a comprehensive rewrite of all website content — product pages, about pages, case studies, and resource centre — aligned to a new messaging framework.",
          "The revamped site achieved a 28% improvement in bounce rate and a 35% increase in demo request conversion rate.",
        ],
      },
      {
        name: "SEO Growth Initiative",
        start: "Aug 2021",
        end: "Feb 2022",
        bullets: [
          "Executed a technical SEO overhaul combined with a content cluster strategy that grew organic traffic from 5k to 50k monthly visits in 6 months.",
          "Identified and optimised 30 high-opportunity keyword clusters, 8 of which reached the top 3 positions in SERPs.",
        ],
      },
      {
        name: "Thought Leadership Programme",
        start: "Jan 2021",
        end: "Jul 2021",
        bullets: [
          "Developed an executive thought leadership programme that produced 12 bylined articles in tier-1 publications (Forbes, TechCrunch, Inc.).",
          "The programme generated 500+ inbound leads in its first quarter and positioned the CEO as a recognised industry voice.",
        ],
      },
    ],
    certs: [
      {
        name: "HubSpot Content Marketing Certification",
        org: "HubSpot Academy",
        date: "Mar 2022",
      },
      {
        name: "Google Analytics Individual Qualification",
        org: "Google",
        date: "Jan 2022",
      },
      {
        name: "SEMrush SEO Toolkit Certification",
        org: "SEMrush Academy",
        date: "Aug 2021",
      },
      { name: "Reforge Content-Led Growth", org: "Reforge", date: "Nov 2022" },
    ],
    education: {
      name: "Northwestern University",
      location: "Evanston, IL",
      start: "Sep 2009",
      end: "Jun 2013",
      degree: "B.S. in Journalism",
      gpa: "3.74 / 4.0",
      note: "Specialised in magazine writing and digital media; managed the university's student-run online publication, growing readership from 8k to 35k monthly. Minored in marketing.",
    },
  },

  // ── New templates: banner-alt ──────────────────────────────────────────────
  {
    layoutId: "banner",
    presetId: "banner-emerald",
    photo: "https://i.pravatar.cc/320?img=55",
    fullName: "Derek Mitchell",
    location: "Brooklyn, NY",
    phone: "+1 (718) 555-0274",
    email: "derek.mitchell@hey.com",
    links: [
      "https://www.linkedin.com/in/derekmitchell",
      "https://derekmitchell.art",
    ],
    summary:
      "<p>Art director with 9 years creating visual narratives for publishing, fashion, and lifestyle brands. I bring a multidisciplinary approach blending photography, typography, and illustration to craft distinctive brand worlds. I'm drawn to projects with cultural resonance and teams that value craft as much as concept.</p>",
    work: [
      {
        company: "The Standard Creative",
        position: "Art Director",
        location: "Brooklyn, NY",
        start: "Aug 2020",
        end: "current",
        bullets: [
          "Directed visual identity and campaign creative for 20+ clients across luxury, fashion, and editorial sectors, managing a team of 5 designers and photographers.",
          "Led the art direction for a biannual print magazine, overseeing photoshoots, typography, and production across 200+ pages per issue.",
          "Rebuilt the studio's digital portfolio and social presence, resulting in a 3x increase in inbound client inquiries and features in Communication Arts.",
          "Established a mentorship track for junior designers, pairing each with a senior creative for quarterly portfolio reviews and career development.",
        ],
      },
      {
        company: "Blank Slate Studio",
        position: "Senior Designer",
        location: "Brooklyn, NY",
        start: "Apr 2016",
        end: "Jul 2020",
        bullets: [
          "Art directed photoshoots and designed layouts for a monthly lifestyle magazine with a circulation of 180k readers.",
          "Collaborated with editorial and sales teams to create advertiser-sponsored content that increased ad revenue by 25% year over year.",
          "Designed 3 book covers that were recognised in the AIGA 50 Books / 50 Covers competition.",
        ],
      },
      {
        company: "Type & Image",
        position: "Graphic Designer",
        location: "Brooklyn, NY",
        start: "Jun 2013",
        end: "Mar 2016",
        bullets: [
          "Produced print and digital assets for cultural institutions and non-profit clients, including exhibition catalogues, posters, and social campaigns.",
          "Developed a modular poster system for a museum's lecture series that reduced production time by 60% while maintaining visual cohesion across 40+ events.",
        ],
      },
    ],
    skills: {
      category: "Art Direction",
      items: [
        "Art Direction",
        "Photography",
        "Typography",
        "Editorial Design",
        "Brand Identity",
        "Creative Direction",
        "Print Production",
        "Adobe Creative Suite",
      ],
    },
    projects: [
      {
        name: "Magazine Relaunch",
        start: "Feb 2023",
        end: "Jan 2024",
        bullets: [
          "Directed the complete redesign of a 50-year-old culture magazine, from logo and grid system to typography and colour palette.",
          "The relaunch issue sold out on newsstands within 2 weeks and was awarded Best Cover Design by the Society of Publication Designers.",
        ],
      },
      {
        name: "Lifestyle Brand Campaign",
        start: "Apr 2022",
        end: "Oct 2022",
        bullets: [
          "Art directed a 360° campaign for a premium denim brand, including print, OOH, digital, and an experiential pop-up in SoHo.",
          "The campaign drove a 40% increase in foot traffic to the pop-up and generated 15M+ social impressions in its first month.",
        ],
      },
      {
        name: "Photography Book Project",
        start: "Jan 2021",
        end: "Aug 2021",
        bullets: [
          "Designed and produced a fine-art photography monograph for an acclaimed street photographer, handling layout, typography, colour proofing, and print vendor management.",
          "The book was shortlisted for the Paris Photo–Aperture Foundation PhotoBook Awards and sold out its first print run of 3,000 copies.",
        ],
      },
      {
        name: "Digital Archive Platform",
        start: "Jun 2020",
        end: "Nov 2020",
        bullets: [
          "Designed the UX and visual interface for a digital archive of 50k+ historical photographs, balancing browseability with scholarly depth.",
          "The platform was adopted by 3 university libraries for their digital collections and received a Webby Award nomination.",
        ],
      },
    ],
    certs: [
      {
        name: "AIGA Professional Design Certification",
        org: "AIGA",
        date: "Jun 2022",
      },
      {
        name: "Advanced Typography Specialisation",
        org: "Cooper Union",
        date: "May 2021",
      },
      {
        name: "Photography for Designers",
        org: "School of Visual Arts",
        date: "Aug 2020",
      },
    ],
    education: {
      name: "School of Visual Arts",
      location: "New York, NY",
      start: "Sep 2009",
      end: "May 2013",
      degree: "B.F.A. in Graphic Design",
      gpa: "3.82 / 4.0",
      note: "Concentration in typography and publication design; senior thesis on the evolution of magazine layout in the digital age was published in the SVA senior thesis archive. Interned at a major design consultancy.",
    },
  },
  {
    layoutId: "split",
    presetId: "split-terracotta",
    photo: "https://i.pravatar.cc/320?img=14",
    fullName: "Sean McCarthy",
    location: "Portland, OR",
    phone: "+1 (503) 555-0325",
    email: "sean.mccarthy@gmail.com",
    links: [
      "https://www.linkedin.com/in/seanmccarthy",
      "https://github.com/smccarthy",
    ],
    summary:
      "<p>Mobile engineer with 7 years building native and cross-platform applications used by millions. I obsess over performance, smooth animations, and intuitive gesture-driven interfaces. I bring architectural rigour to mobile teams, advocating for clean separation of concerns, comprehensive testing, and developer productivity.</p>",
    work: [
      {
        company: "Nomad Technologies",
        position: "Senior Mobile Engineer",
        location: "Portland, OR",
        start: "Mar 2021",
        end: "current",
        bullets: [
          "Architected and built a cross-platform travel app using React Native, serving 500k+ monthly active users with sub-2s cold start times.",
          "Led the migration from a legacy native codebase to a shared React Native architecture, reducing iOS and Android feature delivery time by 40%.",
          "Implemented a declarative animation system that cut animation-related bugs by 70% and made complex gesture interactions testable.",
          "Mentored 3 mobile engineers through structured pairing sessions and architecture reviews, building the team's React Native expertise from scratch.",
        ],
      },
      {
        company: "Clearview Mobile",
        position: "Mobile Engineer",
        location: "Portland, OR",
        start: "Jun 2017",
        end: "Feb 2021",
        bullets: [
          "Built and maintained native Android (Kotlin) and iOS (Swift) apps for a health-tracking platform with 2M+ downloads.",
          "Reduced crash rate from 0.8% to 0.05% by implementing comprehensive error handling, analytics, and a staged rollout pipeline.",
          "Developed an offline-first sync engine using Room + WorkManager that let users log data without internet, achieving 98% sync success rate.",
        ],
      },
      {
        company: "Pocket Studio",
        position: "Junior Mobile Developer",
        location: "Portland, OR",
        start: "Aug 2015",
        end: "May 2017",
        bullets: [
          "Developed and shipped 5 iOS apps for client projects across fitness, retail, and education verticals, collectively reaching 100k+ downloads.",
          "Built reusable UI component libraries in Swift that standardised development across projects and reduced feature implementation time by 25%.",
        ],
      },
    ],
    skills: {
      category: "Mobile Engineering",
      items: [
        "React Native",
        "Swift",
        "Kotlin",
        "TypeScript",
        "Reanimated",
        "SQLite",
        "CI/CD",
        "App Performance",
      ],
    },
    projects: [
      {
        name: "Cross-Platform Architecture",
        start: "Jan 2023",
        end: "Oct 2023",
        bullets: [
          "Designed and implemented a cross-platform architecture sharing 85% of code between iOS and Android while preserving native platform feel.",
          "Achieved 60fps scrolling performance on both platforms through careful reconciliation of React Native's bridge and native thread interactions.",
        ],
      },
      {
        name: "Offline-First Sync Engine",
        start: "May 2022",
        end: "Nov 2022",
        bullets: [
          "Built a robust offline-first data synchronisation engine with conflict resolution, operation queuing, and background sync scheduling.",
          "Achieved 99.2% sync reliability across 500k devices with automatic retries, exponential backoff, and delta-based synchronisation.",
        ],
      },
      {
        name: "App Performance Overhaul",
        start: "Feb 2021",
        end: "Jul 2021",
        bullets: [
          "Led a comprehensive performance audit and optimisation sprint, reducing cold start time from 4.2s to 1.8s and app size by 35%.",
          "Implemented lazy loading for screens, image caching with custom disk cache, and reduced unnecessary re-renders through memoization.",
        ],
      },
    ],
    certs: [
      {
        name: "Meta React Native Developer Certificate",
        org: "Meta",
        date: "Mar 2022",
      },
      {
        name: "Google Associate Android Developer",
        org: "Google",
        date: "Aug 2021",
      },
      { name: "Apple Certified iOS Developer", org: "Apple", date: "Jan 2020" },
    ],
    education: {
      name: "University of Oregon",
      location: "Eugene, OR",
      start: "Sep 2011",
      end: "Jun 2015",
      degree: "B.S. in Computer and Information Science",
      gpa: "3.68 / 4.0",
      note: "Focus on mobile and embedded systems; senior project on a real-time transit tracking app for Android that won the department's capstone showcase. Active in the mobile development club.",
    },
  },
  {
    layoutId: "bold-type",
    presetId: "bold-lime",
    photo: "https://i.pravatar.cc/320?img=61",
    fullName: "Miles Ford",
    location: "Seattle, WA",
    phone: "+1 (206) 555-0447",
    email: "miles.ford@outlook.com",
    links: [
      "https://www.linkedin.com/in/milesford",
      "https://milesford.writes",
    ],
    summary:
      "<p>Technical writer with 7 years turning complex software concepts into clear, accessible documentation. I specialise in API docs, developer guides, and information architecture for developer-facing products. I believe great documentation is a product in its own right and deserves the same design rigour as the UI.</p>",
    work: [
      {
        company: "BuildRight",
        position: "Senior Technical Writer",
        location: "Seattle, WA",
        start: "Apr 2021",
        end: "current",
        bullets: [
          "Led the documentation strategy for a cloud infrastructure platform, producing API reference docs, getting-started guides, tutorials, and conceptual overviews across 5 product areas.",
          "Built an automated documentation pipeline using Markdown + Docusaurus that reduced time-to-publish from 2 days to 15 minutes.",
          "Conducted quarterly documentation audits with user feedback and analytics, achieving a 40% reduction in documentation-related support tickets.",
          "Mentored 2 junior technical writers through structured editing sessions, style guide training, and documentation review processes.",
        ],
      },
      {
        company: "DocuCraft",
        position: "Technical Writer",
        location: "Seattle, WA",
        start: "May 2018",
        end: "Mar 2021",
        bullets: [
          "Wrote and maintained documentation for a B2B SaaS analytics platform, including API docs, admin guides, and integration tutorials.",
          "Redesigned the documentation portal's information architecture, reducing the average time to find a topic from 45s to 12s in user testing.",
          "Developed a documentation style guide and template system that was adopted across 3 product teams, standardising docs output and improving quality scores.",
        ],
      },
      {
        company: "ClearType Media",
        position: "Associate Technical Writer",
        location: "Seattle, WA",
        start: "Aug 2016",
        end: "Apr 2018",
        bullets: [
          "Wrote user manuals, release notes, and online help content for enterprise software used by 100k+ users in healthcare and finance.",
          "Collaborated with engineering and product teams to document new features on a 2-week release cycle, consistently meeting publish deadlines.",
        ],
      },
    ],
    skills: {
      category: "Technical Writing",
      items: [
        "API Documentation",
        "Information Architecture",
        "Docusaurus",
        "Markdown",
        "Git",
        "Developer Experience",
        "Content Strategy",
        "Documentation Testing",
      ],
    },
    projects: [
      {
        name: "API Docs Overhaul",
        start: "Feb 2023",
        end: "Dec 2023",
        bullets: [
          "Led a complete rewrite and restructuring of the API documentation covering 200+ endpoints, introducing interactive examples, code samples in 5 languages, and auto-generated reference docs from OpenAPI specs.",
          "The revamped docs contributed to a 50% reduction in API-related support tickets and received a developer NPS score of 74 (up from 42).",
        ],
      },
      {
        name: "Documentation Automation Pipeline",
        start: "Jun 2022",
        end: "Nov 2022",
        bullets: [
          "Designed and built a CI-integrated documentation pipeline that auto-published changes from Markdown source to a Docusaurus site with versioning and search.",
          "Reduced documentation publishing time from 2 days to 15 minutes and enabled product teams to contribute docs alongside code changes.",
        ],
      },
      {
        name: "Developer Onboarding Docs",
        start: "Jan 2022",
        end: "May 2022",
        bullets: [
          "Created a comprehensive developer onboarding guide covering environment setup, first API call, authentication, and common integration patterns.",
          "The guide reduced average developer time-to-first-successful-API-call from 4 hours to 25 minutes, as measured across 20 new integration partners.",
        ],
      },
      {
        name: "Docs UX Research",
        start: "Mar 2021",
        end: "Aug 2021",
        bullets: [
          "Conducted a documentation usability study with 15 external developers, identifying 23 pain points in the information architecture and content presentation.",
          "Implemented the top 10 improvements based on study findings, improving task completion rate from 58% to 83% in a follow-up study.",
        ],
      },
    ],
    certs: [
      {
        name: "Certified Professional Technical Communicator",
        org: "STC (Society for Technical Communication)",
        date: "May 2022",
      },
      { name: "Google UX Design Certificate", org: "Google", date: "Aug 2021" },
      {
        name: "API Documentation Workshop",
        org: "Documenting APIs / Tom Johnson",
        date: "Mar 2021",
      },
      {
        name: "Certified ScrumMaster",
        org: "Scrum Alliance",
        date: "Nov 2020",
      },
    ],
    education: {
      name: "University of Washington",
      location: "Seattle, WA",
      start: "Sep 2012",
      end: "Jun 2016",
      degree: "B.A. in English (Technical Communication)",
      gpa: "3.76 / 4.0",
      note: "Specialised in technical writing and information design; capstone project on API documentation usability for the UW IT department, which was adopted as the department's standard template. Minor in Computer Science.",
    },
  },
];
