import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/register.css";
import { fadeUp, pageMotion } from "../lib/motion";

export const Register = () => {
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

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
            <div className="brandTag">Rendezvényszervezés, gyorsan egy helyen.</div>
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

            <form className="form">
              <label className="field">
                <span className="label">Username</span>
                <motion.div className="inputWrap" whileFocus={{ scale: 1.005 }}>
                  <input
                    className="inputEl"
                    type="text"
                    placeholder="pl. Felhasznalo"
                    autoComplete="username"
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
                  />
                </motion.div>
              </label>

              <label className="field">
                <span className="label">Jelszó</span>
                <div className="pwRow">
                  <motion.div className="inputWrap pwInputWrap" whileFocus={{ scale: 1.005 }}>
                    <input
                      className="inputEl"
                      type={showPw ? "text" : "password"}
                      placeholder="Legalább 8 karakter"
                      autoComplete="new-password"
                    />
                  </motion.div>

                  <motion.button
                    className="pwBtn"
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Jelszó elrejtése" : "Jelszó megjelenítése"}
                    whileTap={{ scale: 0.96 }}
                  >
                    {showPw ? "Elrejt" : "Mutat"}
                  </motion.button>
                </div>
              </label>

              <label className="field">
                <span className="label">Jelszó újra</span>
                <div className="pwRow">
                  <motion.div className="inputWrap pwInputWrap" whileFocus={{ scale: 1.005 }}>
                    <input
                      className="inputEl"
                      type={showConfirmPw ? "text" : "password"}
                      placeholder="Írd be újra a jelszót"
                      autoComplete="new-password"
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

              <motion.button className="btn" type="submit" whileHover={{ y: -1 }} whileTap={{ scale: 0.985 }}>
                Fiók létrehozása
                <span className="btnDot" aria-hidden="true" />
              </motion.button>

              <div className="foot">
                <span>Van már fiókod?</span>
                <a className="link" href="/login">
                  Bejelentkezés
                </a>
              </div>
            </form>
          </div>
        </motion.section>
      </main>
    </motion.div>
  );
};
