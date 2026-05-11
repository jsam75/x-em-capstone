function PaginationControls({ meta, setOffset }) {
  if (!meta) return null;

  return (
    <div className="flex justify-between items-center mt-6 text-[#fff5e6]">
      
      <button
        disabled={!meta.hasPrev}
        onClick={() => setOffset(meta.offset - meta.limit)}
        className="
                   px-3 py-1
                   rounded
                   bg-[#006d77]
                   text-[#fff5e6]
                   hover:bg-[#005f66]
                   transition-colors
                   disabled:opacity-50
                   disabled:cursor-not-allowed"
      >
        ← Prev
      </button>

      <span className="text-sm">
        Showing {meta.offset + 1} - {Math.min(meta.offset + meta.limit, meta.total)} of {meta.total}
      </span>

      <button
        disabled={!meta.hasNext}
        onClick={() => setOffset(meta.offset + meta.limit)}
        className=" px-3 py-1
                    rounded
                    bg-[#006d77]
                    text-[#fff5e6]
                    hover:bg-[#005f66]
                    transition-colors
                    disabled:opacity-50
                    disabled:cursor-not-allowed"
      >
        Next →
      </button>

    </div>
  );
}

export default PaginationControls;