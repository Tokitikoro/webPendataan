"use client";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BarChart3,
  BriefcaseBusiness,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database,
  House,
  LayoutDashboard,
  Menu,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Sheet,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import type { Survey } from "@/lib/types";

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function sum(survey: Survey) {
  return survey.months.reduce(
    (total, month) => ({
      t: total.t + month.target,
      r: total.r + month.realization,
    }),
    {
      t: 0,
      r: 0,
    },
  );
}

type CalendarProps = {
  surveys: Survey[];
};

function Calendar({
  surveys,
}: CalendarProps) {
  const [cursor, setCursor] = useState(new Date());

  const [addingEvent, setAddingEvent] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventColor, setNewEventColor] =
    useState("#19c5a6");

  const [savingNewEvent, setSavingNewEvent] =
    useState(false);

  const [newEventMessage, setNewEventMessage] =
    useState("");

  const [editingEventId, setEditingEventId] =
    useState<string | null>(null);

  const [editingEventName, setEditingEventName] =
    useState("");

  const [savingEventId, setSavingEventId] =
    useState<string | null>(null);

  const year = cursor.getFullYear();
  const monthIndex = cursor.getMonth();

  const firstDay = new Date(year, monthIndex, 1).getDay();
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();

  const currentDate = new Date();

  const events = surveys.filter(
    (survey) => survey.months[monthIndex]?.target > 0,
  );

  function goToPreviousMonth() {
    setCursor(new Date(year, monthIndex - 1, 1));
  }

  function goToCurrentMonth() {
    setCursor(new Date());
  }

  function goToNextMonth() {
    setCursor(new Date(year, monthIndex + 1, 1));
  }

  function isToday(day: number) {
    return (
      day === currentDate.getDate() &&
      monthIndex === currentDate.getMonth() &&
      year === currentDate.getFullYear()
    );
  }

  function startEditingEvent(survey: Survey) {
    setEditingEventId(survey.id);
    setEditingEventName(survey.name);
  }

  function cancelEditingEvent() {
    setEditingEventId(null);
    setEditingEventName("");
  }

  async function saveEventName(survey: Survey) {
    const newName = editingEventName.trim();

    if (!newName) {
      window.alert("Nama acara tidak boleh kosong");
      return;
    }

    if (newName === survey.name) {
      cancelEditingEvent();
      return;
    }

    const monthData = survey.months[monthIndex] ?? {
      target: 0,
      realization: 0,
    };

    setSavingEventId(survey.id);

    try {
      const response = await fetch("/api/surveys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: survey.id,
          category: survey.category,
          name: newName,
          period: survey.period,
          owner: survey.owner,
          eventColor: survey.eventColor || "#19c5a6",
          monthIndex,
          target: monthData.target,
          realization: monthData.realization,
        }),
      });

      const responseText = await response.text();

      if (!responseText.trim()) {
        throw new Error(
          `Server tidak memberikan respons (${response.status})`,
        );
      }

      const result = JSON.parse(responseText) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ?? "Nama acara gagal diperbarui",
        );
      }

      setEditingEventId(null);
      setEditingEventName("");

      window.location.reload();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Nama acara gagal diperbarui",
      );
    } finally {
      setSavingEventId(null);
    }
  }

  async function saveNewCalendarEvent() {
    const eventName = newEventName.trim();

    if (!eventName || !newEventDate) {
      setNewEventMessage(
        "Nama dan tanggal acara wajib diisi",
      );
      return;
    }

    const [, selectedMonth] =
      newEventDate.split("-").map(Number);

    const selectedMonthIndex =
      selectedMonth - 1;

    setSavingNewEvent(true);
    setNewEventMessage("");

    try {
      const response = await fetch(
        "/api/surveys",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id: `agenda-${Date.now()}`,
            category: "AGENDA",
            name: eventName,
            period: "Agenda",
            owner: "Kalender",
            eventDate: newEventDate,
            eventColor: newEventColor,
            monthIndex: selectedMonthIndex,
            target: 1,
            realization: 0,
          }),
        },
      );

      const responseText =
        await response.text();

      if (!responseText.trim()) {
        throw new Error(
          `Server tidak memberikan respons (${response.status})`,
        );
      }

      let result: {
        success?: boolean;
        message?: string;
      };

      try {
        result = JSON.parse(responseText) as {
          success?: boolean;
          message?: string;
        };
      } catch {
        console.error(
          "Respons server:",
          responseText,
        );

        throw new Error(
          `Respons server bukan JSON (${response.status})`,
        );
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ??
          "Acara gagal ditambahkan",
        );
      }

      setNewEventMessage(
        result.message ??
        "Acara berhasil ditambahkan",
      );

      window.setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (error) {
      setNewEventMessage(
        error instanceof Error
          ? error.message
          : "Acara gagal ditambahkan",
      );
    } finally {
      setSavingNewEvent(false);
    }
  }

  return (
    <section className="panel calendarPanel">
      <div className="panelHead">
        <div>
          <p className="eyebrow">AGENDA KEGIATAN</p>
          <h2>
            Kalender {months[monthIndex]} {year}
          </h2>
        </div>

        <div className="calNav">
          <button
            type="button"
            className="addCalendarEvent"
            onClick={() => {
              const defaultDate = `${year}-${String(
                monthIndex + 1,
              ).padStart(2, "0")}-01`;

              setAddingEvent(true);
              setNewEventName("");
              setNewEventDate(defaultDate);
              setNewEventColor("#19c5a6");
              setNewEventMessage("");
              cancelEditingEvent();
            }}
          >
            <Plus />
            Tambah Acara
          </button>

          <button
            type="button"
            onClick={goToPreviousMonth}
            aria-label="Bulan sebelumnya"
          >
            <ChevronLeft />
          </button>

          <button type="button" onClick={goToCurrentMonth}>
            Hari ini
          </button>

          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="Bulan berikutnya"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {addingEvent && (
        <div className="calendarAddEditor">
          <div className="calendarAddEditorInfo">
            <p className="eyebrow">
              TAMBAH ACARA
            </p>

            <strong>Acara Kalender Baru</strong>

            <small>
              Isi nama, tanggal, dan warna acara.
            </small>
          </div>

          <div className="calendarAddEditorFields">
            <input
              value={newEventName}
              onChange={(event) =>
                setNewEventName(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void saveNewCalendarEvent();
                }

                if (event.key === "Escape") {
                  setAddingEvent(false);
                }
              }}
              placeholder="Nama acara"
              autoFocus
              disabled={savingNewEvent}
            />

            <input
              type="date"
              value={newEventDate}
              onChange={(event) =>
                setNewEventDate(event.target.value)
              }
              disabled={savingNewEvent}
            />

            <input
              type="color"
              value={newEventColor}
              onChange={(event) =>
                setNewEventColor(event.target.value)
              }
              title="Pilih warna acara"
              disabled={savingNewEvent}
            />

            <button
              type="button"
              className="calendarLabelCancel"
              onClick={() => {
                setAddingEvent(false);
                setNewEventMessage("");
              }}
              disabled={savingNewEvent}
            >
              Batal
            </button>

            <button
              type="button"
              className="calendarLabelSave"
              onClick={() =>
                void saveNewCalendarEvent()
              }
              disabled={
                savingNewEvent ||
                newEventName.trim() === "" ||
                newEventDate === ""
              }
            >
              <Plus />

              {savingNewEvent
                ? "Menyimpan..."
                : "Tambah Acara"}
            </button>
          </div>

          {newEventMessage && (
            <div className="calendarAddMessage">
              {newEventMessage}
            </div>
          )}
        </div>
      )}

      {editingEventId && (
        <div className="calendarLabelEditor">
          <div className="calendarLabelEditorInfo">
            <p className="eyebrow">
              EDIT LABEL ACARA
            </p>

            <strong>
              {
                surveys.find(
                  (survey) =>
                    survey.id === editingEventId,
                )?.name
              }
            </strong>

            <small>
              Nama yang diperbarui akan berubah pada semua label
              kegiatan yang sama.
            </small>
          </div>

          <div className="calendarLabelEditorControl">
            <input
              value={editingEventName}
              onChange={(event) =>
                setEditingEventName(event.target.value)
              }
              onKeyDown={(event) => {
                const selectedSurvey = surveys.find(
                  (survey) =>
                    survey.id === editingEventId,
                );

                if (
                  event.key === "Enter" &&
                  selectedSurvey
                ) {
                  event.preventDefault();
                  void saveEventName(selectedSurvey);
                }

                if (event.key === "Escape") {
                  cancelEditingEvent();
                }
              }}
              placeholder="Nama label acara"
              autoFocus
              disabled={savingEventId !== null}
            />

            <button
              type="button"
              className="calendarLabelCancel"
              onClick={cancelEditingEvent}
              disabled={savingEventId !== null}
            >
              Batal
            </button>

            <button
              type="button"
              className="calendarLabelSave"
              onClick={() => {
                const selectedSurvey = surveys.find(
                  (survey) =>
                    survey.id === editingEventId,
                );

                if (selectedSurvey) {
                  void saveEventName(selectedSurvey);
                }
              }}
              disabled={
                savingEventId !== null ||
                editingEventName.trim() === ""
              }
            >
              <Pencil />

              {savingEventId
                ? "Menyimpan..."
                : "Update Label"}
            </button>
          </div>
        </div>
      )}

      <div className="calendar">
        <div className="week">
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
            <b key={day}>{day}</b>
          ))}
        </div>

        <div className="days">
          {Array.from({ length: firstDay }).map((_, index) => (
            <span className="blank" key={`blank-${index}`} />
          ))}

          {Array.from({ length: totalDays }, (_, index) => index + 1).map(
            (day) => (
              <div
                className={isToday(day) ? "day today" : "day"}
                key={day}
              >
                <span>{day}</span>

                {events.slice(0, 2).map((event, index) => (
                  <div
                    className={`calendarEventRow e${index}`}
                    key={`${event.id}-${day}`}
                    style={{
                      borderLeftColor:
                        event.eventColor ||
                        (index === 0 ? "#19c5a6" : "#1c9aea"),
                    }}
                  >
                    <span title={event.name}>
                      {event.name}
                    </span>

                    <button
                      type="button"
                      className="calendarEventEditButton"
                      onClick={() => startEditingEvent(event)}
                      title={`Edit label ${event.name}`}
                      aria-label={`Edit label ${event.name}`}
                    >
                      <Pencil />
                    </button>
                  </div>
                ))}
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

type HomeProps = {
  percentage: number;
  totalTarget: number;
  realization: number;
  onOpenDashboard: () => void;
  onOpenCalendar: () => void;
  onOpenSpreadsheet: () => void;
};

function Home({
  percentage,
  totalTarget,
  realization,
  onOpenDashboard,
  onOpenCalendar,
  onOpenSpreadsheet,
}: HomeProps) {
  return (
    <section className="homePage">
      <div className="homeHero">
        <div className="homeIntro">
          <p className="eyebrow">SELAMAT DATANG</p>

          <h1>Sistem Monitoring Survei</h1>

          <p>
            Kelola kegiatan, pantau target dan realisasi, serta lihat agenda
            survei dalam satu sistem terpadu.
          </p>

          <button
            type="button"
            className="homeAction"
            onClick={onOpenDashboard}
          >
            <LayoutDashboard />
            Buka Dashboard
          </button>
        </div>

        <div className="homeSummary">
          <span>Capaian keseluruhan</span>
          <strong>{percentage}%</strong>

          <small>
            {realization} dari {totalTarget} target telah terealisasi
          </small>
        </div>
      </div>

      <section className="homeIndicators">
        <article className="indicatorCard indicatorBlue">
          <div className="indicatorIcon">
            <TrendingUp />
          </div>

          <h3>Pertumbuhan Ekonomi</h3>

          <div className="indicatorValue">
            <strong>5,45</strong>
            <span>Persen</span>
          </div>

          <div className="indicatorLabels">
            <span>
              <CalendarClock />
              Triwulan II 2026
            </span>

            <span>
              <Database />
              Data BPS
            </span>
          </div>
        </article>

        <article className="indicatorCard indicatorGreen">
          <div className="indicatorIcon">
            <TrendingDown />
          </div>

          <h3>Persentase Penduduk Miskin</h3>

          <div className="indicatorValue">
            <strong>8,07</strong>
            <span>Persen</span>
          </div>

          <div className="indicatorLabels">
            <span>
              <CalendarClock />
              Maret 2026
            </span>

            <span>
              <Database />
              Data BPS
            </span>
          </div>
        </article>

        <article className="indicatorCard indicatorOrange">
          <div className="indicatorIcon">
            <BriefcaseBusiness />
          </div>

          <h3>Tingkat Pengangguran Terbuka</h3>

          <div className="indicatorValue">
            <strong>4,68</strong>
            <span>Persen</span>
          </div>

          <div className="indicatorLabels">
            <span>
              <CalendarClock />
              Februari 2026
            </span>

            <span>
              <Database />
              Data BPS
            </span>
          </div>
        </article>
      </section>

      <div className="homeQuickMenu">
        <button type="button" onClick={onOpenDashboard}>
          <LayoutDashboard />

          <span>
            <strong>Dashboard</strong>
            <small>Lihat target dan realisasi survei</small>
          </span>
        </button>

        <button type="button" onClick={onOpenCalendar}>
          <CalendarDays />

          <span>
            <strong>Kalender</strong>
            <small>Lihat agenda kegiatan survei</small>
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenSpreadsheet}
        >
          <Sheet />

          <span>
            <strong>Spreadsheet</strong>
            <small>Kelola data monitoring</small>
          </span>
        </button>
      </div>
    </section>
  );
}

type FormMode = "create" | "edit";

type SurveyInputProps = {
  surveys: Survey[];
  formMode: FormMode;
  onFormModeChange: (mode: FormMode) => void;
  onCancel: () => void;
};

function SurveyInput({
  surveys,
  formMode,
  onFormModeChange,
  onCancel,
}: SurveyInputProps) {

  const [selectedSurveyId, setSelectedSurveyId] =
    useState("");

  const [id, setId] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [period, setPeriod] = useState("");
  const [owner, setOwner] = useState("");

  const [monthIndex, setMonthIndex] = useState(
    new Date().getMonth(),
  );

  const [target, setTarget] = useState("");
  const [realization, setRealization] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedSurvey = useMemo(() => {
    return (
      surveys.find(
        (survey) =>
          survey.id === selectedSurveyId,
      ) ?? null
    );
  }, [selectedSurveyId, surveys]);

  function clearForm() {
    setSelectedSurveyId("");
    setId("");
    setCategory("");
    setName("");
    setPeriod("");
    setOwner("");
    setMonthIndex(new Date().getMonth());
    setTarget("");
    setRealization("");
    setMessage("");
    setSuccess(false);
  }

  function changeMode(mode: FormMode) {
    onFormModeChange(mode);
    clearForm();
  }

  function loadSurvey(
    surveyId: string,
    selectedMonth = monthIndex,
  ) {
    setSelectedSurveyId(surveyId);
    setMessage("");
    setSuccess(false);

    const survey = surveys.find(
      (item) => item.id === surveyId,
    );

    if (!survey) {
      setId("");
      setCategory("");
      setName("");
      setPeriod("");
      setOwner("");
      setTarget("");
      setRealization("");
      return;
    }

    const monthData =
      survey.months[selectedMonth];

    setId(survey.id);
    setCategory(survey.category);
    setName(survey.name);
    setPeriod(survey.period);
    setOwner(survey.owner);

    setTarget(
      String(monthData?.target ?? 0),
    );

    setRealization(
      String(monthData?.realization ?? 0),
    );
  }

  function changeMonth(nextMonthIndex: number) {
    setMonthIndex(nextMonthIndex);

    if (formMode === "edit" && selectedSurvey) {
      const monthData =
        selectedSurvey.months[nextMonthIndex];

      setTarget(
        String(monthData?.target ?? 0),
      );

      setRealization(
        String(monthData?.realization ?? 0),
      );
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      formMode === "edit" &&
      !selectedSurveyId
    ) {
      setSuccess(false);
      setMessage(
        "Pilih kegiatan yang akan diedit",
      );
      return;
    }

    if (
      target === "" ||
      realization === ""
    ) {
      setSuccess(false);
      setMessage(
        "Target dan realisasi wajib diisi",
      );
      return;
    }

    setSubmitting(true);
    setMessage("");
    setSuccess(false);

    try {
      const response = await fetch(
        "/api/surveys",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id: id.trim(),
            category: category.trim(),
            name: name.trim(),
            period: period.trim(),
            owner: owner.trim(),
            monthIndex,
            target: Number(target),
            realization:
              Number(realization),
          }),
        },
      );

      const responseText =
        await response.text();

      if (!responseText.trim()) {
        throw new Error(
          `Server tidak memberikan respons (${response.status})`,
        );
      }

      let result: {
        success?: boolean;
        message?: string;
        action?: "created" | "updated";
      };

      try {
        result = JSON.parse(responseText) as {
          success?: boolean;
          message?: string;
          action?: "created" | "updated";
        };
      } catch {
        console.error(
          "Respons server:",
          responseText,
        );

        throw new Error(
          `Respons server bukan JSON (${response.status})`,
        );
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ??
          "Data gagal disimpan",
        );
      }

      setSuccess(true);

      setMessage(
        result.message ??
        (result.action === "updated"
          ? "Perubahan berhasil disimpan"
          : "Kegiatan baru berhasil ditambahkan"),
      );

      localStorage.setItem(
        "simi-last-view",
        "dashboard",
      );

      window.setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setSuccess(false);

      setMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const isEditing = formMode === "edit";

  const formDisabled =
    isEditing && !selectedSurvey;

  return (
    <section className="inputPanel">
      <div className="inputPanelHead">
        <div>
          <p className="eyebrow">
            KELOLA SPREADSHEET
          </p>

          <h2>Kelola Kegiatan Survei</h2>

          <p>
            Tambahkan kegiatan baru atau
            perbarui kegiatan yang sudah ada.
          </p>
        </div>

        <button
          type="button"
          className="inputCancel"
          onClick={onCancel}
        >
          Kembali
        </button>
      </div>

      <div className="surveyModeTabs">
        <button
          type="button"
          className={
            formMode === "create"
              ? "active"
              : ""
          }
          onClick={() =>
            changeMode("create")
          }
        >
          <Plus />
          Tambah Kegiatan
        </button>

        <button
          type="button"
          className={
            formMode === "edit"
              ? "active"
              : ""
          }
          onClick={() =>
            changeMode("edit")
          }
        >
          <Pencil />
          Edit Kegiatan
        </button>
      </div>

      {isEditing && (
        <div className="surveySelector">
          <label>
            <span>
              Pilih kegiatan yang akan diedit
            </span>

            <select
              value={selectedSurveyId}
              onChange={(event) =>
                loadSurvey(
                  event.target.value,
                )
              }
            >
              <option value="">
                Pilih kegiatan
              </option>

              {surveys.map((survey) => (
                <option
                  value={survey.id}
                  key={survey.id}
                >
                  {survey.id} — {survey.name}
                </option>
              ))}
            </select>
          </label>

          {selectedSurvey && (
            <div className="selectedSurveyInfo">
              <strong>
                {selectedSurvey.name}
              </strong>

              <span>
                {selectedSurvey.category}
                {" · "}
                {selectedSurvey.owner}
              </span>
            </div>
          )}
        </div>
      )}

      <form
        className="surveyInputForm"
        onSubmit={handleSubmit}
      >
        <label>
          <span>ID Kegiatan</span>

          <input
            value={id}
            onChange={(event) =>
              setId(event.target.value)
            }
            placeholder="Contoh: s6"
            readOnly={isEditing}
            disabled={formDisabled}
            required
          />

          {isEditing &&
            selectedSurvey && (
              <small className="fieldHint">
                ID tidak dapat diubah saat
                mengedit.
              </small>
            )}
        </label>

        <label>
          <span>Kategori</span>

          <input
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value,
              )
            }
            placeholder="Contoh: STATISTIK SOSIAL"
            disabled={formDisabled}
            required
          />
        </label>

        <label className="formWide">
          <span>Nama kegiatan</span>

          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Nama kegiatan survei"
            disabled={formDisabled}
            required
          />
        </label>

        <label>
          <span>Periode</span>

          <select
            value={period}
            onChange={(event) =>
              setPeriod(
                event.target.value,
              )
            }
            disabled={formDisabled}
            required
          >
            <option value="">
              Pilih periode
            </option>

            <option value="Bulanan">
              Bulanan
            </option>

            <option value="Triwulan">
              Triwulan
            </option>

            <option value="Semester">
              Semester
            </option>

            <option value="Tahunan">
              Tahunan
            </option>

            <option value="Subround">
              Subround
            </option>
          </select>
        </label>

        <label>
          <span>Penanggung jawab</span>

          <input
            value={owner}
            onChange={(event) =>
              setOwner(
                event.target.value,
              )
            }
            placeholder="Contoh: Tim Produksi"
            disabled={formDisabled}
            required
          />
        </label>

        <label>
          <span>Bulan pencatatan</span>

          <select
            value={monthIndex}
            onChange={(event) =>
              changeMonth(
                Number(
                  event.target.value,
                ),
              )
            }
            disabled={formDisabled}
          >
            {months.map(
              (month, index) => (
                <option
                  value={index}
                  key={month}
                >
                  {month}
                </option>
              ),
            )}
          </select>
        </label>

        <label>
          <span>Target</span>

          <input
            type="number"
            min="0"
            value={target}
            onChange={(event) =>
              setTarget(
                event.target.value,
              )
            }
            placeholder="0"
            disabled={formDisabled}
            required
          />
        </label>

        <label>
          <span>Realisasi</span>

          <input
            type="number"
            min="0"
            value={realization}
            onChange={(event) =>
              setRealization(
                event.target.value,
              )
            }
            placeholder="0"
            disabled={formDisabled}
            required
          />
        </label>

        {message && (
          <div
            className={
              success
                ? "formMessage success"
                : "formMessage error"
            }
          >
            {message}
          </div>
        )}

        <div className="formActions formWide">
          <button
            type="button"
            className="inputCancel"
            disabled={submitting}
            onClick={
              isEditing
                ? clearForm
                : onCancel
            }
          >
            {isEditing
              ? "Batal Edit"
              : "Batal"}
          </button>

          <button
            type="submit"
            className="inputSubmit"
            disabled={
              submitting ||
              formDisabled
            }
          >
            {isEditing ? (
              <Pencil />
            ) : (
              <Sheet />
            )}

            {submitting
              ? "Menyimpan..."
              : isEditing
                ? "Simpan Perubahan"
                : "Simpan ke Spreadsheet"}
          </button>
        </div>
      </form>
    </section>
  );
}

type DashboardProps = {
  initial: Survey[];
  source: string;
};


export default function Dashboard({
  initial,
  source,
}: DashboardProps) {
  const [view, setView] = useState<
    "home" |
    "dashboard" |
    "calendar" |
    "input" |
    null
  >(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [inputMode, setInputMode] =
    useState<FormMode>("create");

  const [manageMenuOpen, setManageMenuOpen] =
    useState(false);

  useEffect(() => {
    const savedView = localStorage.getItem("simi-last-view");

    if (
      savedView === "home" ||
      savedView === "dashboard" ||
      savedView === "calendar"
    ) {
      setView(savedView);
    } else {
      setView("home");
    }
  }, []);

  useEffect(() => {
    if (
      view === "home" ||
      view === "dashboard" ||
      view === "calendar"
    ) {
      localStorage.setItem("simi-last-view", view);
    }
  }, [view]);

  const filtered = useMemo(() => {
    const keyword = searchQuery.toLowerCase();

    return initial.filter((survey) => {
      const searchableText = [
        survey.name,
        survey.category,
        survey.owner,
        survey.period,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [initial, searchQuery]);

  const totals = filtered.reduce(
    (result, survey) => {
      const surveyTotal = sum(survey);

      result.t += surveyTotal.t;
      result.r += surveyTotal.r;

      return result;
    },
    {
      t: 0,
      r: 0,
    },
  );

  const percentage =
    totals.t > 0
      ? Math.min(100, Math.round((totals.r / totals.t) * 100))
      : 0;

  const cards = filtered;

  if (view === null) {
    return (
      <div className="viewLoading">
        <div className="viewLoadingSpinner" />
      </div>
    );
  }

  return (
    <div className={`shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      <aside
        id="dashboard-sidebar"
        className={sidebarOpen ? "open" : ""}
      >
        {/* LOGO */}
        <div className="brand-wrapper">
          <div className="brand">
            <span>BPS</span>
          </div>

          <div className="brand-name">
            <strong>Badan Pusat Statistik</strong>
            <small>Monitoring Survei</small>
          </div>
        </div>

        {/* BERANDA */}
        <button
          type="button"
          className={view === "home" ? "active" : ""}
          onClick={() => {
            setView("home");
            setManageMenuOpen(false);

            if (window.innerWidth <= 650) {
              setSidebarOpen(false);
            }
          }}
          title="Beranda"
          aria-label="Buka Beranda"
        >
          <House />
          <span className="menu-label">Beranda</span>
        </button>

        {/* DASHBOARD */}
        <button
          type="button"
          className={view === "dashboard" ? "active" : ""}
          onClick={() => {
            setView("dashboard");
            setManageMenuOpen(false);

            if (window.innerWidth <= 650) {
              setSidebarOpen(false);
            }
          }}
          title="Dashboard"
        >
          <LayoutDashboard />
          <span className="menu-label">Dashboard</span>
        </button>

        {/* KALENDER */}
        <button
          type="button"
          className={view === "calendar" ? "active" : ""}
          onClick={() => {
            setView("calendar");
            setManageMenuOpen(false);

            if (window.innerWidth <= 650) {
              setSidebarOpen(false);
            }
          }}
          title="Kalender"
        >
          <CalendarDays />
          <span className="menu-label">Kalender</span>
        </button>

        {/* KELOLA DATA */}
        <div
          className={`sidebarGroup ${view === "input" ? "active" : ""
            }`}
        >
          <div className="sidebarGroupRow">
            <button
              type="button"
              className="sidebarManageButton"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                setInputMode("create");
                setView("input");
                setManageMenuOpen(false);
                setSidebarOpen(false);
              }}
              title="Kelola Data"
              aria-label="Buka Kelola Data"
            >
              <Sheet />

              <span className="menu-label">
                Kelola Data
              </span>
            </button>

            <button
              type="button"
              className={`sidebarArrow ${manageMenuOpen ? "open" : ""
                }`}
              onClick={() => {
                if (!sidebarOpen) {
                  setSidebarOpen(true);
                  setManageMenuOpen(true);
                  return;
                }

                setManageMenuOpen((current) => !current);
              }}
              aria-label={
                manageMenuOpen
                  ? "Tutup submenu Kelola Data"
                  : "Buka submenu Kelola Data"
              }
              aria-expanded={manageMenuOpen}
            >
              <ChevronDown />
            </button>
          </div>

          {manageMenuOpen && (
            <div className="sidebarSubmenu">
              <button
                type="button"
                className={
                  view === "input" && inputMode === "create"
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setInputMode("create");
                  setView("input");

                  if (window.innerWidth <= 650) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <Plus />
                <span>Tambah Data</span>
              </button>

              <button
                type="button"
                className={
                  view === "input" && inputMode === "edit"
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setInputMode("edit");
                  setView("input");

                  if (window.innerWidth <= 650) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <Pencil />
                <span>Edit Data</span>
              </button>
            </div>
          )}
        </div>

        {/* PENDORONG VERSI KE BAWAH */}
        <div className="spacer" />

        <small className="sidebar-version">v1.0</small>
      </aside>

      <button
        type="button"
        className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-label="Tutup menu samping"
      />

      <main>
        <header>
          <button
            type="button"
            className="icon"
            onClick={() => setSidebarOpen((current) => !current)}
            aria-label={sidebarOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={sidebarOpen}
            aria-controls="dashboard-sidebar"
          >
            <Menu />
          </button>

          <div className="search">
            <Search />

            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari kegiatan, kategori, atau tim..."
            />
          </div>

          <div className="source">
            <span />
            {source}
          </div>

          <div className="avatar">JK</div>
        </header>

        <div className="content">
          {view === "input" ? (
            <SurveyInput
              surveys={initial}
              formMode={inputMode}
              onFormModeChange={setInputMode}
              onCancel={() => setView("dashboard")}
            />
          ) : view === "home" ? (
            <Home
              percentage={percentage}
              totalTarget={totals.t}
              realization={totals.r}
              onOpenDashboard={() => setView("dashboard")}
              onOpenCalendar={() => setView("calendar")}
              onOpenSpreadsheet={() => {
                setInputMode("create");
                setView("input");
                setManageMenuOpen(false);
                setSidebarOpen(false);
              }}
            />
          ) : view === "calendar" ? (
            <Calendar surveys={filtered} />
          ) : (
            <>
              <section className="hero">
                <div>
                  <p className="eyebrow">SISTEM MONITORING TERPADU</p>
                  <h1>Ringkasan Kegiatan Survei</h1>
                  <p>
                    Pantau target, realisasi, dan agenda dari satu dashboard.
                  </p>
                </div>

                <div className="heroStat">
                  <BarChart3 />

                  <div>
                    <b>{percentage}%</b>
                    <span>Capaian keseluruhan</span>
                  </div>
                </div>
              </section>

              <section className="metrics">
                <article>
                  <span>Total target</span>
                  <b>{totals.t}</b>
                  <small>Seluruh periode</small>
                </article>

                <article>
                  <span>Realisasi</span>
                  <b>{totals.r}</b>
                  <small>Data terkumpul</small>
                </article>

                <article>
                  <span>Kegiatan aktif</span>
                  <b>{filtered.length}</b>
                  <small>Lintas kategori</small>
                </article>

                <article>
                  <span>Sisa target</span>
                  <b>{Math.max(0, totals.t - totals.r)}</b>
                  <small>Perlu ditindaklanjuti</small>
                </article>
              </section>

              <section className="cards">
                {cards.map((survey) => {
                  const surveyTotal = sum(survey);

                  const surveyPercentage =
                    surveyTotal.t > 0
                      ? Math.min(
                        100,
                        Math.round(
                          (surveyTotal.r / surveyTotal.t) * 100,
                        ),
                      )
                      : 0;

                  return (
                    <article
                      className="surveyCard"
                      key={survey.id}
                    >
                      <div className="cardTop">
                        <span>{survey.category}</span>
                        <em>{survey.period}</em>
                      </div>

                      <h3>{survey.name}</h3>

                      <div className="big">
                        <b>{surveyPercentage}%</b>

                        <small>
                          {surveyTotal.r} dari {surveyTotal.t} target
                        </small>
                      </div>

                      <div className="progress">
                        <i
                          style={{
                            width: `${surveyPercentage}%`,
                          }}
                        />
                      </div>

                      <footer>
                        <span>
                          Belum:{" "}
                          {Math.max(
                            0,
                            surveyTotal.t - surveyTotal.r,
                          )}
                        </span>

                        <span className="done">
                          Selesai: {surveyTotal.r}
                        </span>
                      </footer>
                    </article>
                  );
                })}
              </section>

              <section className="panel">
                <div className="panelHead">
                  <div>
                    <p className="eyebrow">MONITORING BULANAN</p>
                    <h2>Target dan Realisasi</h2>
                  </div>

                  <button type="button" className="soft">
                    <RefreshCw />
                    Sinkron 5 menit
                  </button>
                </div>

                <div className="tableWrap">
                  <table
                    style={{
                      width: "100%",
                      minWidth: "1488px",
                      tableLayout: "fixed",
                    }}
                  >
                    <colgroup>
                      <col style={{ width: "390px" }} />
                      <col style={{ width: "90px" }} />

                      {months.flatMap((month) => [
                        <col
                          key={`${month}-target-column`}
                          style={{ width: "42px" }}
                        />,
                        <col
                          key={`${month}-realization-column`}
                          style={{ width: "42px" }}
                        />,
                      ])}
                    </colgroup>

                    <thead>
                      <tr>
                        <th rowSpan={2}>Kegiatan survei</th>
                        <th rowSpan={2}>Periode</th>

                        {months.map((month) => (
                          <th
                            colSpan={2}
                            key={month}
                            style={{
                              width: "84px",
                              minWidth: "84px",
                              maxWidth: "84px",
                            }}
                          >
                            {month.slice(0, 3)}
                          </th>
                        ))}
                      </tr>

                      <tr>
                        {months.flatMap((month) => [
                          <th
                            key={`${month}-target-header`}
                            style={{
                              width: "42px",
                              minWidth: "42px",
                              maxWidth: "42px",
                            }}
                          >
                            T
                          </th>,

                          <th
                            key={`${month}-realization-header`}
                            style={{
                              width: "42px",
                              minWidth: "42px",
                              maxWidth: "42px",
                            }}
                          >
                            R
                          </th>,
                        ])}
                      </tr>
                    </thead>

                    <tbody>
                      {filtered.map((survey) => (
                        <tr key={survey.id}>
                          <td>
                            <strong>{survey.name}</strong>

                            <small>
                              {survey.category} · {survey.owner}
                            </small>
                          </td>

                          <td>{survey.period}</td>

                          {survey.months.flatMap((month, index) => [
                            <td
                              key={`${survey.id}-${index}-target`}
                              className={
                                month.target > 0 ? "target" : ""
                              }
                            >
                              {month.target || ""}
                            </td>,

                            <td
                              key={`${survey.id}-${index}-realization`}
                              className={
                                month.realization > 0
                                  ? month.realization >= month.target
                                    ? "ok"
                                    : "warn"
                                  : ""
                              }
                            >
                              {month.realization || ""}
                            </td>,
                          ])}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}