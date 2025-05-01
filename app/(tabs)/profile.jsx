import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { avatars } from '../../constants/avatars'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ProfileScreen() {
  const [profile, setProfile] = useState({ username: '', avatar: 'def-avatar' })
  const router = useRouter()

  useFocusEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar')
          .eq('id', user.id)
          .single()
        if (!error && data) {
          // Add fallback for avatar
          setProfile({
            username: data.username,
            avatar: data.avatar || 'def-avatar'
          })
        }
      }
    }
    fetchProfile()
  })


  return (
    <View className="flex-1 bg-white">
      {/* Header Section */}
      <View className="w-full items-center mt-12 pb-4">
        <Text className="text-3xl font-Mextrabold text-violet-950">
          GESTURA
        </Text>
      </View>

      {/* Centered Content */}
      <View className="flex-1 justify-center items-center">
        <Image
          source={avatars[profile.avatar]}
          className="w-40 h-40 mb-4"
          resizeMode="contain"
        />
        <Text className="text-3xl font-Osbold text-purple-950 mb-6">
          {profile.username}
        </Text>

        <TouchableOpacity
          className="bg-purple-900 border-collapse border-b-4 border-purple-950 py-3 px-32 rounded-xl mb-4"
          onPress={() => router.push('/profile-content/EditProfile')}
        >
          <Text className="text-white text-2xl font-Osbold">Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-200 border-collapse border-b-4 border-gray-400 py-3 px-32 rounded-xl mb-4"
          onPress={() => {
            Alert.alert(
              "Confirm Logout",
              "Are you sure you want to log out?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Log Out",
                  style: "destructive",
                  onPress: async () => {
                    // 1) fetch email
                    const {
                      data: { user }
                    } = await supabase.auth.getUser();
        
                    // 2) save username, email, avatar key
                    await AsyncStorage.setItem(
                      'lastUser',
                      JSON.stringify({
                        username: profile.username,
                        email: user.email,
                        avatar: profile.avatar
                      })
                    );
        
                    const { error } = await supabase.auth.signOut();
                    if (!error) {
                      router.replace('/');
                    } else {
                      console.error('Logout failed', error.message);
                    }
                  }
                }
              ]
            );
          }}
        >
          <Text className="text-gray-400 text-2xl font-Osbold">LOG OUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}