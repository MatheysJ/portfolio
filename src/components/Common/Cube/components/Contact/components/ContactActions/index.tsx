import React from "react";
import { Flex, IconButton, Link } from "@chakra-ui/react";
import { FaGithubAlt, FaLinkedin } from "react-icons/fa";
import { IoMailOpen } from "react-icons/io5";
import { Tooltip } from "@/components/ui/tooltip";
import { toaster } from "@/components/ui/toaster";
import { CONTACT } from "@/constants/content";

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(CONTACT.email);
    toaster.create({ title: "E-mail copiado!", type: "success", duration: 2500 });
  } catch {
    window.location.href = `mailto:${CONTACT.email}`;
  }
};

const ContactActions: React.FC = () => (
  <Flex gap="4" justifyContent="center">
    <Tooltip content="Ver meus projetos no GitHub">
      <IconButton asChild size="xl" colorPalette="teal" aria-label="GitHub">
        <Link href={CONTACT.github.href} target="_blank" rel="noreferrer">
          <FaGithubAlt />
        </Link>
      </IconButton>
    </Tooltip>
    <Tooltip content="Ir para o meu LinkedIn">
      <IconButton asChild size="xl" colorPalette="teal" aria-label="LinkedIn">
        <Link href={CONTACT.linkedin.href} target="_blank" rel="noreferrer">
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
      >
        <IoMailOpen />
      </IconButton>
    </Tooltip>
  </Flex>
);

export default ContactActions;
