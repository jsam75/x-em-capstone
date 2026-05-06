function ActiveFilters({
  city,
  subjects,
  startDate,
  endDate,
  clearFilters,
}) {
  const hasFilters =
    city || subjects.length > 0 || startDate || endDate;

  if (!hasFilters) return null;


  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-[#fff5e6]">
      
      <span className="font-medium mr-1">Filters:</span>

      {city && (
        <span className="bg-[#0b213a] text-[#fff5e6] px-2 py-1 rounded border border-[#9fb7c9]">
          {city}
        </span>
      )}

      {subjects.map((s) => (
        <span key={s} className="bg-[#0b213a] text-[#fff5e6] px-2 py-1 rounded border border-[#9fb7c9]">
          {s}
        </span>
      ))}

      {startDate && (
        <span className="bg-[#0b213a] text-[#fff5e6] px-2 py-1 rounded border border-[#9fb7c9]">
          From: {startDate}
        </span>
      )}

      {endDate && (
        <span className="bg-[#0b213a] text-[#fff5e6] px-2 py-1 rounded border border-[#9fb7c9]">
          To: {endDate}
        </span>
      )}

    <span className="ml-2 text-[#9fb7c9]">
        Showing events
        {startDate && ` from ${startDate}`}
        {endDate && ` to ${endDate}`}
    </span>

      <button
        onClick={clearFilters}
        className="px-3 py-1 bg-[#006d77] text-[#fff5e6] rounded hover:bg-[#005f66]"
      >
        Clear All
      </button>

    </div>
  );
}

export default ActiveFilters;