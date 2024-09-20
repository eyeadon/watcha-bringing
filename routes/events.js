import express from "express";
const router = express.Router();
import { Event, validateEvent as validate } from "../models/event.js";

// get all
router.get("/", async (req, res) => {
  // sort by what order, name or category?
  const Events = await Event.find().sort("name");
  res.send(Events);
});

// get single
router.get("/:id", async (req, res) => {
  const Event = await Event.findById(req.params.id);

  if (!Event)
    return res.status(404).send("The Event with the given ID was not found.");
  res.send(Event);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const Event = new Event({
    publicId: req.body.publicId,
    // category: req.body.category,
    name: req.body.name,
    host: req.body.host,
    address: req.body.address,
    date: req.body.date,
    startTime: req.body.startTimes,
    endTime: req.body.endTime,
    dishes: req.body.dishes,
    bevs: req.body.bevs,
  });

  try {
    // returns Promise, not stored here
    await Event.save();
  } catch (exception) {
    for (field in exception.errors) {
      console.log(exception.errors[field].message);
    }
  }

  res.send(Event);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const Event = await Event.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        publicId: req.body.publicId,
        // category: req.body.category,
        name: req.body.name,
        host: req.body.host,
        address: req.body.address,
        date: req.body.date,
        startTime: req.body.startTimes,
        endTime: req.body.endTime,
        dishes: req.body.dishes,
        bevs: req.body.bevs,
      },
    },
    // get updated document
    { new: true }
  );

  if (!Event)
    return res.status(404).send("The Event with the given ID was not found.");

  res.send(Event);
});

router.delete("/:id", async (req, res) => {
  const Event = await Event.findByIdAndDelete(req.params.id);

  if (!Event)
    return res.status(404).send("The Event with the given ID was not found.");

  res.send(Event);
});

export default router;
