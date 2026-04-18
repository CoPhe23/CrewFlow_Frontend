import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/home.css";
import { backdropFade, fadeUp, pageMotion, popIn } from "../lib/motion";

export default function Home() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Tavaszi Iskolabál",
      code: "Q7M4X2",
      members: 18,
      role: "Szervező",
      iconType: "spark",
    },
    {
      id: 2,
      title: "DÖK Gyűlés",
      code: "R9K2P1",
      members: 9,
      role: "Tag",
      iconType: "grid",
    },
    {
      id: 3,
      title: "Aftermovie Forgatás",
      code: "F8N2L4",
      members: 6,
      role: "Admin",
      iconType: "pulse",
    },
  ]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [eventName, setEventName] = useState("");

  const hasEvents = events.length > 0;

  const titleText = useMemo(() => {
    if (hasEvents) return "Eseményeid";
    return "Még nincs egy eseményed sem";
  }, [hasEvents]);

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
  }

  function handleJoinSubmit(e) {
    e.preventDefault();
    if (!joinCode.trim()) return;

    const iconTypes = ["spark", "grid", "pulse"];
    const newEvent = {
      id: Date.now(),
      title: `Csatlakozott esemény (${joinCode.trim().toUpperCase()})`,
      code: joinCode.trim().toUpperCase(),
      members: 12,
      role: "Tag",
      iconType: iconTypes[events.length % iconTypes.length],
    };

    setEvents((prev) => [...prev, newEvent]);
    closeModal();
  }

  function handleCreateSubmit(e) {
    e.preventDefault();
    if (!eventName.trim()) return;

    const randomCode = Math.random().toString(36).slice(2, 8).toUpperCase();
    const iconTypes = ["spark", "grid", "pulse"];

    const newEvent = {
      id: Date.now(),
      title: eventName.trim(),
      code: randomCode,
      members: 1,
      role: "Tulajdonos",
      iconType: iconTypes[events.length % iconTypes.length],
    };

    setEvents((prev) => [...prev, newEvent]);
    closeModal();
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
        </motion.header>

        {hasEvents ? (
          <motion.section className="event-grid" variants={fadeUp}>
            {events.map((event, index) => (
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
                  style={{ textDecoration: "none", color: "inherit", display: "contents" }}
                >
                  <div className="event-card__top">
                    <span className="event-role">{event.role}</span>
                    <span className="event-members">{event.members} fő</span>
                  </div>

                  <div className="event-card__body">
                    <div className="event-card__icon">
                      {event.iconType === "spark" && (
                        <div className="icon-spark">
                          <span />
                          <span />
                          <span />
                        </div>
                      )}

                      {event.iconType === "grid" && (
                        <div className="icon-grid">
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>
                      )}

                      {event.iconType === "pulse" && (
                        <div className="icon-pulse">
                          <span />
                          <span />
                          <span />
                        </div>
                      )}
                    </div>

                    <h2>{event.title}</h2>
                    <p>Kód: {event.code}</p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.section>
        ) : (
          <motion.section className="empty-state" variants={fadeUp}>
            <motion.div
              className="empty-graphic"
              aria-hidden="true"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
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
