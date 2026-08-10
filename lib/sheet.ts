import Papa from "papaparse";

import type { Survey } from "./types";
import { sampleSurveys } from "./sample-data";

const monthKeys = [
  "jan",
  "feb",
  "mar",
  "apr",
  "mei",
  "jun",
  "jul",
  "agu",
  "sep",
  "okt",
  "nov",
  "des",
];

export async function getSurveys(): Promise<{
  data: Survey[];
  source: string;
}> {
  const url = process.env.GOOGLE_SHEET_CSV_URL;

  if (!url) {
    return {
      data: sampleSurveys,
      source: "Data demo",
    };
  }

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 300,
      },
    });

    if (!res.ok) {
      throw new Error(
        "Spreadsheet tidak dapat dibaca",
      );
    }

    const text = await res.text();

    const parsed = Papa.parse<
      Record<string, string>
    >(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) =>
        header.trim().toLowerCase(),
    });

    const data = parsed.data.map(
      (row, index): Survey => ({
        id: row.id || `sheet-${index}`,
        category: row.kategori || "LAINNYA",
        name: row.kegiatan || "Tanpa nama",
        period: row.periode || "-",
        owner: row.penanggung_jawab || "-",

        eventColor:
          row.warna_acara?.trim() ||
          "#19c5a6",

        months: monthKeys.map(
          (monthKey) => ({
            target: Number(
              row[`${monthKey}_target`] || 0,
            ),
            realization: Number(
              row[
                `${monthKey}_realisasi`
              ] || 0,
            ),
          }),
        ),
      }),
    );

    if (!data.length) {
      throw new Error("Spreadsheet kosong");
    }

    return {
      data,
      source: "Google Spreadsheet",
    };
  } catch (error) {
    console.error(error);

    return {
      data: sampleSurveys,
      source:
        "Data demo (spreadsheet gagal dimuat)",
    };
  }
}