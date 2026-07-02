import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getStagePrompt, SessionState } from "@/lib/session-engine";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory, lesson, sessionState } = await req.json();

    const systemPrompt = getStagePrompt(sessionState as SessionState, lesson);

    const messages = [
      ...conversationHistory,
      { role: "user", content: message }
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 700,
    });

    const fullResponse = completion.choices[0].message.content ?? "";

    const sessionUpdateMatch = fullResponse.match(/SESSION_UPDATE:\s*({.*})/);
    let sessionUpdate: any = {};
    if (sessionUpdateMatch) {
      try { sessionUpdate = JSON.parse(sessionUpdateMatch[1]); } catch {}
    }

    const assessmentMatch = fullResponse.match(/ASSESSMENT_SCORE:\s*(\d+)/);
    if (assessmentMatch) {
      sessionUpdate.assessment_score = parseInt(assessmentMatch[1]);
    }

    const cleanResponse = fullResponse
      .replace(/SESSION_UPDATE:.*$/m, "")
      .replace(/ASSESSMENT_SCORE:.*$/m, "")
      .trim();

    const correct = sessionUpdate.correct ?? 0;
    const incorrect = sessionUpdate.incorrect ?? 0;
    const total = correct + incorrect;
    const validStages = ["MORNING_HANDOVER","TEACH","GUIDED","PRACTICE","LISTENING","SPEAKING","ASSESSMENT","COMPLETE"];
    const rawStage = sessionUpdate.stage ?? sessionState?.stage ?? "MORNING_HANDOVER";
    const stage = validStages.includes(rawStage) ? rawStage : sessionState?.stage ?? "MORNING_HANDOVER";
    const inAssessment = stage === "ASSESSMENT" || stage === "COMPLETE";
    const mastery = inAssessment && total > 0 ? Math.round((correct / total) * 100) : 0;

    return NextResponse.json({
      response: cleanResponse,
      sessionUpdate: { ...sessionUpdate, mastery },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}