import { Request, Response, NextFunction } from 'express';
import { postUrlSchema, updateUrlSchema } from '../validators/url-validator';
import { validateFn } from '../utils/short-url-generator';

export const validatePostUrl = async (req: Request, res: Response, next: NextFunction) => {
  validateFn(postUrlSchema, req, res, next);
};
export const validateUpdateUrl = async (req: Request, res: Response, next: NextFunction) => {
  validateFn(updateUrlSchema, req, res, next);
};
