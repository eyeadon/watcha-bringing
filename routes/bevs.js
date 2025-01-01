import express from "express";
const app = express();
const router = express.Router();
import { Bev, validateBev } from "../models/bev.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import { validate } from "../middleware/validate.js";
import cors from "cors";

app.use(cors());

// get all
router.get("/", async (req, res) => {
  // sort by what order, name or category?
  const bevs = await Bev.find().sort("category");
  res.send(bevs);
});

// get single
router.get("/:id", validateObjectId, async (req, res) => {
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

router.post("/", validate(validateBev), async (req, res) => {
  const bev = new Bev({
    publicId: req.body.publicId,
    userName: req.body.userName,
    category: req.body.category,
    name: req.body.name,
    amount: req.body.amount,
  });

  try {
    // returns Promise, not stored here
    await bev.save();
  } catch (exception) {
    // for (field in exception.errors) {
    console.log(exception);
  }

  res.send(bev);
});

router.put(
  "/:id",
  [validateObjectId, validate(validateBev)],
  async (req, res) => {
    const bev = await Bev.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          publicId: req.body.publicId,
          userName: req.body.userName,
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
  }
);

router.delete("/:id", validateObjectId, async (req, res) => {
  const bev = await Bev.findByIdAndDelete(req.params.id);

  if (!bev)
    return res.status(404).send("The bev with the given ID was not found.");

  res.send(bev);
});

export default router;
