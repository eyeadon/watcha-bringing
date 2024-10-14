import express from "express";
const router = express.Router();
import { Bev, validateBev as validate } from "../models/bev.js";

// get all
router.get("/", async (req, res) => {
  // sort by what order, name or category?
  const bevs = await Bev.find().sort("category");
  res.send(bevs);
});

// get single
router.get("/:id", async (req, res) => {
  const bev = await Bev.findById(req.params.id);

  if (!bev)
    return res.status(404).send("The bev with the given ID was not found.");
  res.send(bev);
});

// get single by publicId
router.get("/public/:publicId", async (req, res) => {
  if (req.params.publicId === "none") {
    res.send([]);
    return;
  }

  // console.log(req.params.publicId);

  const bev = await Bev.findOne({ publicId: req.params.publicId });

  if (!bev)
    return res
      .status(404)
      .send("The beverage with the given ID was not found.");

  res.send(bev);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const bev = new Bev({
    publicId: req.body.publicId,
    category: req.body.category,
    name: req.body.name,
    amount: req.body.amount,
  });

  try {
    // returns Promise, not stored here
    await bev.save();
  } catch (exception) {
    for (field in exception.errors) {
      console.log(exception.errors[field].message);
    }
  }

  res.send(bev);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const bev = await Bev.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        publicId: req.body.publicId,
        category: req.body.category,
        name: req.body.name,
        amount: req.body.amount,
      },
    },
    // get updated document
    { new: true }
  );

  if (!bev)
    return res.status(404).send("The bev with the given ID was not found.");

  res.send(bev);
});

router.delete("/:id", async (req, res) => {
  const bev = await Bev.findByIdAndDelete(req.params.id);

  if (!bev)
    return res.status(404).send("The bev with the given ID was not found.");

  res.send(bev);
});

export default router;
