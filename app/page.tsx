import Analyzer from "@/components/Analyzer";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-20">
      <header className="pt-12 pb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          DSCR Rental Check
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          What rent should this property command?
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Enter an address. We pull the property details, find comparable
          rentals nearby, and estimate fair-market rent — then run a DSCR and
          cash-flow analysis. Every comp links out so you can verify the math.
        </p>
      </header>

      <Analyzer />

      <footer className="mt-16 text-center text-xs text-slate-400">
        For informational purposes only — not a loan offer, appraisal, or
        guarantee of rent. Verify comps independently before underwriting.
      </footer>
    </main>
  );
}
