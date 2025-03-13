import { Router } from "express";
import productRouter from './product/product.router';
import cartRouter from './cart-item/cart-item.router';

const router = Router();

router.use('/products', productRouter);
router.use('/cart', cartRouter);

export default router;