import { ParsedQs } from 'qs';
import { ParamsDictionary } from 'express-serve-static-core';
import { Request } from 'express';

export interface TypedRequest<B = any, Q = ParsedQs, P = ParamsDictionary> extends Request<P, any, B, Q> {};

export { ParamsDictionary, ParsedQs, Request };