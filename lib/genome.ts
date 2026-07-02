import { createClient } from "@supabase/supabase-js";
import { GenomeSummary } from "./session-engine";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function commitGenome(studentId: string, summary: GenomeSummary) {
  const updates: any[] = [];

  // 1. Log completed session
  updates.push(
    supabase.from("sessions").insert({
      student_id: studentId,
      lesson_id: summary.lessonId,
      completed: true,
      mastery: summary.assessmentScore,
      correct: 0,
      incorrect: 0,
      completed_at: summary.completedAt,
    })
  );

  // 2. Update weak words
  for (const word of summary.weakWords) {
    updates.push(
      supabase.from("word_mastery").upsert({
        student_id: studentId,
        word,
        lesson_id: summary.lessonId,
        flagged: true,
        mastery_score: 30,
        last_seen: summary.completedAt,
        next_review: new Date(Date.now() + 86400000).toISOString(),
      }, { onConflict: "student_id,word" })
    );
  }

  // 3. Update mastered words
  for (const word of summary.masteredWords) {
    updates.push(
      supabase.from("word_mastery").upsert({
        student_id: studentId,
        word,
        lesson_id: summary.lessonId,
        flagged: false,
        mastery_score: 90,
        last_seen: summary.completedAt,
        next_review: new Date(Date.now() + 86400000 * 3).toISOString(),
      }, { onConflict: "student_id,word" })
    );
  }

  // 4. Update student record
  if (summary.passed) {
    updates.push(
      supabase.from("students").update({
        last_active: summary.completedAt,
        total_sessions: supabase.rpc("increment", { x: 1 }),
      }).eq("id", studentId)
    );
  }

  await Promise.all(updates);
}