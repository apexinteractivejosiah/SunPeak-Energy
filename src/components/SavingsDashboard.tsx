import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  CalendarCheck,
  SlidersHorizontal,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import {
  EstimatorInput,
  SolarEstimateResult,
  SunlightExposure,
} from '../utils/solarEstimator';

export interface InspectionBooking {
  streetAddress: string;
  preferredDate: string;
  timeWindow: string;
  roofCondition: string;
  confirmationCode: string;
}

interface SavingsDashboardProps {
  input: EstimatorInput;
  estimate: SolarEstimateResult;
  booking: InspectionBooking | null;
  onToggleRoofUpgrade: (includeRoof: boolean) => void;
  onOpenBookingModal: () => void;
  onEditInputs: () => void;
}

function useAnimatedValue(target: number, decimals = 0, durationMs = 650): string {
  const [displayValue, setDisplayValue] = useState<number>(target);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(target);
      return;
    }

    let frameId = 0;
    const startValue = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (target - startValue) * eased;
      setDisplayValue(current);
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, durationMs]);

  return decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toLocaleString();
}

export const SavingsDashboard: React.FC<SavingsDashboardProps> = ({
  input,
  estimate,
  booking,
  onToggleRoofUpgrade,
  onOpenBookingModal,
  onEditInputs,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(10);

  const animatedMonthlySavings = useAnimatedValue(estimate.estimatedMonthlySavings, 0);
  const animatedTenYearRoi = useAnimatedValue(estimate.tenYearRoiPercent, 0);
  const animatedSystemKw = useAnimatedValue(estimate.recommendedKw, 1);
  const animatedTenYearUtilitySaved = useAnimatedValue(
    estimate.tenYearTotalUtilitySavings,
    0
  );

  const maxChartValue = Math.max(
    ...estimate.yearlyProjection.map((p) => p.cumulativeUtilityWithoutSolar),
    1
  );

  const activePoint =
    estimate.yearlyProjection.find((p) => p.year === selectedYear) ??
    estimate.yearlyProjection[estimate.yearlyProjection.length - 1];

  const sunlightLabel =
    input.sunlight === SunlightExposure.High
      ? 'High Exposure'
      : input.sunlight === SunlightExposure.Medium
        ? 'Medium Exposure'
        : 'Low Exposure';

  return (
    <section
      aria-label="Personalized Solar and Roof Savings Dashboard"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-11 space-y-7"
    >
      {/* Top Personalized Header & Primary Controls */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-800/90"
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-emerald-400 font-medium">
            <span>Personalized Engineering Estimate</span>
            <span aria-hidden="true">·</span>
            <span>ZIP {input.zipCode}</span>
            <span aria-hidden="true">·</span>
            <span>{estimate.regionName}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            {input.firstName}’s Solar &amp; Roof Savings Report
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Modeled for a {input.homeSqFt.toLocaleString()} sq ft home with a $
            {input.monthlyBill}/mo utility bill and {sunlightLabel.toLowerCase()} ({estimate.peakSunHours} peak sun hrs/day).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onEditInputs}
            className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-200 bg-[#0D1B2F] border border-slate-700/80 hover:border-slate-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span>Edit Estimator Inputs</span>
          </button>

          <button
            type="button"
            onClick={onOpenBookingModal}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
          >
            <CalendarCheck className="w-4 h-4" aria-hidden="true" />
            <span>{booking ? 'Manage Free Inspection' : 'Book Free Inspection'}</span>
          </button>
        </div>
      </motion.div>

      {/* Confirmed Inspection Banner (shown when homeowner books an inspection) */}
      {booking && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          role="status"
          className="bg-[#0D1B2F] border border-emerald-500/50 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <CheckCircle2
              className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <div className="text-base font-bold text-white">
                Free Roof &amp; Solar Inspection Confirmed · Ref #{booking.confirmationCode}
              </div>
              <p className="text-sm text-slate-300 mt-1">
                Scheduled for <span className="text-white font-medium">{booking.preferredDate}</span> · {booking.timeWindow} at{' '}
                <span className="text-white font-medium">{booking.streetAddress}, {input.zipCode}</span>. Confirmation sent to {input.email}.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenBookingModal}
            className="px-4 py-2 text-xs font-semibold text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/10 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
          >
            Reschedule Slot
          </button>
        </motion.div>
      )}

      {/* Package Scope Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-sm text-slate-300">
          Compare standalone rooftop solar against a bundled architectural roof + solar installation:
        </div>
        <div
          role="group"
          aria-label="Installation Scope"
          className="inline-flex items-center p-1 bg-[#0D1B2F] border border-slate-800 rounded-lg self-start"
        >
          <button
            type="button"
            onClick={() => onToggleRoofUpgrade(false)}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              !input.includeRoofUpgrade
                ? 'bg-emerald-400 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Solar Array Only
          </button>
          <button
            type="button"
            onClick={() => onToggleRoofUpgrade(true)}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              input.includeRoofUpgrade
                ? 'bg-emerald-400 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Solar + New Roof Bundle
          </button>
        </div>
      </div>

      {/* 3 Primary KPI Metric Cards (Single-Elevation Depth) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Estimated Monthly Savings */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.04 }}
          className="bg-[#0D1B2F] border border-slate-800/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-5"
        >
          <div>
            <div className="text-sm font-medium text-slate-300">
              Estimated Monthly Savings
            </div>
            <div
              data-testid="kpi-monthly-savings"
              className="font-mono tabular-nums text-4xl sm:text-5xl font-bold text-emerald-400 mt-3"
            >
              ${animatedMonthlySavings}
              <span className="text-lg font-normal text-slate-400">/mo</span>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <span>Year 1 Bill Reduction</span>
            <span className="font-mono tabular-nums font-semibold text-white">
              ${estimate.firstYearSavings.toLocaleString()}/yr ({estimate.offsetPercent}% offset)
            </span>
          </div>
        </motion.div>

        {/* Card 2: 10-Year ROI */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="bg-[#0D1B2F] border border-slate-800/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-5"
        >
          <div>
            <div className="text-sm font-medium text-slate-300">
              10-Year Return on Investment
            </div>
            <div
              data-testid="kpi-ten-year-roi"
              className="font-mono tabular-nums text-4xl sm:text-5xl font-bold text-white mt-3"
            >
              {animatedTenYearRoi}%
              <span className="text-lg font-normal text-emerald-400 ml-2">ROI</span>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <span>10-Yr Avoided Utility Cost</span>
            <span className="font-mono tabular-nums font-semibold text-emerald-400">
              ${animatedTenYearUtilitySaved}
            </span>
          </div>
        </motion.div>

        {/* Card 3: Recommended System Size in kW */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.16 }}
          className="bg-[#0D1B2F] border border-slate-800/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-5"
        >
          <div>
            <div className="text-sm font-medium text-slate-300">
              Recommended System Size
            </div>
            <div
              data-testid="kpi-system-size"
              className="font-mono tabular-nums text-4xl sm:text-5xl font-bold text-white mt-3"
            >
              {animatedSystemKw}
              <span className="text-xl font-normal text-emerald-400 ml-1.5">kW</span>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <span>420W Monocrystalline Array</span>
            <span className="font-mono tabular-nums font-semibold text-white">
              {estimate.panelCount} Panels · {estimate.requiredArraySqFt} sq ft
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main Analytical Grid: 10-Year Trajectory Chart + Financial Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 Cols: Interactive 10-Year Cumulative Utility vs Solar Savings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-7 bg-[#0D1B2F] border border-slate-800/90 rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-bold text-white">
                  10-Year Utility Spend vs. Cumulative Solar Savings
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select any year bar to inspect cumulative savings at 4.5% annual grid escalation.
                </p>
                <div className="flex flex-wrap items-center gap-5 mt-3 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-[2px] bg-slate-600 inline-block" aria-hidden="true" />
                    <span>Grid Utility Cost (No Solar)</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-[2px] bg-emerald-400 inline-block" aria-hidden="true" />
                    <span>Cumulative Solar Savings</span>
                  </span>
                </div>
              </div>
              <div className="font-mono tabular-nums text-xs text-slate-300 shrink-0">
                Year {activePoint.year}:{' '}
                <span className="text-emerald-400 font-semibold">
                  ${activePoint.annualSolarSavings.toLocaleString()}/yr saved
                </span>
              </div>
            </div>

            {/* Interactive 10-Bar Comparison Chart */}
            <div
              className="grid grid-cols-10 gap-2 sm:gap-3 items-end h-56 pt-6 pb-2 border-b border-slate-800"
              role="group"
              aria-label="10-Year Savings Bar Chart"
            >
              {estimate.yearlyProjection.map((point) => {
                const utilityHeightPct = Math.max(
                  12,
                  Math.round((point.cumulativeUtilityWithoutSolar / maxChartValue) * 100)
                );
                const cumulativeSolarSaved = Math.round(
                  point.cumulativeNetSolarBenefit + estimate.netInvestment
                );
                const solarHeightPct = Math.max(
                  10,
                  Math.round((cumulativeSolarSaved / maxChartValue) * 100)
                );
                const isSelected = point.year === selectedYear;

                return (
                  <button
                    key={point.year}
                    type="button"
                    onMouseEnter={() => setSelectedYear(point.year)}
                    onFocus={() => setSelectedYear(point.year)}
                    onClick={() => setSelectedYear(point.year)}
                    aria-label={`Year ${point.year}: $${cumulativeSolarSaved.toLocaleString()} cumulative solar savings`}
                    aria-pressed={isSelected}
                    className="h-full flex flex-col justify-end items-center gap-2 group cursor-pointer focus:outline-none"
                  >
                    <div className="w-full flex items-end justify-center gap-1 h-44">
                      {/* Utility Spend Bar */}
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.45, delay: point.year * 0.03 }}
                        style={{ height: `${utilityHeightPct}%`, transformOrigin: 'bottom' }}
                        className={`w-1/2 rounded-t-sm transition-colors ${
                          isSelected ? 'bg-slate-500' : 'bg-slate-700/70 group-hover:bg-slate-600'
                        }`}
                      />
                      {/* Cumulative Solar Avoided Cost Bar */}
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.45, delay: point.year * 0.03 + 0.05 }}
                        style={{ height: `${solarHeightPct}%`, transformOrigin: 'bottom' }}
                        className={`w-1/2 rounded-t-sm transition-colors ${
                          isSelected
                            ? 'bg-emerald-400'
                            : 'bg-emerald-500/75 group-hover:bg-emerald-400'
                        }`}
                      />
                    </div>
                    <span
                      className={`font-mono tabular-nums text-xs ${
                        isSelected ? 'text-emerald-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      Y{point.year}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Year Summary Strip */}
          <div className="pt-5 mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">
                Year {activePoint.year} Grid Cost (No Solar)
              </span>
              <span className="font-mono tabular-nums text-base font-semibold text-slate-200 mt-0.5 block">
                ${activePoint.cumulativeUtilityWithoutSolar.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">
                Year {activePoint.year} Cumulative Saved
              </span>
              <span className="font-mono tabular-nums text-base font-semibold text-emerald-400 mt-0.5 block">
                $
                {(
                  activePoint.cumulativeNetSolarBenefit + estimate.netInvestment
                ).toLocaleString()}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 block">Estimated Payback Milestone</span>
              <span className="font-mono tabular-nums text-base font-semibold text-white mt-0.5 block">
                {estimate.paybackYears} Years
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right 5 Cols: Investment, Federal Credit & Environmental Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.26 }}
          className="lg:col-span-5 bg-[#0D1B2F] border border-slate-800/90 rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              System Financial Summary
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              {input.includeRoofUpgrade
                ? 'Includes Class-4 architectural roof replacement + flush solar array.'
                : 'Includes turnkey 420W solar array, microinverters, and permitting.'}
            </p>

            <dl className="divide-y divide-slate-800/90 text-sm">
              <div className="py-3 flex items-center justify-between gap-4">
                <dt className="text-slate-300">Estimated Turnkey System Cost</dt>
                <dd className="font-mono tabular-nums font-medium text-slate-200">
                  ${estimate.grossSystemCost.toLocaleString()}
                </dd>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <dt className="text-emerald-400">30% Federal Clean Energy Credit</dt>
                <dd className="font-mono tabular-nums font-semibold text-emerald-400">
                  −${estimate.federalTaxCredit.toLocaleString()}
                </dd>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <dt className="font-semibold text-white">Net Investment After Tax Credit</dt>
                <dd className="font-mono tabular-nums font-bold text-white">
                  ${estimate.netInvestment.toLocaleString()}
                </dd>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <dt className="text-slate-300">Usable Roof Coverage</dt>
                <dd className="font-mono tabular-nums text-slate-200">
                  {estimate.requiredArraySqFt} / {estimate.usableRoofSqFt} sq ft
                </dd>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <dt className="text-slate-300">10-Year Carbon Reduction</dt>
                <dd className="font-mono tabular-nums text-slate-200">
                  {estimate.co2MetricTonsTenYear} Metric Tons CO₂
                </dd>
              </div>
            </dl>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-800/90 space-y-3">
            <button
              type="button"
              onClick={onOpenBookingModal}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              <span>Book Free Inspection</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <p className="text-xs text-slate-400 text-center">
              Includes drone roof structural scan, shade LiDAR verification, and locked utility rate proposal.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
