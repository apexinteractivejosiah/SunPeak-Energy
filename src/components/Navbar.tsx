import React from 'react';

interface NavbarProps {
  isReportUnlocked: boolean;
  hasBookedInspection: boolean;
  onPrimaryAction: () => void;
  onNavigateEstimator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isReportUnlocked,
  hasBookedInspection,
  onPrimaryAction,
  onNavigateEstimator,
}) => {
  return (
    <header className="sticky top-0 z-40 h-16 bg-[#071120]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onNavigateEstimator();
          }}
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
        >
          SunPeak Energy
        </a>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
        >
          <a
            href="#estimator"
            onClick={(e) => {
              e.preventDefault();
              onNavigateEstimator();
            }}
            className="hover:text-white hover:underline underline-offset-8 decoration-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Estimator
          </a>
          <a
            href="#engineering"
            className="hover:text-white hover:underline underline-offset-8 decoration-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Engineering
          </a>
          <a
            href="#case-studies"
            className="hover:text-white hover:underline underline-offset-8 decoration-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Case Studies
          </a>
          <a
            href="#process"
            className="hover:text-white hover:underline underline-offset-8 decoration-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Process
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onPrimaryAction}
            className="px-4 py-2.5 text-sm font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 active:scale-[0.99] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
          >
            {hasBookedInspection
              ? 'View Inspection'
              : isReportUnlocked
                ? 'Book Free Inspection'
                : 'Calculate Savings'}
          </button>
        </div>
      </div>
    </header>
  );
};
