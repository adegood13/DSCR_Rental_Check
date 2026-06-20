// Shared domain types for the rental analysis pipeline.
// These are the contract between the data providers, the API route, and the UI.

export type PropertyType =
  | "Single Family"
  | "Condo"
  | "Townhouse"
  | "Duplex"
  | "Multi-Family"
  | "Apartment";

export interface GeoPoint {
  lat: number;
  lng: number;
}

/** Normalized details about the subject property. */
export interface PropertyDetails {
  formattedAddress: string;
  city?: string;
  state?: string;
  zipCode?: string;
  location?: GeoPoint;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  lotSize?: number;
  yearBuilt?: number;
  lastSalePrice?: number;
  lastSaleDate?: string; // ISO date
  /** Link a user can follow to see the property on a map. */
  mapUrl: string;
}

/** A single comparable rental used to support the estimate. */
export interface RentalComp {
  id: string;
  formattedAddress: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  /** Monthly rent in USD. */
  rent: number;
  /** Straight-line distance from the subject property, in miles. */
  distanceMiles: number;
  /** ISO date the comp was listed / observed. */
  listedDate: string;
  /** Human-readable name of where this comp came from (e.g. "Zillow"). */
  source: string;
  /** A clickable link to the underlying listing / record. */
  sourceUrl: string;
  /** 0-1 weight describing how similar this comp is to the subject. */
  similarity: number;
}

export type Confidence = "High" | "Medium" | "Low";

/** The computed rent estimate, derived from the comps. */
export interface RentEstimate {
  /** Point estimate of fair-market monthly rent, USD. */
  rent: number;
  /** Conservative low end of the likely range, USD. */
  rentLow: number;
  /** Optimistic high end of the likely range, USD. */
  rentHigh: number;
  /** Estimated rent per square foot. */
  rentPerSqFt: number;
  confidence: Confidence;
  /** Number of comps that fed the estimate. */
  compCount: number;
  /** Plain-language explanation of how the number was reached. */
  methodology: string;
}

/** The full payload returned by the analysis API. */
export interface AnalysisResult {
  property: PropertyDetails;
  estimate: RentEstimate;
  comps: RentalComp[];
  /** True when the data is simulated rather than from a live source. */
  isMockData: boolean;
  providerName: string;
  generatedAt: string; // ISO timestamp
}

export interface AnalyzeError {
  error: string;
}
