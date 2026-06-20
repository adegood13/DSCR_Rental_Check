import { RentalDataProvider } from "./provider";
import { MockProvider } from "./mock";
import { RentCastProvider } from "./rentcast";

export type { RentalDataProvider } from "./provider";
export { ProviderError } from "./provider";

/**
 * Select the active data provider from environment configuration.
 *
 *   DATA_PROVIDER=mock      (default) -> simulated, no key required
 *   DATA_PROVIDER=rentcast            -> live RentCast data (needs RENTCAST_API_KEY)
 *
 * If a live provider is requested but misconfigured, we fall back to mock data
 * and log a warning rather than crashing the app.
 */
export function getProvider(): RentalDataProvider {
  const choice = (process.env.DATA_PROVIDER ?? "mock").toLowerCase();

  if (choice === "rentcast") {
    const key = process.env.RENTCAST_API_KEY;
    if (key) return new RentCastProvider(key);
    console.warn(
      "[providers] DATA_PROVIDER=rentcast but RENTCAST_API_KEY is missing; falling back to mock data."
    );
  }

  return new MockProvider();
}
