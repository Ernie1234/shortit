import { Request, Response, NextFunction } from 'express';
import { postUrlSchema, updateUrlSchema } from '../validators/url-validator';
import { getUpdateParams, validateFn } from '../utils/short-url-generator';
import HTTP_STATUS from '../utils/http-status';
import { notFoundMsg } from '../constants/messages';

export const validatePostUrl = async (req: Request, res: Response, next: NextFunction) => {
  validateFn(postUrlSchema, req, res, next);
};
export const validateUpdateUrl = async (req: Request, res: Response, next: NextFunction) => {
  validateFn(updateUrlSchema, req, res, next);
};
export const validateUpdateRequest = (req: Request, res: Response, next: NextFunction) => {
  const { id, url, customName } = getUpdateParams(req);

  if (!id) {
    return res.status(HTTP_STATUS.NOT_FOUND).send({ message: notFoundMsg });
  }

  if (!url && !customName) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'At least one field should be updated' });
  }

  return next();
};
