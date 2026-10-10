/**
 * The hero's particle field. A plain canvas engine, deliberately outside
 * React: one draw call per colour/alpha bucket per frame, typed arrays for
 * every particle, and no allocation inside the frame loop.
 *
 * Story, driven by scroll progress (0 → 1):
 *   halves  — a saffron half-disc (marketing) and a cobalt one (engineering)
 *   sphere  — they fold together into one rotating globe ("one brain")
 *   warp    — the globe bursts past the camera as the next chapter opens
 */

const SAFFRON = "#ffb224";
const COBALT = "#4f78ff";
const BUCKETS = 4;

export type FieldOptions = {
  canvas: HTMLCanvasElement;
  /** Returns raw scroll progress for the hero, 0–1. */
  getProgress: () => number;
  /** ms to wait before the particles assemble (the intro curtain). */
  introDelay: number;
  /** Draw one still frame, no loop, no pointer. */
  still: boolean;
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Deterministic PRNG so every visit builds the same composition. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function particleBudget() {
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const small = window.innerWidth < 768;
  // Tablets get desktop-sized screens but phone-class GPUs.
  const touch = window.matchMedia("(pointer: coarse)").matches;
  let n = small ? 1300 : touch ? 1900 : 2800;
  if (cores <= 4 || memory <= 4) n = Math.round(n * 0.7);
  return n - (n % 2);
}

export function createField(opts: FieldOptions) {
  const { canvas, getProgress, still } = opts;
  const ctx = canvas.getContext("2d", { alpha: true })!;
  const total = particleBudget();
  const half = total / 2;

  // Per-particle state. Index < half is saffron, the rest cobalt.
  const hx = new Float32Array(total); // halves, in R units
  const hy = new Float32Array(total);
  const sx = new Float32Array(total); // sphere, unit
  const sy = new Float32Array(total);
  const sz = new Float32Array(total);
  const ix = new Float32Array(total); // intro scatter, R units
  const iy = new Float32Array(total);
  const seed = new Float32Array(total);
  const wx = new Float32Array(total); // warp direction
  const wy = new Float32Array(total);
  // Rendered output, reused every frame.
  const px = new Float32Array(total);
  const py = new Float32Array(total);
  const pa = new Float32Array(total);
  const ps = new Float32Array(total);

  // Draw order is shuffled so dropping the tail under load stays uniform.
  const order = new Uint16Array(total);

  const rand = mulberry32(7);

  // ---- Halves: two half-discs, each tilted, set apart. ------------------
  for (let i = 0; i < total; i++) {
    const left = i < half;
    const r = Math.sqrt(rand());
    const a = left
      ? Math.PI / 2 + rand() * Math.PI
      : -Math.PI / 2 + rand() * Math.PI;
    let x = Math.cos(a) * r;
    let y = Math.sin(a) * r;
    const tilt = left ? -0.42 : 0.42;
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);
    [x, y] = [x * ct - y * st, x * st + y * ct];
    hx[i] = x + (left ? -0.62 : 0.62);
    hy[i] = y;
    seed[i] = rand();
    const ia = rand() * Math.PI * 2;
    const ir = 2.2 + rand() * 2.5;
    ix[i] = Math.cos(ia) * ir;
    iy[i] = Math.sin(ia) * ir;
    order[i] = i;
  }
  for (let i = total - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = order[i];
    order[i] = order[j];
    order[j] = t;
  }

  // ---- Sphere: Fibonacci points, west hemisphere saffron, east cobalt. ---
  {
    const west: number[] = [];
    const east: number[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let k = 0; k < total; k++) {
      const y = 1 - (k / (total - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = golden * k;
      const x = Math.cos(th) * rad;
      const z = Math.sin(th) * rad;
      (x < 0 ? west : east).push(x, y, z);
    }
    // Keep vertical order between halves and hemisphere so the fold flows.
    const assign = (from: number, to: number, pts: number[]) => {
      const ids = Array.from({ length: to - from }, (_, k) => from + k).sort(
        (a, b) => hy[a] - hy[b],
      );
      const n = pts.length / 3;
      const idx = Array.from({ length: n }, (_, k) => k).sort(
        (a, b) => pts[a * 3 + 1] - pts[b * 3 + 1],
      );
      ids.forEach((id, k) => {
        const p = idx[Math.floor((k / ids.length) * n)] * 3;
        sx[id] = pts[p];
        sy[id] = pts[p + 1];
        sz[id] = pts[p + 2];
      });
    };
    assign(0, half, west);
    assign(half, total, east);
  }

  // Warp: each point flies outward along its own direction on the globe.
  for (let i = 0; i < total; i++) {
    const len = Math.hypot(sx[i], sy[i]) || 1;
    wx[i] = sx[i] / len + (seed[i] - 0.5) * 0.5;
    wy[i] = sy[i] / len + (seed[(i * 7) % total] - 0.5) * 0.5;
  }

  // ---- Layout-dependent state, rebuilt on resize. ------------------------
  let w = 0;
  let h = 0;
  let dpr = 1;
  let R = 1;
  let cx = 0;
  let cy = 0;
  let dot = 1.8;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    const lowPower = (navigator.hardwareConcurrency || 4) <= 4;
    dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const narrow = w < 768;
    R = narrow ? Math.min(w * 0.235, h * 0.17) : Math.min(h * 0.25, w * 0.19);
    cx = w / 2;
    cy = narrow ? h * 0.3 : h * 0.4;
    dot = narrow ? 2.1 : 1.9;
  }

  // ---- Frame loop. --------------------------------------------------------
  let raf = 0;
  let running = false;
  let last = 0;
  let smooth = getProgress();
  let spin = 0;
  const start = performance.now() + opts.introDelay;
  let pointerX = -9999;
  let pointerY = -9999;
  let active = total;
  let slowFrames = 0;
  const paths: Path2D[] = [];

  function frame(now: number) {
    const dt = Math.min(64, now - (last || now));
    last = now;

    // Adaptive load: if frames run long, draw fewer, larger dots.
    if (!still) {
      if (dt > 22) slowFrames++;
      else slowFrames = Math.max(0, slowFrames - 1);
      if (slowFrames > 40 && active > total * 0.45) {
        active = Math.round(active * 0.8);
        slowFrames = 0;
      }
    }

    // Critically damped follow of the scroll position: smooth even when the
    // browser delivers scroll in uneven chunks.
    const target = getProgress();
    smooth += (target - smooth) * (1 - Math.exp(-dt / 90));
    if (Math.abs(target - smooth) < 0.0005) smooth = target;
    const p = still ? target : smooth;

    spin += dt * 0.00022 * (1 + p * 3);
    const intro = still ? 1 : easeOut(clamp01((now - start) / 1400));

    const t1 = clamp01((p - 0.03) / 0.3); // halves → sphere
    const t3 = clamp01((p - 0.5) / 0.32); // sphere → warp

    const ca = Math.cos(spin + p * 2.2);
    const sa = Math.sin(spin + p * 2.2);
    const tiltC = Math.cos(0.32);
    const tiltS = Math.sin(0.32);
    const breathe = now * 0.0012;
    const sizeBoost = Math.sqrt(total / active);
    const focal = 3.2;

    for (let n = 0; n < active; n++) {
      const i = order[n];
      const s = seed[i];

      // Halves, gently breathing, assembled from scatter during the intro.
      const bx = hx[i] + Math.sin(breathe + s * 12) * 0.012;
      const by = hy[i] + Math.cos(breathe * 0.9 + s * 9) * 0.012;
      let x = cx + (ix[i] + (bx - ix[i]) * intro) * R;
      let y = cy + (iy[i] + (by - iy[i]) * intro) * R;
      let alpha = 0.92 * intro;
      let size = dot;

      // Sphere, rotated on Y then tilted on X, perspective-projected.
      const e1 = easeInOut(clamp01(t1 * 1.35 - s * 0.35));
      if (e1 > 0) {
        const rx = sx[i] * ca + sz[i] * sa;
        const rz0 = -sx[i] * sa + sz[i] * ca;
        const ry = sy[i] * tiltC - rz0 * tiltS;
        const rz = sy[i] * tiltS + rz0 * tiltC;
        const k = focal / (focal - rz);
        const sxp = cx + rx * k * R * 1.12;
        const syp = cy + ry * k * R * 1.12;
        x += (sxp - x) * e1;
        y += (syp - y) * e1;
        alpha += (0.25 + 0.75 * ((rz + 1) / 2) - alpha) * e1;
        size += (dot * k * 0.95 - size) * e1;
      }

      // Warp past the camera.
      if (t3 > 0) {
        const e3 = t3 * t3;
        const reach = (0.5 + s) * Math.max(w, h) * 0.9 * e3;
        x += wx[i] * reach;
        y += wy[i] * reach;
        size *= 1 + e3 * 3.5;
        alpha *= 1 - clamp01(t3 * 1.15);
      }

      // Pointer: dots part around the cursor, desktop only.
      if (pointerX > -999 && t3 === 0) {
        const dx = x - pointerX;
        const dy = y - pointerY;
        const d2 = dx * dx + dy * dy;
        if (d2 < 16900) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / 130) * 22;
          x += (dx / d) * f;
          y += (dy / d) * f;
        }
      }

      px[n] = x;
      py[n] = y;
      pa[n] = alpha;
      ps[n] = size * sizeBoost;
    }

    // Batch: 2 colours × 4 alpha buckets = at most 8 fills per frame.
    ctx.clearRect(0, 0, w, h);
    for (let b = 0; b < BUCKETS * 2; b++) paths[b] = new Path2D();
    for (let n = 0; n < active; n++) {
      const a = pa[n];
      if (a < 0.03) continue;
      const bucket = Math.min(BUCKETS - 1, Math.floor(a * BUCKETS));
      const colour = order[n] < half ? 0 : 1;
      const sz2 = ps[n];
      paths[colour * BUCKETS + bucket].rect(px[n] - sz2 / 2, py[n] - sz2 / 2, sz2, sz2);
    }
    for (let b = 0; b < BUCKETS * 2; b++) {
      ctx.globalAlpha = ((b % BUCKETS) + 0.75) / BUCKETS;
      ctx.fillStyle = b < BUCKETS ? SAFFRON : COBALT;
      ctx.fill(paths[b]);
    }
    ctx.globalAlpha = 1;

    if (running) raf = requestAnimationFrame(frame);
  }

  function play() {
    if (running || still) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function pause() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function onPointer(e: PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const rect = canvas.getBoundingClientRect();
    pointerX = e.clientX - rect.left;
    pointerY = e.clientY - rect.top;
  }
  function onLeave() {
    pointerX = -9999;
    pointerY = -9999;
  }

  resize();
  if (still) {
    frame(performance.now());
  } else {
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);
  }

  return {
    play,
    pause,
    resize: () => {
      resize();
      if (still) frame(performance.now());
    },
    destroy: () => {
      pause();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
    },
  };
}
