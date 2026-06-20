import type { PropertyDetails } from "@/lib/types";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";

export default function PropertyCard({
  property,
}: {
  property: PropertyDetails;
}) {
  const rows: Array<[string, string | undefined]> = [
    ["Type", property.propertyType],
    ["Bedrooms", String(property.bedrooms)],
    ["Bathrooms", String(property.bathrooms)],
    ["Living area", `${formatNumber(property.squareFootage)} sqft`],
    [
      "Lot size",
      property.lotSize ? `${formatNumber(property.lotSize)} sqft` : undefined,
    ],
    ["Year built", property.yearBuilt ? String(property.yearBuilt) : undefined],
    [
      "Last sale",
      property.lastSalePrice
        ? `${formatCurrency(property.lastSalePrice)}${
            property.lastSaleDate
              ? ` · ${formatDate(property.lastSaleDate)}`
              : ""
          }`
        : undefined,
    ],
  ];

  return (
    <section className="card h-full p-5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-500">
            Subject property
          </h2>
          <p className="mt-1 font-semibold leading-snug text-slate-900">
            {property.formattedAddress}
          </p>
        </div>
      </div>

      <dl className="divide-y divide-slate-100">
        {rows
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label} className="flex justify-between py-2 text-sm">
              <dt className="text-slate-500">{label}</dt>
              <dd className="font-medium text-slate-900">{value}</dd>
            </div>
          ))}
      </dl>

      <a
        href={property.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        View on map
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth={1.8}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          />
        </svg>
      </a>
    </section>
  );
}
