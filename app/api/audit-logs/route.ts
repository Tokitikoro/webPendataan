import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();

  const session = await verifySessionToken(
    cookieStore.get(SESSION_COOKIE_NAME)?.value,
  );

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Sesi tidak valid atau telah berakhir",
      },
      { status: 401 },
    );
  }

  const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_WRITE_URL?.trim();

  const writeToken = process.env.SHEET_WRITE_TOKEN?.trim();

  if (!appsScriptUrl || !writeToken) {
    return NextResponse.json(
      {
        success: false,
        message: "Konfigurasi Spreadsheet belum lengkap",
      },
      { status: 500 },
    );
  }

  const url = new URL(appsScriptUrl);

  url.searchParams.set("action", "audit");
  url.searchParams.set("token", writeToken);
  url.searchParams.set("username", session.username);
  url.searchParams.set("role", session.role);
  url.searchParams.set("limit", "200");

  const response = await fetch(url, {
    cache: "no-store",
  });

  const result = await response.json();

  return NextResponse.json(result, {
    status: response.ok ? 200 : 502,
  });
}
