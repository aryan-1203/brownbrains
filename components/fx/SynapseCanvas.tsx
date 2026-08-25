"use client";

import { useEffect, useRef } from "react";
import { useTone } from "@/components/tone/ToneProvider";

type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Pulse = { a: number; b: number; t: number; speed: number };

const LINK_DISTANCE = 168;
const CURSOR_RADIUS = 150;
const MAX_PULSES = 26;

/**
 * The neuron graph behind machine-tone sections. Nodes drift and link up when
 * they drift close; pulses fire along those links, and fire faster the faster
 * you scroll. The loop only runs while the canvas is on screen.
 */
export function SynapseCanvas({ density = 1 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { reduced } = useTone();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    const pulses: Pulse[] = [];
    const pointer = { x: -9999, y: -9999 };
    // Cached so pointer tracking never reads layout; refreshed on scroll/resize.
    let bounds = { left: 0, top: 0 };

    let raf = 0;
    let running = false;
    let last = 0;
    let spawnBudget = 0;
    let scrollEnergy = 0;
    let lastScrollY = typeof window === "undefined" ? 0 : window.scrollY;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      bounds = { left: rect.left, top: rect.top };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.round(
        Math.min(46, Math.max(16, (width * height) / 26000)) * density,
      );

      nodes = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: 0.9 + Math.random() * 1.7,
      }));
      pulses.length = 0;
    };

    const spawnPulse = () => {
      if (pulses.length >= MAX_PULSES || nodes.length < 2) return;
      const a = Math.floor(Math.random() * nodes.length);
      // Only fire along a link that currently exists.
      const candidates: number[] = [];
      for (let b = 0; b < nodes.length; b++) {
        if (b === a) continue;
        const dx = nodes[a].x - nodes[b].x;
        const dy = nodes[a].y - nodes[b].y;
        if (dx * dx + dy * dy < LINK_DISTANCE * LINK_DISTANCE) candidates.push(b);
      }
      if (!candidates.length) return;
      pulses.push({
        a,
        b: candidates[Math.floor(Math.random() * candidates.length)],
        t: 0,
        speed: 0.5 + Math.random() * 0.85,
      });
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const node of nodes) {
        node.x += node.vx * dt;
        node.y += node.vy * dt;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        node.x = Math.min(width, Math.max(0, node.x));
        node.y = Math.min(height, Math.max(0, node.y));

        const dx = node.x - pointer.x;
        const dy = node.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < CURSOR_RADIUS && dist > 0.001) {
          const push = (1 - dist / CURSOR_RADIUS) * 0.42;
          node.x += (dx / dist) * push * dt;
          node.y += (dy / dist) * push * dt;
        }
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DISTANCE) continue;
          const strength = 1 - dist / LINK_DISTANCE;
          ctx.strokeStyle = `rgba(232, 121, 79, ${(strength * 0.2).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      for (const node of nodes) {
        ctx.fillStyle = "rgba(240, 233, 223, 0.32)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.t += (pulse.speed * dt) / 58;
        if (pulse.t >= 1 || !nodes[pulse.a] || !nodes[pulse.b]) {
          pulses.splice(i, 1);
          continue;
        }
        const from = nodes[pulse.a];
        const to = nodes[pulse.b];
        const x = from.x + (to.x - from.x) * pulse.t;
        const y = from.y + (to.y - from.y) * pulse.t;
        // Fade in and out so pulses never pop at the endpoints.
        const alpha = Math.sin(pulse.t * Math.PI);

        const glow = ctx.createRadialGradient(x, y, 0, x, y, 13);
        glow.addColorStop(0, `rgba(233, 180, 76, ${(alpha * 0.62).toFixed(3)})`);
        glow.addColorStop(1, "rgba(233, 180, 76, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 236, 195, ${(alpha * 0.92).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const frame = (time: number) => {
      if (!running) return;
      // Clamp so a backgrounded tab does not resume with one giant timestep.
      const dt = Math.min(32, time - last || 16);
      last = time;

      scrollEnergy *= 0.93;
      spawnBudget += (dt / 1000) * (1.5 + scrollEnergy * 9);
      while (spawnBudget >= 1) {
        spawnPulse();
        spawnBudget -= 1;
      }

      draw(dt);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      scrollEnergy = Math.min(1, scrollEnergy + delta / 420);
      const rect = canvas.getBoundingClientRect();
      bounds = { left: rect.left, top: rect.top };
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    };

    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    build();
    if (reduced) {
      draw(16);
      return () => {};
    }

    const visibility = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "120px" },
    );
    visibility.observe(canvas);

    const resize = new ResizeObserver(() => build());
    resize.observe(canvas);

    const onVisibilityChange = () =>
      document.hidden ? stop() : visibility.takeRecords().length || start();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      visibility.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [density, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
    />
  );
}
