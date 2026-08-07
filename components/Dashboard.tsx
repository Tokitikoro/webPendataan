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
  ChevronLeft,
  ChevronRight,
  Database,
  House,
  LayoutDashboard,
  Menu,
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

function Calendar({ surveys }: { surveys: Survey[] }) {
  const [cursor, setCursor] = useState(new Date());

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
                  <i
                    key={event.id}
                    className={`event e${index}`}
                    title={event.name}
                  >
                    {event.name.slice(0, 18)}
                  </i>
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
};

function Home({
  percentage,
  totalTarget,
  realization,
  onOpenDashboard,
  onOpenCalendar,
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

        <button type="button">
          <Sheet />

          <span>
            <strong>Spreadsheet</strong>
            <small>Sumber data monitoring</small>
          </span>
        </button>
      </div>
    </section>
  );
}

type SurveyInputProps = {
  onCancel: () => void;
};

function SurveyInput({
  onCancel,
}: SurveyInputProps) {
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
    useState("0");

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");
    setSuccess(false);

    try {
      const response = await fetch("/api/surveys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      });

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ??
          "Data gagal ditambahkan",
        );
      }

      setSuccess(true);
      setMessage("Data berhasil ditambahkan");

      /*
        Simpan view Dashboard agar setelah reload
        langsung membuka Dashboard.
      */
      localStorage.setItem(
        "simi-last-view",
        "dashboard",
      );

      window.setTimeout(() => {
        window.location.reload();
      }, 900);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="inputPanel">
      <div className="inputPanelHead">
        <div>
          <p className="eyebrow">
            INPUT SPREADSHEET
          </p>

          <h2>Tambah Kegiatan Survei</h2>

          <p>
            Data yang disimpan akan langsung
            ditambahkan ke Google Spreadsheet.
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
            required
          />
        </label>

        <label>
          <span>Kategori</span>

          <input
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            placeholder="Contoh: STATISTIK SOSIAL"
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
            required
          />
        </label>

        <label>
          <span>Periode</span>

          <select
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value)
            }
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
              setOwner(event.target.value)
            }
            placeholder="Contoh: Tim Produksi"
            required
          />
        </label>

        <label>
          <span>Bulan pencatatan</span>

          <select
            value={monthIndex}
            onChange={(event) =>
              setMonthIndex(
                Number(event.target.value),
              )
            }
          >
            {months.map((month, index) => (
              <option
                value={index}
                key={month}
              >
                {month}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Target</span>

          <input
            type="number"
            min="0"
            value={target}
            onChange={(event) =>
              setTarget(event.target.value)
            }
            placeholder="0"
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
            onClick={onCancel}
            disabled={submitting}
          >
            Batal
          </button>

          <button
            type="submit"
            className="inputSubmit"
            disabled={submitting}
          >
            <Sheet />

            {submitting
              ? "Menyimpan..."
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

  useEffect(() => {
    const savedView = localStorage.getItem("simi-last-view");

    if (
      savedView === "home" ||
      savedView === "dashboard" ||
      savedView === "calendar" ||
      savedView === "input"
    ) {
      setView(savedView);
    } else {
      setView("home");
    }
  }, []);

  useEffect(() => {
    if (view !== null) {
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

  const cards = filtered.slice(0, 5);

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
        <div className="brand-wrapper">
          <div className="brand">
            <span>BPS</span>
          </div>

          <div className="brand-name">
            <strong>Badan Pusat Statistik</strong>
            <small>Monitoring Survei</small>
          </div>
        </div>

        <button
          type="button"
          className={view === "home" ? "active" : ""}
          onClick={() => {
            setView("home");

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

        <button
          type="button"
          className={view === "dashboard" ? "active" : ""}
          onClick={() => {
            setView("dashboard");

            if (window.innerWidth <= 650) {
              setSidebarOpen(false);
            }
          }}
          title="Dashboard"
        >
          <LayoutDashboard />
          <span className="menu-label">Dashboard</span>
        </button>

        <button
          type="button"
          className={view === "calendar" ? "active" : ""}
          onClick={() => {
            setView("calendar");

            if (window.innerWidth <= 650) {
              setSidebarOpen(false);
            }
          }}
          title="Kalender"
        >
          <CalendarDays />
          <span className="menu-label">Kalender</span>
        </button>

        <button
          type="button"
          className={view === "input" ? "active" : ""}
          onClick={() => {
            setView("input");

            if (window.innerWidth <= 650) {
              setSidebarOpen(false);
            }
          }}
          title="Tambah data Spreadsheet"
        >
          <Sheet />

          <span className="menu-label">
            Input Data
          </span>
        </button>

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
              onCancel={() => setView("dashboard")}
            />
          ) : view === "home" ? (
            <Home
              percentage={percentage}
              totalTarget={totals.t}
              realization={totals.r}
              onOpenDashboard={() => setView("dashboard")}
              onOpenCalendar={() => setView("calendar")}
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