import { Router } from "express";
import ServiceCategory from "../models/ServiceCategory";

const router = Router();

router.get("/", async (_req, res) => {
  const serviceCategories = await ServiceCategory.find({});
  res.send(serviceCategories);
});

router.post("/", async (req, res) => {
  const newServiceCategory = new ServiceCategory({
    name: req.body.name,
    pictureUrl: req.body.pictureUrl,
  });

  const savedServiceCategory = await newServiceCategory.save();
  res.send(savedServiceCategory);
});

router.patch("/:id", async (req, res) => {
  const serviceCategory = await ServiceCategory.findById(req.params.id);

  if (!serviceCategory) {
    res.sendStatus(404);
    return;
  }

  if (req.body.name) {
    serviceCategory.name = req.body.name;
  }
  if (req.body.pictureUrl) {
    serviceCategory.pictureUrl = req.body.pictureUrl;
  }

  const updatedServiceCategory = await serviceCategory.save();
  res.send(updatedServiceCategory);
});

export default router;
