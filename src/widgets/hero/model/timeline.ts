import gsap from "gsap";
import { ScrollTrigger as Trigger } from "gsap/ScrollTrigger";
import { SplitText as Text } from "gsap/SplitText";
import { ScrollSmoother as Smoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(Trigger, Text, Smoother);

export function hero(root: HTMLElement) {
  const line = root.querySelector<HTMLElement>("[data-line]");
  const intro = root.querySelector<HTMLElement>("[data-intro]");
  const verse = root.querySelector<HTMLElement>("[data-verse]");
  const reference = root.querySelector<HTMLElement>("[data-reference]");
  if (!line || !intro || !verse || !reference) return;

  const range = {
    trigger: root,
    start: "top 0%",
    end: "+=250%",
  };

  let revealed = false;
  let splits: ReturnType<typeof Text.create>[] = [];

  const ctx = gsap.context(() => {
    Trigger.create({ ...range, pin: true });

    splits = [
      Text.create(intro, {
        type: "words",
        aria: "auto",
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0, 
              filter: "blur(10px)" 
            },
            {
              opacity: 1,
              filter: "blur(0px)",
              duration: 1,
              ease: "power2.out",
              stagger: 0.25,
              onComplete: () => Smoother.get()?.paused(false),
            },
          ),
      }),

      Text.create(verse, {
        type: "words",
        mask: "words",
        aria: "auto",
        autoSplit: true,
        onSplit: (self) => {
          if (!revealed) {
            gsap.set(intro, { x: 0 });
            const centre = (line.clientWidth - intro.offsetWidth) / 2;
            gsap.set(intro, { x: centre });
          }

          return gsap
            .timeline({
              defaults: { ease: "none", duration: 0.5 },
              scrollTrigger: {
                ...range,
                scrub: 1,
                once: true,
                onLeave: (self) => {
                  self.animation?.progress(1);
                  revealed = true;
                },
              },
            })
            .to(intro, { x: 0, ease: "power2.inOut" })
            .from(self.words, { yPercent: 100, stagger: { amount: 1 } })
            .from(reference, { yPercent: -100 }, ">-0.1");
        },
      }),
    ];
  }, root);

  return () => {
    splits.forEach((split) => split.revert());
    ctx.revert();
  };
}
