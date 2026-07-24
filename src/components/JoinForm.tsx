"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function JoinForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await res.json()) as { error?: string; ok?: boolean };

      if (!res.ok) {
        setStatus("error");
        setMessage(json.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("Thank you. We will be in touch.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Unable to submit right now. Please email us directly.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-12 max-w-[40rem] space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="sr-only">Full Name</span>
          <input
            className="field"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            placeholder="Full Name"
          />
        </label>

        <label className="block">
          <span className="sr-only">Email</span>
          <input
            className="field"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
          />
        </label>

        <label className="block">
          <span className="sr-only">WhatsApp</span>
          <input
            className="field"
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            placeholder="WhatsApp"
          />
        </label>

        <label className="block">
          <span className="sr-only">Location</span>
          <input
            className="field"
            name="location"
            type="text"
            autoComplete="address-level2"
            placeholder="Location"
          />
        </label>

        <label className="block">
          <span className="sr-only">Are you a founder?</span>
          <select className="field" name="isFounder" defaultValue="">
            <option value="" disabled>
              Founder?
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="exploring">Exploring</option>
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="sr-only">Company</span>
          <input
            className="field"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Company"
          />
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm text-fb-body">
        <input
          type="checkbox"
          name="consent"
          value="yes"
          className="mt-1 h-4 w-4 accent-[#FFAB33]"
        />
        <span>
          I would like to receive updates about Founder-Being gatherings.
        </span>
      </label>

      <button
        type="submit"
        className="btn btn-primary w-full sm:w-auto"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Submitting…" : "Submit"}
      </button>

      <div
        role="status"
        aria-live="polite"
        className={`min-h-[1.5rem] text-sm ${
          status === "error" ? "text-red-300" : "text-[#FFAB33]"
        }`}
      >
        {message}
      </div>
    </form>
  );
}
