import express from "express";
import config from "./src/db/config.js";
import userRoutes from "./src/routers/userRouters.js";
import ownerRoutes from "./src/routers/ownerRouters.js";
import bookingRoutes from "./src/routers/bookingRouters.js";
import loginRoutes from "./src/routers/loginRouters.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(ownerRoutes);
// ownerRoutes (app);
// userRoutes(app);
app.use(userRoutes);
app.use(bookingRoutes);
app.use(loginRoutes);

app.get("/", (req, res) => {
  res.send("Hello testing testing 😂😂😂😊");
});
app.post("/create", (req, res) => {
  res.send("created a new http put");
});
app.delete("/delete", (req, res) => {
  res.send("deleted a name");
});

app.listen(config.port, () => {
  console.log(`server running at ${config.url}`);
});
