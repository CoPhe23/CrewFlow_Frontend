import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../lib/api";
import "../styles/login.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!password || !passwordAgain) {
      setError("Tölts ki minden mezőt.");
      return;
    }

    if (password.length < 6) {
      setError("A jelszó legyen legalább 6 karakter.");
      return;
    }

    if (password !== passwordAgain) {
      setError("A két jelszó nem egyezik.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest("/auth/reset-password", "POST", {
        token,
        password,
      });

      setMessage(data.message || "Jelszó módosítva.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Hiba történt.");
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
              <div className="title">Új jelszó megadása</div>
              <div className="sub">Add meg az új jelszavad.</div>
            </header>

            <form className="form" onSubmit={handleResetPassword}>
              <label className="field">
                <span className="label">Új jelszó</span>
                <div className="inputWrap">
                  <input
                    className="inputEl"
                    type="password"
                    placeholder="Legalább 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </label>

              <label className="field">
                <span className="label">Új jelszó újra</span>
                <div className="inputWrap">
                  <input
                    className="inputEl"
                    type="password"
                    placeholder="Írd be újra"
                    value={passwordAgain}
                    onChange={(e) => setPasswordAgain(e.target.value)}
                  />
                </div>
              </label>

              {error && <div className="error">{error}</div>}
              {message && <div className="success">{message}</div>}

              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Mentés..." : "Jelszó módosítása"}
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