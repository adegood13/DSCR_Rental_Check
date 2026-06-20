"use client";

import { useMemo, useState } from "react";
import {
  computeDscr,
  defaultDscrInputs,
  type DscrInputs,
  type DscrResult,
} from "@/lib/dscr";
import { formatCurrency, formatPercent } from "@/lib/format";

const RATING_STYLES: Record<DscrResult["rating"], string> = {
  Strong: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Adequate: "bg-brand-50 text-brand-700 border-brand-100",
  Tight: "bg-amber-50 text-amber-700 border-amber-200",
  Negative: "bg-red-50 text-red-700 border-red-200",
};

export default function DscrCalculator({
  initialRent,
  propertyPrice,
}: {
  initialRent: number;
  propertyPrice: number;
}) {
  const [inputs, setInputs] = useState<DscrInputs>(() =>
    defaultDscrInputs(initialRent, Math.round(propertyPrice / 1000) * 1000)
  );

  const result = useMemo(() => computeDscr(inputs), [inputs]);

  function set<K extends keyof DscrInputs>(key: K, value: number) {
    setInputs((prev) => ({ ...prev, [key]: Number.isFinite(value) ? value : 0 }));
  }

  return (
    <section className="card overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-900">DSCR & cash-flow analysis</h2>
        <p className="text-xs text-slate-500">
          Rent is pre-filled from the estimate above. Adjust the financing
          assumptions to fit your deal.
        </p>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-5">
        {/* Inputs */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
            <Field
              label="Monthly rent"
              prefix="$"
              value={inputs.monthlyRent}
              onChange={(v) => set("monthlyRent", v)}
            />
            <Field
              label="Property price"
              prefix="$"
              value={inputs.propertyPrice}
              onChange={(v) => set("propertyPrice", v)}
            />
            <Field
              label="Down payment"
              suffix="%"
              value={inputs.downPaymentPercent}
              onChange={(v) => set("downPaymentPercent", v)}
            />
            <Field
              label="Interest rate"
              suffix="%"
              step={0.125}
              value={inputs.interestRatePercent}
              onChange={(v) => set("interestRatePercent", v)}
            />
            <Field
              label="Loan term"
              suffix="yr"
              value={inputs.loanTermYears}
              onChange={(v) => set("loanTermYears", v)}
            />
            <Field
              label="Property tax / yr"
              prefix="$"
              value={inputs.annualPropertyTax}
              onChange={(v) => set("annualPropertyTax", v)}
            />
            <Field
              label="Insurance / yr"
              prefix="$"
              value={inputs.annualInsurance}
              onChange={(v) => set("annualInsurance", v)}
            />
            <Field
              label="HOA / mo"
              prefix="$"
              value={inputs.monthlyHoa}
              onChange={(v) => set("monthlyHoa", v)}
            />
            <Field
              label="Maintenance / mo"
              prefix="$"
              value={inputs.monthlyMaintenance}
              onChange={(v) => set("monthlyMaintenance", v)}
            />
            <Field
              label="Vacancy"
              suffix="%"
              value={inputs.vacancyPercent}
              onChange={(v) => set("vacancyPercent", v)}
            />
            <Field
              label="Management"
              suffix="%"
              value={inputs.managementPercent}
              onChange={(v) => set("managementPercent", v)}
            />
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          <div
            className={`rounded-xl border p-5 ${RATING_STYLES[result.rating]}`}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium">DSCR</span>
              <span className="text-xs font-semibold uppercase tracking-wide">
                {result.rating}
              </span>
            </div>
            <div className="mt-1 text-4xl font-bold tracking-tight">
              {result.dscr.toFixed(2)}
            </div>
            <p className="mt-1 text-xs opacity-80">
              Gross rent ÷ PITIA. Most lenders look for 1.00–1.25+.
            </p>
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            <Line label="Loan amount" value={formatCurrency(result.loanAmount)} />
            <Line
              label="Down payment"
              value={formatCurrency(result.downPayment)}
            />
            <Line
              label="Principal & interest"
              value={`${formatCurrency(result.monthlyPrincipalAndInterest)}/mo`}
            />
            <Line
              label="Taxes + insurance + HOA"
              value={`${formatCurrency(
                result.monthlyTax + result.monthlyInsurance + result.monthlyHoa
              )}/mo`}
            />
            <Line
              label="PITIA"
              value={`${formatCurrency(result.pitia)}/mo`}
              strong
            />
            <div className="my-2 border-t border-slate-100" />
            <Line
              label="Monthly cash flow"
              value={`${formatCurrency(result.monthlyCashFlow)}/mo`}
              tone={result.monthlyCashFlow >= 0 ? "positive" : "negative"}
              strong
            />
            <Line
              label="Cash-on-cash return"
              value={formatPercent(result.cashOnCashReturn)}
              tone={result.cashOnCashReturn >= 0 ? "positive" : "negative"}
            />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {prefix}
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          step={step}
          min={0}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={`input ${prefix ? "pl-6" : ""} ${suffix ? "pr-9" : ""}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function Line({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: "positive" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600"
      : tone === "negative"
      ? "text-red-600"
      : "text-slate-900";
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className={`${strong ? "font-bold" : "font-medium"} ${toneClass}`}>
        {value}
      </dd>
    </div>
  );
}
