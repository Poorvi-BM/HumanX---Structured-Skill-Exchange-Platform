import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>HumanX</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <div className="cards">
        <div
          className="card"
          onClick={() => navigate("/personal")}
        >
          <h2>Personal Workspace</h2>
          <p>Tasks · Goals · Projects</p>
        </div>

        <div
          className="card"
          onClick={() => navigate("/humanx")}
        >
          <h2>HumanX</h2>
          <p>Learn · Exchange · Grow</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
