import { useEffect, useRef } from "react";
import { FACES } from "@/constants/faces";
import { getFaceBySlug, getFaceHash } from "@/utils/faces";

const useHashNavigation = (activeFace: FACES, goTo: (face: FACES) => void) => {
  const isReadyRef = useRef(false);

  useEffect(() => {
    if (!isReadyRef.current) return;

    const hash = getFaceHash(activeFace);
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
