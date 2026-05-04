export function normalizeSorting(sortBy, sortOrder) {
  const allowedSortFields = [
    "starts_at",
    "ends_at",
    "name",
    "city",
    "price_cents"
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "starts_at";

  const safeSortOrder =
    String(sortOrder).toUpperCase() === "DESC" ? "DESC" : "ASC";

  return { safeSortBy, safeSortOrder };
}