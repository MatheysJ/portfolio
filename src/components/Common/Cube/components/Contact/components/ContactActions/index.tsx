import React from "react";
import { Flex, IconButton, Link } from "@chakra-ui/react";
import { FaGithubAlt, FaLinkedin } from "react-icons/fa";
import { IoMailOpen } from "react-icons/io5";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { CONTACT } from "@/constants/contact";
import { Dictionary, useDictionary } from "@/i18n";

import { useFaceFocus } from "../../../Face/context";

const getExternalProfiles = (ui: Dictionary["ui"]) => [
  {
    label: "GitHub",
    tooltip: ui.githubTooltip,
    href: CONTACT.github.href,
    icon: FaGithubAlt,
  },
  {
    label: "LinkedIn",
    tooltip: ui.linkedinTooltip,
    href: CONTACT.linkedin.href,
    icon: FaLinkedin,
  },
];

// Falls back to the mail client when the clipboard is unavailable.
const copyEmail = async (successMessage: string) => {
  try {
    await navigator.clipboard.writeText(CONTACT.email);
    toaster.create({
      title: successMessage,
      type: "success",
      duration: 2500,
    });
  } catch {
    window.location.href = `mailto:${CONTACT.email}`;
  }
};

const ContactActions: React.FC = () => {
  const focus = useFaceFocus();
  const { ui } = useDictionary();

  return (
    <Flex gap="4" justifyContent="center">
      {getExternalProfiles(ui).map(({ label, tooltip, href, icon: Icon }) => (
        <Tooltip key={label} content={tooltip}>
          <IconButton asChild size="xl" colorPalette="teal" aria-label={label}>
            <Link {...focus} href={href} target="_blank" rel="noreferrer">
              <Icon />
            </Link>
          </IconButton>
        </Tooltip>
      ))}
      <Tooltip content={ui.copyEmailTooltip}>
        <IconButton
          {...focus}
          size="xl"
          colorPalette="teal"
          aria-label={ui.copyEmailLabel}
          onClick={() => copyEmail(ui.emailCopied)}
        >
          <IoMailOpen />
        </IconButton>
      </Tooltip>
    </Flex>
  );
};

export default ContactActions;
