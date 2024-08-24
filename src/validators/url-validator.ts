import Joi from 'joi';

export const postUrlSchema = Joi.object({
  url: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required()
    .messages({
      'string.uri': 'Invalid URL format',
      'any.required': 'URL is required',
    }),
  customName: Joi.string().optional().min(5).message('Must be at least 5 letters'),
});

export const updateUrlSchema = Joi.object({
  url: Joi.string()
    .optional()
    .uri({ scheme: ['http', 'https'] }),
  customName: Joi.string().optional().min(5).message('Must be at least 5 letters'),
});
