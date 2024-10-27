import { Router } from "express";
import User from "../models/User";

const router = Router();

router.get("/", async (_req, res) => {
  const users = await User.find({});
  res.send(users);
});

router.post("/", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    gender: req.body.gender,
    contact: {
      celphone: req.body.contact.celphone,
      email: req.body.contact.email,
    },
    address: {
      street: req.body.address.street,
      district: req.body.address.district,
      number: req.body.address.number,
      complement: req.body.address.complement,
      zip: req.body.address.zip,
    },
    service: {
      title: req.body.service.title,
      description: req.body.service.description,
      category: req.body.service.category,
      subcategory: req.body.service.subcategory,
    },
  });

  const savedUser = await newUser.save();
  res.send(savedUser);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).populate([
    "service.category",
    "service.subcategory",
  ]);
  res.send(user);
});

export default router;
