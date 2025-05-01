import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import QuizScreen from '../../../components/QuizScreen';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { getLessonProgress } from '../../../lib/schema';

export default function LessonPage() {
  const { sectionId, lessonId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [lessonIsUnlocked, setLessonIsUnlocked] = useState(false);

  useEffect(() => {
    const fetchLessonAccess = async () => {
      if (!lessonId || !sectionId) return;

      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw authError;

        // Get all lessons in section to find current and previous one
        const { data: lessons, error: lessonsError } = await supabase
          .from('lessons')
          .select('id, order_position')
          .eq('section_id', sectionId)
          .order('order_position', { ascending: true });

        if (lessonsError) throw lessonsError;

        const currentLesson = lessons.find(l => l.id === Number(lessonId));
        if (!currentLesson) throw new Error('Lesson not found');

        // Check if the current lesson has a progress record (for first lesson)
        const currentProgress = await getLessonProgress(user.id, currentLesson.id);

        // First lesson is unlocked if it has a progress record (created during registration)
        if (currentLesson.order_position === lessons[0].order_position) {
          setLessonIsUnlocked(true);
          setIsLoading(false);
          return;
        }

        // Find the previous lesson
        const previousLesson = lessons.find(l => l.order_position === currentLesson.order_position - 1);
        if (!previousLesson) {
          setLessonIsUnlocked(false);
          setIsLoading(false);
          return;
        }

        // Check if previous lesson was completed
        const prevProgress = await getLessonProgress(user.id, previousLesson.id);
        setLessonIsUnlocked(!!prevProgress?.completed);
      } catch (error) {
        console.error('Error fetching lesson access:', error.message);
        setLessonIsUnlocked(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonAccess();
  }, [sectionId, lessonId]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#555" />
        <Text className="mt-2 text-gray-500">Loading Filipino Sign Language...</Text>
      </View>
    );
  }

  if (!lessonIsUnlocked) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-center text-red-500 font-semibold">
          This lesson is locked. Complete the previous lesson to unlock it.
        </Text>
      </View>
    );
  }

  return <QuizScreen sectionId={sectionId} lessonId={lessonId} />;
}