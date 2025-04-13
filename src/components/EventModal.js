import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addEvent, updateEvent, deleteEvent } from "../redux/actions/events";
import "./EventModal.css";
import moment from "moment";

const EventModal = ({ isOpen, onRequestClose, slot, event }) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [color, setColor] = useState("#ff5733");
  const [category, setCategory] = useState("work");

  useEffect(() => {
    if (isOpen) {
      setTitle(event?.title || "");
      setStart(
        slot?.start || event?.start || moment().startOf("hour").toDate()
      );
      setEnd(
        slot?.end ||
          event?.end ||
          moment(slot?.start || event?.start || moment())
            .add(30, "minutes")
            .toDate()
      );
      setColor(event?.color || "#ff5733");
      setCategory(event?.category || "work");
    } else {
      setTitle("");
      setStart(new Date());
      setEnd(new Date());
      setColor("#ff5733");
      setCategory("work");
    }
  }, [isOpen, slot, event]);

  const formatDateTimeLocal = (date) =>
    moment(date).isValid() ? moment(date).format("YYYY-MM-DDTHH:mm") : "";

  const parseDateTimeLocal = (value) =>
    moment(value, "YYYY-MM-DDTHH:mm").isValid()
      ? moment(value, "YYYY-MM-DDTHH:mm").toDate()
      : null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!moment(start).isValid() || !moment(end).isValid()) {
      return;
    }

    if (moment(end).isSameOrBefore(start)) {
      return;
    }

    const eventData = {
      title,
      start: moment(start).toDate(),
      end: moment(end).toDate(),
      color,
      category,
    };

    if (event?._id) {
      dispatch(updateEvent(event._id, eventData));
    } else {
      dispatch(addEvent(eventData));
    }

    onRequestClose();
  };

  const handleDelete = () => {
    if (event?._id) {
      dispatch(deleteEvent(event._id));
    }
    onRequestClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{event ? "Edit Event" : "Create Event"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
          </label>
          <label>
            Start Time:
            <input
              type="datetime-local"
              value={formatDateTimeLocal(start)}
              onChange={(e) => {
                const newDate = parseDateTimeLocal(e.target.value);
                if (newDate) setStart(newDate);
              }}
              required
            />
          </label>
          <label>
            End Time:
            <input
              type="datetime-local"
              value={formatDateTimeLocal(end)}
              onChange={(e) => {
                const newDate = parseDateTimeLocal(e.target.value);
                if (newDate) setEnd(newDate);
              }}
              required
            />
          </label>
          <label>
            Color:
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
          <label>
            Category:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="exercise">Exercise</option>
              <option value="earing">Earing</option>
              <option value="work">Work</option>
              <option value="relax">Relax</option>
              <option value="family">Family</option>
              <option value="social">Social</option>
            </select>
          </label>
          <div className="modal-buttons">
            <button type="submit">
              {event ? "Update Event" : "Create Event"}
            </button>
            {event && (
              <button type="button" onClick={handleDelete}>
                Delete
              </button>
            )}
            <button type="button" onClick={onRequestClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
