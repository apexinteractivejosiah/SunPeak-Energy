import React, { useState } from 'react';
import {
  CloudSun,
  SunMedium,
  Sun,
  ArrowRight,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import {
  EstimatorInput,
  SunlightExposure,
  LeadValidationErrors,
  validateLeadStep,
  hasValidationErrors,
  clampBill,
  clampSqFt,
} from '../utils/solarEstimator';

interface EstimatorWizardProps {
  values: EstimatorInput;
  onChange: (updated: Partial<EstimatorInput>) => void;
  onSubmitReport: () => void;
  initialStep?: number;
}

const BILL_PRESETS = [120, 220, 350, 550];
const SQFT_PRESETS = [1600, 2400, 3200, 4500];

const SUNLIGHT_OPTIONS: Array<{
  value: SunlightExposure;
  label: string;
  hours: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    value: SunlightExposure.Low,
    label: 'Low',
    hours: '3.5 – 4.2 Peak Hrs',
    description: 'Partial tree canopy or north/east roof planes.',
    Icon: CloudSun,
  },
  {
    value: SunlightExposure.Medium,
    label: 'Medium',
    hours: '4.5 – 5.2 Peak Hrs',
    description: 'Mostly clear sky with light morning or late shade.',
    Icon: SunMedium,
  },
  {
    value: SunlightExposure.High,
    label: 'High',
    hours: '5.5+ Peak Hrs',
    description: 'Unobstructed south or west-facing roof exposure.',
    Icon: Sun,
  },
];

export const EstimatorWizard: React.FC<EstimatorWizardProps> = ({
  values,
  onChange,
  onSubmitReport,
  initialStep = 1,
}) => {
  const [step, setStep] = useState<number>(initialStep);
  const [errors, setErrors] = useState<LeadValidationErrors>({});

  const billPercentage = ((values.monthlyBill - 50) / (800 - 50)) * 100;
  const sqFtPercentage = ((values.homeSqFt - 800) / (6000 - 800)) * 100;

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLeadStep({
      zipCode: values.zipCode,
      firstName: values.firstName,
      email: values.email,
    });
    setErrors(validation);
    if (!hasValidationErrors(validation)) {
      onSubmitReport();
    }
  };

  const stepTitles = [
    'Monthly Electric Bill',
    'Roof Sunlight Exposure',
    'Home Square Footage',
    'Unlock Savings Report',
  ];

  return (
    <div className="bg-[#0D1B2F] border border-slate-800/90 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
      {/* Top Progress Header */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-xs sm:text-sm font-medium text-emerald-400 truncate">
            Step {step} of 4 · {stepTitles[step - 1]}
          </span>
          <span className="font-mono tabular-nums text-xs text-slate-400 whitespace-nowrap shrink-0">
            {step * 25}% Complete
          </span>
        </div>

        {/* 4-segment interactive progress bar */}
        <div
          className="grid grid-cols-4 gap-2 mb-7"
          role="group"
          aria-label="Estimator Steps"
        >
          {[1, 2, 3, 4].map((idx) => {
            const isActive = idx === step;
            const isCompleted = idx < step;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (idx <= step) setStep(idx);
                }}
                disabled={idx > step}
                aria-label={`Go to Step ${idx}: ${stepTitles[idx - 1]}`}
                aria-current={isActive ? 'step' : undefined}
                className={`h-2 rounded-sm transition-colors duration-150 ${
                  isActive
                    ? 'bg-emerald-400 cursor-pointer'
                    : isCompleted
                      ? 'bg-emerald-500/60 hover:bg-emerald-400 cursor-pointer'
                      : 'bg-slate-800 cursor-default'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleFinalSubmit} noValidate className="flex-1 flex flex-col justify-between">
        {/* STEP 1: Monthly Electric Bill ($50 to $800 slider) */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                What is your average monthly electric bill?
              </h2>
              <p className="text-sm text-slate-300 mt-1.5">
                Slide between $50 and $800 to model your household kilowatt-hour demand.
              </p>
            </div>

            <div className="py-4 border-y border-slate-800/80">
              <div className="flex items-baseline justify-between gap-4 mb-5">
                <label
                  htmlFor="monthly-bill-slider"
                  className="text-sm font-medium text-slate-300"
                >
                  Average Monthly Utility Spend
                </label>
                <output
                  htmlFor="monthly-bill-slider"
                  className="font-mono tabular-nums text-3xl sm:text-4xl font-bold text-emerald-400"
                >
                  ${values.monthlyBill}
                  <span className="text-base font-normal text-slate-400">/mo</span>
                </output>
              </div>

              <input
                id="monthly-bill-slider"
                type="range"
                min={50}
                max={800}
                step={5}
                value={values.monthlyBill}
                onChange={(e) =>
                  onChange({ monthlyBill: clampBill(Number(e.target.value)) })
                }
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${billPercentage}%, #1e293b ${billPercentage}%, #1e293b 100%)`,
                }}
                className="w-full sunpeak-slider"
              />

              <div className="flex justify-between font-mono tabular-nums text-xs text-slate-400 mt-2.5">
                <span>$50/mo</span>
                <span>$425/mo</span>
                <span>$800/mo</span>
              </div>
            </div>

            <div>
              <span className="block text-xs text-slate-400 mb-2.5">
                Quick-select typical bill amount:
              </span>
              <div className="grid grid-cols-4 gap-2.5">
                {BILL_PRESETS.map((preset) => {
                  const selected = values.monthlyBill === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => onChange({ monthlyBill: preset })}
                      className={`py-2.5 px-3 rounded-lg font-mono tabular-nums text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        selected
                          ? 'bg-emerald-400 text-slate-950 font-semibold'
                          : 'bg-[#11223B] text-slate-200 hover:bg-slate-800 border border-slate-700/70'
                      }`}
                    >
                      ${preset}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Current 10-year utility trajectory (at 4.5% inflation)</span>
              <span className="font-mono tabular-nums text-slate-200 font-semibold">
                ${Math.round(values.monthlyBill * 12 * 12.288).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: Roof Sunlight Exposure (Low, Medium, High buttons with icons) */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                How much direct sunlight reaches your roof?
              </h2>
              <p className="text-sm text-slate-300 mt-1.5">
                Select your roof’s typical daytime sun exposure to calibrate panel yield.
              </p>
            </div>

            <div
              role="radiogroup"
              aria-label="Roof Sunlight Exposure"
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {SUNLIGHT_OPTIONS.map(({ value, label, hours, description, Icon }) => {
                const isSelected = values.sunlight === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onChange({ sunlight: value })}
                    className={`text-left p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between gap-4 cursor-pointer min-h-[148px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-400 text-white'
                        : 'bg-[#11223B]/80 border-slate-800 text-slate-200 hover:border-slate-600 hover:bg-[#11223B]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Icon
                        className={`w-7 h-7 shrink-0 ${
                          isSelected ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      />
                      <span className="font-mono tabular-nums text-xs text-slate-400">
                        {hours}
                      </span>
                    </div>
                    <div>
                      <div className="font-display text-base font-bold text-white">
                        {label} Exposure
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-400">
              Unsure about tree shade? Our engineering team verifies exact LiDAR sun-hours during your free roof inspection.
            </p>
          </div>
        )}

        {/* STEP 3: Home Square Footage */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                What is your home’s approximate square footage?
              </h2>
              <p className="text-sm text-slate-300 mt-1.5">
                Used to estimate usable south and west roof area for flush-mounted panels.
              </p>
            </div>

            <div className="py-4 border-y border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="home-sqft-slider"
                  className="text-sm font-medium text-slate-300"
                >
                  Living Area (Sq Ft)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="home-sqft-input"
                    aria-label="Home Square Footage Number Input"
                    type="number"
                    min={800}
                    max={6000}
                    step={50}
                    value={values.homeSqFt}
                    onChange={(e) => {
                      const parsed = Number(e.target.value);
                      if (!Number.isNaN(parsed)) {
                        onChange({ homeSqFt: Math.max(0, Math.min(9999, Math.round(parsed))) });
                      }
                    }}
                    onBlur={() =>
                      onChange({ homeSqFt: clampSqFt(values.homeSqFt) })
                    }
                    className="w-28 px-3 py-1.5 rounded-lg bg-[#071120] border border-slate-700 font-mono tabular-nums text-right text-lg font-bold text-emerald-400 focus:border-emerald-400 focus:outline-none"
                  />
                  <span className="text-sm text-slate-400 font-mono">sq ft</span>
                </div>
              </div>

              <input
                id="home-sqft-slider"
                type="range"
                min={800}
                max={6000}
                step={50}
                value={clampSqFt(values.homeSqFt)}
                onChange={(e) =>
                  onChange({ homeSqFt: clampSqFt(Number(e.target.value)) })
                }
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${sqFtPercentage}%, #1e293b ${sqFtPercentage}%, #1e293b 100%)`,
                }}
                className="w-full sunpeak-slider"
              />

              <div className="flex justify-between font-mono tabular-nums text-xs text-slate-400">
                <span>800 sq ft</span>
                <span>3,400 sq ft</span>
                <span>6,000 sq ft</span>
              </div>
            </div>

            <div>
              <span className="block text-xs text-slate-400 mb-2.5">
                Common home sizes:
              </span>
              <div className="grid grid-cols-4 gap-2.5">
                {SQFT_PRESETS.map((preset) => {
                  const selected = values.homeSqFt === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => onChange({ homeSqFt: preset })}
                      className={`py-2.5 px-2 rounded-lg font-mono tabular-nums text-xs sm:text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        selected
                          ? 'bg-emerald-400 text-slate-950 font-semibold'
                          : 'bg-[#11223B] text-slate-200 hover:bg-slate-800 border border-slate-700/70'
                      }`}
                    >
                      {preset.toLocaleString()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Estimated usable solar roof area</span>
              <span className="font-mono tabular-nums text-slate-200 font-semibold">
                ~{Math.round(clampSqFt(values.homeSqFt) * 0.42).toLocaleString()} sq ft
              </span>
            </div>
          </div>
        )}

        {/* STEP 4: Zip Code & First Name / Email input to unlock report */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Where should we localize your solar report?
              </h2>
              <p className="text-sm text-slate-300 mt-1.5">
                Enter your zip code and contact details to unlock your instant savings dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="lead-zip"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  Property Zip Code
                </label>
                <input
                  id="lead-zip"
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="85001"
                  value={values.zipCode}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 5);
                    onChange({ zipCode: digitsOnly });
                    if (errors.zipCode) setErrors((prev) => ({ ...prev, zipCode: undefined }));
                  }}
                  aria-invalid={Boolean(errors.zipCode)}
                  aria-describedby={errors.zipCode ? 'lead-zip-error' : undefined}
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-[#071120] border font-mono tabular-nums text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                    errors.zipCode
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-slate-700 focus:border-emerald-400'
                  }`}
                />
                {errors.zipCode && (
                  <p
                    id="lead-zip-error"
                    role="alert"
                    className="text-xs text-red-400 mt-1.5"
                  >
                    {errors.zipCode}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lead-first-name"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  First Name
                </label>
                <input
                  id="lead-first-name"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Jordan"
                  value={values.firstName}
                  onChange={(e) => {
                    onChange({ firstName: e.target.value });
                    if (errors.firstName)
                      setErrors((prev) => ({ ...prev, firstName: undefined }));
                  }}
                  aria-invalid={Boolean(errors.firstName)}
                  aria-describedby={errors.firstName ? 'lead-name-error' : undefined}
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-[#071120] border text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                    errors.firstName
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-slate-700 focus:border-emerald-400'
                  }`}
                />
                {errors.firstName && (
                  <p
                    id="lead-name-error"
                    role="alert"
                    className="text-xs text-red-400 mt-1.5"
                  >
                    {errors.firstName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="lead-email"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="lead-email"
                type="email"
                autoComplete="email"
                placeholder="jordan@homeowner.com"
                value={values.email}
                onChange={(e) => {
                  onChange({ email: e.target.value });
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'lead-email-error' : undefined}
                className={`w-full px-3.5 py-2.5 rounded-lg bg-[#071120] border text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                  errors.email
                    ? 'border-red-400 focus:border-red-400'
                    : 'border-slate-700 focus:border-emerald-400'
                }`}
              />
              {errors.email && (
                <p
                  id="lead-email-error"
                  role="alert"
                  className="text-xs text-red-400 mt-1.5"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>
                Instant online report · Zero automated robo-calls · 30% Federal Tax Credit included
              </span>
            </div>
          </div>
        )}

        {/* Footer Action Controls */}
        <div className="flex items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-800/80">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/70 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Previous</span>
            </button>
          ) : (
            <span className="text-xs text-slate-400">
              Takes under 30 seconds
            </span>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              <span>Unlock Savings Report</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
