import React from "react";
import { Flex, IconButton, Link } from "@chakra-ui/react";
import { FaGithubAlt, FaLinkedin } from "react-icons/fa";
import { IoMailOpen } from "react-icons/io5";
import { Tooltip } from "@/components/ui/tooltip";
import { toaster } from "@/components/ui/toaster";
import { CONTACT } from "@/constants/content";

import { useFaceFocus } from "../../../Face/context";

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(CONTACT.email);
    toaster.create({ title: "E-mail copiado!", type: "success", duration: 2500 });
  } catch {
    window.location.href = `mailto:${CONTACT.email}`;
  }
};

const ContactActions: React.FC = () => {
  const focus = useFaceFocus();

  return (
    <Flex gap="4" justifyContent="center">
      <Tooltip content="Ver meus projetos no GitHub">
        <IconButton asChild size="xl" colorPalette="teal" aria-label="GitHub">
          <Link
            {...focus}
            href={CONTACT.github.href}
            target="_blank"
            rel="noreferrer"
          >
            <FaGithubAlt />
          </Link>
        </IconButton>
      </Tooltip>
      <Tooltip content="Ir para o meu LinkedIn">
        <IconButton asChild size="xl" colorPalette="teal" aria-label="LinkedIn">
          <Link
            {...focus}
            href={CONTACT.linkedin.href}
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedin />
          </Link>
        </IconButton>
      </Tooltip>
      <Tooltip content="Copiar meu e-mail">
        <IconButton
          size="xl"
          colorPalette="teal"
          aria-label="Copiar e-mail para a área de transferência"
          onClick={copyEmail}
          {...focus}
        >
          <IoMailOpen />
        </IconButton>
      </Tooltip>
    </Flex>
  );
};

export default ContactActions;
