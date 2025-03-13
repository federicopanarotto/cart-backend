import { createServer } from "http";
import app from "./app";

const PORT = 3000;

createServer(app).listen(PORT, () => {
  console.log(`Online at -> http://localhost:${PORT}`);
});