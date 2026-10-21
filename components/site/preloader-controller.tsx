"use client";

import { useEffect } from "react";

const MIN_VISIBLE_MS = 1100;

export function PreloaderController() {
  useEffect(() => {
    const el = document.getElementById("sn-preloader");
    if (!el || el.dataset.state === "done") return;

    const started = performance.now();
    let leaveTimer: ReturnType<typeof setTimeout>;
    let doneTimer: ReturnType<typeof setTimeout>;

    const finish = () => {
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - started));
      leaveTimer = setTimeout(() => {
        el.dataset.state = "leaving";
        doneTimer = setTimeout(() => (el.dataset.state = "done"), 500);
        try {
          sessionStorage.setItem("sn-preloaded", "1");
        } catch {
          // ignore
        }
      }, wait);
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return null;
}
