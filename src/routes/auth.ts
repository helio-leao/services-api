import { Router } from "express";
import User from "../models/User";
import textflow from "textflow.js";

const router = Router();

textflow.useKey(process.env.TEXTFLOW_API_KEY);

router.post("/signin", async (req, res) => {
  const { cellphone, code } = req.body;

  try {
    const user = await User.findOne({ "contact.cellphone": cellphone });

    if (!user) {
      res.status(404).json({ ok: false, message: "User not found." });
      return;
    }
    if (!user.verified) {
      res.status(400).json({ ok: false, message: "User not verified." });
      return;
    }

    let result = await textflow.verifyCode(`+55${cellphone}`, code);

    if (!result.valid) {
      res.status(400).json(result);
      return;
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
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
      description: req.body.service.description,
      price: req.body.service.price,
      category: req.body.service.category,
      subcategory: req.body.service.subcategory,
    },
  });

  try {
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post("/send-sms-verification", async (req, res) => {
  const { cellphone } = req.body;

  try {
    const user = await User.findOne({ "contact.cellphone": cellphone });

    if (!user) {
      res.status(404).json({ ok: false, message: "User not found." });
      return;
    }

    // NOTE: default expiration time is 10 minutes
    const result = await textflow.sendVerificationSMS(`+55${cellphone}`, {
      service_name: "No Servico",
    });

    if (!result.ok) {
      res
        .status(400)
        .json({ ok: false, message: "It was not possible to send the code." });
      return;
    }

    res.json({ ok: true, message: "Verification SMS sent." });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post("/verify-account", async (req, res) => {
  const { cellphone, code } = req.body;

  try {
    const user = await User.findOne({ "contact.cellphone": cellphone });

    if (!user) {
      res.status(404).json({ ok: false, message: "User not found." });
      return;
    }
    if (user.verified) {
      res.status(400).json({ ok: false, message: "User already verified." });
      return;
    }

    let result = await textflow.verifyCode(`+55${cellphone}`, code);

    if (!result.valid) {
      res.status(400).json(result);
      return;
    }

    user.verified = true;
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export default router;
