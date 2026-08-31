import gsap from "gsap";
import { paced, popped } from "@/shared/dotnav/lib/spring";

const rise = 200;
const spill = 35;
const bead = 50;
const squat = 30;
const stub = 35;
const wide = 70;
const slim = 25;
const tall = 70;
const swell = "--scale";
const alpha = "--alpha";

const bouncy = paced(100, 10, 1.25);
const steady = paced(100, 20, 0.95);
const dart = paced(200, 20, 0.75);
const supple = paced(100, 8, 1.75);
const snap = popped(0.25);
const glide = popped(0.65);

export interface Bubble {
  element: HTMLElement;
  skin: HTMLElement;
}

export interface Parts {
  lift: HTMLElement;
  seed: HTMLElement;
  carousel: HTMLElement;
  box: HTMLElement;
  blueprint: HTMLTemplateElement;
  toggle: HTMLElement;
  bubbles: Bubble[];
}

function anchor(parts: Parts) {
  const mid = parts.lift.getBoundingClientRect();

  return parts.bubbles.map((bubble) => {
    const box = bubble.element.getBoundingClientRect();
    return mid.left + mid.width / 2 - box.left - box.width / 2;
  });
}

function hide(parts: Parts, dots: HTMLButtonElement[]) {
  gsap.set(parts.lift, { y: rise });
  gsap.set(parts.seed, {
    scale: 1.25,
    opacity: 0,
    width: slim,
    height: tall,
    xPercent: -50,
    yPercent: -50,
  });
  gsap.set(dots, { x: spill, opacity: 0 });
  gsap.set(parts.toggle, { opacity: 0, scale: 0.5 });
}

function curtain(parts: Parts, dots: HTMLButtonElement[]) {
  const [stadium, circle] = parts.bubbles;
  if (!stadium || !circle) return;

  gsap.set(stadium.element, { "--progress-intro": 0 });
  const shift = anchor(parts);

  hide(parts, dots);
  parts.bubbles.forEach((bubble, index) => {
    gsap.set(bubble.element, { x: shift[index] ?? 0, opacity: 0, [alpha]: 0 });
    gsap.set(bubble.skin, { height: squat });
  });
  gsap.set(stadium.skin, { [swell]: 1.25, width: stub });
  gsap.set(circle.skin, { [swell]: 0, width: wide });
}

function faces(parts: Parts) {
  return parts.bubbles.map((bubble) => bubble.element);
}

function arrive(show: gsap.core.Timeline, parts: Parts) {
  show
    .to(parts.lift, { y: 0, ...bouncy }, 0)
    .set(faces(parts), { opacity: 1 }, 0.025)
    .set(parts.seed, { opacity: 1 }, 0.025)
    .to(parts.seed, { scale: 0.75, ...snap }, 0.025)
    .to(parts.seed, { height: bead, ...supple }, 0.15)
    .set(parts.seed, { opacity: 0 }, 0.5);
}

function spread(show: gsap.core.Timeline, parts: Parts, rest: number) {
  const [stadium, circle] = parts.bubbles;
  if (!stadium || !circle) return;

  show
    .to(stadium.skin, { [swell]: 1, ...snap }, 0.25)
    .to(stadium.element, { x: 0, ...steady }, 0.5)
    .to(stadium.skin, { width: rest, ...bouncy }, 0.5)
    .to(circle.element, { x: 0, ...steady }, 0.55)
    .to(circle.skin, { [swell]: 1, ...glide }, 0.55)
    .to(stadium.skin, { height: bead, ...bouncy }, 0.75)
    .to(circle.skin, { width: bead, height: bead, ...bouncy }, 0.75);
}

function ready(parts: Parts) {
  parts.carousel.dispatchEvent(new CustomEvent("carousel:ready"));
}

function land(
  show: gsap.core.Timeline,
  parts: Parts,
  dots: HTMLButtonElement[],
) {
  const [stadium] = parts.bubbles;
  if (!stadium) return;

  show
    .to(dots, { x: 0, ...dart, stagger: 0.025 }, 0.75)
    .to(dots, { opacity: 1, duration: 0.1, ease: "power1.in" }, 0.75)
    .to(stadium.element, { "--progress-intro": 1, ...dart }, 0.75)
    .to(parts.toggle, { opacity: 1, duration: 0.1, ease: "power1.in" }, 0.95)
    .to(parts.toggle, { scale: 1, duration: 0.25, ease: "power1.out" }, 0.95)
    .to(faces(parts), { [alpha]: 1, ...steady }, 1)
    .call(() => ready(parts), undefined, 0.85);
}

function relax(parts: Parts) {
  gsap.set(parts.lift, { willChange: "auto" });
}

export function bloom(parts: Parts, dots: HTMLButtonElement[]) {
  const [stadium] = parts.bubbles;
  const rest = stadium?.element.getBoundingClientRect().width ?? 0;

  curtain(parts, dots);

  const show = gsap.timeline({
    paused: true,
    onComplete: () => relax(parts),
  });
  arrive(show, parts);
  spread(show, parts, rest);
  land(show, parts, dots);
  return show;
}
