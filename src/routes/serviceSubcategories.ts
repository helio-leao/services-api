import { Router } from "express";
import ServiceSubcategory from "../models/ServiceSubcategory";

const router = Router();

router.get("/", async (_req, res) => {
  const serviceSubcategories = await ServiceSubcategory.find({}).sort({
    name: 1,
  });
  res.send(serviceSubcategories);
});

router.post("/", async (req, res) => {
  const newServiceSubcategory = new ServiceSubcategory({
    name: req.body.name,
    serviceCategory: req.body.serviceCategory,
  });

  const savedServiceSubcategory = await newServiceSubcategory.save();
  res.send(savedServiceSubcategory);
});

router.patch("/:id", async (req, res) => {
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
  res.send(updatedServiceSubcategory);
});

export default router;
