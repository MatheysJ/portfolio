import { useEffect } from "react";
import { DIRECTIONS, KEY_TO_DIRECTION } from "@/constants/directions";
import { isTypingTarget } from "@/utils/dom";

/** Chama `onDirection` para as setas do teclado, fora de campos de texto. */
const useArrowKeys = (onDirection: (direction: DIRECTIONS) => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = KEY_TO_DIRECTION[event.key];
      if (!direction || event.altKey || event.ctrlKey || event.metaKey) return;
      if (isTypingTarget(event.target)) return;

      event.preventDefault();
      onDirection(direction);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onDirection]);
};

export default useArrowKeys;
