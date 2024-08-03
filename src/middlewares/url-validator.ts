import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import UrlSchema from '../validators/url-validator';

const validateUrl = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = UrlSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  req.body = value;
  return next();
};

export default validateUrl;
