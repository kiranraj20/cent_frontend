import React, { useState, useEffect } from "react";
import "./GoalModal.css";

const GoalModal = ({
  isOpen,
  onRequestClose,
  onSave,
  initialGoal,
  initialTasks = [],
}) => {
  const [goalName, setGoalName] = useState("");
  const [goalColor, setGoalColor] = useState("#ff5733");
  const [tasks, setTasks] = useState([{ name: "", duration: "" }]);

  useEffect(() => {
    if (isOpen) {
      setGoalName(initialGoal?.name || "");
      setGoalColor(initialGoal?.color || "#ff5733");
      setTasks(
        initialTasks.length > 0
          ? initialTasks.map((task) => ({ ...task }))
          : [{ name: "", duration: "" }]
      );
    }
  }, [isOpen, initialGoal, initialTasks]);

  if (!isOpen) return null;

  const handleAddTask = () => {
    setTasks([...tasks, { name: "", duration: "" }]);
  };

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const goal = { name: goalName, color: goalColor };
    const taskData = tasks
      .filter((task) => task.name && task.duration)
      .map((task) => ({
        ...task,
        _id: task._id || undefined,
      }));

    onSave(goal, taskData, initialGoal?._id);
    setGoalName("");
    setGoalColor("#ff5733");
    setTasks([{ name: "", duration: "" }]);
    onRequestClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialGoal ? "Edit Goal" : "Create New Goal"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Goal Name:
            <input
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              required
            />
          </label>
          <label>
            Goal Color:
            <input
              type="color"
              value={goalColor}
              onChange={(e) => setGoalColor(e.target.value)}
            />
          </label>
          <h3>Tasks</h3>
          {tasks.map((task, index) => (
            <div
              key={index}
              style={{
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Task Name"
                value={task.name}
                onChange={(e) =>
                  handleTaskChange(index, "name", e.target.value)
                }
                style={{ width: "45%", marginRight: "5%" }}
              />
              <input
                type="number"
                placeholder="Duration (min)"
                value={task.duration}
                onChange={(e) =>
                  handleTaskChange(index, "duration", e.target.value)
                }
                style={{ width: "35%", marginRight: "5%" }}
                min="1"
              />
              <button
                type="button"
                onClick={() => handleDeleteTask(index)}
                style={{
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  padding: "5px",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTask}
            style={{
              backgroundColor: "#007aff",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "10px",
              width: "100%",
              marginBottom: "15px",
            }}
          >
            Add Task
          </button>
          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onRequestClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
