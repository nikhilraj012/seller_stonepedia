import React, { useMemo } from 'react';
import { FaAngleLeft, FaAngleRight, FaEllipsisH } from "react-icons/fa";

const Pagination = ({ itemsPerPage, totalItems, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Generate all page numbers
    const pageNumbers = useMemo(() => {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }, [totalPages]);

    // Function to get the page numbers to display
    const getDisplayedPages = () => {
        if (totalPages <= 7) {
            return pageNumbers;
        }

        // If we're on pages 1-2, show pages 1-3, ellipsis
        if (currentPage <= 2) {
            return [1, 2, 3, 'ellipsis'];
        } 
        // If we're on page 3, show pages 1-6 with ellipsis
        else if (currentPage === 3) {
            return [1, 2, 3, 'ellipsis', 4, 5, 6];
        }
        // If we're on pages 4-5, maintain the same pattern as page 3
        else if (currentPage === 4 || currentPage === 5) {
            return [1, 2, 3, 'ellipsis', 4, 5, 6];
        }
        // If we're on page 6, show 1, 2, 3, ..., 5, 6, 7
        else if (currentPage === 6) {
            return [1, 2, 3, 'ellipsis', 5, 6, 7];
        }
        // For higher pages, show a sliding window
        else {
            return [
                1,
                2,
                3,
                'ellipsis',
                currentPage - 1,
                currentPage,
                currentPage + 1
            ];
        }
    };

    // Remove duplicates and sort
    const displayedPages = [...new Set(getDisplayedPages())].sort((a, b) => a - b);

    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-8">
        <div className="flex items-center justify-between w-full max-w-96 text-gray-500 font-medium p-1 md:p-2 border border-primary rounded-full">
          <button
            type="button"
            aria-label="Previous page"
            className={`text-primary outline-none ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaAngleLeft size={20} />
          </button>

          <div className="flex items-center gap-1 md:gap-2 text-sm font-medium">
            {displayedPages.map((number, index) => (
              <React.Fragment key={index}>
                {number === "ellipsis" ? (
                  <span className="px-1">
                    <FaEllipsisH className="inline-block" />
                  </span>
                ) : (
                  <button
                    className={`h-5 w-5 md:h-8 md:w-8 flex items-center justify-center outline-none rounded-full ${
                      currentPage === number
                        ? "bg-[#871B58] text-white"
                        : "hover:bg-gray-100 cursor-pointer"
                    }`}
                    onClick={() => onPageChange(number)}
                  >
                    {number}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next page"
            className={`text-primary outline-none ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages}
          >
            <FaAngleRight size={20} />
          </button>
        </div>
      </div>
    );
};

export default Pagination;