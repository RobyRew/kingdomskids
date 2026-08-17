import gsap from "gsap";
import { ScrollTrigger as Trigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(Trigger);

export function antiphon(root: HTMLElement) {
  const line = root.querySelector<HTMLElement>("[data-line]");
  if (!line) return;

  gsap
    .timeline({
      defaults: { ease: "power1.inOut" },
      scrollTrigger: { trigger: line, start: "top 75%", once: true },
    })
    .from(line, { y: 25, duration: 0.75 }, 0)
    .from(line, { opacity: 0, duration: 1 }, 0);
}
