import express from "express";
import Middleware from "./middleware.js";
const app = express();
new Middleware(app);

app.listen(3000, () => {
  console.log("listening on Port : 3000");
});
