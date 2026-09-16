"use client";

import { useActionState } from "react";
import { submitContact, type FormState } from "@/actions/inquiry";
import { Field, FormGuards, FormMessage, SubmitButton } from "./form-bits";

const initial: FormState = { status: "idle" };

export function ContactForm() {
  const [state, action] = useActionState(submitContact, initial);
  const e = state.errors ?? {};
  const v = (state.values ?? {}) as Record<string, string>;
  if (state.status === "success") {
    return (
      <div role="status" className="rounded-sm border border-line bg-raised p-8">
        <p className="font-display text-3xl">Message sent.</p>
        <p className="mt-3 text-ink-soft">{state.message}</p>
      </div>
    );
  }
  return (
    <form action={action} noValidate className="relative space-y-5">
      <FormGuards />
      <FormMessage status={state.status} message={state.message} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required autoComplete="name" defaultValue={v.name} error={e.name} />
        <Field label="Email" name="email" type="email" required autoComplete="email" defaultValue={v.email} error={e.email} />
      </div>
      <Field label="Subject" name="subject" defaultValue={v.subject} error={e.subject} />
      <Field label="Message" name="message" textarea required defaultValue={v.message} error={e.message} />
      <SubmitButton pendingText="Sending…">Send message</SubmitButton>
    </form>
  );
}
