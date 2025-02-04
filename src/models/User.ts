import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    gender: String,
    contact: {
      cellphone: { type: String, unique: true },
      email: String,
    },
    address: {
      street: String,
      district: String,
      number: String,
      complement: String,
      zip: String,
    },
    service: {
      type: {
        description: String,
        price: Number,
        category: {
          type: mongoose.Types.ObjectId,
          ref: "ServiceCategory",
        },
        subcategory: {
          type: mongoose.Types.ObjectId,
          ref: "ServiceSubcategory",
        },
      },
      _id: false,
      default: null,
    },
    picture: {
      base64: String,
      mimeType: String,
    },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
