import axios from "axios";

export const FETCH_EVENTS = "FETCH_EVENTS";
export const ADD_EVENT = "ADD_EVENT";
export const UPDATE_EVENT = "UPDATE_EVENT";
export const DELETE_EVENT = "DELETE_EVENT";
export const FETCH_GOALS = "FETCH_GOALS";
export const FETCH_TASKS = "FETCH_TASKS";
export const ADD_GOAL = "ADD_GOAL";
export const ADD_TASKS = "ADD_TASKS";
export const UPDATE_GOAL = "UPDATE_GOAL";
export const DELETE_GOAL = "DELETE_GOAL";
export const UPDATE_TASK = "UPDATE_TASK";
export const DELETE_TASK = "DELETE_TASK";

export const fetchEvents = () => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/events`);
    dispatch({ type: FETCH_EVENTS, payload: response.data });
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

export const addEvent = (event) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/events`,
      event
    );
    dispatch({ type: ADD_EVENT, payload: response.data });
  } catch (error) {
    console.error("Error adding event:", error);
  }
};

export const updateEvent = (id, event) => async (dispatch) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/events/${id}`,
      event
    );
    dispatch({ type: UPDATE_EVENT, payload: response.data });
  } catch (error) {
    console.error("Error updating event:", error);
  }
};

export const deleteEvent = (id) => async (dispatch) => {
  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/events/${id}`);
    dispatch({ type: DELETE_EVENT, payload: id });
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};

export const fetchGoals = () => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/goals`);
    dispatch({ type: FETCH_GOALS, payload: response.data });
  } catch (error) {
    console.error("Error fetching goals:", error);
  }
};

export const fetchTasks = (goalId) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/tasks/${goalId}`
    );
    dispatch({ type: FETCH_TASKS, payload: { goalId, tasks: response.data } });
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

export const addGoal = (goal) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/goals`,
      goal
    );
    dispatch({ type: ADD_GOAL, payload: response.data });
    return response.data._id;
  } catch (error) {
    console.error("Error adding goal:", error);
  }
};

export const addTasks = (goalId, tasks) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/tasks`,
      { goalId, tasks }
    );
    dispatch({ type: ADD_TASKS, payload: { goalId, tasks: response.data } });
  } catch (error) {
    console.error("Error adding tasks:", error);
  }
};

export const updateGoal = (id, goal) => async (dispatch) => {
  try {
    const response = await axios.patch(
      `${process.env.REACT_APP_API_URL}/goals/${id}`,
      goal
    );
    dispatch({ type: UPDATE_GOAL, payload: response.data });
  } catch (error) {
    console.error("Error updating goal:", error);
  }
};

export const deleteGoal = (id) => async (dispatch) => {
  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/goals/${id}`);
    dispatch({ type: DELETE_GOAL, payload: id });
  } catch (error) {
    console.error("Error deleting goal:", error);
  }
};

export const updateTask = (goalId, taskId, task) => async (dispatch) => {
  try {
    const response = await axios.patch(
      `${process.env.REACT_APP_API_URL}/tasks/${taskId}`,
      task
    );
    dispatch({ type: UPDATE_TASK, payload: { goalId, task: response.data } });
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

export const deleteTask = (goalId, taskId) => async (dispatch) => {
  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`);
    dispatch({ type: DELETE_TASK, payload: { goalId, taskId } });
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};
