import { createSignal } from 'solid-js';
import { createTask } from '../api';

export default function TaskForm(props){
  const [title, setTitle] = createSignal('');
  const [description, setDescription] = createSignal('');
  const [status, setStatus] = createSignal('pending');
  const [notification, setNotification] = createSignal('');
  const [error, setError] = createSignal(false);

  const submit = async (e) => {
    e.preventDefault();
    if(!title().trim()) return;
    try {
      const newTask = {
        title: title().trim(),
        description: description().trim(),
        status: status()
      };
      await props.onAdd(newTask);
      
      // Reset form
      setTitle('');
      setDescription('');
      setStatus('pending');
      
      // Show success notification
      setNotification('Task added successfully!');
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      setError(true);
      console.error('Error creating task:', error);
      setNotification('Failed to add task. Please try again.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <form class="card form" onSubmit={submit}>
      <h2>Create Task</h2>
      
      {/* Add notification display */}
      {notification() && (
        <div class={`notification ${error() ? 'error' : 'success'}`}>
          {notification()}
        </div>
      )}
      
      <input 
        placeholder="Title" 
        value={title()} 
        onInput={(e)=>setTitle(e.target.value)} 
        required
      />
      <textarea 
        placeholder="Description" 
        value={description()} 
        onInput={(e)=>setDescription(e.target.value)}
      />
      <select 
        value={status()} 
        onInput={(e)=>setStatus(e.target.value)}
      >
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