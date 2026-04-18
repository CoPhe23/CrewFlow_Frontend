import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/schedule-page.css";

export default function SchedulePage() {
  const { id } = useParams();

  const [viewMode, setViewMode] = useState("timeline");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [insightOpen, setInsightOpen] = useState(false);
  const [insightTab, setInsightTab] = useState("");

  const event = {
    id,
    name: "Tavaszi Iskolabál",
    date: "2025. október 12.",
    location: "Kandó aula",
  };

  const participants = [
    { id: 1, name: "Máté Bárdos" },
    { id: 2, name: "Anna Kovács" },
    { id: 3, name: "Bence Tóth" },
    { id: 4, name: "Lili Nagy" },
    { id: 5, name: "Vivien Körtvélyesi" },
    { id: 6, name: "Regina Prekopa" },
  ];

  const tasks = [
    {
      id: 1,
      title: "Regisztráció",
      category: "Frontdesk",
      start: "07:45",
      end: "08:30",
      location: "Főbejárat",
      address: "Kecskemét, aula főbejárat",
      description:
        "Vendégek fogadása, névsor ellenőrzése, gyors eligazítás a belépésnél.",
      assignees: [1, 2],
      color: "sand",
    },
    {
      id: 2,
      title: "Megnyitó",
      category: "Program",
      start: "08:30",
      end: "08:45",
      location: "Nagyszínpad",
      address: "Kecskemét, aula színpad",
      description:
        "Mikrofonok ellenőrzése, fellépők indítása, rövid koordináció.",
      assignees: [3],
      color: "green",
    },
    {
      id: 3,
      title: "Jégtörő játékok",
      category: "Program",
      start: "08:45",
      end: "09:15",
      location: "Központi tér",
      address: "Kecskemét, aula központi tér",
      description:
        "Közös játék levezetése, résztvevők mozgatása, fotós koordinálás.",
      assignees: [4, 5],
      color: "cyan",
    },
    {
      id: 4,
      title: "WS bemutatás",
      category: "Workshop",
      start: "10:15",
      end: "10:30",
      location: "2-es terem",
      address: "Kecskemét, 2-es terem",
      description:
        "Workshop felvezetése, technika ellenőrzése, előadó támogatása.",
      assignees: [2, 6],
      color: "violet",
    },
    {
      id: 5,
      title: "Chill room felügyelet",
      category: "Support",
      start: "10:00",
      end: "10:30",
      location: "Pihenő terem",
      address: "Kecskemét, pihenő terem",
      description:
        "Rend fenntartása, kérdések kezelése, kisebb problémák elhárítása.",
      assignees: [1],
      color: "lime",
    },
  ];

  const participantMap = useMemo(() => {
    return Object.fromEntries(participants.map((p) => [p.id, p]));
  }, [participants]);

  const selectedTask =
    tasks.find((task) => task.id === selectedTaskId) || tasks[0];

  const uniqueLocations = useMemo(() => {
    const seen = new Map();

    tasks.forEach((task) => {
      if (!seen.has(task.location)) {
        seen.set(task.location, {
          name: task.location,
          address: task.address,
        });
      }
    });

    return Array.from(seen.values());
  }, [tasks]);

  function getMapsUrl(address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  function toggleInsight(tab) {
    if (insightOpen && insightTab === tab) {
      setInsightOpen(false);
      setInsightTab("");
      return;
    }

    setInsightOpen(true);
    setInsightTab(tab);
  }

  return (
    <main className="schedule-page">
      <div className="schedule-shell">
        <header className="schedule-header">
          <div className="schedule-header__left">
            <Link
              to={`/event/${event.id}`}
              className="schedule-back-button"
              aria-label="Vissza az eseményhez"
            >
              ←
            </Link>

            <div className="schedule-heading">
              <p className="schedule-heading__eyebrow">Beosztás</p>
              <h1>{event.name}</h1>
              <span>
                {event.date} • {event.location}
              </span>
            </div>
          </div>

          <div className="schedule-header__actions">
            <div className="schedule-view-switch">
              <button
                className={viewMode === "timeline" ? "active" : ""}
                onClick={() => setViewMode("timeline")}
              >
                Idővonal
              </button>
              <button
                className={viewMode === "list" ? "active" : ""}
                onClick={() => setViewMode("list")}
              >
                Lista
              </button>
            </div>

            <div className="schedule-mobile-actions-row">
              <button
                className="schedule-create-button"
                onClick={() => setShowCreateModal(true)}
              >
                + Új blokk
              </button>

              <section className="schedule-overview">
                <button
                  className={
                    insightOpen && insightTab === "tasks"
                      ? "overview-card overview-card--active"
                      : "overview-card"
                  }
                  onClick={() => toggleInsight("tasks")}
                  aria-label="Feladatok"
                >
                  <p>Feladatok</p>
                  <h2>{tasks.length}</h2>
                  <div className="overview-card__icon tasks" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                </button>

                <button
                  className={
                    insightOpen && insightTab === "participants"
                      ? "overview-card overview-card--active"
                      : "overview-card"
                  }
                  onClick={() => toggleInsight("participants")}
                  aria-label="Résztvevők"
                >
                  <p>Résztvevők</p>
                  <h2>{participants.length}</h2>
                  <div
                    className="overview-card__icon participants"
                    aria-hidden="true"
                  >
                    <span />
                    <span />
                  </div>
                </button>

                <button
                  className={
                    insightOpen && insightTab === "locations"
                      ? "overview-card overview-card--active"
                      : "overview-card"
                  }
                  onClick={() => toggleInsight("locations")}
                  aria-label="Helyszínek"
                >
                  <p>Helyszínek</p>
                  <h2>{uniqueLocations.length}</h2>
                  <div
                    className="overview-card__icon locations"
                    aria-hidden="true"
                  >
                    <span />
                    <span />
                  </div>
                </button>
              </section>
            </div>
          </div>
        </header>

        {insightOpen && (
          <section className="insight-panel">
            <div className="insight-panel__head">
              <div>
                <p>Gyors áttekintés</p>
                <h3>
                  {insightTab === "tasks" && "Feladatok"}
                  {insightTab === "participants" && "Résztvevők"}
                  {insightTab === "locations" && "Helyszínek"}
                </h3>
              </div>

              <button
                className="insight-close-button"
                onClick={() => {
                  setInsightOpen(false);
                  setInsightTab("");
                }}
              >
                Bezárás
              </button>
            </div>

            {insightTab === "tasks" && (
              <div className="insight-list">
                {tasks.map((task) => (
                  <div className="insight-row" key={task.id}>
                    <div>
                      <strong>{task.title}</strong>
                      <span>{task.category}</span>
                    </div>

                    <div className="insight-row__meta">
                      {task.start} – {task.end}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {insightTab === "locations" && (
              <div className="insight-list">
                {uniqueLocations.map((location) => (
                  <div className="insight-row" key={location.name}>
                    <div>
                      <strong>{location.name}</strong>
                      <span>{location.address}</span>
                    </div>

                    <a
                      className="insight-link"
                      href={getMapsUrl(location.address)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Maps
                    </a>
                  </div>
                ))}
              </div>
            )}

            {insightTab === "participants" && (
              <div className="insight-list">
                {participants.map((participant) => {
                  const count = tasks.filter((task) =>
                    task.assignees.includes(participant.id)
                  ).length;

                  return (
                    <div className="insight-row" key={participant.id}>
                      <div>
                        <strong>{participant.name}</strong>
                        <span>Résztvevő</span>
                      </div>

                      <div className="insight-row__meta">{count} feladat</div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        <section className="schedule-layout">
          <div className="schedule-main">
            {viewMode === "timeline" ? (
              <div className="timeline-list">
                {tasks.map((task) => {
                  const isOpen = selectedTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      className={isOpen ? `task-block open ${task.color}` : `task-block ${task.color}`}
                    >
                      <button
                        className={
                          isOpen
                            ? `task-card active ${task.color}`
                            : `task-card ${task.color}`
                        }
                        onClick={() => setSelectedTaskId(isOpen ? null : task.id)}
                      >
                        <div className="task-card__time">
                          <span>{task.start}</span>
                          <span>{task.end}</span>
                        </div>

                        <div className="task-card__main">
                          <div className="task-card__top">
                            <p>{task.category}</p>
                            <span>{task.location}</span>
                          </div>

                          <h3>{task.title}</h3>

                          <div className="task-card__people">
                            {task.assignees.map((assigneeId) => (
                              <div key={assigneeId} className="person-pill">
                                {participantMap[assigneeId]?.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      </button>

                      {isOpen && (
                        <div className={`task-inline-detail ${task.color}`}>
                          <div className="task-inline-detail__inner">
                            <div className="task-detail-meta">
                              <div className="detail-row">
                                <span>Idő</span>
                                <strong>
                                  {task.start} – {task.end}
                                </strong>
                              </div>

                              <div className="detail-row">
                                <span>Helyszín</span>
                                <strong>{task.location}</strong>
                              </div>

                              <div className="detail-row">
                                <span>Cím</span>
                                <strong>{task.address}</strong>
                              </div>
                            </div>

                            <div className="task-detail-description">
                              <p>Leírás</p>
                              <div>{task.description}</div>
                            </div>

                            <div className="task-detail-assignees">
                              <p>Hozzárendelt emberek</p>
                              <div className="detail-assignee-list">
                                {task.assignees.map((assigneeId) => (
                                  <div key={assigneeId} className="detail-assignee-pill">
                                    {participantMap[assigneeId]?.name}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="task-detail-actions">
                              <a
                                className="ghost-link-button"
                                href={getMapsUrl(task.address)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Útvonaltervezés
                              </a>

                              <button className="primary-action-button">
                                Szerkesztés
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="task-table-card">
                <div className="task-table-header">
                  <span>Idő</span>
                  <span>Feladat</span>
                  <span>Helyszín</span>
                  <span>Felelősök</span>
                </div>

                {tasks.map((task) => (
                  <button
                    key={task.id}
                    className="task-table-row"
                    onClick={() => setSelectedTaskId(task.id)}
                  >
                    <span>
                      {task.start}–{task.end}
                    </span>
                    <span>{task.title}</span>
                    <span>{task.location}</span>
                    <span>
                      {task.assignees
                        .map((assigneeId) => participantMap[assigneeId]?.name)
                        .join(", ")}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <aside className="schedule-side desktop-only">
            <div className={`task-detail-card ${selectedTask.color}`}>
              <div className="task-detail-card__top">
                <p>{selectedTask.category}</p>
                <h2>{selectedTask.title}</h2>
              </div>

              <div className="task-detail-meta">
                <div className="detail-row">
                  <span>Idő</span>
                  <strong>
                    {selectedTask.start} – {selectedTask.end}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Helyszín</span>
                  <strong>{selectedTask.location}</strong>
                </div>

                <div className="detail-row">
                  <span>Cím</span>
                  <strong>{selectedTask.address}</strong>
                </div>
              </div>

              <div className="task-detail-description">
                <p>Leírás</p>
                <div>{selectedTask.description}</div>
              </div>

              <div className="task-detail-assignees">
                <p>Hozzárendelt emberek</p>
                <div className="detail-assignee-list">
                  {selectedTask.assignees.map((assigneeId) => (
                    <div key={assigneeId} className="detail-assignee-pill">
                      {participantMap[assigneeId]?.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="task-detail-actions">
                <a
                  className="ghost-link-button"
                  href={getMapsUrl(selectedTask.address)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Útvonaltervezés
                </a>

                <button className="primary-action-button">Szerkesztés</button>
              </div>
            </div>
          </aside>
        </section>

        {showCreateModal && (
          <>
            <button
              className="schedule-modal-backdrop"
              onClick={() => setShowCreateModal(false)}
              aria-label="Bezárás"
            />

            <div className="schedule-modal">
              <div className="schedule-modal__head">
                <p>Új beosztás blokk</p>
                <h3>Gyors létrehozás</h3>
              </div>

              <form className="schedule-modal__form">
                <input type="text" placeholder="Feladat neve" />
                <div className="double-input-row">
                  <input type="text" placeholder="Kezdés pl. 08:30" />
                  <input type="text" placeholder="Befejezés pl. 09:15" />
                </div>
                <input type="text" placeholder="Helyszín" />
                <input type="text" placeholder="Cím / Maps link" />
                <textarea placeholder="Rövid leírás" rows="4" />
                <div className="schedule-modal__actions">
                  <button
                    type="button"
                    className="secondary-modal-button"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Mégse
                  </button>
                  <button type="submit" className="primary-modal-button">
                    Létrehozás
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </main>
  );
}