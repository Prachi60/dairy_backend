import Joi  from "joi"

export const createProductValidator = Joi.object({
    name:Joi.string().required().messages({"any.empty":"name can not be empty"}),
    category:Joi.string().required(),
    unit:Joi.string(),
    price:Joi.string().required(),
    description:Joi.string(),
    in_stock:Joi.string(),
    subscription_available:Joi.string(),
    expire_date:Joi.string(),
    store:Joi.string(),
    subscription_frequency:Joi.string(),
    max_order_limit:Joi.number()

})
