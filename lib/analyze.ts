import type { AnalysisResult } from "./types";
import { getProvider } from "./providers";
import { computeSimilarity, estimateRent } from "./estimate";

/**
 * Run the full pipeline for an address:
 *   1. Resolve property details from the active provider.
 *   2. Pull comparable rentals.
 *   3. Score each comp's similarity to the subject.
 *   4. Derive a fair-market rent estimate from those comps.
 */
export async function analyzeAddress(address: string): Promise<AnalysisResult> {
  const provider = getProvider();

  const property = await provider.getProperty(address);
  const comps = await provider.getRentalComps(property);

  // Score every comp once, then sort best matches first. The estimate reuses
  // these same scores so the headline number and the table always agree.
  for (const comp of comps) {
    comp.similarity = computeSimilarity(property, comp);
  }
  comps.sort((a, b) => b.similarity - a.similarity);

  const estimate = estimateRent(property, comps);

  return {
    property,
    estimate,
    comps,
    isMockData: provider.isMock,
    providerName: provider.name,
    generatedAt: new Date().toISOString(),
  };
}
