"use client";

import { useState, type FormEvent } from "react";
import type { FounderEvent } from "@/lib/events/taxonomy";
import {
  EVENT_TYPE_LABELS,
  REGISTRATION_WORKFLOW_LABELS,
} from "@/lib/events/taxonomy";

export type Prefill = {
  eventId: string;
  eventName: string;
  eventType: string;
  city: string;
  registrationWorkflow: string;
  slug: string;
  cta: string;
};

export function GatheringInterestForm({ prefill }: { prefill: Prefill }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/events/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: prefill.eventId,
          eventName: prefill.eventName,
          eventType: prefill.eventType,
          city: prefill.city,
          registrationWorkflow: prefill.registrationWorkflow,
          eventSlug: prefill.slug,
          fullName: data.get("fullName"),
          email: data.get("email"),
          whatsapp: data.get("whatsapp"),
          location: data.get("location"),
          company: data.get("company"),
          isFounder: data.get("isFounder"),
          note: data.get("note"),
          consent: data.get("consent") === "yes",
        }),
      });
      const json = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setStatus("error");
        setMessage(json.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage("Thank you. We have received your interest.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Unable to submit right now. Please email hello@founderbeing.org.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-white/10 p-8" role="status">
        <h2 className="font-serif text-2xl text-fb-text">Interest received</h2>
        <p className="mt-4 text-fb-body">{message}</p>
        <p className="mt-3 text-sm text-fb-secondary">
          Event: {prefill.eventName} · {prefill.city}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="rounded-sm border border-white/10 bg-[#131313] p-5 text-sm">
        <p className="font-mono text-xs uppercase tracking-wider text-[#FFAB33]">
          {prefill.eventType}
        </p>
        <p className="mt-2 font-serif text-xl text-fb-text">{prefill.eventName}</p>
        <p className="mt-1 text-fb-secondary">{prefill.city}</p>
        <p className="mt-3 font-mono text-xs text-fb-meta">
          Workflow: {prefill.registrationWorkflow}
        </p>
        {/* Hidden CMS fields */}
        <input type="hidden" name="event_id" value={prefill.eventId} />
        <input type="hidden" name="event_name" value={prefill.eventName} />
        <input type="hidden" name="event_type" value={prefill.eventType} />
        <input type="hidden" name="city" value={prefill.city} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="font-mono text-xs uppercase tracking-wider text-fb-meta">
            Full name *
          </span>
          <input className="field mt-2" name="fullName" required autoComplete="name" />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-fb-meta">
            Email *
          </span>
          <input
            className="field mt-2"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-fb-meta">
            WhatsApp
          </span>
          <input className="field mt-2" name="whatsapp" type="tel" autoComplete="tel" />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-fb-meta">
            Location
          </span>
          <input
            className="field mt-2"
            name="location"
            defaultValue={prefill.city !== "Multiple" && prefill.city !== "To be announced" ? prefill.city : ""}
            autoComplete="address-level2"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-fb-meta">
            Company
          </span>
          <input className="field mt-2" name="company" autoComplete="organization" />
        </label>
        <label className="block sm:col-span-2">
          <span className="font-mono text-xs uppercase tracking-wider text-fb-meta">
            Founder?
          </span>
          <select className="field mt-2" name="isFounder" defaultValue="">
            <option value="" disabled>
              Select…
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="exploring">Exploring</option>
            <option value="investor">Investor / ecosystem</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="font-mono text-xs uppercase tracking-wider text-fb-meta">
            Note (optional)
          </span>
          <textarea
            className="field mt-2 min-h-[100px] resize-y"
            name="note"
            maxLength={800}
            placeholder="Anything we should know…"
          />
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm text-fb-body">
        <input
          type="checkbox"
          name="consent"
          value="yes"
          className="mt-1 accent-[#FFAB33]"
        />
        <span>
          I would like to receive updates about this gathering and related
          Founder-Being programmes.
        </span>
      </label>

      {message && status === "error" && (
        <p className="text-sm text-red-300" role="alert">
          {message}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Submitting…" : prefill.cta}
      </button>
    </form>
  );
}

export function prefillFromEvent(event: FounderEvent): Prefill {
  return {
    eventId: event.id,
    eventName: event.title,
    eventType: EVENT_TYPE_LABELS[event.eventType],
    city: event.location.city,
    registrationWorkflow:
      REGISTRATION_WORKFLOW_LABELS[event.registrationWorkflow],
    slug: event.slug,
    cta: event.cta,
  };
}

/** @deprecated use prefillFromEvent */
export const prefillFromGathering = prefillFromEvent;
