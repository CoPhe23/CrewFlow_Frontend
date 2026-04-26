import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import "../styles/schedule-page.css";
import { backdropFade, fadeUp, pageMotion, popIn, tabPanel } from "../lib/motion";

const CURRENT_USER_ID = 1;
const EMPTY_TASK_FORM = {
  title: "",
  category: "",
  start: "",
  end: "",
  location: "",
  address: "",
  description: "",
  assignees: [],
  color: "green",
};

export default function SchedulePage() {
  const { id } = useParams();

  const [viewMode, setViewMode] = useState("timeline");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskForm, setTaskForm] = useState(EMPTY_TASK_FORM);
  const [insightOpen, setInsightOpen] = useState(false);
  const [insightTab, setInsightTab] = useState("");

  const event = {
    id,
    name: "Tavaszi Iskolabál",
    date: "2025. október 12.",
    location: "Kandó aula",
  };

  const participants = [
    { id: 1, name: "Máté Bárdos", role: "Admin" },
    { id: 2, name: "Anna Kovács", role: "Admin" },
    { id: 3, name: "Bence Tóth", role: "Tag" },
    { id: 4, name: "Lili Nagy", role: "Tag" },
    { id: 5, name: "Vivien Körtvélyesi", role: "Tag" },
    { id: 6, name: "Regina Prekopa", role: "Tag" },
  ];

  const currentUser = participants.find((participant) => participant.id === CURRENT_USER_ID);
  const isAdmin = currentUser?.role === "Admin";

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Regisztráció",
      category: "Frontdesk",
      start: "07:45",
      end: "08:30",
      location: "Főbejárat",
      address: "Kecskemét, aula főbejárat",
      description: "Vendégek fogadása, névsor ellenőrzése, gyors eligazítás a belépésnél.",
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
      description: "Mikrofonok ellenőrzése, fellépők indítása, rövid koordináció.",
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
      description: "Közös játék levezetése, résztvevők mozgatása, fotós koordinálás.",
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
      description: "Workshop felvezetése, technika ellenőrzése, előadó támogatása.",
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
      description: "Rend fenntartása, kérdések kezelése, kisebb problémák elhárítása.",
      assignees: [1],
      color: "lime",
    },
  ]);

  const participantMap = useMemo(() => {
    return Object.fromEntries(participants.map((p) => [p.id, p]));
  }, [participants]);

  const participantTaskCounts = useMemo(() => {
    return tasks.reduce((counts, task) => {
      task.assignees.forEach((assigneeId) => {
        counts[assigneeId] = (counts[assigneeId] || 0) + 1;
      });
      return counts;
    }, {});
  }, [tasks]);

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

  function openCreateTaskModal() {
    if (!isAdmin) return;
    setEditingTaskId(null);
    setTaskForm(EMPTY_TASK_FORM);
    setShowTaskModal(true);
  }

  function openEditTaskModal(task) {
    if (!isAdmin || !task) return;
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      category: task.category,
      start: task.start,
      end: task.end,
      location: task.location,
      address: task.address,
      description: task.description,
      assignees: task.assignees,
      color: task.color,
    });
    setShowTaskModal(true);
  }

  function closeTaskModal() {
    setShowTaskModal(false);
    setEditingTaskId(null);
    setTaskForm(EMPTY_TASK_FORM);
  }

  function updateTaskForm(field, value) {
    setTaskForm((prevForm) => ({ ...prevForm, [field]: value }));
  }

  function toggleAssignee(participantId) {
    setTaskForm((prevForm) => {
      const hasAssignee = prevForm.assignees.includes(participantId);
      return {
        ...prevForm,
        assignees: hasAssignee
          ? prevForm.assignees.filter((id) => id !== participantId)
          : [...prevForm.assignees, participantId],
      };
    });
  }

  function handleTaskSubmit(e) {
    e.preventDefault();
    if (!isAdmin || !taskForm.title.trim()) return;

    const normalizedTask = {
      title: taskForm.title.trim(),
      category: taskForm.category.trim() || "Feladat",
      start: taskForm.start.trim() || "--:--",
      end: taskForm.end.trim() || "--:--",
      location: taskForm.location.trim() || "Nincs megadva",
      address: taskForm.address.trim() || taskForm.location.trim() || "Nincs megadva",
      description: taskForm.description.trim() || "Nincs leírás megadva.",
      assignees: taskForm.assignees,
      color: taskForm.color || "green",
    };

    if (editingTaskId) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTaskId ? { ...task, ...normalizedTask } : task
        )
      );
      setSelectedTaskId(editingTaskId);
    } else {
      const newTask = {
        id: Date.now(),
        ...normalizedTask,
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setSelectedTaskId(newTask.id);
    }

    closeTaskModal();
  }

  function handleDeleteTask(taskId) {
    if (!isAdmin) return;

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
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
              <p className="schedule-heading__eyebrow">Beosztás {isAdmin ? "• Admin" : ""}</p>
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
              {isAdmin && (
                <motion.button
                  className="schedule-create-button"
                  onClick={openCreateTaskModal}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  + Új blokk
                </motion.button>
              )}

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
                  {participants.map((participant, index) => (
                    <motion.div
                      className="insight-row"
                      key={participant.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <div>
                        <strong>{participant.name}</strong>
                        <span>{participant.role}</span>
                      </div>

                      <div className="insight-row__meta">{participantTaskCounts[participant.id] || 0} feladat</div>
                    </motion.div>
                  ))}
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
                                <TaskDetails
                                  task={task}
                                  participantMap={participantMap}
                                  getMapsUrl={getMapsUrl}
                                  isAdmin={isAdmin}
                                  onEdit={() => openEditTaskModal(task)}
                                  onDelete={() => handleDeleteTask(task.id)}
                                />
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

          {selectedTask && (
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

                  <TaskDetails
                    task={selectedTask}
                    participantMap={participantMap}
                    getMapsUrl={getMapsUrl}
                    isAdmin={isAdmin}
                    onEdit={() => openEditTaskModal(selectedTask)}
                    onDelete={() => handleDeleteTask(selectedTask.id)}
                  />
                </motion.div>
              </AnimatePresence>
            </aside>
          )}
        </motion.section>

        <AnimatePresence>
          {showTaskModal && isAdmin && (
            <>
              <motion.button
                className="schedule-modal-backdrop"
                onClick={closeTaskModal}
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
                  <p>{editingTaskId ? "Blokk szerkesztése" : "Új beosztás blokk"}</p>
                  <h3>{editingTaskId ? "Feladat módosítása" : "Gyors létrehozás"}</h3>
                </div>

                <form className="schedule-modal__form" onSubmit={handleTaskSubmit}>
                  <input
                    type="text"
                    placeholder="Feladat neve"
                    value={taskForm.title}
                    onChange={(e) => updateTaskForm("title", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Kategória pl. Program"
                    value={taskForm.category}
                    onChange={(e) => updateTaskForm("category", e.target.value)}
                  />
                  <div className="double-input-row">
                    <input
                      type="text"
                      placeholder="Kezdés pl. 08:30"
                      value={taskForm.start}
                      onChange={(e) => updateTaskForm("start", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Befejezés pl. 09:15"
                      value={taskForm.end}
                      onChange={(e) => updateTaskForm("end", e.target.value)}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Helyszín"
                    value={taskForm.location}
                    onChange={(e) => updateTaskForm("location", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Cím / Maps link"
                    value={taskForm.address}
                    onChange={(e) => updateTaskForm("address", e.target.value)}
                  />
                  <textarea
                    placeholder="Rövid leírás"
                    rows="4"
                    value={taskForm.description}
                    onChange={(e) => updateTaskForm("description", e.target.value)}
                  />

                  <div className="task-form-section">
                    <p>Hozzárendelt emberek</p>
                    <div className="task-form-assignees">
                      {participants.map((participant) => (
                        <button
                          key={participant.id}
                          type="button"
                          className={
                            taskForm.assignees.includes(participant.id)
                              ? "task-form-assignee selected"
                              : "task-form-assignee"
                          }
                          onClick={() => toggleAssignee(participant.id)}
                        >
                          {participant.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="task-form-section">
                    <p>Szín</p>
                    <select
                      value={taskForm.color}
                      onChange={(e) => updateTaskForm("color", e.target.value)}
                    >
                      <option value="green">Zöld</option>
                      <option value="sand">Homok</option>
                      <option value="cyan">Cián</option>
                      <option value="violet">Lila</option>
                      <option value="lime">Lime</option>
                    </select>
                  </div>

                  <div className="schedule-modal__actions">
                    <motion.button
                      type="button"
                      className="secondary-modal-button"
                      onClick={closeTaskModal}
                      whileTap={{ scale: 0.985 }}
                    >
                      Mégse
                    </motion.button>
                    <motion.button type="submit" className="primary-modal-button" whileTap={{ scale: 0.985 }}>
                      {editingTaskId ? "Mentés" : "Létrehozás"}
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

function TaskDetails({ task, participantMap, getMapsUrl, isAdmin, onEdit, onDelete }) {
  return (
    <>
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

        {isAdmin && (
          <>
            <motion.button className="primary-action-button" onClick={onEdit} whileTap={{ scale: 0.97 }}>
              Szerkesztés
            </motion.button>
            <motion.button className="danger-action-button" onClick={onDelete} whileTap={{ scale: 0.97 }}>
              Törlés
            </motion.button>
          </>
        )}
      </div>
    </>
  );
}
