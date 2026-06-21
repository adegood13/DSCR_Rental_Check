import type { PropertyDetails, RentalComp } from "@/lib/types";
import {
  formatCurrency,
  formatDate,
  formatDistance,
  formatNumber,
} from "@/lib/format";

export default function CompsTable({
  comps,
  subject,
  providerName,
}: {
  comps: RentalComp[];
  subject: PropertyDetails;
  providerName: string;
}) {
  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-semibold text-slate-900">
            Comparable rentals
            <span className="ml-2 text-sm font-normal text-slate-500">
              {comps.length} found
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Sorted by match to the subject · source: {providerName}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3 font-medium">Address</th>
              <th className="px-3 py-3 font-medium">Beds / Baths</th>
              <th className="px-3 py-3 font-medium">SqFt</th>
              <th className="px-3 py-3 font-medium">Rent</th>
              <th className="px-3 py-3 font-medium">$/sqft</th>
              <th className="px-3 py-3 font-medium">Distance</th>
              <th className="px-3 py-3 font-medium">Listed</th>
              <th className="px-3 py-3 font-medium">Match</th>
              <th className="px-5 py-3 font-medium text-right">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {comps.map((comp) => (
              <tr key={comp.id} className="transition hover:bg-slate-50">
                <td className="px-5 py-3">
                  <div className="font-medium text-slate-900">
                    {comp.formattedAddress}
                  </div>
                  <div className="text-xs text-slate-400">
                    {comp.propertyType}
                  </div>
                </td>
                <td className="px-3 py-3 text-slate-700">
                  {comp.bedrooms} bd / {comp.bathrooms} ba
                </td>
                <td className="px-3 py-3 font-mono text-slate-700">
                  {formatNumber(comp.squareFootage)}
                </td>
                <td className="px-3 py-3 font-mono font-semibold text-bob-ink">
                  {formatCurrency(comp.rent)}
                </td>
                <td className="px-3 py-3 font-mono text-slate-700">
                  {formatCurrency(comp.rent / comp.squareFootage, 2)}
                </td>
                <td className="px-3 py-3 font-mono text-slate-700">
                  {formatDistance(comp.distanceMiles)}
                </td>
                <td className="px-3 py-3 text-slate-500">
                  {formatDate(comp.listedDate)}
                </td>
                <td className="px-3 py-3">
                  <MatchBadge score={comp.similarity} />
                </td>
                <td className="px-5 py-3 text-right">
                  <a
                    href={comp.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-brand-600 hover:text-brand-700"
                  >
                    {comp.source}
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
        Match blends distance, size, and bed/bath similarity to{" "}
        {subject.bedrooms} bd / {subject.bathrooms} ba ·{" "}
        {formatNumber(subject.squareFootage)} sqft. Higher-match comps carry more
        weight in the estimate.
      </p>
    </section>
  );
}

function MatchBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const style =
    pct >= 75
      ? "bg-action-100 text-action-700"
      : pct >= 55
      ? "bg-amber-50 text-amber-700"
      : "bg-slate-100 text-slate-500";
  return (
    <span
      className={`rounded-full px-2 py-0.5 font-mono text-xs font-semibold ${style}`}
    >
      {pct}%
    </span>
  );
}
