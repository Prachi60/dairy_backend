import handleResponse from "../utils/helper.js";
import Subscription from "../models/Subscription.js";
import Product from "../models/product.js";
import moment from "moment"
import { createSubscriptionValidator } from "../validations/Subscription.js";




export const CreateSubscription = async (req, res) => {
  try {
    const { error, value } = createSubscriptionValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return handleResponse(res, 400, "Validation Error", {
        details: error.details.map((e) => e.message),
      });
    }

    const {
      product,
      SubscriptionType,
      duration,
     shiftTime,
      endDate,
      selectedDays,
   
    } = value;

    const productData = await Product.findById(product);
    if (!productData) {
      return handleResponse(res, 404, "Product not found");
    }

    const start = moment().startOf("day");
    let finalEndDate = endDate;

    if (duration === "7days") finalEndDate = start.clone().add(7, "days");
    if (duration === "15days") finalEndDate = start.clone().add(15, "days");
    if (duration === "30days") finalEndDate = start.clone().add(30, "days");

    if (duration === "custom" && !endDate) {
      return handleResponse(res, 400, "End Date is required");
    }

    let discountpercent = 0;
    if (SubscriptionType === "daily") discountpercent = 10;
    if (SubscriptionType === "alternate_days") discountpercent = 5;
    if (SubscriptionType === "weekly") discountpercent = 12;
    if (SubscriptionType === "monthly") discountpercent = 7;

    let nextDeliveryDate = start.clone();

    if (SubscriptionType === "weekly") {
      const dayMap = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
      const today = start.day();

      const dates = selectedDays.map((d) => {
        const diff = (dayMap[d] - today + 7) % 7;
        return start.clone().add(diff, "days");
      });

      nextDeliveryDate = dates.sort((a, b) => a.valueOf() - b.valueOf())[0];
    }

    const subscription = await Subscription.create({
      user: req.id,
      product: productData._id,
      SubscriptionType,
      duration,
      shiftTime,
      startDate: start.toDate(),
      endDate: finalEndDate,
      selectedDays,
      discountpercent,
      platformfee :20,
      nextDeliveryDate,
      isActive: true,
    });

    return handleResponse(res, 201, "Subscription created successfully", subscription);
  } catch (error) {
    console.error("Error creating subscription", error.message);
    return handleResponse(res, 500, "Internal Server Error",{error:error.message});
  }
};
