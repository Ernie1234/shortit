import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export function generateShortUrl(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}
export function convertToHyphenated(str: string): string {
  return str.split(' ').join('-');
}
export function validateFn<T>(schema: Schema<T>, req: Request, res: Response, next: NextFunction) {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  req.body = value as T;
  return next();
}
