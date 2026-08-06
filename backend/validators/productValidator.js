import Joi from 'joi';

export const createProductSchema = {
  body: Joi.object({
    title: Joi.string().min(1).required(),
    slug: Joi.string().optional(),
    description: Joi.string().min(1).required(),
    shortDescription: Joi.string().optional(),
    brand: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().required(),
    discountPrice: Joi.number().optional(),
    images: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
    sizes: Joi.alternatives().try(Joi.array().items(Joi.object({ size: Joi.string().required(), stock: Joi.number().min(0).required() })), Joi.string()).required(),
    colors: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
    material: Joi.string().optional(),
    isFeatured: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
  })
};

export const updateProductSchema = {
  body: Joi.object({
    title: Joi.string().optional(),
    slug: Joi.string().optional(),
    description: Joi.string().optional(),
    shortDescription: Joi.string().optional(),
    brand: Joi.string().optional(),
    category: Joi.string().optional(),
    price: Joi.number().optional(),
    discountPrice: Joi.number().optional(),
    images: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
    sizes: Joi.alternatives().try(Joi.array().items(Joi.object({ size: Joi.string().required(), stock: Joi.number().min(0).required() })), Joi.string()).optional(),
    colors: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
    material: Joi.string().optional(),
    isFeatured: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
  })
};

export default { createProductSchema, updateProductSchema };
