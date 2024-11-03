import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import serviceCategoriesRouter from "./routes/serviceCategories";
import serviceSubcategoriesRouter from "./routes/serviceSubcategories";

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.DATABASE_URL!)
  .then(() => console.log("Connected to database"))
  .catch((error) => console.error(error));

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/serviceCategories", serviceCategoriesRouter);
app.use("/serviceSubcategories", serviceSubcategoriesRouter);

app.listen(process.env.PORT!, () => console.log(`Server running`));
