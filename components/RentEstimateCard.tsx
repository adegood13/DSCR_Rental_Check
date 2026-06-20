import type { PropertyDetails, RentEstimate } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

const CONFIDENCE_STYLES: Record<RentEstimate["confidence"], string> = {
  High: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function RentEstimateCard({
  estimate,
  property,
}: {
  estimate: RentEstimate;
  property: PropertyDetails;
}) {
  const rangePct =
    estimate.rent > 0
      ? Math.max(
          2,
          Math.min(
            98,
            ((estimate.rent - estimate.rentLow) /
              (estimate.rentHigh - estimate.rentLow || 1)) *
              100
          )
        )
      : 50;

  return (
    <section className="card h-full overflow-hidden">
      <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-brand-100">
            Estimated fair-market rent
          </p>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
              CONFIDENCE_STYLES[estimate.confidence]
            }`}
          >
            {estimate.confidence} confidence
          </span>
        </div>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-4xl font-bold tracking-tight sm:text-5xl">
            {formatCurrency(estimate.rent)}
          </span>
          <span className="mb-1.5 text-brand-100">/ month</span>
        </div>
        <p className="mt-1 text-sm text-brand-100">
          {formatCurrency(estimate.rentPerSqFt, 2)} per sqft ·{" "}
          {estimate.compCount} comps
        </p>
      </div>

      <div className="p-6">
        <div className="mb-1 flex justify-between text-xs font-medium text-slate-500">
          <span>Likely range</span>
        </div>
        <div className="relative mt-2 h-2 rounded-full bg-slate-100">
          <div
            className="absolute -top-1 h-4 w-1 -translate-x-1/2 rounded-full bg-brand-600"
            style={{ left: `${rangePct}%` }}
            aria-hidden
          />
        </div>
        <div className="mt-2 flex justify-between text-sm font-semibold text-slate-900">
          <span>{formatCurrency(estimate.rentLow)}</span>
          <span>{formatCurrency(estimate.rentHigh)}</span>
        </div>

        <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
          <p className="mb-1 font-semibold text-slate-700">How we got here</p>
          {estimate.methodology}
        </div>
      </div>
    </section>
  );
}
