import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/register.css";
import { fadeUp, pageMotion } from "../lib/motion";
import { apiRequest } from "../lib/api";

export const Register = () => {
  const navigate = useNavigate();

  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Tölts ki minden kötelező mezőt.");
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
      const data = await apiRequest("/auth/register", "POST", {
        name: username.trim(),
        email: email.trim(),
        password,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/home");
    } catch (err) {
      setError(err.message || "Sikertelen regisztráció.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="auth registerAuth"
      variants={pageMotion}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="atmo" aria-hidden="true">
        <div className="fog" />
        <div className="grain" />
        <div className="vignette" />
      </div>

      <main className="wrap">
        <motion.div className="brand" variants={fadeUp}>
          <motion.div
            className="brandMark"
            aria-hidden="true"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="brandTxt">
            <div className="brandName">CrewFlow</div>
            <div className="brandTag">
              Rendezvényszervezés, gyorsan egy helyen.
            </div>
          </div>
        </motion.div>

        <motion.section className="card" variants={fadeUp}>
          <div className="cardInner">
            <header className="head">
              <div className="title">Regisztráció</div>
              <div className="sub">
                Hozd létre a profilod, és kezdd el szervezni az eseményeidet.
              </div>
            </header>

            <form className="form" onSubmit={handleRegister}>
              <label className="field">
                <span className="label">Username</span>
                <motion.div className="inputWrap" whileFocus={{ scale: 1.005 }}>
                  <input
                    className="inputEl"
                    type="text"
                    placeholder="pl. Felhasznalo"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </motion.div>
              </label>

              <label className="field">
                <span className="label">Email</span>
                <motion.div className="inputWrap" whileFocus={{ scale: 1.005 }}>
                  <input
                    className="inputEl"
                    type="email"
                    placeholder="nev@crewflow.app"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </motion.div>
              </label>

              <label className="field">
                <span className="label">Jelszó</span>
                <div className="pwRow">
                  <motion.div
                    className="inputWrap pwInputWrap"
                    whileFocus={{ scale: 1.005 }}
                  >
                    <input
                      className="inputEl"
                      type={showPw ? "text" : "password"}
                      placeholder="Legalább 6 karakter"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </motion.div>

                  <motion.button
                    className="pwBtn"
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={
                      showPw ? "Jelszó elrejtése" : "Jelszó megjelenítése"
                    }
                    whileTap={{ scale: 0.96 }}
                  >
                    {showPw ? "Elrejt" : "Mutat"}
                  </motion.button>
                </div>
              </label>

              <label className="field">
                <span className="label">Jelszó újra</span>
                <div className="pwRow">
                  <motion.div
                    className="inputWrap pwInputWrap"
                    whileFocus={{ scale: 1.005 }}
                  >
                    <input
                      className="inputEl"
                      type={showConfirmPw ? "text" : "password"}
                      placeholder="Írd be újra a jelszót"
                      autoComplete="new-password"
                      value={passwordAgain}
                      onChange={(e) => setPasswordAgain(e.target.value)}
                    />
                  </motion.div>

                  <motion.button
                    className="pwBtn"
                    type="button"
                    onClick={() => setShowConfirmPw((v) => !v)}
                    aria-label={
                      showConfirmPw
                        ? "Jelszó megerősítés elrejtése"
                        : "Jelszó megerősítés megjelenítése"
                    }
                    whileTap={{ scale: 0.96 }}
                  >
                    {showConfirmPw ? "Elrejt" : "Mutat"}
                  </motion.button>
                </div>
              </label>

              {error && <div className="error">{error}</div>}

              <motion.button
                className="btn"
                type="submit"
                disabled={loading}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.985 }}
              >
                {loading ? "Fiók létrehozása..." : "Fiók létrehozása"}
                <span className="btnDot" aria-hidden="true" />
              </motion.button>

              <div className="foot">
                <span>Van már fiókod?</span>
                <Link className="link" to="/login">
                  Bejelentkezés
                </Link>
              </div>
            </form>
          </div>
        </motion.section>
      </main>
    </motion.div>
  );
};