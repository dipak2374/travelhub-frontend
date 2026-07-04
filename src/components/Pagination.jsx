import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages < 1) return null;

  const getPages = () => {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center gap-1">
      {/* Prev */}
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <FiChevronLeft size={15} />
      </button>

      {/* First page + ellipsis */}
      {pages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            1
          </button>
          {pages[0] > 2 && (
            <span className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
          )}
        </>
      )}

      {/* Page buttons */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            page === currentPage
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last page + ellipsis */}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <FiChevronRight size={15} />
      </button>
    </div>
  );
};

export default Pagination;
