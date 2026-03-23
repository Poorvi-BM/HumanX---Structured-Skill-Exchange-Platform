import { useState } from "react";
import API from "../services/api";
import "../styles/AuthPage.css";
import { useNavigate } from "react-router-dom";


function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  const navigate = useNavigate();

  // LOGIN HANDLER
  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await API.post("token/", {
        username: email,
        password: password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      navigate("/dashboard");

    } catch (err) {
      alert("Invalid credentials ❌");
    }
  };

  // REGISTER HANDLER
  const handleRegister = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const name = e.target.name.value;
    const password = e.target.password.value;

    try {
      await API.post("accounts/register/", {
        email,
        name,
        password,
      });

      alert("Registered successfully 🎉");
      setIsLogin(true);
    } catch (err) {
      alert("Registration failed ❌");
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-box ${isLogin ? "" : "active"}`}>

        {/* LEFT PANEL */}
        <div className="panel left-panel">
          <h1>
            Welcome Back <br /> HumanX 💙
          </h1>

          <p className="tagline">Learn · Build · Exchange</p>

          <ul className="features">
            <li>📘 Learn from people</li>
            <li>⚡ Build real skills</li>
            <li>🔄 Exchange knowledge</li>
          </ul>

          <button onClick={() => setIsLogin(true)}>Login</button>
        </div>

        {/* RIGHT PANEL */}
        <div className="panel right-panel">
          <h2>New here?</h2>
          <p>Join HumanX and grow together</p>
          <button onClick={() => setIsLogin(false)}>Register</button>
        </div>

        {/* SLIDING FORM */}
        <div className="form-container">

          {/* LOGIN FORM */}
          {isLogin ? (
            <form className="form" onSubmit={handleLogin}>
              <h2>Login</h2>

              <input
                type="email"
                name="email"
                placeholder="Email"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />

              <button type="submit" className="primary-btn">
                Login
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form className="form" onSubmit={handleRegister}>
              <h2>Register</h2>

              <input
                type="email"
                name="email"
                placeholder="Email"
                required
              />

              <input
                type="text"
                name="name"
                placeholder="Name"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />

              <button type="submit" className="primary-btn">
                Register
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

export default AuthPage;



