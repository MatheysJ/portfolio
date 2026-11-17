export const PROFILE = {
  name: "MATHEUS J.",
  givenName: "Matheus",
  displayName: "Matheus J.",
  role: "SOFTWARE ENGINEER",
  jobTitle: "Engenheiro de Software Full Stack",
  headline: "Full Stack · E-commerce · Microsserviços",
  summary:
    "Mais de 4 anos em e-commerce. Front-end com React, Next.js e TypeScript; back-end com Java/Spring Boot e Node.js/NestJS, em arquitetura de microsserviços.",
  location: "Campinas, SP",
  workModel: "Remoto ou híbrido",
  address: { locality: "Campinas", region: "SP", country: "BR" },
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

export const CONTACT_LINKS = [
  { label: "E-mail", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  {
    label: "LinkedIn",
    value: CONTACT.linkedin.label,
    href: CONTACT.linkedin.href,
  },
  { label: "GitHub", value: CONTACT.github.label, href: CONTACT.github.href },
];

export const EXPERIENCE = {
  company: "Compass.UOL",
  companyNote: "AI/R Company",
  role: "Engenheiro de Software Full Stack",
  period: "mar 2022 – set 2026",
  workModel: "Remoto",
  note: "Entrada pelo programa de estágio, com efetivação.",
  works: [
    {
      title: "Central de Ajuda",
      stack: "Next.js · TypeScript · React Native",
      text: "Principal desenvolvedor do primeiro fluxo da migração para micro front-ends com renderização no servidor: o MVP da arquitetura adotada no restante do site.",
      metric: {
        value: "LCP 5,3 s → 1,7 s",
        detail: "−70% para usuários reais (Chrome UX Report, p75)",
      },
    },
    {
      title: "Carrinho e checkout",
      stack: "Next.js · Java/Spring Boot · BFF em Node.js/NestJS",
      text: "Front-end das duas jornadas e back-end do carrinho, incluindo o pagamento em pontos e reais, com múltiplas moedas no cálculo.",
    },
    {
      title: "Mecanismo de gamificação",
      stack: "Java/Spring Boot · RabbitMQ",
      text: "Back-end orientado a eventos, desenvolvido em dupla. Um orquestrador direciona missões a uma base segmentada de usuários, acompanha a conclusão e dispara a recompensa. Falhas e retentativas com DLQs, consumo idempotente e eventos especificados em AsyncAPI.",
    },
  ],
};

export const WORK_STYLE = [
  "Entregas partem de dados que definem o problema e a meta, e são validadas em produção.",
  "Performance analisada com Lighthouse e Dynatrace; tagueamento no Google Tag Manager alimentando o Google Analytics.",
  "Testes com Jest, JUnit e Cypress; Clean Code e SOLID.",
  "IA no dia a dia para desenvolver, testar e depurar.",
];

export const PERSONAL_PROJECT = {
  title: "Cube",
  description: "E-commerce em arquitetura de microsserviços.",
  stack: [
    "Next.js",
    "Spring Boot",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "GitHub Actions",
  ],
  recognition:
    "Uma versão inicial foi tema do meu TCC e de um resumo expandido apresentado na 14ª Jornada Científica e Tecnológica da FATEC Botucatu (2025).",
  link: {
    label: "github.com/MatheysJ/cube-gateway",
    href: "https://github.com/MatheysJ/cube-gateway",
  },
};

export const STACK = [
  {
    group: "Front-end",
    items: ["React", "Next.js", "TypeScript", "React Native"],
  },
  {
    group: "Back-end",
    items: ["Java", "Spring Boot", "Node.js", "NestJS"],
  },
  {
    group: "Dados e mensageria",
    items: ["PostgreSQL", "MongoDB", "Redis", "RabbitMQ"],
  },
  {
    group: "Infraestrutura",
    items: ["Docker", "Kubernetes", "AWS", "CI/CD"],
  },
  {
    group: "Qualidade e observabilidade",
    items: ["Jest", "JUnit", "Cypress", "Lighthouse", "Dynatrace"],
  },
  {
    group: "IA no desenvolvimento",
    items: ["GitHub Copilot", "Kiro", "Amazon Q", "Claude", "Gemini"],
  },
];

export const EDUCATION = [
  {
    title: "Pós-graduação em Microeletrônica",
    place: "Unicamp",
    period:
      "Em andamento · bolsista, em paralelo ao desenvolvimento de software",
  },
  {
    title: "Análise e Desenvolvimento de Sistemas",
    place: "FATEC Botucatu",
    period: "jan 2022 – dez 2025",
  },
  {
    title: "Técnico em Desenvolvimento de Sistemas",
    place: "Etec Dr. Domingos Minicucci Filho",
    period: "2019 – 2021",
  },
];

export const CERTIFICATIONS = [
  { title: "Inglês avançado", detail: "TOEIC: Reading B2 · Listening C1" },
  { title: "AWS Certified Cloud Practitioner", detail: "Renovada em 2026" },
];
