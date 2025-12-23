

import handleResponse from "../utils/helper.js";
import Category from "../models/category.js";
import Store from "../models/store.js";
import mongoose from "mongoose";
import { createCategoryValidation } from "../validations/category.js";

export const registerCategory = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return handleResponse(res, 400, "Only admin can proceed further");
    }

    const { error } = createCategoryValidation.validate(req.body);
    if (error) {
      return handleResponse(res, 400, error.details[0].message);
    }

    const { name, description } = req.body;

    const admin_id = req.id;
    const store = await Store.findOne({ admin_id });

    if (!store) {
      return handleResponse(res, 400, "Admin doesn't own a store");
    }

    const existingCategory = await Category.findOne({
      name,
      store: store._id,
    });

    if (existingCategory) {
      return handleResponse(res, 409, "Category already exists for this store");
    }

    const newCategory = await Category.create({
      name,
      description,
      store: store._id,
    });

    return handleResponse(
      res,
      201,
      "Category created successfully",
      newCategory
    );
  } catch (error) {
    console.error("Error registering category:", error.message);
    return handleResponse(res, 500, "Internal server error", {
      error: error.message,
    });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const category = await Category.find().populate("store", "store_name");
    const categoryCount = category.length
    return handleResponse(res, 200, "Category fetched successfully", {category,categoryCount});
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    return handleResponse(res, 500, "Internal server error", {
      error: error.message,
    });
  }
};

export const getCategoriesByStoreId = async (req, res) => {
  try {
    const { storeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      return handleResponse(res, 400, "Invalid Store ID");
    }

    const categories = await Category.find({ store: storeId }).populate(
      "store",
      "store_name store_address"
    );

    if (!categories || categories.length === 0) {
      return handleResponse(res, 404, "No categories found for this store");
    }

    return handleResponse(
      res,
      200,
      "Categories fetched successfully",
      categories
    );
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    return handleResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

export const updateCategoryById = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return handleResponse(res, 400, "Only admin can proceed further");
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return handleResponse(res, 400, "Invalid Category ID");
    }

    const { name, description } = req.body;

    const updatedData = { name, description };

    const updated = await Category.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return handleResponse(
      res,
      200,
      "Category updated successfully",
      updated
    );
  } catch (error) {
    console.error("Error updating category:", error.message);
    return handleResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

export const deleteCategoryById = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return handleResponse(res, 409, "Only admin can proceed further");
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return handleResponse(res, 400, "ID not found");
    }

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return handleResponse(res, 404, "Category not found");
    }

    return handleResponse(res, 200, "Category deleted successfully", deleted);
  } catch (error) {
    console.error("Error deleting category:", error.message);
    return handleResponse(res, 500, "Internal server error", {
      error: error.message,
    });
  }
};
