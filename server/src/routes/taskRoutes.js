import express from 'express';
import * as Repo from '../repo/taskRepo.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const tasks = await Repo.getTasks();
  res.json(tasks);
});

router.post('/', async (req, res) => {
  try {
    const task = await Repo.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const task = await Repo.getTaskById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Not found' });
  res.json(task);
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Repo.updateTask(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const ok = await Repo.deleteTask(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

export default router;
