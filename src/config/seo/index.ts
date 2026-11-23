import { SITE_URL } from "@/config/site";
import { ADDRESS, CONTACT, PERSONAL_PROJECT_LINK } from "@/constants/contact";
import { Dictionary, getLocalePath, LOCALES, Locale } from "@/i18n";

export const getPageUrl = (locale: Locale) =>
  `${SITE_URL}${getLocalePath(locale)}`;

export const ALTERNATE_URLS = LOCALES.map((locale) => ({
  locale,
  href: getPageUrl(locale),
}));

export const buildPersonJsonLd = (dictionary: Dictionary, locale: Locale) => {
  const { profile, stack, education, certifications, personalProject } =
    dictionary;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.displayName,
    givenName: profile.givenName,
    jobTitle: profile.jobTitle,
    description: profile.summary,
    url: getPageUrl(locale),
    email: `mailto:${CONTACT.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: ADDRESS.locality,
      addressRegion: ADDRESS.region,
      addressCountry: ADDRESS.country,
    },
    sameAs: [CONTACT.linkedin.href, CONTACT.github.href],
    knowsAbout: stack.flatMap(({ items }) => items),
    knowsLanguage: ["pt-BR", "en"],
    alumniOf: education.map(({ place }) => ({
      "@type": "EducationalOrganization",
      name: place,
    })),
    hasCredential: certifications.map(({ title, detail }) => ({
      "@type": "EducationalOccupationalCredential",
      name: title,
      description: detail,
    })),
    subjectOf: {
      "@type": "SoftwareSourceCode",
      name: personalProject.title,
      description: personalProject.description,
      codeRepository: PERSONAL_PROJECT_LINK.href,
    },
  };
};
