import type { PropertyDetails, RentEstimate } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

const CONFIDENCE_STYLES: Record<RentEstimate["confidence"], string> = {
  High: "bg-action-300 text-bob-ink",
  Medium: "bg-amber-200 text-amber-900",
  Low: "bg-white/15 text-white ring-1 ring-white/30",
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
      <div className="bg-gradient-to-br from-brand-500 to-bob-bluedeep p-6 text-white">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-brand-100">
            Estimated fair-market rent
          </p>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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
        <p className="mt-1 font-mono text-sm text-brand-100">
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

        <div className="mt-5 rounded-lg bg-bob-card p-4 text-sm leading-relaxed text-slate-600">
          <p className="mb-1 font-semibold text-bob-ink">How we got here</p>
          {estimate.methodology}
        </div>
      </div>
    </section>
  );
}
