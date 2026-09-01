import gsap from "gsap";

const drop = 1;
const hold = 1;
const fade = 1;
const ease = "power1.inOut";

interface Parts {
  veil: HTMLElement;
  links: HTMLElement[];
}

interface Hues {
  backgroundColor: string;
  color: string;
}

interface Skin {
  veil: Hues;
  link: string;
}

function collect(root: HTMLElement): Parts | undefined {
  const veil = root.querySelector<HTMLElement>("[data-veil]");
  const links = [...root.querySelectorAll<HTMLElement>("[data-link]")];

  if (!veil) return undefined;
  return { veil, links };
}

function token(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function resting(parts: Parts): Skin {
  const [link] = parts.links;
  const style = getComputedStyle(parts.veil);

  return {
    veil: { backgroundColor: style.backgroundColor, color: style.color },
    link: link ? getComputedStyle(link).color : "",
  };
}

function opening(): Hues {
  return {
    backgroundColor: token("--color-accent"),
    color: token("--color-background"),
  };
}

function dress(parts: Parts, hues: Hues) {
  gsap.set(parts.veil, { yPercent: -100, ...hues });
  gsap.set(parts.links, { color: hues.color });
}

function entry(parts: Parts, rest: Skin) {
  gsap
    .timeline({ defaults: { ease } })
    .to(parts.veil, { yPercent: 0, duration: drop }, 0)
    .to(parts.veil, { ...rest.veil, duration: fade }, drop + hold)
    .to(parts.links, { color: rest.link, duration: fade }, drop + hold);
}

export function ribbon(root: HTMLElement) {
  const parts = collect(root);
  if (!parts) return;

  const rest = resting(parts);

  dress(parts, opening());
  entry(parts, rest);
}
