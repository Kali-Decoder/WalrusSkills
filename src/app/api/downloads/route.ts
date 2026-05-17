import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export async function GET() {
  const redis = getRedis();
  if (!redis) return NextResponse.json({});

  try {
    const keys = await redis.keys("downloads:*");
    const counts: Record<string, number> = {};
    for (const key of keys) {
      const slug = key.replace("downloads:", "");
      const count = await redis.get<number>(key);
      counts[slug] = count || 0;
    }
    return NextResponse.json(counts);
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(req: NextRequest) {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ count: 0 });

  try {
    const { slug } = await req.json();
    const count = await redis.incr(`downloads:${slug}`);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
