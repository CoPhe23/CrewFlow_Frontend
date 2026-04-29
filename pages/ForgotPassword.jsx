import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import "../styles/login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 const handleForgotPassword = async (e) => {
  e.preventDefault();

  setError("");
  setMessage("");

  if (!email.trim()) {
    setError("Add meg az email címed.");
    return;
  }

  setLoading(true);

  try {
    const data = await apiRequest(
      "/auth/forgot-password",
      "POST",
      {
        email: email.trim(),
      }
    );

    setMessage(
      data.message ||
      "Ha létezik ilyen email, elküldtük a visszaállító linket."
    );

  } catch (e) {
  console.error("FORGOT PASSWORD ERROR:", e);
  return res.status(500).json({
    error: e.message
  });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth">
      <main className="wrap">
        <section className="card">
          <div className="cardInner">
            <header className="head">
              <div className="title">Jelszó visszaállítása</div>
              <div className="sub">Add meg az email címed.</div>
            </header>

            <form className="form" onSubmit={handleForgotPassword}>
              <label className="field">
                <span className="label">Email</span>
                <div className="inputWrap">
                  <input
                    className="inputEl"
                    type="email"
                    placeholder="nev@crewflow.app"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </label>

              {error && <div className="error">{error}</div>}
              {message && <div className="success">{message}</div>}

              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Küldés..." : "Visszaállító link küldése"}
              </button>

              <div className="foot">
                <Link className="link" to="/login">
                  Vissza a bejelentkezéshez
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}