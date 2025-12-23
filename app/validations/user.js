import Joi from "joi"

export const createUserValidator= Joi.object({
    name:Joi.string(),
    email:Joi.string().email().required().messages({"string.email":"invalid email format",
            "any.required":"email is required"}),
    contact_number:Joi.string().min(10).max(10).messages({"string.min":"mobile number should be atleast 10 digits","string.max":"mobile number must be at most of 10 dogits"}),
    address:Joi.string(),
    pincode:Joi.string().min(6).max(6).messages({"any.min":"pincode must be atleast of 6 digits","any.max":"pincode must be atmost of 6 digits"}),
    role:Joi.string().valid("superadmin","admin","customer").messages({"any.only":"Not a valid role"}),
    password:Joi.string().min(8).required().messages({"string.min":"minimum 8 digits password is required"}),


})

