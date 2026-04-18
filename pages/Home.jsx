import { useMemo, useState } from "react";
import "../styles/home.css";

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

    const newEvent = {
      id: Date.now(),
      title: `Csatlakozott esemény (${joinCode.trim().toUpperCase()})`,
      code: joinCode.trim().toUpperCase(),
      members: 12,
      role: "Tag",
    };

    setEvents((prev) => [...prev, newEvent]);
    closeModal();
  }

  function handleCreateSubmit(e) {
    e.preventDefault();
    if (!eventName.trim()) return;

    const randomCode = Math.random().toString(36).slice(2, 8).toUpperCase();

    const newEvent = {
      id: Date.now(),
      title: eventName.trim(),
      code: randomCode,
      members: 1,
      role: "Tulajdonos",
    };

    setEvents((prev) => [...prev, newEvent]);
    closeModal();
  }

  return (
    <main className="home-page">
      <div className="home-shell">
        <header className="home-topbar">
          <div>
            <p className="home-eyebrow">CrewFlow</p>
            <h1>{titleText}</h1>
          </div>
        </header>

        {hasEvents ? (
          <section className="event-grid">
            {events.map((event) => (
              <article className="event-card" key={event.id}>
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
              </article>
            ))}
          </section>
        ) : (
          <section className="empty-state">
            <div className="empty-graphic" aria-hidden="true">
              <div className="empty-graphic__circle" />
              <div className="empty-graphic__spark spark-1" />
              <div className="empty-graphic__spark spark-2" />
              <div className="empty-graphic__spark spark-3" />
            </div>

            <h2>Még nem vagy tagja egy eseménynek sem</h2>
            <p>
              Csatlakozz egy meglévőhöz kóddal, vagy hozz létre egy újat pár
              kattintással.
            </p>

            <button
              className="empty-plus-button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Esemény létrehozása vagy csatlakozás"
            >
              +
            </button>
          </section>
        )}

        {hasEvents && (
          <div className="floating-action-wrapper">
            <button
              className="floating-action-button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Új esemény vagy csatlakozás"
            >
              +
            </button>
          </div>
        )}

        {menuOpen && (
          <>
            <button
              className="menu-backdrop"
              aria-label="Bezárás"
              onClick={() => setMenuOpen(false)}
            />
            <div className={`action-menu ${hasEvents ? "action-menu--fab" : ""}`}>
              <button onClick={openJoinModal}>Csatlakozás kóddal</button>
              <button onClick={openCreateModal}>Új esemény létrehozása</button>
            </div>
          </>
        )}

        {modalType && (
          <>
            <button
              className="modal-backdrop"
              aria-label="Bezárás"
              onClick={closeModal}
            />
            <div className="modal-card">
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
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={closeModal}
                      >
                        Mégse
                      </button>
                      <button type="submit" className="primary-button">
                        Csatlakozás
                      </button>
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
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={closeModal}
                      >
                        Mégse
                      </button>
                      <button type="submit" className="primary-button">
                        Létrehozás
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}