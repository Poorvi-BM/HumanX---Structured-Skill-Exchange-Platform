import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/HumanX.css";

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const res = await API.get("humanx/sessions/my/");
    setSessions(res.data);
  };

  // Group sessions by date (YYYY-MM-DD)
  const groupedSessions = sessions.reduce((acc, session) => {
    const date = session.scheduled_at.split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(session);
    return acc;
  }, {});

  // Build simple current month calendar
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(new Date(year, month, d));
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "REQUESTED":
        return "#facc15";
      case "ACCEPTED":
        return "#38bdf8";
      case "COMPLETED":
        return "#22c55e";
      case "CANCELLED":
        return "#ef4444";
      default:
        return "#94a3b8";
    }
  };

  return (
    <div className="humanx-container">
      <h2 style={{ marginBottom: 30 }}>Session Calendar</h2>

      <div className="calendar-grid">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={index} className="calendar-cell empty"></div>;
          }

          const formatted = date.toISOString().split("T")[0];
          const daySessions = groupedSessions[formatted] || [];

          return (
            <div
              key={index}
              className="calendar-cell"
              onClick={() => setSelectedDate(formatted)}
            >
              <div className="calendar-date">
                {date.getDate()}
              </div>

              {daySessions.map((s) => (
                <div
                  key={s.id}
                  className="calendar-event"
                  style={{
                    backgroundColor: getStatusColor(s.status)
                  }}
                >
                  {s.status}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Selected Date Detail */}
      {selectedDate && (
        <div className="modal-backdrop">
          <div className="modal glass">
            <h3>Sessions on {selectedDate}</h3>

            {(groupedSessions[selectedDate] || []).map((s) => (
              <div key={s.id} className="post-card glass">
                <p>
                  {s.requester_username} → {s.provider_username}
                </p>
                <p>Status: {s.status}</p>
                <p>
                  {new Date(s.scheduled_at).toLocaleTimeString()}
                </p>
              </div>
            ))}

            <button
              className="post-btn"
              onClick={() => setSelectedDate(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySessions;
