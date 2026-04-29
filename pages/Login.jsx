import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/login.css";
import { fadeUp, pageMotion } from "../lib/motion";
import { apiRequest } from "../lib/api";

export const Login = () => {
  const navigate = useNavigate();

  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function getLoginErrorMessage(message) {
    const msg = String(message || "").toLowerCase();

    if (
      msg.includes("invalid") ||
      msg.includes("wrong") ||
      msg.includes("incorrect") ||
      msg.includes("password") ||
      msg.includes("not found") ||
      msg.includes("hibás")
    ) {
      return "Hibás email cím vagy jelszó.";
    }

    if (msg.includes("network") || msg.includes("kapcsolódni")) {
      return "Nem sikerült kapcsolódni a szerverhez.";
    }

    return "Sikertelen bejelentkezés. Ellenőrizd az adatokat.";
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Add meg az email címet és a jelszót.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", "POST", {
        email: email.trim(),
        password,
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify(data.user));

      navigate("/home");
    } catch (err) {
      setError(getLoginErrorMessage(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="auth"
      variants={pageMotion}
      initial="initial"
      animate="animate"
    >
      <main className="wrap">
        <motion.section className="card" variants={fadeUp}>
          <div className="cardInner">
            <header className="head">
              <div className="title">Bejelentkezés</div>
              <div className="sub">Egy helyen minden eseményed.</div>
            </header>

            <form className="form" onSubmit={handleLogin}>
              <label className="field">
                <span>Email</span>

                <div className="inputWrap">
                  <input
                    className="inputEl"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nev@crewflow.app"
                    autoComplete="email"
                  />
                </div>
              </label>

              <label className="field">
                <span>Jelszó</span>

                <div className="pwRow">
                  <div className="inputWrap pwInputWrap">
                    <input
                      className="inputEl"
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </div>

                  <button
                    type="button"
                    className="pwBtn"
                    onClick={() => setShowPw(!showPw)}
                  >
                    {showPw ? "Elrejt" : "Mutat"}
                  </button>
                </div>
              </label>

              <div className="row">
                <label className="check">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />

                  <span>Emlékezz rám</span>
                </label>

                <Link className="link" to="/forgot-password">
                  Elfelejtetted?
                </Link>
              </div>

              {error && <div className="error">{error}</div>}

              <button className="btn" disabled={loading} type="submit">
                {loading ? "Belépés..." : "Belépés"}
              </button>

              <div className="foot">
                <span>Még nincs fiókod?</span>

                <Link to="/register" className="link">
                  Regisztráció
                </Link>
              </div>
            </form>
          </div>
        </motion.section>
      </main>
    </motion.div>
  );
};