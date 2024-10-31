import { Router } from "express";
import User from "../models/User";

const router = Router();

router.post("/signin", async (req, res) => {
  const user = await User.findOne({ "contact.celphone": req.body.celphone });
  res.json(user);
});

export default router;
