import { useEffect, useState } from "react";

const getViewportSize = () => ({
  width: typeof window === "undefined" ? 0 : window.innerWidth,
  height: typeof window === "undefined" ? 0 : window.innerHeight,
});

const useViewportSize = () => {
  const [viewport, setViewport] = useState(getViewportSize);

  useEffect(() => {
    const handleResize = () => setViewport(getViewportSize());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return viewport;
};

export default useViewportSize;
