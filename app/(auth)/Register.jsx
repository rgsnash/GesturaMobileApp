import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { supabase } from '../../lib/supabase';
import images from '../../constants/images';

export default function Register() {
  
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!isChecked) {
      Alert.alert('Error', 'You must agree to the Terms and Conditions.');
      return;
    }
  
    if (!form.email.trim() || !form.password.trim() || !form.username.trim()) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
  
    setLoading(true);

    // Check if username already exists
const { data: existingUser, error: usernameError } = await supabase
.from('profiles')
.select('id')
.eq('username', form.username.trim())
.maybeSingle();

if (usernameError) throw usernameError;

if (existingUser) {
Alert.alert('Error', 'Username is already taken.');
setLoading(false);
return;
}

  
    try {
      // Step 1: Sign up with Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password.trim(),
        options: {
          data: { username: form.username.trim() },
        },
      });
  
      if (signUpError) throw signUpError;
  
      // Step 2: Insert into 'profiles' table
      const userId = signUpData.user?.id;
  
      if (!userId) throw new Error('User ID not returned');
  
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email: form.email.trim(),
            username: form.username.trim(),
          },
        ]);
  
        if (profileError) {
          console.error('Profile Insert Error:', profileError);
          throw profileError;
        }
  
      // Step 3: Unlock the first lesson in section 1
      const { data: firstLesson, error: lessonError } = await supabase
        .from('lessons')
        .select('id')
        .eq('section_id', 1)
        .order('order_position', { ascending: true })
        .limit(1)
        .single();
  
        if (lessonError) {
          console.error('Lesson Fetch Error:', lessonError);
          throw lessonError;
        }

        if (!firstLesson) throw new Error('No lessons found in section 1');
  
      // Check if progress already exists
      const { data: existingProgress, error: checkError } = await supabase
      .from('lesson_progress')
      .select('user_id, lesson_id')
      .eq('user_id', userId)
      .eq('lesson_id', parseInt(firstLesson.id, 10)) 
      .maybeSingle();
    
    if (checkError) throw checkError;if (checkError) {
      console.error('Error fetching lesson progress:', checkError);
      return;
    }
    
    
    if (!existingProgress) {
      // Insert new progress if it doesn't exist
      const { error: progressError } = await supabase
        .from('lesson_progress')
        .insert([
          {
            user_id: userId,
            lesson_id: firstLesson.id,
            completed: false,
            unlocked: true,
            updated_at: new Date().toISOString(),
          },
        ]);
    
      if (progressError) throw progressError;
    }

  
      // Success
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(auth)/Welcome');
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert('Error', error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-gray h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="justify-center items-center">
          <Text className="font-Mextrabold text-violet-950 text-7xl text-center mt-20">
            GESTURA
          </Text>
        </View>

        <View className="absolute top-[200px] h-full w-full bg-violet-950 rounded-t">
          <Text className="font-Osbold text-3xl text-center text-gray-50 p-5 mt-3">
            REGISTRATION
          </Text>
          
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-5 top-[240px]">
            <Image
              source={showPassword ? images.eyehide : images.eyeopen}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View className="flex-row items-center mb-4 justify-center">
            <TouchableOpacity
              onPress={() => setIsChecked(!isChecked)}
              className={`w-4 h-4 rounded-full border-2 border-gray-100 ${
                isChecked ? 'bg-purple-800' : 'bg-white'
              }`}
            />
            <Text className="ml-1 text-sm text-gray-400 font-Oslight">
              I agree to the <Text className="text-gray-50">Terms and Conditions</Text>
            </Text>
          </View>

          <CustomButton
            title="Register"
            handlePress={handleRegister}
            containerStyles="w-[350px] ml-5"
            textStyles="text-2xl font-Osmedium text-gray-50 text-center"
            isLoading={loading}
          />

          <View className="justify-center items-center">
            <Text className="mt-2">
              <TouchableOpacity onPress={() => router.push('/Login')}>
                <Text className="text-gray-200 font-Osregular text-decoration-line: underline">
                  I Have Account
                </Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
