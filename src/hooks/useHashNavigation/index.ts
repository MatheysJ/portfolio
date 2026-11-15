import { useEffect, useRef } from "react";
import { FACES, FACES_DATA, getFaceBySlug } from "@/constants/faces";

const useHashNavigation = (activeFace: FACES, goTo: (face: FACES) => void) => {
  const isReadyRef = useRef(false);

  useEffect(() => {
    if (!isReadyRef.current) return;

    const hash =
      activeFace === FACES.FRONT ? "" : `#${FACES_DATA[activeFace].slug}`;
    if (window.location.hash === hash) return;

    const { pathname, search } = window.location;
    window.history.replaceState(null, "", `${pathname}${search}${hash}`);
  }, [activeFace]);

  useEffect(() => {
    const syncFromHash = () => {
      const face = getFaceBySlug(window.location.hash.slice(1));
      if (face) goTo(face);
    };

    syncFromHash();
    isReadyRef.current = true;

    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [goTo]);
};

export default useHashNavigation;
