import { CONTACT } from "@/constants/contact";
import { DIRECTIONS } from "@/constants/directions";
import { FACES } from "@/constants/faces";

import type { Dictionary } from "./pt";

const profile = {
  name: "MATHEUS J.",
  givenName: "Matheus",
  displayName: "Matheus J.",
  role: "SOFTWARE ENGINEER",
  jobTitle: "Full Stack Software Engineer",
  headline: "Full Stack · E-commerce · Microservices",
  summary:
    "4+ years in e-commerce. Front-end with React, Next.js and TypeScript; back-end with Java/Spring Boot and Node.js/NestJS, in a microservices architecture.",
  location: "Campinas, SP, Brazil",
  workModel: "Remote or hybrid",
};

const en: Dictionary = {
  profile,
  seo: {
    title: `${profile.displayName} · ${profile.jobTitle}`,
    description: `${profile.jobTitle} in ${profile.location} · ${profile.workModel}. ${profile.summary}`,
  },
  faces: {
    [FACES.FRONT]: "Home",
    [FACES.RIGHT]: "Experience",
    [FACES.TOP]: "Projects",
    [FACES.BACK]: "Stack",
    [FACES.BOTTOM]: "Education",
    [FACES.LEFT]: "Contact",
  },
  contactLinks: [
    { label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    {
      label: "LinkedIn",
      value: CONTACT.linkedin.label,
      href: CONTACT.linkedin.href,
    },
    { label: "GitHub", value: CONTACT.github.label, href: CONTACT.github.href },
  ],
  experience: {
    company: "Compass.UOL",
    companyNote: "AI/R Company",
    role: "Full Stack Software Engineer",
    period: "Mar 2022 – Sep 2026",
    workModel: "Remote",
    note: "Joined through the internship program and was hired full-time.",
    works: [
      {
        title: "Help Center",
        stack: "Next.js · TypeScript · React Native",
        text: "Lead developer of the first flow in the migration to server-rendered micro front-ends: the MVP of the architecture later adopted across the rest of the site.",
        metric: {
          value: "LCP 5.3 s → 1.7 s",
          detail: "−70% for real users (Chrome UX Report, p75)",
        },
      },
      {
        title: "Cart and checkout",
        stack: "Next.js · Java/Spring Boot · Node.js/NestJS BFF",
        text: "Front-end of both journeys and back-end of the cart, including payment with points and Brazilian reais, with multiple currencies in the calculation.",
      },
      {
        title: "Gamification engine",
        stack: "Java/Spring Boot · RabbitMQ",
        text: "Event-driven back-end, built as a pair. An orchestrator assigns missions to a segmented user base, tracks their completion and triggers the reward. Failures and retries handled with DLQs, idempotent consumption and events specified in AsyncAPI.",
      },
    ],
  },
  workStyle: [
    "Deliveries start from data that defines the problem and the goal, and are validated in production.",
    "Performance analyzed with Lighthouse and Dynatrace; Google Tag Manager tagging feeding Google Analytics.",
    "Testing with Jest, JUnit and Cypress; Clean Code and SOLID.",
    "AI every day to develop, test and debug.",
  ],
  personalProject: {
    title: "Cube",
    tag: "personal project",
    description: "E-commerce in a microservices architecture.",
    stack: [
      "Next.js",
      "Spring Boot",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "GitHub Actions",
    ],
    recognition:
      "An early version was the subject of my undergraduate thesis and of an extended abstract presented at the 14th Scientific and Technological Conference of FATEC Botucatu (2025).",
    codeLabel: "Code (gateway)",
  },
  stack: [
    {
      group: "Front-end",
      items: ["React", "Next.js", "TypeScript", "React Native"],
    },
    {
      group: "Back-end",
      items: ["Java", "Spring Boot", "Node.js", "NestJS"],
    },
    {
      group: "Data & messaging",
      items: ["PostgreSQL", "MongoDB", "Redis", "RabbitMQ"],
    },
    {
      group: "Infrastructure",
      items: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    },
    {
      group: "Quality & observability",
      items: ["Jest", "JUnit", "Cypress", "Lighthouse", "Dynatrace"],
    },
    {
      group: "AI in development",
      items: ["GitHub Copilot", "Kiro", "Amazon Q", "Claude", "Gemini"],
    },
  ],
  education: [
    {
      title: "Graduate studies in Microelectronics",
      place: "Unicamp",
      period: "In progress · scholarship holder, alongside software development",
    },
    {
      title: "Technology degree in Systems Analysis and Development",
      place: "FATEC Botucatu",
      period: "Jan 2022 – Dec 2025",
    },
    {
      title: "Technical course in Systems Development",
      place: "Etec Dr. Domingos Minicucci Filho",
      period: "2019 – 2021",
    },
  ],
  certifications: [
    { title: "Advanced English", detail: "TOEIC: Reading B2 · Listening C1" },
    { title: "AWS Certified Cloud Practitioner", detail: "Renewed in 2026" },
  ],
  ui: {
    interactionHint: "Drag, use the arrow keys or click the edges",
    sectionsNav: "Sections",
    turn: {
      [DIRECTIONS.LEFT]: "Turn to the section on the left",
      [DIRECTIONS.RIGHT]: "Turn to the section on the right",
      [DIRECTIONS.UP]: "Turn to the section above",
      [DIRECTIONS.DOWN]: "Turn to the section below",
    },
    workStyleLabel: "How I work",
    locationLabel: "Location",
    certificationsLabel: "Certifications & languages",
    githubTooltip: "See my projects on GitHub",
    linkedinTooltip: "Go to my LinkedIn",
    copyEmailTooltip: "Copy my email",
    copyEmailLabel: "Copy email to clipboard",
    emailCopied: "Email copied!",
  },
};

export default en;
