import gsap from "gsap";
import { ScrollTrigger as Trigger } from "gsap/ScrollTrigger";
import { SplitText as Text } from "gsap/SplitText";
import { ScrollSmoother as Smoother } from "gsap/ScrollSmoother";
import { DrawSVGPlugin as Draw } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(Trigger, Text, Smoother, Draw);

interface Parts {
  frame: HTMLElement;
  line: HTMLElement;
  intro: HTMLElement;
  verse: HTMLElement;
  reference: HTMLElement;
  drawing: SVGSVGElement;
}

function collect(root: HTMLElement): Parts | undefined {
  const frame = root.querySelector<HTMLElement>("[data-pin]");
  const line = root.querySelector<HTMLElement>("[data-line]");
  const intro = root.querySelector<HTMLElement>("[data-intro]");
  const verse = root.querySelector<HTMLElement>("[data-verse]");
  const reference = root.querySelector<HTMLElement>("[data-reference]");
  const drawing = root.querySelector<SVGSVGElement>("[data-drawing]");

  if (!frame || !line || !intro || !verse || !reference || !drawing)
    return undefined;
  return { frame, line, intro, verse, reference, drawing };
}

function centre({ line, intro }: Parts) {
  gsap.set(intro, { x: (line.clientWidth - intro.offsetWidth) / 2 });
}

// power2.out where the other reveals use power1.inOut: this tween resolves a
// blur rather than travel, and the long tail is where the focus lands.
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

function drive(frame: HTMLElement, onSettled: () => void) {
  return {
    trigger: frame,
    start: "top 0%",
    end: "+=250%",
    scrub: 1,
    once: true,
    onLeave: (self: Trigger) => {
      self.animation?.progress(1);
      onSettled();
    },
  };
}

function sequence(parts: Parts, words: Element[], onSettled: () => void) {
  const { frame, intro, reference, drawing } = parts;

  return gsap
    .timeline({
      defaults: { ease: "none", duration: 0.5 },
      scrollTrigger: drive(frame, onSettled),
    })
    .to(intro, { x: 0, ease: "power2.inOut" })
    .addLabel("verse")
    .from(words, { yPercent: 100, stagger: { amount: 1 } })
    .from(reference, { yPercent: -100, duration: 1 }, ">-0.1")
    .from(
      ordered(drawing),
      { drawSVG: 0, duration: 1, stagger: { amount: 1.5 } },
      "verse",
    );
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

      return sequence(parts, self.words, () => {
        settled = true;
      });
    },
  });
}

export function hero(root: HTMLElement) {
  const parts = collect(root);
  if (!parts) return;

  Trigger.create({
    trigger: parts.frame,
    start: "top 0%",
    end: "+=250%",
    pin: true,
  });

  greet(parts);
  reveal(parts);
}
