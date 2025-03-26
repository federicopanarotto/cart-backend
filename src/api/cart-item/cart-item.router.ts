import { Router } from "express";
import { add, list, remove, updateQuantity } from "./cart-item.controller";
import { validateFn } from "../../lib/validation.middleware";
import { AddCartItemDTO, UpdateCartQuantityDTO } from "./cart-item.dto";

const router = Router();

router.post('/', validateFn(AddCartItemDTO), add);
router.patch('/:id', validateFn(UpdateCartQuantityDTO), updateQuantity);
router.delete('/:id', remove);

router.get('/', list);

export default router;