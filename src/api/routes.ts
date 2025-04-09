import { Router } from "express";
import productRouter from './product/product.router';
import cartRouter from './cart-item/cart-item.router';
import authRouter from './auth/auth.router';

const router = Router();

router.use('/products', productRouter);
router.use('/cart', cartRouter);

router.use(authRouter);

export default router;