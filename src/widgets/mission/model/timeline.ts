import gsap from "gsap";
import { ScrollTrigger as Trigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(Trigger);

export function mission(root: HTMLElement) {
  const tile = root.querySelector<HTMLElement>("[data-tile]");
  if (!tile) return;

  gsap
    .timeline({
      defaults: { ease: "power1.inOut", stagger: 0.15 },
      scrollTrigger: { trigger: tile, start: "top 75%", once: true },
    })
    .from(tile, { y: 25, duration: 0.75 }, 0)
    .from(tile, { opacity: 0, duration: 1 }, 0);
}