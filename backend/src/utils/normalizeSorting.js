export function normalizeSorting(sortBy, sortOrder) {
  const ALLOWED_SORT_FIELDS = [
    "starts_at",
    "ends_at",
    "name"
  ];

  const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy)
    ? sortBy
    : "starts_at";

  const safeSortOrder =
    String(sortOrder).toUpperCase() === "DESC" ? "DESC" : "ASC";

  return { safeSortBy, safeSortOrder };
}