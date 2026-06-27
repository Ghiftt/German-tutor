import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const FUNDER_TEMPLATES: Record<string, { sections: string[]; tone: string; format: string }> = {
  tef: {
    tone: "Passionate, vision-driven, impact-focused. TEF wants to see ambition and African entrepreneurship spirit.",
    format: "TEF Connect Application Format",
    sections: [
      "1. BUSINESS NAME AND DESCRIPTION\nDescribe your business in 2-3 sentences. What do you do, who do you serve, and what makes you different?",
      "2. PROBLEM YOU ARE SOLVING\nWhat specific problem does your business solve in your community?",
      "3. YOUR SOLUTION\nHow does your business solve this problem? Be specific.",
      "4. TARGET MARKET\nWho are your customers? How many potential customers exist in your area?",
      "5. REVENUE MODEL\nHow does your business make money? List your products/services and prices.",
      "6. CURRENT TRACTION\nWhat have you achieved so far? Sales, customers, partnerships.",
      "7. HOW YOU WILL USE THE $5,000\nBreak down exactly how you will spend the TEF seed capital.",
      "8. EXPECTED IMPACT\nHow will this funding impact your business and your community in 12 months?",
      "9. YOUR STORY\nWhy are you the right person to build this business? What drives you?"
    ]
  },
  pcgs: {
    tone: "Clear, simple, direct. Government grant — focus on community impact and job creation.",
    format: "Presidential Conditional Grant Scheme Application",
    sections: [
      "1. APPLICANT INFORMATION\nFull name, location, contact details, and business name.",
      "2. BUSINESS DESCRIPTION\nWhat does your business do? How long have you been operating?",
      "3. CURRENT CHALLENGES\nWhat is the biggest challenge your business faces right now?",
      "4. HOW YOU WILL USE THE GRANT\nExactly how will you use the ₦50,000 to grow your business?",
      "5. JOB CREATION PLAN\nHow many people will you employ or support with this funding?",
      "6. EXPECTED BUSINESS GROWTH\nWhere do you expect your business to be in 6 months after receiving this grant?"
    ]
  },
  women_biz: {
    tone: "Empowering, community-focused. Highlight the impact on women and families.",
    format: "Women in Business Grant Application",
    sections: [
      "1. YOUR BUSINESS STORY\nTell us about your business and how you started it.",
      "2. THE PROBLEM YOU SOLVE\nWhat challenge does your business address for women or your community?",
      "3. HOW THE GRANT WILL HELP\nHow will you use this grant to grow your business?",
      "4. IMPACT ON WOMEN\nHow does your business empower other women directly or indirectly?",
      "5. YOUR GOALS\nWhat are your business goals for the next 12 months?"
    ]
  },
  nyif: {
    tone: "Professional, growth-focused. Show ambition and job creation potential.",
    format: "National Youth Investment Fund Application",
    sections: [
      "1. PERSONAL INFORMATION\nAge, location, educational background, years of business experience.",
      "2. BUSINESS OVERVIEW\nDescribe your business — what you do, where, and how long.",
      "3. MARKET OPPORTUNITY\nWhy is there demand for your product or service?",
      "4. FUNDING AMOUNT REQUESTED\nHow much are you requesting and why?",
      "5. USE OF FUNDS\nBreak down exactly how you will use the loan.",
      "6. JOB CREATION\nHow many direct and indirect jobs will this funding create?",
      "7. REPAYMENT PLAN\nHow do you plan to repay the loan? What is your monthly revenue projection?"
    ]
  },
  boi_msme: {
    tone: "Formal, financial, data-driven. BOI wants numbers and repayment confidence.",
    format: "Bank of Industry MSME Fund Application",
    sections: [
      "1. BUSINESS PROFILE\nBusiness name, registration number, sector, location, years operating.",
      "2. BUSINESS DESCRIPTION\nWhat does your business produce or sell? Who are your customers?",
      "3. FINANCIAL SUMMARY\nCurrent monthly revenue, expenses, and profit margin.",
      "4. LOAN AMOUNT REQUESTED\nExact amount needed and detailed breakdown of use.",
      "5. COLLATERAL\nWhat assets can you offer as security for this loan?",
      "6. REPAYMENT SCHEDULE\nProposed monthly repayment amount and timeline.",
      "7. BUSINESS GROWTH PROJECTION\nHow will this loan increase your revenue in 12 months?"
    ]
  }
};

export async function POST(req: NextRequest) {
  try {
    const { profile, funderId } = await req.json();

    const template = FUNDER_TEMPLATES[funderId] ?? FUNDER_TEMPLATES["pcgs"];

    const prompt = `You are a professional grant writer specializing in Nigerian MSME funding applications.

Generate a complete, compelling funding application for this business owner.

FUNDER: ${template.format}
TONE: ${template.tone}

BUSINESS PROFILE:
${JSON.stringify(profile, null, 2)}

Write each section below. Be specific to THIS business — use their actual details.
Do not invent or assume any personal details that are not in the profile — no names, phone numbers, email addresses, or addresses unless they are explicitly provided.
If the profile does not have a name, write "the applicant" or leave the name field blank with a note: "[Applicant to fill in]".
If the profile does not have a phone number or email, write "[Contact details to be filled in]".
Write as if the business owner is speaking in first person.
Make it real, specific, and compelling.

${template.sections.join("\n\n")}

After all sections, add:
CLOSING STATEMENT:
A 2-sentence closing that reinforces why this business deserves funding.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const proposal = completion.choices[0].message.content ?? "";

    return NextResponse.json({ proposal, funderName: template.format });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}