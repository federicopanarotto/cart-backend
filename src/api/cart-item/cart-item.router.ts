import { Router } from "express";
import { add, list, updateQuantity } from "./cart-item.controller";

const router = Router();

router.post('/', add);
router.patch('/:id', updateQuantity);
router.get('/', list);

export default router;