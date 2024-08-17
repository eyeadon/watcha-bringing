const Joi = require("joi");
const mongoose = require("mongoose");

// uses default connection
const Dish = mongoose.model(
  "Dish",
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
    dietary: {
      type: Array,
      required: false,
    },
  })
);

function validateDish(dish) {
  const schema = Joi.object({
    category: Joi.string().min(3).max(50).required(),
    name: Joi.string().min(3).max(50).required(),
    amount: Joi.number().min(1).max(255).required(),
    dietary: Joi.array().items(Joi.string().min(3).max(50)),
  });

  return schema.validate(dish);
}

exports.Dish = Dish;
exports.validate = validateDish;
