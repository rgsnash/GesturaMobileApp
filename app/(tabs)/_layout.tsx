import { View, Text, Image} from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router'
import { icons } from '../../constants/'

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
                    tabBarIcon: ({ color, focused }) =>(
                        <TabIcon 
                            icon={icons.profile}
                            color={color}
                            name="profile"
                            focused={focused}/>
                    )
                }}/>
        </Tabs>
    </>
  )
}

export default TabsLayout