import { RefObject, useCallback } from "react";
import { FACES, FACES_DATA } from "@/constants/faces";

export const FACE_SCROLL_ATTRIBUTE = "data-face-scroll";

/** Returns a getter for the scrollable content area of the active face. */
const useFaceScroller = (
  cubeRef: RefObject<HTMLElement | null>,
  getActiveFace: () => FACES,
) =>
  useCallback(
    () =>
      cubeRef.current?.querySelector<HTMLElement>(
        `#${FACES_DATA[getActiveFace()].slug} [${FACE_SCROLL_ATTRIBUTE}]`,
      ) ?? null,
    [cubeRef, getActiveFace],
  );

export default useFaceScroller;
