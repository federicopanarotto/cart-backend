import { Router } from "express";
import { add, list, remove, updateQuantity } from "./cart-item.controller";
import { validateFn } from "../../lib/validation.middleware";
import { AddCartItemDTO, UpdateCartQuantityDTO } from "./cart-item.dto";
import { isAuthenticated } from "../../lib/auth/auth.middleware";

const router = Router();

router.post('/', isAuthenticated, validateFn(AddCartItemDTO), add);
router.patch('/:id', isAuthenticated, validateFn(UpdateCartQuantityDTO), updateQuantity);
router.delete('/:id', isAuthenticated, remove);

router.get('/', isAuthenticated, list);

export default router;