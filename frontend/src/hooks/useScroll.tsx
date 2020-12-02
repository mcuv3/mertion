import React, { useCallback, useEffect } from "react";

export const useScroll = ({
  cb,
  depends,
  allowCondition,
}: {
  cb: () => void;
  depends: any[];
  allowCondition: boolean;
}) => {
  useEffect(() => {
    function onScroll() {
      const downPosition =
        window.scrollY + document.documentElement.clientHeight;
      if (downPosition + 350 >= document.documentElement.scrollHeight) {
        cb();
      }
    }
    if (allowCondition) {
      window.addEventListener("scroll", onScroll);
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, depends);
};
