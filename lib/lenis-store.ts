import type Lenis from "lenis";

/**
 * Module-level handle to the single Lenis instance, so UI that must freeze the
 * page (the mobile menu) can stop and start it without prop drilling.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle("menu-open", locked);
  if (!instance) return;
  if (locked) instance.stop();
  else instance.start();
}
