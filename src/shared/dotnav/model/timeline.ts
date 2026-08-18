import gsap from "gsap";
import { ScrollTrigger as Trigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(Trigger);

const rise = 400;
const bead = 50;
const swell = "power2.out";

function spring(stiffness: number, damping: number) {
  const freq = Math.sqrt(stiffness);
  const zeta = damping / (2 * freq);
  const decay = zeta * freq;

  if (zeta >= 1) {
    return (ratio: number) =>
      1 - Math.exp(-decay * ratio) * (1 + decay * ratio);
  }

  const wave = freq * Math.sqrt(1 - zeta * zeta);
  return (ratio: number) =>
    1 -
    Math.exp(-decay * ratio) *
      (Math.cos(wave * ratio) + (decay / wave) * Math.sin(wave * ratio));
}

const bouncy = spring(100, 10);
const quick = spring(200, 20);

interface Parts {
  lift: HTMLElement;
  carousel: HTMLElement;
  box: HTMLElement;
  blueprint: HTMLTemplateElement;
}

interface Stage {
  bubble: HTMLElement;
  toggle: HTMLElement;
  stem: HTMLElement;
  disc: HTMLElement;
}

function collect(nav: HTMLElement): Parts | undefined {
  const carousel = nav.closest<HTMLElement>("[data-carousel]");
  const lift = nav.querySelector<HTMLElement>("[data-lift]");
  const box = nav.querySelector<HTMLElement>("[data-dots]");
  const blueprint = nav.querySelector<HTMLTemplateElement>("[data-blueprint]");

  if (!carousel || !lift || !box || !blueprint) return undefined;
  return { lift, carousel, box, blueprint };
}

function staging(nav: HTMLElement): Stage | undefined {
  const bubble = nav.querySelector<HTMLElement>("[data-bubble]");
  const toggle = nav.querySelector<HTMLElement>("[data-toggle]");
  const [stem, disc] = [...nav.querySelectorAll<HTMLElement>("[data-skin]")];

  if (!bubble || !toggle || !stem || !disc) return undefined;
  return { bubble, toggle, stem, disc };
}

function send(carousel: HTMLElement, name: string, detail: number) {
  carousel.dispatchEvent(new CustomEvent(name, { detail }));
}

function mint({ carousel, blueprint }: Parts, index: number) {
  const dot = blueprint.content.firstElementChild?.cloneNode(true);
  if (!(dot instanceof HTMLButtonElement)) return undefined;

  dot.setAttribute("data-dot", String(index));
  dot.addEventListener("click", () => send(carousel, "carousel:go", index));
  return dot;
}

function build(parts: Parts) {
  const count = parts.carousel.querySelectorAll("[data-card]").length;
  const dots = [...Array(count).keys()]
    .map((index) => mint(parts, index))
    .filter((dot) => dot !== undefined);

  parts.box.replaceChildren(...dots);
  return dots;
}

function mark(dots: HTMLButtonElement[], carousel: HTMLElement) {
  const current = Number(carousel.getAttribute("data-current"));

  dots.forEach((dot, index) =>
    dot.toggleAttribute("data-active", index === current),
  );
}

function follow(parts: Parts, dots: HTMLButtonElement[]) {
  const watcher = new MutationObserver(() => mark(dots, parts.carousel));

  watcher.observe(parts.carousel, {
    attributes: true,
    attributeFilter: ["data-current"],
  });
}

function shape(parts: Parts, stage: Stage) {
  return {
    wide: stage.bubble.offsetWidth,
    spot: stage.toggle.offsetLeft,
    mid: (parts.lift.offsetWidth - bead) / 2,
  };
}

function curtain(stage: Stage, dots: HTMLButtonElement[], mid: number) {
  gsap.set([stage.stem, stage.disc], { x: mid, width: bead });
  gsap.set(stage.stem, { scale: 1.3 });
  gsap.set(stage.disc, { scale: 0 });
  gsap.set([dots, stage.toggle.querySelectorAll("svg")], { opacity: 0 });
}

function spread(parts: Parts, dots: HTMLButtonElement[]) {
  const heart = parts.box.offsetLeft + parts.box.offsetWidth / 2;

  return dots.map((dot) => heart - dot.offsetLeft - dot.offsetWidth / 2);
}

function arrive(stage: Stage, dots: HTMLButtonElement[], nudge: number[]) {
  const marks = stage.toggle.querySelectorAll("svg");
  const land = {
    x: 0,
    opacity: 1,
    duration: 0.55,
    ease: quick,
    stagger: 0.035,
  };

  return gsap
    .timeline()
    .fromTo(dots, { x: (index: number) => nudge[index] ?? 0 }, land, 0)
    .to(marks, { opacity: 1, duration: 0.24, ease: swell }, 0.08);
}

function flight(parts: Parts, stage: Stage, size: ReturnType<typeof shape>) {
  return gsap
    .timeline({ paused: true })
    .set(parts.lift, { opacity: 1, immediateRender: false }, 0)
    .from(parts.lift, { y: rise, duration: 1.6, ease: bouncy }, 0)
    .to(stage.stem, { scale: 1, duration: 0.24, ease: swell }, 0.5)
    .to(
      stage.stem,
      { x: 0, width: size.wide, duration: 0.43, ease: swell },
      0.5,
    )
    .to(stage.disc, { scale: 1, duration: 0.35, ease: swell }, 0.5)
    .to(stage.disc, { x: size.spot, duration: 0.43, ease: swell }, 0.5);
}

function bloom(parts: Parts, stage: Stage, dots: HTMLButtonElement[]) {
  const size = shape(parts, stage);
  const nudge = spread(parts, dots);

  curtain(stage, dots, size.mid);
  const show = flight(parts, stage, size);

  show.add(arrive(stage, dots, nudge), 0.78);
  return show;
}

function wake(parts: Parts, show: gsap.core.Timeline) {
  Trigger.create({
    trigger: parts.carousel,
    start: "top 33%",
    once: true,
    onEnter: () => show.play(),
  });
}

export function dotnav(nav: HTMLElement) {
  const parts = collect(nav);
  const stage = staging(nav);
  if (!parts || !stage) return;

  const dots = build(parts);

  stage.toggle.addEventListener("click", () =>
    parts.carousel.dispatchEvent(new CustomEvent("carousel:toggle")),
  );

  mark(dots, parts.carousel);
  follow(parts, dots);
  wake(parts, bloom(parts, stage, dots));
}
