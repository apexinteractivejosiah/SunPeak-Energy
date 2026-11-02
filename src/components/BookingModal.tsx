import React, { useEffect, useRef, useState } from 'react';
import { X, CalendarCheck } from 'lucide-react';
import { EstimatorInput, SolarEstimateResult } from '../utils/solarEstimator';
import { InspectionBooking } from './SavingsDashboard';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  input: EstimatorInput;
  estimate: SolarEstimateResult;
  existingBooking: InspectionBooking | null;
  onConfirmBooking: (booking: InspectionBooking) => void;
}

const TIME_WINDOWS = [
  'Morning (8:00 AM – 11:00 AM)',
  'Midday (11:00 AM – 2:00 PM)',
  'Afternoon (2:00 PM – 5:00 PM)',
];

const ROOF_CONDITIONS = [
  'Good condition (Under 10 years old)',
  'Mid-life shingles (10 – 18 years old)',
  'Aging roof — quote roof + solar bundle',
];

function getUpcomingBusinessDates(): string[] {
  const dates: string[] = [];
  const cursor = new Date();
  while (dates.length < 4) {
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();
    if (day !== 0) {
      dates.push(
        cursor.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      );
    }
  }
  return dates;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  input,
  estimate,
  existingBooking,
  onConfirmBooking,
}) => {
  const availableDates = getUpcomingBusinessDates();
  const [streetAddress, setStreetAddress] = useState<string>(
    existingBooking?.streetAddress ?? ''
  );
  const [preferredDate, setPreferredDate] = useState<string>(
    existingBooking?.preferredDate ?? availableDates[0]
  );
  const [timeWindow, setTimeWindow] = useState<string>(
    existingBooking?.timeWindow ?? TIME_WINDOWS[0]
  );
  const [roofCondition, setRoofCondition] = useState<string>(
    existingBooking?.roofCondition ?? ROOF_CONDITIONS[0]
  );
  const [addressError, setAddressError] = useState<string>('');
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (streetAddress.trim().length < 5) {
      setAddressError('Enter your street address so our roof engineer can prepare aerial imagery.');
      return;
    }

    const code = existingBooking?.confirmationCode ?? `SP-${input.zipCode.slice(0, 3)}${Math.round(estimate.recommendedKw * 10)}`;
    onConfirmBooking({
      streetAddress: streetAddress.trim(),
      preferredDate,
      timeWindow,
      roofCondition,
      confirmationCode: code,
    });
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="booking-modal-title"
      className="backdrop:bg-slate-950/80 backdrop:backdrop-blur-xs bg-transparent p-4 w-full max-w-xl m-auto open:flex items-center justify-center"
    >
      <div className="w-full bg-[#0D1B2F] border border-slate-700/90 rounded-2xl p-6 sm:p-8 text-slate-100 shadow-2xl">
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <h2 id="booking-modal-title" className="text-xl sm:text-2xl font-bold text-white">
              Book Your Free Roof &amp; Solar Inspection
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Pre-configured for {input.firstName || 'Homeowner'} · {estimate.recommendedKw} kW system · ZIP {input.zipCode || '85001'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close inspection booking modal"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5 mt-6">
          <div>
            <label
              htmlFor="inspection-street"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              Property Street Address
            </label>
            <input
              id="inspection-street"
              type="text"
              placeholder="742 Evergreen Terrace"
              value={streetAddress}
              onChange={(e) => {
                setStreetAddress(e.target.value);
                if (addressError) setAddressError('');
              }}
              aria-invalid={Boolean(addressError)}
              className={`w-full px-3.5 py-2.5 rounded-lg bg-[#071120] border text-sm text-white placeholder:text-slate-500 focus:outline-none ${
                addressError
                  ? 'border-red-400 focus:border-red-400'
                  : 'border-slate-700 focus:border-emerald-400'
              }`}
            />
            {addressError && (
              <p role="alert" className="text-xs text-red-400 mt-1.5">
                {addressError}
              </p>
            )}
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-300 mb-2">
              Preferred Inspection Date
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availableDates.map((dateStr) => {
                const selected = preferredDate === dateStr;
                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setPreferredDate(dateStr)}
                    className={`py-2.5 px-3 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selected
                        ? 'bg-emerald-400 text-slate-950 font-semibold'
                        : 'bg-[#071120] text-slate-200 border border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {dateStr}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="inspection-window"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Arrival Window
              </label>
              <select
                id="inspection-window"
                value={timeWindow}
                onChange={(e) => setTimeWindow(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#071120] border border-slate-700 text-sm text-white focus:border-emerald-400 focus:outline-none"
              >
                {TIME_WINDOWS.map((win) => (
                  <option key={win} value={win}>
                    {win}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="inspection-roof-age"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Current Roof Status
              </label>
              <select
                id="inspection-roof-age"
                value={roofCondition}
                onChange={(e) => setRoofCondition(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#071120] border border-slate-700 text-sm text-white focus:border-emerald-400 focus:outline-none"
              >
                {ROOF_CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" aria-hidden="true" />
              <span>Confirm Free Inspection</span>
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
