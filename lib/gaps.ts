import { BusinessProfile } from "./recommender";
import { FunderMatch } from "./recommender";

export interface Gap {
  issue: string;
  impact: string;
  fix: string;
  fixUrl?: string;
  fixCost?: string;
  unlocks: string[];
  scoreGain: number;
}

export function diagnoseGaps(profile: BusinessProfile, matches: FunderMatch[]): Gap[] {
  const gaps: Gap[] = [];

  // CAC gap
  if (!profile.registered_cac) {
    const lockedFunders = matches
      .filter(m => m.missing.some(miss => miss.toLowerCase().includes("cac")))
      .map(m => m.funderName);

    const totalUnlocked = matches.filter(m =>
      m.missing.some(miss => miss.toLowerCase().includes("cac"))
    ).length;

    gaps.push({
      issue: "Business not registered with CAC",
      impact: `Your TEF match is currently 71%. Registration would push it to 94% and unlock ${totalUnlocked} more funder${totalUnlocked !== 1 ? "s" : ""}.`,
      fix: "Register your business at pre.cac.gov.ng",
      fixUrl: "https://pre.cac.gov.ng",
      fixCost: "₦10,500",
      unlocks: lockedFunders,
      scoreGain: 20,
    });
  }

  // Revenue documentation gap
  if (!profile.monthly_revenue_range || profile.monthly_revenue_range === "") {
    gaps.push({
      issue: "No revenue records",
      impact: "Most loans require at least 6 months of financial records. Without them, you cannot access BOI or CBN funds.",
      fix: "Start a simple sales notebook today — record every transaction. After 3 months, open a business bank account.",
      fixCost: "Free",
      unlocks: ["Bank of Industry MSME Fund", "CBN AGSMEIS Fund"],
      scoreGain: 20,
    });
  }

  // Youth gap
  if (!profile.owner?.is_youth && profile.owner?.age_range) {
    const age = profile.owner.age_range;
    if (age.includes("18") || age.includes("20") || age.includes("25") || age.includes("30")) {
      gaps.push({
        issue: "Youth status not confirmed",
        impact: "If you are between 18-35, you qualify for NYIF (up to ₦3M) and BOI YES fund (up to ₦5M).",
        fix: "Confirm your age so we can unlock youth-specific funding for you.",
        unlocks: ["National Youth Investment Fund", "BOI Youth Entrepreneurship Support"],
        scoreGain: 15,
      });
    }
  }

  // Banking access gap
  const profileAny = profile as any;
  if (profileAny.banking_access === false || profileAny.cash_based === true) {
    gaps.push({
      issue: "No business bank account",
      impact: "Most funders require a bank statement. Without one, you are limited to grants like PCGS and Women in Business only.",
      fix: "Open a free business account at any microfinance bank — LAPO, NIRSAL, or AB Microfinance accept informal businesses.",
      fixCost: "Free",
      unlocks: ["Bank of Industry MSME Fund", "CBN AGSMEIS Fund", "LSETF"],
      scoreGain: 15,
    });
  }

  return gaps;
}

export function computeUpgradePath(
  profile: BusinessProfile,
  matches: FunderMatch[],
  currentReadiness: number
): {
  currentScore: number;
  upgradedScore: number;
  currentFunders: number;
  upgradedFunders: number;
  currentMaxFunding: string;
  upgradedMaxFunding: string;
  keyAction: string;
  keyActionCost: string;
  keyActionUrl: string;
} | null {

  if (!profile.registered_cac) {
    return {
      currentScore: currentReadiness,
      upgradedScore: Math.min(100, currentReadiness + 20),
      currentFunders: matches.filter(m => m.score >= 70 && m.missing.length === 0).length,
      upgradedFunders: matches.filter(m => m.score >= 70).length,
      currentMaxFunding: "₦50,000",
      upgradedMaxFunding: "₦1,300,000+",
      keyAction: "Register your business with CAC",
      keyActionCost: "₦10,500",
      keyActionUrl: "https://pre.cac.gov.ng",
    };
  }

  if (!profile.monthly_revenue_range) {
    return {
      currentScore: currentReadiness,
      upgradedScore: Math.min(100, currentReadiness + 20),
      currentFunders: matches.filter(m => m.score >= 70 && m.missing.length === 0).length,
      upgradedFunders: matches.filter(m => m.score >= 70).length,
      currentMaxFunding: "₦50,000",
      upgradedMaxFunding: "₦10,000,000+",
      keyAction: "Start keeping sales records and open a business bank account",
      keyActionCost: "Free",
      keyActionUrl: "https://www.nirsal.com",
    };
  }

  return null;
}