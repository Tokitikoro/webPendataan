"use client";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";

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
  History,
  LayoutDashboard,
  Menu,
  Monitor,
  Moon,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings as SettingsIcon,
  Sheet,
  Sun,
  Trash2,
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

type ThemeMode =
  | "default"
  | "light"
  | "dark"
  | "system";

type LanguageMode =
  | "id"
  | "en"
  | "system";

const translations = {
  id: {
    home: "Beranda",
    dashboard: "Dashboard",
    calendar: "Kalender",
    manageData: "Kelola Data",
    addData: "Tambah Data",
    editData: "Edit Data",
    settings: "Pengaturan",
    accountSettings: "Pengaturan Akun",
    logout: "Keluar",
    of: "dari",
    searchPlaceholder:
      "Cari kegiatan, kategori, atau tim...",

    settingsEyebrow: "PENGATURAN",
    settingsTitle: "Pengaturan Tampilan",
    settingsDescription:
      "Atur tema dan bahasa yang digunakan pada SIMI Aqua.",
    back: "Kembali",

    themeTitle: "Tema Aplikasi",
    themeDescription:
      "Pengaturan tema akan tersimpan pada perangkat yang sedang digunakan.",

    themeDefault: "Default",
    themeDefaultDescription:
      "Tampilan asli SIMI Aqua",

    themeLight: "Terang",
    themeLightDescription:
      "Tampilan putih dan cerah",

    themeDark: "Gelap",
    themeDarkDescription:
      "Nyaman digunakan pada malam hari",

    themeSystem: "Ikuti Sistem",
    themeSystemDescription:
      "Mengikuti tema perangkat",

    languageTitle: "Bahasa Aplikasi",
    languageDescription:
      "Pilih bahasa yang digunakan pada tampilan SIMI Aqua.",

    languageIndonesian: "Bahasa Indonesia",
    languageIndonesianDescription:
      "Gunakan Bahasa Indonesia",

    languageEnglish: "English",
    languageEnglishDescription:
      "Gunakan Bahasa Inggris",

    languageAutomatic: "Otomatis",
    languageAutomaticDescription:
      "Mengikuti bahasa perangkat",



    homeEyebrow: "SELAMAT DATANG",
    homeTitle: "Sistem Monitoring Survei",
    homeDescription:
      "Kelola kegiatan, pantau target dan realisasi, serta lihat agenda survei dalam satu sistem terpadu.",
    openDashboard: "Buka Dashboard",
    overallAchievement: "Capaian keseluruhan",
    targetRealized: "target telah terealisasi",

    economicGrowth: "Pertumbuhan Ekonomi",
    povertyPercentage: "Persentase Penduduk Miskin",
    unemploymentRate: "Tingkat Pengangguran Terbuka",
    percent: "Persen",
    bpsData: "Data BPS",

    dashboardDescription:
      "Lihat target dan realisasi survei",
    calendarDescription:
      "Lihat agenda kegiatan survei",
    spreadsheet: "Spreadsheet",
    spreadsheetDescription:
      "Kelola data monitoring",



    dashboardEyebrow: "SISTEM MONITORING TERPADU",
    dashboardTitle: "Ringkasan Kegiatan Survei",
    dashboardSubtitle:
      "Pantau target, realisasi, dan agenda dari satu dashboard.",
    totalTarget: "Total Target",
    realizationLabel: "Realisasi",
    activeActivities: "Kegiatan Aktif",
    remainingTarget: "Sisa Target",
    allPeriods: "Seluruh Periode",
    collectedData: "Data Terkumpul",
    acrossCategories: "Lintas Kategori",
    needsFollowUp: "Perlu Ditindaklanjuti",
    monthlyMonitoring: "MONITORING BULANAN",
    targetAndRealization: "Target dan Realisasi",
    quarterTwo2026: "Triwulan II 2026",
    march2026: "Maret 2026",
    february2026: "Februari 2026",

    notYet: "Belum",
    completed: "Selesai",
    targetWord: "target",

    surveyActivity: "Kegiatan survei",

    overallAchievementLabel:
      "Capaian Keseluruhan",

    showingResults:
      "Menampilkan",

    fromResults:
      "dari",

    activitiesLabel:
      "Kegiatan",

    monthShortNames: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MEI",
      "JUN",
      "JUL",
      "AGU",
      "SEP",
      "OKT",
      "NOV",
      "DES",
    ],

    calendarEyebrow: "AGENDA KEGIATAN",
    calendarHeading: "Kalender",
    addEvent: "Tambah Acara",
    today: "Hari ini",
    previousMonth: "Bulan sebelumnya",
    nextMonth: "Bulan berikutnya",

    calendarMonths: [
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
    ],

    calendarDays: [
      "Min",
      "Sen",
      "Sel",
      "Rab",
      "Kam",
      "Jum",
      "Sab",
    ],

    addEventEyebrow: "TAMBAH ACARA",
    newCalendarEvent: "Acara Kalender Baru",
    eventFormDescription:
      "Isi nama, tanggal, dan warna acara.",
    eventNamePlaceholder: "Nama acara",
    chooseEventColor: "Pilih warna acara",
    cancel: "Batal",
    saving: "Menyimpan...",
    editEventLabel: "EDIT LABEL ACARA",
    eventLabelPlaceholder: "Nama label acara",
    updateLabel: "Perbarui Label",

    manageEyebrow: "KELOLA SPREADSHEET",
    manageTitle: "Kelola Kegiatan Survei",
    manageDescription:
      "Tambahkan kegiatan baru atau perbarui kegiatan yang sudah ada.",

    addActivity: "Tambah Kegiatan",
    editActivity: "Edit Kegiatan",
    selectActivityToEdit:
      "Pilih kegiatan yang akan diedit",
    selectActivity: "Pilih kegiatan",

    activityId: "ID Kegiatan",
    activityIdExample:
      "Contoh: s1 akan disimpan di baris s2",
    activityIdHint:
      "ID tidak dapat diubah saat mengedit.",

    categoryLabel: "Kategori",
    categoryExample:
      "Contoh: STATISTIK SOSIAL",

    activityName: "Nama kegiatan",
    activityNamePlaceholder:
      "Nama kegiatan survei",

    periodLabel: "Periode",
    choosePeriod: "Pilih periode",

    monthly: "Bulanan",
    quarterly: "Triwulan",
    semester: "Semester",
    annual: "Tahunan",
    subround: "Subround",

    ownerLabel: "Penanggung jawab",
    ownerExample: "Contoh: Tim Produksi",

    recordingMonth: "Bulan pencatatan",
    targetLabel: "Target",
    realizationInputLabel: "Realisasi",

    deleteActivity: "Hapus Kegiatan",
    deleting: "Menghapus...",
    cancelEdit: "Batal Edit",

    saveChanges: "Simpan Perubahan",
    saveToSpreadsheet:
      "Simpan ke Spreadsheet",

    saveFailed:
      "Data gagal disimpan",

    updateSuccess:
      "Perubahan berhasil disimpan",

    createSuccess:
      "Kegiatan baru berhasil ditambahkan",

    genericError:
      "Terjadi kesalahan",

    targetRealizationRequired:
      "Target dan realisasi wajib diisi",

    deleteConfirmation: (
      name: string,
    ) =>
      `Hapus kegiatan "${name}"?\n\n` +
      "Seluruh target dan realisasi kegiatan ini akan ikut dihapus. " +
      "Tindakan ini tidak dapat dibatalkan.",

    createConfirmation: (
      id: string,
      name: string,
    ) => {
      const rowNumber =
        Number(id.replace(/^s/i, "")) + 1;

      return (
        `Simpan kegiatan baru?\n\n` +
        `ID: ${id}\n` +
        `Nama: ${name}\n` +
        `Baris Spreadsheet: ${rowNumber}\n\n` +
        "Pastikan baris tersebut tidak berisi kegiatan lain."
      );
    },

    editConfirmation: (
      id: string,
      name: string,
    ) =>
      `Simpan perubahan kegiatan?\n\n` +
      `ID: ${id}\n` +
      `Nama: ${name}\n\n` +
      "Data lama pada Spreadsheet akan diperbarui.",

    resetForm: "Reset Form",
    activityHistory: "Riwayat Aktivitas",
  },

  en: {
    home: "Home",
    dashboard: "Dashboard",
    calendar: "Calendar",
    manageData: "Manage Data",
    addData: "Add Data",
    editData: "Edit Data",
    settings: "Settings",
    accountSettings: "Account Settings",
    logout: "Log Out",
    of: "of",
    searchPlaceholder:
      "Search activities, categories, or teams...",

    settingsEyebrow: "SETTINGS",
    settingsTitle: "Display Settings",
    settingsDescription:
      "Configure the theme and language used in SIMI Aqua.",
    back: "Back",

    themeTitle: "Application Theme",
    themeDescription:
      "Theme settings will be saved on the current device.",

    themeDefault: "Default",
    themeDefaultDescription:
      "Original SIMI Aqua appearance",

    themeLight: "Light",
    themeLightDescription:
      "Clean and bright appearance",

    themeDark: "Dark",
    themeDarkDescription:
      "Comfortable for use at night",

    themeSystem: "Use System Theme",
    themeSystemDescription:
      "Follow the device theme",

    languageTitle: "Application Language",
    languageDescription:
      "Choose the language used in SIMI Aqua.",

    languageIndonesian: "Bahasa Indonesia",
    languageIndonesianDescription:
      "Use Indonesian",

    languageEnglish: "English",
    languageEnglishDescription:
      "Use English",

    languageAutomatic: "Automatic",
    languageAutomaticDescription:
      "Follow the device language",



    homeEyebrow: "WELCOME",
    homeTitle: "Survey Monitoring System",
    homeDescription: "Manage activities, monitor targets and realizations, and view survey schedules in one integrated system.",
    openDashboard: "Open Dashboard",
    overallAchievement: "Overall achievement",
    targetRealized: "targets have been realized",

    economicGrowth: "Economic Growth",
    povertyPercentage: "Percentage of People in Poverty",
    unemploymentRate: "Open Unemployment Rate",
    percent: "Percent",
    bpsData: "BPS Data",

    dashboardDescription: "View survey targets and realizations",
    calendarDescription: "View the survey activity schedule",
    spreadsheet: "Spreadsheet",
    spreadsheetDescription: "Manage monitoring data",

    dashboardEyebrow: "INTEGRATED MONITORING SYSTEM",
    dashboardTitle: "Survey Activity Summary",
    dashboardSubtitle: "Monitor targets, realizations, and schedules from one dashboard.",
    totalTarget: "Total Target",
    realizationLabel: "Realization",
    activeActivities: "Active Activities",
    remainingTarget: "Remaining Target",
    allPeriods: "All Periods",
    collectedData: "Collected Data",
    acrossCategories: "Across Categories",
    needsFollowUp: "Needs Follow-up",
    monthlyMonitoring: "MONTHLY MONITORING",
    targetAndRealization: "Target and Realization",
    quarterTwo2026: "Quarter II 2026",
    march2026: "March 2026",
    february2026: "February 2026",

    notYet: "Remaining",
    completed: "Completed",
    targetWord: "targets",

    surveyActivity: "Survey activity",

    overallAchievementLabel:
      "Overall Achievement",

    showingResults:
      "Showing",

    fromResults:
      "of",

    activitiesLabel:
      "Activities",

    monthShortNames: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ],

    calendarEyebrow: "ACTIVITY AGENDA",
    calendarHeading: "Calendar",
    addEvent: "Add Event",
    today: "Today",
    previousMonth: "Previous month",
    nextMonth: "Next month",

    calendarMonths: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],

    calendarDays: [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ],

    addEventEyebrow: "ADD EVENT",
    newCalendarEvent: "New Calendar Event",
    eventFormDescription:
      "Enter the event name, date, and color.",
    eventNamePlaceholder: "Event name",
    chooseEventColor: "Choose event color",
    cancel: "Cancel",
    saving: "Saving...",
    editEventLabel: "EDIT EVENT LABEL",
    eventLabelPlaceholder: "Event label name",
    updateLabel: "Update Label",

    manageEyebrow: "MANAGE SPREADSHEET",
    manageTitle: "Manage Survey Activities",
    manageDescription:
      "Add new activities or update existing activities.",

    addActivity: "Add Activity",
    editActivity: "Edit Activity",
    selectActivityToEdit:
      "Select an activity to edit",
    selectActivity: "Select an activity",

    activityId: "Activity ID",
    activityIdExample:
      "Example: s1 will be saved in row 2",
    activityIdHint:
      "The ID cannot be changed while editing.",

    categoryLabel: "Category",
    categoryExample:
      "Example: SOCIAL STATISTICS",

    activityName: "Activity name",
    activityNamePlaceholder:
      "Survey activity name",

    periodLabel: "Period",
    choosePeriod: "Select a period",

    monthly: "Monthly",
    quarterly: "Quarterly",
    semester: "Semester",
    annual: "Annual",
    subround: "Subround",

    ownerLabel: "Person in charge",
    ownerExample: "Example: Production Team",

    recordingMonth: "Recording month",
    targetLabel: "Target",
    realizationInputLabel: "Realization",

    deleteActivity: "Delete Activity",
    deleting: "Deleting...",
    cancelEdit: "Cancel Editing",

    saveChanges: "Save Changes",
    saveToSpreadsheet:
      "Save to Spreadsheet",

    saveFailed:
      "Failed to save data",

    updateSuccess:
      "Changes saved successfully",

    createSuccess:
      "New activity added successfully",

    genericError:
      "An error occurred",

    targetRealizationRequired:
      "Target and realization are required",

    deleteConfirmation: (
      name: string,
    ) =>
      `Delete activity "${name}"?\n\n` +
      "All targets and realizations for this activity will also be deleted. " +
      "This action cannot be undone.",

    createConfirmation: (
      id: string,
      name: string,
    ) => {
      const rowNumber =
        Number(id.replace(/^s/i, "")) + 1;

      return (
        `Save the new activity?\n\n` +
        `ID: ${id}\n` +
        `Name: ${name}\n` +
        `Spreadsheet row: ${rowNumber}\n\n` +
        "Make sure the row does not contain another activity."
      );
    },

    editConfirmation: (
      id: string,
      name: string,
    ) =>
      `Save activity changes?\n\n` +
      `ID: ${id}\n` +
      `Name: ${name}\n\n` +
      "The existing Spreadsheet data will be updated.",

    resetForm: "Reset Form",
    activityHistory: "Activity History",
  },
} as const;

function applyTheme(mode: ThemeMode) {
  const systemPrefersDark =
    window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

  const resolvedTheme =
    mode === "system"
      ? systemPrefersDark
        ? "dark"
        : "light"
      : mode;

  document.documentElement.dataset.theme =
    resolvedTheme;

  document.documentElement.dataset.themeMode =
    mode;
}

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
  text: TranslationText;
};

function translatePeriod(
  period: string,
  language: "id" | "en",
) {
  if (language === "id") {
    return period;
  }

  const periodTranslations: Record<string, string> = {
    Bulanan: "Monthly",
    Triwulan: "Quarterly",
    Semester: "Semester",
    Tahunan: "Annual",
    Subround: "Subround",
    Agenda: "Agenda",
  };

  return periodTranslations[period] ?? period;
}

function Calendar({
  surveys,
  text,
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

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ??
          text.saveFailed,
        );
      }

      saveAuditLog({
        action: "updated",
        surveyId: survey.id,
        surveyName: newName,
        category: survey.category,
        owner: survey.owner,
        monthIndex,
        target: monthData.target,
        realization: monthData.realization,
        user: "JK",
      });

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
          <p className="eyebrow">
            {text.calendarEyebrow}
          </p>

          <h2>
            {text.calendarHeading}{" "}
            {text.calendarMonths[monthIndex]}{" "}
            {year}
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
            {text.addEvent}
          </button>

          <button
            type="button"
            onClick={goToPreviousMonth}
            aria-label={text.previousMonth}
          >
            <ChevronLeft />
          </button>

          <button
            type="button"
            onClick={goToCurrentMonth}
          >
            {text.today}
          </button>

          <button
            type="button"
            onClick={goToNextMonth}
            aria-label={text.nextMonth}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {addingEvent && (
        <div className="calendarAddEditor">
          <div className="calendarAddEditorInfo">
            <p className="eyebrow">
              {text.addEventEyebrow}
            </p>

            <strong>
              {text.newCalendarEvent}
            </strong>

            <small>
              {text.eventFormDescription}
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
              placeholder={text.eventNamePlaceholder}
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
              title={text.chooseEventColor}
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
              {text.cancel}
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
                ? text.saving
                : text.addEvent}
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
              {text.editEventLabel}
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
              {text.cancel}
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
                ? text.saving
                : text.updateLabel}
            </button>
          </div>
        </div>
      )}

      <div className="calendar">
        <div className="week">
          {text.calendarDays.map((day) => (
            <b key={day}>
              {day}
            </b>
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
  text: TranslationText;
  onOpenDashboard: () => void;
  onOpenCalendar: () => void;
  onOpenSpreadsheet: () => void;
};

function Home({
  percentage,
  totalTarget,
  realization,
  text,
  onOpenDashboard,
  onOpenCalendar,
  onOpenSpreadsheet,
}: HomeProps) {
  return (
    <section className="homePage">
      <div className="homeHero">
        <div className="homeIntro">
          <p className="eyebrow">
            {text.homeEyebrow}
          </p>

          <h1>{text.homeTitle}</h1>

          <p>{text.homeDescription}</p>

          <button
            type="button"
            className="homeAction"
            onClick={onOpenDashboard}
          >
            <LayoutDashboard />
            {text.openDashboard}
          </button>
        </div>

        <div className="homeSummary">
          <span>
            {text.overallAchievement}
          </span>

          <strong>{percentage}%</strong>

          <small>
            {realization} {text.of} {totalTarget}{" "}
            {text.targetRealized}
          </small>

        </div>
      </div>

      <section className="homeIndicators">
        <article className="indicatorCard indicatorBlue">
          <div className="indicatorIcon">
            <TrendingUp />
          </div>

          <h3>{text.economicGrowth}</h3>

          <div className="indicatorValue">
            <strong>5,45</strong>
            <span>{text.percent}</span>
          </div>

          <div className="indicatorLabels">
            <span>
              <CalendarClock />
              {text.quarterTwo2026}
            </span>

            <span>
              <Database />
              {text.bpsData}
            </span>
          </div>
        </article>

        <article className="indicatorCard indicatorGreen">
          <div className="indicatorIcon">
            <TrendingDown />
          </div>

          <h3>{text.povertyPercentage}</h3>

          <div className="indicatorValue">
            <strong>8,07</strong>
            <span>{text.percent}</span>
          </div>

          <div className="indicatorLabels">
            <span>
              <CalendarClock />
              {text.march2026}
            </span>

            <span>
              <Database />
              {text.bpsData}
            </span>
          </div>
        </article>

        <article className="indicatorCard indicatorOrange">
          <div className="indicatorIcon">
            <BriefcaseBusiness />
          </div>

          <h3>{text.unemploymentRate}</h3>

          <div className="indicatorValue">
            <strong>4,68</strong>
            <span>{text.percent}</span>
          </div>

          <div className="indicatorLabels">
            <span>
              <CalendarClock />
              {text.february2026}
            </span>

            <span>
              <Database />
              {text.bpsData}
            </span>
          </div>
        </article>
      </section>

      <div className="homeQuickMenu">
        <button type="button" onClick={onOpenDashboard}>
          <LayoutDashboard />

          <span>
            <strong>{text.dashboard}</strong>
            <small> {text.dashboardDescription}
            </small>
          </span>
        </button>

        <button type="button" onClick={onOpenCalendar}>
          <CalendarDays />

          <span>
            <strong>{text.calendar}</strong>
            <small>{text.calendarDescription}
            </small>
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenSpreadsheet}
        >
          <Sheet />

          <span>
            <strong>{text.spreadsheet}</strong>
            <small>{text.spreadsheetDescription}
            </small>
          </span>
        </button>
      </div>
    </section>
  );
}

type FormMode = "create" | "edit";

type AuditAction = "created" | "updated" | "deleted";

type AuditLog = {
  id: string;
  action: AuditAction;
  surveyId: string;
  surveyName: string;
  category: string;
  owner: string;
  monthIndex?: number;
  target?: number;
  realization?: number;
  timestamp: string;
  user: string;
};

function saveAuditLog(
  log: Omit<AuditLog, "id" | "timestamp">,
) {
  const storageKey = "simi-audit-logs";

  try {
    const storedValue =
      localStorage.getItem(storageKey);

    const currentLogs: AuditLog[] =
      storedValue
        ? (JSON.parse(storedValue) as AuditLog[])
        : [];

    const newLog: AuditLog = {
      ...log,
      id:
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(
      storageKey,
      JSON.stringify(
        [newLog, ...currentLogs].slice(0, 200),
      ),
    );

    window.dispatchEvent(
      new CustomEvent("simi-audit-updated"),
    );
  } catch (error) {
    console.error(
      "Gagal menyimpan audit log:",
      error,
    );
  }
}

type SurveyInputProps = {
  surveys: Survey[];
  formMode: FormMode;
  text: TranslationText;

  onFormModeChange: (
    mode: FormMode,
  ) => void;

  onCancel: () => void;
  onDataChanged: () => void;
};

function SurveyInput({
  surveys,
  formMode,
  text,
  onFormModeChange,
  onCancel,
  onDataChanged,
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

  const [deleting, setDeleting] =
    useState(false);

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const [confirmSaveOpen, setConfirmSaveOpen] =
    useState(false);

  const [confirmDeleteOpen, setConfirmDeleteOpen] =
    useState(false);

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
    setTarget("0");
    setRealization("0");
    setMessage("");
    setSuccess(false);
    setConfirmSaveOpen(false);
    setConfirmDeleteOpen(false);
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

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");
    setSuccess(false);

    if (
      formMode === "edit" &&
      !selectedSurveyId
    ) {
      setMessage(text.selectActivityToEdit);
      return;
    }

    if (
      !id.trim() ||
      !category.trim() ||
      !name.trim() ||
      !period.trim() ||
      !owner.trim()
    ) {
      setMessage(
        "Semua informasi kegiatan wajib diisi.",
      );
      return;
    }

    if (
      target.trim() === "" ||
      realization.trim() === ""
    ) {
      setMessage(
        text.targetRealizationRequired,
      );
      return;
    }

    const targetNumber = Number(target);
    const realizationNumber =
      Number(realization);

    if (
      !Number.isFinite(targetNumber) ||
      !Number.isFinite(realizationNumber) ||
      targetNumber < 0 ||
      realizationNumber < 0
    ) {
      setMessage(
        "Target dan realisasi harus berupa angka nol atau lebih.",
      );
      return;
    }

    setConfirmSaveOpen(true);
  }

  async function confirmAndSave() {
    if (submitting) {
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
            realization: Number(realization),
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
        result = JSON.parse(
          responseText,
        ) as {
          success?: boolean;
          message?: string;
          action?: "created" | "updated";
        };
      } catch {
        console.error(
          "Respons server bukan JSON:",
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
          text.saveFailed,
        );
      }

      const auditAction: AuditAction =
        result.action === "updated"
          ? "updated"
          : "created";

      saveAuditLog({
        action: auditAction,
        surveyId: id.trim(),
        surveyName: name.trim(),
        category: category.trim(),
        owner: owner.trim(),
        monthIndex,
        target: Number(target),
        realization: Number(realization),
        user: "JK",
      });

      setConfirmSaveOpen(false);
      setSuccess(true);

      setMessage(
        result.message ??
        (auditAction === "updated"
          ? text.updateSuccess
          : text.createSuccess),
      );

      onDataChanged();
    } catch (error) {
      console.error(
        "Gagal menyimpan kegiatan:",
        error,
      );

      setSuccess(false);

      setMessage(
        error instanceof Error
          ? error.message
          : text.genericError,
      );
    } finally {
      setSubmitting(false);
    }
  }
  function openDeleteConfirmation() {
    if (!selectedSurvey) {
      setSuccess(false);
      setMessage(
        "Pilih kegiatan yang akan dihapus",
      );
      return;
    }

    setMessage("");
    setSuccess(false);
    setConfirmDeleteOpen(true);
  }


  async function handleDeleteSurvey() {
    if (!selectedSurvey || deleting) {
      return;
    }

    setDeleting(true);
    setSuccess(false);
    setMessage("");

    try {
      const response = await fetch(
        "/api/surveys",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedSurvey.id,
          }),
        },
      );

      const responseText =
        await response.text();

      if (!responseText.trim()) {
        throw new Error(
          `Server tidak memberikan respons(${response.status})`,
        );
      }

      let result: {
        success?: boolean;
        message?: string;
      };

      try {
        result = JSON.parse(
          responseText,
        ) as {
          success?: boolean;
          message?: string;
        };
      } catch {
        console.error(
          "Respons hapus bukan JSON:",
          responseText,
        );

        throw new Error(
          `Respons server bukan JSON(${response.status})`,
        );
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ??
          "Kegiatan gagal dihapus",
        );
      }

      saveAuditLog({
        action: "deleted",
        surveyId: selectedSurvey.id,
        surveyName: selectedSurvey.name,
        category: selectedSurvey.category,
        owner: selectedSurvey.owner,
        user: "JK",
      });

      setConfirmDeleteOpen(false);
      setSuccess(true);

      setMessage(
        result.message ??
        "Kegiatan berhasil dihapus",
      );

      clearForm();
      onDataChanged();
    } catch (error) {
      console.error(
        "Gagal menghapus kegiatan:",
        error,
      );

      setSuccess(false);

      setMessage(
        error instanceof Error
          ? error.message
          : "Kegiatan gagal dihapus",
      );
    } finally {
      setDeleting(false);
    }
  }

  const isEditing =
    formMode === "edit";

  const formDisabled =
    isEditing && !selectedSurvey;

  return (
    <section className="inputPanel">
      <div className="inputPanelHead">
        <div>
          <p className="eyebrow">
            {text.manageEyebrow}
          </p>

          <h2>{text.manageTitle}</h2>

          <p>{text.manageDescription}</p>
        </div>

        <button
          type="button"
          className="inputCancel"
          onClick={onCancel}
          disabled={submitting || deleting}
        >
          {text.back}
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
          disabled={submitting || deleting}
        >
          <Plus />
          {text.addActivity}
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
          disabled={submitting || deleting}
        >
          <Pencil />
          {text.editActivity}
        </button>
      </div>

      {isEditing && (
        <div className="surveySelector">
          <label>
            <span>
              {text.selectActivityToEdit}
            </span>

            <select
              value={selectedSurveyId}
              onChange={(event) =>
                loadSurvey(
                  event.target.value,
                )
              }
              disabled={submitting || deleting}
            >
              <option value="">
                {text.selectActivity}
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
          <span>{text.activityId}</span>

          <input
            value={id}
            onChange={(event) =>
              setId(event.target.value)
            }
            placeholder={text.activityIdExample}
            readOnly={isEditing}
            disabled={formDisabled}
            required
          />

          {isEditing &&
            selectedSurvey && (
              <small className="fieldHint">
                {text.activityIdHint}
              </small>
            )}
        </label>

        <label>
          <span>{text.categoryLabel}</span>

          <input
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value,
              )
            }
            placeholder={text.categoryExample}
            disabled={formDisabled}
            required
          />
        </label>

        <label className="formWide">
          <span>{text.activityName}</span>

          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder={
              text.activityNamePlaceholder
            }
            disabled={formDisabled}
            required
          />
        </label>

        <label>
          <span>{text.periodLabel}</span>

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
              {text.choosePeriod}
            </option>

            <option value="Bulanan">
              {text.monthly}
            </option>

            <option value="Triwulan">
              {text.quarterly}
            </option>

            <option value="Semester">
              {text.semester}
            </option>

            <option value="Tahunan">
              {text.annual}
            </option>

            <option value="Subround">
              {text.subround}
            </option>
          </select>
        </label>

        <label>
          <span>{text.ownerLabel}</span>

          <input
            value={owner}
            onChange={(event) =>
              setOwner(event.target.value)
            }
            placeholder={text.ownerExample}
            disabled={formDisabled}
            required
          />
        </label>

        <label>
          <span>{text.recordingMonth}</span>

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
            {months.map((month, index) => (
              <option
                value={index}
                key={month}
              >
                {text.calendarMonths[index]}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>{text.targetLabel}</span>

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
          <span>
            {text.realizationInputLabel}
          </span>

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
          {isEditing && selectedSurvey && (
            <button
              type="button"
              className="inputDelete"
              onClick={openDeleteConfirmation}
              disabled={submitting || deleting}
            >
              {deleting ? (
                <RefreshCw className="buttonSpinner" />
              ) : (
                <Trash2 />
              )}

              {deleting
                ? text.deleting
                : text.deleteActivity}
            </button>
          )}

          <div className="formActionsRight">
            <button
              type="button"
              className="inputCancel inputReset"
              disabled={submitting || deleting}
              onClick={clearForm}
            >
              <RefreshCw />
              {text.resetForm}
            </button>

            <button
              type="submit"
              className="inputSubmit"
              disabled={
                submitting ||
                deleting ||
                formDisabled
              }
              aria-busy={submitting}
            >
              {submitting ? (
                <RefreshCw className="buttonSpinner" />
              ) : isEditing ? (
                <Pencil />
              ) : (
                <Sheet />
              )}

              {submitting
                ? text.saving
                : isEditing
                  ? text.saveChanges
                  : text.saveToSpreadsheet}
            </button>
          </div>
        </div>
      </form>

      {confirmSaveOpen && (
        <div
          className="saveConfirmOverlay"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget &&
              !submitting
            ) {
              setConfirmSaveOpen(false);
            }
          }}
        >
          <div
            className="saveConfirmModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-confirm-title"
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
          >
            <div className="saveConfirmIcon">
              {isEditing ? (
                <Pencil />
              ) : (
                <Sheet />
              )}
            </div>

            <div className="saveConfirmContent">
              <p className="eyebrow">
                KONFIRMASI PENYIMPANAN
              </p>

              <h3 id="save-confirm-title">
                {isEditing
                  ? "Simpan perubahan kegiatan?"
                  : "Simpan kegiatan baru?"}
              </h3>

              <p>
                Periksa kembali data sebelum
                disimpan ke Spreadsheet.
              </p>
            </div>

            <dl className="saveConfirmDetails">
              <div>
                <dt>ID Kegiatan</dt>
                <dd>{id.trim()}</dd>
              </div>

              <div>
                <dt>Nama Kegiatan</dt>
                <dd>{name.trim()}</dd>
              </div>

              <div>
                <dt>Kategori</dt>
                <dd>{category.trim()}</dd>
              </div>

              <div>
                <dt>Periode</dt>
                <dd>{period.trim()}</dd>
              </div>

              <div>
                <dt>Penanggung Jawab</dt>
                <dd>{owner.trim()}</dd>
              </div>

              <div>
                <dt>Bulan Pencatatan</dt>
                <dd>
                  {
                    text.calendarMonths[
                    monthIndex
                    ]
                  }
                </dd>
              </div>

              <div>
                <dt>Target</dt>
                <dd>{Number(target)}</dd>
              </div>

              <div>
                <dt>Realisasi</dt>
                <dd>
                  {Number(realization)}
                </dd>
              </div>

              {!isEditing && (
                <div>
                  <dt>Baris Spreadsheet</dt>
                  <dd>
                    {Number(
                      id
                        .trim()
                        .replace(/^s/i, ""),
                    ) + 1}
                  </dd>
                </div>
              )}
            </dl>

            <div className="saveConfirmWarning">
              {isEditing
                ? "Data lama pada Spreadsheet akan diperbarui."
                : "Pastikan ID dan baris Spreadsheet belum digunakan oleh kegiatan lain."}
            </div>

            <div className="saveConfirmActions">
              <button
                type="button"
                className="saveConfirmCancel"
                onClick={() =>
                  setConfirmSaveOpen(false)
                }
                disabled={submitting}
              >
                {text.cancel}
              </button>

              <button
                type="button"
                className="saveConfirmSubmit"
                onClick={() =>
                  void confirmAndSave()
                }
                disabled={submitting}
              >
                {submitting ? (
                  <RefreshCw className="buttonSpinner" />
                ) : isEditing ? (
                  <Pencil />
                ) : (
                  <Sheet />
                )}

                {submitting
                  ? text.saving
                  : isEditing
                    ? text.saveChanges
                    : text.saveToSpreadsheet}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteOpen && selectedSurvey && (
        <div
          className="saveConfirmOverlay deleteMode"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deleting
            ) {
              setConfirmDeleteOpen(false);
            }
          }}
        >
          <div
            className="saveConfirmModal deleteConfirmModal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
            aria-describedby="delete-confirm-description"
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
          >
            <div className="saveConfirmIcon deleteConfirmIcon">
              <Trash2 />
            </div>

            <div className="saveConfirmContent deleteConfirmContent">
              <p className="eyebrow">
                KONFIRMASI PENGHAPUSAN
              </p>

              <h3 id="delete-confirm-title">
                Hapus kegiatan ini?
              </h3>

              <p id="delete-confirm-description">
                Kegiatan yang dihapus tidak dapat
                dipulihkan kembali.
              </p>
            </div>

            <dl className="saveConfirmDetails deleteConfirmDetails">
              <div>
                <dt>ID Kegiatan</dt>
                <dd>{selectedSurvey.id}</dd>
              </div>

              <div>
                <dt>Nama Kegiatan</dt>
                <dd>{selectedSurvey.name}</dd>
              </div>

              <div>
                <dt>Kategori</dt>
                <dd>{selectedSurvey.category}</dd>
              </div>

              <div>
                <dt>Penanggung Jawab</dt>
                <dd>{selectedSurvey.owner}</dd>
              </div>

              <div>
                <dt>Periode</dt>
                <dd>{selectedSurvey.period}</dd>
              </div>
            </dl>

            <div className="saveConfirmWarning deleteConfirmWarning">
              <strong>Perhatian:</strong>{" "}
              seluruh target dan realisasi kegiatan
              ini akan ikut dihapus dari Spreadsheet.
              Tindakan ini tidak dapat dibatalkan.
            </div>

            <div className="saveConfirmActions">
              <button
                type="button"
                className="saveConfirmCancel"
                onClick={() => {
                  setConfirmDeleteOpen(false);
                }}
                disabled={deleting}
              >
                {text.cancel}
              </button>

              <button
                type="button"
                className="saveConfirmSubmit deleteConfirmSubmit"
                onClick={() => {
                  void handleDeleteSurvey();
                }}
                disabled={deleting}
                aria-busy={deleting}
              >
                {deleting ? (
                  <RefreshCw className="buttonSpinner" />
                ) : (
                  <Trash2 />
                )}

                {deleting
                  ? text.deleting
                  : text.deleteActivity}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

type TranslationText =
  (typeof translations)[keyof typeof translations];

type SettingsProps = {
  themeMode: ThemeMode;
  languageMode: LanguageMode;
  text: TranslationText;

  onThemeChange: (
    mode: ThemeMode,
  ) => void;

  onLanguageChange: (
    mode: LanguageMode,
  ) => void;

  onBack: () => void;
};

function Settings({
  themeMode,
  languageMode,
  text,
  onThemeChange,
  onLanguageChange,
  onBack,
}: SettingsProps) {
  return (
    <section className="settingsPage">
      <div className="settingsHead">
        <div>
          <p className="eyebrow">
            {text.settingsEyebrow}
          </p>

          <h1>{text.settingsTitle}</h1>

          <p>
            {text.settingsDescription}
          </p>
        </div>

        <button
          type="button"
          className="settingsBackButton"
          onClick={onBack}
        >
          {text.back}
        </button>
      </div>

      <section className="settingsPanel">
        <div className="settingsSectionHead">
          <h2>{text.themeTitle}</h2>

          <p>
            {text.themeDescription}
          </p>
        </div>

        <div className="settingsThemeGrid">
          <button
            type="button"
            className={
              themeMode === "default"
                ? "settingsThemeCard active"
                : "settingsThemeCard"
            }
            onClick={() =>
              onThemeChange("default")
            }
            aria-pressed={
              themeMode === "default"
            }
          >
            <LayoutDashboard />

            <span>
              <strong>
                {text.themeDefault}
              </strong>

              <small>
                {text.themeDefaultDescription}
              </small>
            </span>
          </button>

          <button
            type="button"
            className={
              themeMode === "light"
                ? "settingsThemeCard active"
                : "settingsThemeCard"
            }
            onClick={() =>
              onThemeChange("light")
            }
            aria-pressed={
              themeMode === "light"
            }
          >
            <Sun />

            <span>
              <strong>
                {text.themeLight}
              </strong>

              <small>
                {text.themeLightDescription}
              </small>
            </span>
          </button>

          <button
            type="button"
            className={
              themeMode === "dark"
                ? "settingsThemeCard active"
                : "settingsThemeCard"
            }
            onClick={() =>
              onThemeChange("dark")
            }
            aria-pressed={
              themeMode === "dark"
            }
          >
            <Moon />

            <span>
              <strong>
                {text.themeDark}
              </strong>

              <small>
                {text.themeDarkDescription}
              </small>
            </span>
          </button>

          <button
            type="button"
            className={
              themeMode === "system"
                ? "settingsThemeCard active"
                : "settingsThemeCard"
            }
            onClick={() =>
              onThemeChange("system")
            }
            aria-pressed={
              themeMode === "system"
            }
          >
            <Monitor />

            <span>
              <strong>
                {text.themeSystem}
              </strong>

              <small>
                {text.themeSystemDescription}
              </small>
            </span>
          </button>
        </div>
      </section>

      <section className="settingsPanel">
        <div className="settingsSectionHead">
          <h2>{text.languageTitle}</h2>

          <p>
            {text.languageDescription}
          </p>
        </div>

        <div className="settingsLanguageList">
          <button
            type="button"
            className={
              languageMode === "id"
                ? "settingsLanguageCard active"
                : "settingsLanguageCard"
            }
            onClick={() =>
              onLanguageChange("id")
            }
            aria-pressed={
              languageMode === "id"
            }
          >
            <strong>
              {text.languageIndonesian}
            </strong>

            <small>
              {text.languageIndonesianDescription}
            </small>
          </button>

          <button
            type="button"
            className={
              languageMode === "en"
                ? "settingsLanguageCard active"
                : "settingsLanguageCard"
            }
            onClick={() =>
              onLanguageChange("en")
            }
            aria-pressed={
              languageMode === "en"
            }
          >
            <strong>
              {text.languageEnglish}
            </strong>

            <small>
              {text.languageEnglishDescription}
            </small>
          </button>

          <button
            type="button"
            className={
              languageMode === "system"
                ? "settingsLanguageCard active"
                : "settingsLanguageCard"
            }
            onClick={() =>
              onLanguageChange("system")
            }
            aria-pressed={
              languageMode === "system"
            }
          >
            <strong>
              {text.languageAutomatic}
            </strong>

            <small>
              {text.languageAutomaticDescription}
            </small>
          </button>
        </div>
      </section>
    </section>
  );
}

type ActivityHistoryProps = {
  text: TranslationText;
  onBack: () => void;
};

function ActivityHistory({
  text,
  onBack,
}: ActivityHistoryProps) {
  const [logs, setLogs] =
    useState<AuditLog[]>([]);

  function loadLogs() {
    try {
      const savedLogs = JSON.parse(
        localStorage.getItem(
          "simi-audit-logs",
        ) ?? "[]",
      ) as AuditLog[];

      setLogs(savedLogs);
    } catch (error) {
      console.error(
        "Gagal membaca riwayat aktivitas:",
        error,
      );

      setLogs([]);
    }
  }

  useEffect(() => {
    loadLogs();

    function handleAuditUpdate() {
      loadLogs();
    }

    window.addEventListener(
      "simi-audit-updated",
      handleAuditUpdate,
    );

    window.addEventListener(
      "storage",
      handleAuditUpdate,
    );

    return () => {
      window.removeEventListener(
        "simi-audit-updated",
        handleAuditUpdate,
      );

      window.removeEventListener(
        "storage",
        handleAuditUpdate,
      );
    };
  }, []);

  function getActionLabel(
    action: AuditAction,
  ) {
    if (action === "created") {
      return "Menambahkan";
    }

    if (action === "updated") {
      return "Memperbarui";
    }

    return "Menghapus";
  }

  function formatDate(timestamp: string) {
    return new Intl.DateTimeFormat(
      "id-ID",
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    ).format(new Date(timestamp));
  }

  return (
    <section className="historyPage">
      <div className="historyHead">
        <div>
          <p className="eyebrow">
            AUDIT DATA
          </p>

          <h1>{text.activityHistory}</h1>

          <p>
            Lihat catatan penambahan,
            perubahan, dan penghapusan data.
          </p>
        </div>

        <button
          type="button"
          className="settingsBackButton"
          onClick={onBack}
        >
          {text.back}
        </button>
      </div>

      <section className="historyPanel">
        {logs.length === 0 ? (
          <div className="historyEmpty">
            <History />

            <strong>
              Belum ada riwayat aktivitas
            </strong>

            <span>
              Aktivitas baru akan ditampilkan
              setelah data berhasil disimpan,
              diperbarui, atau dihapus.
            </span>
          </div>
        ) : (
          <div className="historyList">
            {logs.map((log) => (
              <article
                className={`historyItem ${log.action}`}
                key={log.id}
              >
                <div className="historyItemIcon">
                  {log.action === "deleted" ? (
                    <Trash2 />
                  ) : log.action === "created" ? (
                    <Plus />
                  ) : (
                    <Pencil />
                  )}
                </div>

                <div className="historyItemContent">
                  <div className="historyItemTop">
                    <strong>
                      {getActionLabel(log.action)}{" "}
                      kegiatan
                    </strong>

                    <time dateTime={log.timestamp}>
                      {formatDate(log.timestamp)}
                    </time>
                  </div>

                  <h3>{log.surveyName}</h3>

                  <p>
                    ID: {log.surveyId}
                    {" · "}
                    {log.category}
                    {" · "}
                    {log.owner}
                  </p>

                  {log.monthIndex !== undefined && (
                    <div className="historyValues">
                      <span>
                        Bulan:{" "}
                        {months[log.monthIndex]}
                      </span>

                      <span>
                        Target: {log.target ?? 0}
                      </span>

                      <span>
                        Realisasi:{" "}
                        {log.realization ?? 0}
                      </span>
                    </div>
                  )}

                  <small>
                    Oleh: {log.user}
                  </small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
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
  const router = useRouter();

  const [refreshing, startRefresh] =
    useTransition();

  const [view, setView] = useState<
    | "home"
    | "dashboard"
    | "calendar"
    | "input"
    | "history"
    | "settings"
    | null
  >(null);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [profileMenuOpen, setProfileMenuOpen] =
    useState(false);

  const [themeMode, setThemeMode] =
    useState<ThemeMode>("default");

  const [languageMode, setLanguageMode] =
    useState<LanguageMode>("id");

  const [resolvedLanguage, setResolvedLanguage] =
    useState<"id" | "en">("id");

  const text =
    translations[resolvedLanguage];

  const [inputMode, setInputMode] =
    useState<FormMode>("create");

  const [manageMenuOpen, setManageMenuOpen] =
    useState(false);

  const [showAllCards, setShowAllCards] =
    useState(false);

  const [showAllTable, setShowAllTable] =
    useState(false);

  function changeTheme(mode: ThemeMode) {
    setThemeMode(mode);

    localStorage.setItem(
      "simi-theme",
      mode,
    );

    applyTheme(mode);
  }

  function changeLanguage(
    mode: LanguageMode,
  ) {
    const nextLanguage =
      mode === "system"
        ? navigator.language
          .toLowerCase()
          .startsWith("en")
          ? "en"
          : "id"
        : mode;

    setLanguageMode(mode);
    setResolvedLanguage(nextLanguage);

    localStorage.setItem(
      "simi-language",
      mode,
    );

    document.documentElement.lang =
      nextLanguage;
  }

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("simi-theme");

    const initialTheme: ThemeMode =
      savedTheme === "default" ||
        savedTheme === "light" ||
        savedTheme === "dark" ||
        savedTheme === "system"
        ? savedTheme
        : "default";

    applyTheme(initialTheme);

    window.setTimeout(() => {
      setThemeMode(initialTheme);
    }, 0);

    const systemTheme = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    function handleSystemThemeChange() {
      const currentTheme =
        localStorage.getItem("simi-theme");

      if (currentTheme === "system") {
        applyTheme("system");
      }
    }

    systemTheme.addEventListener(
      "change",
      handleSystemThemeChange,
    );

    return () => {
      systemTheme.removeEventListener(
        "change",
        handleSystemThemeChange,
      );
    };
  }, []);

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem("simi-language");

    const initialLanguage: LanguageMode =
      savedLanguage === "id" ||
        savedLanguage === "en" ||
        savedLanguage === "system"
        ? savedLanguage
        : "id";

    const nextLanguage =
      initialLanguage === "system"
        ? navigator.language
          .toLowerCase()
          .startsWith("en")
          ? "en"
          : "id"
        : initialLanguage;

    document.documentElement.lang =
      nextLanguage;

    window.setTimeout(() => {
      setLanguageMode(initialLanguage);
      setResolvedLanguage(nextLanguage);
    }, 0);
  }, []);

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

  const cards = showAllCards
    ? filtered
    : filtered.slice(0, 6);

  const visibleTableSurveys = showAllTable
    ? filtered
    : filtered.slice(0, 6);

  const hasMoreSurveys = filtered.length > 6;

  const hiddenSurveyCount = Math.max(
    0,
    filtered.length - 6,
  );

  if (view === null) {
    return (
      <div className="viewLoading">
        <div className="viewLoadingSpinner" />
      </div>
    );
  }

  return (
    <div className={`shell ${sidebarOpen ? "sidebar-open" : ""} `}>
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

          }}
          title="Beranda"
          aria-label="Buka Beranda"
        >
          <House />
          <span className="menu-label">
            {text.home}
          </span>
        </button>

        {/* DASHBOARD */}
        <button
          type="button"
          className={view === "dashboard" ? "active" : ""}
          onClick={() => {
            setView("dashboard");
            setManageMenuOpen(false);

          }}
          title="Dashboard"
        >
          <LayoutDashboard />
          <span className="menu-label">
            {text.dashboard}
          </span>
        </button>

        {/* KALENDER */}
        <button
          type="button"
          className={view === "calendar" ? "active" : ""}
          onClick={() => {
            setView("calendar");
            setManageMenuOpen(false);

          }}
          title="Kalender"
        >
          <CalendarDays />
          <span className="menu-label">
            {text.calendar}
          </span>
        </button>

        {/* KELOLA DATA */}
        <div
          className={`sidebarGroup ${view === "input" ? "active" : ""
            } `}
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

                /*
                 * Komputer:
                 * sidebar tetap pada kondisi sekarang.
                 *
                 * HP:
                 * sidebar ditutup setelah menu dipilih.
                 */
                if (window.innerWidth <= 650) {
                  setManageMenuOpen(false);
                }
              }}
              title="Kelola Data"
              aria-label="Buka Kelola Data"
            >
              <Sheet />

              <span className="menu-label">
                {text.manageData}
              </span>
            </button>

            <button
              type="button"
              className={`sidebarArrow ${manageMenuOpen ? "open" : ""
                } `}
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

                }}
              >
                <Plus />
                <span>{text.addData}</span>
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

                }}
              >
                <Pencil />
                <span>{text.editData}</span>
              </button>
            </div>
          )}
        </div>

        {/* RIWAYAT AKTIVITAS */}
        <button
          type="button"
          className={
            view === "history"
              ? "active"
              : ""
          }
          onClick={() => {
            setView("history");
            setManageMenuOpen(false);

            if (window.innerWidth <= 650) {
              setSidebarOpen(false);
            }
          }}
          title={text.activityHistory}
          aria-label={text.activityHistory}
        >
          <History />

          <span className="menu-label">
            {text.activityHistory}
          </span>
        </button>

        {/* PENGATURAN */}
        <button
          type="button"
          className={
            view === "settings"
              ? "active"
              : ""
          }
          onClick={() => {
            setView("settings");
            setManageMenuOpen(false);

          }}
          title="Pengaturan"
          aria-label="Buka Pengaturan"
        >
          <SettingsIcon />

          <span className="menu-label">
            {text.settings}
          </span>
        </button>

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
              placeholder={text.searchPlaceholder}
            />
          </div>

          <div className="source">
            <span />
            {source}
          </div>

          <div className="profileMenu">
            <button
              type="button"
              className="avatarButton"
              onClick={() =>
                setProfileMenuOpen(
                  (current) => !current,
                )
              }
              aria-label="Buka menu akun"
              aria-expanded={profileMenuOpen}
            >
              JK
            </button>

            {profileMenuOpen && (
              <div className="profileDropdown">
                <div className="profileDropdownIdentity">
                  <strong>JK</strong>
                  <small>Administrator</small>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    setView("settings");
                  }}
                >
                  {text.accountSettings}
                </button>

                <button
                  type="button"
                  className="profileLogoutButton"
                  onClick={async () => {
                    setProfileMenuOpen(false);

                    try {
                      const response = await fetch(
                        "/api/auth/logout",
                        {
                          method: "POST",
                          credentials: "same-origin",
                          cache: "no-store",
                        },
                      );

                      const result =
                        (await response.json()) as {
                          success?: boolean;
                          message?: string;
                        };

                      if (
                        !response.ok ||
                        !result.success
                      ) {
                        throw new Error(
                          result.message ??
                          "Logout gagal diproses",
                        );
                      }

                      sessionStorage.removeItem(
                        "simi-last-view",
                      );

                      localStorage.removeItem(
                        "simi-last-view",
                      );

                      window.location.replace(
                        "/login",
                      );
                    } catch (error) {
                      window.alert(
                        error instanceof Error
                          ? error.message
                          : "Logout gagal diproses",
                      );
                    }
                  }}
                >
                  {text.logout}
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="content">
          {view === "history" ? (
            <ActivityHistory
              text={text}
              onBack={() => setView("dashboard")}
            />
          ) : view === "settings" ? (
            <Settings
              themeMode={themeMode}
              languageMode={languageMode}
              onThemeChange={changeTheme}
              onLanguageChange={changeLanguage}
              onBack={() => setView("home")}
              text={text}
            />
          ) : view === "input" ? (
            <SurveyInput
              surveys={initial}
              formMode={inputMode}
              text={text}
              onFormModeChange={setInputMode}
              onCancel={() => setView("dashboard")}
              onDataChanged={() => {
                router.refresh();
              }}
            />
          ) : view === "home" ? (
            <Home
              percentage={percentage}
              totalTarget={totals.t}
              realization={totals.r}
              text={text}
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
            <Calendar
              surveys={filtered}
              text={text}
            />
          ) : (
            <>
              <section className="hero">
                <div>
                  <p className="eyebrow">{text.dashboardEyebrow} </p>
                  <h1>{text.dashboardTitle}</h1>
                  <p>{text.dashboardSubtitle}</p>

                </div>

                <div className="heroStat">
                  <BarChart3 />

                  <div>
                    <b>{percentage}%</b>

                    <span>
                      {text.overallAchievementLabel}
                    </span>
                  </div>
                </div>
              </section>

              <section className="metrics">
                <article>
                  <span>{text.totalTarget}</span>
                  <b>{totals.t}</b>
                  <small>{text.allPeriods}</small>
                </article>

                <article>
                  <span>{text.realizationLabel}</span>
                  <b>{totals.r}</b>
                  <small>{text.collectedData}</small>
                </article>

                <article>
                  <span>{text.activeActivities}</span>
                  <b>{filtered.length}</b>
                  <small>{text.acrossCategories}</small>
                </article>

                <article>
                  <span>{text.remainingTarget}</span>

                  <b>
                    {Math.max(
                      0,
                      totals.t - totals.r,
                    )}
                  </b>

                  <small>{text.needsFollowUp}</small>
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
                        <em>
                          {translatePeriod(
                            survey.period,
                            resolvedLanguage,
                          )}
                        </em>
                      </div>

                      <h3>{survey.name}</h3>

                      <div className="big">
                        <b>{surveyPercentage}%</b>

                        <small>
                          {surveyTotal.r} {text.of}{" "}
                          {surveyTotal.t} {text.targetWord}
                        </small>
                      </div>

                      <div className="progress">
                        <i
                          style={{
                            width: `${surveyPercentage}% `,
                          }}
                        />
                      </div>

                      <footer>
                        <span>
                          {text.notYet}:{" "}
                          {Math.max(
                            0,
                            surveyTotal.t - surveyTotal.r,
                          )}
                        </span>

                        <span className="done">
                          {text.completed}: {surveyTotal.r}
                        </span>
                      </footer>
                    </article>
                  );
                })}
              </section>

              {hasMoreSurveys && (
                <div className="surveyExpandActions">
                  <button
                    type="button"
                    className="surveyExpandButton"
                    onClick={() =>
                      setShowAllCards((current) => !current)
                    }
                    aria-expanded={showAllCards}
                  >
                    {showAllCards
                      ? "Tampilkan lebih sedikit"
                      : `Tampilkan lebih lanjut(${hiddenSurveyCount})`}
                  </button>
                </div>
              )}

              <section className="panel">
                <div className="panelHead">
                  <div>
                    <p className="eyebrow">
                      {text.monthlyMonitoring}
                    </p>

                    <h2>{text.targetAndRealization}</h2>

                    <small className="tableResultInfo">
                      {text.showingResults}{" "}
                      {visibleTableSurveys.length}{" "}
                      {text.fromResults}{" "}
                      {filtered.length}{" "}
                      {text.activitiesLabel}
                    </small>
                  </div>
                  <button
                    type="button"
                    className="soft"
                    onClick={() => {
                      startRefresh(() => {
                        router.refresh();
                      });
                    }}
                    disabled={refreshing}
                    title="Muat ulang data dari Spreadsheet"
                    aria-label="Refresh data Spreadsheet"
                  >
                    <RefreshCw
                      className={
                        refreshing ? "refreshSpin" : ""
                      }
                    />

                    {refreshing
                      ? "Memuat..."
                      : "Refresh"}
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
                          key={`${month} -target - column`}
                          style={{ width: "42px" }}
                        />,
                        <col
                          key={`${month} -realization - column`}
                          style={{ width: "42px" }}
                        />,
                      ])}
                    </colgroup>

                    <thead>
                      <tr>
                        <th rowSpan={2}>
                          {text.surveyActivity}
                        </th>

                        <th rowSpan={2}>
                          {text.periodLabel}
                        </th>

                        {months.map((month, index) => (
                          <th
                            colSpan={2}
                            key={month}
                            style={{
                              width: "84px",
                              minWidth: "84px",
                              maxWidth: "84px",
                            }}
                          >
                            {text.monthShortNames[index]}
                          </th>
                        ))}
                      </tr>

                      <tr>
                        {months.flatMap((month) => [
                          <th
                            key={`${month} -target - header`}
                            style={{
                              width: "42px",
                              minWidth: "42px",
                              maxWidth: "42px",
                            }}
                          >
                            T
                          </th>,

                          <th
                            key={`${month} -realization - header`}
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
                      {visibleTableSurveys.map((survey) => (
                        <tr key={survey.id}>
                          <td>
                            <strong>{survey.name}</strong>

                            <small>
                              {survey.category} · {survey.owner}
                            </small>
                          </td>

                          <td>
                            {translatePeriod(
                              survey.period,
                              resolvedLanguage,
                            )}
                          </td>

                          {survey.months.flatMap((month, index) => [
                            <td
                              key={`${survey.id} -${index} -target`}
                              className={
                                month.target > 0 ? "target" : ""
                              }
                            >
                              {month.target || ""}
                            </td>,

                            <td
                              key={`${survey.id} -${index} -realization`}
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

                {hasMoreSurveys && (
                  <div className="tableExpandActions">
                    <button
                      type="button"
                      className="surveyExpandButton"
                      onClick={() =>
                        setShowAllTable((current) => !current)
                      }
                      aria-expanded={showAllTable}
                    >
                      {showAllTable
                        ? "Tampilkan lebih sedikit"
                        : `Tampilkan lebih lanjut(${hiddenSurveyCount})`}
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}