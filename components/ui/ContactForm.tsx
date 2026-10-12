"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/data/portfolio";
import { ArrowUpRight } from "./Icons";
import { PillButton } from "./PillButton";

type Field = "name" | "email" | "message";
type Status = { kind: "idle" | "sending" } | { kind: "done" | "error"; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Record<Field, string>) {
  const errors: Partial<Record<Field, string>> = {};
  if (!values.name.trim()) errors.name = "Please add your name.";
  if (!EMAIL.test(values.email.trim())) errors.email = "Please add a valid email address.";
  if (values.message.trim().length < 10) errors.message = "A few more words, please — at least 10 characters.";
  return errors;
}

/**
 * Posts to `contact.formEndpoint` when one is set; otherwise opens the
 * visitor's email app with the message already written.
 */
export function ContactForm() {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const { email, formEndpoint } = site.contact;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    const found = validate(values);
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    if (!formEndpoint) {
      const subject = encodeURIComponent(`Project enquiry from ${values.name}`);
      const body = encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      setStatus({ kind: "done", message: "Your email app should open with the message ready to send." });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus({ kind: "done", message: "Thanks — your message is on its way. I'll reply soon." });
    } catch {
      setStatus({ kind: "error", message: `That didn't send. You can email me directly at ${email}.` });
    }
  }

  const field = (name: Field) => ({
    id: `contact-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    onInput: () => errors[name] && setErrors((prev) => ({ ...prev, [name]: undefined })),
  });

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="contact-name" className="field__label type-eyebrow">
            Name
          </label>
          <input {...field("name")} type="text" autoComplete="name" placeholder="Your name" className="field__control" />
          {errors.name && (
            <p id="contact-name-error" className="field__error">
              {errors.name}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="contact-email" className="field__label type-eyebrow">
            Email
          </label>
          <input
            {...field("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
            className="field__control"
          />
          {errors.email && (
            <p id="contact-email-error" className="field__error">
              {errors.email}
            </p>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="contact-message" className="field__label type-eyebrow">
          Message
        </label>
        <textarea {...field("message")} placeholder="Tell me about your project, timeline and goals." className="field__control" />
        {errors.message && (
          <p id="contact-message-error" className="field__error">
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PillButton
          type="submit"
          variant="solid"
          size="lg"
          loading={status.kind === "sending"}
          disabled={status.kind === "sending"}
          icon={<ArrowUpRight />}
        >
          Send message
        </PillButton>
        <p role="status" aria-live="polite" className={status.kind === "error" ? "text-sm text-[var(--danger)]" : "text-sm text-ink-muted"}>
          {"message" in status ? status.message : ""}
        </p>
      </div>
    </form>
  );
}
