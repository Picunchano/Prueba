import { body } from 'express-validator';

export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido'),
  body('role')
    .isIn(['WORKER', 'EMPLOYER'])
    .withMessage('El rol debe ser WORKER o EMPLOYER'),
  body('phone')
    .notEmpty()
    .withMessage('El teléfono es requerido')
    .matches(/^(\+?56)?9\d{8}$/)
    .withMessage('Teléfono inválido. Use formato: +56912345678, 56912345678 o 912345678'),
];

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
];
