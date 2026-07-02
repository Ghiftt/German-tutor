import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getStudent() {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .single();
  if (error) return null;
  return data;
}

export async function updateStudent(updates: any) {
  const { data } = await supabase
    .from('students')
    .update(updates)
    .select()
    .single();
  return data;
}

export async function getTodaySession(studentId: string, lessonId: string) {
  const { data } = await supabase
    .from('sessions')
    .select('*')
    .eq('student_id', studentId)
    .eq('lesson_id', lessonId)
    .eq('date', new Date().toISOString().split('T')[0])
    .single();
  return data;
}

export async function createSession(studentId: string, lessonId: string) {
  const { data } = await supabase
    .from('sessions')
    .insert({ student_id: studentId, lesson_id: lessonId })
    .select()
    .single();
  return data;
}

export async function updateSession(sessionId: string, updates: any) {
  const { data } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();
  return data;
}

export async function logMistake(studentId: string, lessonId: string, type: string, question: string, userAnswer: string, correctAnswer: string) {
  await supabase.from('mistakes').insert({
    student_id: studentId,
    lesson_id: lessonId,
    type,
    question,
    user_answer: userAnswer,
    correct_answer: correctAnswer
  });
}

export async function updateWordMastery(studentId: string, word: string, lessonId: string, correct: boolean) {
  const { data: existing } = await supabase
    .from('word_mastery')
    .select('*')
    .eq('student_id', studentId)
    .eq('word', word)
    .single();

  if (existing) {
    const newCorrect = correct ? existing.correct + 1 : existing.correct;
    const newIncorrect = correct ? existing.incorrect : existing.incorrect + 1;
    const total = newCorrect + newIncorrect;
    const mastery_score = total > 0 ? Math.round((newCorrect / total) * 100) : 0;
    const flagged = mastery_score < 60;
    const next_review = new Date(Date.now() + (correct ? 86400000 * 3 : 86400000)).toISOString();

    await supabase.from('word_mastery').update({
      correct: newCorrect,
      incorrect: newIncorrect,
      mastery_score,
      flagged,
      last_seen: new Date().toISOString(),
      next_review
    }).eq('id', existing.id);
  } else {
    await supabase.from('word_mastery').insert({
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
}

export async function getFlaggedWords(studentId: string) {
  const { data } = await supabase
    .from('word_mastery')
    .select('*')
    .eq('student_id', studentId)
    .eq('flagged', true)
    .order('mastery_score', { ascending: true })
    .limit(10);
  return data ?? [];
}

export async function getCompletedLessons(studentId: string) {
  const { data } = await supabase
    .from('sessions')
    .select('lesson_id')
    .eq('student_id', studentId)
    .eq('completed', true);
  return data?.map(s => s.lesson_id) ?? [];
}