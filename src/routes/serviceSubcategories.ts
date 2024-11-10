import { Router } from "express";
import ServiceSubcategory from "../models/ServiceSubcategory";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const serviceSubcategories = await ServiceSubcategory.find({}).sort({
      name: 1,
    });
    res.json(serviceSubcategories);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post("/", async (req, res) => {
  const newServiceSubcategory = new ServiceSubcategory({
    name: req.body.name,
    serviceCategory: req.body.serviceCategory,
  });

  try {
    const savedServiceSubcategory = await newServiceSubcategory.save();
    res.json(savedServiceSubcategory);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const serviceSubcategory = await ServiceSubcategory.findById(req.params.id);

    if (!serviceSubcategory) {
      res.sendStatus(404);
      return;
    }

    if (req.body.name) {
      serviceSubcategory.name = req.body.name;
    }
    if (req.body.serviceCategory) {
      serviceSubcategory.serviceCategory = req.body.serviceCategory;
    }

    const updatedServiceSubcategory = await serviceSubcategory.save();
    res.json(updatedServiceSubcategory);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export default router;
