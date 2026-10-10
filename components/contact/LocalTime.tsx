"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("en-IN", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
});

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}

/** Minute-precision string, so the snapshot stays stable between ticks. */
function getSnapshot() {
  return formatter.format(new Date()).toLowerCase();
}

function getServerSnapshot() {
  return null;
}

/** Live clock for the studio's timezone. Renders nothing on the server. */
export function LocalTime({ city }: { city: string }) {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!time) return <span>{city}</span>;
  return (
    <span>
      It&rsquo;s <time className="tabular-nums">{time}</time> in {city}
    </span>
  );
}
