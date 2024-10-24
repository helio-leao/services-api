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

  await newServiceCategory.save();

  res.send(newServiceCategory);
});

export default router;
