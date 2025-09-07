import { createSignal } from 'solid-js';

export default function TaskCard(props){
  const [editing, setEditing] = createSignal(false);
  const [title, setTitle] = createSignal(props.task.title);
  const [description, setDescription] = createSignal(props.task.description);
  const [status, setStatus] = createSignal(props.task.status);

  const save = async () => {
    const updates = { title: title().trim(), description: description().trim(), status: status() };
    await props.onUpdate(props.task._id, updates);
    setEditing(false);
  };

  return (
    <div class="card task">
      {editing() ? (
        <div class="task-edit">
          <input class="edit-title" value={title()} onInput={(e)=>setTitle(e.target.value)} />
          <textarea class="edit-desc" value={description()} onInput={(e)=>setDescription(e.target.value)} />
          <select value={status()} onInput={(e)=>setStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="done">Done</option>
          </select>
          <div class="task-actions">
            <button class="btn" onClick={()=>setEditing(false)}>Cancel</button>
            <button class="btn primary" onClick={save}>Save</button>
          </div>
        </div>
      ) : (
        <div class="task-view">
          <div class="task-info">
            <h3 class={props.task.status==='done' ? 'done' : ''}>{props.task.title}</h3>
            <p>{props.task.description}</p>
            <span class={'badge ' + props.task.status}>{props.task.status}</span>
          </div>
          <div class="task-actions">
            <button class="btn" onClick={()=>setEditing(true)}>Edit</button>
            <button class="btn danger" onClick={async ()=>{ if(confirm('Delete task?')) await props.onDelete(props.task._id); }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
