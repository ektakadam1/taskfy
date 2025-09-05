import { createSignal } from 'solid-js';

export default function TaskForm(props){
  const [title, setTitle] = createSignal('');
  const [description, setDescription] = createSignal('');
  const [status, setStatus] = createSignal('pending');

  const submit = async (e) => {
    e.preventDefault();
    if(!title().trim()) return;
    await props.onAdd({ title: title().trim(), description: description().trim(), status: status() });
    setTitle(''); setDescription(''); setStatus('pending');
  };

  return (
    <form class="card form" onSubmit={submit}>
      <h2>Create Task</h2>
      <input placeholder="Title" value={title()} onInput={(e)=>setTitle(e.target.value)} />
      <textarea placeholder="Description" value={description()} onInput={(e)=>setDescription(e.target.value)}></textarea>
      <select value={status()} onInput={(e)=>setStatus(e.target.value)}>
        <option value="pending">Pending</option>
        <option value="in-progress">In-Progress</option>
        <option value="done">Done</option>
      </select>
      <div class="form-actions">
        <button type="submit" class="btn primary">Add Task</button>
      </div>
    </form>
  );
}
