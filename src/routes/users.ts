import { Router } from "express";
import User from "../models/User";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const users = await User.find({ verified: true }).populate([
      "service.category",
      "service.subcategory",
    ]);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Note: price can be number or undefined. undefined deletes(unset) the field with the value from the database
router.patch("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate([
      "service.category",
      "service.subcategory",
    ]);

    if (!user) {
      res.status(404).json({ ok: false, message: "User not found." });
      return;
    }

    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.body.gender) {
      user.gender = req.body.gender;
    }
    if (req.body.contact?.cellphone) {
      user.contact!.cellphone = req.body.contact.cellphone;
    }
    if (req.body.contact?.email) {
      user.contact!.email = req.body.contact.email;
    }
    if (req.body.address?.street) {
      user.address!.street = req.body.address.street;
    }
    if (req.body.address?.district) {
      user.address!.district = req.body.address.district;
    }
    if (req.body.address?.number) {
      user.address!.number = req.body.address.number;
    }
    if (req.body.address?.complement) {
      user.address!.complement = req.body.address.complement;
    }
    if (req.body.address?.zip) {
      user.address!.zip = req.body.address.zip;
    }
    if (req.body.service?.description) {
      user.service!.description = req.body.service.description;
    }
    if (req.body.service?.category) {
      user.service!.category = req.body.service.category;
    }
    if (req.body.service?.subcategory) {
      user.service!.subcategory = req.body.service.subcategory;
    }

    user.service!.price = req.body.service?.price;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.patch("/:id/picture", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate([
      "service.category",
      "service.subcategory",
    ]);

    if (!user) {
      res.status(404).json({ ok: false, message: "User not found." });
      return;
    }

    if (req.body.picture?.base64) {
      user.picture!.base64 = req.body.picture.base64;
    }
    if (req.body.picture?.mimeType) {
      user.picture!.mimeType = req.body.picture.mimeType;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get("/search/:query", async (req, res) => {
  const regex = getDiacriticCaseInsensitiveRegex(req.params.query);

  try {
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
          $and: [
            {
              $or: [
                {
                  "service.category.name": { $regex: regex },
                },
                {
                  "service.subcategory.name": { $regex: regex },
                },
                {
                  "service.description": { $regex: regex },
                },
              ],
            },
            {
              verified: true,
            },
          ],
        },
      },
    ]);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate([
      "service.category",
      "service.subcategory",
    ]);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get("/searchByCellphone/:cellphone", async (req, res) => {
  const { cellphone } = req.params;

  try {
    const user = await User.findOne({ "contact.cellphone": cellphone });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

function getDiacriticCaseInsensitiveRegex(string: string) {
  string = string
    .replace(/a/g, "[a,á,à,ä,â]")
    .replace(/A/g, "[A,a,á,à,ä,â]")
    .replace(/e/g, "[e,é,ë,è]")
    .replace(/E/g, "[E,e,é,ë,è]")
    .replace(/i/g, "[i,í,ï,ì]")
    .replace(/I/g, "[I,i,í,ï,ì]")
    .replace(/o/g, "[o,ó,ö,ò]")
    .replace(/O/g, "[O,o,ó,ö,ò]")
    .replace(/u/g, "[u,ü,ú,ù]")
    .replace(/U/g, "[U,u,ü,ú,ù]");

  return new RegExp(string, "i");
}

export default router;
