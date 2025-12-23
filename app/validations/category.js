import Joi from "joi";

export const createCategoryValidation = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "any.required": "Category name is required",
    }),

  description: Joi.string()
    .allow("")
    .max(200)
    .messages({
      "string.max": "Description cannot exceed 200 characters",
    }),

})
