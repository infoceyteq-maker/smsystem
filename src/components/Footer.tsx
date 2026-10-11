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
    <footer className="w-full px-4 sm:px-8 py-4 border-t border-gray-200 bg-white/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 select-none z-40">
      {/* Left copyright notice */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-600">© 2026 Aster College · School Operations ERP</span>
        <span className="hidden sm:inline text-gray-300">|</span>
        <span className="hidden sm:inline text-gray-400">Powered by Ceyteq Solutions</span>
      </div>

      {/* Center Figma presentation slide navigator pill (< 8 / 18 >) */}
      <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl px-1.5 py-1 gap-2 shadow-xs">
        <button
          onClick={onPrevSlide}
          className="p-1 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
          title="Previous slide"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="font-mono text-gray-800 font-semibold px-2 text-xs">
          Slide {currentSlide} / {totalSlides}
        </span>
        <button
          onClick={onNextSlide}
          className="p-1 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
          title="Next slide"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right security stamp */}
      <div className="flex items-center gap-1.5 text-gray-500">
        <ShieldCheck className="w-4 h-4 text-[#007AFF]" />
        <span>Enterprise JWT · RBAC Protected</span>
      </div>
    </footer>
  );
};
