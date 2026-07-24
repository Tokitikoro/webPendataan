"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Menu,
  RefreshCw,
  Search,
  Sheet,
} from "lucide-react";

import { Survey } from "@/lib/types";

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

type DashboardProps = {
  initial: Survey[];
  source: string;
};

export default function Dashboard({
  initial,
  source,
}: DashboardProps) {
  const [view, setView] = useState<"dashboard" | "calendar">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="shell">
      <aside>
        <div className="brand">
          <span>SI</span>
        </div>

        <button
          type="button"
          className={view === "dashboard" ? "active" : ""}
          onClick={() => setView("dashboard")}
          title="Dashboard"
        >
          <LayoutDashboard />
        </button>

        <button
          type="button"
          className={view === "calendar" ? "active" : ""}
          onClick={() => setView("calendar")}
          title="Kalender"
        >
          <CalendarDays />
        </button>

        <button type="button" title="Sumber spreadsheet">
          <Sheet />
        </button>

        <div className="spacer" />

        <small>v1.0</small>
      </aside>

      <main>
        <header>
          <button
            type="button"
            className="icon"
            aria-label="Buka menu"
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
          {view === "calendar" ? (
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