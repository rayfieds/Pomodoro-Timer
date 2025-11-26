// src/components/TaskList.tsx
import { useState } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");

  const addTask = () => {
    if (!newTaskText.trim()) return;
    
    const newTask: Task = {
      id: Date.now(),  // simple unique id
      text: newTaskText.trim(),
      completed: false,
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskText("");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addTask();
  };

  return (
    <div className="task-list">
      <h2>Tasks</h2>
      
      <div className="task-input">
        <input
          type="text"
          placeholder="What are you working on?"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul className="tasks">
        {tasks.map(task => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <button className="checkbox" onClick={() => toggleTask(task.id)}>
              {task.completed ? "✔" : ""}
            </button>
            <span className="task-text">{task.text}</span>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}