import express from "express";
const router = express.Router();
import { Dish, validateDish } from "../models/dish.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import { validate } from "../middleware/validate.js";
import cors from "cors";

app.use(cors());

// get all
router.get("/", async (req, res) => {
  // sort by what order, name or category?
  const dishes = await Dish.find().sort("category");
  res.send(dishes);
});

// get single
router.get("/:id", validateObjectId, async (req, res) => {
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

router.post("/", validate(validateDish), async (req, res) => {
  const dish = new Dish({
    publicId: req.body.publicId,
    userName: req.body.userName,
    category: req.body.category,
    name: req.body.name,
    amount: req.body.amount,
    dietary: req.body.dietary,
  });

  try {
    // returns Promise, not stored here
    await dish.save();
  } catch (exception) {
    // for (field in exception.errors) {
    console.log(exception);
  }

  res.send(dish);
});

router.put(
  "/:id",
  [validateObjectId, validate(validateDish)],
  async (req, res) => {
    const dish = await Dish.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          publicId: req.body.publicId,
          userName: req.body.userName,
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
  }
);

router.delete("/:id", validateObjectId, async (req, res) => {
  const dish = await Dish.findByIdAndDelete(req.params.id);

  if (!dish)
    return res.status(404).send("The dish with the given ID was not found.");

  res.send(dish);
});

export default router;
