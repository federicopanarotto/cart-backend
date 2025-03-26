import { genericHandler } from "./generic.error";
import { notFoundHandler } from "./not-found.error";

export const errorHandlers = [
  notFoundHandler,
  genericHandler
];