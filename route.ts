import { NextRequest, NextResponse } from "next/server";
import { rankFunders, computeReadiness, BusinessProfile } from "@/lib/recommender";

export async function POST(req: NextRequest) {
  try {
    const { profile } = await req.json() as { profile: BusinessProfile };
    
    const matches = rankFunders(profile);
    const readiness = computeReadiness(profile);

    return NextResponse.json({ matches, readiness });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}