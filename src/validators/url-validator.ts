import Joi from 'joi';

const urlSchema = Joi.string()
  .uri({ scheme: ['http', 'https'] })
  .regex(/^(http|https):\/\/[^\s#$./?].\S*$/) // Ensures it starts with http/https and has a valid structure
  .messages({
    'string.uri': 'Invalid URL format. URL must start with http or https.',
    'string.empty': 'url cannot be empty.',
    'string.pattern.base': 'Invalid URL structure.',
  });

export const postUrlSchema = Joi.object({
  url: urlSchema.required().messages({
    'any.required': 'Url is required.',
  }),
  customName: Joi.string().optional().min(5).message('Must be at least 5 letters'),
});

export const updateUrlSchema = Joi.object({
  url: Joi.string()
    .optional()
    .uri({ scheme: ['http', 'https'] }),
  customName: Joi.string().optional().min(5).message('Must be at least 5 letters'),
});
