import { NextResponse } from "next/server";
import { getSurveys } from "@/lib/sheet";

export async function GET() {
    return NextResponse.json(await getSurveys());
}

type AddSurveyPayload = {
    id?: string;
    category?: string;
    name?: string;
    period?: string;
    owner?: string;
    eventDate?: string;
    eventColor?: string;
    monthIndex?: number;
    target?: number;
    realization?: number;
};

export async function POST(request: Request) {
    try {
        const appsScriptUrl =
            process.env.GOOGLE_APPS_SCRIPT_WRITE_URL?.trim() ||
            process.env.GOOGLE_SHEET_CSV_URL?.trim();

        const writeToken =
            process.env.SHEET_WRITE_TOKEN?.trim();

        console.log(
            "SHEET_WRITE_TOKEN tersedia:",
            Boolean(writeToken),
        );

        console.log(
            "Panjang SHEET_WRITE_TOKEN:",
            writeToken?.length,
        );

        console.log(
            "URL Apps Script:",
            appsScriptUrl,
        );

        if (!appsScriptUrl || !writeToken) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Konfigurasi Spreadsheet belum lengkap",
                },
                {
                    status: 500,
                },
            );
        }

        const body =
            (await request.json()) as AddSurveyPayload;

        const requiredTextFields = [
            body.id,
            body.category,
            body.name,
            body.period,
            body.owner,
        ];

        if (
            requiredTextFields.some(
                (value) =>
                    typeof value !== "string" ||
                    value.trim() === "",
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Semua kolom wajib harus diisi",
                },
                {
                    status: 400,
                },
            );
        }

        if (
            typeof body.monthIndex !== "number" ||
            body.monthIndex < 0 ||
            body.monthIndex > 11
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Bulan tidak valid",
                },
                {
                    status: 400,
                },
            );
        }

        if (
            typeof body.target !== "number" ||
            typeof body.realization !== "number" ||
            body.target < 0 ||
            body.realization < 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Target dan realisasi harus berupa angka positif",
                },
                {
                    status: 400,
                },
            );
        }

        const response = await fetch(appsScriptUrl, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify({
                ...body,
                token: writeToken,
            }),
            redirect: "follow",
            cache: "no-store",
        });

        const responseText = await response.text();

        console.log(
            "Content-Type Apps Script:",
            response.headers.get("content-type"),
        );

        console.log("Status Apps Script:", response.status);
        console.log("Respons Apps Script:", responseText);

        let result: {
            success?: boolean;
            message?: string;
        };

        try {
            result = JSON.parse(responseText);
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Respons Apps Script tidak dapat dibaca",
                },
                {
                    status: 502,
                },
            );
        }

        if (!response.ok || !result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        result.message ??
                        "Gagal menyimpan data ke Spreadsheet",
                },
                {
                    status: 502,
                },
            );
        }

        return NextResponse.json({
            success: true,
            message: "Data berhasil ditambahkan",
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Terjadi kesalahan",
            },
            {
                status: 500,
            },
        );
    }
}

type DeleteSurveyPayload = {
    id?: string;
};

export async function DELETE(request: Request) {
    try {
        const appsScriptUrl =
            process.env.GOOGLE_APPS_SCRIPT_WRITE_URL?.trim() ||
            process.env.GOOGLE_SHEET_CSV_URL?.trim();

        const writeToken =
            process.env.SHEET_WRITE_TOKEN?.trim();

        if (!appsScriptUrl || !writeToken) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Konfigurasi Spreadsheet belum lengkap",
                },
                {
                    status: 500,
                },
            );
        }

        const body =
            (await request.json()) as DeleteSurveyPayload;

        const id = body.id?.trim();

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "ID kegiatan yang akan dihapus tidak tersedia",
                },
                {
                    status: 400,
                },
            );
        }

        /*
         * Apps Script Web App menangani penghapusan
         * melalui doPost dengan action: "delete".
         */
        const response = await fetch(appsScriptUrl, {
            method: "POST",
            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8",
            },
            body: JSON.stringify({
                action: "delete",
                id,
                token: writeToken,
            }),
            redirect: "follow",
            cache: "no-store",
        });

        const responseText =
            await response.text();

        console.log(
            "Status hapus Apps Script:",
            response.status,
        );

        console.log(
            "Respons hapus Apps Script:",
            responseText.slice(0, 500),
        );

        let result: {
            success?: boolean;
            message?: string;
            action?: string;
        };

        try {
            result = JSON.parse(responseText) as {
                success?: boolean;
                message?: string;
                action?: string;
            };
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Respons penghapusan dari Apps Script bukan JSON",
                },
                {
                    status: 502,
                },
            );
        }

        if (!response.ok || !result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        result.message ??
                        "Kegiatan gagal dihapus dari Spreadsheet",
                },
                {
                    status: 502,
                },
            );
        }

        return NextResponse.json({
            success: true,
            action: result.action ?? "deleted",
            message:
                result.message ??
                "Kegiatan berhasil dihapus",
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Terjadi kesalahan saat menghapus kegiatan",
            },
            {
                status: 500,
            },
        );
    }
}