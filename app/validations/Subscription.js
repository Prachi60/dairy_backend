import Joi from "joi";

export const createSubscriptionValidator = Joi.object({
    
  product: Joi.string().required(),

  SubscriptionType: Joi.string()
    .valid("daily", "alternate_days", "weekly", "monthly")
    .required(),

  duration: Joi.string()
    .valid("7days", "15days", "30days", "4days","8days","15days","1week","2week","3week","4week","1month","2month","3month","6month")
    .required(),
    startDate:Joi.date(),

 

  endDate: Joi.when("duration", {
    is: "custom",
    then: Joi.date().required(),
    otherwise: Joi.date().optional(),
  }),
  shiftTime: Joi.string()

  .required(),

  selectedDays: Joi.alternatives()
    .conditional("SubscriptionType", {
      is: "weekly",
      then: Joi.array()
        .items(
          Joi.string().valid(
            "sun",
            "mon",
            "tue",
            "wed",
            "thu",
            "fri",
            "sat"
          )
        )
        .min(1)
        .required(),
      otherwise: Joi.any().optional(),
    }),

  platformfee: Joi.number().min(0).default(0),

  discountpercent: Joi.number().min(0).max(100).default(0),


})