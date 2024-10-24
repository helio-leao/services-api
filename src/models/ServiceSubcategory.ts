import mongoose from "mongoose";

const serviceSubcategorySchema = new mongoose.Schema({
  name: String,
  serviceCategory: { type: mongoose.Types.ObjectId, ref: "ServiceCategory" },
});

export default mongoose.model("ServiceSubcategory", serviceSubcategorySchema);
