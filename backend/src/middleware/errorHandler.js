export const errorHandler = (err, req, res, next) => {
  //console.error("Server Error:", err.message);

  // Production Debugging Logs
  console.error("===== GLOBAL ERROR =====");
  console.error(err);
  console.error("TYPE:", typeof err);
  console.error("MESSAGE:", err?.message);
  console.error("STACK:", err?.stack);
  console.error("========================");

  console.error("FULL ERROR OBJECT:", JSON.stringify(err, null, 2));
  if (err?.errors) {
  console.error("AGGREGATE INNER ERRORS:");
  err.errors.forEach((e, index) => {
    console.error(`INNER ERROR ${index}:`, e);
  });
}

  if (err?.code === "ER_DUP_ENTRY") {
    return res.status(400).json({
      success: false,
      message: "Duplicate entry - resource already exists"
    });
  }

  if (err?.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({
      success: false,
      message: "Invalid foreign key reference"
    });
  }

  res.status(500).json({
    success: false,
    message: err?.message || "Unknown server error",
    stack: err?.stack,
    errors: err?.errors || null
  });
};