import React, { useState } from 'react';
import { SchoolLogo } from '../common/SchoolLogo';
import { LogoUploadModal } from '../common/LogoUploadModal';
import { Sparkles, Upload } from 'lucide-react';

interface SchoolHeaderRibbonProps {
  onOpenLogoUpload?: () => void;
}

export const SchoolHeaderRibbon: React.FC<SchoolHeaderRibbonProps> = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <>
      {/* 
        Sri Sumangala College Kandy Collegiate Ribbon Strip
        Height: ~1 inch (38px - 44px)
        Colors: Royal Blue (#0B3C96), Golden Yellow (#FFC72C), Pure White (#FFFFFF)
      */}
      <section 
        className="relative w-full rounded-2xl bg-white border border-gray-200/90 shadow-xs mb-4 overflow-hidden select-none"
        aria-label="Sri Sumangala College Kandy Collegiate Header"
      >
        {/* Continuous 3-Color Top Accent Line (Blue, Yellow, White) */}
        <div className="w-full h-1.5 flex">
          <div className="w-1/3 bg-[#0B3C96]" title="College Blue" />
          <div className="w-1/3 bg-[#FFC72C]" title="College Gold / Yellow" />
          <div className="w-1/3 bg-white border-b border-gray-200" title="College White" />
        </div>

        {/* 1-Inch (~40px) Bar Body with Clean Collegiate Design */}
        <div className="px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-3 bg-gradient-to-r from-blue-50/70 via-amber-50/30 to-white">
          {/* Left: School Name & Heritage Details */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Tricolor Mini Pennant / Shield Badge */}
            <div className="hidden sm:flex items-center h-7 px-2 rounded-lg bg-[#0B3C96] text-white shadow-xs border-r-2 border-[#FFC72C]">
              <span className="text-[11px] font-black tracking-wider text-amber-300">SSCK</span>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-[#0B3C96] leading-tight">
                  Sri Sumangala College
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FFC72C]/20 text-[#B45309] border border-[#FFC72C]/40">
                  KANDY
                </span>
                <span className="hidden md:inline-block text-[11px] text-gray-500 font-medium">
                  · ශ්‍රී සුමංගල විද්‍යාලය මහනුවර
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-gray-500 font-medium mt-0.5">
                <span className="font-semibold text-amber-700">Estd - 1934</span>
                <span>•</span>
                <span className="text-gray-500">Kandy Campus</span>
                <span>•</span>
                <span className="text-gray-400 hidden sm:inline">School Management ERP</span>
              </div>
            </div>
          </div>

          {/* Center: Subtle Collegiate Color Ribbon Bands */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-gray-200/80 shadow-2xs">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0B3C96]" title="Royal Blue" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFC72C]" title="Golden Yellow" />
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-gray-300" title="Pure White" />
            </div>
            <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
              College Colors: Blue · Yellow · White
            </span>
          </div>

          {/* Right Side: Sri Sumangala College Kandy Logo Set Up Prominently */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Quick Upload / Manage Logo Pill */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white hover:bg-gray-50 text-gray-700 hover:text-[#0B3C96] border border-gray-200 hover:border-blue-300 shadow-2xs transition"
              title="Add or Change School Logo"
            >
              <Upload className="w-3 h-3 text-[#0B3C96]" />
              <span>Change Logo</span>
            </button>

            {/* Official School Logo */}
            <div 
              onClick={() => setIsUploadModalOpen(true)}
              className="cursor-pointer group relative flex items-center gap-2 pl-2 border-l border-gray-200"
              title="Sri Sumangala College Kandy Official Logo (Click to change)"
            >
              <SchoolLogo
                size="md"
                interactive={true}
                onOpenUpload={() => setIsUploadModalOpen(true)}
              />
              <div className="hidden xl:flex flex-col text-right">
                <span className="text-[11px] font-bold text-gray-900 leading-tight">
                  Official Crest
                </span>
                <span className="text-[9px] text-[#0B3C96] font-semibold">
                  Kandy, Sri Lanka
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom micro-stripe finish */}
        <div className="w-full h-[2px] bg-gradient-to-r from-[#0B3C96] via-[#FFC72C] to-[#0B3C96] opacity-60" />
      </section>

      {/* Interactive Modal for user to upload/customize logo */}
      <LogoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </>
  );
};
