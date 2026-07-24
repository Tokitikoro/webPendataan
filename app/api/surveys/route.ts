import { NextResponse } from "next/server";
import { getSurveys } from "@/lib/sheet";
export async function GET(){ return NextResponse.json(await getSurveys()); }
