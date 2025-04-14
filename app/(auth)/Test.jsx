import { View, Text, Image, Animated, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from "../../constants/images"
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'


const test = () => {
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

  return (
    <ScrollView>
      <SafeAreaView>
        <View className='w-full items-center min-h-[85vh] px-4 m'>
                      <Text className="font-Mextrabold text-violet-950 text-3xl text-center">
                        {steps[step].title}
                      </Text>
            
        <AnimatedProgressBar progress={(step + 1) / steps.length} />
           
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

export default test