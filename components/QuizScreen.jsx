import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { upsertLessonProgress, unlockNextLesson } from '../lib/schema'
import ConfettiCannon from 'react-native-confetti-cannon';
import { useHeartSystem as useHearts, HeartDisplay } from './Hearts'

import QuestionFactory from '../components/questions/QuestionFactory';
import BottomActionArea from '../components/BottomAction';

const QuizScreen = ({ lessonId, sectionId }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Add this useEffect to get user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const { hearts, decrementHearts } = useHearts(user?.id);

  const [step, setStep] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [status, setStatus] = useState('none');
  const [showConfetti, setShowConfetti] = useState(false);
  const [challenges, setChallenges] = useState([]);

  const progressAnim = useRef(new Animated.Value(0)).current;

  const currentChallenge = challenges[step];
  const correctOption = currentChallenge?.challenge_options.find(o => o.correct);

  useEffect(() => {
    const fetchChallenges = async () => {
      if (!lessonId) {
        console.warn('Missing lessonId. Skipping fetch.');
        return;
      }
      try {
        const { data, error } = await supabase
          .from('challenges')
          .select('*, challenge_options(*)')
          .eq('lesson_id', lessonId)
          .order('order_position', { ascending: true });

        if (error) throw error;
        setChallenges(data);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    };

    fetchChallenges();
  }, [lessonId]);

  useEffect(() => {
    if (challenges.length) {
      Animated.timing(progressAnim, {
        toValue: ((step + 1) / challenges.length) * 100,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [step, challenges]);

  const handleSelect = (id) => {
    if (status !== 'none') return;
    setSelectedOption(id);
  };

  const handleSubmit = async () => { // Make async
    if (!selectedOption || !currentChallenge || status !== 'none') return;
  
    if (correctOption?.id === selectedOption) {
      setStatus('correct');
      setCorrectAnswers(prev => prev + 1);
    } else {
      // Prevent losing hearts if already at 0
      if (hearts > 0) {
        await decrementHearts(); // Wait for decrement to complete
      }
      setStatus('wrong');
      
      // Optional: Handle zero hearts scenario
      // if (hearts === 1) { // Was about to lose last heart
      //   router.replace('/hearts-empty-screen'); // Or your custom handler
      // }
    }
  };


  const handleContinue = async () => {
    if (!selectedOption || !currentChallenge) return;

    setSelectedOption(null);
    setStatus('none');

    if (step < challenges.length - 1) {
      setStep(prev => prev + 1);
      return;
    }

    // If user finishes all challenges
    setShowConfetti(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw userError;

      const finalScore = (correctAnswers / challenges.length) * 100;
      const passed = finalScore >= 50;

      if (passed) {
        await upsertLessonProgress({ user_id: user.id, lesson_id, completed: true });
        await unlockNextLesson(lessonId, sectionId);
      }
      
      router.replace({
        pathname: '/(quiz)/TestResult',
        params: {
          score: correctAnswers,
          totalQuestions: challenges.length,
          lessonId,
          sectionId,
        },
      });

    } catch (error) {
      console.error('Completion error:', error);
      router.replace({
        pathname: '/(quiz)/TestResult',
        params: {
          score: correctAnswers,
          totalQuestions: challenges.length,
          lessonId,
          sectionId,
        },
      });
    }
  };

  if (!challenges.length || !currentChallenge) return null;

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView className="px-4" contentContainerStyle={{ paddingBottom: 100 }}>
          <Text className="text-3xl font-Mextrabold text-center mt-10 text-violet-950">
            GESTURA
          </Text>

          <HeartDisplay hearts={hearts} />

          {/* Progress Bar */}
          <View style={{ width: '90%', height: 8, backgroundColor: '#D9D9D9', borderRadius: 10, alignSelf: 'center', marginVertical: 10 }}>
            <Animated.View
              style={{
                width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
                height: '100%',
                backgroundColor: '#3F2A7E',
                borderRadius: 10,
              }}
            />
          </View>

          {/* Question */}
          <QuestionFactory
            type={currentChallenge.type}
            question={currentChallenge.question}
            options={currentChallenge.challenge_options}
            image={currentChallenge.image_src}
            correctOptions={[correctOption?.id]}
            selectedOption={selectedOption}
            showFeedback={status !== 'none'}
            onSelect={handleSelect}
          />
        </ScrollView>

        {/* Bottom Area */}
        <BottomActionArea
          step={step}
          quizSteps={challenges}
          showFeedback={status !== 'none'}
          isCorrect={status === 'correct'}
          selectedOption={selectedOption}
          handleSubmit={handleSubmit}
          handleContinue={handleContinue}
        />

        {showConfetti && (
          <ConfettiCannon count={100} origin={{ x: -10, y: 0 }} />
        )}
      </SafeAreaView>
    </View>
  );
};

export default QuizScreen;
