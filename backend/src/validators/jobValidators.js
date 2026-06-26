import { body } from 'express-validator';

export const createJobValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('La descripción es requerida'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('La ubicación es requerida'),
  body('hourlyRate')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La tarifa debe ser un número positivo'),
  body('schedule')
    .optional()
    .trim(),
];

export const updateJobValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El título no puede estar vacío'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('La descripción no puede estar vacía'),
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('La ubicación no puede estar vacía'),
  body('hourlyRate')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La tarifa debe ser un número positivo'),
  body('schedule')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['OPEN', 'CLOSED'])
    .withMessage('El estado debe ser OPEN o CLOSED'),
];
