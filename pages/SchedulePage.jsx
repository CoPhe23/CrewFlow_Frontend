import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../lib/api";
import "../styles/schedule-page.css";
import { backdropFade, fadeUp, pageMotion, popIn, tabPanel } from "../lib/motion";

const EMPTY_TASK_FORM = {
  title: "",
  category: "",
  start: "",
  end: "",
  location: "",
  address: "",
  description: "",
  color: "green",
  assignedTo: "",
};

function normalizeTime(value) {
  return value || "--:--";
}

export default function SchedulePage() {
  const { id } = useParams();

  const [viewMode, setViewMode] = useState("timeline");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskForm, setTaskForm] = useState(EMPTY_TASK_FORM);
  const [insightOpen, setInsightOpen] = useState(false);
  const [insightTab, setInsightTab] = useState("");

  const [eventData, setEventData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [participants, setParticipants] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = eventData?.role === "ADMIN";

  useEffect(() => {
    loadScheduleData();
  }, [id]);

  async function loadScheduleData() {
    try {
      setLoading(true);
      setError("");

      const eventRes = await apiRequest(`/events/${id}`, "GET");
      const tasksRes = await apiRequest(`/tasks/events/${id}/tasks`, "GET");
      const membersRes = await apiRequest(`/events/${id}/members`, "GET");

      setEventData(eventRes);
      setParticipants(membersRes.members || []);

      const normalizedTasks = (tasksRes || []).map((task) => ({
        id: task.id,
        title: task.title || "Névtelen blokk",
        category: task.category || (task.status === "DONE" ? "Kész" : "Feladat"),
        start: normalizeTime(task.start),
        end: normalizeTime(task.end),
        location: task.location || "Nincs megadva",
        address: task.address || task.location || "Nincs megadva",
        mapsUrl: task.mapsUrl || "",
        description: task.description || "Nincs leírás",
        status: task.status || "OPEN",
        color: task.status === "DONE" ? "lime" : task.color || "green",
        originalColor: task.color || "green",
        assignees: task.assignedTo ? [task.assignedTo] : [],
        assignedTo: task.assignedTo || "",
      }));

      setTasks(normalizedTasks);

      if (!selectedTaskId && normalizedTasks.length > 0) {
        setSelectedTaskId(normalizedTasks[0].id);
      }
    } catch (err) {
      setError(err.message || "Nem sikerült betölteni a beosztást.");
    } finally {
      setLoading(false);
    }
  }

  const participantMap = useMemo(() => {
    return Object.fromEntries(participants.map((p) => [p.userId, p]));
  }, [participants]);

  const participantTaskCounts = useMemo(() => {
    return tasks.reduce((counts, task) => {
      task.assignees.forEach((assigneeId) => {
        counts[assigneeId] = (counts[assigneeId] || 0) + 1;
      });
      return counts;
    }, {});
  }, [tasks]);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;

  const uniqueLocations = useMemo(() => {
    const seen = new Map();

    tasks.forEach((task) => {
      if (!seen.has(task.location)) {
        seen.set(task.location, {
          name: task.location,
          address: task.address,
          mapsUrl: task.mapsUrl,
        });
      }
    });

    return Array.from(seen.values());
  }, [tasks]);

  function getMapsUrl(taskOrAddress) {
    if (typeof taskOrAddress === "object") {
      if (taskOrAddress.mapsUrl) return taskOrAddress.mapsUrl;

      const query = taskOrAddress.address || taskOrAddress.location || "";
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      taskOrAddress || ""
    )}`;
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
      title: task.title || "",
      category: task.category || "",
      start: task.start === "--:--" ? "" : task.start || "",
      end: task.end === "--:--" ? "" : task.end || "",
      location: task.location === "Nincs megadva" ? "" : task.location || "",
      address: task.address === "Nincs megadva" ? "" : task.address || "",
      description: task.description === "Nincs leírás" ? "" : task.description || "",
      color: task.originalColor || task.color || "green",
      assignedTo: task.assignedTo || "",
    });

    setShowMobileDetail(false);
    setShowTaskModal(true);
  }

  function closeTaskModal() {
    setShowTaskModal(false);
    setEditingTaskId(null);
    setTaskForm(EMPTY_TASK_FORM);
    setActionLoading(false);
  }

  function updateTaskForm(field, value) {
    setTaskForm((prevForm) => ({ ...prevForm, [field]: value }));
  }

  function openTaskDetails(taskId) {
    setSelectedTaskId((currentId) => (currentId === taskId ? null : taskId));
    setShowMobileDetail(false);
  }

  async function handleTaskSubmit(e) {
    e.preventDefault();

    if (!isAdmin) return;

    if (!taskForm.title.trim()) {
      setError("A blokk címe kötelező.");
      return;
    }

    const mapsQuery = taskForm.address.trim() || taskForm.location.trim();

    const mapsUrl = mapsQuery
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          mapsQuery
        )}`
      : "";

    const payload = {
      eventId: id,
      title: taskForm.title.trim(),
      category: taskForm.category.trim(),
      start: taskForm.start.trim(),
      end: taskForm.end.trim(),
      location: taskForm.location.trim(),
      address: taskForm.address.trim(),
      mapsUrl,
      description: taskForm.description.trim(),
      color: taskForm.color,
      assignedTo: taskForm.assignedTo || null,
    };

    try {
      setActionLoading(true);
      setError("");

      if (editingTaskId) {
        await apiRequest(`/tasks/${editingTaskId}`, "PATCH", payload);
      } else {
        await apiRequest("/tasks", "POST", payload);
      }

      closeTaskModal();
      await loadScheduleData();
    } catch (err) {
      setError(err.message || "Nem sikerült menteni a blokkot.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCompleteTask(taskId) {
    try {
      setError("");
      await apiRequest(`/tasks/${taskId}/complete`, "PATCH");
      await loadScheduleData();
    } catch (err) {
      setError(err.message || "Nem sikerült készre állítani.");
    }
  }

  async function handleReopenTask(taskId) {
    try {
      setError("");
      await apiRequest(`/tasks/${taskId}/reopen`, "PATCH");
      await loadScheduleData();
    } catch (err) {
      setError(err.message || "Nem sikerült visszanyitni.");
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      setError("");
      await apiRequest(`/tasks/${taskId}`, "DELETE");

      setShowMobileDetail(false);
      setSelectedTaskId(null);

      await loadScheduleData();
    } catch (err) {
      setError(err.message || "Nem sikerült törölni.");
    }
  }
  if (loading) {
    return (
      <main className="schedule-page">
        <div className="schedule-shell">
          <h2>Betöltés...</h2>
        </div>
      </main>
    );
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
              to={`/event/${id}`}
              className="schedule-back-button"
              aria-label="Vissza az eseményhez"
            >
              ←
            </Link>

            <div className="schedule-heading">
              <p className="schedule-heading__eyebrow">
                Beosztás {isAdmin ? "• Admin" : ""}
              </p>

              <h1>{eventData?.name || "Esemény"}</h1>

              <span>
                {eventData?.description || "Nincs megadva leírás"} •{" "}
                {eventData?.membersCount || participants.length || 1} fő
              </span>
            </div>
          </div>

          <div className="schedule-header__actions">
            <div className="schedule-view-switch">
              <motion.button
                type="button"
                className={viewMode === "timeline" ? "active" : ""}
                onClick={() => setViewMode("timeline")}
                whileTap={{ scale: 0.97 }}
              >
                Idővonal
              </motion.button>

              <motion.button
                type="button"
                className={viewMode === "list" ? "active" : ""}
                onClick={() => setViewMode("list")}
                whileTap={{ scale: 0.97 }}
              >
                Lista
              </motion.button>
            </div>

            {isAdmin && (
              <motion.button
                type="button"
                className="schedule-create-button schedule-create-button--desktop"
                onClick={openCreateTaskModal}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                + Új blokk
              </motion.button>
            )}
          </div>
        </motion.header>

        {error && <div className="error">{error}</div>}

        <div className="schedule-mobile-control-row">
          {isAdmin && (
            <motion.button
              type="button"
              className="schedule-create-button schedule-create-button--mobile"
              onClick={openCreateTaskModal}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              + Új blokk
            </motion.button>
          )}

        <motion.section className="schedule-overview" variants={fadeUp}>
          <motion.button
            type="button"
            className={
              insightOpen && insightTab === "tasks"
                ? "overview-card overview-card--active"
                : "overview-card"
            }
            onClick={() => toggleInsight("tasks")}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
          >
            <span className="overview-card__icon" aria-hidden="true">✓</span>
            <span className="overview-card__label">Feladatok</span>
            <span className="overview-card__count">{tasks.length}</span>
          </motion.button>

          <motion.button
            type="button"
            className={
              insightOpen && insightTab === "locations"
                ? "overview-card overview-card--active"
                : "overview-card"
            }
            onClick={() => toggleInsight("locations")}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
          >
            <span className="overview-card__icon" aria-hidden="true">⌖</span>
            <span className="overview-card__label">Helyszínek</span>
            <span className="overview-card__count">{uniqueLocations.length}</span>
          </motion.button>

          <motion.button
            type="button"
            className={
              insightOpen && insightTab === "participants"
                ? "overview-card overview-card--active"
                : "overview-card"
            }
            onClick={() => toggleInsight("participants")}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
          >
            <span className="overview-card__icon" aria-hidden="true">◉</span>
            <span className="overview-card__label">Emberek</span>
            <span className="overview-card__count">{participants.length}</span>
          </motion.button>
        </motion.section>
        </div>

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
                  type="button"
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
                    <motion.button
                      type="button"
                      className="insight-row"
                      key={task.id}
                      onClick={() => openTaskDetails(task.id)}
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

                      <div className="insight-row__meta">
                        {task.assignees.length > 0
                          ? task.assignees
                              .map(
                                (assigneeId) =>
                                  participantMap[assigneeId]?.name || "Ismeretlen"
                              )
                              .join(", ")
                          : "Nincs felelős"}
                      </div>
                    </motion.button>
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
                        href={location.mapsUrl || getMapsUrl(location.address)}
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
                      key={participant.userId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <div>
                        <strong>{participant.name}</strong>
                        <span>
                          {participant.role === "ADMIN" ? "Admin" : "Tag"}
                        </span>
                      </div>

                      <div className="insight-row__meta">
                        {participantTaskCounts[participant.userId] || 0} feladat
                      </div>
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
                  className={tasks.length === 0 ? "timeline-list timeline-list--empty" : "timeline-list"}
                  variants={tabPanel}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {tasks.length === 0 ? (
                    <p className="empty-task-card">Még nincs feladat ebben a beosztásban.</p>
                  ) : (
                    tasks.map((task, index) => {
                      const isOpen = selectedTaskId === task.id;

                      return (
                        <motion.div
                          key={task.id}
                          className={
                            isOpen
                              ? `task-block open ${task.color}`
                              : `task-block ${task.color}`
                          }
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.24, delay: index * 0.04 }}
                          layout
                        >
                          <motion.button
                            type="button"
                            className={
                              isOpen
                                ? `task-card active ${task.color}`
                                : `task-card ${task.color}`
                            }
                            onClick={() => openTaskDetails(task.id)}
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

                              {task.assignees.length > 0 && (
                                <div className="task-card__people">
                                  {task.assignees.map((assigneeId) => (
                                    <div key={assigneeId} className="person-pill">
                                      {participantMap[assigneeId]?.name ||
                                        "Ismeretlen"}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                className={`mobile-inline-detail ${task.color}`}
                                initial={{ opacity: 0, height: 0, y: -8 }}
                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -8 }}
                                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                              >
                                <TaskDetails
                                  task={task}
                                  participantMap={participantMap}
                                  getMapsUrl={getMapsUrl}
                                  isAdmin={isAdmin}
                                  onEdit={() => openEditTaskModal(task)}
                                  onComplete={() => handleCompleteTask(task.id)}
                                  onReopen={() => handleReopenTask(task.id)}
                                  onDelete={() => handleDeleteTask(task.id)}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })
                  )}
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
                    <span>Felelős</span>
                  </div>

                  {tasks.length === 0 ? (
                    <p className="empty-table-message">Még nincs blokk.</p>
                  ) : (
                    tasks.map((task, index) => (
                      <motion.button
                        type="button"
                        key={task.id}
                        className="task-table-row"
                        onClick={() => openTaskDetails(task.id)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        whileTap={{ scale: 0.996 }}
                      >
                        <span>
                          {task.start}–{task.end}
                        </span>
                        <span>{task.title}</span>
                        <span>{task.location}</span>
                        <span>
                          {task.assignees.length > 0
                            ? task.assignees
                                .map(
                                  (assigneeId) =>
                                    participantMap[assigneeId]?.name ||
                                    "Ismeretlen"
                                )
                                .join(", ")
                            : "Nincs felelős"}
                        </span>
                      </motion.button>
                    ))
                  )}
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
                    onComplete={() => handleCompleteTask(selectedTask.id)}
                    onReopen={() => handleReopenTask(selectedTask.id)}
                    onDelete={() => handleDeleteTask(selectedTask.id)}
                  />
                </motion.div>
              </AnimatePresence>
            </aside>
          )}
        </motion.section>

        <AnimatePresence>
          {false && showMobileDetail && selectedTask && (
            <>
              <motion.button
                type="button"
                className="schedule-modal-backdrop mobile-detail-backdrop"
                onClick={() => setShowMobileDetail(false)}
                aria-label="Bezárás"
                variants={backdropFade}
                initial="initial"
                animate="animate"
                exit="exit"
              />

              <motion.div
                className={`schedule-modal mobile-task-detail ${selectedTask.color}`}
                variants={popIn}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="schedule-modal__head">
                  <p>{selectedTask.category}</p>
                  <h3>{selectedTask.title}</h3>
                </div>

                <TaskDetails
                  task={selectedTask}
                  participantMap={participantMap}
                  getMapsUrl={getMapsUrl}
                  isAdmin={isAdmin}
                  onEdit={() => openEditTaskModal(selectedTask)}
                  onComplete={() => handleCompleteTask(selectedTask.id)}
                  onReopen={() => handleReopenTask(selectedTask.id)}
                  onDelete={() => handleDeleteTask(selectedTask.id)}
                />

                <div className="schedule-modal__actions">
                  <button
                    type="button"
                    className="secondary-modal-button"
                    onClick={() => setShowMobileDetail(false)}
                  >
                    Bezárás
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTaskModal && isAdmin && (
            <>
              <motion.button
                type="button"
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
                  <p>
                    {editingTaskId ? "Blokk szerkesztése" : "Új beosztás blokk"}
                  </p>
                  <h3>
                    {editingTaskId ? "Feladat módosítása" : "Feladat létrehozása"}
                  </h3>
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
                    placeholder="Helyszín pl. Aula"
                    value={taskForm.location}
                    onChange={(e) => updateTaskForm("location", e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Google Maps cím pl. Kecskemét, Izsáki út 10"
                    value={taskForm.address}
                    onChange={(e) => updateTaskForm("address", e.target.value)}
                  />

                  <div className="task-form-section">
                    <p>Felelős kiválasztása</p>

                    <select
                      value={taskForm.assignedTo}
                      onChange={(e) => updateTaskForm("assignedTo", e.target.value)}
                    >
                      <option value="">Nincs felelős</option>

                      {participants.map((participant) => (
                        <option key={participant.userId} value={participant.userId}>
                          {participant.name} -{" "}
                          {participant.role === "ADMIN" ? "Admin" : "Tag"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    placeholder="Rövid leírás"
                    rows="4"
                    value={taskForm.description}
                    onChange={(e) => updateTaskForm("description", e.target.value)}
                  />

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
                      disabled={actionLoading}
                      whileTap={{ scale: 0.985 }}
                    >
                      Mégse
                    </motion.button>

                    <motion.button
                      type="submit"
                      className="primary-modal-button"
                      disabled={actionLoading}
                      whileTap={{ scale: 0.985 }}
                    >
                      {actionLoading
                        ? "Mentés..."
                        : editingTaskId
                        ? "Mentés"
                        : "Létrehozás"}
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

function TaskDetails({
  task,
  participantMap,
  getMapsUrl,
  isAdmin,
  onEdit,
  onComplete,
  onReopen,
  onDelete,
}) {
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

        <div className="detail-row">
          <span>Státusz</span>
          <strong>{task.status === "DONE" ? "Kész" : "Nyitott"}</strong>
        </div>
      </div>

      <div className="task-detail-description">
        <p>Leírás</p>
        <div>{task.description}</div>
      </div>

      {task.assignees.length > 0 && (
        <div className="task-detail-assignees">
          <p>Felelős</p>

          <div className="detail-assignee-list">
            {task.assignees.map((assigneeId) => (
              <div key={assigneeId} className="detail-assignee-pill">
                {participantMap[assigneeId]?.name || "Ismeretlen"}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="task-detail-actions">
        <a
          className="ghost-link-button"
          href={getMapsUrl(task)}
          target="_blank"
          rel="noreferrer"
        >
          Útvonaltervezés
        </a>

        {isAdmin && (
          <motion.button
            type="button"
            className="primary-action-button"
            onClick={onEdit}
            whileTap={{ scale: 0.97 }}
          >
            Szerkesztés
          </motion.button>
        )}

        {isAdmin && task.status !== "DONE" && (
          <motion.button
            type="button"
            className="primary-action-button"
            onClick={onComplete}
            whileTap={{ scale: 0.97 }}
          >
            Készre állít
          </motion.button>
        )}

        {isAdmin && task.status === "DONE" && (
          <motion.button
            type="button"
            className="primary-action-button"
            onClick={onReopen}
            whileTap={{ scale: 0.97 }}
          >
            Visszanyitás
          </motion.button>
        )}

        {isAdmin && (
          <motion.button
            type="button"
            className="danger-action-button"
            onClick={onDelete}
            whileTap={{ scale: 0.97 }}
          >
            Törlés
          </motion.button>
        )}
      </div>
    </>
  );
}
