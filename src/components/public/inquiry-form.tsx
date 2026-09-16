"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitTripInquiry, type FormState } from "@/actions/inquiry";
import { ChipGroup, Field, FormGuards, FormMessage, SubmitButton } from "./form-bits";

interface Props {
  destinations: string[];
  experiences: string[];
  interests: string[];
  preselect?: { destinations?: string[]; experiences?: string[] };
}

const initial: FormState = { status: "idle" };

export function InquiryForm({ destinations, experiences, interests, preselect }: Props) {
  const [state, action] = useActionState(submitTripInquiry, initial);
  const topRef = useRef<HTMLDivElement>(null);
  const e = state.errors ?? {};
  const v = state.values ?? {};
  const str = (k: string) => (typeof v[k] === "string" ? (v[k] as string) : undefined);
  const arr = (k: string, fallback: string[] = []) => (Array.isArray(v[k]) ? (v[k] as string[]) : fallback);

  // Prefill from links such as /plan-your-trip?tour=Kakheti%20Wine%20Journey
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const about = p.get("tour") || p.get("service") || p.get("destination");
    const el = document.getElementById("f-message") as HTMLTextAreaElement | null;
    if (!about || !el || el.value) return;
    // Links pass slugs (e.g. kakheti-wine-region-tour); show them as readable names.
    const label = /^[a-z0-9-]+$/.test(about)
      ? about.split("-").map((w) => (w.length > 2 || /^\d/.test(w) ? w[0].toUpperCase() + w.slice(1) : w)).join(" ")
      : about;
    el.value = `I'm interested in: ${label.slice(0, 120)}\n\n`;
  }, []);

  useEffect(() => {
    if (state.status !== "idle") topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (state.status === "error") {
      const first = Object.keys(state.errors ?? {})[0];
      if (first) document.getElementById(`f-${first}`)?.focus({ preventScroll: true });
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={topRef} role="status" className="rounded-sm border border-line bg-raised p-8 sm:p-12">
        <p className="font-display text-4xl">Your request is with us.</p>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">{state.message}</p>
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-28">
      <form action={action} noValidate className="relative space-y-10">
        <FormGuards />
        <FormMessage status={state.status} message={state.message} />

        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="mb-5 font-display text-3xl">About you</legend>
          <Field label="Full name" name="name" required autoComplete="name" defaultValue={str("name")} error={e.name} />
          <Field label="Email" name="email" type="email" required autoComplete="email" defaultValue={str("email")} error={e.email} />
          <Field label="Phone or WhatsApp" name="phone" type="tel" autoComplete="tel" defaultValue={str("phone")} error={e.phone} />
          <Field label="Country of residence" name="country" required autoComplete="country-name" defaultValue={str("country")} error={e.country} />
        </fieldset>

        <fieldset className="grid gap-5 sm:grid-cols-3">
          <legend className="mb-5 font-display text-3xl">Your trip</legend>
          <Field label="Arrival date" name="arrivalDate" type="date" defaultValue={str("arrivalDate")} error={e.arrivalDate} />
          <Field label="Departure date" name="departureDate" type="date" defaultValue={str("departureDate")} error={e.departureDate} />
          <Field label="Travelers" name="travelers" type="number" min={1} max={200} inputMode="numeric" required defaultValue={str("travelers") ?? "2"} error={e.travelers} />
        </fieldset>

        <div className="space-y-8">
          <ChipGroup legend="What draws you to Georgia?" name="interests" options={interests} defaultValues={arr("interests")} hint="Choose as many as you like." />
          <ChipGroup legend="Places you'd like to see" name="destinations" options={destinations} defaultValues={arr("destinations", preselect?.destinations)} />
          <ChipGroup legend="Experiences" name="experiences" options={experiences} defaultValues={arr("experiences", preselect?.experiences)} />
        </div>

        <fieldset>
          <legend className="field-label">Help with logistics</legend>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:gap-8">
            {[
              ["accommodationNeeded", "Please arrange accommodation"],
              ["airportTransferNeeded", "I need an airport transfer"],
            ].map(([name, label]) => (
              <label key={name} className="flex min-h-11 cursor-pointer items-center gap-3">
                <input type="checkbox" name={name} defaultChecked={v[name] === true} className="size-5 accent-[var(--wine)]" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          label="Tell us about your trip"
          name="message"
          textarea
          rows={6}
          required
          placeholder="Travel style, pace, budget range, special occasions, dietary needs…"
          defaultValue={str("message")}
          error={e.message}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm text-ink-soft">
            We use your details only to reply to this request. See our <a className="underline" href="/privacy-policy">privacy policy</a>.
          </p>
          <SubmitButton pendingText="Sending…">Send trip request</SubmitButton>
        </div>
      </form>
    </div>
  );
}
