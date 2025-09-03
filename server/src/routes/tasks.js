import express from 'express';
import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { validateQuery, getTasksQuerySchema, validateBody, createTaskSchema } from '../middleware/validate.js';

const router = express.Router();

router.get('/', validateQuery(getTasksQuerySchema), async (req, res, next) => {
  try {
    const { limit, cursor, status } = req.validated;

    const filter = {};
    if (status) filter.status = status;

    let createdAtCursor = null;
    if (cursor) {
      if (!mongoose.isValidObjectId(cursor)) {
        const err = new Error('cursor must be a valid ObjectId');
        err.status = 400;
        throw err;
      }
      const lastDoc = await Task.findById(cursor).select('_id createdAt status');
      if (!lastDoc) {
        const err = new Error('cursor not found');
        err.status = 400;
        throw err;
      }
      if (status && lastDoc.status !== status) {
        const err = new Error('cursor does not belong to the requested status');
        err.status = 400;
        throw err;
      }
      createdAtCursor = lastDoc.createdAt;
      filter.$or = [
        { createdAt: { $lt: createdAtCursor }, ...(status ? { status } : {}) },
        { createdAt: createdAtCursor, _id: { $lt: lastDoc._id }, ...(status ? { status } : {}) }
      ];
    }

    const items = await Task.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .select('title status priority createdAt');

    const nextCursor = items.length === limit ? items[items.length - 1]._id.toString() : null;

    res.json({ items, nextCursor });
  } catch (err) {
    next(err);
  }
});

router.post('/', validateBody(createTaskSchema), async (req, res, next) => {
  try {
    const task = await Task.create(req.validated);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

export default router;