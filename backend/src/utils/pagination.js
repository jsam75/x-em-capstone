// Parse limit + offset safely
export function parsePagination(query) {
  let { limit, offset } = query;

  limit = parseInt(limit);
  offset = parseInt(offset);

  // Defaults
  if (isNaN(limit) || limit <= 0) limit = 10;
  if (isNaN(offset) || offset < 0) offset = 0;

  // Safety cap (super important)
  if (limit > 100) limit = 100;

  return { limit, offset };
}


// Build pagination metadata
export function buildPaginationMeta({ total, limit, offset }) {
  return {
    total,
    limit,
    offset,
    hasNext: offset + limit < total,
    hasPrev: offset > 0
  };
}