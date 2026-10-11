import React from 'react';
import { ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

interface FooterProps {
  currentSlide: number;
  totalSlides: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentSlide = 8,
  totalSlides = 18,
  onPrevSlide,
  onNextSlide,
}) => {
  return (
    <footer className="w-full px-4 sm:px-8 py-5 border-t border-white/[0.04] bg-black/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E8E93] select-none z-40">
      {/* Left copyright notice */}
      <div className="flex items-center gap-2">
        <span>© 2026 Aster College · School operations</span>
      </div>

      {/* Center Figma presentation slide navigator pill (< 8 / 18 >) */}
      <div className="flex items-center bg-[#1C1C1E] border border-white/10 rounded-xl px-1.5 py-1 gap-2 shadow-inner">
        <button
          onClick={onPrevSlide}
          className="p-1 hover:text-white hover:bg-[#2C2C2E] rounded-lg transition"
          title="Previous slide"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="font-mono text-zinc-300 font-medium px-2 text-xs">
          {currentSlide} / {totalSlides}
        </span>
        <button
          onClick={onNextSlide}
          className="p-1 hover:text-white hover:bg-[#2C2C2E] rounded-lg transition"
          title="Next slide"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right security stamp */}
      <div className="flex items-center gap-1.5 text-[#8E8E93]">
        <ShieldCheck className="w-4 h-4 text-[#8E8E93]" />
        <span>Authorized access only · Sample account</span>
      </div>
    </footer>
  );
};
