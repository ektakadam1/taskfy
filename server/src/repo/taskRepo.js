import { Task } from '../models/Task.js';
import { isDbConnected } from '../db/connect.js';
import { v4 as uuidv4 } from 'uuid';

const memory = { tasks: [] };

export async function createTask({ title, description = '', status = 'pending' }) {
  if (isDbConnected()) {
    const doc = await Task.create({ title, description, status });
    return doc.toJSON();
  } else {
    const id = uuidv4();
    const now = new Date().toISOString();
    const t = { id, title, description, status, createdAt: now, updatedAt: now };
    memory.tasks.unshift(t);
    return t;
  }
}

export async function getTasks() {
  if (isDbConnected()) {
    return Task.find().sort('-createdAt').lean({ virtuals: true });
  } else {
    return memory.tasks;
  }
}

export async function getTaskById(id) {
  if (isDbConnected()) {
    return Task.findById(id).lean({ virtuals: true });
  } else {
    return memory.tasks.find(t => t.id === id) || null;
  }
}

export async function updateTask(id, updates) {
  const allowed = ['title','description','status'];
  const safe = Object.fromEntries(Object.entries(updates).filter(([k])=>allowed.includes(k)));
  if (isDbConnected()) {
    return Task.findByIdAndUpdate(id, safe, { new: true, runValidators: true }).lean({ virtuals: true });
  } else {
    const idx = memory.tasks.findIndex(t=>t.id===id);
    if (idx === -1) return null;
    memory.tasks[idx] = { ...memory.tasks[idx], ...safe, updatedAt: new Date().toISOString() };
    return memory.tasks[idx];
  }
}

export async function deleteTask(id) {
  if (isDbConnected()) {
    const res = await Task.deleteOne({ _id: id });
    return res.deletedCount > 0;
  } else {
    const idx = memory.tasks.findIndex(t=>t.id===id);
    if (idx === -1) return false;
    memory.tasks.splice(idx,1);
    return true;
  }
}
