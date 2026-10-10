import { cn } from "@/lib/cn";

/**
 * Two half-discs — saffron for marketing, cobalt for engineering — that close
 * into one circle on hover. The whole idea of the company in one mark.
 */
export function Logo({
  className,
  wordmark = true,
}: {
  className?: string;
  wordmark?: boolean;
}) {
  return (
    <span className={cn("group/logo inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 28 24" aria-hidden className="h-[1.3em] w-auto overflow-visible">
        <path
          d="M12 2a10 10 0 0 0 0 20Z"
          fill="#ffb224"
          className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:translate-x-[2px]"
        />
        <path
          d="M16 2a10 10 0 0 1 0 20Z"
          fill="#2b59ff"
          className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:-translate-x-[2px]"
        />
      </svg>
      {wordmark ? (
        <span className="font-display text-[1.05em] leading-none font-bold tracking-[-0.03em]">
          Brown Brains
        </span>
      ) : null}
    </span>
  );
}
