import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/EventPage.css";
import { apiRequest } from "../lib/api";
import {
  backdropFade,
  fadeUp,
  pageMotion,
  popIn,
  tabPanel,
} from "../lib/motion";

function formatDateTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCurrentUser() {
  try {
    return (
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"))
    );
  } catch {
    return null;
  }
}

export default function EventPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("wall");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const [event, setEvent] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [newPostText, setNewPostText] = useState("");

  const [posts, setPosts] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const [participants, setParticipants] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = event?.role === "ADMIN";

  useEffect(() => {
  let alive = true;
  let interval = null;

  async function initEventPage() {
    try {
      const eventRes = await apiRequest(`/events/${id}`, "GET");
      const membersRes = await apiRequest(`/events/${id}/members`, "GET");

      if (!alive) return;

      setEvent({
        id: eventRes.id,
        name: eventRes.name,
        description: eventRes.description || "",
        joinCode: eventRes.joinCode,
        role: eventRes.role,
        membersCount: eventRes.membersCount,
        canManage: eventRes.role === "ADMIN",
      });

      setEditedName(eventRes.name);
      setEditedDescription(eventRes.description || "");
      setParticipants(membersRes.members || []);

      await loadPosts();
      await loadMessages(membersRes.members || []);

      interval = setInterval(() => {
        loadMessages(membersRes.members || []);
      }, 5000);
    } catch (err) {
      setError(err.message || "Nem sikerült betölteni az eseményt.");
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }

  initEventPage();

  return () => {
    alive = false;
    if (interval) clearInterval(interval);
  };
}, [id]);

  async function loadEvent() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(`/events/${id}`, "GET");

      const loadedEvent = {
        id: data.id,
        name: data.name,
        description: data.description || "",
        joinCode: data.joinCode,
        role: data.role,
        membersCount: data.membersCount,
        canManage: data.role === "ADMIN",
      };

      setEvent(loadedEvent);
      setEditedName(loadedEvent.name);
      setEditedDescription(loadedEvent.description);
    } catch (err) {
      setError(err.message || "Betöltési hiba.");
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(memberList = participants) {
  try {
    const data = await apiRequest(`/messages/events/${id}/messages`, "GET");
    const user = getCurrentUser();

    setChatMessages(
      (data || []).map((msg) => {
        const sender = memberList.find((p) => p.userId === msg.userId);

        const roleLabel =
          sender?.role === "ADMIN"
            ? "Admin"
            : "Tag";

        return {
          id: msg.id,
          author: msg.userId === user?.id ? `Te • ${roleLabel}` : roleLabel,
          time: formatDateTime(msg.createdAt),
          text: msg.text,
          own: msg.userId === user?.id,
        };
      })
    );
  } catch (err) {
    console.log(err);
  }
}

  async function loadMembers() {
    try {
      const data = await apiRequest(`/events/${id}/members`, "GET");
      setParticipants(data.members || []);
    } catch (err) {
      setError(err.message || "Nem sikerült betölteni a résztvevőket.");
    }
  }

  async function loadPosts() {
    try {
      const data = await apiRequest(`/posts/events/${id}/posts`, "GET");

      setPosts(
        (data.posts || []).map((post) => ({
          id: post.id,
          author: post.authorName || "Admin",
          role: post.role || "ADMIN",
          time: formatDateTime(post.createdAt),
          text: post.text,
        }))
      );
    } catch (err) {
      setError(err.message || "Nem sikerült betölteni a posztokat.");
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();

    if (!chatText.trim()) return;

    try {
      setError("");

      await apiRequest("/messages", "POST", {
        eventId: id,
        text: chatText.trim(),
      });

      setChatText("");
      await loadMessages();
    } catch (err) {
      setError(err.message || "Nem sikerült elküldeni az üzenetet.");
    }
  }

  async function handlePromoteMember(userId) {
    try {
      setError("");

      await apiRequest(`/events/${id}/members/${userId}/promote`, "PATCH");

      await loadMembers();
      await loadEvent();
    } catch (err) {
      setError(err.message || "Nem sikerült adminná tenni.");
    }
  }

  async function handleRemoveMember(userId) {
    try {
      setError("");

      await apiRequest(`/events/${id}/members/${userId}`, "DELETE");

      await loadMembers();
      await loadEvent();
    } catch (err) {
      setError(err.message || "Nem sikerült eltávolítani.");
    }
  }

  function closeModal() {
    setModalType("");
    setMenuOpen(false);
    setEditedName(event?.name || "");
    setEditedDescription(event?.description || "");
    setActionLoading(false);
  }

  async function handleRenameSubmit(e) {
    e.preventDefault();

    if (!editedName.trim()) {
      setError("Az esemény neve kötelező.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await apiRequest(`/events/${id}`, "PATCH", {
        name: editedName.trim(),
        description: editedDescription.trim(),
      });

      await loadEvent();
      closeModal();
    } catch (err) {
      setError(err.message || "Nem sikerült szerkeszteni az eseményt.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handlePostSubmit(e) {
    e.preventDefault();

    if (!newPostText.trim()) return;

    try {
      setError("");

      await apiRequest("/posts", "POST", {
        eventId: id,
        text: newPostText.trim(),
      });

      setNewPostText("");
      await loadPosts();
    } catch (err) {
      setError(err.message || "Nem sikerült posztolni.");
    }
  }

  async function handleLeaveEvent() {
    try {
      setActionLoading(true);
      setError("");

      await apiRequest(`/events/${id}/leave`, "DELETE");

      navigate("/home");
    } catch (err) {
      setError(err.message || "Nem sikerült kilépni az eseményből.");
      setActionLoading(false);
    }
  }

  async function handleDeleteEvent() {
    try {
      setActionLoading(true);
      setError("");

      await apiRequest(`/events/${id}`, "DELETE");

      navigate("/home");
    } catch (err) {
      setError(err.message || "Nem sikerült törölni az eseményt.");
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="event-page">
        <div className="event-shell">
          <h2>Betöltés...</h2>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="event-page">
        <div className="event-shell">
          <h2>Nem található esemény.</h2>
          <Link to="/home">Vissza</Link>
        </div>
      </main>
    );
  }

  return (
    <motion.main
      className="event-page"
      variants={pageMotion}
      initial="initial"
      animate="animate"
    >
      <motion.div className="event-shell" variants={fadeUp}>
        <motion.header className="event-header">
          <div className="event-header__left">
            <Link to="/home" className="event-back-button">
              ←
            </Link>

            <div className="event-heading">
              <p className="event-heading__eyebrow">
                {isAdmin ? "Admin" : "Tag"}
              </p>
              <h1>{event.name}</h1>
            </div>
          </div>

          <motion.button
            className="event-menu-button"
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            whileTap={{ scale: 0.97 }}
          >
            •••
          </motion.button>
        </motion.header>

        {error && <div className="error">{error}</div>}

        <motion.section className="event-summary-card">
          <div className="event-summary-card__top">
            <div className="event-summary-meta">
              <p>Esemény adatok</p>
              <h2>{event.name}</h2>
            </div>
          </div>

          <p className="event-summary-description">
            {event.description || "Nincs leírás."}
          </p>

          <p className="event-summary-description">
            Kód: <strong>{event.joinCode}</strong>
            <br />
            Tagok: <strong>{participants.length || event.membersCount}</strong>
          </p>
        </motion.section>

        <div className="event-tabs">
          <button
            type="button"
            className={activeTab === "wall" ? "event-tab active" : "event-tab"}
            onClick={() => setActiveTab("wall")}
          >
            Fal
          </button>

          <button
            type="button"
            className={activeTab === "chat" ? "event-tab active" : "event-tab"}
            onClick={() => setActiveTab("chat")}
          >
            Chat
          </button>

          <button
            type="button"
            className={
              activeTab === "participants" ? "event-tab active" : "event-tab"
            }
            onClick={() => setActiveTab("participants")}
          >
            Résztvevők
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.button
                className="event-dropdown-backdrop"
                type="button"
                onClick={() => setMenuOpen(false)}
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
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setModalType("rename");
                      setMenuOpen(false);
                    }}
                  >
                    Esemény szerkesztés
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setModalType("leave");
                    setMenuOpen(false);
                  }}
                >
                  Kilépés
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    className="danger-option"
                    onClick={() => {
                      setModalType("delete");
                      setMenuOpen(false);
                    }}
                  >
                    Törlés
                  </button>
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
              <Link
                to={`/event/${event.id}/schedule`}
                className="pinned-schedule-card"
              >
                <h2>Beosztás</h2>
                <span>Megnyitás →</span>
              </Link>

              {isAdmin && (
                <form className="post-composer-card" onSubmit={handlePostSubmit}>
                  <h3>Új admin poszt</h3>

                  <textarea
                    rows="4"
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="Írj ki valamit..."
                  />

                  <button className="primary-button" type="submit">
                    Posztolás
                  </button>
                </form>
              )}

              <div className="post-list">
                {posts.length === 0 ? (
                  <div className="post-card">
                    <p>Még nincs bejegyzés.</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="post-card">
                      <div className="post-card__top">
                        <div>
                          <h3>{post.author}</h3>
                          <p>{post.role}</p>
                        </div>
                        <span>{post.time}</span>
                      </div>

                      <p>{post.text}</p>
                    </div>
                  ))
                )}
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
                {chatMessages.length === 0 ? (
                  <div className="chat-bubble">
                    <p>Még nincs üzenet.</p>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={message.own ? "chat-bubble own" : "chat-bubble"}
                    >
                      <div className="chat-bubble__meta">
                        <span>{message.author}</span>
                        <span>{message.time}</span>
                      </div>

                      <p>{message.text}</p>
                    </div>
                  ))
                )}
              </div>

              <form className="chat-input-bar" onSubmit={handleSendMessage}>
                <input
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  placeholder="Üzenet írása..."
                />

                <button type="submit">Küldés</button>
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
                <h2>Résztvevők</h2>

                <div className="participants-count">
                  {participants.length || event.membersCount} fő
                </div>
              </div>

              <div className="participants-list">
                {participants.length === 0 ? (
                  <div className="participant-card">
                    <h3>Nincs betöltött résztvevő</h3>
                    <p>Próbáld újratölteni az oldalt.</p>
                  </div>
                ) : (
                  participants.map((participant) => (
                    <div className="participant-card" key={participant.userId}>
                      <div className="participant-avatar">
                        {participant.name?.slice(0, 1).toUpperCase() || "?"}
                      </div>

                      <div className="participant-main">
                        <div className="participant-title-row">
                          <h3>{participant.name}</h3>
                          {participant.isMe && <span className="self-badge">Te</span>}
                        </div>

                        <p>
                          {participant.role === "ADMIN" ? "Admin" : "Tag"}
                          {participant.email ? ` • ${participant.email}` : ""}
                        </p>
                      </div>

                      {isAdmin && !participant.isMe && (
                        <div className="participant-actions">
                          {participant.role !== "ADMIN" && (
                            <button
                              type="button"
                              className="participant-action-button"
                              onClick={() => handlePromoteMember(participant.userId)}
                            >
                              Adminná tesz
                            </button>
                          )}

                          <button
                            type="button"
                            className="participant-action-button participant-action-button--danger"
                            onClick={() => handleRemoveMember(participant.userId)}
                          >
                            Eltávolít
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {modalType && (
            <>
              <motion.button
                className="modal-backdrop"
                type="button"
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
                {modalType === "rename" && (
                  <form onSubmit={handleRenameSubmit} className="modal-form">
                    <h3>Esemény szerkesztése</h3>

                    <input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Esemény neve"
                    />

                    <textarea
                      rows="4"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      placeholder="Esemény leírása"
                    />

                    <div className="modal-actions">
                      <button
                        className="ghost-button"
                        type="button"
                        onClick={closeModal}
                        disabled={actionLoading}
                      >
                        Mégse
                      </button>

                      <button className="primary-button" disabled={actionLoading}>
                        {actionLoading ? "Mentés..." : "Mentés"}
                      </button>
                    </div>
                  </form>
                )}

                {modalType === "leave" && (
                  <>
                    <h3>Biztos kilépsz?</h3>
                    <p className="event-summary-description">
                      Kilépés után nem fogod látni ezt az eseményt.
                    </p>

                    <div className="modal-actions">
                      <button
                        className="ghost-button"
                        type="button"
                        onClick={closeModal}
                        disabled={actionLoading}
                      >
                        Mégse
                      </button>

                      <button
                        className="danger-button"
                        type="button"
                        onClick={handleLeaveEvent}
                        disabled={actionLoading}
                      >
                        {actionLoading ? "Kilépés..." : "Kilépés"}
                      </button>
                    </div>
                  </>
                )}

                {modalType === "delete" && (
                  <>
                    <h3>Biztos törlöd?</h3>
                    <p className="event-summary-description">
                      Ez törli az eseményt, a tagokat, a posztokat, az üzeneteket
                      és a beosztás blokkokat is.
                    </p>

                    <div className="modal-actions">
                      <button
                        className="ghost-button"
                        type="button"
                        onClick={closeModal}
                        disabled={actionLoading}
                      >
                        Mégse
                      </button>

                      <button
                        className="danger-button"
                        type="button"
                        onClick={handleDeleteEvent}
                        disabled={actionLoading}
                      >
                        {actionLoading ? "Törlés..." : "Törlés"}
                      </button>
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