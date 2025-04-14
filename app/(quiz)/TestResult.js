import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CustomButton from '../../components/CustomButton';
import ConfettiCannon from "react-native-confetti-cannon";
import { ProgressService } from '../src/services/ProgressService';
import images from '../../constants/images';

const TestResult = () => {
  const params = useLocalSearchParams();
  const { score, totalQuestions, quizId } = params;
  const [showConfetti, setShowConfetti] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  
  // Convert params safely with validation
  const numericScore = Math.max(0, Math.min(Number(score) || 0, Number(totalQuestions) || 1));
  const numericTotal = Math.max(1, Number(totalQuestions) || 1);
  const percentage = (numericScore / numericTotal) * 100;
  const passed = percentage >= 50;

  useEffect(() => {
    const handleProgress = async () => {
      try {
        setIsProcessing(true);
        
        if (passed) {
          setShowConfetti(true);
          
          // Save progress using ProgressService
          await ProgressService.saveQuizResult({
            quizId: Number(quizId),
            score: numericScore,
            total: numericTotal,
            passed: true
          });

          // Unlock next level
          await ProgressService.unlockLevel(Number(quizId) + 1);
        }

        // Clear current quiz attempt from storage
        await ProgressService.clearCurrentAttempt();
      } catch (error) {
        console.error('Progress handling failed:', error);
      } finally {
        setIsProcessing(false);
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
      }
    };

    if (quizId) handleProgress();
  }, [passed, quizId]);

  const handleNavigation = async () => {
    if (isProcessing) return;
    
    if (passed) {
      router.replace('/(tabs)/home'); // Use replace instead of push
    } else {
      router.replace({
        pathname: '/quiz',
        params: { quizId }
      });
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-5">
      <Text className="font-Mextrabold text-violet-950 text-3xl text-center mb-8">
        GESTURA
      </Text>
      
      <Image 
        source={passed ? images.celebrate : images.tryAgain} 
        className="w-72 h-72"
        resizeMode="contain"
      />

      <View className="items-center mt-8">
        <Text className="font-Osbold text-violet-950 text-3xl mb-2">
          {passed ? "🎉 CONGRATULATIONS!" : "😢 TRY AGAIN!"}
        </Text>
        
        <Text className="font-Osmedium text-gray-600 text-xl">
          {passed ? "You've unlocked the next level!" : "Keep practicing to unlock the next level"}
        </Text>

        <View className="bg-violet-100 rounded-lg p-4 mt-6">
          <Text className="font-Osbold text-violet-950 text-xl text-center">
            Score: {Math.round(percentage)}% 
          </Text>
          <Text className="font-Osmedium text-gray-600 text-center">
            ({numericScore} out of {numericTotal} correct)
          </Text>
        </View>
      </View>

      <View className="absolute bottom-8 w-full px-4">
        <CustomButton 
          title={passed ? "Continue Learning" : "Retry Quiz"} 
          handlePress={handleNavigation}
          disabled={isProcessing}
          containerStyles={`w-full ${passed ? 'bg-purple-950' : 'bg-red-600'} ${
            isProcessing ? 'opacity-75' : ''
          }`}
          textStyles="text-lg font-Osbold text-white"
          icon={passed ? "book" : "repeat"}
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