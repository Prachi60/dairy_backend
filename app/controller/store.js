import handleResponse from "../utils/helper.js";
import Store from "../models/store.js";
import User from "../models/user.js"
import { createStoreValidator } from "../validations/store.js";

export const registerStore = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return handleResponse(res, 400, "only admin can proceed further");
    }

    const { error, value } = createStoreValidator.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return handleResponse(res, 400, "Validation error", {
        details: error.details.map((error) => error.message),
      });
    }

    const { store_name, store_address, bank_account_number, ifsc_code } = value;

    const existingMail = await Store.findOne({ store_name });
    if (existingMail) {
      return handleResponse(
        res,
        400,
        "Store already registered with this store name"
      );
    }
    const newStore = new Store({
      store_name,
      store_address,

      bank_account_number,
      ifsc_code,

      admin_id: req.id,
    });
    const result = await newStore.save();
    // console.log("Result:", result);
    const _id= result.admin_id;
    const user = await User.findOne({ _id });
   if(user.store === null){
    user.store = result._id
   }
   await user.save();
//  console.log("User:",user);
 
    return handleResponse(res, 201, "store created successfully", result);
  } catch (error) {
    console.error("error in registering the store", error.message);
    return handleResponse(res, 500, "Internal server Error", {
      error: error.message,
    });
  }
};

export const getAllStore = async (req, res) => {
  try {
    const store = await Store.find()
    
    return handleResponse(res, 200, "Store fetched successfully", store);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return handleResponse(res, 500, "Internal server error", {
      error: error.message
    });
  }
};
