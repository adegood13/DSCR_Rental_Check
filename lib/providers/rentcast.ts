import type {
  PropertyDetails,
  PropertyType,
  RentalComp,
} from "../types";
import { RentalDataProvider, ProviderError } from "./provider";

/**
 * Live data from RentCast (https://developers.rentcast.io).
 *
 * This is a drop-in replacement for the mock provider. It is wired up but kept
 * dormant unless `DATA_PROVIDER=rentcast` and a `RENTCAST_API_KEY` are set, so
 * the app runs with zero configuration by default.
 *
 * Endpoints used:
 *   GET /v1/properties             -> property record for the address
 *   GET /v1/avm/rent/long-term     -> rent estimate + comparable rentals
 */
export class RentCastProvider implements RentalDataProvider {
  readonly name = "RentCast";
  readonly isMock = false;

  private readonly baseUrl = "https://api.rentcast.io/v1";

  constructor(private readonly apiKey: string) {
    if (!apiKey) {
      throw new ProviderError("RENTCAST_API_KEY is not set.");
    }
  }

  private async get(path: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: { "X-Api-Key": this.apiKey, Accept: "application/json" },
      // Property data changes slowly; cache for an hour.
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new ProviderError(
        `RentCast request failed (${res.status}). ${body.slice(0, 200)}`
      );
    }
    return res.json();
  }

  async getProperty(address: string): Promise<PropertyDetails> {
    const data = await this.get(
      `/properties?address=${encodeURIComponent(address)}`
    );
    const rec = Array.isArray(data) ? data[0] : data;
    if (!rec) {
      throw new ProviderError(
        "No property record was found for that address. Double-check it and try again."
      );
    }

    const formattedAddress: string = rec.formattedAddress ?? address;
    return {
      formattedAddress,
      city: rec.city,
      state: rec.state,
      zipCode: rec.zipCode,
      location:
        rec.latitude != null && rec.longitude != null
          ? { lat: rec.latitude, lng: rec.longitude }
          : undefined,
      propertyType: normalizeType(rec.propertyType),
      bedrooms: rec.bedrooms ?? 0,
      bathrooms: rec.bathrooms ?? 0,
      squareFootage: rec.squareFootage ?? 0,
      lotSize: rec.lotSize,
      yearBuilt: rec.yearBuilt,
      lastSalePrice: rec.lastSalePrice,
      lastSaleDate: rec.lastSaleDate,
      mapUrl: mapsSearchUrl(formattedAddress),
    };
  }

  async getRentalComps(property: PropertyDetails): Promise<RentalComp[]> {
    const params = new URLSearchParams({
      address: property.formattedAddress,
      propertyType: toRentCastType(property.propertyType),
      compCount: "10",
    });
    if (property.bedrooms) params.set("bedrooms", String(property.bedrooms));
    if (property.bathrooms) params.set("bathrooms", String(property.bathrooms));
    if (property.squareFootage)
      params.set("squareFootage", String(property.squareFootage));

    const data = await this.get(`/avm/rent/long-term?${params.toString()}`);
    const comparables: any[] = data.comparables ?? [];

    return comparables.map((c, i) => {
      const addr: string = c.formattedAddress ?? "Unknown address";
      return {
        id: c.id ?? `comp-${i + 1}`,
        formattedAddress: addr,
        propertyType: normalizeType(c.propertyType),
        bedrooms: c.bedrooms ?? 0,
        bathrooms: c.bathrooms ?? 0,
        squareFootage: c.squareFootage ?? 0,
        rent: c.price ?? c.rent ?? 0,
        distanceMiles:
          c.distance != null ? Math.round(c.distance * 10) / 10 : 0,
        listedDate:
          c.listedDate ??
          isoDaysAgo(typeof c.daysOld === "number" ? c.daysOld : 0),
        source: "RentCast",
        sourceUrl: mapsSearchUrl(addr),
        similarity: 0, // filled in by the analysis service
      };
    });
  }
}

function normalizeType(raw?: string): PropertyType {
  switch ((raw ?? "").toLowerCase()) {
    case "single family":
    case "singlefamily":
      return "Single Family";
    case "condo":
    case "condominium":
      return "Condo";
    case "townhouse":
      return "Townhouse";
    case "duplex":
    case "triplex":
    case "quadruplex":
      return "Duplex";
    case "multi-family":
    case "multifamily":
    case "apartment":
      return "Multi-Family";
    default:
      return "Single Family";
  }
}

function toRentCastType(t: PropertyType): string {
  switch (t) {
    case "Single Family":
      return "Single Family";
    case "Condo":
      return "Condo";
    case "Townhouse":
      return "Townhouse";
    default:
      return "Multi-Family";
  }
}

function mapsSearchUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;
}

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}
