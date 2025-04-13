import React, { useState } from "react";
import { Provider } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import store from "./redux/store";
import MyCalendar from "./components/Calendar";
import Sidebar from "./components/Sidebar";
import EventModal from "./components/EventModal";
import "./App.css";

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [taskDropData, setTaskDropData] = useState(null);

  const handleTaskDrop = (task, goal, slot) => {
    setTaskDropData({
      task,
      goal,
      slot: {
        start: slot.start,
        end: slot.end,
      },
    });
    setModalOpen(true);
  };

  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <div
          style={{
            display: "flex",
            backgroundColor: "#f5f5f7",
            minHeight: "100vh",
          }}
        >
          <Sidebar />
          <div style={{ flex: 1 }}>
            <MyCalendar onTaskDrop={handleTaskDrop} />
          </div>
        </div>
        {modalOpen && taskDropData && (
          <EventModal
            isOpen={modalOpen}
            onRequestClose={() => {
              setModalOpen(false);
              setTaskDropData(null);
            }}
            slot={taskDropData.slot}
            event={{
              title: taskDropData.task.name,
              color: taskDropData.goal.color,
              start: taskDropData.slot.start,
              end: taskDropData.slot.end,
              category: "work",
            }}
          />
        )}
      </DndProvider>
    </Provider>
  );
};

export default App;
