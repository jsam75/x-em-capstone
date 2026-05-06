function EventFilters({
  city,
  setCity,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  subjects,
  setSubjects,
  subjectOptions,
  clearFilters,
}) {
  return (
    <div className="bg-[#132b45] p-4 rounded-lg mb-4">
    <p className="text-[#fff5e6] text-sm font-medium mb-2">
    Filters
    </p>

    <div className="flex flex-wrap gap-4 items-center text-sm text-[#fff5e6]">
      
      {/* City */}
      <label>
        City:
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="ml-2 p-1 rounded bg-[#0b213a] text-[#fff5e6] border border-[#9fb7c9]
          hover:border-[#006d77] hover:bg-[#132b45]
          focus:outline-none focus:ring-2 focus:ring-[#006d77]
          cursor-pointer"
        >
          <option value="">All</option>
          <option value="San Antonio">San Antonio, TX</option>
          <option value="Honolulu">Honolulu, HI</option>
          <option value="Salt Lake City">Salt Lake City, UT</option>
          <option value="San Diego">San Diego, CA</option>
          <option value="Tampa">Tampa, FL</option>
          <option value="Miami">Miami, FL</option>
        </select>
      </label>

         {/* Date Range */}
        <label>
  From:
  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className="ml-2 p-1 rounded bg-[#0b213a] text-[#fff5e6] border border-[#9fb7c9] [color-scheme:dark]
    hover:border-[#006d77] hover:bg-[#132b45]
    focus:outline-none focus:ring-2 focus:ring-[#006d77]
    cursor-pointer"
  />
</label>

<label>
  To:
  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    className="ml-2 p-1 rounded bg-[#0b213a] text-[#fff5e6] border border-[#9fb7c9] [color-scheme:dark]
    hover:border-[#006d77] hover:bg-[#132b45]
    focus:outline-none focus:ring-2 focus:ring-[#006d77]
    cursor-pointer"
  />
</label>

      {/* Subjects */}
      <div className="flex flex-col">
  <span className="mb-1">Subjects:</span>

  <div className="max-h-32 overflow-y-auto bg-[#0b213a] border border-[#9fb7c9] rounded p-2 space-y-1
  hover:border-[#006d77] hover:bg-[#132b45]
  focus-within:border-[#006d77] focus-within:bg-[#132b45]
  cursor-pointer">
    {subjectOptions.map((s) => (
      <label key={s.name} className="flex items-center gap-2 text-[#fff5e6] p-1 rounded
             hover:bg-[#0b213a] cursor-pointer">
        <input
          type="checkbox"
          className="accent-[#006d77]"
          value={s.name}
          checked={subjects.includes(s.name)}
          onChange={(e) => {
            if (e.target.checked) {
              setSubjects([...subjects, s.name]);
            } else {
              setSubjects(subjects.filter((subj) => subj !== s.name));
            }
          }}
        />
        {s.name}
      </label>
    ))}
  </div>
</div>

      {/* Clear Button */}
      <button
        onClick={clearFilters}
        className="px-3 py-1 bg-[#006d77] text-[#fff5e6] rounded hover:bg-[#005f66]"
      >
        Clear
      </button>

    </div>
</div>
);
}

export default EventFilters;