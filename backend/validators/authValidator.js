import Joi from 'joi';

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })
};

export const registerSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
      .required()
      .messages({ 'string.pattern.base': 'Password must contain at least one letter and one number' }),
    role: Joi.string().valid('owner', 'staff').optional(),
    adminCode: Joi.string().optional()
  })
};

export default { loginSchema, registerSchema };
