import { For } from 'solid-js';
import TaskCard from './TaskCard';

export default function TaskList(props){
  const tasks = props.tasks || [];
  return (
    <div>
      <For each={tasks}>{(t)=>
        <TaskCard task={t} onDelete={props.onDelete} onUpdate={props.onUpdate} />
      }</For>
      {tasks.length === 0 && <p class="empty">No tasks found.</p>}
    </div>
  );
}
