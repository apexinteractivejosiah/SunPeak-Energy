import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface MarketingSectionsProps {
  onScrollToEstimator: () => void;
}

export const MarketingSections: React.FC<MarketingSectionsProps> = ({
  onScrollToEstimator,
}) => {
  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* Full-Width 4-Column Quantitative Proof Strip Below Hero */}
      <section
        aria-label="Verified Installation Metrics"
        className="border-y border-slate-800/80 bg-[#0A1628]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:divide-x lg:divide-slate-800/80">
            <div className="lg:pr-6">
              <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-white">
                14,800+
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Residential roofs &amp; solar arrays commissioned since 2018
              </p>
            </div>
            <div className="lg:px-6">
              <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-emerald-400">
                94.2%
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Average Year-1 annual utility kWh bill offset across sunbelt states
              </p>
            </div>
            <div className="lg:px-6">
              <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-white">
                25 Years
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Single-source roof watertightness &amp; panel output guarantee
              </p>
            </div>
            <div className="lg:pl-6">
              <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-white">
                $0 Down
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                30% Federal Residential Clean Energy Credit guidance included
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities / Integrated Roof & Solar Engineering (Asymmetric Bento) */}
      <section
        id="engineering"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="max-w-2xl mb-10">
          <p className="text-sm font-medium text-emerald-400 mb-2">
            Integrated Roof &amp; Solar Architecture
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            One engineering team for your roof deck, flashing, and solar array.
          </h2>
          <p className="text-base text-slate-300 mt-3 leading-relaxed">
            Most solar contractors bolt racks onto aging shingles, voiding roof warranties. SunPeak inspects, reinforces, and waterproofs your roof before a single panel is mounted.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Marquee 2-column Bento Card */}
          <div className="lg:col-span-2 bg-[#0D1B2F] border border-slate-800/90 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div>
                <span className="font-mono tabular-nums text-xs text-emerald-400">
                  01. Structural Waterproofing
                </span>
                <h3 className="text-xl font-bold text-white mt-2">
                  Flush-Mounted Triple-Seal Flashing
                </h3>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  Anodized matte-blackskirts and lag-sealed deck mounts rated for 140 mph wind uplift and Class-4 hail impact, eliminating exposed conduit across your roofline.
                </p>
              </div>
              <div className="text-xs text-slate-400">
                UL 2703 Listed · Miami-Dade Wind Rated · Zero Visible Conduit
              </div>
            </div>
            <div className="min-h-[240px] h-full">
              <SafeImage
                src="/images/bento_roof_integration.jpg"
                alt="Close-up of flush-mounted matte black solar panels integrated into architectural shingles"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 1-Column Capability Card */}
          <div className="bg-[#0D1B2F] border border-slate-800/90 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div>
              <span className="font-mono tabular-nums text-xs text-emerald-400">
                02. Panel-Level Microinverters
              </span>
              <h3 className="text-xl font-bold text-white mt-2">
                Independent Shade Optimization
              </h3>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                Every 420W N-type monocrystalline module converts DC to AC right at the panel, preventing a single shaded chimney leaf from bottlenecking roof-wide harvest.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Module Efficiency</span>
              <span className="font-mono tabular-nums text-lg font-bold text-white">
                22.4% N-Type
              </span>
            </div>
          </div>

          {/* Row 2: 1-Column + 2-Column Asymmetric Pair */}
          <div className="bg-[#0D1B2F] border border-slate-800/90 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div>
              <span className="font-mono tabular-nums text-xs text-emerald-400">
                03. LiDAR Aerial Modeling
              </span>
              <h3 className="text-xl font-bold text-white mt-2">
                365-Day Horizon Shade Simulation
              </h3>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                We map surrounding tree lines, roof azimuths, and local NREL weather stations to guarantee Year-1 kilowatt-hour output in writing.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Production Guarantee</span>
              <span className="font-mono tabular-nums text-lg font-bold text-emerald-400">
                95% Accuracy
              </span>
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#0D1B2F] border border-slate-800/90 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="font-mono tabular-nums text-xs text-emerald-400">
                04. Bundled Roof + Solar Tax Advantage
              </span>
              <h3 className="text-xl font-bold text-white mt-2">
                Synchronize Roof Replacement With Your Solar Array
              </h3>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                If your shingles are over 12 years old, bundling re-roofing with solar avoids $3,800+ in future panel removal and re-installation labor while unifying both warranties under SunPeak Energy.
              </p>
            </div>
            <button
              type="button"
              onClick={onScrollToEstimator}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
            >
              <span>Model My Roof</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Proof of Impact / Quantified Homeowner Case Studies */}
      <section
        id="case-studies"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-emerald-400 mb-2">
              Verified Homeowner Outcomes
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Measured utility bill reductions across real roofs.
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Metered 12-month post-interconnection utility statements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Case Study 1 */}
          <article className="bg-[#0D1B2F] border border-slate-800/90 rounded-2xl overflow-hidden flex flex-col">
            <div className="aspect-[16/10] w-full overflow-hidden">
              <SafeImage
                src="/images/case_study_austin.jpg"
                alt="Modern residence in Austin Texas with 10.9 kW flush black solar array"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-6">
              <div>
                <div className="text-xs text-slate-400 mb-2">
                  Austin, TX (ZIP 78746) · 3,150 sq ft · High Exposure
                </div>
                <h3 className="text-xl font-bold text-white">
                  10.9 kW Solar Array + Architectural Shingle Upgrade
                </h3>
                <blockquote className="text-sm text-slate-300 mt-3 leading-relaxed">
                  “Our summer electric bill peaked at $390 in August before switching. SunPeak replaced our 16-year-old hail-worn shingles and commissioned 26 black panels in four days. Our last 12 utility bills averaged $21 a month.”
                </blockquote>
                <div className="text-xs text-slate-400 mt-3 font-medium">
                  Marcus &amp; Elena Vance — Homeowners, Westlake Hills
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4">
                <div>
                  <span className="block text-xs text-slate-400">Monthly Bill</span>
                  <span className="font-mono tabular-nums text-sm sm:text-base font-bold text-emerald-400">
                    $340 → $21
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400">10-Yr Net Saved</span>
                  <span className="font-mono tabular-nums text-sm sm:text-base font-bold text-white">
                    $44,820
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400">Payback</span>
                  <span className="font-mono tabular-nums text-sm sm:text-base font-bold text-white">
                    5.8 Years
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* Case Study 2 */}
          <article className="bg-[#0D1B2F] border border-slate-800/90 rounded-2xl overflow-hidden flex flex-col">
            <div className="aspect-[16/10] w-full overflow-hidden">
              <SafeImage
                src="/images/case_study_denver.jpg"
                alt="Contemporary craftsman gable home in Denver Colorado with standing-seam solar array"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-6">
              <div>
                <div className="text-xs text-slate-400 mb-2">
                  Denver, CO (ZIP 80209) · 2,480 sq ft · High Exposure
                </div>
                <h3 className="text-xl font-bold text-white">
                  8.4 kW Standing-Seam Clamp Mount Array
                </h3>
                <blockquote className="text-sm text-slate-300 mt-3 leading-relaxed">
                  “We wanted zero roof penetrations on our standing-seam metal gable roof. SunPeak’s engineering crew used non-penetrating seam clamps and delivered 96% annual net-metering offset including our EV charger load.”
                </blockquote>
                <div className="text-xs text-slate-400 mt-3 font-medium">
                  David Chen, PE — Structural Engineer &amp; Homeowner, Wash Park
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4">
                <div>
                  <span className="block text-xs text-slate-400">Monthly Bill</span>
                  <span className="font-mono tabular-nums text-sm sm:text-base font-bold text-emerald-400">
                    $255 → $16
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400">10-Yr Net Saved</span>
                  <span className="font-mono tabular-nums text-sm sm:text-base font-bold text-white">
                    $33,940
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400">Payback</span>
                  <span className="font-mono tabular-nums text-sm sm:text-base font-bold text-white">
                    6.2 Years
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Process Section */}
      <section
        id="process"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="bg-[#0D1B2F] border border-slate-800/90 rounded-2xl p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-800/80">
            <div>
              <p className="text-sm font-medium text-emerald-400 mb-2">
                From Estimate to Permission to Operate
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                How SunPeak takes you off escalating utility rates.
              </h2>
            </div>
            <button
              type="button"
              onClick={onScrollToEstimator}
              className="px-5 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start lg:self-auto"
            >
              Run 30-Second Estimator
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 md:divide-x md:divide-slate-800/80">
            <div className="md:pr-6">
              <div className="font-mono tabular-nums text-sm font-semibold text-emerald-400">
                01. Instant Online Estimate
              </div>
              <h3 className="text-lg font-bold text-white mt-2">
                Model System Size &amp; 10-Year ROI
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Enter your monthly electric bill, sun exposure, and square footage above to see realistic kW sizing and federal tax credit math immediately.
              </p>
            </div>

            <div className="md:px-6">
              <div className="font-mono tabular-nums text-sm font-semibold text-emerald-400">
                02. Free Drone &amp; Attic Inspection
              </div>
              <h3 className="text-lg font-bold text-white mt-2">
                Verify Structural &amp; Shade Engineering
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                A NABCEP-certified SunPeak specialist inspects rafter spacing, shingle life, and main panel busbar rating in a 45-minute on-site visit.
              </p>
            </div>

            <div className="md:pl-6">
              <div className="font-mono tabular-nums text-sm font-semibold text-emerald-400">
                03. 2-Day Turnkey Installation
              </div>
              <h3 className="text-lg font-bold text-white mt-2">
                Permitting, Mounting &amp; Utility Activation
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                We handle HOA packages, city structural permits, installation, and net-metering interconnection so you start banking solar credits.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
