import Joi from "joi";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
      lowercase: true,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
    },
    eventsOwned: {
      type: Array,
    },
    dishesOwned: {
      type: Array,
    },
    bevsOwned: {
      type: Array,
    },
  },
  { versionKey: false }
);

// uses default connection
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    publicId: Joi.string().pattern(/^[A-Za-z0-9_-]{21}$/, "nanoid"),
    name: Joi.string().min(2).max(255).required(),
    isAdmin: Joi.boolean(),
    eventsOwned: Joi.array().items(Joi.string().min(2).max(255)),
    dishesOwned: Joi.array().items(Joi.string().min(2).max(255)),
    bevsOwned: Joi.array().items(Joi.string().min(2).max(255)),
  });

  return schema.validate(user);
}

export { User, userSchema, validateUser };
