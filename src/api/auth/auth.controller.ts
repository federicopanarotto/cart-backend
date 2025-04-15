import { Response, NextFunction } from "express";
import { TypedRequest } from "../../lib/typed-request.interface";
import { AddUserDTO, LoginDTO, RefreshTokenDTO } from "./auth.dto";
import userSrv, { UserExistError } from "../user/user.service";
import { User } from "../user/user.entity";
import { omit, pick } from "lodash";
import passport, { use } from "passport";
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { JWT_SECRET } from "../../lib/auth/jwt/jwt-strategy";
import { UserIdentityModel } from "../../lib/auth/local/user-identity.model";
import { UserModel } from "../user/user.model";
import { NotFoundError } from "../../errors/not-found.error";
import { generateTokens, resetRefreshToken } from "../../lib/auth/local/user-identity.service";

export const add = async (
  req: TypedRequest<AddUserDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData: User = omit(req.body, 'username', 'password');
    const credentialsData = pick(req.body, 'username', 'password');

    const newUser = await userSrv.add(userData, credentialsData)

    res.json(newUser);
  } catch (err) {
    if (err instanceof UserExistError) {
      res.status(400).json({
        error: err.name,
        message: err.message
      })
    }
    next(err);
  }
}

export const login = async(
  req: TypedRequest<LoginDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    passport.authenticate('local', {session: false}, 
      async (err, user, info) => {
        if (err) {
          next(err);
          return;
        }
  
        if (!user) {
          console.log(info);
          res.status(401).json({
            error: 'LoginError',
            message: info.message
          });
          return;
        }
  
        const tokens = await generateTokens(user);
  
        res.status(200).json({
          user,
          token: tokens.token,
          refreshToken: tokens.refreshToken
        });
      }
    )(req, res, next);
  } catch (err) {
    next(err);
  }
}

export const refreshToken = async(
  req: TypedRequest<RefreshTokenDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    let payload: JwtPayload | null = null;

    try {
      payload = jwt.decode(refreshToken) as JwtPayload;
    } catch (err) {
      next(err);
      return;
    }

    const user = omit(payload, 'iat', 'exp') as User;
    
    try {
      payload = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        await resetRefreshToken(user, refreshToken);
      }
      next(err);
      return;
    }

    const tokens = await generateTokens(user, refreshToken);

    res.status(200).json({
      user,
      token: tokens.token,
      refreshToken: tokens.refreshToken
    });
  } catch (err) {
    next(err);
  }
}
