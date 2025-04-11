import { Router } from "express";
import productRouter from './product/product.router';
import cartRouter from './cart-item/cart-item.router';
import authRouter from './auth/auth.router';
import userRouter from './user/user.router';

const router = Router();

router.use('/', authRouter);

router.use('/products', productRouter);
router.use('/cart', cartRouter);
router.use('/users', userRouter);

export default router;