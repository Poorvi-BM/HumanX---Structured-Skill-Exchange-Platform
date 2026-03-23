import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/PersonalWorkspace.css";

function PersonalWorkspace() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  /* ================= STATES ================= */

  // 🎯 Daily Focus (BACKEND)
  const [focus, setFocus] = useState("");

  // ⏱ Time
  const [seconds, setSeconds] = useState(0);

  // 📝 Tasks (LOCAL)
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);

  // 📌 To-Do (LOCAL)
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);

  // 📂 Projects (LOCAL)
  const [projectInput, setProjectInput] = useState("");
  const [projects, setProjects] = useState([]);

  // 🔥 Streak (LOCAL)
  const [streak, setStreak] = useState(1);

  // ✍️ Reflection (LOCAL)
  const [reflection, setReflection] = useState("");

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    // Local data
    setSeconds(Number(localStorage.getItem("todaySeconds")) || 0);
    setTasks(JSON.parse(localStorage.getItem("tasks")) || []);
    setTodos(JSON.parse(localStorage.getItem("todos")) || []);
    setProjects(JSON.parse(localStorage.getItem("projects")) || []);
    setReflection(localStorage.getItem("reflection") || "");

    // 🔥 Streak logic
    const lastDate = localStorage.getItem("lastActiveDate");
    const savedStreak = Number(localStorage.getItem("streakCount")) || 1;

    if (!lastDate) {
      localStorage.setItem("lastActiveDate", today);
      localStorage.setItem("streakCount", 1);
      setStreak(1);
    } else if (lastDate !== today) {
      const diff =
        (new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        const newStreak = savedStreak + 1;
        localStorage.setItem("streakCount", newStreak);
        setStreak(newStreak);
      } else {
        localStorage.setItem("streakCount", 1);
        setStreak(1);
      }
      localStorage.setItem("lastActiveDate", today);
    } else {
      setStreak(savedStreak);
    }

    // 🎯 Load Daily Focus from BACKEND
    API.get("workspace/focus/")
      .then((res) => {
        if (res.data?.text) {
          setFocus(res.data.text);
        }
      })
      .catch(() => {});
  }, [today]);

  /* ================= SAVE LOCAL DATA ================= */

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("reflection", reflection);
  }, [reflection]);

  /* ================= SAVE FOCUS TO BACKEND ================= */

  useEffect(() => {
    if (!focus) return;

    const timeout = setTimeout(() => {
      API.post("workspace/focus/", { text: focus });
    }, 800);

    return () => clearTimeout(timeout);
  }, [focus]);

  /* ================= TIMER ================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutesToday = Math.floor(seconds / 60);

  /* ================= UI ================= */

  return (
    <div className="workspace-page">
      <header className="workspace-header">
        <h1>Personal Workspace</h1>
        <button onClick={() => navigate("/dashboard")}>← Dashboard</button>
      </header>

      <div className="workspace-grid">

        {/* 🎯 DAILY FOCUS */}
        <div className="card">
          <h3>🎯 Daily Focus</h3>
          <input
            className="focus-input"
            placeholder="What matters today?"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
          />
          <div className="time-box">
            ⏱ {minutesToday} minutes today
          </div>
        </div>

        {/* 🔥 STREAK */}
        <div className="card streak-card">
          <h3>🔥 Streak</h3>
          <p className="streak-count">{streak} days</p>
          <p className="muted">You showed up</p>
        </div>

        {/* 📝 TASKS */}
        <div className="card">
          <h3>📝 Tasks</h3>
          <div className="task-input">
            <input
              placeholder="Add a task"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
            <button
              onClick={() => {
                if (!taskInput.trim()) return;
                setTasks([...tasks, { text: taskInput, done: false }]);
                setTaskInput("");
              }}
            >
              Add
            </button>
          </div>

          <ul className="task-list">
            {tasks.map((task, i) => (
              <li
                key={i}
                className={task.done ? "done" : ""}
                onClick={() => {
                  const updated = [...tasks];
                  updated[i].done = !updated[i].done;
                  setTasks(updated);
                }}
              >
                {task.done ? "✔" : "⬜"} {task.text}
              </li>
            ))}
          </ul>
        </div>

        {/* 📌 TODO */}
        <div className="card">
          <h3>📌 To-Do</h3>
          <div className="task-input">
            <input
              placeholder="Quick to-do"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
            />
            <button
              onClick={() => {
                if (!todoInput.trim()) return;
                setTodos([...todos, todoInput]);
                setTodoInput("");
              }}
            >
              Add
            </button>
          </div>

          <ul className="task-list">
            {todos.map((todo, i) => (
              <li key={i}>
                {todo}
                <span
                  style={{ marginLeft: 8, color: "#f87171", cursor: "pointer" }}
                  onClick={() =>
                    setTodos(todos.filter((_, idx) => idx !== i))
                  }
                >
                  ✖
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 📂 PROJECTS */}
        <div className="card">
          <h3>📂 Projects</h3>
          <div className="task-input">
            <input
              placeholder="Add a project"
              value={projectInput}
              onChange={(e) => setProjectInput(e.target.value)}
            />
            <button
              onClick={() => {
                if (!projectInput.trim()) return;
                setProjects([
                  ...projects,
                  { name: projectInput, completed: false },
                ]);
                setProjectInput("");
              }}
            >
              Add
            </button>
          </div>

          <ul className="task-list">
            {projects.map((p, i) => (
              <li
                key={i}
                onClick={() => {
                  const updated = [...projects];
                  updated[i].completed = !updated[i].completed;
                  setProjects(updated);
                }}
                style={{
                  opacity: p.completed ? 0.5 : 1,
                  textDecoration: p.completed ? "line-through" : "none",
                }}
              >
                {p.name} {p.completed ? "✓" : ""}
              </li>
            ))}
          </ul>
        </div>

        {/* 📊 INSIGHTS (PLACEHOLDER) */}
        <div className="card">
          <h3>📊 Insights</h3>
          <p className="muted">
            Weekly progress & focus trends coming soon
          </p>
        </div>

        {/* ✍️ REFLECTION */}
        <div className="card reflection-card">
          <h3>✍️ Reflection</h3>
          <textarea
            placeholder="What went well today?"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
        </div>

      </div>
    </div>
  );
}

export default PersonalWorkspace;
