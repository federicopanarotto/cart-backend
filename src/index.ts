import { createServer } from "http";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import products from "../products.json";

const PORT: number = 3000;
const app = express();

app.use(cors());
app.use(morgan("tiny"));

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200);
  res.header({ "Content-Type": "text/plain" });
  res.send("Api online");
});

app.get("/api/products", (req: Request, res: Response, next: NextFunction) => {
  res.json(products);
});

app.get("/api/products/:id", (req: Request, res: Response, next: NextFunction) => {
    const id = req.params["id"];
    const product = products.find((p) => p.id === id);

    if (!product) {
      res.sendStatus(404);
      return;
    }
    res.json(product);
  }
);

createServer(app).listen(PORT, () => {
  console.log(`Server online -> http://localhost:${PORT}`);
});
