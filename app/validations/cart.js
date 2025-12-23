import Joi from "joi"

 export const createCartValidator =Joi.object({
    product:Joi.string().required(),
    quantity:Joi.number()

 })

 