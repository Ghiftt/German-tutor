import { NextRequest, NextResponse } from "next/server";
import { rankFunders, computeReadiness, BusinessProfile } from "@/lib/recommender";
import { diagnoseGaps, computeUpgradePath } from "@/lib/gaps";

export async function POST(req: NextRequest) {
  try {
    const { profile } = await req.json() as { profile: BusinessProfile };

    const matches = rankFunders(profile);
    const readiness = computeReadiness(profile);
    const gaps = diagnoseGaps(profile, matches);
    const upgradePath = computeUpgradePath(profile, matches, readiness.score);

    return NextResponse.json({ matches, readiness, gaps, upgradePath });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}