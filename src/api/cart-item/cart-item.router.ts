import { Router } from "express";
import { add, list } from "./cart-item.controller";

const router = Router();

router.post('/', add);
router.get('/', list);

export default router;