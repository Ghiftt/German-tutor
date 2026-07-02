// ============================================
// SESSION ENGINE — the brain of Deutsch Tutor
// Everything else plugs into this.
// ============================================

export enum SessionStage {
  MORNING_HANDOVER = "MORNING_HANDOVER",
  TEACH = "TEACH",
  GUIDED = "GUIDED",
  PRACTICE = "PRACTICE",
  LISTENING = "LISTENING",
  SPEAKING = "SPEAKING",
  ASSESSMENT = "ASSESSMENT",
  COMPLETE = "COMPLETE",
}

export interface SessionState {
  stage: SessionStage;
  lessonId: string;
  lessonTitle: string;
  startedAt: number;
  stageStartedAt: number;
  correct: number;
  incorrect: number;
  pronunciationScores: number[];
  weakWords: string[];
  masteredWords: string[];
  flaggedFromPrevious: string[];
  handoverComplete: boolean;
  teachComplete: boolean;
  guidedComplete: boolean;
  practiceComplete: boolean;
  listeningComplete: boolean;
  speakingComplete: boolean;
  assessmentScore: number;
  passed: boolean;
  timeSpentSeconds: number;
}

export interface GenomeSummary {
  lessonId: string;
  passed: boolean;
  assessmentScore: number;
  accuracy: number;
  weakWords: string[];
  masteredWords: string[];
  avgPronunciationScore: number;
  timeSpentSeconds: number;
  completedAt: string;
}

export function createSession(
  lessonId: string,
  lessonTitle: string,
  flaggedFromPrevious: string[]
): SessionState {
  return {
    stage: SessionStage.MORNING_HANDOVER,
    lessonId,
    lessonTitle,
    startedAt: Date.now(),
    stageStartedAt: Date.now(),
    correct: 0,
    incorrect: 0,
    pronunciationScores: [],
    weakWords: [],
    masteredWords: [],
    flaggedFromPrevious,
    handoverComplete: false,
    teachComplete: false,
    guidedComplete: false,
    practiceComplete: false,
    listeningComplete: false,
    speakingComplete: false,
    assessmentScore: 0,
    passed: false,
    timeSpentSeconds: 0,
  };
}

export function advanceStage(state: SessionState): SessionState {
  const now = Date.now();
  const stageTime = Math.round((now - state.stageStartedAt) / 1000);

  const next = { ...state, stageStartedAt: now, timeSpentSeconds: state.timeSpentSeconds + stageTime };

  switch (state.stage) {
    case SessionStage.MORNING_HANDOVER:
      return { ...next, handoverComplete: true, stage: SessionStage.TEACH };
    case SessionStage.TEACH:
      return { ...next, teachComplete: true, stage: SessionStage.GUIDED };
    case SessionStage.GUIDED:
      return { ...next, guidedComplete: true, stage: SessionStage.PRACTICE };
    case SessionStage.PRACTICE:
      return { ...next, practiceComplete: true, stage: SessionStage.LISTENING };
    case SessionStage.LISTENING:
      return { ...next, listeningComplete: true, stage: SessionStage.SPEAKING };
    case SessionStage.SPEAKING:
      return { ...next, speakingComplete: true, stage: SessionStage.ASSESSMENT };
    case SessionStage.ASSESSMENT:
      const passed = state.assessmentScore >= 80;
      return { ...next, passed, stage: SessionStage.COMPLETE };
    default:
      return next;
  }
}

export function recordAnswer(state: SessionState, correct: boolean, word?: string): SessionState {
  const next = { ...state };
  if (correct) {
    next.correct += 1;
    if (word && !next.masteredWords.includes(word)) next.masteredWords.push(word);
    next.weakWords = next.weakWords.filter(w => w !== word);
  } else {
    next.incorrect += 1;
    if (word && !next.weakWords.includes(word)) next.weakWords.push(word);
  }
  return next;
}

export function recordPronunciation(state: SessionState, score: number): SessionState {
  return { ...state, pronunciationScores: [...state.pronunciationScores, score] };
}

export function setAssessmentScore(state: SessionState, score: number): SessionState {
  return { ...state, assessmentScore: score };
}

export function buildGenomeSummary(state: SessionState): GenomeSummary {
  const total = state.correct + state.incorrect;
  const accuracy = total > 0 ? Math.round((state.correct / total) * 100) : 0;
  const avgPronunciation = state.pronunciationScores.length > 0
    ? Math.round(state.pronunciationScores.reduce((a, b) => a + b, 0) / state.pronunciationScores.length)
    : 0;

  return {
    lessonId: state.lessonId,
    passed: state.passed,
    assessmentScore: state.assessmentScore,
    accuracy,
    weakWords: state.weakWords,
    masteredWords: state.masteredWords,
    avgPronunciationScore: avgPronunciation,
    timeSpentSeconds: state.timeSpentSeconds,
    completedAt: new Date().toISOString(),
  };
}

export function getStagePrompt(state: SessionState, lesson: any): string {
  const flaggedList = state.flaggedFromPrevious.length > 0
    ? "Words to review from previous sessions: " + state.flaggedFromPrevious.join(", ")
    : "This is the student's first session. Preview today's vocabulary instead of reviewing.";

  const stageInstructions: Record<SessionStage, string> = {
    [SessionStage.MORNING_HANDOVER]: `
You are starting the MORNING HANDOVER stage — like a nursing handover before a shift.
Say: "Before today's lesson, let's do a quick handover."
${flaggedList}
If reviewing: drill each flagged word with a quick question. Do not teach new content.
If previewing (first session): briefly introduce 3-4 words from today's lesson vocabulary to build anticipation.
Keep this stage to 5-10 minutes maximum.
When complete, tell the student: "Handover complete. Ready to start today's lesson?" and wait for confirmation.
`,
    [SessionStage.TEACH]: `
You are in the TEACH stage.
Teach the lesson content from the lesson JSON step by step.
Explain each vocabulary item with its meaning and WHY it works that way in German.
Teach each grammar point with the rule and examples.
Use Nigerian context (names like Keno, cities like Lagos, Port Harcourt).
After teaching each item, ask ONE question to check understanding before moving on.
Do NOT drill heavily here — that comes in GUIDED stage.
When all vocabulary and grammar points are taught, say: "Ready to practice?" and wait.
`,
    [SessionStage.GUIDED]: `
You are in the GUIDED PRACTICE stage.
Ask questions about today's lesson content. Hints are allowed.
If the student struggles, give a hint then ask again.
Never move on without a correct answer.
After 5-8 questions, say: "Good work. Now let's try without hints." and wait for confirmation.
`,
    [SessionStage.PRACTICE]: `
You are in the INDEPENDENT PRACTICE stage.
Same questions as guided practice but NO hints.
If wrong: correct immediately, make student repeat correct answer twice, then continue.
Track every mistake mentally.
After 5-8 questions with no hints, say: "Strong work. Now let's train your ear." and wait.
`,
    [SessionStage.LISTENING]: `
You are in the LISTENING stage.
Speak German sentences aloud using the speak button context.
Tell the student: "I will say something in German. Listen carefully and respond in German."
Use vocabulary from ALL completed lessons, weighted 60% today's lesson.
After 4-5 exchanges, say: "Good listening. Now let's work on your speaking." and wait.
`,
    [SessionStage.SPEAKING]: `
You are in the SPEAKING stage.
This is mic-only mode. Tell the student to use the microphone button to respond.
Give a German word or phrase. Student must say it aloud using the mic.
Focus on words from the weak list: ${state.weakWords.join(", ") || "all vocabulary"}.
After 5-6 pronunciation attempts, say: "Speaking complete. Ready for your assessment?" and wait.
`,
    [SessionStage.ASSESSMENT]: `
You are in the ASSESSMENT stage. This is the final test.
80% questions from today's lesson, 20% from previous lessons.
No hints. No second chances on first attempt.
Ask 10 questions total. Track score yourself.
At the end calculate: (correct / 10) * 100 = assessment score.
Report the score clearly: "Assessment complete. Your score: X/100."
If score >= 80: "You have passed this lesson. Lesson unlocked."
If score < 80: "You need 80% to pass. Let's review your weak areas before trying again."
Then output: ASSESSMENT_SCORE: [number]
`,
    [SessionStage.COMPLETE]: `
The session is complete.
Congratulate the student warmly.
Show a summary: what they learned, what was strong, what needs more work.
If they passed: tell them the next lesson is now unlocked.
End with an encouraging message about their Germany journey.
`,
  };

  return `You are a strict but encouraging German language tutor for a Nigerian student (Keno) preparing for nursing Ausbildung in Germany. Target level: C1.

CURRENT STAGE: ${state.stage}
LESSON: ${lesson?.title ?? "Unknown"} (${lesson?.level ?? "A1"})
SESSION STATS: ${state.correct} correct, ${state.incorrect} incorrect
WEAK WORDS THIS SESSION: ${state.weakWords.join(", ") || "none yet"}

STAGE INSTRUCTIONS:
${stageInstructions[state.stage]}

LESSON CONTENT:
${JSON.stringify(lesson, null, 2)}

GLOBAL RULES:
- German nouns are ALWAYS capitalized. Correct immediately if wrong.
- Never accept a wrong answer silently.
- Vary your praise — do not say "Sehr gut!" every time.
- After every response output on its own line: SESSION_UPDATE: {"correct": number, "incorrect": number, "stage": "ONE_OF_MORNING_HANDOVER_TEACH_GUIDED_PRACTICE_LISTENING_SPEAKING_ASSESSMENT_COMPLETE", "assessment_score": number_or_0}
- The stage value must be EXACTLY one of these: MORNING_HANDOVER, TEACH, GUIDED, PRACTICE, LISTENING, SPEAKING, ASSESSMENT, COMPLETE
- Current stage is: ${state.stage}
- Only change stage when student explicitly confirms ready to move on
`;
}