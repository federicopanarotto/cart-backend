import { ParsedQs } from 'qs';
import { ParamsDictionary } from 'express-serve-static-core';
import { Request } from 'express';
import { User } from '../api/user/user.entity';

export interface TypedRequest<B = any, Q = ParsedQs, P = ParamsDictionary> extends Request<P, any, B, Q> {};

export interface AuthRequest<B = any, Q = ParsedQs, P = ParamsDictionary> extends TypedRequest<B, Q, P> {
  user: User;
};


export { ParamsDictionary, ParsedQs, Request };