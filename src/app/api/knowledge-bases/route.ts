import { NextResponse } from "next/server";
import { getKnowledgeBases } from "@/lib/knowledge-bases";

export async function GET() {
  const kbs = getKnowledgeBases();
  return NextResponse.json(kbs);
}
