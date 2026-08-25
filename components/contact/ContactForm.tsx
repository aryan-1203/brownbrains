"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { budgetOptions, serviceOptions } from "@/content/contact";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { easeOutExpo } from "@/lib/motion";
import {
  type ContactResponse,
  contactSchema,
  normalizeContact,
  toFieldErrors,
} from "@/lib/validation";
import { MagneticButton } from "@/components/fx/MagneticButton";

type Status = "idle" | "submitting" | "success" | "error";

const emptyForm = {
  name: "",
  email: "",
  company: "",
  service: "not-sure",
  budget: "exploring",
  message: "",
  website: "",
};

const requiredFields = ["name", "email", "service", "budget", "message"] as const;

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22 }}
          className="mt-2 font-mono text-[0.68rem] tracking-[0.04em] text-ember"
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

function ChipGroup({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly { id: string; label: string }[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mono-label">{legend}</legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option.id;
          return (
            <label
              key={option.id}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-sm transition-all duration-300",
                active
                  ? "border-ember bg-ember text-[#fbf8f3]"
                  : "border-rule text-muted hover:border-ink hover:text-ink",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={active}
                onChange={() => onChange(option.id)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ContactForm() {
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

  // Set after mount rather than during render, so the value stays pure and the
  // "filled in too fast to be human" check measures real time on the page.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Live readout of how many required fields would currently pass validation.
  const readyCount = useMemo(() => {
    const result = contactSchema.safeParse({
      ...normalizeContact(form),
      startedAt: 1,
    });
    if (result.success) return requiredFields.length;
    const failing = new Set(
      result.error.issues.map((issue) => String(issue.path[0])),
    );
    return requiredFields.filter((field) => !failing.has(field)).length;
  }, [form]);

  const update = (field: keyof typeof emptyForm) => (value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
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
      setStatus("error");
      setFormError("Some details need a second look.");
      const first = document.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }

    setStatus("submitting");
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as ContactResponse;

      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        setFormError(result.error);
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm(emptyForm);
    } catch {
      setStatus("error");
      setFormError(
        "The network dropped that one. Try again, or email us directly.",
      );
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: easeOutExpo }}
        className="rounded-2xl border border-rule bg-surface p-8 md:p-12"
        role="status"
      >
        <p className="mono-label text-ember">Message received</p>
        <h2 className="mt-5 font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-[0.98]">
          It landed in the right inbox.
        </h2>
        <p className="lead mt-5 max-w-md">
          Both of us read every enquiry, and you will normally hear back within one
          working day. If it is urgent, call or message us directly.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-rule pt-6">
          {site.contact.emails.map((email) => (
            <a
              key={email}
              href={`mailto:${email}`}
              className="link-underline font-mono text-[0.7rem] tracking-[0.12em] text-muted uppercase hover:text-ink"
            >
              {email}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              startedAt.current = Date.now();
              setStatus("idle");
            }}
            className="link-underline font-mono text-[0.7rem] tracking-[0.12em] text-muted uppercase hover:text-ink"
          >
            Send another
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-12">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mono-label">
            Your name *
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => update("name")(event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="field"
            placeholder="Priya Sharma"
          />
          <FieldError id="name-error" message={errors.name} />
        </div>

        <div>
          <label htmlFor="email" className="mono-label">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => update("email")(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="field"
            placeholder="priya@company.com"
          />
          <FieldError id="email-error" message={errors.email} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="company" className="mono-label">
            Company <span className="text-faint">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            value={form.company}
            onChange={(event) => update("company")(event.target.value)}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? "company-error" : undefined}
            className="field"
            placeholder="Where you work"
          />
          <FieldError id="company-error" message={errors.company} />
        </div>
      </div>

      <ChipGroup
        legend="What do you need *"
        name="service"
        options={serviceOptions}
        value={form.service}
        onChange={update("service")}
      />

      <ChipGroup
        legend="Rough budget *"
        name="budget"
        options={budgetOptions}
        value={form.budget}
        onChange={update("budget")}
      />

      <div>
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor="message" className="mono-label">
            The situation *
          </label>
          <span
            className={cn(
              "font-mono text-[0.66rem] tabular-nums",
              form.message.length > 2000 ? "text-ember" : "text-faint",
            )}
          >
            {form.message.length}/2000
          </span>
        </div>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={(event) => update("message")(event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : "message-hint"}
          className="field"
          placeholder="What are you trying to build or fix, what has already been tried, and when does it need to be live?"
        />
        <p id="message-hint" className="mt-2 text-xs text-faint">
          The more context you give, the more useful our first reply will be.
        </p>
        <FieldError id="message-error" message={errors.message} />
      </div>

      {/* Honeypot — visually and programmatically hidden from real visitors */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
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

      <div className="flex flex-col gap-5 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <MagneticButton
            type="submit"
            disabled={status === "submitting"}
            cursorLabel={status === "submitting" ? "sending" : "send"}
          >
            {status === "submitting" ? "Sending…" : "Send it over"}
          </MagneticButton>
          <span className="font-mono text-[0.66rem] tracking-[0.1em] text-faint uppercase tabular-nums">
            {readyCount}/{requiredFields.length} ready
          </span>
        </div>

        <p className="max-w-xs text-xs leading-relaxed text-faint">
          We reply from a real inbox and never add you to a mailing list.
        </p>
      </div>

      <AnimatePresence>
        {formError ? (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-lg border border-ember/50 bg-ember/8 px-4 py-3 text-sm text-ember"
          >
            {formError}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </form>
  );
}
