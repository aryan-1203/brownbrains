import { useTransform as motionUseTransform } from "motion/react";

/**
 * Drop-in replacement for Motion's `useTransform`.
 *
 * Motion hardware-accelerates scroll-linked opacity / clip-path / filter by
 * handing the input range to WAAPI as keyframe offsets. When that range does
 * not span the whole 0–1 timeline (e.g. `[0, 0.2] -> [1, 0]`), the browser
 * interpolates back to the element's base value past the last offset, so a
 * faded-out element fades back in. Padding the range out to 0 and 1 with the
 * end values is identical under clamping and closes that gap.
 */
function pad(input: number[], output: unknown[]) {
  const first = input[0];
  const last = input[input.length - 1];
  if (input.length !== output.length || first > last) return [input, output];
  const nextIn = [...input];
  const nextOut = [...output];
  if (first > 0) {
    nextIn.unshift(0);
    nextOut.unshift(output[0]);
  }
  if (last < 1) {
    nextIn.push(1);
    nextOut.push(output[output.length - 1]);
  }
  return [nextIn, nextOut];
}

export const useTransform = ((...args: unknown[]) => {
  const [value, input, output, options] = args as [
    unknown,
    unknown,
    unknown,
    { clamp?: boolean } | undefined,
  ];
  if (
    Array.isArray(input) &&
    Array.isArray(output) &&
    typeof input[0] === "number" &&
    options?.clamp !== false
  ) {
    const [paddedIn, paddedOut] = pad(input as number[], output);
    return (motionUseTransform as (...a: unknown[]) => unknown)(
      value,
      paddedIn,
      paddedOut,
      options,
    );
  }
  return (motionUseTransform as (...a: unknown[]) => unknown)(...args);
}) as typeof motionUseTransform;
