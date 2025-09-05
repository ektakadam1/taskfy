import { createResource, createSignal } from 'solid-js';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

export default function App(){
  const [query, setQuery] = createSignal('');
  const [statusFilter, setStatusFilter] = createSignal('all');
  const [tasks, { mutate, refetch }] = createResource(getTasks);

  const handleAdd = (task) => mutate([task, ...tasks()]);
  const handleDelete = (id) => mutate(tasks().filter(t=>t.id!==id));
  const handleUpdate = (updated) => mutate(tasks().map(t=> t.id===updated.id ? updated : t));

  const filtered = () => {
    const q = query().toLowerCase();
    return (tasks()||[]).filter(t=>{
      if(statusFilter() !== 'all' && t.status !== statusFilter()) return false;
      if(q && !t.title.toLowerCase().includes(q)) return false;
      return true;
    });
  };

  return (
    <div class="app">
      <header class="header">
        <h1>Taskify</h1>
        <p class="sub">Manage your tasks — fast & simple</p>
      </header>

      <main class="container">
        <section class="left">
          <TaskForm onAdd={async (payload)=>{ const t = await createTask(payload); handleAdd(t); }} />
        </section>

        <section class="right">
          <div class="controls">
            <input placeholder="Search title..." value={query()} onInput={(e)=>setQuery(e.target.value)} />
            <select value={statusFilter()} onInput={(e)=>setStatusFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="done">Done</option>
            </select>
            <button onClick={()=>refetch()}>Refresh</button>
          </div>

          <TaskList tasks={filtered()} onDelete={async (id)=>{ await deleteTask(id); handleDelete(id); }} onUpdate={async (id, updates)=>{ const u = await updateTask(id, updates); handleUpdate(u); }} />
        </section>
      </main>

      <footer class="footer">Built with SolidJS • Plain CSS</footer>
    </div>
  );
}
