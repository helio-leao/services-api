import { Router } from "express";
import User from "../models/User";
const textflow = require("textflow.js");

const router = Router();

textflow.useKey(process.env.TEXTFLOW_API_KEY);

router.post("/signin", async (req, res) => {
  const { cellphone, code } = req.body;

  // NOTE: verify if user exists and already verified
  const user = await User.findOne({ "contact.cellphone": cellphone });

  if (!user) {
    res.status(404).json({ ok: false, message: "User not found." });
    return;
  }
  if (!user.verified) {
    res.status(400).json({ ok: false, message: "User not verified." });
    return;
  }

  // NOTE: verify cellphone number via SMS
  let result = await textflow.verifyCode(`+55${cellphone}`, code);

  if (!result.valid) {
    res.status(400).json(result);
    return;
  }

  // NOTE: send back user data
  res.json(user);
});

router.post("/signup", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    gender: req.body.gender,
    contact: {
      cellphone: req.body.contact.cellphone,
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
  res.json(savedUser);
});

router.post("/send-sms-verification", async (req, res) => {
  const { cellphone } = req.body;

  // NOTE: verify if user exists
  const user = await User.findOne({ "contact.cellphone": cellphone });

  if (!user) {
    res.status(404).json({ ok: false, message: "User not found." });
    return;
  }

  // NOTE: send SMS with code to given number
  const result = await textflow.sendVerificationSMS(`+55${cellphone}`);

  if (result.ok) {
    res.json({ ok: true, message: "Verification SMS sent." });
  } else {
    res
      .status(400)
      .json({ ok: false, message: "It was not possible to send the code." });
  }
});

router.post("/verify-account", async (req, res) => {
  const { cellphone, code } = req.body;

  // NOTE: verify if user exists and already verified
  const user = await User.findOne({ "contact.cellphone": cellphone });

  if (!user) {
    res.status(404).json({ ok: false, message: "User not found." });
    return;
  }
  if (user.verified) {
    res.status(400).json({ ok: false, message: "User already verified." });
    return;
  }

  // NOTE: verify cellphone number via SMS
  let result = await textflow.verifyCode(`+55${cellphone}`, code);

  if (!result.valid) {
    res.status(400).json(result);
    return;
  }

  // NOTE: updates user verified status
  user.verified = true;
  const savedUser = await user.save();

  res.json(savedUser);
});

export default router;
