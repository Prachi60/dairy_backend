// import handleResponse from "../utils/helper.js";
// import User from "../models/user.js"
// import DeliveryPartner from "../models/deliveryPartner.js";

// export const addDeliveryPartner = async (req, res) => {
//   try {
//     const user = await User.findById(req.id);
//     if (user.role !== "admin") {
//       return handleResponse(res, 403, "Only admin can add delivery partners");
//     }

//     const { name, phone, email } = req.body;

//     if (!name || !phone) {
//       return handleResponse(res, 400, "Name and phone are required");
//     }

//     const existing = await DeliveryPartner.findOne({ email });
//     if (existing) {
//       return handleResponse(res, 400, "Partner already exists with this email");
//     }

//     const partner = await DeliveryPartner.create({
//       name,
//       phone,
//       email
//     });

//     return handleResponse(res, 201, "Delivery Partner Added Successfully", partner);

//   } catch (error) {
//     console.log("Add Partner Error:", error.message);
//     return handleResponse(res, 500, "Internal Server Error", { error: error.message });
//   }
// };

// export const getAllDeliveryPartners = async (req, res) => {
//   try {
//     const user = await User.findById(req.id);
//     if (user.role !== "admin") {
//       return handleResponse(res, 403, "Only admin can view partners");
//     }

//     const partners = await DeliveryPartner.find().sort({ createdAt: -1 });

//     return handleResponse(res, 200, "Partners fetched successfully", partners);

//   } catch (error) {
//     console.log("Get Partners Error:", error.message);
//     return handleResponse(res, 500, "Internal Server Error", { error: error.message });
//   }
// };
// export const updateDeliveryPartner = async (req, res) => {
//   try {
//     const user = await User.findById(req.id);
//     if (user.role !== "admin") {
//       return handleResponse(res, 403, "Only admin can update delivery partners");
//     }

//     const { id } = req.params;
//     const { name, phone, email } = req.body;

//     const partner = await DeliveryPartner.findById(id);
//     if (!partner) {
//       return handleResponse(res, 404, "Delivery Partner not found");
//     }

   
//     if (email && email !== partner.email) {
//       const exists = await DeliveryPartner.findOne({ email });
//       if (exists) {
//         return handleResponse(
//           res,
//           400,
//           "Another partner already exists with this email"
//         );
//       }
//     }

//     partner.name = name || partner.name;
//     partner.phone = phone || partner.phone;
//     partner.email = email || partner.email;

//     await partner.save();

//     return handleResponse(
//       res,
//       200,
//       "Delivery Partner Updated Successfully",
//       partner
//     );
//   } catch (error) {
//     console.log("Update Partner Error:", error.message);
//     return handleResponse(res, 500, "Internal Server Error", { error: error.message });
//   }
// };

// export const deleteDeliveryPartner = async (req, res) => {
//   try {
//     const user = await User.findById(req.id);
//     if (user.role !== "admin") {
//       return handleResponse(res, 403, "Only admin can delete delivery partners");
//     }

//     const { id } = req.params;

//     const partner = await DeliveryPartner.findById(id);
//     if (!partner) {
//       return handleResponse(res, 404, "Delivery Partner not found");
//     }

//     await DeliveryPartner.findByIdAndDelete(id);

//     return handleResponse(res, 200, "Delivery Partner Deleted Successfully",partner);
//   } catch (error) {
//     console.log("Delete Partner Error:", error.message);
//     return handleResponse(res, 500, "Internal Server Error", { error: error.message });
//   }
// };
import handleResponse from "../utils/helper.js";
import User from "../models/user.js";
import DeliveryPartner from "../models/deliveryPartner.js";
import mongoose from "mongoose";
import {
  createDeliveryPartnerValidation,
  updateDeliveryPartnerValidation,
} from "../validations/deliverypartner.js";

export const addDeliveryPartner = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user || user.role !== "admin") {
      return handleResponse(res, 403, "Only admin can add delivery partners");
    }

    
    const { error } = createDeliveryPartnerValidation.validate(req.body);
    if (error) {
      return handleResponse(res, 400, error.details[0].message);
    }

    const { name, phone, email } = req.body;

  
    if (email) {
      const existing = await DeliveryPartner.findOne({ email });
      if (existing) {
        return handleResponse(res, 409, "Partner already exists with this email");
      }
    }

    const partner = await DeliveryPartner.create({
      name,
      phone,
      email,
    });

    return handleResponse(res, 201, "Delivery Partner Added Successfully", partner);
  } catch (error) {
    console.log("Add Partner Error:", error.message);
    return handleResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

export const getAllDeliveryPartners = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user || user.role !== "admin") {
      return handleResponse(res, 403, "Only admin can view partners");
    }

    const partners = await DeliveryPartner.find().sort({ createdAt: -1 });
    const partnerCount = partners.length

    return handleResponse(res, 200, "Partners fetched successfully",{ partners,partnerCount});
  } catch (error) {
    console.log("Get Partners Error:", error.message);
    return handleResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

export const updateDeliveryPartner = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user || user.role !== "admin") {
      return handleResponse(res, 403, "Only admin can update delivery partners");
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return handleResponse(res, 400, "Invalid partner ID");
    }

    
    const { error } = updateDeliveryPartnerValidation.validate(req.body);
    if (error) {
      return handleResponse(res, 400, error.details[0].message);
    }

    const { name, phone, email } = req.body;

    const partner = await DeliveryPartner.findById(id);
    if (!partner) {
      return handleResponse(res, 404, "Delivery Partner not found");
    }

  
    if (email && email !== partner.email) {
      const exists = await DeliveryPartner.findOne({ email });
      if (exists) {
        return handleResponse(res, 409, "Another partner already exists with this email");
      }
    }

 
    if (name !== undefined) partner.name = name;
    if (phone !== undefined) partner.phone = phone;
    if (email !== undefined) partner.email = email;

    await partner.save(); 

    return handleResponse(res, 200, "Delivery Partner Updated Successfully", partner);
  } catch (error) {
    console.log("Update Partner Error:", error.message);
    return handleResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};

export const deleteDeliveryPartner = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user || user.role !== "admin") {
      return handleResponse(res, 403, "Only admin can delete delivery partners");
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return handleResponse(res, 400, "Invalid partner ID");
    }

    const partner = await DeliveryPartner.findById(id);
    if (!partner) {
      return handleResponse(res, 404, "Delivery Partner not found");
    }

    await DeliveryPartner.findByIdAndDelete(id);

    return handleResponse(res, 200, "Delivery Partner Deleted Successfully", partner);
  } catch (error) {
    console.log("Delete Partner Error:", error.message);
    return handleResponse(res, 500, "Internal Server Error", { error: error.message });
  }
};
