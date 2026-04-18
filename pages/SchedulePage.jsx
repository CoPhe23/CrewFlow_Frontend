import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import "../styles/schedule-page.css";
import { backdropFade, fadeUp, pageMotion, popIn, tabPanel } from "../lib/motion";

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
      address: "Kecskemét, könyves kálmán krt 32",
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

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || tasks[0];

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
    <motion.main
      className="schedule-page"
      variants={pageMotion}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div className="schedule-shell" variants={fadeUp}>
        <motion.header className="schedule-header" variants={fadeUp}>
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
              <motion.button
                className={viewMode === "timeline" ? "active" : ""}
                onClick={() => setViewMode("timeline")}
                whileTap={{ scale: 0.97 }}
              >
                Idővonal
              </motion.button>
              <motion.button
                className={viewMode === "list" ? "active" : ""}
                onClick={() => setViewMode("list")}
                whileTap={{ scale: 0.97 }}
              >
                Lista
              </motion.button>
            </div>

            <div className="schedule-mobile-actions-row">
              <motion.button
                className="schedule-create-button"
                onClick={() => setShowCreateModal(true)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                + Új blokk
              </motion.button>

              <motion.button
                className={`schedule-mobile-icon-button ${insightOpen && insightTab === "tasks" ? "active" : ""}`}
                onClick={() => toggleInsight("tasks")}
                whileTap={{ scale: 0.95 }}
                aria-label="Feladatok áttekintése"
                title="Feladatok"
              >
                <span className="schedule-mini-icon schedule-mini-icon--tasks" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </motion.button>

              <motion.button
                className={`schedule-mobile-icon-button ${insightOpen && insightTab === "locations" ? "active" : ""}`}
                onClick={() => toggleInsight("locations")}
                whileTap={{ scale: 0.95 }}
                aria-label="Helyszínek áttekintése"
                title="Helyszínek"
              >
                <span className="schedule-mini-icon schedule-mini-icon--locations" aria-hidden="true">
                  <span />
                  <span />
                </span>
              </motion.button>

              <motion.button
                className={`schedule-mobile-icon-button ${insightOpen && insightTab === "participants" ? "active" : ""}`}
                onClick={() => toggleInsight("participants")}
                whileTap={{ scale: 0.95 }}
                aria-label="Résztvevők áttekintése"
                title="Emberek"
              >
                <span className="schedule-mini-icon schedule-mini-icon--participants" aria-hidden="true">
                  <span />
                  <span />
                </span>
              </motion.button>
            </div>
          </div>
        </motion.header>

        <motion.section className="schedule-overview" variants={fadeUp}>
          <motion.button
            className={insightOpen && insightTab === "tasks" ? "overview-card overview-card--active" : "overview-card"}
            onClick={() => toggleInsight("tasks")}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
          >
            <p>Feladatok</p>
            <h2>{tasks.length}</h2>
          </motion.button>

          <motion.button
            className={insightOpen && insightTab === "locations" ? "overview-card overview-card--active" : "overview-card"}
            onClick={() => toggleInsight("locations")}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
          >
            <p>Helyszínek</p>
            <h2>{uniqueLocations.length}</h2>
          </motion.button>

          <motion.button
            className={insightOpen && insightTab === "participants" ? "overview-card overview-card--active" : "overview-card"}
            onClick={() => toggleInsight("participants")}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
          >
            <p>Emberek</p>
            <h2>{participants.length}</h2>
          </motion.button>
        </motion.section>

        <AnimatePresence initial={false}>
          {insightOpen && (
            <motion.section
              className="insight-panel"
              variants={popIn}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="insight-panel__head">
                <div>
                  <p>Áttekintés</p>
                  <h3>
                    {insightTab === "tasks" && "Feladatok részletesen"}
                    {insightTab === "locations" && "Helyszínek"}
                    {insightTab === "participants" && "Résztvevők terhelése"}
                  </h3>
                </div>

                <motion.button
                  className="insight-close-button"
                  onClick={() => {
                    setInsightOpen(false);
                    setInsightTab("");
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  Bezárás
                </motion.button>
              </div>

              {insightTab === "tasks" && (
                <div className="insight-list">
                  {tasks.map((task, index) => (
                    <motion.div
                      className="insight-row"
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <div>
                        <strong>{task.title}</strong>
                        <span>
                          {task.start} – {task.end} • {task.location}
                        </span>
                      </div>

                      <div className="insight-row__meta">{task.assignees.length} fő</div>
                    </motion.div>
                  ))}
                </div>
              )}

              {insightTab === "locations" && (
                <div className="insight-list">
                  {uniqueLocations.map((location, index) => (
                    <motion.div
                      className="insight-row"
                      key={location.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
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
                    </motion.div>
                  ))}
                </div>
              )}

              {insightTab === "participants" && (
                <div className="insight-list">
                  {participants.map((participant, index) => {
                    const count = tasks.filter((task) => task.assignees.includes(participant.id)).length;

                    return (
                      <motion.div
                        className="insight-row"
                        key={participant.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                      >
                        <div>
                          <strong>{participant.name}</strong>
                          <span>Résztvevő</span>
                        </div>

                        <div className="insight-row__meta">{count} feladat</div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        <motion.section className="schedule-layout" variants={fadeUp}>
          <div className="schedule-main">
            <AnimatePresence mode="wait">
              {viewMode === "timeline" ? (
                <motion.div
                  key="timeline"
                  className="timeline-list"
                  variants={tabPanel}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {tasks.map((task, index) => {
                    const isOpen = selectedTaskId === task.id;

                    return (
                      <motion.div
                        key={task.id}
                        className={isOpen ? `task-block open ${task.color}` : `task-block ${task.color}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.24, delay: index * 0.04 }}
                        layout
                      >
                        <motion.button
                          className={isOpen ? `task-card active ${task.color}` : `task-card ${task.color}`}
                          onClick={() => setSelectedTaskId(isOpen ? null : task.id)}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.992 }}
                          layout
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
                        </motion.button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              className={`task-inline-detail ${task.color}`}
                              initial={{ opacity: 0, height: 0, y: -6 }}
                              animate={{ opacity: 1, height: "auto", y: 0 }}
                              exit={{ opacity: 0, height: 0, y: -4 }}
                              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <motion.div
                                className="task-inline-detail__inner"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.16, delay: 0.04 }}
                              >
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

                                  <motion.button className="primary-action-button" whileTap={{ scale: 0.97 }}>
                                    Szerkesztés
                                  </motion.button>
                                </div>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  className="task-table-card"
                  variants={tabPanel}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div className="task-table-header">
                    <span>Idő</span>
                    <span>Feladat</span>
                    <span>Helyszín</span>
                    <span>Felelősök</span>
                  </div>

                  {tasks.map((task, index) => (
                    <motion.button
                      key={task.id}
                      className="task-table-row"
                      onClick={() => setSelectedTaskId(task.id)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      whileHover={{ backgroundColor: "rgba(9, 15, 13, 0.28)" }}
                      whileTap={{ scale: 0.996 }}
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
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside className="schedule-side desktop-only">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTask.id}
                className={`task-detail-card ${selectedTask.color}`}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
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

                  <motion.button className="primary-action-button" whileTap={{ scale: 0.97 }}>
                    Szerkesztés
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </aside>
        </motion.section>

        <AnimatePresence>
          {showCreateModal && (
            <>
              <motion.button
                className="schedule-modal-backdrop"
                onClick={() => setShowCreateModal(false)}
                aria-label="Bezárás"
                variants={backdropFade}
                initial="initial"
                animate="animate"
                exit="exit"
              />

              <motion.div
                className="schedule-modal"
                variants={popIn}
                initial="initial"
                animate="animate"
                exit="exit"
              >
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
                    <motion.button
                      type="button"
                      className="secondary-modal-button"
                      onClick={() => setShowCreateModal(false)}
                      whileTap={{ scale: 0.985 }}
                    >
                      Mégse
                    </motion.button>
                    <motion.button type="submit" className="primary-modal-button" whileTap={{ scale: 0.985 }}>
                      Létrehozás
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.main>
  );
}
