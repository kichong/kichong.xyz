// Smooth, bounded value noise: no repeating timeline or per-frame randomness.
function createNoise() {
  const seed = Math.random() * 10000;
  const value = (index) => {
    const raw = Math.sin(index * 127.1 + seed * 311.7) * 43758.5453;
    return (raw - Math.floor(raw)) * 2 - 1;
  };
  return (time) => {
    const index = Math.floor(time);
    const fraction = time - index;
    const smooth = fraction ** 3 * (fraction * (fraction * 6 - 15) + 10);
    return value(index) + (value(index + 1) - value(index)) * smooth;
  };
}

const stage = document.querySelector('.fire-stage');
const glow = document.querySelector('.ambient-glow');

if (stage && glow) {
  const flameA = stage.querySelector('.fire-state-a');
  const flameB = stage.querySelector('.fire-state-b');
  const highlight = stage.querySelector('.fire-spark');
  const layers = [...glow.querySelectorAll('.glow-layer')];
  const noise = Array.from({ length: 17 }, createNoise);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let ready = false;
  let frame = null;
  let previousTime = null;
  let elapsed = 0;

  function paint(time) {
    const energy = noise[0](time / 3.7);
    const swell = noise[1](time / 11.3);
    const blend = (noise[2](time / 5.9) + 1) / 2;
    const entrance = Math.min(time / 2, 1);
    const mix = blend * blend * (3 - 2 * blend) * entrance * entrance * (3 - 2 * entrance);
    // Complementary weights let each approved silhouette fully replace the other.
    flameA.style.opacity = (1 - mix).toFixed(4);
    flameB.style.opacity = mix.toFixed(4);
    const lean = noise[3](time / 2.9) * 0.45;
    const lift = noise[4](time / 2.1) * 0.24;
    const width = 1 + noise[5](time / 3.1) * 0.006;
    const height = 1 + energy * 0.009 + swell * 0.004;
    const shape = `translate(${lean}%, ${lift}%) skewX(${lean * 0.65}deg) scale(${width}, ${height})`;
    flameA.style.transform = shape;
    flameB.style.transform = shape;
    // Matching the dominant silhouette keeps the highlight from ghosting.
    highlight.style.opacity = ((0.055 + energy * 0.018 + noise[6](time / 0.73) * 0.012) * (1 - mix)).toFixed(4);
    highlight.style.transform = shape;
    layers.forEach((layer, index) => {
      const drift = noise[7 + index](time / (4.1 + index * 0.83));
      const spread = noise[12 + index](time / (6.7 + index * 0.71));
      layer.style.opacity = (0.83 + energy * 0.07 + swell * 0.04 + drift * 0.06).toFixed(4);
      layer.style.transform = `translate(${drift * 1.8}%, ${spread * 1.4}%) scale(${1 + energy * 0.025 + spread * 0.04}, ${1 + swell * 0.025 + drift * 0.035})`;
    });
  }

  function tick(now) {
    if (previousTime !== null) elapsed += Math.min((now - previousTime) / 1000, 0.05);
    previousTime = now;
    paint(elapsed);
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    previousTime = null;
    const running = ready && !document.hidden && !reducedMotion.matches;
    stage.classList.toggle('is-animating', running);
    glow.classList.toggle('is-animating', running);
    if (reducedMotion.matches) {
      elapsed = 0;
      [flameA, flameB, highlight, ...layers].forEach((element) => element.removeAttribute('style'));
    } else if (ready && !document.hidden) {
      frame = requestAnimationFrame(tick);
    }
  }

  reducedMotion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    previousTime = null;
    stage.classList.remove('is-animating');
    glow.classList.remove('is-animating');
  });
  window.addEventListener('pageshow', sync);
  Promise.all([flameA.decode(), flameB.decode()]).then(() => {
    ready = true;
    sync();
  }).catch(() => {
    // CSS keeps the first artwork and ambient light visible if decoding fails.
  });
}
