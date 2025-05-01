import { View, Text, Animated, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import QuestionFactory from '../../components/questions/QuestionFactory';
import images from '../../constants/images';
import BottomActionArea from '../../components/BottomAction';
import ConfettiCannon from "react-native-confetti-cannon";

const quizSteps = [
  {
    type: "multiple-choiceOne",
    question: "Select the Filipino sign language for A",
    image: images.questiongirl,
    options: [images.notifgirl , images.cameragirl, images.questiongirl, images.cameragirl],
    correctIndex: [3],
  },
  {
    type: "multiple-choiceTwo",
    question: "Select the correct letter for this sign",
    image: images.cameragirl,
    quizImage: images.cameragirl,
    options: ["Aa", "Bb", "0a", "As"],
    correctIndex: [1],
  },
  {
    type: "multiple-choicethree",
    image: images.notifgirl,
    question: "What letters were shown in the video?",
    options: ["A", "B", "S", "C", "D"],
    correctIndex: [0, 1], 
     
    // videoSource: require('./assets/videos/letter-ab.mp4'), // Local video
    // For remote videos: { uri: 'https://your-video-url.mp4' }
  }
];

const Test = () => {
  const router = useRouter(); 
  const params = useLocalSearchParams();
  const quizId = 1;
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const [showConfetti, setShowConfetti] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); 
  
      useEffect(() => {
        if (step === quizSteps.length - 1) {
          setShowConfetti(true);
          setTimeout(() => {
            setShowConfetti(false);
          }, 7000);
        }
      }, [step]);
  

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: ([step + 1] / quizSteps.length) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  });

  const handleAnswer = (index) => {
    if (showFeedback) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    const correct = quizSteps[step].correctIndex.includes(selectedOption);
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
    setShowFeedback(true);
  };

  const handleContinue = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      setShowFeedback(false);
      setSelectedOption(null);
      
      if (step < quizSteps.length - 1) {
        setStep(prev => prev + 1);
      } else {
        // Save attempt and navigate to results
        await ProgressService.saveQuizAttempt({
          quizId,
          score,
          total: quizSteps.length
        });

        router.replace({
          pathname: '/(quiz)/TestResult',
          params: {
            score,
            totalQuestions: quizSteps.length,
            quizId
          }
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <View className="flex-1">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 120 }}>
        <SafeAreaView>
          <View className="items-center">
            {step < quizSteps.length ? (
              <>
                <Text className="font-Mextrabold text-violet-950 text-3xl text-center mt-10">
                  GESTURA
                </Text>
                
                <View style={{ width: '90%', height: 8, backgroundColor: '#D9D9D9', borderRadius: 10, marginBottom: 10, marginTop: 10 }}>
                  <Animated.View style={{ 
                    width: animatedWidth.interpolate({ 
                      inputRange: [0, 100], 
                      outputRange: ['0%', '100%'] 
                    }), 
                    height: '100%', 
                    backgroundColor: '#3F2A7E', 
                    borderRadius: 10 
                  }} />
                </View>

                <QuestionFactory
                  type={quizSteps[step].type}
                  question={quizSteps[step].question}
                  options={quizSteps[step].options}
                  image={quizSteps[step].image}
                  quizImage={quizSteps[step].quizImage}
                  correctIndex={quizSteps[step].correctIndex}
                  selectedOption={selectedOption}
                  showFeedback={showFeedback}
                  onSelect={handleAnswer}
                />
              </>
            ) : (
              <>
                <Text className="font-Mextrabold text-violet-950 text-3xl text-center mt-10">
                  Quiz Complete 🎉
                </Text>
                <Text className="text-center text-lg mt-4 text-gray-700">
                  You got {score} out of {quizSteps.length} correct.
                </Text>
  
                <CustomButton
                  title="Continue"
                  onPress={() => {
                    setStep(0);
                    setScore(0);
                    setSelectedOption(null);
                    setShowFeedback(false);
                  }}
                  containerStyles="mt-6"
                />
              </>
            )}
          
          </View>
        </SafeAreaView>
      </ScrollView>

          <BottomActionArea
            step={step}
            quizSteps={quizSteps}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
            selectedOption={selectedOption}
            handleSubmit={handleSubmit}
            handleContinue={handleContinue}
            />
    </View>
  );

};

export default Test;
