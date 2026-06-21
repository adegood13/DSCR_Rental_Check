import Analyzer from "@/components/Analyzer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-20">
        <header className="pt-12 pb-8 text-center">
          <p className="eyebrow">AskBobAI · Rent Check</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-bob-ink sm:text-5xl">
            What should this property{" "}
            <span className="font-serif text-5xl font-normal italic text-brand-600 sm:text-6xl">
              rent
            </span>{" "}
            for?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-bob-muted">
            Enter an address. AskBob pulls the property details, finds
            comparable rentals nearby, and estimates fair-market rent, then runs
            a DSCR and cash-flow analysis. Every comp links out, so you can check
            the math.
          </p>
        </header>

        <Analyzer />
      </main>

      <Footer />
    </>
  );
}
