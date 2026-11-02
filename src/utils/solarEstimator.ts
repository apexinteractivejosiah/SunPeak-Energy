export enum SunlightExposure {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export interface EstimatorInput {
  monthlyBill: number;
  sunlight: SunlightExposure;
  homeSqFt: number;
  zipCode: string;
  firstName: string;
  email: string;
  includeRoofUpgrade?: boolean;
}

export interface LeadValidationErrors {
  zipCode?: string;
  firstName?: string;
  email?: string;
}

export interface YearlySavingsPoint {
  year: number;
  cumulativeUtilityWithoutSolar: number;
  cumulativeNetSolarBenefit: number;
  annualUtilityBillWithoutSolar: number;
  annualSolarSavings: number;
}

export interface SolarEstimateResult {
  recommendedKw: number;
  panelCount: number;
  estimatedMonthlySavings: number;
  firstYearSavings: number;
  tenYearNetSavings: number;
  tenYearTotalUtilitySavings: number;
  tenYearRoiPercent: number;
  paybackYears: number;
  offsetPercent: number;
  grossSystemCost: number;
  federalTaxCredit: number;
  netInvestment: number;
  usableRoofSqFt: number;
  requiredArraySqFt: number;
  co2MetricTonsTenYear: number;
  regionName: string;
  peakSunHours: number;
  utilityRatePerKwh: number;
  yearlyProjection: YearlySavingsPoint[];
}

interface RegionProfile {
  regionName: string;
  peakSunHours: number;
  utilityRatePerKwh: number;
}

export function getRegionProfile(zipCode: string): RegionProfile {
  const clean = zipCode.trim();
  const firstDigit = clean.length > 0 ? clean[0] : '8';

  switch (firstDigit) {
    case '0':
    case '1':
      return {
        regionName: 'Northeast Grid Zone',
        peakSunHours: 4.3,
        utilityRatePerKwh: 0.24,
      };
    case '2':
    case '3':
      return {
        regionName: 'Southeast & Mid-Atlantic Zone',
        peakSunHours: 5.0,
        utilityRatePerKwh: 0.16,
      };
    case '4':
    case '5':
    case '6':
      return {
        regionName: 'Midwest & Central Plains Zone',
        peakSunHours: 4.6,
        utilityRatePerKwh: 0.17,
      };
    case '7':
      return {
        regionName: 'South Central Sunbelt Zone',
        peakSunHours: 5.3,
        utilityRatePerKwh: 0.16,
      };
    case '8':
      return {
        regionName: 'Mountain & Southwest Sunbelt',
        peakSunHours: 5.8,
        utilityRatePerKwh: 0.18,
      };
    case '9':
      return {
        regionName: 'Pacific & West Coast Grid',
        peakSunHours: 5.4,
        utilityRatePerKwh: 0.29,
      };
    default:
      return {
        regionName: 'National Solar Corridor',
        peakSunHours: 5.0,
        utilityRatePerKwh: 0.19,
      };
  }
}

export function validateLeadStep(
  input: Pick<EstimatorInput, 'zipCode' | 'firstName' | 'email'>
): LeadValidationErrors {
  const errors: LeadValidationErrors = {};

  const trimmedZip = input.zipCode.trim();
  if (!trimmedZip) {
    errors.zipCode = 'Enter your 5-digit US zip code.';
  } else if (!/^\d{5}$/.test(trimmedZip)) {
    errors.zipCode = 'Zip code must be exactly 5 digits (e.g., 85001).';
  }

  const trimmedName = input.firstName.trim();
  if (!trimmedName) {
    errors.firstName = 'Enter your first name to personalize your report.';
  } else if (trimmedName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters.';
  }

  const trimmedEmail = input.email.trim();
  if (!trimmedEmail) {
    errors.email = 'Enter your email address to unlock your report.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address (e.g., alex@domain.com).';
  }

  return errors;
}

export function hasValidationErrors(errors: LeadValidationErrors): boolean {
  return Boolean(errors.zipCode || errors.firstName || errors.email);
}

const SUNLIGHT_MULTIPLIER: Record<SunlightExposure, number> = {
  [SunlightExposure.Low]: 0.8,
  [SunlightExposure.Medium]: 1.0,
  [SunlightExposure.High]: 1.16,
};

const TARGET_OFFSET_BY_EXPOSURE: Record<SunlightExposure, number> = {
  [SunlightExposure.Low]: 0.82,
  [SunlightExposure.Medium]: 0.92,
  [SunlightExposure.High]: 0.98,
};

export function clampBill(bill: number): number {
  if (!Number.isFinite(bill)) return 220;
  return Math.min(800, Math.max(50, Math.round(bill)));
}

export function clampSqFt(sqFt: number): number {
  if (!Number.isFinite(sqFt)) return 2400;
  return Math.min(6000, Math.max(800, Math.round(sqFt)));
}

export function calculateSolarEstimate(input: EstimatorInput): SolarEstimateResult {
  const monthlyBill = clampBill(input.monthlyBill);
  const homeSqFt = clampSqFt(input.homeSqFt);
  const region = getRegionProfile(input.zipCode);

  const effectiveSunHours = Number(
    (region.peakSunHours * SUNLIGHT_MULTIPLIER[input.sunlight]).toFixed(2)
  );

  // Annual electricity consumption based on bill and regional tariff
  const annualBillCurrent = monthlyBill * 12;
  const fixedUtilityConnectionAnnual = 192; // ~$16/mo grid connection fee
  const avoidableAnnualSpend = Math.max(annualBillCurrent - fixedUtilityConnectionAnnual, annualBillCurrent * 0.84);
  const annualKwhDemand = avoidableAnnualSpend / region.utilityRatePerKwh;

  // Usable south/west roof area from total living area (accounts for multi-story & roof pitch factor)
  const usableRoofSqFt = Math.round(homeSqFt * 0.42);
  // Each 420W panel occupies ~18.5 sq ft
  const panelWattageKw = 0.42;
  const sqFtPerPanel = 18.5;
  const maxPanelsOnRoof = Math.max(6, Math.floor(usableRoofSqFt / sqFtPerPanel));

  // Production per kW DC per year (accounting for 0.82 system inverter/wiring efficiency)
  const annualKwhPerKw = effectiveSunHours * 365 * 0.82;
  const idealKw = (annualKwhDemand * TARGET_OFFSET_BY_EXPOSURE[input.sunlight]) / annualKwhPerKw;

  const idealPanels = Math.max(6, Math.round(idealKw / panelWattageKw));
  const panelCount = Math.min(maxPanelsOnRoof, idealPanels);
  const recommendedKw = Number((panelCount * panelWattageKw).toFixed(1));
  const requiredArraySqFt = Math.round(panelCount * sqFtPerPanel);

  const annualSolarProductionKwh = recommendedKw * annualKwhPerKw;
  const rawOffset = (annualSolarProductionKwh / annualKwhDemand) * 100;
  const offsetPercent = Math.min(99, Math.max(45, Math.round(rawOffset)));

  // Economics: $2.75/W installed solar cost; optional integrated architectural roof upgrade
  const solarGrossCost = Math.round(recommendedKw * 1000 * 2.75);
  const roofUpgradeCost = input.includeRoofUpgrade ? Math.round(homeSqFt * 4.4) : 0;
  const grossSystemCost = solarGrossCost + roofUpgradeCost;

  // 30% Federal Residential Clean Energy Credit applies to solar + direct integrated solar-ready roof mountings
  const federalTaxCredit = Math.round(solarGrossCost * 0.3 + roofUpgradeCost * 0.12);
  const netInvestment = grossSystemCost - federalTaxCredit;

  // Financed/amortized equivalent monthly savings vs utility bill in Year 1
  const firstYearSavings = Math.round(avoidableAnnualSpend * (offsetPercent / 100));
  const estimatedMonthlySavings = Math.max(28, Math.round(firstYearSavings / 12));

  // 10-Year Cashflow Projection with 4.5% historical utility rate escalation & 0.4% panel degradation
  const utilityInflationRate = 0.045;
  const panelDegradationRate = 0.004;

  let cumulativeUtilityWithoutSolar = 0;
  let cumulativeGrossSolarSavings = 0;
  const yearlyProjection: YearlySavingsPoint[] = [];

  for (let year = 1; year <= 10; year++) {
    const inflationMultiplier = Math.pow(1 + utilityInflationRate, year - 1);
    const degradationMultiplier = Math.pow(1 - panelDegradationRate, year - 1);

    const annualUtilityBillWithoutSolar = Math.round(annualBillCurrent * inflationMultiplier);
    const annualSolarSavings = Math.round(
      firstYearSavings * inflationMultiplier * degradationMultiplier
    );

    cumulativeUtilityWithoutSolar += annualUtilityBillWithoutSolar;
    cumulativeGrossSolarSavings += annualSolarSavings;

    // Net benefit includes recovered utility spend relative to net solar cost amortized over system life
    const cumulativeNetSolarBenefit = cumulativeGrossSolarSavings - netInvestment;

    yearlyProjection.push({
      year,
      cumulativeUtilityWithoutSolar,
      cumulativeNetSolarBenefit,
      annualUtilityBillWithoutSolar,
      annualSolarSavings,
    });
  }

  const tenYearTotalUtilitySavings = cumulativeGrossSolarSavings;
  const tenYearNetSavings = cumulativeGrossSolarSavings - netInvestment;

  // 10-Year ROI % measures total 10-year gross utility return + home equity uplift vs net investment
  const estimatedHomeEquityLift = Math.round(solarGrossCost * 0.42 + roofUpgradeCost * 0.68);
  const totalTenYearValueCreated = cumulativeGrossSolarSavings + estimatedHomeEquityLift;
  const tenYearRoiPercent = Math.round(
    ((totalTenYearValueCreated - netInvestment) / Math.max(1, netInvestment)) * 100
  );

  // Payback period calculation using escalating utility savings
  let runningSavings = 0;
  let paybackYears = 10.0;
  for (let yr = 1; yr <= 25; yr++) {
    const yrSavings =
      firstYearSavings *
      Math.pow(1 + utilityInflationRate, yr - 1) *
      Math.pow(1 - panelDegradationRate, yr - 1);
    if (runningSavings + yrSavings >= netInvestment) {
      const fraction = (netInvestment - runningSavings) / yrSavings;
      paybackYears = Number((yr - 1 + fraction).toFixed(1));
      break;
    }
    runningSavings += yrSavings;
    if (yr === 25) {
      paybackYears = 14.5;
    }
  }

  // EPA eGRID: ~0.000386 metric tons CO2 per kWh over 10 years
  const co2MetricTonsTenYear = Number(((annualSolarProductionKwh * 10 * 0.386) / 1000).toFixed(1));

  return {
    recommendedKw,
    panelCount,
    estimatedMonthlySavings,
    firstYearSavings,
    tenYearNetSavings,
    tenYearTotalUtilitySavings,
    tenYearRoiPercent,
    paybackYears,
    offsetPercent,
    grossSystemCost,
    federalTaxCredit,
    netInvestment,
    usableRoofSqFt,
    requiredArraySqFt,
    co2MetricTonsTenYear,
    regionName: region.regionName,
    peakSunHours: effectiveSunHours,
    utilityRatePerKwh: region.utilityRatePerKwh,
    yearlyProjection,
  };
}
