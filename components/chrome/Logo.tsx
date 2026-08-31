import { cn } from "@/lib/cn";

/**
 * Twin lobes that lean together on hover — marketing and engineering, one mark.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("group/logo inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 34 20"
        aria-hidden
        className="h-[1.05em] w-auto overflow-visible"
      >
        <circle
          cx="10"
          cy="10"
          r="8.2"
          fill="currentColor"
          className="origin-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:translate-x-[2px]"
        />
        <circle
          cx="22"
          cy="10"
          r="8.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          className="origin-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:-translate-x-[2px]"
        />
      </svg>
      <span className="font-display text-[1.05em] leading-none tracking-[-0.02em]">
        Brown Brains
      </span>
    </span>
  );
}
