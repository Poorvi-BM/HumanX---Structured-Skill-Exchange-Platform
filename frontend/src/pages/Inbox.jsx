import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/HumanX.css";

const Inbox = () => {
  const [helpOffers, setHelpOffers] = useState([]);
  const [collabRequests, setCollabRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInbox();
  }, []);

  const loadInbox = async () => {
    try {
      const helpRes = await API.get("humanx/my/help/");
      const collabRes = await API.get("humanx/my/collab/");

      setHelpOffers(helpRes.data);
      setCollabRequests(collabRes.data);
    } catch (err) {
      console.error("Inbox load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const bookSession = async (offer) => {
    try {
      const scheduled = new Date();
      scheduled.setDate(scheduled.getDate() + 1);

      await API.post(
        `humanx/session/create/${offer.post}/${offer.user}/`,
        {
          scheduled_at: scheduled.toISOString(),
          duration_minutes: 30,
        }
      );

      alert("Session requested successfully ✔");
    } catch (err) {
      console.error("Session creation failed:", err);
      alert("Error creating session");
    }
  };

  if (loading) {
    return (
      <div className="humanx-container">
        <h2>Loading Inbox...</h2>
      </div>
    );
  }

  return (
    <div className="humanx-container">
      <h2 style={{ marginBottom: 30 }}>Inbox</h2>

      {/* HELP OFFERS */}
      <section style={{ marginBottom: 40 }}>
        <h4 style={{ marginBottom: 15 }}>Help Offers</h4>

        {helpOffers.length === 0 && (
          <p className="modal-sub">No help offers yet.</p>
        )}

        {helpOffers.map((offer) => (
          <div key={offer.id} className="post-card glass">
            <div className="post-header">
              <span className="username">
                @{offer.username}
              </span>
              <span className="type-chip">Help Offer</span>
            </div>

            <p className="post-content">{offer.message}</p>

            <button
              className="action-chip"
              onClick={() => bookSession(offer)}
            >
              Book Session
            </button>
          </div>
        ))}
      </section>

      {/* COLLAB REQUESTS */}
      <section>
        <h4 style={{ marginBottom: 15 }}>Collaboration Requests</h4>

        {collabRequests.length === 0 && (
          <p className="modal-sub">No collaboration requests yet.</p>
        )}

        {collabRequests.map((req) => (
          <div key={req.id} className="post-card glass">
            <div className="post-header">
              <span className="username">
                @{req.username}
              </span>
              <span className="type-chip">Collab Request</span>
            </div>

            <p className="post-content">{req.message}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Inbox;
