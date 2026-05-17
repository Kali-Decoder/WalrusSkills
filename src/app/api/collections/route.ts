import { NextResponse } from "next/server";
import { getCollections } from "@/lib/collections";

export async function GET() {
  const collections = getCollections();
  return NextResponse.json(collections);
}
