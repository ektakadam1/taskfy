import express from 'express';
import cors from 'cors';
import { connectDB } from './src/db/connect.js';
import taskRoutes from './src/routes/taskRoutes.js';
import { ENV } from './src/config/env.js';

const app = express();
app.use(cors());
app.use(express.json());

await connectDB();

app.use('/api/tasks', taskRoutes);

app.get('/health', (_, res) => res.json({ ok: true }));

const PORT = ENV.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
