export const  getDurationDays = (duration) => {
  if (duration === "7days") return 7;
  if (duration === "15days") return 15;
  if (duration === "30days") return 30;
  if(duration==="4days") return 4;
  if(duration==="8days") return 8;
  if(duration==="15days") return 15;

  if (duration==="1week")   return 7;
  if (duration==="2week")   return 14;
  if (duration==="3week")   return 21;
  if (duration==="4week")   return 28;
  if (duration==="1month")   return 30;
  if (duration==="2month")   return 60;
  if (duration==="3month")   return 90;
  if (duration==="6month")   return 180;


  return 0;
};

export const getDeliveryCount = (subscriptionType, days) => {
  if (subscriptionType === "daily") return days;
  if (subscriptionType === "alternate_days") return Math.ceil(days);
  if (subscriptionType === "weekly") return Math.ceil(days / 7);
  if (subscriptionType === "monthly") return Math.ceil(days/30);
  return 0;
};

export const getDiscountPercent = (subscriptionType) => {
  if (subscriptionType === "daily") return 10;
  if (subscriptionType === "alternate_days") return 5;
  if (subscriptionType === "weekly") return 12;
  if (subscriptionType === "monthly") return 7;
  return 0;
};

