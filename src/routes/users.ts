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
  });

  const savedUser = await newUser.save();
  res.send(savedUser);
});

export default router;
