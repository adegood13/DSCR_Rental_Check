// DSCR (Debt Service Coverage Ratio) math for rental underwriting.
//
// Most DSCR lenders use the simple form:
//
//     DSCR = Gross Monthly Rent / Monthly PITIA
//
// where PITIA = Principal + Interest + Taxes + Insurance + Association dues.
// A DSCR of 1.0 means rent exactly covers the debt service; lenders typically
// want 1.0-1.25+ depending on the program.

export interface DscrInputs {
  monthlyRent: number;
  propertyPrice: number;
  downPaymentPercent: number; // e.g. 20 for 20%
  interestRatePercent: number; // annual, e.g. 7.25
  loanTermYears: number; // e.g. 30
  annualPropertyTax: number;
  annualInsurance: number;
  monthlyHoa: number;
  vacancyPercent: number; // e.g. 5
  managementPercent: number; // e.g. 8 (of rent)
  monthlyMaintenance: number;
}

export interface DscrResult {
  loanAmount: number;
  downPayment: number;
  monthlyPrincipalAndInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  /** Principal + Interest + Taxes + Insurance + Association dues. */
  pitia: number;
  dscr: number;
  /** Rent left after vacancy, management, maintenance and PITIA. */
  monthlyCashFlow: number;
  /** Annual cash flow as a % of cash invested (down payment). */
  cashOnCashReturn: number;
  rating: "Strong" | "Adequate" | "Tight" | "Negative";
}

/** Standard fully-amortizing monthly payment. */
export function monthlyPayment(
  principal: number,
  annualRatePercent: number,
  termYears: number
): number {
  if (principal <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  const n = termYears * 12;
  if (n <= 0) return principal;
  if (monthlyRate === 0) return principal / n;
  const factor = Math.pow(1 + monthlyRate, n);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function computeDscr(inputs: DscrInputs): DscrResult {
  const downPayment = inputs.propertyPrice * (inputs.downPaymentPercent / 100);
  const loanAmount = Math.max(0, inputs.propertyPrice - downPayment);

  const pi = monthlyPayment(
    loanAmount,
    inputs.interestRatePercent,
    inputs.loanTermYears
  );
  const monthlyTax = inputs.annualPropertyTax / 12;
  const monthlyInsurance = inputs.annualInsurance / 12;
  const pitia = pi + monthlyTax + monthlyInsurance + inputs.monthlyHoa;

  const dscr = pitia > 0 ? inputs.monthlyRent / pitia : 0;

  const vacancyLoss = inputs.monthlyRent * (inputs.vacancyPercent / 100);
  const managementCost = inputs.monthlyRent * (inputs.managementPercent / 100);
  const effectiveRent = inputs.monthlyRent - vacancyLoss;
  const monthlyCashFlow =
    effectiveRent -
    pitia -
    managementCost -
    inputs.monthlyMaintenance;

  const cashOnCashReturn =
    downPayment > 0 ? ((monthlyCashFlow * 12) / downPayment) * 100 : 0;

  return {
    loanAmount,
    downPayment,
    monthlyPrincipalAndInterest: pi,
    monthlyTax,
    monthlyInsurance,
    monthlyHoa: inputs.monthlyHoa,
    pitia,
    dscr,
    monthlyCashFlow,
    cashOnCashReturn,
    rating: rateDscr(dscr),
  };
}

function rateDscr(dscr: number): DscrResult["rating"] {
  if (dscr >= 1.25) return "Strong";
  if (dscr >= 1.1) return "Adequate";
  if (dscr >= 1.0) return "Tight";
  return "Negative";
}

/** Sensible starting assumptions for a new analysis. */
export function defaultDscrInputs(
  monthlyRent: number,
  propertyPrice: number
): DscrInputs {
  return {
    monthlyRent,
    propertyPrice,
    downPaymentPercent: 20,
    interestRatePercent: 7.25,
    loanTermYears: 30,
    // ~1.1% of value in tax, ~0.5% in insurance — rough national-ish defaults.
    annualPropertyTax: Math.round((propertyPrice * 0.011) / 50) * 50,
    annualInsurance: Math.round((propertyPrice * 0.005) / 50) * 50,
    monthlyHoa: 0,
    vacancyPercent: 5,
    managementPercent: 8,
    monthlyMaintenance: Math.round((monthlyRent * 0.05) / 5) * 5,
  };
}
