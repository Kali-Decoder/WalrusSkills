import { NextResponse } from "next/server";
import { getSkillProfiles } from "@/lib/skills";

export async function GET() {
  const profiles = getSkillProfiles();
  return NextResponse.json(profiles);
}
