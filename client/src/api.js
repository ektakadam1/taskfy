import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const getTasks = () => API.get('/tasks').then(r=>r.data);
export const createTask = (t)=> API.post('/tasks', t).then(r=>r.data);
export const updateTask = (id, u)=> API.put(`/tasks/${id}`, u).then(r=>r.data);
export const deleteTask = (id)=> API.delete(`/tasks/${id}`).then(r=>r.data);
