import mongoose from "mongoose";

const serviceCategorySchema = new mongoose.Schema({
  name: String,
  pictureUrl: String,
});

export default mongoose.model("ServiceCategory", serviceCategorySchema);
