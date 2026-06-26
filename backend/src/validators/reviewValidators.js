import { body } from 'express-validator';

export const createReviewValidation = [
  body('contractId')
    .isInt()
    .withMessage('El ID del contrato es requerido'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('La calificación debe ser entre 1 y 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('El comentario no puede exceder 500 caracteres'),
];
