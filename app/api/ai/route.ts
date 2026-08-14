import { NextResponse } from "next/server";
import { POST as symptomCheckPOST } from "./symptom-check/route";

export async function POST(req: Request) {
  return symptomCheckPOST(req);
}
