import { Router } from "express";
import { validateFn } from "../../lib/validation.middleware";
import { AddUserDTO, LoginDTO, RefreshTokenDTO } from "./auth.dto";
import { add, login, refreshToken } from "./auth.controller";

const router = Router();

router.post('/register', validateFn(AddUserDTO), add);
router.post('/login', validateFn(LoginDTO), login)
router.post('/refreshToken', validateFn(RefreshTokenDTO), refreshToken)

export default router;