import gsap from "gsap";
import { ScrollTrigger as Trigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(Trigger);

declare global {
  interface HTMLElementEventMap {
    "carousel:go": CustomEvent<number>;
    "carousel:toggle": CustomEvent;
  }
}

const dwell = 6.15;
const lift = 30;
const perch = 100;
const mode = "data-state";
const playing = "playing";
const paused = "paused";
const ended = "ended";

interface Parts {
  root: HTMLElement;
  track: HTMLElement;
  cards: HTMLElement[];
  step: number;
}

function collect(root: HTMLElement): Parts | undefined {
  const track = root.querySelector<HTMLElement>("[data-track]");
  const cards = [...root.querySelectorAll<HTMLElement>("[data-card]")];
  const [first, second] = cards;

  if (!track || !first || !second) return undefined;
  return { root, track, cards, step: second.offsetLeft - first.offsetLeft };
}

function spot({ track, step }: Parts) {
  return Math.round(track.scrollLeft / step);
}

function tick(root: HTMLElement, progress: number) {
  root.style.setProperty("--carousel-progress", String(progress));
}

function land({ root, track, cards }: Parts, dest: number) {
  const card = cards[dest];
  if (!card) return;

  const frame = track.getBoundingClientRect();
  const box = card.getBoundingClientRect();
  const slack = (frame.width - box.width) / 2;
  const left = track.scrollLeft + box.left - frame.left - slack;

  track.scrollTo({ left, behavior: "smooth" });
  root.setAttribute("data-current", String(dest));
}

function next(parts: Parts, beat: gsap.core.Tween) {
  const dest = spot(parts) + 1;

  if (dest >= parts.cards.length) {
    parts.root.setAttribute(mode, ended);
    return;
  }

  land(parts, dest);
  beat.restart();
}

function clock(parts: Parts) {
  const counter = { pass: 0 };

  const beat: gsap.core.Tween = gsap.to(counter, {
    pass: 1,
    duration: dwell,
    ease: "none",
    paused: true,
    onUpdate: () => tick(parts.root, counter.pass),
    onComplete: () => next(parts, beat),
  });

  return beat;
}

function jump(parts: Parts, beat: gsap.core.Tween, dest: number) {
  land(parts, dest);
  parts.root.setAttribute(mode, playing);
  beat.restart();
}

function toggle(parts: Parts, beat: gsap.core.Tween) {
  const now = parts.root.getAttribute(mode);

  if (now === ended) {
    jump(parts, beat, 0);
    return;
  }
  if (now === playing) {
    parts.root.setAttribute(mode, paused);
    beat.pause();
    return;
  }

  parts.root.setAttribute(mode, playing);
  beat.play();
}

function listen(parts: Parts, beat: gsap.core.Tween) {
  const { root } = parts;

  root.addEventListener("carousel:go", (event) =>
    jump(parts, beat, event.detail),
  );
  root.addEventListener("carousel:toggle", () => toggle(parts, beat));
}

function watch(parts: Parts, beat: gsap.core.Tween) {
  const wake = () => {
    if (parts.root.getAttribute(mode) === playing) beat.play();
  };
  const halt = () => beat.pause();

  const view = Trigger.create({
    trigger: parts.root,
    start: "top bottom",
    end: "bottom top",
    onEnter: wake,
    onEnterBack: wake,
    onLeave: halt,
    onLeaveBack: halt,
  });

  if (view.isActive) wake();
}

function drift(nav: HTMLElement, box: HTMLElement) {
  const frame = box.getBoundingClientRect();
  const tall = nav.offsetHeight;
  const home = frame.bottom - perch - tall;
  const reach = home - frame.top - lift;
  const want = window.innerHeight - lift - tall - home;

  gsap.set(nav, { y: gsap.utils.clamp(-reach, 0, want) });
}

function trail(root: HTMLElement) {
  const box = root.querySelector<HTMLElement>("[data-control]");
  const nav = box?.firstElementChild;
  if (!box || !(nav instanceof HTMLElement)) return;

  const move = () => drift(nav, box);

  Trigger.create({
    trigger: root,
    start: "top bottom",
    end: "bottom top",
    onUpdate: move,
    onRefresh: move,
  });
}

export function carousel(root: HTMLElement) {
  const parts = collect(root);
  if (!parts) return;

  const beat = clock(parts);

  listen(parts, beat);
  watch(parts, beat);
  trail(root);
  tick(root, 0);
  root.setAttribute("data-current", "0");
  root.setAttribute(mode, playing);
}
