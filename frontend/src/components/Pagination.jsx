function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  for (let i = start; i <= Math.min(totalPages, start + 4); i++) pages.push(i);

  const btn =
    "min-w-9 rounded-md border px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`${btn} border-stone-300 bg-white text-stone-700 hover:border-stone-900`}
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={
            p === Number(currentPage)
              ? `${btn} border-stone-900 bg-stone-900 text-white`
              : `${btn} border-stone-300 bg-white text-stone-700 hover:border-stone-900`
          }
        >
          {p}
        </button>
      ))}
      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`${btn} border-stone-300 bg-white text-stone-700 hover:border-stone-900`}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
