import { createSignal, onMount, Show } from 'solid-js';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

export default function App() {
  const [query, setQuery] = createSignal('');
  const [statusFilter, setStatusFilter] = createSignal('all');
  const [response, setResponse] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [isDataLoaded, setIsDataLoaded] = createSignal(false);
  onMount(async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      const uniqueTasks = Array.from(
        new Map(res.map(task => [task._id, task])).values()
      );
      setResponse(uniqueTasks);
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  });


  const handleAdd = async (task) => {
    try {
      const newTask = await createTask(task);
      setResponse((prev) => [newTask, ...(prev || [])]);
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

 
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setResponse((prev) => prev.filter((t) => t._id !== id));
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdate = async (id, updated) => {
    debugger
    try {
      const updatedTask = await updateTask(id, updated);
      setResponse((prev) =>
        prev.map((t) => (t._id === id ? updatedTask : t))
      );
      console.log("updated tasks",response())
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const filtered = () => {
    const tasks = response();
    if (!tasks || tasks.length === 0) return [];

    const q = query().toLowerCase();
    const status = statusFilter();
    return tasks.filter((task) => {
      if (status !== 'all' && task.status !== status) return false;
      if (q && !task.title.toLowerCase().includes(q)) return false;
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
          <TaskForm onAdd={handleAdd} />
        </section>

        <section class="right">
          <div class="controls">
            <input
              placeholder="Search title..."
              value={query()}
              onInput={(e) => setQuery(e.target.value)}
            />
            <select
              value={statusFilter()}
              onInput={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="done">Done</option>
            </select>
            <button
              onClick={() => {
                setLoading(true);
                getTasks()
                  .then((res) => {
                    setResponse(res);
                    setIsDataLoaded(true);
                  })
                  .finally(() => setLoading(false));
              }}
            >
              Refresh
            </button>
          </div>

          <Show
            when={isDataLoaded()}
            fallback={<div class="loading">Loading tasks...</div>}
          >
            <TaskList
              tasks={filtered()}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </Show>
        </section>
      </main>

      <footer class="footer">Built with SolidJS • Plain CSS</footer>
    </div>
  );
}
