import React, { useMemo, useRef, useState } from 'react';
import { Navbar } from './components/Navbar';
import { EstimatorWizard } from './components/EstimatorWizard';
import { SavingsDashboard, InspectionBooking } from './components/SavingsDashboard';
import { BookingModal } from './components/BookingModal';
import { MarketingSections } from './components/MarketingSections';
import { SafeImage } from './components/SafeImage';
import {
  EstimatorInput,
  SunlightExposure,
  calculateSolarEstimate,
} from './utils/solarEstimator';

function getInitialAutostart(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('autostart') === '1';
}

export default function App() {
  const autostart = getInitialAutostart();

  const [estimatorInput, setEstimatorInput] = useState<EstimatorInput>(() => ({
    monthlyBill: 260,
    sunlight: SunlightExposure.High,
    homeSqFt: 2650,
    zipCode: autostart ? '85001' : '',
    firstName: autostart ? 'Jordan' : '',
    email: autostart ? 'jordan@sunpeak-demo.com' : '',
    includeRoofUpgrade: false,
  }));

  const [isReportUnlocked, setIsReportUnlocked] = useState<boolean>(autostart);
  const [wizardStartStep, setWizardStartStep] = useState<number>(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [booking, setBooking] = useState<InspectionBooking | null>(null);

  const estimatorSectionRef = useRef<HTMLElement | null>(null);

  const estimate = useMemo(
    () =>
      calculateSolarEstimate({
        ...estimatorInput,
        zipCode: estimatorInput.zipCode || '85001',
      }),
    [estimatorInput]
  );

  const handleUpdateInput = (updated: Partial<EstimatorInput>) => {
    setEstimatorInput((prev) => ({ ...prev, ...updated }));
  };

  const scrollToTopWorkspace = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUnlockReport = () => {
    setIsReportUnlocked(true);
    scrollToTopWorkspace();
  };

  const handleEditInputs = () => {
    setWizardStartStep(1);
    setIsReportUnlocked(false);
    scrollToTopWorkspace();
  };

  const handlePrimaryNavbarAction = () => {
    if (isReportUnlocked) {
      setIsBookingModalOpen(true);
    } else {
      estimatorSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateEstimator = () => {
    if (isReportUnlocked) {
      scrollToTopWorkspace();
    } else {
      estimatorSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#071120] text-slate-100">
      <Navbar
        isReportUnlocked={isReportUnlocked}
        hasBookedInspection={Boolean(booking)}
        onPrimaryAction={handlePrimaryNavbarAction}
        onNavigateEstimator={handleNavigateEstimator}
      />

      <main className="flex-1">
        {isReportUnlocked ? (
          <SavingsDashboard
            input={estimatorInput}
            estimate={estimate}
            booking={booking}
            onToggleRoofUpgrade={(includeRoofUpgrade) =>
              handleUpdateInput({ includeRoofUpgrade })
            }
            onOpenBookingModal={() => setIsBookingModalOpen(true)}
            onEditInputs={handleEditInputs}
          />
        ) : (
          <section
            id="estimator"
            ref={estimatorSectionRef}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 lg:py-16 scroll-mt-20"
          >
            {/* 2-Column Hero & Interactive 4-Step Estimator Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
              {/* Left 6 Cols on Desktop: Proposition Copy (Order 1 on Mobile) */}
              <div className="order-1 lg:col-span-6 flex flex-col justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-emerald-400">
                    <span>NABCEP Certified Engineering</span>
                    <span aria-hidden="true">·</span>
                    <span>Solar &amp; Architectural Roofing</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.12]">
                    Calculate your solar and roof savings in 30 seconds.
                  </h1>

                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                    Replace unpredictable utility rate hikes with flush-mounted monocrystalline solar engineered directly into a weatherproof 25-year roof system.
                  </p>
                </div>

                {/* Desktop Architectural Residence Visual (Hidden on <lg so mobile leads with Estimator, rendered below Estimator on mobile) */}
                <div className="hidden lg:block relative rounded-2xl overflow-hidden border border-slate-800/90 flex-1 min-h-[300px]">
                  <SafeImage
                    src="/images/hero_solar_home.jpg"
                    alt="Modern residence at twilight with sleek flush-mounted black monocrystalline solar roof tiles"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071120]/95 via-[#071120]/60 to-transparent flex items-end p-6">
                    <div className="w-full flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <div className="text-xs text-slate-300">
                          Live Preview Estimate (${estimatorInput.monthlyBill}/mo bill)
                        </div>
                        <div className="font-mono tabular-nums text-2xl font-bold text-white mt-0.5">
                          ~${estimate.estimatedMonthlySavings}/mo est. savings · {estimate.recommendedKw} kW
                        </div>
                      </div>
                      <div className="text-xs text-emerald-300 font-mono tabular-nums">
                        {estimate.tenYearRoiPercent}% 10-Yr ROI
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 6 Cols on Desktop / Order 2 on Mobile: Interactive 4-Step Estimator */}
              <div className="order-2 lg:col-span-6 flex items-stretch">
                <div className="w-full flex items-stretch [&>*]:w-full">
                  <EstimatorWizard
                    key={wizardStartStep}
                    values={estimatorInput}
                    onChange={handleUpdateInput}
                    onSubmitReport={handleUnlockReport}
                    initialStep={wizardStartStep}
                  />
                </div>
              </div>

              {/* Mobile Architectural Residence Visual (Order 3 on <lg) */}
              <div className="order-3 lg:hidden relative rounded-2xl overflow-hidden border border-slate-800/90 aspect-[16/10]">
                <SafeImage
                  src="/images/hero_solar_home.jpg"
                  alt="Modern residence at twilight with sleek flush-mounted black monocrystalline solar roof tiles"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071120]/95 via-[#071120]/70 to-transparent flex items-end p-5">
                  <div className="w-full flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <div className="text-xs text-slate-300">
                        Live Preview (${estimatorInput.monthlyBill}/mo bill)
                      </div>
                      <div className="font-mono tabular-nums text-lg font-bold text-white mt-0.5">
                        ~${estimate.estimatedMonthlySavings}/mo · {estimate.recommendedKw} kW
                      </div>
                    </div>
                    <div className="text-xs text-emerald-300 font-mono tabular-nums whitespace-nowrap">
                      {estimate.tenYearRoiPercent}% 10-Yr ROI
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Supporting Engineering, Quantified Case Studies, and Process Sections */}
        <MarketingSections
          onScrollToEstimator={() => {
            if (isReportUnlocked) {
              handleEditInputs();
            } else {
              estimatorSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-800/80 bg-[#050C17] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-slate-400">
          <div className="space-y-1">
            <div className="font-display text-sm font-bold text-white">
              SunPeak Energy
            </div>
            <p>
              Licensed Residential Solar &amp; Roofing Contractor · NABCEP Certified · © {new Date().getFullYear()} SunPeak Energy Inc.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#estimator" onClick={(e) => { e.preventDefault(); handleNavigateEstimator(); }} className="hover:text-white transition-colors">
              Savings Estimator
            </a>
            <a href="#engineering" className="hover:text-white transition-colors">
              Roof Engineering
            </a>
            <a href="#case-studies" className="hover:text-white transition-colors">
              Case Studies
            </a>
            <a href="#process" className="hover:text-white transition-colors">
              Inspection Process
            </a>
          </div>
        </div>
      </footer>

      {/* Free Inspection Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        input={estimatorInput}
        estimate={estimate}
        existingBooking={booking}
        onConfirmBooking={(confirmed) => setBooking(confirmed)}
      />
    </div>
  );
}
