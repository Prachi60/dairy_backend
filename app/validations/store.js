import Joi from "joi"

export const createStoreValidator=Joi.object({
   
    store_name:Joi.string().messages({"any.empty":"store name can not be empty"}),
    store_address:Joi.string(),
    
    bank_account_number:Joi.string().required().messages({"any.required":"account number is required"}),
    ifsc_code:Joi.string(),
  
    admin_id:Joi.string()

})