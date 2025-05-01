import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { avatars } from '../../constants/avatars'
import { useRouter } from 'expo-router'

export default function EditProfileScreen() {
  const [username, setUsername] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('def-avatar')
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('username, avatar')
          .eq('id', user.id)
          .single()

        if (data) {
          setUsername(data.username)
          // Add fallback for avatar
          setSelectedAvatar(data.avatar || 'def-avatar')
        }
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        username,
        avatar: selectedAvatar,
        updated_at: new Date(),
      })
      
      if (error) {
        alert('Update failed: ' + error.message)
        return
      }
      
      // Force immediate refresh
      router.replace('/profile')
      router.back()
    }
  }

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-3xl mt-10 font-Osbold text-purple-950 text-center mb-20">Edit Profile</Text>

      <View className="flex-row justify-center mb-6">
        <Image
          source={avatars[selectedAvatar]}
          className="w-40 h-40"
          resizeMode="contain"
        />
      </View>

      <TextInput
        className="border-b-2 border-purple-950 font-Osregular text-2xl text-purple-700 w-full text-center mb-6"
        value={username}
        onChangeText={setUsername}
        placeholder={username}
      />

      <Text className="text-center  text-xl font-Osmedium text-purple-950 mb-4">Select Avatar</Text>
      <View className="flex-row flex-wrap justify-center">
        {Object.keys(avatars).map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => setSelectedAvatar(key)}
            className={`m-2 p-2 ${selectedAvatar === key ? 'border-2 border-purple-800' : ''}`}
          >
            <Image source={avatars[key]} className="w-20 h-20" resizeMode="contain" />
          </TouchableOpacity>
        ))}
      </View>
       <View className="bottom-safe-or-0 left-0 right-0 pb-11 pt-12">
      <TouchableOpacity
        className="absolute bg-purple-950 bottom-safe-or-0 left-0 right-0 pb-3 pt-3 border-b-4 border-gray-300 rounded-full my-0"
        onPress={handleSave}
      >
        <Text className="text-white font-Osbold text-2xl text-center">SAVE</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
