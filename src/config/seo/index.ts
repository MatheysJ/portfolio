import {
  CERTIFICATIONS,
  CONTACT,
  EDUCATION,
  PERSONAL_PROJECT,
  PROFILE,
  STACK,
} from "@/constants/content";
import { SITE_URL } from "@/config/site";

const DISPLAY_NAME = PROFILE.displayName;

export const SEO = {
  title: `${DISPLAY_NAME} · ${PROFILE.jobTitle}`,
  description: `${PROFILE.jobTitle} em ${PROFILE.location} · ${PROFILE.workModel}. ${PROFILE.summary}`,
};

export const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: DISPLAY_NAME,
  givenName: PROFILE.givenName,
  jobTitle: PROFILE.jobTitle,
  description: PROFILE.summary,
  url: SITE_URL,
  email: `mailto:${CONTACT.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: PROFILE.address.locality,
    addressRegion: PROFILE.address.region,
    addressCountry: PROFILE.address.country,
  },
  sameAs: [CONTACT.linkedin.href, CONTACT.github.href],
  knowsAbout: STACK.flatMap(({ items }) => items),
  knowsLanguage: ["pt-BR", "en"],
  alumniOf: EDUCATION.map(({ place }) => ({
    "@type": "EducationalOrganization",
    name: place,
  })),
  hasCredential: CERTIFICATIONS.map(({ title, detail }) => ({
    "@type": "EducationalOccupationalCredential",
    name: title,
    description: detail,
  })),
  subjectOf: {
    "@type": "SoftwareSourceCode",
    name: PERSONAL_PROJECT.title,
    description: PERSONAL_PROJECT.description,
    codeRepository: PERSONAL_PROJECT.link.href,
  },
};
