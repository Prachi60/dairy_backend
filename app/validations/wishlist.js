import Joi from "joi"

// export const createWishlistValidator = Joi.object({
//     userId:Joi.string().required().messages({
//         "any.required":"UserId is required",
//         "base.empty":"userId can not be empty"
//     }),
//     productId:Joi.string().messages({
//         "any.required":"productId is required",
//         "base.empty":"productId can not be empty"
//     })
// })

export const createWishlistValidator = Joi.object({
    productId: Joi.string().required().messages({
        "any.required": "productId is required",
        "string.empty": "productId cannot be empty"
    })
});
