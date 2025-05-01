import { View, Text, ScrollView, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from "../constants/images";
import CustomButton from '../components/CustomButton';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoreVertical } from 'lucide-react-native';
import { avatars } from '../constants/avatars';

export default function Index() {
  const router = useRouter();
  const [lastUser, setLastUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // Load cached user only (no redirect yet)
  useEffect(() => {
    const checkCachedUser = async () => {
      try {
        const cachedUser = await AsyncStorage.getItem('lastUser');
        if (cachedUser) {
          setLastUser(JSON.parse(cachedUser));
        }
      } catch (error) {
        console.error('Error loading cached user:', error);
      }
    };
    checkCachedUser();
  }, []);

  // Continue as the cached user if session matches
  const handleContinue = async () => {
    if (!lastUser) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user?.email === lastUser.email) {
        router.push('/(tabs)/home');
      } else {
        router.push({ pathname: '/(auth)/Login', params: { email: lastUser.email } });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify session');
    }
  };

  const handleRemoveAccount = () => {
    Alert.alert(
      "Remove Account",
      "This device will remove this account. Are you sure you want to remove your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('lastUser');
            setLastUser(null);
            setMenuVisible(false);
          }
        }
      ]
    );
  };

  const handleLoginAnotherAccount = async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem('lastUser');
      router.push('/(auth)/Login');
    } catch (error) {
      Alert.alert('Error', 'Could not log out properly');
    }
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  return (
    <SafeAreaView className="bg-gray h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className='w-full items-center min-h-[85vh] px-4'>
          <Image 
            source={images.logo}
            className="w-[120px] h-[80px] mt-15 mb-20"
            resizeMode="contain"
          />
          <Image
            source={images.Students}
            className="max-w-[280px] w-full max-h-[230px] mt-10"
            resizeMode='contain'
          />
          <Text className="text-2xl text-primary font-Osbold text-center mt-8 mb-10">
            Learn Filipino Sign Language For An Inclusive Future!
          </Text>

          {lastUser ? (
            <>
              <TouchableOpacity
                onPress={handleContinue}
                className="flex-row items-center bg-white border border-violet-950 rounded-2xl px-4 py-3 mt-2 w-[95%]"
              >
                <Image
                  source={lastUser?.avatar && avatars[lastUser.avatar] ? avatars[lastUser.avatar] : images.avatarPlaceholder}
                  className="w-12 h-12 rounded-full ml-3 mr-4 border border-violet-950 bg-gray-300"
                  resizeMode="cover"
                />

                <View>
                  <Text className="font-Mextrabold text-lg text-violet-950">{lastUser.username}</Text>
                  <Text className="text-sm text-gray-400">{lastUser.email}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setMenuVisible(true)}
                  className="ml-auto mr-2"
                >
                  <MoreVertical size={24} color="#999" />
                </TouchableOpacity>
              </TouchableOpacity>

              {/* Modal Menu */}
              <Modal
                visible={menuVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeMenu}
              >
                <TouchableOpacity 
                  style={{ flex: 1 }}
                  activeOpacity={1}
                  onPress={closeMenu}
                >
                  <View className="bg-black/30 flex-1 justify-center items-center">
                    <View className="bg-white rounded-xl w-72 overflow-hidden">
                      <TouchableOpacity
                        className="px-4 py-3 border-b border-gray-200"
                        onPress={handleRemoveAccount}
                      >
                        <Text className="text-red-500 font-Osbold text-center">Remove Account</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="px-4 py-3"
                        onPress={closeMenu}
                      >
                        <Text className="text-gray-500 font-Osbold text-center">Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Modal>

              <TouchableOpacity
                onPress={handleLoginAnotherAccount}
                className="flex-row items-center bg-gray-50 justify-center border-gray-300 border-b-4 rounded-2xl px-4 py-5 mb-2 mt-2 w-[95%]"
              >
                <Text className="font-Osbold text-xl text-gray-300">Log In Other Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/(auth)/Register')}
                className="flex-row items-center bg-gray-50 justify-center border-gray-300 border-b-4 rounded-2xl px-4 py-5 mb-6 mt-2 w-[95%]"
              >
                <Text className="font-Osbold text-xl text-gray-300">Create New Account</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <CustomButton
                title="Get Started"
                variant="primary"
                handlePress={() => router.push('/(auth)/Register')}
                containerStyles="w-full"
                textStyles="text-2xl font-Oswald-Medium text-gray-50"
              />

              <CustomButton
                title="I Have Already An Account"
                handlePress={() => router.push('/(auth)/Login')}
                containerStyles="w-full mt-5"
                textStyles="text-2xl font-Oswald-Medium text-violet-950"
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
