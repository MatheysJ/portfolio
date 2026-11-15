import { createContext, useContext } from "react";

export const FaceContext = createContext({ isActive: true });

/**
 * Elementos interativos de faces fora de vista saem da ordem de tabulação,
 * mas o texto continua legível para leitores de tela e agentes automáticos.
 */
export const useFaceFocus = () => {
  const { isActive } = useContext(FaceContext);
  return { tabIndex: isActive ? undefined : -1 };
};
