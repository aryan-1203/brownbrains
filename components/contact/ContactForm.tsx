"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import { budgetOptions, serviceOptions } from "@/content/contact";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { easeOutExpo, springSnappy, springSoft } from "@/lib/motion";
import {
  type ContactResponse,
  contactSchema,
  normalizeContact,
  toFieldErrors,
} from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";
type FieldName =
  "name" | "email" | "company" | "service" | "budget" | "message";

const emptyForm = {
  name: "",
  email: "",
  company: "",
  service: "not-sure",
  budget: "exploring",
  message: "",
  website: "",
};

const requiredFields = [
  "name",
  "email",
  "service",
  "budget",
  "message",
] as const;

const fieldLabels: Record<FieldName, string> = {
  name: "Your name",
  email: "Email",
  company: "Company",
  service: "What you need",
  budget: "Budget",
  message: "The situation",
};

/** Validates the whole form and returns the per-field messages. */
function check(values: typeof emptyForm): Record<string, string> {
  const result = contactSchema.safeParse({
    ...normalizeContact(values),
    startedAt: 1,
  });
  return result.success ? {} : toFieldErrors(result.error);
}

/** Error red tuned to clear 4.5:1 on white. */
const ERROR_TEXT = "text-[#c22f2f]";

/**
 * Which half of the company a service belongs to, for the chip's colour dot.
 * Read defensively so the services content can evolve without breaking this.
 */
function sideOf(id: string): "marketing" | "engineering" | "both" | null {
  const service = services.find((entry) => entry.slug === id) as
    Record<string, unknown> | undefined;
  const side = typeof service?.side === "string" ? service.side : "";
  if (side === "human" || side === "marketing") return "marketing";
  if (side === "machine" || side === "engineering") return "engineering";
  if (side === "both") return "both";
  return null;
}

function SideDot({ id }: { id: string }) {
  const side = sideOf(id);
  if (!side) return null;
  return (
    <span
      aria-hidden
      className={cn(
        "h-2.5 w-2.5 shrink-0 rounded-full",
        side === "marketing" && "bg-saffron",
        side === "engineering" && "bg-cobalt",
        side === "both" &&
          "bg-[linear-gradient(90deg,#ffb224_50%,#2b59ff_50%)]",
      )}
    />
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          id={id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
          transition={{ duration: 0.25, ease: easeOutExpo }}
          className={cn(
            "mt-2 flex items-center gap-2 text-sm font-medium",
            ERROR_TEXT,
          )}
        >
          <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4 shrink-0">
            <circle cx="8" cy="8" r="7" fill="currentColor" />
            <path
              d="M8 4.5v4.2M8 11.2v.3"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-display text-[1rem] font-semibold tracking-[-0.01em] text-ink"
    >
      {children}
      {optional ? (
        <span className="ml-1.5 font-sans text-sm font-normal text-muted">
          (optional)
        </span>
      ) : (
        <span aria-hidden className="ml-1 text-cobalt">
          *
        </span>
      )}
    </label>
  );
}

/** Radio group drawn as chips. A shared layoutId pill springs between choices. */
function ChipGroup({
  legend,
  hint,
  name,
  options,
  value,
  onChange,
  error,
  showSide = false,
}: {
  legend: string;
  hint: string;
  name: string;
  options: readonly { id: string; label: string }[];
  value: string;
  onChange: (next: string) => void;
  error?: string;
  showSide?: boolean;
}) {
  const reduced = useReducedMotion();
  const errorId = `${name}-error`;

  return (
    <fieldset aria-describedby={error ? errorId : `${name}-hint`}>
      <legend className="font-display text-[1rem] font-semibold tracking-[-0.01em] text-ink">
        {legend}
        <span aria-hidden className="ml-1 text-cobalt">
          *
        </span>
      </legend>
      <p id={`${name}-hint`} className="mt-1 text-sm text-muted">
        {hint}
      </p>
      <LayoutGroup id={`chips-${name}`}>
        <div className="mt-4 flex flex-wrap gap-2">
          {options.map((option) => {
            const active = value === option.id;
            return (
              <label
                key={option.id}
                className={cn(
                  "relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-[1.5px] px-4 py-2 text-[0.94rem] font-medium transition-[color,border-color,transform] duration-200 select-none active:scale-[0.97]",
                  "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cobalt has-[:focus-visible]:outline-solid",
                  active
                    ? "border-midnight text-chalk"
                    : "border-rule text-ink hover:border-midnight/60",
                )}
              >
                {active ? (
                  <motion.span
                    aria-hidden
                    layoutId={`chip-pill-${name}`}
                    transition={reduced ? { duration: 0 } : springSnappy}
                    className="absolute inset-0 -z-0 rounded-full bg-midnight"
                  />
                ) : null}
                <input
                  type="radio"
                  name={name}
                  value={option.id}
                  checked={active}
                  onChange={() => onChange(option.id)}
                  className="sr-only"
                />
                <span className="relative z-10 inline-flex items-center gap-2">
                  {showSide ? <SideDot id={option.id} /> : null}
                  {option.label}
                  <AnimatePresence initial={false}>
                    {active ? (
                      <motion.svg
                        aria-hidden
                        viewBox="0 0 16 16"
                        className="h-3.5 w-3.5 text-saffron"
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{
                          opacity: 0,
                          scale: 0.4,
                          transition: { duration: 0.1 },
                        }}
                        transition={springSnappy}
                      >
                        <path
                          d="M3 8.5l3.2 3L13 4.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    ) : null}
                  </AnimatePresence>
                </span>
              </label>
            );
          })}
        </div>
      </LayoutGroup>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

/** Saffron fills from the left, cobalt from the right. At 100% they meet. */
function ReadyMeter({ ready, total }: { ready: number; total: number }) {
  const reduced = useReducedMotion();
  const progress = ready / total;
  const transition = reduced ? { duration: 0 } : springSoft;

  return (
    <div className="flex items-center gap-4">
      <div
        aria-hidden
        className="relative flex h-2 w-28 overflow-hidden rounded-full bg-rule sm:w-36"
      >
        <motion.span
          className="h-full w-1/2 origin-left bg-saffron"
          initial={false}
          animate={{ scaleX: progress }}
          transition={transition}
        />
        <motion.span
          className="h-full w-1/2 origin-right bg-cobalt"
          initial={false}
          animate={{ scaleX: progress }}
          transition={transition}
        />
      </div>
      <span className="text-sm font-semibold text-muted tabular-nums">
        {ready === total ? "Ready to send" : `${ready} of ${total} ready`}
      </span>
    </div>
  );
}

/** Two halves slide together into one disc, then a check draws across the seam. */
function SuccessMark() {
  const reduced = useReducedMotion();
  const halfTransition = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 140, damping: 14, delay: 0.15 };

  return (
    <svg
      aria-hidden
      viewBox="0 0 120 120"
      className="h-28 w-28 overflow-visible md:h-32 md:w-32"
    >
      {!reduced ? (
        <motion.circle
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke="#2b59ff"
          strokeWidth="2"
          initial={{ opacity: 0.5, scale: 0.9 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 1.1, delay: 0.6, ease: easeOutExpo }}
          style={{ transformOrigin: "60px 60px" }}
        />
      ) : null}
      <motion.path
        d="M60 14a46 46 0 0 0 0 92Z"
        fill="#ffb224"
        initial={reduced ? false : { x: -34, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={halfTransition}
      />
      <motion.path
        d="M60 14a46 46 0 0 1 0 92Z"
        fill="#2b59ff"
        initial={reduced ? false : { x: 34, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={halfTransition}
      />
      <motion.path
        d="M38 61l15 14 30-31"
        fill="none"
        stroke="#ffffff"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.75, ease: easeOutExpo }}
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5 animate-[bb-spin_0.9s_linear_infinite]"
    >
      <path d="M12 3a9 9 0 0 0 0 18Z" fill="#ffb224" />
      <path d="M12 3a9 9 0 0 1 0 18Z" fill="#ffffff" />
    </svg>
  );
}

export function ContactForm() {
  const reduced = useReducedMotion();

  // Deep links from the services page arrive as /contact?service=ai-workflows.
  const requestedService = useSearchParams().get("service");
  const preselected = serviceOptions.some(
    (option) => option.id === requestedService,
  )
    ? (requestedService as string)
    : emptyForm.service;

  const [form, setForm] = useState({ ...emptyForm, service: preselected });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string[]>([]);

  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  // Set after mount rather than during render, so the value stays pure and the
  // "filled in too fast to be human" check measures real time on the page.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const readyCount = useMemo(() => {
    const failing = check(form);
    return requiredFields.filter((field) => !failing[field]).length;
  }, [form]);

  const update = (field: keyof typeof emptyForm) => (value: string) => {
    const next = { ...form, [field]: value };
    setForm(next);
    // Once a field is flagged, re-check it live so the error clears the moment it is fixed.
    if (errors[field]) {
      const message = check(next)[field];
      setErrors((previous) => {
        const copy = { ...previous };
        if (message) copy[field] = message;
        else delete copy[field];
        return copy;
      });
    }
  };

  /** Validate on blur, but only once the person has typed something. */
  const blur = (field: FieldName) => () => {
    if (!form[field].trim()) return;
    const message = check(form)[field];
    setErrors((previous) => {
      if (!message && !previous[field]) return previous;
      const copy = { ...previous };
      if (message) copy[field] = message;
      else delete copy[field];
      return copy;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "submitting") return;

    setFormError(null);

    const payload = { ...normalizeContact(form), startedAt: startedAt.current };
    const parsed = contactSchema.safeParse(payload);

    if (!parsed.success) {
      const fieldErrors = toFieldErrors(parsed.error);
      setErrors(fieldErrors);
      setSummary(Object.keys(fieldErrors));
      setStatus("error");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus("submitting");
    setErrors({});
    setSummary([]);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as ContactResponse;

      if (!result.ok) {
        const fieldErrors = result.fieldErrors ?? {};
        setErrors(fieldErrors);
        setSummary(Object.keys(fieldErrors));
        setFormError(result.error);
        setStatus("error");
        if (Object.keys(fieldErrors).length) {
          requestAnimationFrame(() => summaryRef.current?.focus());
        }
        return;
      }

      setStatus("success");
      setForm({ ...emptyForm, service: preselected });
    } catch {
      setStatus("error");
      setFormError(
        "The connection dropped before it reached us. Try again, or email us directly.",
      );
    }
  };

  const describedBy = (field: FieldName, hint?: string) =>
    errors[field] ? `${field}-error` : hint;

  const submitting = status === "submitting";
  const summaryItems = summary.filter(
    (field) => field in fieldLabels && errors[field],
  );

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            role="status"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="flex flex-col items-start py-6 md:py-10"
          >
            <SuccessMark />
            <h2
              ref={successRef}
              tabIndex={-1}
              className="mt-8 text-title outline-none"
            >
              Got it. Talk soon.
            </h2>
            <p className="lead mt-4 max-w-md">
              A real person reads this and replies within one working day.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  startedAt.current = Date.now();
                  setStatus("idle");
                }}
                className="inline-flex min-h-12 items-center rounded-full border-2 border-ink px-6 font-display font-semibold transition-colors duration-200 hover:bg-ink hover:text-bg"
              >
                Send another
              </button>
              <a
                href={`mailto:${site.contact.emails[0]}`}
                className="link-underline inline-flex min-h-12 items-center px-3 font-medium text-cobalt"
              >
                {site.contact.emails[0]}
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            noValidate
            aria-describedby="form-required-note"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="space-y-10"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p id="form-required-note" className="text-sm text-muted">
                Takes about two minutes. Fields with{" "}
                <span className="text-cobalt">*</span> are required.
              </p>
              <ReadyMeter ready={readyCount} total={requiredFields.length} />
            </div>

            <AnimatePresence>
              {summaryItems.length > 0 ? (
                <motion.div
                  ref={summaryRef}
                  tabIndex={-1}
                  role="alert"
                  aria-labelledby="error-summary-title"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                  className="rounded-2xl border-[1.5px] border-[#c22f2f]/40 bg-[#c22f2f]/[0.06] p-5 outline-none focus-visible:outline-3 focus-visible:outline-cobalt"
                >
                  <p
                    id="error-summary-title"
                    className={cn("font-display font-bold", ERROR_TEXT)}
                  >
                    {summaryItems.length === 1
                      ? "One thing needs a second look"
                      : `${summaryItems.length} things need a second look`}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {summaryItems.map((field) => (
                      <li key={field}>
                        <a
                          href={`#${field}`}
                          onClick={(event) => {
                            event.preventDefault();
                            const target =
                              document.getElementById(field) ??
                              document.querySelector<HTMLElement>(
                                `input[name="${field}"]:checked`,
                              );
                            target?.focus();
                          }}
                          className={cn(
                            "text-sm underline underline-offset-2",
                            ERROR_TEXT,
                          )}
                        >
                          {fieldLabels[field as FieldName]}: {errors[field]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* About you */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Your name</Label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={(event) => update("name")(event.target.value)}
                  onBlur={blur("name")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describedBy("name")}
                  className="field min-h-12"
                  placeholder="Priya Sharma"
                />
                <FieldError id="name-error" message={errors.name} />
              </div>

              <div>
                <Label htmlFor="email">Work email</Label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  value={form.email}
                  onChange={(event) => update("email")(event.target.value)}
                  onBlur={blur("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy("email")}
                  className="field min-h-12"
                  placeholder="priya@company.com"
                />
                <FieldError id="email-error" message={errors.email} />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="company" optional>
                  Company
                </Label>
                <input
                  id="company"
                  name="company"
                  autoComplete="organization"
                  value={form.company}
                  onChange={(event) => update("company")(event.target.value)}
                  onBlur={blur("company")}
                  aria-invalid={Boolean(errors.company)}
                  aria-describedby={describedBy("company")}
                  className="field min-h-12"
                  placeholder="Where you work"
                />
                <FieldError id="company-error" message={errors.company} />
              </div>
            </div>

            <ChipGroup
              legend="What do you need?"
              hint="Pick the closest. Saffron is marketing, cobalt is engineering."
              name="service"
              options={serviceOptions}
              value={form.service}
              onChange={update("service")}
              error={errors.service}
              showSide
            />

            <ChipGroup
              legend="Rough budget"
              hint="A range is enough. It helps us suggest the right first step."
              name="budget"
              options={budgetOptions}
              value={form.budget}
              onChange={update("budget")}
              error={errors.budget}
            />

            <div>
              <div className="flex items-baseline justify-between gap-4">
                <Label htmlFor="message">The situation</Label>
                <span
                  aria-hidden
                  className={cn(
                    "text-sm tabular-nums",
                    form.message.length > 2000 ? ERROR_TEXT : "text-muted",
                  )}
                >
                  {form.message.length}/2000
                </span>
              </div>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                autoComplete="off"
                value={form.message}
                onChange={(event) => update("message")(event.target.value)}
                onBlur={blur("message")}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={describedBy("message", "message-hint")}
                className="field"
                placeholder="What are you building or fixing, and when does it need to be live?"
              />
              <p
                id="message-hint"
                className={cn(
                  "mt-2 text-sm text-muted",
                  errors.message && "sr-only",
                )}
              >
                Two or three sentences is plenty.
              </p>
              <FieldError id="message-error" message={errors.message} />
            </div>

            {/* Honeypot: hidden from people and assistive tech, irresistible to bots. */}
            <div
              aria-hidden
              className="absolute h-0 w-0 overflow-hidden opacity-0"
            >
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(event) => update("website")(event.target.value)}
              />
            </div>

            <div className="space-y-4 border-t border-rule pt-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={submitting}
                  aria-disabled={submitting}
                  className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-cobalt px-8 font-display text-[1.05rem] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-cobalt-deep active:scale-[0.97] disabled:cursor-progress disabled:opacity-80 sm:w-auto"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {submitting ? (
                      <motion.span
                        key="sending"
                        className="inline-flex items-center gap-3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                      >
                        <Spinner />
                        Sending
                      </motion.span>
                    ) : (
                      <motion.span
                        key="send"
                        className="inline-flex items-center gap-3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                      >
                        Send message
                        <svg
                          aria-hidden
                          viewBox="0 0 20 20"
                          className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                        >
                          <path
                            d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <p className="max-w-xs text-sm text-muted">
                  Read by a person. No mailing lists, ever.
                </p>
              </div>

              <div aria-live="polite">
                <AnimatePresence>
                  {formError ? (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: -6,
                        transition: { duration: 0.15 },
                      }}
                      className="rounded-2xl border-[1.5px] border-[#c22f2f]/40 bg-[#c22f2f]/[0.06] px-5 py-4 text-sm"
                    >
                      <p className={cn("font-semibold", ERROR_TEXT)}>
                        {formError}
                      </p>
                      <p className="mt-1 text-muted">
                        You can also write to{" "}
                        <a
                          href={`mailto:${site.contact.emails[0]}`}
                          className="font-medium text-cobalt underline underline-offset-2"
                        >
                          {site.contact.emails[0]}
                        </a>
                        .
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
