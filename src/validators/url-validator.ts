import Joi from 'joi';

const UrlSchema = Joi.object({
  url: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required()
    .messages({
      'string.uri': 'Invalid URL format',
      'any.required': 'URL is required',
    }),
  customName: Joi.string().optional(),
});

export default UrlSchema;
