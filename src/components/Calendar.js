import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, updateEvent } from "../redux/actions/events";
import EventModal from "./EventModal";
import "moment-timezone";
import "./Calendar.css";
import $ from "jquery";

const MyCalendar = ({ onTaskDrop }) => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.events);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState("timeGridWeek");
  const [currentDate, setCurrentDate] = useState(moment().toDate());
  const calendarRef = useRef(null);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleDateClick = (arg) => {
    let slotStart, slotEnd;
    if (currentView === "dayGridMonth") {
      slotStart = moment(arg.date)
        .startOf("day")
        .set({ hour: 9, minute: 0 })
        .toDate();
      slotEnd = moment(slotStart).add(30, "minutes").toDate();
    } else {
      slotStart = moment(arg.date).startOf("minutes").toDate();
      slotEnd = moment(slotStart).add(30, "minutes").toDate();
    }
    setSelectedSlot({ start: slotStart, end: slotEnd });
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleEventClick = (arg) => {
    const event = arg.event;
    setSelectedEvent({
      _id: event.id,
      title: event.title,
      start: moment(event.start).toDate(),
      end: moment(event.end).toDate(),
      color: event.backgroundColor,
    });
    setSelectedSlot(null);
    setModalOpen(true);
  };

  const handleEventDrop = (arg) => {
    const event = arg.event;
    const duration = moment(event.end).diff(moment(event.start), "minutes");
    let newStart = moment(arg.event.start).startOf("minutes").toDate();
    let newEnd = moment(newStart).add(duration, "minutes").toDate();

    dispatch(
      updateEvent(event.id, {
        _id: event.id,
        title: event.title,
        start: newStart,
        end: newEnd,
        color: event.backgroundColor,
      })
    );
  };

  const handleEventResize = (arg) => {
    const event = arg.event;
    dispatch(
      updateEvent(event.id, {
        _id: event.id,
        title: event.title,
        start: moment(event.start).toDate(),
        end: moment(event.end).toDate(),
        color: event.backgroundColor,
      })
    );
  };

  const handleViewChange = (view) => {
    setCurrentView(view.view.type);
  };

  const handleDrop = (info) => {
    const { date, draggedEl } = info;
    const eventData = $(draggedEl).attr("data-event");

    if (eventData) {
      try {
        const parsedData = JSON.parse(eventData);
        const duration = moment.duration(parsedData.duration);
        const start = moment(date).toDate();
        const end = moment(start).add(duration).toDate();

        setSelectedSlot({ start, end });
        setSelectedEvent({
          title: parsedData.title,
          color: parsedData.backgroundColor,
        });
        setModalOpen(true);
      } catch (error) {}
    } else {
    }
  };

  const normalizedEvents = events.map((event) => ({
    id: event._id,
    title: event.title,
    start: moment(event.start).toDate(),
    end: moment(event.end).toDate(),
    borderColor: event.color,
  }));

  return (
    <div
      ref={calendarRef}
      style={{
        height: "95vh",
        padding: "20px",
      }}
    >
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={currentView}
        events={normalizedEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        editable={true}
        droppable={true}
        drop={handleDrop}
        height="100%"
        eventTextColor="Black"
        headerToolbar={{
          left: "prev today next",
          center: "title",
          right: "timeGridDay,timeGridWeek,dayGridMonth",
        }}
        snapDuration="00:05:00"
        slotDuration="00:30:00"
        slotLabelInterval="00:05:00"
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
        allDaySlot={false}
        datesSet={(dateInfo) => {
          handleViewChange(dateInfo);
          setCurrentDate(moment(dateInfo.start).toDate());
        }}
        navLinks
      />
      <EventModal
        isOpen={modalOpen}
        onRequestClose={() => {
          setModalOpen(false);
          setSelectedSlot(null);
          setSelectedEvent(null);
        }}
        slot={selectedSlot}
        event={selectedEvent}
      />
    </div>
  );
};

export default MyCalendar;
