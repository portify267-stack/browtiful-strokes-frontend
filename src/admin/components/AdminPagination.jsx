import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AdminPagination = ({ currentPage, totalPages, totalItems, limit, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems || currentPage * limit);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-beige/60">
      <div className="text-xs text-charcoal/70">
        Showing <span className="font-semibold text-charcoal">{startItem}</span> to{' '}
        <span className="font-semibold text-charcoal">{endItem}</span>
        {totalItems ? (
          <>
            {' '}of <span className="font-semibold text-charcoal">{totalItems}</span> items
          </>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-beige bg-cream text-charcoal hover:bg-beige/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-medium px-3 py-1.5 bg-beige/30 rounded-lg text-charcoal">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg border border-beige bg-cream text-charcoal hover:bg-beige/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
