import Joi from "joi";
import mongoose from "mongoose";

// uses default connection
const Bev = mongoose.model(
  "Bev",
  new mongoose.Schema({
    category: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      lowercase: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
      max: 255,
    },
  })
);

function validateBev(bev) {
  const schema = Joi.object({
    category: Joi.string().min(3).max(50).required(),
    name: Joi.string().min(3).max(50).required(),
    amount: Joi.number().min(1).max(255).required(),
  });

  return schema.validate(bev);
}

export { Bev, validateBev };