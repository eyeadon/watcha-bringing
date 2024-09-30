import Joi from "joi";
import mongoose from "mongoose";

const bevSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true },
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
  },
  { versionKey: false }
);

// uses default connection
const Bev = mongoose.model("Bev", bevSchema);

function validateBev(bev) {
  const schema = Joi.object({
    publicId: Joi.string().pattern(/^[A-Za-z0-9_-]{21}$/, "nanoid"),
    category: Joi.string().min(3).max(50).required(),
    name: Joi.string().min(3).max(50).required(),
    amount: Joi.number().min(1).max(255).required(),
  });

  return schema.validate(bev);
}

export { Bev, bevSchema, validateBev };
