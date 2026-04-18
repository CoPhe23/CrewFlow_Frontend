import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/EventPage.css";

export default function EventPage() {
  const [activeTab, setActiveTab] = useState("wall");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [eventName, setEventName] = useState("Tavaszi Iskolabál");
  const [eventDescription, setEventDescription] = useState(
    "Az esemény fő szervezői felülete. Itt jelennek meg a fontos információk, a kiemelt beosztás, valamint a csapat kommunikációja."
  );
  const [editedName, setEditedName] = useState(eventName);

  const event = {
    id: 1,
    name: eventName,
    description: eventDescription,
    role: "Szervező",
    participantCount: 18,
    canManage: true,
  };

  const posts = [
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
      role: "Szervező",
      time: "Ma, 11:08",
      text: "A dekoros csapat listája frissítve lett, este még felkerül a végleges beosztás is.",
    },
  ];

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

  const participants = [
    {
      id: 1,
      name: "Máté Bárdos",
      role: "Szervező",
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
  ];

  function closeModal() {
    setModalType("");
    setMenuOpen(false);
    setEditedName(eventName);
  }

  function handleRenameSubmit(e) {
    e.preventDefault();
    if (!editedName.trim()) return;
    setEventName(editedName.trim());
    closeModal();
  }

  function handleDeleteEvent() {
    console.log("Törlés backenddel később");
    closeModal();
  }

  function handleLeaveEvent() {
    console.log("Kilépés backenddel később");
    closeModal();
  }

  return (
    <main className="event-page">
      <div className="event-shell">
        <header className="event-header">
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
            <button
              className="event-menu-button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Esemény műveletek"
            >
              •••
            </button>
          </div>
        </header>

        <section className="event-summary-card">
          <div className="event-summary-card__top">
            <div className="event-summary-icon">
              <span />
              <span />
              <span />
            </div>

            <div className="event-summary-meta">
              <p>Esemény adatai</p>
              <h2>{event.name}</h2>
            </div>
          </div>

          <p className="event-summary-description">{event.description}</p>
        </section>

        <div className="event-tabs">
          <button
            className={activeTab === "wall" ? "event-tab active" : "event-tab"}
            onClick={() => setActiveTab("wall")}
          >
            Fal
          </button>

          <button
            className={activeTab === "chat" ? "event-tab active" : "event-tab"}
            onClick={() => setActiveTab("chat")}
          >
            Chat
          </button>

          <button
            className={activeTab === "participants" ? "event-tab active" : "event-tab"}
            onClick={() => setActiveTab("participants")}
          >
            Résztvevők
          </button>
        </div>

        {menuOpen && (
          <>
            <button
              className="event-dropdown-backdrop"
              onClick={() => setMenuOpen(false)}
              aria-label="Bezárás"
            />

            <div className="event-dropdown">
              {event.canManage && (
                <button
                  onClick={() => {
                    setModalType("rename");
                    setMenuOpen(false);
                  }}
                >
                  Esemény nevének szerkesztése
                </button>
              )}

              <button
                onClick={() => {
                  setModalType("leave");
                  setMenuOpen(false);
                }}
              >
                Kilépés az eseményből
              </button>

              {event.canManage && (
                <button
                  className="danger-option"
                  onClick={() => {
                    setModalType("delete");
                    setMenuOpen(false);
                  }}
                >
                  Esemény törlése
                </button>
              )}
            </div>
          </>
        )}

        {activeTab === "wall" && (
          <section className="event-content">
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

            <div className="post-list">
              {posts.map((post) => (
                <article className="post-card" key={post.id}>
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
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "chat" && (
          <section className="chat-section">
            <div className="chat-messages">
              {chatMessages.map((message) => (
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
              ))}
            </div>

            <form className="chat-input-bar">
              <input type="text" placeholder="Üzenet írása..." />
              <button type="submit">Küldés</button>
            </form>
          </section>
        )}

        {activeTab === "participants" && (
          <section className="participants-section">
            <div className="participants-header-card">
              <div>
                <p>Tagok</p>
                <h2>Résztvevők</h2>
              </div>

              <div className="participants-count">{event.participantCount} fő</div>
            </div>

            <div className="participants-list">
              {participants.map((participant) => (
                <article className="participant-card" key={participant.id}>
                  <div className="participant-avatar">
                    {participant.name.slice(0, 1)}
                  </div>

                  <div className="participant-main">
                    <h3>{participant.name}</h3>
                    <p>{participant.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {modalType && (
          <>
            <button className="modal-backdrop" onClick={closeModal} aria-label="Bezárás" />

            <div className="modal-card">
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
                      <button type="button" className="ghost-button" onClick={closeModal}>
                        Mégse
                      </button>
                      <button type="submit" className="primary-button">
                        Mentés
                      </button>
                    </div>
                  </form>
                </>
              )}

              {modalType === "leave" && (
                <>
                  <div className="modal-head">
                    <p>Kilépés</p>
                    <h3>Biztosan kilépsz?</h3>
                  </div>

                  <div className="modal-text-block">
                    Ezzel kilépsz az eseményből. Később csak új meghívókóddal tudsz
                    visszacsatlakozni.
                  </div>

                  <div className="modal-actions">
                    <button type="button" className="ghost-button" onClick={closeModal}>
                      Mégse
                    </button>
                    <button type="button" className="danger-button" onClick={handleLeaveEvent}>
                      Kilépés
                    </button>
                  </div>
                </>
              )}

              {modalType === "delete" && (
                <>
                  <div className="modal-head">
                    <p>Törlés</p>
                    <h3>Biztosan törlöd az eseményt?</h3>
                  </div>

                  <div className="modal-text-block">
                    Ez a művelet később nem vonható vissza. Az esemény összes adata
                    törlődni fog.
                  </div>

                  <div className="modal-actions">
                    <button type="button" className="ghost-button" onClick={closeModal}>
                      Mégse
                    </button>
                    <button type="button" className="danger-button" onClick={handleDeleteEvent}>
                      Törlés
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}