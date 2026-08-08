import Joi from 'joi';

const shippingAddressSchema = Joi.object({
  line1: Joi.string().trim().min(1).max(300).required(),
  city: Joi.string().trim().min(1).max(100).required(),
  state: Joi.string().trim().min(1).max(100).required(),
  pincode: Joi.string().trim().pattern(/^[0-9A-Za-z\- ]{3,12}$/).required()
});

const orderItemSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).max(50).required(),
  size: Joi.string().trim().max(20).optional()
});

export const checkoutSchema = {
  body: Joi.object({
    customerName: Joi.string().trim().min(1).max(150).required(),
    customerPhone: Joi.string().trim().pattern(/^[0-9+\-\s]{7,20}$/).required(),
    customerEmail: Joi.string().email().allow('', null).optional(),
    shippingAddress: shippingAddressSchema.required(),
    orderNotes: Joi.string().trim().max(1000).allow('', null).optional(),
    paymentMethod: Joi.string().valid('cod', 'upi', 'card', 'netbanking', 'wallet').optional(),
    items: Joi.array().items(orderItemSchema).min(1).required(),
    couponCode: Joi.string().trim().max(30).allow('', null).optional()
  })
};

export const updateOrderStatusSchema = {
  body: Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled').required()
  })
};

export default { checkoutSchema, updateOrderStatusSchema };
