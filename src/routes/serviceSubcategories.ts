import { Router } from "express";
import ServiceSubcategory from "../models/ServiceSubcategory";

const router = Router();

router.get("/", async (_req, res) => {
  const serviceSubcategories = await ServiceSubcategory.find({});
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

export default router;
