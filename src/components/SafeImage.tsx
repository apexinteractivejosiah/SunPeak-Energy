import React, { useState, useEffect } from 'react';
import { Sun } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

function normalizeSrc(path: string): string {
  if (path.startsWith('/src/assets/images/')) {
    const filename = path.split('/').pop();
    return `/images/${filename}`;
  }
  return path;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel = 'SunPeak Architectural Solar System',
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(() => normalizeSrc(src));
  const [hasError, setHasError] = useState(false);
  const [retried, setRetried] = useState(false);

  useEffect(() => {
    setCurrentSrc(normalizeSrc(src));
    setHasError(false);
    setRetried(false);
  }, [src]);

  const handleError = () => {
    // If original path had timestamp or specific subfolder, fallback to base public alias
    if (!retried) {
      setRetried(true);
      if (currentSrc.includes('hero_solar_home')) {
        setCurrentSrc('/images/hero_solar_home.jpg');
        return;
      }
      if (currentSrc.includes('bento_roof_integration')) {
        setCurrentSrc('/images/bento_roof_integration.jpg');
        return;
      }
      if (currentSrc.includes('case_study_austin')) {
        setCurrentSrc('/images/case_study_austin.jpg');
        return;
      }
      if (currentSrc.includes('case_study_denver')) {
        setCurrentSrc('/images/case_study_denver.jpg');
        return;
      }
    }
    setHasError(true);
  };

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0D1B2F] via-[#10243E] to-[#071120] text-slate-300 p-6 text-center ${className}`}
      >
        <Sun className="w-10 h-10 text-emerald-400 mb-3 opacity-80" aria-hidden="true" />
        <span className="text-sm font-medium text-slate-200">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={handleError}
      className={className}
    />
  );
};
