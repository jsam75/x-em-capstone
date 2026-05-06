function PaginationControls({ meta, setOffset }) {
  if (!meta) return null;

  return (
    <div className="flex justify-between items-center mt-6 text-[#fff5e6]">
      
      <button
        disabled={!meta.hasPrev}
        onClick={() => setOffset(meta.offset - meta.limit)}
        className="px-3 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
      >
        ← Prev
      </button>

      <span className="text-sm">
        Showing {meta.offset + 1} - {Math.min(meta.offset + meta.limit, meta.total)} of {meta.total}
      </span>

      <button
        disabled={!meta.hasNext}
        onClick={() => setOffset(meta.offset + meta.limit)}
        className="px-3 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
      >
        Next →
      </button>

    </div>
  );
}

export default PaginationControls;