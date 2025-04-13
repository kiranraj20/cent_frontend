import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGoals,
  fetchTasks,
  addGoal,
  addTasks,
  updateGoal,
  deleteGoal,
  updateTask,
  deleteTask,
} from "../redux/actions/events";
import GoalModal from "./GoalModal";
import "./Sidebar.css";
import { Draggable } from "@fullcalendar/interaction";
import moment from "moment";
import $ from "jquery";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";

const DraggableTask = ({ task, goal, onEdit, onDelete }) => {
  const taskRef = useRef(null);
  const draggableInstanceRef = useRef(null);

  useEffect(() => {
    if (taskRef.current && task) {
      const eventData = {
        title: task.name,
        duration: moment.duration(task.duration, "minutes").toISOString(),
        backgroundColor: goal.color || "#3788d8",
      };
      $(taskRef.current).attr("data-event", JSON.stringify(eventData));

      try {
        const draggable = new Draggable(taskRef.current, { eventData });
        draggableInstanceRef.current = draggable;

        $(taskRef.current).attr("data-event", JSON.stringify(eventData));
      } catch (error) {}

      return () => {
        draggableInstanceRef.current?.destroy();
      };
    }
  }, [task, goal]);

  return (
    <div
      ref={taskRef}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px",
        margin: "4px 0",
        color: "white",
        borderRadius: "4px",
        borderColor: goal.color || "#3788d8",
        cursor: "move",
        borderStyle: "solid",
        borderWidth: "0px 0px 1px 4px",
      }}
      title={`Drag task: ${task.name} (${task.duration} min)`}
    >
      <span style={{ flex: 1, color: "black" }}>
        {task.name} ({task.duration} min)
      </span>
      <button onClick={() => onDelete(task._id)} className="delete-button">
        <MdDeleteForever />
      </button>
    </div>
  );
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const goals = useSelector((state) => state.events.goals);
  const tasks = useSelector((state) => state.events.tasks);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [editTasks, setEditTasks] = useState([]);

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const handleGoalClick = (goalId) => {
    setSelectedGoal(goalId);
    dispatch(fetchTasks(goalId));
  };

  const handleSaveGoal = async (goal, taskData, goalId) => {
    if (goalId) {
      dispatch(updateGoal(goalId, goal));
      for (const task of taskData) {
        if (task._id) {
          dispatch(
            updateTask(goalId, task._id, {
              name: task.name,
              duration: task.duration,
            })
          );
        } else {
          dispatch(
            addTasks(goalId, [{ name: task.name, duration: task.duration }])
          );
        }
      }
      dispatch(fetchTasks(goalId));
    } else {
      try {
        const newGoalId = await dispatch(addGoal(goal));
        if (newGoalId && taskData.length > 0) {
          dispatch(addTasks(newGoalId, taskData));
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    if (goals.length > 0) {
      goals.forEach((goal) => {
        if (goal._id) {
          dispatch(fetchTasks(goal._id));
        }
      });
    }
  }, [dispatch, goals]);

  const handleEditGoal = (goal) => {
    setEditGoal(goal);
    setEditTasks(tasks[goal._id] || []);
    setGoalModalOpen(true);
  };

  const handleDeleteGoal = (goalId) => {
    dispatch(deleteGoal(goalId));
    if (selectedGoal === goalId) setSelectedGoal(null);
  };

  const handleEditTask = (task) => {
    setEditGoal(goals.find((g) => g._id === task.goalId));
    setEditTasks(
      tasks[task.goalId].map((t) => (t._id === task._id ? task : t))
    );
    setGoalModalOpen(true);
  };

  const handleDeleteTask = (goalId, taskId) => {
    dispatch(deleteTask(goalId, taskId));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Goals</h3>
        <button
          onClick={() => {
            setEditGoal(null);
            setEditTasks([]);
            setGoalModalOpen(true);
          }}
          className="create-button"
        >
          <FaPlus />
        </button>
      </div>
      {goals.map((goal) => (
        <div key={goal._id} className="goal-item">
          <div className="goal-header" style={{ backgroundColor: goal.color }}>
            <span onClick={() => handleGoalClick(goal._id)}>{goal.name}</span>
            <div>
              <button
                onClick={() => handleEditGoal(goal)}
                className="edit-button"
              >
                <MdEdit />
              </button>
              <button
                onClick={() => handleDeleteGoal(goal._id)}
                className="delete-button"
              >
                <MdDeleteForever />
              </button>
            </div>
          </div>
          {selectedGoal === goal._id && tasks[goal._id] && (
            <div className="task-list">
              {tasks[goal._id].map((task) => (
                <DraggableTask
                  key={task._id}
                  task={task}
                  goal={goal}
                  onEdit={handleEditTask}
                  onDelete={() => handleDeleteTask(goal._id, task._id)}
                />
              ))}
            </div>
          )}
        </div>
      ))}
      <GoalModal
        isOpen={goalModalOpen}
        onRequestClose={() => {
          setGoalModalOpen(false);
          setEditGoal(null);
          setEditTasks([]);
        }}
        onSave={handleSaveGoal}
        initialGoal={editGoal}
        initialTasks={editTasks}
      />
    </div>
  );
};

export default Sidebar;
