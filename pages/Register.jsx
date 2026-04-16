import React, { useState } from "react";
import "../styles/register.css";

export const Register = () => {
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  return (
    <div className="auth registerAuth">
      <div className="atmo" aria-hidden="true">
        <div className="fog" />
        <div className="grain" />
        <div className="vignette" />
      </div>

      <main className="wrap">
        <div className="brand">
          <div className="brandMark" aria-hidden="true" />
          <div className="brandTxt">
            <div className="brandName">CrewFlow</div>
            <div className="brandTag">Rendezvényszervezés, gyorsan egy helyen.</div>
          </div>
        </div>

        <section className="card">
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
                <div className="inputWrap">
                  <input
                    className="inputEl"
                    type="text"
                    placeholder="pl. Felhasznalo"
                    autoComplete="username"
                  />
                </div>
              </label>

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
                      placeholder="Legalább 8 karakter"
                      autoComplete="new-password"
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

              <label className="field">
                <span className="label">Jelszó újra</span>
                <div className="pwRow">
                  <div className="inputWrap pwInputWrap">
                    <input
                      className="inputEl"
                      type={showConfirmPw ? "text" : "password"}
                      placeholder="Írd be újra a jelszót"
                      autoComplete="new-password"
                    />
                  </div>

                  <button
                    className="pwBtn"
                    type="button"
                    onClick={() => setShowConfirmPw((v) => !v)}
                    aria-label={
                      showConfirmPw
                        ? "Jelszó megerősítés elrejtése"
                        : "Jelszó megerősítés megjelenítése"
                    }
                  >
                    {showConfirmPw ? "Elrejt" : "Mutat"}
                  </button>
                </div>
              </label>

              <button className="btn" type="submit">
                Fiók létrehozása
                <span className="btnDot" aria-hidden="true" />
              </button>

              <div className="foot">
                <span>Van már fiókod?</span>
                <a className="link" href="/login">
                  Bejelentkezés
                </a>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};