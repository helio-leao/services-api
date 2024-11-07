import { Router } from "express";
import User from "../models/User";

const router = Router();

router.get("/", async (_req, res) => {
  const users = await User.find({}).populate([
    "service.category",
    "service.subcategory",
  ]);
  res.json(users);
});

router.patch("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.sendStatus(404);
    return;
  }

  if (req.body.name) {
    user.name = req.body.name;
  }
  if (req.body.gender) {
    user.gender = req.body.gender;
  }
  if (req.body.contact?.cellphone) {
    user.contact.cellphone = req.body.contact.cellphone;
  }
  if (req.body.contact?.email) {
    user.contact.email = req.body.contact.email;
  }
  if (req.body.address?.street) {
    user.address.street = req.body.address.street;
  }
  if (req.body.address?.district) {
    user.address.district = req.body.address.district;
  }
  if (req.body.address?.number) {
    user.address.number = req.body.address.number;
  }
  if (req.body.address?.complement) {
    user.address.complement = req.body.address.complement;
  }
  if (req.body.address?.zip) {
    user.address.zip = req.body.address.zip;
  }
  if (req.body.service?.title) {
    user.service.title = req.body.service.title;
  }
  if (req.body.service?.description) {
    user.service.description = req.body.service.description;
  }
  if (req.body.service?.category) {
    user.service.category = req.body.service.category;
  }
  if (req.body.service?.subcategory) {
    user.service.subcategory = req.body.service.subcategory;
  }
  if (req.body.picture?.base64) {
    user.picture.base64 = req.body.picture.base64;
  }
  if (req.body.picture?.mimeType) {
    user.picture.mimeType = req.body.picture.mimeType;
  }

  const updatedUser = await user.save();
  res.json(updatedUser);
});

router.get("/search/:searchString", async (req, res) => {
  const regex = new RegExp(req.params.searchString, "i");

  const user = await User.aggregate([
    {
      $lookup: {
        from: "servicecategories",
        localField: "service.category",
        foreignField: "_id",
        as: "service.category",
      },
    },
    {
      $lookup: {
        from: "servicesubcategories",
        localField: "service.subcategory",
        foreignField: "_id",
        as: "service.subcategory",
      },
    },
    {
      $unwind: {
        path: "$service.category",
      },
    },
    {
      $unwind: {
        path: "$service.subcategory",
      },
    },
    {
      $match: {
        $or: [
          {
            "service.category.name": { $regex: regex },
          },
          {
            "service.subcategory.name": { $regex: regex },
          },
        ],
      },
    },
  ]);

  res.json(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).populate([
    "service.category",
    "service.subcategory",
  ]);
  res.json(user);
});

router.get("/searchByCellphone/:cellphone", async (req, res) => {
  const { cellphone } = req.params;
  const user = await User.findOne({ "contact.cellphone": cellphone });
  res.json(user);
});

export default router;
