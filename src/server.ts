import express from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users";

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.DATABASE_URL!)
  .then(() => console.log("Connected to database"))
  .catch((error) => console.error(error));

app.use("/users", usersRouter);

app.listen(process.env.PORT!, () => console.log(`Server running`));
