import Joi from "joi";
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    city: {
      type: String,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    state: {
      type: String,
      minlength: 2,
      maxlength: 2,
      uppercase: true,
      trim: true,
    },
    zipcode: {
      type: String,
      minlength: 5,
      maxlength: 5,
      match: /^[0-9]{5}$/,
      trim: true,
    },
  },
  { _id: false }
);

// uses default connection
const Event = mongoose.model(
  "Event",
  new mongoose.Schema(
    {
      publicId: { type: String, required: true },
      // category: {
      //   type: String,
      //   required: true,
      //   minlength: 3,
      //   maxlength: 50,
      //   lowercase: true,
      //   trim: true,
      // },
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        lowercase: true,
        trim: true,
      },
      host: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        lowercase: true,
        trim: true,
      },
      address: {
        type: addressSchema,
        required: false,
      },
      date: {
        type: String,
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: false,
      },
      // array of ObjectIds
      dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dish" }],
      bevs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bev" }],
    },
    { versionKey: false }
  )
);

function validateEvent(event) {
  const schema = Joi.object({
    publicId: Joi.string().pattern(/^[A-Za-z0-9_-]{21}$/, "nanoid"),
    // category: Joi.string().min(3).max(50).required(),
    name: Joi.string().min(3).max(50).required(),
    host: Joi.string().min(3).max(50).required(),
    address: Joi.object({
      street: Joi.string().min(3).max(50),
      city: Joi.string().min(3).max(50),
      state: Joi.string().min(2).max(2),
      zipcode: Joi.string()
        .min(5)
        .max(5)
        .pattern(/^[0-9]{5}$/, "zipcode"),
    }),
    date: Joi.date(),
    startTime: Joi.string(),
    endTime: Joi.string(),
    dishes: Joi.array().items(Joi.string()),
    bevs: Joi.array().items(Joi.string()),
  });

  return schema.validate(event);
}

// exports.Event = Event;
// exports.validate = validateEvent;
export { Event, validateEvent };
