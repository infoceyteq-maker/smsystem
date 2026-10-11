import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface SchoolLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showLabel?: boolean;
  showMotto?: boolean;
  className?: string;
  onOpenUpload?: () => void;
  interactive?: boolean;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  size = 'md',
  showLabel = false,
  showMotto = false,
  className = '',
  onOpenUpload,
  interactive = false,
}) => {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);

  // Load custom logo from localStorage if user uploaded one
  useEffect(() => {
    try {
      const savedLogo = localStorage.getItem('ssck_school_logo');
      if (savedLogo) {
        setCustomLogoUrl(savedLogo);
      }
    } catch (_) {}

    // Listen for custom event when logo is updated
    const handleLogoUpdate = () => {
      try {
        const updated = localStorage.getItem('ssck_school_logo');
        setCustomLogoUrl(updated);
      } catch (_) {}
    };

    window.addEventListener('ssck_logo_updated', handleLogoUpdate);
    return () => window.removeEventListener('ssck_logo_updated', handleLogoUpdate);
  }, []);

  // Dimensions based on size prop
  const sizeMap = {
    xs: { dim: 'w-6 h-6', px: 24, font: 'text-[9px]' },
    sm: { dim: 'w-8 h-8', px: 32, font: 'text-[11px]' },
    md: { dim: 'w-10 h-10', px: 40, font: 'text-xs' },
    lg: { dim: 'w-12 h-12', px: 48, font: 'text-sm' },
    xl: { dim: 'w-16 h-16', px: 64, font: 'text-base' },
    '2xl': { dim: 'w-20 h-20', px: 80, font: 'text-lg' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        onClick={interactive ? onOpenUpload : undefined}
        title={interactive ? 'Click to view or upload official school logo' : 'Sri Sumangala College Kandy'}
        className={`relative ${currentSize.dim} flex-shrink-0 flex items-center justify-center rounded-xl bg-white shadow-xs border border-amber-300/40 p-0.5 transition ${
          interactive ? 'cursor-pointer hover:scale-105 hover:ring-2 hover:ring-[#0B3C96]/30' : ''
        }`}
      >
        {customLogoUrl ? (
          <img
            src={customLogoUrl}
            alt="Sri Sumangala College Kandy Official Logo"
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          /* Official Sri Sumangala College Kandy Vector Crest SVG (Blue, Gold/Yellow, White) */
          <svg
            viewBox="0 0 100 120"
            className="w-full h-full drop-shadow-xs"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Heraldic Shield Outline with Gold Border */}
            <path
              d="M50 4C78 4 94 16 94 40C94 76 68 104 50 116C32 104 6 76 6 40C6 16 22 4 50 4Z"
              fill="#0B3C96" /* College Royal Blue */
              stroke="#F5A623" /* College Gold */
              strokeWidth="4"
            />

            {/* Inner Shield Divider & Tricolor Bands: Blue, Yellow, White */}
            <path
              d="M50 10C73 10 88 20 88 40C88 72 65 98 50 109C35 98 12 72 12 40C12 20 27 10 50 10Z"
              fill="#082C74"
            />

            {/* Diagonal Tricolor Sash: Yellow and White across Blue */}
            {/* Yellow / Gold Stripe */}
            <path
              d="M16 28L84 84L88 76L20 20Z"
              fill="#FFC72C"
              opacity="0.9"
            />
            {/* White Stripe */}
            <path
              d="M20 20L88 76L86 70L24 14Z"
              fill="#FFFFFF"
            />

            {/* Golden Lamp of Wisdom / Torch of Knowledge on top */}
            <g transform="translate(50, 36) scale(0.9)">
              {/* Radiance Rays */}
              <path d="M0 -22L0 -17M-10 -18L-6 -14M10 -18L6 -14" stroke="#FFC72C" strokeWidth="2" strokeLinecap="round" />
              {/* Golden Flame */}
              <path
                d="M0 -15C-4 -8 4 -4 0 2C-6 -2 -2 -11 0 -15Z"
                fill="#FFC72C"
              />
              <path
                d="M0 -12C-2 -7 2 -5 0 -1C-3 -3 -1 -9 0 -12Z"
                fill="#FFFFFF"
              />
              {/* Lamp Bowl / Base */}
              <path
                d="M-12 3C-12 9 12 9 12 3C9 2 -9 2 -12 3Z"
                fill="#F5A623"
                stroke="#FFE082"
                strokeWidth="1"
              />
              <path
                d="M-4 9H4L6 14H-6L-4 9Z"
                fill="#F5A623"
              />
            </g>

            {/* Open Book of Learning in Center */}
            <g transform="translate(50, 64) scale(0.85)">
              <path
                d="M-18 -8C-10 -10 -2 -8 0 -4C2 -8 10 -10 18 -8V10C10 8 2 10 0 14C-2 10 -10 8 -18 10V-8Z"
                fill="#FFFFFF"
                stroke="#F5A623"
                strokeWidth="2"
              />
              {/* Book lines */}
              <line x1="-14" y1="-3" x2="-4" y2="-2" stroke="#0B3C96" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="-14" y1="2" x2="-4" y2="3" stroke="#0B3C96" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="4" y1="-2" x2="14" y2="-3" stroke="#0B3C96" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="4" y1="3" x2="14" y2="2" stroke="#0B3C96" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Monogram SSCK Ribbon */}
            <rect x="22" y="86" width="56" height="15" rx="3" fill="#FFC72C" stroke="#B45309" strokeWidth="1" />
            <text
              x="50"
              y="97"
              textAnchor="middle"
              fill="#0B3C96"
              fontSize="9"
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="0.5"
            >
              SSCK · 1934
            </text>
          </svg>
        )}

        {/* Small badge showing click to upload if interactive */}
        {interactive && (
          <span
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0B3C96] text-white flex items-center justify-center ring-2 ring-white shadow-xs"
            title="Upload/Change School Logo"
          >
            <Upload className="w-2.5 h-2.5 text-amber-300" />
          </span>
        )}
      </div>

      {/* Optional School Label */}
      {showLabel && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-gray-900 tracking-tight leading-tight">
              Sri Sumangala College
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-[#0B3C96] border border-blue-200">
              KANDY
            </span>
          </div>
          {showMotto ? (
            <span className="text-[10px] font-semibold text-amber-700 tracking-wider mt-0.5">
              ESTD - 1934
            </span>
          ) : (
            <span className="text-[10px] font-medium text-gray-500 tracking-wider uppercase mt-0.5">
              School Management ERP
            </span>
          )}
        </div>
      )}
    </div>
  );
};
