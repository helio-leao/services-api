import { Router } from "express";
import ServiceCategory from "../models/ServiceCategory";
import ServiceSubcategory from "../models/ServiceSubcategory";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const serviceCategories = await ServiceCategory.find({}).sort({ name: 1 });
    res.json(serviceCategories);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get("/:id/serviceSubcategories", async (req, res) => {
  try {
    const serviceSubcategories = await ServiceSubcategory.find({
      serviceCategory: req.params.id,
    })
      .populate("serviceCategory")
      .sort({ name: 1 });
    res.json(serviceSubcategories);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post("/", async (req, res) => {
  const newServiceCategory = new ServiceCategory({
    name: req.body.name,
    pictureUrl: req.body.pictureUrl,
  });

  try {
    const savedServiceCategory = await newServiceCategory.save();
    res.json(savedServiceCategory);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.patch("/:id", async (req, res) => {
  try {
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
    res.json(updatedServiceCategory);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export default router;
