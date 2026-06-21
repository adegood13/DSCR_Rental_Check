"use client";

import { useState } from "react";

const SAMPLES = [
  "742 Evergreen Terrace, Springfield, IL 62704",
  "1234 Oak St, Austin, TX 78704",
  "88 Lakeview Dr, Denver, CO 80205",
];

export default function AddressForm({
  onSubmit,
  loading,
}: {
  onSubmit: (address: string) => void;
  loading: boolean;
}) {
  const [address, setAddress] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = address.trim();
    if (value) onSubmit(value);
  }

  return (
    <div className="card p-5 sm:p-6">
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          <input
            className="input py-3 pl-10 text-base"
            type="text"
            inputMode="text"
            autoComplete="street-address"
            placeholder="Enter a property address…"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={loading}
            aria-label="Property address"
          />
        </div>
        <button type="submit" className="btn-primary py-3" disabled={loading}>
          {loading ? (
            <>
              <Spinner /> Analyzing…
            </>
          ) : (
            "Estimate rent"
          )}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>Try:</span>
        {SAMPLES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setAddress(s);
              onSubmit(s);
            }}
            disabled={loading}
            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600 transition hover:border-brand-300 hover:text-brand-700 disabled:opacity-60"
          >
            {s.split(",")[0]}
          </button>
        ))}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin text-bob-ink"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
