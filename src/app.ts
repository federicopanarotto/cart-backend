import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./api/routes";
import { errorHandlers } from "./errors/errors.index";
import './lib/auth/auth.handlers';


const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.json());

app.use('/api', router);

app.use(errorHandlers);

export default app;