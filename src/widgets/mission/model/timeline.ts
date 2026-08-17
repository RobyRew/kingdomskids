import gsap from "gsap";
import { ScrollTrigger as Trigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(Trigger);

export function mission(root: HTMLElement) {
  const cards = [...root.querySelectorAll<HTMLElement>("[data-card]")];
  const [first] = cards;
  if (!first) return;

  gsap
    .timeline({
      defaults: { ease: "power1.inOut", stagger: 0.15 },
      scrollTrigger: { trigger: first, start: "top 75%", once: true },
    })
    .from(cards, { y: 25, duration: 0.75 }, 0)
    .from(cards, { opacity: 0, duration: 1 }, 0);
}
