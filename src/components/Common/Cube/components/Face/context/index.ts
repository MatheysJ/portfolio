import { createContext, useContext } from "react";

export const FaceContext = createContext({ isActive: true });

export const useFaceFocus = () => {
  const { isActive } = useContext(FaceContext);
  return { tabIndex: isActive ? undefined : -1 };
};
