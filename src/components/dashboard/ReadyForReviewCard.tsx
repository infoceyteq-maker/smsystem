import React from 'react';
import { ArrowRight, ClipboardCheck } from 'lucide-react';

interface ReadyForReviewCardProps {
  pendingCount: number;
  studentsCount: number;
  teachersCount: number;
  onOpenApprovals: () => void;
}

export const ReadyForReviewCard: React.FC<ReadyForReviewCardProps> = ({
  pendingCount = 12,
  studentsCount = 8,
  teachersCount = 4,
  onOpenApprovals,
}) => {
  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full shadow-xs">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">
            Ready for your review
          </h3>
          <ClipboardCheck className="w-4 h-4 text-[#007AFF]" />
        </div>

        <div className="my-3">
          <span className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 block">
            {pendingCount} pending
          </span>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed font-normal">
          {studentsCount} student profiles and {teachersCount} teacher profiles await your decision. Accounts activate only after approval.
        </p>
      </div>

      <div className="pt-4">
        <button
          onClick={onOpenApprovals}
          className="w-full py-3 px-4 bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-[0.99] transition cursor-pointer"
        >
          <span>Open Approval Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
