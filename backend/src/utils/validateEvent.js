export function validateEventInput(data, isUpdate = false) {
  const errors = [];

  const {
    name,
    starts_at,
    ends_at,
    organization_id,
    venue_id
  } = data;

  // -------------------------------------------------
  // REQUIRED FIELDS (POST only - PUT skips this part)
  // -------------------------------------------------
  if (!isUpdate) {
    if (!name) errors.push("name is required");
    if (!starts_at) errors.push("starts_at is required");
    if (!ends_at) errors.push("ends_at is required");
    if (!organization_id) errors.push("organization_id is required");
    if (!venue_id) errors.push("venue_id is required");
  }

  // -----------------------------------------------------------------------
  // TYPE / FORMAT CHECKS (FIELD VALIDATION) - SHARED PIPELINE FOR POST/PUT
  // -----------------------------------------------------------------------
  if (
  name !== undefined &&
  typeof name === "string" &&
  name.trim() === ""
) {
  errors.push("name cannot be empty");
}

  if (organization_id !== undefined && isNaN(Number(organization_id))) {
    errors.push("organization_id must be a number");
  }

  if (venue_id !== undefined && isNaN(Number(venue_id))) {
    errors.push("venue_id must be a number");
  }

  if (starts_at !== undefined && isNaN(Date.parse(starts_at))) {
    errors.push("starts_at must be a valid date");
  }

  if (ends_at !== undefined && isNaN(Date.parse(ends_at))) {
    errors.push("ends_at must be a valid date");
  }

  // --------------------------------------------
  // LOGIC CHECKS - SHARED PIPELINE FOR POST/PUT
  // --------------------------------------------
  if (starts_at && ends_at) {
    if (new Date(starts_at) >= new Date(ends_at)) {
      errors.push("ends_at must be after starts_at");
    }
  }

  return errors;
}