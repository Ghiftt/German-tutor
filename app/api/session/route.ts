import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data: student } = await supabase
      .from("students")
      .select("*")
      .single();

    if (!student) return NextResponse.json({ error: "No student found" }, { status: 404 });

    const today = new Date().toISOString().split("T")[0];

    const { data: todaySession } = await supabase
      .from("sessions")
      .select("*")
      .eq("student_id", student.id)
      .eq("date", today)
      .eq("completed", false)
      .order("started_at", { ascending: false })
      .limit(1)
      .single();

    const { data: flaggedWords } = await supabase
      .from("word_mastery")
      .select("*")
      .eq("student_id", student.id)
      .eq("flagged", true)
      .order("mastery_score", { ascending: true })
      .limit(10);

    const { data: completedSessions } = await supabase
      .from("sessions")
      .select("lesson_id")
      .eq("student_id", student.id)
      .eq("completed", true);

    const completedLessons = completedSessions?.map(s => s.lesson_id) ?? [];

    return NextResponse.json({
      student,
      todaySession,
      flaggedWords: flaggedWords ?? [],
      completedLessons
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, studentId, lessonId, sessionId, updates, word, correct, mistake } = body;

    if (action === "start_session") {
      const today = new Date().toISOString().split("T")[0];
      const { data: existing } = await supabase
        .from("sessions")
        .select("*")
        .eq("student_id", studentId)
        .eq("lesson_id", lessonId)
        .eq("date", today)
        .single();

      if (existing) return NextResponse.json({ session: existing });

      const { data: session } = await supabase
        .from("sessions")
        .insert({ student_id: studentId, lesson_id: lessonId, stage: "QUICK_REVIEW" })
        .select()
        .single();

      return NextResponse.json({ session });
    }

    if (action === "update_session") {
      const { data: session } = await supabase
        .from("sessions")
        .update(updates)
        .eq("id", sessionId)
        .select()
        .single();
      return NextResponse.json({ session });
    }

    if (action === "complete_session") {
      const { data: session } = await supabase
        .from("sessions")
        .update({ completed: true, completed_at: new Date().toISOString(), ...updates })
        .eq("id", sessionId)
        .select()
        .single();

      await supabase
        .from("students")
        .update({
          last_active: new Date().toISOString(),
          current_lesson_id: lessonId,
          total_sessions: supabase.rpc("increment", { x: 1 })
        })
        .eq("id", studentId);

      return NextResponse.json({ session });
    }

    if (action === "update_word") {
      const { data: existing } = await supabase
        .from("word_mastery")
        .select("*")
        .eq("student_id", studentId)
        .eq("word", word)
        .single();

      if (existing) {
        const newCorrect = correct ? existing.correct + 1 : existing.correct;
        const newIncorrect = correct ? existing.incorrect : existing.incorrect + 1;
        const total = newCorrect + newIncorrect;
        const mastery_score = total > 0 ? Math.round((newCorrect / total) * 100) : 0;
        const flagged = mastery_score < 60;
        const next_review = new Date(Date.now() + (correct ? 86400000 * 3 : 86400000)).toISOString();

        await supabase.from("word_mastery").update({
          correct: newCorrect,
          incorrect: newIncorrect,
          mastery_score,
          flagged,
          last_seen: new Date().toISOString(),
          next_review
        }).eq("id", existing.id);
      } else {
        await supabase.from("word_mastery").insert({
          student_id: studentId,
          word,
          lesson_id: lessonId,
          correct: correct ? 1 : 0,
          incorrect: correct ? 0 : 1,
          mastery_score: correct ? 100 : 0,
          flagged: !correct,
          next_review: new Date(Date.now() + 86400000).toISOString()
        });
      }
      return NextResponse.json({ ok: true });
    }

    if (action === "log_mistake") {
      await supabase.from("mistakes").insert({
        student_id: studentId,
        lesson_id: lessonId,
        ...mistake
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}