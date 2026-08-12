import gsap from "gsap";
import { ScrollTrigger as Trigger } from "gsap/ScrollTrigger";
import { SplitText as Text } from "gsap/SplitText";
import { ScrollSmoother as Smoother } from "gsap/ScrollSmoother";
import { DrawSVGPlugin as Draw } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(Trigger, Text, Smoother, Draw);

interface Parts {
  root: HTMLElement;
  line: HTMLElement;
  intro: HTMLElement;
  verse: HTMLElement;
  reference: HTMLElement;
  drawing: SVGSVGElement;
}

function collect(root: HTMLElement): Parts | undefined {
  const line = root.querySelector<HTMLElement>("[data-line]");
  const intro = root.querySelector<HTMLElement>("[data-intro]");
  const verse = root.querySelector<HTMLElement>("[data-verse]");
  const reference = root.querySelector<HTMLElement>("[data-reference]");
  const drawing = root.querySelector<SVGSVGElement>("[data-drawing]");

  if (!line || !intro || !verse || !reference || !drawing) return undefined;
  return { root, line, intro, verse, reference, drawing };
}

function centre({ line, intro }: Parts) {
  gsap.set(intro, { x: (line.clientWidth - intro.offsetWidth) / 2 });
}

function greet({ intro }: Parts) {
  return Text.create(intro, {
    type: "words",
    aria: "auto",
    autoSplit: true,
    onSplit: (self) =>
      gsap.fromTo(
        self.words,
        { opacity: 0, filter: "blur(10px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power2.out",
          stagger: 0.25,
          onComplete: () => Smoother.get()?.paused(false),
        },
      ),
  });
}

function ordered(drawing: SVGSVGElement) {
  return [...drawing.querySelectorAll("path")].sort(
    (first, second) => first.getBBox().y - second.getBBox().y,
  );
}

function sequence({ intro, reference, drawing }: Parts, words: Element[]) {
  return gsap
    .timeline({ defaults: { ease: "none", duration: 0.5 } })
    .to(intro, { x: 0, ease: "power2.inOut" })
    .addLabel("verse")
    .from(words, { yPercent: 100, stagger: { amount: 1 } })
    .from(reference, { yPercent: -100 }, ">-0.1")
    .from(
      ordered(drawing),
      { drawSVG: 0, duration: 1, stagger: { amount: 1.5 } },
      "verse",
    );
}

function drive(
  root: HTMLElement,
  animation: gsap.core.Timeline,
  onSettled: () => void,
) {
  Trigger.create({
    trigger: root,
    start: "top 0%",
    end: "+=250%",
    scrub: 1,
    once: true,
    animation,
    onLeave: () => {
      animation.progress(1);
      onSettled();
    },
  });
}

function reveal(parts: Parts) {
  let settled = false;

  return Text.create(parts.verse, {
    type: "words",
    mask: "words",
    aria: "auto",
    autoSplit: true,
    onSplit: (self) => {
      if (!settled) centre(parts);

      const animation = sequence(parts, self.words);
      drive(parts.root, animation, () => {
        settled = true;
      });
      return animation;
    },
  });
}

export function hero(root: HTMLElement) {
  const parts = collect(root);
  if (!parts) return;

  Trigger.create({
    trigger: root,
    start: "top 0%",
    end: "+=250%",
    pin: true,
  });

  greet(parts);
  reveal(parts);
}
