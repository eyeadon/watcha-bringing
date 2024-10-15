import express from "express";
import { Event, validateEvent as validate } from "../models/event.js";
import { Dish } from "../models/dish.js";
import { Bev } from "../models/bev.js";
const router = express.Router();

// get all
router.get("/", async (req, res) => {
  // sort by what order, name or category?
  const events = await Event.find().sort("name");
  res.send(events);
});

// get single
router.get("/:id", async (req, res) => {
  const selectedEvent = await Event.findById(req.params.id);
  if (!selectedEvent)
    return res.status(404).send("The event with the given ID was not found.");

  res.send(selectedEvent);
});

// get event with dishes/bevs as full objects
router.get("/subdoc/event", async (req, res) => {
  console.log(req.query.publicId);

  if (req.query.publicId === "none") {
    res.send([]);
    return;
  }

  const selectedEvent = await Event.findOne({
    publicId: req.query.publicId,
  }).exec();

  if (!selectedEvent)
    return res.status(404).send("The event with the given ID was not found.");

  // console.log(selectedEvent);

  const findItems = async (item) => {
    if (item === "dish") {
      return await Dish.find({
        _id: {
          $in: selectedEvent.dishes,
        },
      })
        .populate({ path: "Dish", strictPopulate: false })
        .exec();
    } else if (item === "bev") {
      return await Bev.find({
        _id: {
          $in: selectedEvent.bevs,
        },
      })
        .populate({ path: "Bev", strictPopulate: false })
        .exec();
    }
    return [];
  };

  const resultArray = await findItems(req.query.item);

  if (!resultArray) return res.status(404).send("Event items were not found.");

  // console.log(resultArray);
  // console.log("useEventSubDoc run");

  res.send(resultArray);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const event = new Event({
    publicId: req.body.publicId,
    // category: req.body.category,
    name: req.body.name,
    host: req.body.host,
    address: req.body.address,
    date: req.body.date,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    dishes: req.body.dishes,
    bevs: req.body.bevs,
  });

  try {
    // returns Promise, not stored here
    await event.save();
  } catch (exception) {
    // for (field in exception.errors) {
    console.log(exception);
  }

  // console.log(event);
  res.send(event);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const event = await Event.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        publicId: req.body.publicId,
        // category: req.body.category,
        name: req.body.name,
        host: req.body.host,
        address: req.body.address,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        dishes: req.body.dishes,
        bevs: req.body.bevs,
      },
    },
    // get updated document
    { new: true }
  );

  if (!event)
    return res.status(404).send("The Event with the given ID was not found.");

  // console.log(event);
  res.send(event);
});

router.delete("/:id", async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event)
    return res.status(404).send("The Event with the given ID was not found.");

  res.send(event);
});

export default router;
