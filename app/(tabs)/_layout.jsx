import { View, Text, Image} from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router'
import { icons } from '../../constants/'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import {avatars} from '../../constants/avatars'
import { useFocusEffect } from '@react-navigation/native'

const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View  className="flex justify-center items-center w-full h-full py-4 mt-5">
            <Image 
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className="w-10 h-10"
            />
        </View>
    )
}



const TabsLayout = () => {
    const [avatarKey, setAvatarKey] = useState('def-avatar')
  
    useFocusEffect(
        React.useCallback(() => {
          const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
              const { data, error } = await supabase
                .from('profiles')
                .select('avatar')
                .eq('id', user.id)
                .single()
      
              if (!error && data) {
                const validKey = avatars[data.avatar] ? data.avatar : 'def-avatar'
                setAvatarKey(validKey)
              }
            }
          }
      
          fetchProfile()
      
          return () => {}  // <--- Return a cleanup function or nothing
        }, [])
      )


  const ProfileTabIcon = ({ color }) => (
    <View className="flex justify-center items-center w-full h-full py-2 mt-5">
      <Image
        source={avatars[avatarKey] || avatars.def_avatar}
        resizeMode="contain"
        className="w-10 h-10 rounded-full"
        style={{ tintColor: color }}
      />
    </View>
  )

  return (
    <>
        <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: '#2F265A',
                    tabBarInactiveTintColor: '#A7A6A8',
                    tabBarStyle: {
                        backgroundColor: '#FCFCFC',
                        borderTopWidth: 2,
                        height: 60,
                        alignContent: 'center',
                        paddingBottom: 10,
                    }
                }}>
            <Tabs.Screen 
                name='home'
                options={{
                    title: 'HOME',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) =>(
                        <TabIcon 
                            icon={icons.home}
                            color={color}
                            name="HOME"
                            focused={focused}/>
                    )
                }}/>

                <Tabs.Screen 
                name='bag'
                options={{
                    title: 'bag',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) =>(
                        <TabIcon 
                            icon={icons.bag}
                            color={color}
                            name="bag"
                            focused={focused}/>
                    )
                }}/>

                <Tabs.Screen 
                name='profile'
                options={{
                    title: 'profile',
                    headerShown: false,
                    tabBarIcon: ({}) =>(
                        <ProfileTabIcon />
                    )
                }}/>
        </Tabs>
    </>
  )
}

export default TabsLayout