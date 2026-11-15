import React from "react";
import { FACES } from "@/constants/faces";
import { CONTACT, PROFILE } from "@/constants/content";
import { Flex, Link, Text } from "@chakra-ui/react";

import { ContactActions } from "./components";
import { CubeContactProps } from "./types";
import { CubeFace } from "..";
import { useFaceFocus } from "../Face/context";

const LINKS = [
  { label: "E-mail", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { label: "LinkedIn", value: CONTACT.linkedin.label, href: CONTACT.linkedin.href },
  { label: "GitHub", value: CONTACT.github.label, href: CONTACT.github.href },
];

const ContactLinks: React.FC = () => {
  const focus = useFaceFocus();

  return LINKS.map(({ label, value, href }) => (
    <Flex key={label} direction="column">
      <Text fontSize="0.85em" color="teal.400">
        {label}
      </Text>
      <Link
        {...focus}
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noreferrer"
        color="inherit"
        wordBreak="break-all"
        _hover={{ color: "teal.300" }}
      >
        {value}
      </Link>
    </Flex>
  ));
};

const Contact: React.FC<CubeContactProps> = (props) => (
  <CubeFace {...props} face={FACES.LEFT} title="CONTATO">
    <Flex h="100%" direction="column" justifyContent="space-between" gap="4">
      <Flex direction="column" gap="2.5">
        <ContactLinks />
        <Flex direction="column">
          <Text fontSize="0.85em" color="teal.400">
            Localidade
          </Text>
          <Text>
            {PROFILE.location} · {PROFILE.workModel}
          </Text>
        </Flex>
      </Flex>

      <ContactActions />
    </Flex>
  </CubeFace>
);

export default Contact;
