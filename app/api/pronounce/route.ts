import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as File;
    const expected = formData.get("expected") as string;

    if (!audio) return NextResponse.json({ error: "No audio" }, { status: 400 });

    const transcription = await groq.audio.transcriptions.create({
      file: audio,
      model: "whisper-large-v3",
      language: "de",
      response_format: "text",
    });

    const normalize = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9äöüß\s]/g, "").trim();
    const spoken = normalize(String(transcription));
    const exp = normalize(expected);

    const exact = spoken === exp;
    const close = spoken.includes(exp.split(" ")[0]) || exp.includes(spoken.split(" ")[0]) || exp.includes(spoken) || spoken.includes(exp);
    let feedback = "";
    let score = 0;

    if (exact) {
      feedback = "Perfect pronunciation! You said: " + spoken;
      score = 100;
    } else if (close) {
      feedback = "Close! You said: \"" + spoken + "\". Expected: \"" + expected + "\". Try once more.";
      score = 60;
    } else {
      feedback = "Not quite. You said: \"" + spoken + "\". Expected: \"" + expected + "\". Listen to the correct pronunciation first, then try again.";
      score = 0;
    }

    return NextResponse.json({ spoken, feedback, score });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}