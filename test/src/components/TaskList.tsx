import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import { Link } from "react-router-dom";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export function TaskList() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load tasks on mount
  useEffect(() => {
    if (user) {
      // Load from database if logged in
      loadTasksFromDB();
    } else {
      // Load from localStorage if not logged in
      loadTasksFromLocalStorage();
    }
  }, [user]);

  const loadTasksFromDB = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const dbTasks = await api.getTasks(user.id);
      setTasks(dbTasks);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTasksFromLocalStorage = () => {
    const saved = localStorage.getItem("pomodoro-tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse tasks:", error);
      }
    }
  };

  const saveTasksToLocalStorage = (updatedTasks: Task[]) => {
    localStorage.setItem("pomodoro-tasks", JSON.stringify(updatedTasks));
  };

  const addTask = async () => {
    if (!newTaskText.trim()) return;

    if (user) {
      // Save to database
      try {
        const newTask = await api.createTask(user.id, newTaskText.trim());
        setTasks([...tasks, newTask]);
        setNewTaskText("");
      } catch (error) {
        console.error("Failed to create task:", error);
      }
    } else {
      // Save to localStorage
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setNewTaskText("");
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    if (user) {
      // Update in database
      try {
        await api.toggleTask(id, !task.completed);
        setTasks(
          tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          )
        );
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    } else {
      // Update in localStorage
      const updatedTasks = tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
    }
  };

  const deleteTask = async (id: string) => {
    if (user) {
      // Delete from database
      try {
        await api.deleteTask(id);
        setTasks(tasks.filter((t) => t.id !== id));
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    } else {
      // Delete from localStorage
      const updatedTasks = tasks.filter((t) => t.id !== id);
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addTask();
  };

  if (isLoading) {
    return (
      <div className="task-list">
        <h2>Tasks</h2>
        <p style={{ color: "white", opacity: 0.7 }}>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Tasks</h2>
        {!user && (
          <span style={{ fontSize: "0.8rem", color: "white", opacity: 0.7 }}>
            💾 Saved locally
          </span>
        )}
      </div>

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
        {tasks.map((task) => (
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

      {!user && tasks.length > 0 && (
        <p style={{ 
          marginTop: "12px", 
          fontSize: "0.85rem", 
          color: "white", 
          opacity: 0.8,
          textAlign: "center" 
        }}>
          <Link to="/login" style={{ color: "white", textDecoration: "underline" }}>
            Login
          </Link> to save your tasks across devices
        </p>
      )}
    </div>
  );
}