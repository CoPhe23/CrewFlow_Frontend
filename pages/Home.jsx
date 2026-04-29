import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineLogout } from "react-icons/md";
import "../styles/home.css";
import { apiRequest } from "../lib/api";
import { backdropFade, fadeUp, pageMotion, popIn } from "../lib/motion";

export default function Home() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [eventName, setEventName] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const hasEvents = events.length > 0;

  const titleText = useMemo(() => {
    if (loading) return "Betöltés...";
    if (hasEvents) return "Eseményeid";
    return "Még nincs egy eseményed sem";
  }, [hasEvents, loading]);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setError("");
      setLoading(true);

      const data = await apiRequest("/events", "GET");
      setEvents(Array.isArray(data) ? data : data.events || []);
    } catch (err) {
      setError(err.message || "Nem sikerült betölteni az eseményeket.");
    } finally {
      setLoading(false);
    }
  }

  function openJoinModal() {
    setMenuOpen(false);
    setModalType("join");
  }

  function openCreateModal() {
    setMenuOpen(false);
    setModalType("create");
  }

  function closeModal() {
    setModalType("");
    setJoinCode("");
    setEventName("");
    setError("");
  }

  async function handleJoinSubmit(e) {
    e.preventDefault();

    if (!joinCode.trim()) {
      setError("Add meg az esemény kódját.");
      return;
    }

    try {
      setError("");

      await apiRequest("/events/join", "POST", {
        joinCode: joinCode.trim().toUpperCase(),
      });

      closeModal();
      await loadEvents();
    } catch (err) {
      setError(err.message || "Nem sikerült csatlakozni.");
    }
  }

  async function handleCreateSubmit(e) {
    e.preventDefault();

    if (!eventName.trim()) {
      setError("Add meg az esemény nevét.");
      return;
    }

    try {
      setError("");

      const data = await apiRequest("/events", "POST", {
        name: eventName.trim(),
      });

      if (data.event) {
        setEvents((prev) => [data.event, ...prev]);
      } else {
        await loadEvents();
      }

      closeModal();
    } catch (err) {
      setError(err.message || "Nem sikerült létrehozni az eseményt.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/login");
  }

  function getIconType(index) {
    const iconTypes = ["spark", "grid", "pulse"];
    return iconTypes[index % iconTypes.length];
  }

  return (
    <motion.main
      className="home-page"
      variants={pageMotion}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div className="home-shell" variants={fadeUp}>
        <motion.header className="home-topbar" variants={fadeUp}>
          <div>
            <p className="home-eyebrow">CrewFlow</p>
            <h1>{titleText}</h1>
          </div>

          <div className="home-logout-actions">
            <motion.button
              className="ghost-button home-logout-text"
              type="button"
              onClick={handleLogout}
              whileTap={{ scale: 0.985 }}
            >
              Kilépés
            </motion.button>

            <motion.button
              className="home-logout-icon"
              type="button"
              onClick={handleLogout}
              aria-label="Kilépés"
              title="Kilépés"
              whileTap={{ scale: 0.94 }}
            >
              <MdOutlineLogout aria-hidden="true" />
            </motion.button>
          </div>
        </motion.header>

        {error && <div className="error">{error}</div>}

        {!loading && hasEvents ? (
          <motion.section className="event-grid" variants={fadeUp}>
            {events.map((event, index) => {
              const iconType = event.iconType || getIconType(index);

              return (
                <motion.article
                  className="event-card"
                  key={event.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.34,
                    delay: 0.05 + index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -4, scale: 1.012 }}
                  whileTap={{ scale: 0.992 }}
                >
                  <Link
                    to={`/event/${event.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "contents",
                    }}
                  >
                    <div className="event-card__top">
                      <span className="event-role">
                        {event.role || "Tag"}
                      </span>
                      <span className="event-members">
                        {event.members || event.memberCount || 1} fő
                      </span>
                    </div>

                    <div className="event-card__body">
                      <div className="event-card__icon">
                        {iconType === "spark" && (
                          <div className="icon-spark">
                            <span />
                            <span />
                            <span />
                          </div>
                        )}

                        {iconType === "grid" && (
                          <div className="icon-grid">
                            <span />
                            <span />
                            <span />
                            <span />
                          </div>
                        )}

                        {iconType === "pulse" && (
                          <div className="icon-pulse">
                            <span />
                            <span />
                            <span />
                          </div>
                        )}
                      </div>

                      <h2>{event.name || event.title}</h2>
                      <p>Kód: {event.joinCode || event.code}</p>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </motion.section>
        ) : (
          !loading && (
            <motion.section className="empty-state" variants={fadeUp}>
              <motion.div
                className="empty-graphic"
                aria-hidden="true"
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 5.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="empty-graphic__circle" />
                <div className="empty-graphic__spark spark-1" />
                <div className="empty-graphic__spark spark-2" />
                <div className="empty-graphic__spark spark-3" />
              </motion.div>

              <h2>Még nem vagy tagja egy eseménynek sem</h2>
              <p>
                Csatlakozz egy meglévőhöz kóddal, vagy hozz létre egy újat pár
                kattintással.
              </p>

              <motion.button
                className="empty-plus-button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Esemény létrehozása vagy csatlakozás"
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
              >
                +
              </motion.button>
            </motion.section>
          )
        )}

        {hasEvents && (
          <motion.div className="floating-action-wrapper" variants={fadeUp}>
            <motion.button
              className="floating-action-button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Új esemény vagy csatlakozás"
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
            >
              +
            </motion.button>
          </motion.div>
        )}

        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.button
                className="menu-backdrop"
                aria-label="Bezárás"
                onClick={() => setMenuOpen(false)}
                variants={backdropFade}
                initial="initial"
                animate="animate"
                exit="exit"
              />

              <motion.div
                className={`action-menu ${hasEvents ? "action-menu--fab" : ""}`}
                variants={popIn}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <motion.button whileTap={{ scale: 0.985 }} onClick={openJoinModal}>
                  Csatlakozás kóddal
                </motion.button>

                <motion.button whileTap={{ scale: 0.985 }} onClick={openCreateModal}>
                  Új esemény létrehozása
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {modalType && (
            <>
              <motion.button
                className="modal-backdrop"
                aria-label="Bezárás"
                onClick={closeModal}
                variants={backdropFade}
                initial="initial"
                animate="animate"
                exit="exit"
              />

              <motion.div
                className="modal-card"
                variants={popIn}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {modalType === "join" ? (
                  <>
                    <div className="modal-head">
                      <p>Csatlakozás</p>
                      <h3>Eseménykód megadása</h3>
                    </div>

                    <form onSubmit={handleJoinSubmit} className="modal-form">
                      <input
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="Pl. A7K9X2"
                        maxLength={12}
                      />

                      <div className="modal-actions">
                        <motion.button
                          type="button"
                          className="ghost-button"
                          onClick={closeModal}
                          whileTap={{ scale: 0.985 }}
                        >
                          Mégse
                        </motion.button>

                        <motion.button
                          type="submit"
                          className="primary-button"
                          whileTap={{ scale: 0.985 }}
                        >
                          Csatlakozás
                        </motion.button>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <div className="modal-head">
                      <p>Létrehozás</p>
                      <h3>Új esemény neve</h3>
                    </div>

                    <form onSubmit={handleCreateSubmit} className="modal-form">
                      <input
                        type="text"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        placeholder="Pl. Gólyabál szervezés"
                        maxLength={60}
                      />

                      <div className="modal-actions">
                        <motion.button
                          type="button"
                          className="ghost-button"
                          onClick={closeModal}
                          whileTap={{ scale: 0.985 }}
                        >
                          Mégse
                        </motion.button>

                        <motion.button
                          type="submit"
                          className="primary-button"
                          whileTap={{ scale: 0.985 }}
                        >
                          Létrehozás
                        </motion.button>
                      </div>
                    </form>
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.main>
  );
}