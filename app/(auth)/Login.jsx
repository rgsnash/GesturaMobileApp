import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { router } from 'expo-router';
import images from '../../constants/images';
import icons from '../../constants/icons';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Session check and auth state management
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.replace('/(tabs)/home');
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) router.replace('/(tabs)/home');
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    if (!email?.trim() || !password?.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error('Login Error:', error.message);
        Alert.alert('Login Failed', error.message);
        return;
      }

      // Successful login handled by auth state change listener
    } catch (err) {
      console.error('Unexpected Error:', err);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccountPress = () => router.push('/Register');

  return (
    <SafeAreaView className="bg-gray h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="justify-center items-center">
          <Image
            source={images.Students}
            className=" w-[50%] h-[38%]"
            resizeMode="contain"
          />
          <Text className="font-Mextrabold text-violet-950 text-7xl text-center mt-5 mb-20">
            GESTURA
          </Text>
        </View>

        <View className="z-10 px-5 pt-[-5%]">
          <FormField
            title="Email"
            value={email}
            handleChangeText={setEmail}
            otherStyles="mt-3"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={password}
            handleChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)} 
            className="absolute right-5 top-[165px]"
          >
            <Image
              source={showPassword ? icons.eyehide : icons.eyeopen}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>

          <CustomButton
            title="LOG IN"
            handlePress={handleSignIn}
            containerStyles="w-full"
            textStyles="text-2xl font-Osmedium text-gray-50 text-center"
            isLoading={loading}
          />

          <View className="flex-row items-center my-4">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-2 text-gray-500 text-sm">OR</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          <View className="flex-row justify-center gap-4">
            <TouchableOpacity>
              <Image
                source={icons.google}
                className="w-[40px] h-[40px]"
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Image
                source={icons.fb}
                className="w-[45px] h-[45px]"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View className="mt-3 flex-row justify-center">
            <Text className="text-purple-400 font-Osregular">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleCreateAccountPress}>
              <Text className="text-gray-200 font-Osregular underline">
                Create New Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="absolute bottom-0 h-[55%] w-full bg-violet-950" />
      </ScrollView>
    </SafeAreaView>
  );
}
