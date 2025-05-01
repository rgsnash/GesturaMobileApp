import React, { useEffect, useState } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CustomButton from '../../components/CustomButton';
import ConfettiCannon from "react-native-confetti-cannon";
import images from '../../constants/images';
import { supabase } from '../../lib/supabase';

const TestResult = () => {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);

  const { 
    score, 
    totalQuestions, 
    lessonId, 
    sectionId,
    hearts // Hearts passed from the previous screen
  } = useLocalSearchParams();

  const percentage = (Number(score) / Number(totalQuestions)) * 100;
  const passed = percentage >= 50;

  useEffect(() => {
    const handleProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Existing challenge progress update
        const { error } = await supabase.from('challenge_progress').upsert({
          // ... existing upsert logic
        });

        if (passed) {
          // Mark CURRENT lesson as completed
          const { data: lessonProgressData, error: lessonProgressError } = await supabase
              .from('lesson_progress')
              .upsert({
                user_id: user.id,
                lesson_id: lessonId,
                completed: true
              }, { onConflict: 'user_id, lesson_id' });

            if (lessonProgressError) {
              console.error('Lesson Progress Upsert Error:', lessonProgressError);
            } else {
              console.log('Lesson Progress Upsert Success:', lessonProgressData);
            }

  
          // Unlock next lesson
          const { data: currentLesson } = await supabase
            .from('lessons')
            .select('section_id, order_position')
            .eq('id', lessonId)
            .single();
  
          if (currentLesson) {
            const { data: nextLesson } = await supabase
              .from('lessons')
              .select('id')
              .eq('section_id', currentLesson.section_id)
              .gt('order_position', currentLesson.order_position)
              .order('order_position', { ascending: true })
              .limit(1)
              .single();
  
            if (nextLesson) {
              await supabase
                .from('lessons')
                .update({ is_unlocked: true })
                .eq('id', nextLesson.id);

                console.log('Next lesson unlocked:', nextLesson.id);
            }
          }
        }
      } catch (error) {
        console.error('Progress update error:', error);
      }
    };
  
    handleProgress();
  }, [lessonId, passed, percentage]);

  const handleNavigation = () => {
    router.push('/(tabs)/home');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Text className="text-3xl font-Mextrabold text-center mt-10 text-violet-950">GESTURA</Text>
      
      <Image 
        source={passed ? images.celebrate : images.tryagain} 
        className="w-60 h-60 self-center mt-20"
        resizeMode="contain"
      />

      <View className="items-center mt-8">
        <Text className="font-Osbold text-violet-950 text-3xl mb-2">
          {passed ? "🎉 CONGRATULATIONS!" : "Next Time, We got this!"}
        </Text>
        
        <Text className="font-Osmedium text-gray-600 text-xl">
          {passed ? "You've unlocked the next level!" : "Keep practicing to unlock the next level"}
        </Text>

        <View className="relative bg-violet-100 w-full rounded-lg p-4 mt-3">
          <Text className="font-Osbold text-violet-950 text-xl text-center">
            Score: {Math.round(percentage)}% 
          </Text>
          <Text className="font-Osmedium text-gray-600 text-center">
            ({score} out of {totalQuestions} correct)
          </Text>
        </View>
      </View>

      <View className="absolute bottom-8 w-full px-4">
        <CustomButton 
          title="CONTINUE"
          handlePress={handleNavigation}
          disabled={isProcessing}
          containerStyles="w-full bg-purple-950"
          textStyles="font-Osbold text-white"
        />
        
        {showConfetti && (
          <ConfettiCannon 
            count={300} 
            origin={{ x: -10, y: 0 }}
            fadeOut={true}
            explosionSpeed={350}
            colors={['#4F46E5', '#10B981', '#EF4444', '#FBBF24']}
          />
        )}
      </View>
    </View>
  );
};

export default TestResult;