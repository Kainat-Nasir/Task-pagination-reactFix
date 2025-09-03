import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    status: { type: String, enum: ['todo', 'doing', 'done'], required: true, index: true },
    priority: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

TaskSchema.index({ createdAt: -1, status: 1 });

export const Task = mongoose.model('Task', TaskSchema);