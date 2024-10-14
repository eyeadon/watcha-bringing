import express from "express";
const router = express.Router();
import { Dish, validateDish as validate } from "../models/dish.js";

// get all
router.get("/", async (req, res) => {
  // sort by what order, name or category?
  const dishes = await Dish.find().sort("category");
  res.send(dishes);
});

// get single
router.get("/:id", async (req, res) => {
  const dish = await Dish.findById(req.params.id);

  if (!dish)
    return res.status(404).send("The dish with the given ID was not found.");
  res.send(dish);
});

// get single by publicId
router.get("/public/:publicId", async (req, res) => {
  if (req.params.publicId === "none") {
    res.send([]);
    return;
  }

  // console.log(req.params.publicId);

  const dish = await Dish.findOne({ publicId: req.params.publicId });

  if (!dish)
    return res.status(404).send("The dish with the given ID was not found.");

  res.send(dish);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const dish = new Dish({
    publicId: req.body.publicId,
    category: req.body.category,
    name: req.body.name,
    amount: req.body.amount,
    dietary: req.body.dietary,
  });

  try {
    // returns Promise, not stored here
    await dish.save();
  } catch (exception) {
    for (field in exception.errors) {
      console.log(exception.errors[field].message);
    }
  }

  res.send(dish);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const dish = await Dish.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        publicId: req.body.publicId,
        category: req.body.category,
        name: req.body.name,
        amount: req.body.amount,
        dietary: req.body.dietary,
      },
    },
    // get updated document
    { new: true }
  );

  if (!dish)
    return res.status(404).send("The dish with the given ID was not found.");

  res.send(dish);
});

router.delete("/:id", async (req, res) => {
  const dish = await Dish.findByIdAndDelete(req.params.id);

  if (!dish)
    return res.status(404).send("The dish with the given ID was not found.");

  res.send(dish);
});

export default router;
