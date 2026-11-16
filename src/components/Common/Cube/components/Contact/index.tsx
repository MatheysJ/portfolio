import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { CONTACT_LINKS, PROFILE } from "@/constants/content";

import Face from "../Face";
import { CubeFaceContentProps } from "../Face/types";
import FaceLink from "../FaceLink";
import SectionLabel from "../SectionLabel";
import { ContactActions } from "./components";

const Contact: React.FC<CubeFaceContentProps> = (props) => (
  <Face {...props}>
    <Flex h="100%" direction="column" justifyContent="space-between" gap="4">
      <Flex direction="column" gap="2.5">
        {CONTACT_LINKS.map(({ label, value, href }) => (
          <Flex key={label} direction="column">
            <SectionLabel>{label}</SectionLabel>
            <FaceLink href={href} wordBreak="break-all">
              {value}
            </FaceLink>
          </Flex>
        ))}
        <Flex direction="column">
          <SectionLabel>Localidade</SectionLabel>
          <Text>
            {PROFILE.location} · {PROFILE.workModel}
          </Text>
        </Flex>
      </Flex>

      <ContactActions />
    </Flex>
  </Face>
);

export default Contact;
