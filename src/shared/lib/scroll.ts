import gsap from "gsap";
import { ScrollTrigger as Trigger } from "gsap/ScrollTrigger";
import { ScrollSmoother as Smoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(Trigger, Smoother);

export function scroll() {
  Trigger.clearScrollMemory("manual");

  const smoother = Smoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1,
    effects: true,
  });

  smoother.scrollTop(0);

  // Hold the page shut only if something on it has claimed the lock, and is
  // therefore going to release it. Pages with no such element scroll on
  // arrival and cannot freeze. Paused here rather than in the widget because
  // this runs first and is the only point the instance is guaranteed to exist.
  if (document.querySelector("[data-lock]")) smoother.paused(true);
}
