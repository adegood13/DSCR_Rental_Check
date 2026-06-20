import type {
  PropertyDetails,
  PropertyType,
  RentalComp,
} from "../types";
import { RentalDataProvider, ProviderError } from "./provider";

/**
 * A deterministic, offline data provider.
 *
 * Given the same address it always returns the same property and comps, so the
 * app is fully demoable with no API keys or network calls. The numbers are
 * fabricated but internally consistent: comps are generated around a single
 * "market" rent-per-square-foot so the resulting estimate is sensible.
 *
 * Comp source links point to a Google Maps search for the (fabricated) address
 * in the real city/state from the input, so clicking a comp still shows you the
 * neighborhood. Swap in a live provider for true listing links.
 */
export class MockProvider implements RentalDataProvider {
  readonly name = "Simulated data";
  readonly isMock = true;

  async getProperty(address: string): Promise<PropertyDetails> {
    const trimmed = address.trim();
    if (trimmed.length < 4) {
      throw new ProviderError(
        "Please enter a fuller street address (e.g. 123 Main St, Austin, TX 78701)."
      );
    }

    const parsed = parseAddress(trimmed);
    const rng = mulberry32(hashString(parsed.normalized));

    const propertyType = pick(rng, PROPERTY_TYPES, [0.55, 0.18, 0.15, 0.07, 0.05]);
    const bedrooms = 2 + Math.floor(rng() * 4); // 2-5
    const bathrooms = roundHalf(
      Math.max(1, bedrooms - 1 + (rng() < 0.5 ? 0 : 1) - rng() * 0.5)
    );
    const squareFootage = roundTo(620 * bedrooms + rng() * 700, 10);

    // Market price-per-sqft drives the implied sale value.
    const pricePerSqFt = 150 + rng() * 320; // $150-$470 /sqft
    const lastSalePrice = roundTo(squareFootage * pricePerSqFt, 1000);
    const lastSaleDate = isoDaysAgo(rng() * 1825); // within ~5 years

    // Stash the market rent-per-sqft on the object via a closure-free channel:
    // we re-derive the same value in getRentalComps from the same seed.
    const property: PropertyDetails = {
      formattedAddress: parsed.formatted,
      city: parsed.city,
      state: parsed.state,
      zipCode: parsed.zip,
      propertyType,
      bedrooms,
      bathrooms,
      squareFootage,
      lotSize:
        propertyType === "Condo" || propertyType === "Apartment"
          ? undefined
          : roundTo(3000 + rng() * 9000, 100),
      yearBuilt: 1950 + Math.floor(rng() * 73),
      lastSalePrice,
      lastSaleDate,
      mapUrl: mapsSearchUrl(parsed.formatted),
    };

    return property;
  }

  async getRentalComps(property: PropertyDetails): Promise<RentalComp[]> {
    // Re-seed from the same normalized address so comps are stable and tied to
    // the subject. We advance the RNG past the property-generation draws so the
    // comp stream is independent but reproducible.
    const seed = hashString(
      normalize(
        [property.formattedAddress].filter(Boolean).join(", ")
      )
    );
    const rng = mulberry32(seed ^ 0x9e3779b9);

    const marketRpsf = deriveMarketRpsf(property);
    const count = 6 + Math.floor(rng() * 4); // 6-9 comps
    const comps: RentalComp[] = [];

    for (let i = 0; i < count; i++) {
      const bedDelta = pick(rng, [-1, 0, 0, 1], [0.2, 0.35, 0.3, 0.15]);
      const bedrooms = Math.max(1, property.bedrooms + bedDelta);
      const sizeFactor = 0.82 + rng() * 0.36; // ±~18%
      const squareFootage = roundTo(property.squareFootage * sizeFactor, 10);
      const bathrooms = roundHalf(
        Math.max(1, bedrooms - 0.5 + (rng() < 0.5 ? 0 : 0.5) - rng() * 0.5)
      );

      const rentNoise = 0.9 + rng() * 0.2; // ±10%
      const rent = roundTo(squareFootage * marketRpsf * rentNoise, 25);

      const propertyType =
        rng() < 0.78
          ? property.propertyType
          : pick(rng, PROPERTY_TYPES, [0.55, 0.18, 0.15, 0.07, 0.05]);

      const address = makeNearbyAddress(rng, property);

      comps.push({
        id: `comp-${i + 1}`,
        formattedAddress: address,
        propertyType,
        bedrooms,
        bathrooms,
        squareFootage,
        rent,
        distanceMiles: roundTo(0.2 + rng() * 2.4, 0.1),
        listedDate: isoDaysAgo(rng() * 210),
        source: pick(rng, COMP_SOURCES),
        sourceUrl: mapsSearchUrl(address),
        // Populated by the analysis service via computeSimilarity().
        similarity: 0,
      });
    }

    // Closest comps first — that's what an underwriter scans for.
    return comps.sort((a, b) => a.distanceMiles - b.distanceMiles);
  }
}

/* ----------------------------- helpers ----------------------------- */

const PROPERTY_TYPES: PropertyType[] = [
  "Single Family",
  "Townhouse",
  "Condo",
  "Duplex",
  "Multi-Family",
];

const COMP_SOURCES = ["Zillow", "Realtor.com", "Apartments.com", "Rentometer"];

const STREET_NAMES = [
  "Oak",
  "Maple",
  "Cedar",
  "Pine",
  "Elm",
  "Sunset",
  "Park",
  "Lakeview",
  "Highland",
  "Riverside",
  "Magnolia",
  "Willow",
  "Birch",
  "Aspen",
  "Brookside",
];

const STREET_SUFFIXES = ["St", "Ave", "Dr", "Ln", "Ct", "Way", "Blvd"];

/** Re-derive a stable market rent-per-sqft from the subject's own attributes. */
function deriveMarketRpsf(property: PropertyDetails): number {
  const rng = mulberry32(
    hashString(normalize(property.formattedAddress)) ^ 0x85ebca6b
  );
  // Burn a few draws to decorrelate from other streams, then sample.
  rng();
  rng();
  return 0.9 + rng() * 1.5; // $0.90-$2.40 /sqft/month
}

function makeNearbyAddress(rng: () => number, property: PropertyDetails): string {
  const number = 100 + Math.floor(rng() * 8900);
  const street = pick(rng, STREET_NAMES);
  const suffix = pick(rng, STREET_SUFFIXES);
  const tail = [property.city, property.state]
    .filter(Boolean)
    .join(", ");
  const zip = property.zipCode ? ` ${property.zipCode}` : "";
  const locality = tail ? `, ${tail}${zip}` : "";
  return `${number} ${street} ${suffix}${locality}`;
}

interface ParsedAddress {
  formatted: string;
  normalized: string;
  city?: string;
  state?: string;
  zip?: string;
}

/** Best-effort parse of a US-style "street, city, ST zip" address. */
function parseAddress(raw: string): ParsedAddress {
  const parts = raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  let city: string | undefined;
  let state: string | undefined;
  let zip: string | undefined;

  if (parts.length >= 3) {
    city = titleCase(parts[1]);
    const m = parts[2].match(/([A-Za-z]{2})\s*(\d{5})?/);
    if (m) {
      state = m[1].toUpperCase();
      zip = m[2];
    }
  } else if (parts.length === 2) {
    // "Street, City" or "City, ST zip"
    const m = parts[1].match(/([A-Za-z]{2})\s*(\d{5})?/);
    if (m && parts[1].length <= 9) {
      state = m[1].toUpperCase();
      zip = m[2];
    } else {
      city = titleCase(parts[1]);
    }
  }

  const street = titleCase(parts[0] ?? raw);
  const formatted = [
    street,
    city,
    [state, zip].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  return {
    formatted: formatted || raw,
    normalized: normalize(formatted || raw),
    city,
    state,
    zip,
  };
}

function mapsSearchUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/* ---- deterministic RNG (mulberry32) + string hash (xmur3) ---- */

function hashString(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, items: T[], weights?: number[]): T {
  if (!weights) {
    return items[Math.floor(rng() * items.length)];
  }
  const total = weights.reduce((s, w) => s + w, 0);
  let r = rng() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function roundTo(value: number, step: number): number {
  // Round to the step, then strip floating-point noise (e.g. 0.70000000001).
  return Math.round((Math.round(value / step) * step) * 1e6) / 1e6;
}

function roundHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}
