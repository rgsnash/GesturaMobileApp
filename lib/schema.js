import { supabase } from './supabase'


/* ========== UNITS ========== */
export async function getUnits() {
  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .order('order_position')
  if (error) throw error
  return data
}

/* ========== LESSONS ========== */
export const getLessonsBySectionWithProgress = async (sectionId, userId) => {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*, lesson_progress:lesson_progress(completed)')
    .eq('section_id', sectionId)
    .eq('lesson_progress.user_id', userId)

  if (error) throw error
  return lessons
}


/* ========== CHALLENGES ========== */
export async function getChallengesByLesson(lessonId) {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_position')
  if (error) throw error
  return data
}

/* ========== CHALLENGE OPTIONS ========== */
export async function getOptionsByChallenge(challengeId) {
  const { data, error } = await supabase
    .from('challenge_options')
    .select('*')
    .eq('challenge_id', challengeId)
  if (error) throw error

  return data.map(option => ({
    ...option,
    image_src: supabase.storage
      .from('sign-alphabets')
      .getPublicUrl(option.image_src).data.publicUrl
  }));
}

/* ========== USER PROGRESS ========== */
export async function getUserProgress(userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) throw error
  return data
}

export async function updateUserProgress(userId, updates) {
  const { data, error } = await supabase
    .from('user_progress')
    .update(updates)
    .eq('user_id', userId)
  if (error) throw error
  return data
}

/* ========== LESSON PROGRESS ========== */
export async function getLessonProgress(userId, lessonId) {
  const { data, error } = await supabase
    .from('lesson_progress') // Match schema table name
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single();
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function upsertLessonProgress({ user_id, lesson_id, completed }) {
  const { data, error } = await supabase
    .from('lesson_progress')
    .upsert([
      { user_id, lesson_id, completed, updated_at: new Date().toISOString() }
    ])
    .select()
  if (error) throw error
  return data
}

/* ========== CHALLENGE PROGRESS ========== */
export async function getChallengeProgress(userId, challengeId) {
  const { data, error } = await supabase
    .from('challenge_progress')
    .select('*')
    .eq('user_id', userId) // Requires user_id column in schema
    .eq('challenge_id', challengeId)
    .single();
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function upsertChallengeProgress({ user_id, challenge_id, completed }) {
  const { data, error } = await supabase
    .from('challenge_progress')
    .upsert([
      { user_id, challenge_id, completed, updated_at: new Date().toISOString() }
    ])
    .select()
  if (error) throw error
  return data
}

export async function unlockNextLesson(currentLessonId, sectionId, userId) {
  try {
    const { data: currentLesson, error: currentError } = await supabase
      .from('lessons')
      .select('order_position')
      .eq('id', currentLessonId)
      .single();

    if (currentError || !currentLesson) throw currentError || new Error('Lesson not found');

    const { data: nextLesson, error: nextError } = await supabase
      .from('lessons')
      .select('id')
      .eq('section_id', sectionId)
      .gt('order_position', currentLesson.order_position)
      .order('order_position', { ascending: true })
      .limit(1)
      .single();

    if (nextError && nextError.code !== 'PGRST116') throw nextError;

    if (nextLesson) {
      const { data: existingProgress, error: checkError } = await supabase
        .from('lesson_progress')
        .select('user_id')
        .eq('user_id', userId)
        .eq('lesson_id', nextLesson.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (!existingProgress) {
        const { error: progressError } = await supabase
          .from('lesson_progress')
          .insert([
            {
              user_id: userId,
              lesson_id: nextLesson.id,
              completed: false,
              unlocked: true,
              updated_at: new Date().toISOString(),
            },
          ]);

        if (progressError) throw progressError;
      }
    }

    return nextLesson;
  } catch (error) {
    console.error('Unlock error:', error.message);
    return null;
  }
}
