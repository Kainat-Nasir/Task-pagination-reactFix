import { z } from 'zod';

export const getTasksQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10))
    .refine((n) => Number.isFinite(n) && n > 0 && n <= 50, {
      message: 'limit must be a number between 1 and 50'
    }),
  cursor: z.string().optional(),
  status: z.enum(['todo', 'doing', 'done']).optional()
});

export const createTaskSchema = z.object({
  title: z.string().min(1),
  status: z.enum(['todo', 'doing', 'done']),
  priority: z.number().int().optional()
});

export function validateQuery(schema) {
  return (req, _res, next) => {
    try {
      req.validated = schema.parse(req.query);
      next();
    } catch (e) {
      e.status = 400;
      next(e);
    }
  };
}

export function validateBody(schema) {
  return (req, _res, next) => {
    try {
      req.validated = schema.parse(req.body);
      next();
    } catch (e) {
      e.status = 400;
      next(e);
    }
  };
}