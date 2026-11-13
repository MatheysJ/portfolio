/**
 * Conteúdo do portfólio centralizado em um único lugar.
 * Descrições de clientes são propositalmente genéricas: sem nome de cliente,
 * nomes de serviços internos, métricas ou detalhes de arquitetura sensíveis.
 */

export const PROFILE = {
  name: "MATHEUS JÚNIOR",
  role: "SOFTWARE ENGINEER",
  headline: "Full Stack · React/Next.js · Java/Spring Boot",
  summary:
    "4 anos construindo jornadas de ponta a ponta: do micro front-end ao microsserviço.",
  location: "Campinas, SP",
};

export const CONTACT = {
  email: "matheusfpjunior@gmail.com",
  linkedin: {
    label: "linkedin.com/in/matheusjúnior",
    href: "https://www.linkedin.com/in/matheusjúnior",
  },
  github: {
    label: "github.com/MatheysJ",
    href: "https://github.com/MatheysJ",
  },
};

export const EXPERIENCE = {
  company: "Compass.uol",
  companyNote: "AI/R Company",
  role: "Engenheiro de Software Full Stack",
  period: "ago 2022 – set 2026",
  highlights: [
    "Responsável pelo front-end (e, após reestruturação, também pelo back-end) das jornadas de Carrinho e Checkout.",
    "Finalização de pedidos e integração com serviços de pagamento, com múltiplas moedas e pagamento parcial com pontos.",
    "Micro front-ends em Next.js, com Lighthouse como critério de DONE e lazy loading de imagens.",
    "i18n via CMS: features, comportamentos e textos 100% parametrizáveis por idioma.",
    "Microsserviços Java/Spring Boot e BFFs em Node.js/NestJS.",
    "Gamificação orientada a eventos: missões contabilizadas via RabbitMQ a partir de múltiplos serviços.",
    "TDD com Jest e JUnit, E2E com Cypress; monitoramento com Dynatrace (DQL) e Grafana.",
  ],
  practices: "Scrum, Kanban e agentes de IA (Kiro, GitHub Copilot, Amazon Q).",
};

export const PROJECTS = [
  {
    title: "Central de Ajuda",
    role: "Responsável técnico pela arquitetura (web e app)",
    points: [
      "Estruturação da solução em micro front-ends.",
      "Comunicação com microsserviços internos.",
      "Gerenciador de conteúdo para cadastro de artigos e FAQs.",
      "Evolução com busca integrada (Algolia).",
    ],
  },
];

export const CASE_STUDY = {
  title: "Feedback da FAQ sem construir um serviço",
  steps: [
    {
      label: "Problema",
      text: "Saber se as respostas da FAQ eram úteis, sem criar um serviço novo nem adaptar os existentes.",
    },
    {
      label: "Solução",
      text: "MVP com eventos do Google Analytics registrando o voto “útil / não útil” de cada pergunta.",
    },
    {
      label: "Resultado",
      text: "Todos os feedbacks necessários, entregues rápido e sem custo de construção e manutenção de serviço.",
    },
  ],
};

export const STACK = [
  {
    group: "Front-end",
    items: [
      "React",
      "Next.js",
      "Micro Front-ends",
      "styled-components",
      "Storybook",
    ],
  },
  {
    group: "Back-end",
    items: ["Java", "Spring Boot", "Node.js", "NestJS", "RabbitMQ", "Eureka"],
  },
  { group: "Dados", items: ["PostgreSQL", "Oracle", "MongoDB"] },
  {
    group: "Cloud & Infra",
    items: ["AWS", "Docker", "Kubernetes", "Linux", "Swagger"],
  },
  {
    group: "Qualidade",
    items: ["TDD", "Jest", "JUnit", "Cypress", "Lighthouse"],
  },
  {
    group: "Observabilidade & CI",
    items: ["Dynatrace", "Grafana", "GitLab", "Jenkins"],
  },
  { group: "IA", items: ["Kiro", "GitHub Copilot", "Amazon Q"] },
];

export const EDUCATION = [
  {
    title: "Análise e Desenvolvimento de Sistemas",
    place: "FATEC Botucatu",
    period: "jan 2022 – dez 2025",
  },
  {
    title: "Técnico Integrado em Desenvolvimento de Sistemas",
    place: "Etec Dr. Domingos Minicucci Filho",
    period: "2019 – 2021",
  },
];

export const CERTIFICATIONS = [
  { title: "AWS Certified Cloud Practitioner", detail: "Renovada em 2026" },
  { title: "Inglês avançado", detail: "TOEIC: Reading B2 · Listening C1" },
];
