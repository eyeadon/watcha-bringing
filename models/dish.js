import Joi from "joi";
import mongoose from "mongoose";

const dishSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true },
    userName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
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
    dietary: {
      type: Array,
      required: false,
    },
  },
  { versionKey: false }
);

// uses default connection
const Dish = mongoose.model("Dish", dishSchema);

function validateDish(dish) {
  const schema = Joi.object({
    publicId: Joi.string().pattern(/^[A-Za-z0-9_-]{21}$/, "nanoid"),
    userName: Joi.string().min(2).max(50).required(),
    category: Joi.string().min(2).max(50).required(),
    name: Joi.string().min(2).max(50).required(),
    amount: Joi.number().min(1).max(255).required(),
    dietary: Joi.array().items(Joi.string().min(2).max(50)),
  });

  return schema.validate(dish);
}

export { Dish, dishSchema, validateDish };
