import mongoose from "mongoose";
import coreJoi from "joi";
import joiDate from "@joi/date";
const Joi = coreJoi.extend(joiDate);

const addressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    city: {
      type: String,
      minlength: 2,
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
      name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        lowercase: true,
        trim: true,
      },
      host: { type: String, required: true },
      hostName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        lowercase: true,
        trim: true,
      },
      address: {
        type: addressSchema,
        required: false,
      },
      startDateTime: {
        type: Date,
        required: true,
      },
      endDateTime: {
        type: Date,
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
    name: Joi.string().min(2).max(50).required(),
    host: Joi.string().pattern(/^[A-Za-z0-9_-]{21}$/, "nanoid"),
    hostName: Joi.string().min(2).max(50).required(),
    address: Joi.object({
      street: Joi.string().min(2).max(50),
      city: Joi.string().min(2).max(50),
      state: Joi.string().min(2).max(2),
      zipcode: Joi.string()
        .min(5)
        .max(5)
        .pattern(/^[0-9]{5}$/, "zipcode"),
    }),
    startDateTime: Joi.date().iso(),
    endDateTime: Joi.date().iso(),
    dishes: Joi.array().items(Joi.string()),
    bevs: Joi.array().items(Joi.string()),
  });

  return schema.validate(event);
}

export { Event, validateEvent };
