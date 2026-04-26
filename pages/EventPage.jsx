import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import "../styles/EventPage.css";
import { backdropFade, fadeUp, pageMotion, popIn, tabPanel } from "../lib/motion";

const CURRENT_USER_ID = 1;

export default function EventPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("wall");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [eventName, setEventName] = useState("Tavaszi Iskolabál");
  const [eventDescription, setEventDescription] = useState(
    "Az esemény fő szervezői felülete. Itt jelennek meg a fontos információk, a kiemelt beosztás, valamint a csapat kommunikációja."
  );
  const [editedName, setEditedName] = useState(eventName);
  const [newPostText, setNewPostText] = useState("");

  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: "Máté Bárdos",
      role: "Admin",
    },
    {
      id: 2,
      name: "Anna Kovács",
      role: "Admin",
    },
    {
      id: 3,
      name: "Bence Tóth",
      role: "Tag",
    },
    {
      id: 4,
      name: "Lili Nagy",
      role: "Tag",
    },
  ]);

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Anna Kovács",
      role: "Admin",
      time: "Ma, 14:22",
      text: "Holnap 17:00-kor rövid megbeszélést tartunk az aula előtt. Kérlek mindenki legyen pontos.",
    },
    {
      id: 2,
      author: "Máté Bárdos",
      role: "Admin",
      time: "Ma, 11:08",
      text: "A dekoros csapat listája frissítve lett, este még felkerül a végleges beosztás is.",
    },
  ]);

  const currentUser = useMemo(() => {
    return participants.find((participant) => participant.id === CURRENT_USER_ID);
  }, [participants]);

  const isAdmin = currentUser?.role === "Admin";

  const event = {
    id: 1,
    name: eventName,
    description: eventDescription,
    role: isAdmin ? "Admin" : "Résztvevő",
    participantCount: participants.length,
    canManage: isAdmin,
  };

  const chatMessages = [
    {
      id: 1,
      author: "Bence",
      time: "14:31",
      text: "Valaki hoz hosszabbítót?",
      own: false,
    },
    {
      id: 2,
      author: "Te",
      time: "14:33",
      text: "Igen, én tudok vinni egyet.",
      own: true,
    },
    {
      id: 3,
      author: "Anna",
      time: "14:35",
      text: "Szuper, akkor az le is van tudva.",
      own: false,
    },
  ];

  function closeModal() {
    setModalType("");
    setMenuOpen(false);
    setEditedName(eventName);
  }

  function handleRenameSubmit(e) {
    e.preventDefault();
    if (!isAdmin || !editedName.trim()) return;
    setEventName(editedName.trim());
    closeModal();
  }

  function handlePostSubmit(e) {
    e.preventDefault();
    if (!isAdmin || !newPostText.trim()) return;

    setPosts((prevPosts) => [
      {
        id: Date.now(),
        author: currentUser?.name || "Admin",
        role: currentUser?.role || "Admin",
        time: "Most",
        text: newPostText.trim(),
      },
      ...prevPosts,
    ]);

    setNewPostText("");
  }

  function handleMakeAdmin(participantId) {
    if (!isAdmin) return;

    setParticipants((prevParticipants) =>
      prevParticipants.map((participant) =>
        participant.id === participantId ? { ...participant, role: "Admin" } : participant
      )
    );
  }

  function handleRemoveParticipant(participantId) {
    if (!isAdmin || participantId === CURRENT_USER_ID) return;

    setParticipants((prevParticipants) =>
      prevParticipants.filter((participant) => participant.id !== participantId)
    );
  }

  function handleDeleteEvent() {
    if (!isAdmin) return;

    console.log("Törlés backenddel később");
    closeModal();
    navigate("/home");
  }

  function handleLeaveEvent() {
    console.log("Kilépés backenddel később");
    closeModal();
  }

  return (
    <motion.main
      className="event-page"
      variants={pageMotion}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div className="event-shell" variants={fadeUp}>
        <motion.header className="event-header" variants={fadeUp}>
          <div className="event-header__left">
            <Link to="/home" className="event-back-button" aria-label="Vissza a főoldalra">
              ←
            </Link>

            <div className="event-heading">
              <p className="event-heading__eyebrow">{event.role}</p>
              <h1>{event.name}</h1>
            </div>
          </div>

          <div className="event-header__right">
            <motion.button
              className="event-menu-button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Esemény műveletek"
              whileTap={{ scale: 0.96 }}
            >
              •••
            </motion.button>
          </div>
        </motion.header>

        <motion.section className="event-summary-card" variants={fadeUp}>
          <div className="event-summary-card__top">
            <motion.div
              className="event-summary-icon"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <span />
              <span />
              <span />
            </motion.div>

            <div className="event-summary-meta">
              <p>Esemény adatai</p>
              <h2>{event.name}</h2>
            </div>
          </div>

          <p className="event-summary-description">{event.description}</p>
        </motion.section>

        <motion.div className="event-tabs" variants={fadeUp}>
          <motion.button
            className={activeTab === "wall" ? "event-tab active" : "event-tab"}
            onClick={() => setActiveTab("wall")}
            whileTap={{ scale: 0.97 }}
          >
            Fal
          </motion.button>

          <motion.button
            className={activeTab === "chat" ? "event-tab active" : "event-tab"}
            onClick={() => setActiveTab("chat")}
            whileTap={{ scale: 0.97 }}
          >
            Chat
          </motion.button>

          <motion.button
            className={activeTab === "participants" ? "event-tab active" : "event-tab"}
            onClick={() => setActiveTab("participants")}
            whileTap={{ scale: 0.97 }}
          >
            Résztvevők
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.button
                className="event-dropdown-backdrop"
                onClick={() => setMenuOpen(false)}
                aria-label="Bezárás"
                variants={backdropFade}
                initial="initial"
                animate="animate"
                exit="exit"
              />

              <motion.div
                className="event-dropdown"
                variants={popIn}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {event.canManage && (
                  <motion.button
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      setModalType("rename");
                      setMenuOpen(false);
                    }}
                  >
                    Esemény nevének szerkesztése
                  </motion.button>
                )}

                <motion.button
                  whileTap={{ scale: 0.985 }}
                  onClick={() => {
                    setModalType("leave");
                    setMenuOpen(false);
                  }}
                >
                  Kilépés az eseményből
                </motion.button>

                {event.canManage && (
                  <motion.button
                    className="danger-option"
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      setModalType("delete");
                      setMenuOpen(false);
                    }}
                  >
                    Esemény törlése
                  </motion.button>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeTab === "wall" && (
            <motion.section
              key="wall"
              className="event-content"
              variants={tabPanel}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.div whileHover={{ y: -3, scale: 1.008 }} whileTap={{ scale: 0.992 }}>
                <Link to={`/event/${event.id}/schedule`} className="pinned-schedule-card">
                  <div className="pinned-schedule-card__top">
                    <div className="pinned-schedule-icon">
                      <div className="schedule-mini-graphic">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>

                    <div>
                      <p>Pinelt</p>
                      <h2>Beosztás</h2>
                    </div>
                  </div>

                  <div className="schedule-hero">
                    <div className="schedule-hero__grid">
                      <div className="schedule-chip">Beléptetés</div>
                      <div className="schedule-chip">Pakolás</div>
                      <div className="schedule-chip">Dekor</div>
                      <div className="schedule-chip">Zene</div>
                    </div>

                    <div className="schedule-hero__lines">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>

                  <div className="pinned-schedule-card__footer">
                    <span>Megnyitás</span>
                    <span>→</span>
                  </div>
                </Link>
              </motion.div>

              {isAdmin && (
                <motion.form
                  className="post-composer-card"
                  onSubmit={handlePostSubmit}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24 }}
                >
                  <div className="post-composer-card__head">
                    <div>
                      <p>Admin poszt</p>
                      <h3>Új bejegyzés a falra</h3>
                    </div>
                    <span>Csak adminoknak</span>
                  </div>

                  <textarea
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="Írj ki egy fontos infót az esemény falára..."
                    rows="4"
                  />

                  <div className="post-composer-card__actions">
                    <motion.button type="submit" className="primary-button" whileTap={{ scale: 0.985 }}>
                      Posztolás
                    </motion.button>
                  </div>
                </motion.form>
              )}

              <div className="post-list">
                {posts.map((post, index) => (
                  <motion.article
                    className="post-card"
                    key={post.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.28,
                      delay: 0.04 + index * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div className="post-card__top">
                      <div>
                        <h3>{post.author}</h3>
                        <p>{post.role}</p>
                      </div>

                      <span>{post.time}</span>
                    </div>

                    <div className="post-card__body">
                      <p>{post.text}</p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === "chat" && (
            <motion.section
              key="chat"
              className="chat-section"
              variants={tabPanel}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="chat-messages">
                {chatMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    className={message.own ? "chat-bubble own" : "chat-bubble"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: index * 0.04 }}
                  >
                    <div className="chat-bubble__meta">
                      <span>{message.author}</span>
                      <span>{message.time}</span>
                    </div>

                    <p>{message.text}</p>
                  </motion.div>
                ))}
              </div>

              <form className="chat-input-bar">
                <input type="text" placeholder="Üzenet írása..." />
                <motion.button type="submit" whileTap={{ scale: 0.97 }}>
                  Küldés
                </motion.button>
              </form>
            </motion.section>
          )}

          {activeTab === "participants" && (
            <motion.section
              key="participants"
              className="participants-section"
              variants={tabPanel}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="participants-header-card">
                <div>
                  <p>Tagok</p>
                  <h2>Résztvevők</h2>
                </div>

                <div className="participants-count">{event.participantCount} fő</div>
              </div>

              <div className="participants-list">
                {participants.map((participant, index) => {
                  const isCurrentUser = participant.id === CURRENT_USER_ID;
                  const participantIsAdmin = participant.role === "Admin";

                  return (
                    <motion.article
                      className="participant-card"
                      key={participant.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.24, delay: index * 0.04 }}
                    >
                      <div className="participant-avatar">{participant.name.slice(0, 1)}</div>

                      <div className="participant-main">
                        <div className="participant-title-row">
                          <h3>{participant.name}</h3>
                          {isCurrentUser && <span className="self-badge">Te</span>}
                        </div>
                        <p>{participant.role}</p>
                      </div>

                      {isAdmin && (
                        <div className="participant-actions">
                          {!participantIsAdmin && (
                            <motion.button
                              type="button"
                              className="participant-action-button"
                              onClick={() => handleMakeAdmin(participant.id)}
                              whileTap={{ scale: 0.985 }}
                            >
                              Adminná tesz
                            </motion.button>
                          )}

                          {!isCurrentUser && (
                            <motion.button
                              type="button"
                              className="participant-action-button participant-action-button--danger"
                              onClick={() => handleRemoveParticipant(participant.id)}
                              whileTap={{ scale: 0.985 }}
                            >
                              Eltávolít
                            </motion.button>
                          )}
                        </div>
                      )}
                    </motion.article>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {modalType && (
            <>
              <motion.button
                className="modal-backdrop"
                onClick={closeModal}
                aria-label="Bezárás"
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
                {modalType === "rename" && (
                  <>
                    <div className="modal-head">
                      <p>Szerkesztés</p>
                      <h3>Esemény átnevezése</h3>
                    </div>

                    <form onSubmit={handleRenameSubmit} className="modal-form">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        placeholder="Új eseménynév"
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
                          Mentés
                        </motion.button>
                      </div>
                    </form>
                  </>
                )}

                {modalType === "leave" && (
                  <>
                    <div className="modal-head">
                      <p>Kilépés</p>
                      <h3>Biztosan kilépsz ebből az eseményből?</h3>
                    </div>

                    <p className="modal-text-block">
                      A későbbiekben csak új meghívókóddal tudsz majd visszacsatlakozni.
                    </p>

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
                        type="button"
                        className="danger-button"
                        onClick={handleLeaveEvent}
                        whileTap={{ scale: 0.985 }}
                      >
                        Kilépés
                      </motion.button>
                    </div>
                  </>
                )}

                {isAdmin && modalType === "delete" && (
                  <>
                    <div className="modal-head">
                      <p>Törlés</p>
                      <h3>Biztosan törölni szeretnéd az eseményt?</h3>
                    </div>

                    <p className="modal-text-block">
                      Ez a művelet később backend oldalon végleges törléshez fog kapcsolódni.
                    </p>

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
                        type="button"
                        className="danger-button"
                        onClick={handleDeleteEvent}
                        whileTap={{ scale: 0.985 }}
                      >
                        Törlés
                      </motion.button>
                    </div>
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
