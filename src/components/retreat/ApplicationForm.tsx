"use client";

import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import {
  dietaryOptions,
  kodaikanalRetreat,
  startupStages,
} from "@/lib/retreats/kodaikanal-2026";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  cityCountry: string;
  companyName: string;
  currentRole: string;
  linkedinUrl: string;
  companyUrl: string;
  startupStage: string;
  motivation: string;
  desiredOutcome: string;
  founderContext: string;
  attendedBefore: string;
  referralSource: string;
  kochiTransport: string;
  twinSharing: string;
  dietaryBasic: string;
  accessibilityBasic: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingConsent: boolean;
  website: string;
};

const initial: FormState = {
  fullName: "",
  email: "",
  phone: "",
  cityCountry: "",
  companyName: "",
  currentRole: "",
  linkedinUrl: "",
  companyUrl: "",
  startupStage: "",
  motivation: "",
  desiredOutcome: "",
  founderContext: "",
  attendedBefore: "",
  referralSource: "",
  kochiTransport: "",
  twinSharing: "",
  dietaryBasic: "",
  accessibilityBasic: "",
  termsAccepted: false,
  privacyAccepted: false,
  marketingConsent: false,
  website: "",
};

const STEPS = ["Founder profile", "Intent and fit", "Logistics and consent"] as const;

function CharCount({ value, min, max }: { value: string; min?: number; max: number }) {
  const len = value.length;
  const ok = (!min || len >= min) && len <= max;
  return (
    <p className={`mt-1 text-xs font-mono ${ok ? "text-white/40" : "text-[#FFAB33]"}`}>
      {len}/{max}
      {min ? ` · min ${min}` : ""}
    </p>
  );
}

export function ApplicationForm() {
  const formId = useId();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const utm = useMemo(() => {
    if (typeof window === "undefined") return {};
    const p = new URLSearchParams(window.location.search);
    return {
      utmSource: p.get("utm_source") ?? undefined,
      utmMedium: p.get("utm_medium") ?? undefined,
      utmCampaign: p.get("utm_campaign") ?? undefined,
      referrer: document.referrer || undefined,
    };
  }, []);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("fbk-apply-draft");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FormState>;
        setForm((f) => ({ ...f, ...parsed, website: "" }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (successCode) return;
    const { website: _w, ...safe } = form;
    try {
      sessionStorage.setItem("fbk-apply-draft", JSON.stringify(safe));
    } catch {
      /* ignore */
    }
  }, [form, successCode]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  function validateStep(s: number): boolean {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (form.fullName.trim().length < 2) e.fullName = "Enter your full name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
        e.email = "Enter a valid email.";
      if (form.phone.trim().length < 8) e.phone = "Enter WhatsApp / mobile.";
      if (form.cityCountry.trim().length < 2) e.cityCountry = "Required.";
      if (!form.companyName.trim()) e.companyName = "Required.";
      if (!form.currentRole.trim()) e.currentRole = "Required.";
      if (!form.startupStage) e.startupStage = "Select a stage.";
      if (!form.linkedinUrl.trim() && !form.companyUrl.trim()) {
        e.linkedinUrl = "Provide LinkedIn or company website.";
      }
    }
    if (s === 1) {
      if (form.motivation.trim().length < 150)
        e.motivation = "Please write at least 150 characters.";
      if (form.desiredOutcome.trim().length < 100)
        e.desiredOutcome = "Please write at least 100 characters.";
      if (!form.attendedBefore) e.attendedBefore = "Please choose yes or no.";
    }
    if (s === 2) {
      if (!form.kochiTransport) e.kochiTransport = "Required.";
      if (!form.twinSharing) e.twinSharing = "Required.";
      if (form.twinSharing === "no")
        e.twinSharing = "Twin-sharing is required for this cohort.";
      if (!form.termsAccepted) e.termsAccepted = "Required.";
      if (!form.privacyAccepted) e.privacyAccepted = "Required.";
    }
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      document.getElementById(`${formId}-${first}`)?.focus();
      return false;
    }
    return true;
  }

  function next() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 2));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateStep(2)) return;
    setSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("/api/retreats/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          termsAccepted: form.termsAccepted,
          privacyAccepted: form.privacyAccepted,
          marketingConsent: form.marketingConsent,
          retreatSlug: kodaikanalRetreat.slug,
          idempotencyKey,
          ...utm,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        applicationCode?: string;
        fieldErrors?: Record<string, string[]>;
      };

      if (!res.ok) {
        setServerError(data.error || "We couldn't submit your application.");
        if (data.fieldErrors) {
          const mapped: Record<string, string> = {};
          for (const [k, v] of Object.entries(data.fieldErrors)) {
            if (v?.[0]) mapped[k] = v[0];
          }
          setErrors(mapped);
        }
        return;
      }

      setSuccessCode(data.applicationCode ?? "received");
      try {
        sessionStorage.removeItem("fbk-apply-draft");
      } catch {
        /* ignore */
      }
    } catch {
      setServerError(
        "We couldn't submit your application. Your answers are still here. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (successCode) {
    return (
      <div
        className="border border-white/10 bg-[#0B0B0B] p-8 md:p-12"
        role="status"
        aria-live="polite"
      >
        <p className="section-label">Application</p>
        <h3 className="editorial-h text-3xl text-[#F8F8F8] md:text-4xl">
          Application received.
        </h3>
        <p className="mt-6 text-base leading-relaxed text-[#F8F8F8]/70">
          Thank you for applying to the Founder-Being Kodaikanal Full Moon
          Retreat. Every application is reviewed personally. If selected in the
          first round, we will contact you by phone or WhatsApp by{" "}
          {kodaikanalRetreat.contactDeadlineLabel}. Applying does not reserve a
          seat and no payment is required on this website.
        </p>
        <p className="mt-8 font-mono text-sm tracking-wide text-[#FFAB33]">
          Reference: {successCode}
        </p>
        <p className="mt-4 text-sm text-[#F8F8F8]/55">
          Corrections? Email{" "}
          <a
            className="text-[#F8F8F8] underline-offset-4 hover:underline"
            href={`mailto:${kodaikanalRetreat.supportEmail}`}
          >
            {kodaikanalRetreat.supportEmail}
          </a>
        </p>
        <a
          className="btn btn-secondary mt-10 inline-flex"
          href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(kodaikanalRetreat.title + " (tentative)")}&dates=20260826/20260901&details=${encodeURIComponent("Tentative — seat confirmed only after selection and payment.")}&location=${encodeURIComponent(kodaikanalRetreat.locationPublic)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Add dates to calendar (tentative)
        </a>
      </div>
    );
  }

  const fieldClass = "field";
  const labelClass = "mb-2 block text-xs font-mono tracking-[0.12em] uppercase text-[#F8F8F8]/45";

  return (
    <form onSubmit={onSubmit} noValidate className="border border-white/10 p-6 md:p-10">
      <div className="mb-10">
        <p className="section-label">Application</p>
        <h3 className="editorial-h text-3xl text-[#F8F8F8]">Apply to Attend</h3>
        <p className="mt-3 text-sm text-[#F8F8F8]/55">
          Three short steps. No account. No payment on this website.
        </p>
        <ol className="mt-8 flex flex-wrap gap-3" aria-label="Progress">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={`font-mono text-xs tracking-[0.1em] uppercase ${
                i === step ? "text-[#FFAB33]" : i < step ? "text-[#F8F8F8]/70" : "text-white/30"
              }`}
            >
              {String(i + 1).padStart(2, "0")} {label}
            </li>
          ))}
        </ol>
      </div>

      {serverError && (
        <div
          role="alert"
          tabIndex={-1}
          className="mb-8 border border-red-400/40 bg-red-950/30 px-4 py-3 text-sm text-red-100"
        >
          {serverError}
        </div>
      )}

      {step === 0 && (
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className={labelClass}>Full name *</span>
            <input
              id={`${formId}-fullName`}
              className={fieldClass}
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              autoComplete="name"
              required
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-300">{errors.fullName}</p>}
          </label>
          <label>
            <span className={labelClass}>Email *</span>
            <input
              id={`${formId}-email`}
              className={fieldClass}
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              autoComplete="email"
              required
            />
            {errors.email && <p className="mt-1 text-xs text-red-300">{errors.email}</p>}
          </label>
          <label>
            <span className={labelClass}>WhatsApp / mobile *</span>
            <input
              id={`${formId}-phone`}
              className={fieldClass}
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              autoComplete="tel"
              required
            />
            {errors.phone && <p className="mt-1 text-xs text-red-300">{errors.phone}</p>}
          </label>
          <label>
            <span className={labelClass}>City / country *</span>
            <input
              id={`${formId}-cityCountry`}
              className={fieldClass}
              value={form.cityCountry}
              onChange={(e) => set("cityCountry", e.target.value)}
              required
            />
            {errors.cityCountry && (
              <p className="mt-1 text-xs text-red-300">{errors.cityCountry}</p>
            )}
          </label>
          <label>
            <span className={labelClass}>Startup / company *</span>
            <input
              id={`${formId}-companyName`}
              className={fieldClass}
              value={form.companyName}
              onChange={(e) => set("companyName", e.target.value)}
              required
            />
            {errors.companyName && (
              <p className="mt-1 text-xs text-red-300">{errors.companyName}</p>
            )}
          </label>
          <label>
            <span className={labelClass}>Current role *</span>
            <input
              id={`${formId}-currentRole`}
              className={fieldClass}
              value={form.currentRole}
              onChange={(e) => set("currentRole", e.target.value)}
              required
            />
            {errors.currentRole && (
              <p className="mt-1 text-xs text-red-300">{errors.currentRole}</p>
            )}
          </label>
          <label>
            <span className={labelClass}>Startup stage *</span>
            <select
              id={`${formId}-startupStage`}
              className={fieldClass}
              value={form.startupStage}
              onChange={(e) => set("startupStage", e.target.value)}
              required
            >
              <option value="">Select…</option>
              {startupStages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.startupStage && (
              <p className="mt-1 text-xs text-red-300">{errors.startupStage}</p>
            )}
          </label>
          <label>
            <span className={labelClass}>LinkedIn URL</span>
            <input
              id={`${formId}-linkedinUrl`}
              className={fieldClass}
              type="url"
              placeholder="https://"
              value={form.linkedinUrl}
              onChange={(e) => set("linkedinUrl", e.target.value)}
            />
            {errors.linkedinUrl && (
              <p className="mt-1 text-xs text-red-300">{errors.linkedinUrl}</p>
            )}
          </label>
          <label>
            <span className={labelClass}>Company website</span>
            <input
              id={`${formId}-companyUrl`}
              className={fieldClass}
              type="url"
              placeholder="https://"
              value={form.companyUrl}
              onChange={(e) => set("companyUrl", e.target.value)}
            />
          </label>
          <p className="sm:col-span-2 text-xs text-[#F8F8F8]/4">
            LinkedIn or company website is required.
          </p>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <label className="block">
            <span className={labelClass}>Why would you like to join this retreat? *</span>
            <textarea
              id={`${formId}-motivation`}
              className={`${fieldClass} min-h-[140px] resize-y`}
              value={form.motivation}
              onChange={(e) => set("motivation", e.target.value)}
              maxLength={1500}
              required
            />
            <CharCount value={form.motivation} min={150} max={1500} />
            {errors.motivation && (
              <p className="mt-1 text-xs text-red-300">{errors.motivation}</p>
            )}
          </label>
          <label className="block">
            <span className={labelClass}>What would make this retreat valuable for you? *</span>
            <textarea
              id={`${formId}-desiredOutcome`}
              className={`${fieldClass} min-h-[120px] resize-y`}
              value={form.desiredOutcome}
              onChange={(e) => set("desiredOutcome", e.target.value)}
              maxLength={1000}
              required
            />
            <CharCount value={form.desiredOutcome} min={100} max={1000} />
            {errors.desiredOutcome && (
              <p className="mt-1 text-xs text-red-300">{errors.desiredOutcome}</p>
            )}
          </label>
          <label className="block">
            <span className={labelClass}>What are you currently carrying as a founder?</span>
            <textarea
              id={`${formId}-founderContext`}
              className={`${fieldClass} min-h-[100px] resize-y`}
              value={form.founderContext}
              onChange={(e) => set("founderContext", e.target.value)}
              maxLength={1000}
            />
            <CharCount value={form.founderContext} max={1000} />
          </label>
          <fieldset>
            <legend className={labelClass}>
              Have you attended a Founder-Being event before? *
            </legend>
            <div className="mt-2 flex gap-6 text-sm text-[#F8F8F8]/8">
              {(["yes", "no"] as const).map((v) => (
                <label key={v} className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="attendedBefore"
                    checked={form.attendedBefore === v}
                    onChange={() => set("attendedBefore", v)}
                  />
                  {v === "yes" ? "Yes" : "No"}
                </label>
              ))}
            </div>
            {errors.attendedBefore && (
              <p className="mt-1 text-xs text-red-300">{errors.attendedBefore}</p>
            )}
          </fieldset>
          <label className="block">
            <span className={labelClass}>How did you hear about this retreat?</span>
            <input
              className={fieldClass}
              value={form.referralSource}
              onChange={(e) => set("referralSource", e.target.value)}
              maxLength={200}
            />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <fieldset>
            <legend className={labelClass}>Will you join group travel from Kochi? *</legend>
            <div className="mt-2 flex flex-wrap gap-6 text-sm">
              {(
                [
                  ["yes", "Yes"],
                  ["no", "No"],
                  ["unsure", "Not sure"],
                ] as const
              ).map(([v, label]) => (
                <label key={v} className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="kochiTransport"
                    checked={form.kochiTransport === v}
                    onChange={() => set("kochiTransport", v)}
                  />
                  {label}
                </label>
              ))}
            </div>
            {errors.kochiTransport && (
              <p className="mt-1 text-xs text-red-300">{errors.kochiTransport}</p>
            )}
          </fieldset>
          <fieldset>
            <legend className={labelClass}>Are you comfortable with twin-sharing? *</legend>
            <div className="mt-2 flex gap-6 text-sm">
              {(["yes", "no"] as const).map((v) => (
                <label key={v} className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="twinSharing"
                    checked={form.twinSharing === v}
                    onChange={() => set("twinSharing", v)}
                  />
                  {v === "yes" ? "Yes" : "No"}
                </label>
              ))}
            </div>
            {errors.twinSharing && (
              <p className="mt-1 text-xs text-red-300">{errors.twinSharing}</p>
            )}
          </fieldset>
          <label className="block">
            <span className={labelClass}>Dietary preference</span>
            <select
              className={fieldClass}
              value={form.dietaryBasic}
              onChange={(e) => set("dietaryBasic", e.target.value)}
            >
              <option value="">Optional…</option>
              {dietaryOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Accessibility support (optional)</span>
            <textarea
              className={`${fieldClass} min-h-[80px] resize-y`}
              value={form.accessibilityBasic}
              onChange={(e) => set("accessibilityBasic", e.target.value)}
              maxLength={500}
            />
          </label>

          <div className="space-y-4 border-t border-white/10 pt-6 text-sm text-[#F8F8F8]/7">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 accent-[#FFAB33]"
                checked={form.termsAccepted}
                onChange={(e) => set("termsAccepted", e.target.checked)}
              />
              <span>
                I understand this is an application and does not guarantee
                selection. My seat is confirmed only after payment. I have read
                the tentative cancellation and postponement policy and agree to
                participate respectfully and maintain the confidentiality of
                personal group conversations. *
              </span>
            </label>
            {errors.termsAccepted && (
              <p className="text-xs text-red-300">{errors.termsAccepted}</p>
            )}
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 accent-[#FFAB33]"
                checked={form.privacyAccepted}
                onChange={(e) => set("privacyAccepted", e.target.checked)}
              />
              <span>
                I consent to Founder-Being processing my application data for
                selection and retreat operations, as described in the{" "}
                <a href="/privacy" className="underline-offset-4 hover:underline">
                  Privacy
                </a>{" "}
                notice. *
              </span>
            </label>
            {errors.privacyAccepted && (
              <p className="text-xs text-red-300">{errors.privacyAccepted}</p>
            )}
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 accent-[#FFAB33]"
                checked={form.marketingConsent}
                onChange={(e) => set("marketingConsent", e.target.checked)}
              />
              <span>
                Optional: I would like updates about future Founder-Being
                gatherings.
              </span>
            </label>
          </div>

          {/* Honeypot */}
          <div className="absolute -left-[9999px] opacity-0" aria-hidden>
            <label>
              Website
              <input
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </label>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <button type="button" className="btn btn-secondary" onClick={back}>
            Back
          </button>
        ) : (
          <span />
        )}
        {step < 2 ? (
          <button type="button" className="btn btn-primary" onClick={next}>
            Continue
          </button>
        ) : (
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit application"}
          </button>
        )}
      </div>
    </form>
  );
}
