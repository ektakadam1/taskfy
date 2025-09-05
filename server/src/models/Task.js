import mongoose from 'mongoose';

const STATUS = ['pending', 'in-progress', 'done'];

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, default: '' },
  status: { type: String, enum: STATUS, default: 'pending' }
}, { timestamps: true, versionKey: false });

TaskSchema.virtual('id').get(function() { return this._id.toHexString(); });
TaskSchema.set('toJSON', { virtuals: true });

export const Task = mongoose.model('Task', TaskSchema);
