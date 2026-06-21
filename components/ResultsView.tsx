import type { AnalysisResult } from "@/lib/types";
import PropertyCard from "./PropertyCard";
import RentEstimateCard from "./RentEstimateCard";
import CompsTable from "./CompsTable";
import DscrCalculator from "./DscrCalculator";

export default function ResultsView({ result }: { result: AnalysisResult }) {
  const { property, estimate, comps, isMockData, providerName } = result;

  return (
    <div className="space-y-6">
      {isMockData && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <svg
            className="mt-0.5 h-5 w-5 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <p>
            <strong>Demo mode: data is simulated.</strong> Property details and
            comps are generated for this address, and comp links open the map
            location rather than a live listing. Connect a data provider
            (see&nbsp;<code className="rounded bg-amber-100 px-1">README</code>)
            for live data.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RentEstimateCard estimate={estimate} property={property} />
        </div>
        <div className="lg:col-span-2">
          <PropertyCard property={property} />
        </div>
      </div>

      <CompsTable comps={comps} subject={property} providerName={providerName} />

      <DscrCalculator
        initialRent={estimate.rent}
        propertyPrice={property.lastSalePrice ?? estimate.rent * 180}
      />
    </div>
  );
}
