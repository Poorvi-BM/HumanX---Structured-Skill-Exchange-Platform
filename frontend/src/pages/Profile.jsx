import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "../styles/HumanX.css";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await API.get(`humanx/profile/${id}/`);
    setProfile(res.data);
  };

  if (!profile) {
    return (
      <div className="humanx-container">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div className="humanx-container">

      <div className="post-card glass">
        <h2>@{profile.username}</h2>

        <p>Trust Score: <strong>{profile.trust_score}</strong></p>
        <p>⭐ Avg Rating: {profile.avg_rating}</p>
        <p>✅ Completed Sessions: {profile.completed_sessions}</p>
        <p>❌ Cancelled Sessions: {profile.cancelled_sessions}</p>
      </div>

      <h3 style={{ marginTop: 30 }}>Reviews</h3>

      {profile.reviews.length === 0 && (
        <p className="modal-sub">No reviews yet.</p>
      )}

      {profile.reviews.map((r) => (
        <div key={r.id} className="post-card glass">
          <p><strong>{r.reviewer_username}</strong> rated {r.score}⭐</p>
          {r.review && <p>{r.review}</p>}
        </div>
      ))}

    </div>
  );
};

export default Profile;
