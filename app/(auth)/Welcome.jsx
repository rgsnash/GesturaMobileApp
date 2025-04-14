  import React, { useState, useEffect, useRef } from 'react';
  import { View, Text, Image, Animated, TouchableOpacity } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { useRouter } from 'expo-router';
  import { Audio } from 'expo-av';

  import CustomButton from '../../components/CustomButton';
  import images from '../../constants/images';
  import { Bell, Camera } from "lucide-react-native";
  import ConfettiCannon from "react-native-confetti-cannon";

  // Animated Progress Bar Component
  const AnimatedProgressBar = ({ progress }) => {
    const animatedWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(animatedWidth, {
        toValue: progress * 100,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }, [progress]);

    return (
      <View style={{ width: '90%', height: 8, backgroundColor: '#D9D9D9', borderRadius: 10, alignSelf: 'center', marginTop: 20 }}>
        <Animated.View style={{ width: animatedWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }), height: '100%', backgroundColor: '#3F2A7E', borderRadius: 10 }} />
      </View>
    );
  };


  export default function Welcome() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [showPermission, setShowPermission] = useState(null);
    const [selectedProficiency, setSelectedProficiency] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
      if (step === steps.length - 1) {
        setShowConfetti(true);
      }
    });

    const steps = [
      { title: "GESTURA", description: "I'll remind you to continue practicing Filipino Sign Language!", image: images.notifgirl, icon: <Bell size={25} color="#3F2A7E" />, isPermission: 'notifications', buttonText: "CONTINUE" },
      { title: "GESTURA", description: "Practice your Filipino sign language in real-time!", image: images.cameragirl, icon: <Camera size={25} color="#3F2A7E" />, isPermission: 'camera', buttonText: "CONTINUE" },
      { title: "GESTURA", description: "Here's how our camera recognition works.", image: images.didyouknow, showWaveMessage: true, buttonText: "CONTINUE" },
      { title: "GESTURA", description: "How much do you know about Filipino sign language?", image: images.questiongirl, isProficiencyScreen: true, buttonText: "CONTINUE" },
      { title: "GESTURA", description: "WELCOME! Are you ready to make a step to a more inclusive future? Let's start learning!", image: images.welcome, buttonText: "START" }
    ];

    const proficiencyLevels = ["I am new to FSL", "I know some sign words", "I can communicate in FSL"];

    const handleNext = () => {
      // Handle permissions first
      if (steps[step].isPermission) {
        console.log(`Requesting permission for ${steps[step].isPermission}`);
        setShowPermission(steps[step].isPermission);
        return;
      }

      // Ensure proficiency level is selected before proceeding
      if (steps[step].isProficiencyScreen && !selectedProficiency) {
        return;
      }

      if (step < steps.length - 1) {
        setStep(step + 1);
      } else {
        setShowConfetti(true);
        router.push('/Test'); // Redirect to Home
      }
    };

    return (
      <SafeAreaView className="bg-gray h-full">
        <View className="flex-1 px-5 pt-5">
          <Text className="font-Mextrabold text-violet-950 text-3xl text-center">
            {steps[step].title}
          </Text>

          {/* Animated Progress Bar */}
          <AnimatedProgressBar progress={(step + 1) / steps.length} />

          <View className="flex-row flex-1">
            {step !== steps.length - 1 ? (
              <>
                <Image 
                  source={steps[step].image} 
                  className="w-[130px] h-[120px] items-start mt-2" 
                  resizeMode="contain" 
                />
                <Text className="text-small text-start max-w-[60%] mt-8 font-OsSemibold text-violet-950">
                  {steps[step].description}
                </Text>
              </>
            ) : (
              <View className="items-center">
                <Image 
                  source={images.running} 
                  className="w-80 h-80 items-center mt-20"
                  resizeMode="contain"
                />
                <Text className="text-center font-Osbold text-violet-950 text-lg mt-4 px-10">
                  WELCOME! Are you ready to make a step to a more inclusive future? Let's start learning!
                </Text>
                {showConfetti && <ConfettiCannon count={200} origin={{ x: 200, y: 0 }} />}

              </View>
            )}
          </View>


           {/* Introduction of AI recognition */}
          {steps[step].description === "Here's how our camera recognition works." && (
            <View className=" absolute top-[30%] left-5 w-full h-[50%] bg-gray-80 border-2 border-b-4 active:border-b-2 border-slate-300 rounded-lg flex items-center justify-center">
              <Text className="text-gray-700">Camera Preview</Text>
            </View>
          )}
          {steps[step].showWaveMessage && (
            <Text className="text-center text-2xl text-violet-950 font-Osregular mt-2">
              Try to wave your hand ✋
            </Text>
          )}


           {/* Permission */}
          {steps[step].isPermission && (
          <View className="absolute top-0 left-5 w-full h-full flex items-center justify-center">
            <View className="w-80 p-6 bg-white rounded-lg shadow-lg">

            {steps[step].icon && <View className="mb-2">{steps[step].icon}</View>}

          <Text className="text-gray-700 text-center">
            Gestura wants to {steps[step].isPermission === 'notifications' ? 'show notifications' : 'access your camera'}
          </Text>
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity 
              className="px-4 py-2 border border-gray-400 rounded-md"
              onPress={() => setStep(step + 1)} 
            >
              <Text>BLOCK</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="px-4 py-2 bg-violet-700 rounded-md" 
              onPress={() => setStep(step + 1)} 
            >
              <Text className="text-white">ALLOW</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )}

       {/* User's Profeciency  */}
       {steps[step].isProficiencyScreen && (
            <View className=" absolute top-0 left-5 w-full h-full flex items-center justify-center mt-5">
              {proficiencyLevels.map((level) => (
                <CustomButton
                  key={level}
                  title={level}
                  handlePress={() => setSelectedProficiency(level)}
                  containerStyles={`p-5 mt-2 w-60 ${
                    selectedProficiency === level ? 'bg-violet-950' : 'bg-gray-250'
                  }`}
                  textStyles={`text-center text-lg font-Mextrabold ${
                    selectedProficiency === level ? 'text-white' : 'text-violet-950'
                  }`}
                />
              ))}
            </View>
          )}

          <View className="pb-10"> 
            <CustomButton 
              title={steps[step].buttonText} 
              handlePress={handleNext} 
              containerStyles="mt-5" 
              textStyles="text-2xl font-Osmedium text-violet-950"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
