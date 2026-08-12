import gsap from "gsap";
import { ScrollTrigger as Trigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(Trigger);

export function antiphon(root: HTMLElement) {
  const line = root.querySelector<HTMLElement>("[data-line]");
  if (!line) return;

  gsap.from(line, {
    opacity: 0,
    y: 25,
    duration: 0.75,
    ease: "power2.out",
    scrollTrigger: { trigger: line, start: "top 75%", once: true },
  });
}
