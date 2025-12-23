import Joi from "joi"


export const createPaymentOrderValidator = Joi.object({
    amount :Joi.number().min(1).required().messages({
        "any.required":"Amount is required",
        "number.base":"Amount must be  a valid number",
        "number.min":"amount must be greater than 0"

    }),
    user:Joi.string()
   

})