import {
  getOwners,
  createOwner,
  updateOwners,
  getSingleOwner,
  deleteOwners,
} from "../controllers/ownerControllers.js";
import express from "express";

const app = express();

app.get("/owners", getOwners);
app.get("/owners/:id", getSingleOwner);
app.post("/owners", createOwner);
app.put("/owners/:id", updateOwners);
app.delete("/owners/:id", deleteOwners);

export default app;
