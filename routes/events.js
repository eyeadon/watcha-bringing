import express from "express";
import { Event, validateEvent } from "../models/event.js";
import { Dish } from "../models/dish.js";
import { Bev } from "../models/bev.js";
const router = express.Router();
import { validateObjectId } from "../middleware/validateObjectId.js";
import { validate } from "../middleware/validate.js";

// get all
router.get("/", async (req, res) => {
  // sort by what order, name or category?
  const events = await Event.find().sort("name");
  res.send(events);
});

// get single
router.get("/:id", validateObjectId, async (req, res) => {
  const selectedEvent = await Event.findById(req.params.id);
  if (!selectedEvent)
    return res.status(404).send("The event with the given ID was not found.");

  res.send(selectedEvent);
});

// get event with dishes/bevs as full objects
router.get("/subdoc/items", async (req, res) => {
  // console.log(req.query.publicId);

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

  const findItems = async (itemKind) => {
    if (itemKind === "dish") {
      return await Dish.find({
        _id: {
          $in: selectedEvent.dishes,
        },
      })
        .populate({ path: "Dish", strictPopulate: false })
        .exec();
    } else if (itemKind === "bev") {
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

  const resultArray = await findItems(req.query.itemKind);

  if (!resultArray) return res.status(404).send("Event items were not found.");

  // console.log(resultArray);
  // console.log("useEventSubDoc run");

  res.send(resultArray);
});

router.post("/", validate(validateEvent), async (req, res) => {
  const event = new Event({
    publicId: req.body.publicId,
    // category: req.body.category,
    name: req.body.name,
    host: req.body.host,
    address: req.body.address,
    startDateTime: req.body.startDateTime,
    endDateTime: req.body.endDateTime,
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

router.put(
  "/:id",
  [validateObjectId, validate(validateEvent)],
  async (req, res) => {
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
          startDateTime: req.body.startDateTime,
          endDateTime: req.body.endDateTime,
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
  }
);

router.delete("/:id", validateObjectId, async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event)
    return res.status(404).send("The Event with the given ID was not found.");

  res.send(event);
});

// delete dish or bev item from event
router.delete("/subdoc/deleteitem", async (req, res) => {
  const deleteItem = async (itemKind) => {
    if (itemKind === "dish") {
      return await Event.updateOne(
        { _id: req.query.eventId },
        { $pullAll: { dishes: [req.query.itemId] } }
      );
    } else if (itemKind === "bev") {
      return await Event.updateOne(
        { _id: req.query.eventId },
        { $pullAll: { bevs: [req.query.itemId] } }
      );
    }
    return [];
  };

  const deleteResult = await deleteItem(req.query.itemKind);

  if (!deleteResult)
    return res
      .status(404)
      .send("Event was not updated. Event id or item id was not found.");

  res.send(deleteResult);
});

export default router;
