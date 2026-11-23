import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useDictionary } from "@/i18n";

import Face from "../Face";
import { CubeFaceContentProps } from "../Face/types";
import FaceLink from "../FaceLink";
import SectionLabel from "../SectionLabel";
import { ContactActions } from "./components";

const Contact: React.FC<CubeFaceContentProps> = (props) => {
  const { contactLinks, profile, ui } = useDictionary();

  return (
    <Face {...props}>
      <Flex h="100%" direction="column" justifyContent="space-between" gap="4">
        <Flex direction="column" gap="2.5">
          {contactLinks.map(({ label, value, href }) => (
            <Flex key={label} direction="column">
              <SectionLabel>{label}</SectionLabel>
              <FaceLink href={href} wordBreak="break-all">
                {value}
              </FaceLink>
            </Flex>
          ))}
          <Flex direction="column">
            <SectionLabel>{ui.locationLabel}</SectionLabel>
            <Text>
              {profile.location} · {profile.workModel}
            </Text>
          </Flex>
        </Flex>

        <ContactActions />
      </Flex>
    </Face>
  );
};

export default Contact;
