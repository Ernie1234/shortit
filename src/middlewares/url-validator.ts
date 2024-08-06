import { Request, Response, NextFunction } from 'express';
import { postUrlSchema, updateUrlSchema } from '../validators/url-validator';

export const validatePostUrl = async (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = postUrlSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  req.body = value;
  return next();
};
export const validateUpdateUrl = async (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = updateUrlSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  req.body = value;
  return next();
};
