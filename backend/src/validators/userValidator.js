const Joi = require('joi');

const phoneRegex = /^[0-9+\-() ]*$/;

const addressSchema = Joi.object({
  street: Joi.string().min(5).max(100).required(),
  city: Joi.string().min(2).max(50).required(),
  zipcode: Joi.string().pattern(/^[0-9]{5,10}$/).required(),
}).unknown(false);

const companySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
}).unknown(false);

const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().max(100).required(),
  phone: Joi.string().max(20).pattern(phoneRegex).allow('', null),
  website: Joi.string().uri().max(100).allow('', null),
  isActive: Joi.boolean().required(),
  skills: Joi.array().items(Joi.string().min(2).max(10)).default([]),
  availableSlots: Joi.array().items(Joi.string().isoDate()).default([]),
  address: addressSchema.required(),
  company: companySchema.required(),
  role: Joi.string().valid('Admin', 'Editor', 'Viewer').required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  username: Joi.string().min(3).max(20),
  email: Joi.string().email().max(100),
  phone: Joi.string().max(20).pattern(phoneRegex).allow('', null),
  website: Joi.string().uri().max(100).allow('', null),
  isActive: Joi.boolean(),
  skills: Joi.array().items(Joi.string().min(2).max(10)),
  availableSlots: Joi.array().items(Joi.string().isoDate()),
  address: addressSchema,
  company: companySchema,
  role: Joi.string().valid('Admin', 'Editor', 'Viewer'),
}).min(1); // at least one field

module.exports = { createUserSchema, updateUserSchema };
