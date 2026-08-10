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

  if (document.querySelector("[data-lock]")) smoother.paused(true);
}
