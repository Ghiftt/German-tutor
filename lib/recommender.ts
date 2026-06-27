import fundersData from "@/data/funders.json";

export interface BusinessProfile {
  business_name: string;
  business_type: string;
  sector: string;
  location: {
    state: string;
    city: string;
  };
  years_operating: number;
  employees: number;
  registered_cac: boolean;
  monthly_revenue_range: string;
  funding_goal: string;
  funding_amount_needed: string;
  owner: {
    gender: string;
    age_range: string;
    is_youth: boolean;
  };
  previous_funding: boolean;
  readiness_score: number;
  profile_completeness: number;
}

export interface FunderMatch {
  funderId: string;
  funderName: string;
  type: string;
  amount: string;
  deadline: string;
  score: number;
  matchLabel: string;
  qualifying: string[];
  missing: string[];
  applicationUrl: string;
  description: string;
}

export function rankFunders(profile: Partial<BusinessProfile>): FunderMatch[] {
  const funders = fundersData as any[];

  const userState = profile.location?.state?.toLowerCase() ?? "";
  const userSector = profile.sector?.toLowerCase() ?? "";
  const userGender = profile.owner?.gender?.toLowerCase() ?? "";
  const userIsYouth = profile.owner?.is_youth ?? false;
  const userYears = profile.years_operating ?? 0;

  const sectorAliases: Record<string, string[]> = {
    food: ["food", "hospitality", "restaurant", "catering", "food & beverage", "food and beverage"],
    agriculture: ["agriculture", "farming", "agro", "agro-processing"],
    technology: ["technology", "tech", "software", "fintech", "edtech", "healthtech"],
  };

  const sectorMatches = (funderSectors: string[]) => {
    if (funderSectors.includes("all")) return true;
    if (funderSectors.includes(userSector)) return true;
    for (const [canonical, aliases] of Object.entries(sectorAliases)) {
      if (aliases.includes(userSector) && funderSectors.includes(canonical)) return true;
    }
    return false;
  };

  const scored = funders.map((funder) => {
    let score = 0;
    const qualifying: string[] = [];
    const missing: string[] = [];

    // CAC check
    if (funder.requires_cac && !profile.registered_cac) {
      missing.push("CAC registration required");
    } else if (funder.requires_cac && profile.registered_cac) {
      score += 25;
      qualifying.push("Business is CAC registered");
    } else {
      score += 25;
      qualifying.push("CAC registration not required");
    }

    // Location check
    if (funder.location.includes("all")) {
      score += 15;
      qualifying.push("Available in your location");
    } else if (userState && funder.location.includes(userState)) {
      score += 15;
      qualifying.push(`Available in ${profile.location?.state}`);
    } else {
      missing.push(`Only available in ${funder.location.join(", ")}`);
    }

    // Years operating
    const minYears = funder.min_years_operating ?? 0;
    if (userYears >= minYears) {
      score += 15;
      qualifying.push(`${userYears} year(s) operating meets requirement`);
    } else {
      missing.push(`Minimum ${minYears} year(s) operating required`);
    }

    // Sector check
    if (sectorMatches(funder.sectors)) {
      score += 20;
      qualifying.push(`${profile.sector} sector is eligible`);
    } else {
      missing.push(`Your sector is not eligible — fund targets: ${funder.sectors.join(", ")}`);
    }

    // Gender check
    if (funder.gender === "all" || funder.gender === userGender) {
      score += 10;
      qualifying.push("Gender eligibility met");
    } else {
      missing.push(`This fund is for ${funder.gender} entrepreneurs only`);
    }

    // Youth check
    if (funder.age === "youth" && !userIsYouth) {
      missing.push("This fund is for entrepreneurs aged 18-35 only");
    } else {
      score += 15;
      qualifying.push("Age eligibility met");
    }

    const finalScore = Math.max(0, Math.min(100, score));
    const matchLabel =
      missing.length === 0 ? "Eligible now" :
      missing.some(m => m.includes("CAC")) ? "Eligible with CAC" :
      `${finalScore}% match`;

    return {
      funderId: funder.id,
      funderName: funder.name,
      type: funder.type,
      amount: funder.amount,
      deadline: funder.deadline ?? "",
      score: finalScore,
      matchLabel,
      qualifying,
      missing,
      applicationUrl: funder.application_url,
      description: funder.description,
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function computeReadiness(profile: Partial<BusinessProfile>): {
  score: number;
  weaknesses: string[];
  fixes: string[];
} {
  let score = 0;
  const weaknesses: string[] = [];
  const fixes: string[] = [];

  if (profile.registered_cac) {
    score += 20;
  } else {
    weaknesses.push("Business not registered with CAC");
    fixes.push("Register at pre.cac.gov.ng for N10,500 — unlocks most major funders");
  }

  if ((profile.years_operating ?? 0) >= 1) {
    score += 15;
  } else {
    weaknesses.push("Business is less than 1 year old");
    fixes.push("Some funders like PCGS and Women in Business accept new businesses — apply to those first");
  }

  if (profile.monthly_revenue_range && profile.monthly_revenue_range !== "") {
    score += 20;
  } else {
    weaknesses.push("No revenue information provided");
    fixes.push("Start keeping weekly sales records — even a notebook counts as financial documentation");
  }

  if (profile.business_type && profile.sector) {
    score += 15;
  } else {
    weaknesses.push("Business description is incomplete");
    fixes.push("Complete your profile — tell BizHelp AI what you sell, where, and what you need money for");
  }

  if (profile.sector && profile.sector !== "") {
    score += 15;
  } else {
    weaknesses.push("Business sector not identified");
    fixes.push("Specify your sector so we can match you to sector-specific funders");
  }

  if (!profile.previous_funding) {
    score += 15;
  } else {
    score += 10;
  }

  return { score, weaknesses, fixes };
}