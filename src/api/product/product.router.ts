import { Router } from "express";
import { list, get } from "./product.controller";
import { validateFn } from "../../lib/validation.middleware";
import { QueryProductsDTO } from "./product.dto";

const router = Router();

router.get('/', validateFn(QueryProductsDTO, 'query'), list);
router.get('/:id', get);

export default router;