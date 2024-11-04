import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    gender: String,
    contact: {
      cellphone: String,
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
      title: String,
      description: String,
      category: { type: mongoose.Types.ObjectId, ref: "ServiceCategory" },
      subcategory: { type: mongoose.Types.ObjectId, ref: "ServiceSubcategory" },
    },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
