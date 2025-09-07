import { For, Show } from "solid-js";
import TaskCard from "./TaskCard";

export default function TaskList(props) {
  console.log("TaskList received tasks:", props.tasks);

  return (
    <div>
      <Show
        when={!props.loading}
        fallback={<div class="loading">Loading tasks...</div>}
      >
        <For each={props.tasks}>
          {(t) => (
            <TaskCard
              task={t}
              onDelete={props.onDelete}
              onUpdate={props.onUpdate}
            />
          )}
        </For>
        <Show when={props.tasks.length === 0}>
          <p class="empty">No tasks found.</p>
        </Show>
      </Show>
    </div>
  );
}
