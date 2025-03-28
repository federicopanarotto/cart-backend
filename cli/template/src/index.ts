import 'reflect-metadata';
import { createServer } from "http";
import mongoose from "mongoose";
import app from "./app";

mongoose.set("debug", true);
mongoose.connect("mongodb://localhost:27017/its-cart")
  .then((_) => {
    createServer(app).listen(3000, () => {
      console.log(`Backend online: http://localhost:3000`);
    });
  })
  .catch(err => {
    console.error(err)
  })