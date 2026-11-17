import React from "react";
import { Flex, IconButton, Link } from "@chakra-ui/react";
import { FaGithubAlt, FaLinkedin } from "react-icons/fa";
import { IoMailOpen } from "react-icons/io5";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { CONTACT } from "@/constants/content";

import { useFaceFocus } from "../../../Face/context";

const EXTERNAL_PROFILES = [
  {
    label: "GitHub",
    tooltip: "Ver meus projetos no GitHub",
    href: CONTACT.github.href,
    icon: FaGithubAlt,
  },
  {
    label: "LinkedIn",
    tooltip: "Ir para o meu LinkedIn",
    href: CONTACT.linkedin.href,
    icon: FaLinkedin,
  },
];

// Falls back to the mail client when the clipboard is unavailable.
const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(CONTACT.email);
    toaster.create({
      title: "E-mail copiado!",
      type: "success",
      duration: 2500,
    });
  } catch {
    window.location.href = `mailto:${CONTACT.email}`;
  }
};

const ContactActions: React.FC = () => {
  const focus = useFaceFocus();

  return (
    <Flex gap="4" justifyContent="center">
      {EXTERNAL_PROFILES.map(({ label, tooltip, href, icon: Icon }) => (
        <Tooltip key={label} content={tooltip}>
          <IconButton asChild size="xl" colorPalette="teal" aria-label={label}>
            <Link {...focus} href={href} target="_blank" rel="noreferrer">
              <Icon />
            </Link>
          </IconButton>
        </Tooltip>
      ))}
      <Tooltip content="Copiar meu e-mail">
        <IconButton
          {...focus}
          size="xl"
          colorPalette="teal"
          aria-label="Copiar e-mail para a área de transferência"
          onClick={copyEmail}
        >
          <IoMailOpen />
        </IconButton>
      </Tooltip>
    </Flex>
  );
};

export default ContactActions;
