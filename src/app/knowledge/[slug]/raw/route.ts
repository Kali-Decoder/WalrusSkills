import { NextRequest, NextResponse } from "next/server";
import { getKnowledgeBase } from "@/lib/knowledge-bases";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const kb = getKnowledgeBase(slug);

  if (!kb) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(kb.kbMd, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
