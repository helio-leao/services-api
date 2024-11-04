import { Router } from "express";
import User from "../models/User";
const textflow = require("textflow.js");

const router = Router();

textflow.useKey(process.env.TEXTFLOW_API_KEY);

router.post("/signin", async (req, res) => {
  const user = await User.findOne({ "contact.cellphone": req.body.cellphone });
  res.json(user);
});

router.post("/signup", async (req, res) => {
  const { cellphone } = req.body;
  const result = await textflow.sendVerificationSMS(`+55${cellphone}`);
  res.json(result);
});

router.post("/verify", async (req, res) => {
  const { cellphone, code } = req.body;
  let result = await textflow.verifyCode(`+55${cellphone}`, code);
  res.json(result);
});

export default router;
