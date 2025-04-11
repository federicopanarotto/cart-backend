import 'reflect-metadata';
import { createServer } from "http";
import mongoose from "mongoose";
import app from "./app";

const PORT = 3000;

mongoose.set("debug", true);
mongoose.connect("mongodb://localhost:27017/its-cart")
  .then((_) => {
    createServer(app).listen(PORT, () => {
      console.log('Connected to db')
      console.log(`Running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(err)
  })