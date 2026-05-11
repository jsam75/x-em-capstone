export const errorHandler = (err, req, res, next) => {
  console.error("Server Error:", err.message);

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(400).json({
      success: false,
      message: "Duplicate entry - resource already exists"
    });
  }

  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({
      success: false,
      message: "Invalid foreign key reference"
    });
  }

  res.status(500).json({
    success: false,
    message: "Server error"
  });
};