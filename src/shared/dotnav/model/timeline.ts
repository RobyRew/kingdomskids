import gsap from "gsap";
import { ScrollTrigger as Trigger } from "gsap/ScrollTrigger";
import { bloom } from "@/shared/dotnav/model/intro";
import type { Bubble, Parts } from "@/shared/dotnav/model/intro";

gsap.registerPlugin(Trigger);

function frame(nav: HTMLElement) {
  return {
    lift: nav.querySelector<HTMLElement>("[data-lift]"),
    seed: nav.querySelector<HTMLElement>("[data-seed]"),
    box: nav.querySelector<HTMLElement>("[data-dots]"),
    blueprint: nav.querySelector<HTMLTemplateElement>("[data-blueprint]"),
    toggle: nav.querySelector<HTMLElement>("[data-toggle]"),
  };
}

function pair(nav: HTMLElement) {
  const bubbles: Bubble[] = [];

  nav.querySelectorAll<HTMLElement>("[data-bubble]").forEach((element) => {
    const skin = element.querySelector<HTMLElement>("[data-skin]");
    if (skin) bubbles.push({ element, skin });
  });

  return bubbles;
}

function collect(nav: HTMLElement): Parts | undefined {
  const carousel = nav.closest<HTMLElement>("[data-carousel]");
  const { lift, seed, box, blueprint, toggle } = frame(nav);
  const bubbles = pair(nav);

  if (!carousel || !lift || !seed) return undefined;
  if (!box || !blueprint || !toggle) return undefined;
  if (bubbles.length < 2) return undefined;
  return { lift, seed, carousel, box, blueprint, toggle, bubbles };
}

function send(carousel: HTMLElement, name: string, detail: number) {
  carousel.dispatchEvent(new CustomEvent(name, { detail }));
}

function mint({ carousel, blueprint }: Parts, index: number) {
  const dot = blueprint.content.firstElementChild?.cloneNode(true);
  if (!(dot instanceof HTMLButtonElement)) return undefined;

  dot.setAttribute("data-dot", String(index));
  dot.style.setProperty("--item-index", String(index));
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

function wake(parts: Parts, show: gsap.core.Timeline) {
  Trigger.create({
    trigger: parts.carousel,
    start: "top 35%",
    once: true,
    onEnter: () => show.play(),
  });
}

export function dotnav(nav: HTMLElement) {
  const parts = collect(nav);
  if (!parts) return;

  const dots = build(parts);

  parts.toggle.addEventListener("click", () =>
    parts.carousel.dispatchEvent(new CustomEvent("carousel:toggle")),
  );

  mark(dots, parts.carousel);
  follow(parts, dots);
  wake(parts, bloom(parts, dots));
}
