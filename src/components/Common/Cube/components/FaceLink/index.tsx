import React from "react";
import { Link, LinkProps } from "@chakra-ui/react";

import { useFaceFocus } from "../Face/context";

const isExternal = (href: string) => /^https?:\/\//.test(href);

/**
 * Link dentro de uma face: sai da ordem de tabulação quando a face não está
 * de frente e abre links externos em outra aba.
 */
const FaceLink: React.FC<LinkProps & { href: string }> = ({
  href,
  ...props
}) => {
  const focus = useFaceFocus();

  return (
    <Link
      {...focus}
      href={href}
      target={isExternal(href) ? "_blank" : undefined}
      rel="noreferrer"
      color="inherit"
      _hover={{ color: "teal.300" }}
      {...props}
    />
  );
};

export default FaceLink;
