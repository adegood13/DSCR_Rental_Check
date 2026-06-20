import type {
  PropertyDetails,
  RentalComp,
  RentEstimate,
  Confidence,
} from "./types";

/**
 * Derive a fair-market rent estimate for the subject property from a set of
 * comparable rentals.
 *
 * The approach is intentionally transparent so every dollar of the estimate can
 * be traced back to the comps shown to the user:
 *
 *   1. Normalize each comp to the subject by rent-per-square-foot, so a 1,000
 *      sqft comp can inform a 1,400 sqft subject.
 *   2. Weight each comp by how similar it is to the subject (closer distance,
 *      similar size, matching bed/bath count, and more recent listings count
 *      for more).
 *   3. Take the weighted average of the size-adjusted rents as the point
 *      estimate, and use the weighted spread to build a low/high range and a
 *      confidence score.
 */
export function estimateRent(
  property: PropertyDetails,
  comps: RentalComp[]
): RentEstimate {
  const usable = comps.filter((c) => c.squareFootage > 0 && c.rent > 0);

  if (usable.length === 0) {
    // Fallback: nothing to compare against.
    const guess = Math.round((property.squareFootage * 1.25) / 25) * 25;
    return {
      rent: guess,
      rentLow: Math.round((guess * 0.85) / 25) * 25,
      rentHigh: Math.round((guess * 1.15) / 25) * 25,
      rentPerSqFt: property.squareFootage ? guess / property.squareFootage : 0,
      confidence: "Low",
      compCount: 0,
      methodology:
        "No comparable rentals were available, so this is a rough estimate based on square footage alone. Treat it as a placeholder.",
    };
  }

  // Size-adjust each comp to the subject and compute a similarity weight.
  // Reuse a pre-computed similarity if one was attached (so the estimate and
  // the "match %" shown in the UI always agree); otherwise compute it here.
  const adjusted = usable.map((comp) => {
    const rentPerSqFt = comp.rent / comp.squareFootage;
    const impliedRent = rentPerSqFt * property.squareFootage;
    const weight =
      comp.similarity > 0 ? comp.similarity : computeSimilarity(property, comp);
    return { comp, impliedRent, rentPerSqFt, weight };
  });

  const totalWeight = adjusted.reduce((sum, a) => sum + a.weight, 0) || 1;

  const weightedRent =
    adjusted.reduce((sum, a) => sum + a.impliedRent * a.weight, 0) /
    totalWeight;

  // Weighted standard deviation of the size-adjusted rents.
  const variance =
    adjusted.reduce(
      (sum, a) => sum + a.weight * Math.pow(a.impliedRent - weightedRent, 2),
      0
    ) / totalWeight;
  const stdDev = Math.sqrt(variance);

  // Coefficient of variation drives both the range width and the confidence.
  const cov = weightedRent > 0 ? stdDev / weightedRent : 0;

  const rent = roundTo(weightedRent, 25);
  // Range is the tighter of "1 std dev" or a sensible percentage band.
  const band = Math.min(stdDev, weightedRent * 0.15);
  const rentLow = roundTo(weightedRent - band, 25);
  const rentHigh = roundTo(weightedRent + band, 25);

  const confidence = scoreConfidence(usable.length, cov);

  return {
    rent,
    rentLow,
    rentHigh,
    rentPerSqFt: property.squareFootage ? rent / property.squareFootage : 0,
    confidence,
    compCount: usable.length,
    methodology:
      `Based on ${usable.length} comparable rentals within ` +
      `${maxDistance(usable).toFixed(1)} miles, each adjusted to the subject's ` +
      `${Math.round(property.squareFootage).toLocaleString()} sqft and weighted ` +
      `by similarity (distance, size, and bed/bath match). ` +
      `Confidence is ${confidence.toLowerCase()} given the spread across comps.`,
  };
}

/** 0-1 similarity weight: 1.0 is a near-identical, next-door comp. */
export function computeSimilarity(
  property: PropertyDetails,
  comp: RentalComp
): number {
  // Distance: full credit within 0.25 mi, decaying to ~0 by 3 mi.
  const distanceScore = clamp01(1 - comp.distanceMiles / 3);

  // Size: full credit within 10% sqft difference, decaying to 0 at 60%.
  const sizeDiff =
    property.squareFootage > 0
      ? Math.abs(comp.squareFootage - property.squareFootage) /
        property.squareFootage
      : 1;
  const sizeScore = clamp01(1 - (sizeDiff - 0.1) / 0.5);

  // Bedrooms / bathrooms: exact match is best, each unit off costs credit.
  const bedScore = clamp01(1 - Math.abs(comp.bedrooms - property.bedrooms) * 0.3);
  const bathScore = clamp01(
    1 - Math.abs(comp.bathrooms - property.bathrooms) * 0.25
  );

  // Property type match.
  const typeScore = comp.propertyType === property.propertyType ? 1 : 0.7;

  // Recency: listings within ~6 months are freshest.
  const ageDays = Math.max(
    0,
    (Date.now() - new Date(comp.listedDate).getTime()) / 86_400_000
  );
  const recencyScore = clamp01(1 - ageDays / 365);

  // Weighted blend, then keep a small floor so every comp contributes a little.
  const score =
    0.32 * distanceScore +
    0.26 * sizeScore +
    0.16 * bedScore +
    0.1 * bathScore +
    0.08 * typeScore +
    0.08 * recencyScore;

  return 0.05 + 0.95 * clamp01(score);
}

function scoreConfidence(count: number, cov: number): Confidence {
  if (count >= 6 && cov < 0.12) return "High";
  if (count >= 4 && cov < 0.2) return "Medium";
  return "Low";
}

function maxDistance(comps: RentalComp[]): number {
  return comps.reduce((max, c) => Math.max(max, c.distanceMiles), 0);
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
