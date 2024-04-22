import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

export default function PaginationControls({
  currentPage,
  setCurrentPage,
  pageNumbers,
  totalPages,
}: {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageNumbers: string[];
  totalPages: number;
}) {
  return (
    <div className="mt-4 flex justify-center gap-1 text-sm">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
        className={`${
          currentPage === 1
            ? "text-light-darkerBg dark:text-dark-heading"
            : "text-light-link hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
        } mr-1.5 text-xs`}
      >
        <FaChevronLeft />
      </button>
      {pageNumbers.map((pageNumber) => {
        const parsedPageNumber = parseInt(pageNumber);
        if (Math.abs(parsedPageNumber - currentPage) <= 2) {
          return (
            <button
              key={pageNumber}
              disabled={currentPage === parsedPageNumber}
              className={`${
                currentPage === parsedPageNumber
                  ? "bg-light-darkerBg text-light-heading dark:bg-dark-darkerBg dark:text-dark-body"
                  : "text-light-link hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
              } rounded-full px-3 py-1.5`}
              onClick={() => setCurrentPage(parsedPageNumber)}
            >
              {pageNumber}
            </button>
          );
        } else {
          return null;
        }
      })}
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
        className={`${
          currentPage === totalPages
            ? "text-light-darkerBg dark:text-dark-heading"
            : "text-light-link hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
        } ml-1.5 text-xs`}
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
