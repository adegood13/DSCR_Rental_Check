import type { PropertyDetails, RentalComp } from "../types";

/**
 * The contract every rental-data source implements.
 *
 * Swapping the mock provider for a live one (RentCast, ATTOM, etc.) means
 * writing one class that fulfils this interface and registering it in
 * `index.ts`. The API route and UI never change.
 */
export interface RentalDataProvider {
  /** Human-readable name, surfaced in the UI ("Simulated data", "RentCast"). */
  readonly name: string;
  /** Whether this provider returns simulated rather than live data. */
  readonly isMock: boolean;

  /** Look up normalized details for the subject property. */
  getProperty(address: string): Promise<PropertyDetails>;

  /** Find comparable rentals near the subject property. */
  getRentalComps(property: PropertyDetails): Promise<RentalComp[]>;
}

export class ProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderError";
  }
}
