export function validateEventInput(data, isUpdate = false) {
  const errors = [];

  const {
    name,
    starts_at,
    ends_at,
    organization_id,
    venue_id
  } = data;

  // -------------------------
  // REQUIRED FIELDS (POST only)
  // -------------------------
  if (!isUpdate) {
    if (!name) errors.push("name is required");
    if (!starts_at) errors.push("starts_at is required");
    if (!ends_at) errors.push("ends_at is required");
    if (!organization_id) errors.push("organization_id is required");
    if (!venue_id) errors.push("venue_id is required");
  }

  // -------------------------
  // TYPE / FORMAT CHECKS
  // -------------------------
  if (organization_id && isNaN(Number(organization_id))) {
    errors.push("organization_id must be a number");
  }

  if (venue_id && isNaN(Number(venue_id))) {
    errors.push("venue_id must be a number");
  }

  if (starts_at && isNaN(Date.parse(starts_at))) {
    errors.push("starts_at must be a valid date");
  }

  if (ends_at && isNaN(Date.parse(ends_at))) {
    errors.push("ends_at must be a valid date");
  }

  // -------------------------
  // LOGIC CHECKS
  // -------------------------
  if (starts_at && ends_at) {
    if (new Date(starts_at) >= new Date(ends_at)) {
      errors.push("ends_at must be after starts_at");
    }
  }

  return errors;
}