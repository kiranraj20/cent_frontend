import {
  FETCH_EVENTS,
  ADD_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  FETCH_GOALS,
  FETCH_TASKS,
  ADD_GOAL,
  ADD_TASKS,
  UPDATE_GOAL,
  DELETE_GOAL,
  UPDATE_TASK,
  DELETE_TASK,
} from "../actions/events";

const initialState = {
  events: [],
  goals: [],
  tasks: {},
};

export default function eventsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_EVENTS:
      return { ...state, events: action.payload };
    case ADD_EVENT:
      return { ...state, events: [...state.events, action.payload] };
    case UPDATE_EVENT:
      return {
        ...state,
        events: state.events.map((event) =>
          event._id === action.payload._id ? action.payload : event
        ),
      };
    case DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter((event) => event._id !== action.payload),
      };
    case FETCH_GOALS:
      return { ...state, goals: action.payload };
    case FETCH_TASKS:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.goalId]: action.payload.tasks,
        },
      };
    case ADD_GOAL:
      return { ...state, goals: [...state.goals, action.payload] };
    case ADD_TASKS:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.goalId]: [
            ...(state.tasks[action.payload.goalId] || []),
            ...action.payload.tasks,
          ],
        },
      };
    case UPDATE_GOAL:
      return {
        ...state,
        goals: state.goals.map((g) =>
          g._id === action.payload._id ? action.payload : g
        ),
      };
    case DELETE_GOAL:
      return {
        ...state,
        goals: state.goals.filter((g) => g._id !== action.payload),
        tasks: { ...state.tasks, [action.payload]: undefined },
      };
    case UPDATE_TASK:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.goalId]: state.tasks[action.payload.goalId].map((t) =>
            t._id === action.payload.task._id ? action.payload.task : t
          ),
        },
      };
    case DELETE_TASK:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.goalId]: state.tasks[action.payload.goalId].filter(
            (t) => t._id !== action.payload.taskId
          ),
        },
      };
    default:
      return state;
  }
}
