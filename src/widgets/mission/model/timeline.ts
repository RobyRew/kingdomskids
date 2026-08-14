import gsap from "gsap";
import { ScrollTrigger as Trigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(Trigger);

export function mission(root: HTMLElement) {
  const tiles = [...root.querySelectorAll<HTMLElement>("[data-tile]")];
  const [first] = tiles;
  if (!first) return;

  gsap
    .timeline({
      defaults: { ease: "power1.inOut", stagger: 0.15 },
      scrollTrigger: { trigger: first, start: "top 75%", once: true },
    })
    .from(tiles, { y: 25, duration: 0.75 }, 0)
    .from(tiles, { opacity: 0, duration: 1 }, 0);
}
