interface Spec {
  stiffness: number;
  damping: number;
  duration: number;
}

function overdamped(decay: number) {
  return (ratio: number) => 1 - Math.exp(-decay * ratio) * (1 + decay * ratio);
}

function underdamped(decay: number, wave: number) {
  return (ratio: number) =>
    1 -
    Math.exp(-decay * ratio) *
      (Math.cos(wave * ratio) + (decay / wave) * Math.sin(wave * ratio));
}

function curve({ stiffness, damping, duration }: Spec) {
  const freq = Math.sqrt(stiffness) * duration;
  const zeta = damping / (2 * Math.sqrt(stiffness));
  const decay = zeta * freq;

  if (zeta >= 1) return overdamped(decay);
  return underdamped(decay, freq * Math.sqrt(1 - zeta * zeta));
}

function spring(spec: Spec) {
  const raw = curve(spec);
  const span = raw(1);

  return (ratio: number) => raw(ratio) / span;
}

function responsive(response: number, bounce: number) {
  const freq = (2 * Math.PI) / response;
  const zeta = 1 - bounce;

  return {
    stiffness: freq * freq,
    damping: 2 * zeta * freq,
    duration: (zeta >= 1 ? 9.25 : 6.5) / freq,
  };
}

export function paced(stiffness: number, damping: number, duration: number) {
  return { ease: spring({ stiffness, damping, duration }), duration };
}

export function popped(response: number) {
  const spec = responsive(response, 0);
  return { ease: spring(spec), duration: spec.duration };
}
