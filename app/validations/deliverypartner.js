import Joi from "joi";

export const createDeliveryPartnerValidation = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "any.required": "Name field is required",
    }),

  phone: Joi.number()
    .integer()
    .min(1000000000)   // 10-digit minimum
    .max(9999999999)   // 10-digit maximum
    .required()
    .messages({
      "number.base": "Phone number must be numeric",
      "number.min": "Phone number must be 10 digits",
      "number.max": "Phone number must be 10 digits",
      "any.required": "Phone number is required",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

  availability: Joi.boolean().messages({
    "boolean.base": "Availability must be true or false",
  }),

  completedOrders: Joi.number()
    .integer()
    .min(0)
    .messages({
      "number.base": "Completed orders must be a number",
      "number.min": "Completed orders cannot be negative",
    }),

  status: Joi.string()
    .valid("Active", "Inactive", "Blocked")
    .messages({
      "any.only": "Status must be Active, Inactive, or Blocked",
    }),
});



export const updateDeliveryPartnerValidation = Joi.object({
  name: Joi.string().trim().min(2).max(50),

  phone: Joi.number().integer().min(1000000000).max(9999999999),

  email: Joi.string().email(),

  availability: Joi.boolean(),

  completedOrders: Joi.number().integer().min(0),

  status: Joi.string().valid("Active", "Inactive", "Blocked"),
});
