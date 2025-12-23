import Joi from "joi"


export const createOrderValidator=Joi.object({
    address: Joi.string().allow("").optional(),

//   subscriptionType: Joi.string()
//     .valid("monthly", "yearly", "weekly","alternate days","daily","weekend")
//     .required()
//     .messages({
//       "any.required": "subscriptionType is required",
//       "string.empty": "subscriptionType cannot be empty"
//     }),
// })
})