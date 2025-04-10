import { Response, NextFunction } from "express";
import { TypedRequest } from "../../lib/typed-request.interface";
import { AddUserDTO } from "./auth.dto";
import userSrv, { UserExistError } from "../user/user.service";
import { User } from "../user/user.entity";
import { omit, pick } from "lodash";
import passport, { use } from "passport";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../../lib/auth/jwt/jwt-strategy";

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
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('local', {session: false}, 
    (err, user, info) => {
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

      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7 days' });

      res.status(200).json({
        user,
        token
      });
    }
  )(req, res, next);
}

