import { validateEventInput } from "../utils/validateEvent.js";

export const validateEvent = (isUpdate = false) => {
  return (req, res, next) => {
    const errors = validateEventInput(req.body, isUpdate);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    next();
  };
};

