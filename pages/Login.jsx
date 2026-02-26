// Login.jsx
import React, { useState } from "react";
import "../styles/login.css";

export const Login = () => {
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="auth">
      <div className="atmo" aria-hidden="true">
        <div className="fog" />
        <div className="grain" />
        <div className="vignette" />
        <div className="fireflies" aria-hidden="true">
          <span className="fly f1" />
          <span className="fly f2" />
          <span className="fly f3" />
          <span className="fly f4" />
        </div>
      </div>

      <main className="wrap">
        <div className="brand">
          <div className="brandMark" aria-hidden="true" />
          <div className="brandTxt">
            <div className="brandName">CrewFlow</div>
            <div className="brandTag">Rendezvények — nyugodt, gyors flowban.</div>
          </div>
        </div>

        <section className="card" aria-label="Bejelentkezés">
          <div className="cardInner">
            <div className="runes" aria-hidden="true" />
            <div className="edgeGlow" aria-hidden="true" />

            <header className="head">
              <div className="title">Bejelentkezés</div>
              <div className="sub">Egy helyen minden eseményed — tisztán, átláthatóan.</div>
            </header>

            <form className="form">
              <label className="field">
                <span className="label">Email</span>
                <div className="inputWrap">
                  <input
                    className="inputEl"
                    type="email"
                    placeholder="nev@crewflow.app"
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>
              </label>

              <label className="field">
                <span className="label">Jelszó</span>
                <div className="pwRow">
                  <div className="inputWrap pwInputWrap">
                    <input
                      className="inputEl"
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>

                  <button
                    className="pwBtn"
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Jelszó elrejtése" : "Jelszó megjelenítése"}
                  >
                    {showPw ? "Elrejt" : "Mutat"}
                  </button>
                </div>
              </label>

              <div className="row">
                <label className="check">
                  <input type="checkbox" />
                  <span>Emlékezz rám</span>
                </label>
                <a className="link" href="#">
                  Elfelejtetted?
                </a>
              </div>

              <button className="btn" type="submit">
                Belépés
                <span className="btnDot" aria-hidden="true" />
              </button>

              <div className="foot">
                <span>Még nincs fiókod?</span>
                <a className="link" href="/register">
                  Regisztráció
                </a>
              </div>
            </form>
          </div>
        </section>

        <div className="micro">
          <span className="badge">kő • moha • éj</span>
          <span className="microText">User friendly. Nulla zaj. Tiszta ritmus.</span>
        </div>
      </main>
    </div>
  );
};