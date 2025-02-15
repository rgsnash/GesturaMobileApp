import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';



import images from '@/constants/images';
import icons from '@/constants/icons'

const Register = () => {

  const [ form, setForm ] = useState({
    email:'',
    password: ''
  })

  const [isChecked, setIsChecked] = useState(false);

  const handleRegister = () => {
    if (!isChecked) {
      // If the terms and conditions are not agreed upon
      Alert.alert('Error', 'You must agree to the Terms and Conditions to register.');
    } else {
      // Proceed with registration
      router.push('/(quiz)/proficiencyTest');
    }
  };

  return (
   <SafeAreaView className='bg-gray h-full'>
    <ScrollView contentContainerStyle={{height: '100%'}}>
      <View className="justify-center items-center">
        <Image
        source={images.Students}
        className="w-[250px] h-[180px] mt-10"
        resizeMode='contain'
         />
       <Text className="font-Mextrabold text-violet-950 text-7xl text-center mt-5 mb-20"> GESTURA </Text>
      </View>
      <View className="absolute top-[340px] h-full w-full bg-violet-950 rounded-t">
        <Text className="font-Osregular text-3xl text-center text-gray-50 p-5"> REGISTRATION </Text>
      </View>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: string) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder={""}
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: string) => setForm({ ...form, password: e })}
            placeholder={""}
            otherStyles={""}
          />

        <View className="flex-row items-center mb-4 justify-center">
          <TouchableOpacity
            onPress={() => setIsChecked(!isChecked)}
            className={`w-5 h-5 rounded-full border-2 border-gray-100 ${isChecked ? 'bg-purple-800' : 'bg-white'}`}
          />
          <Text className="ml-2 text-sm text-gray-400 font-Oslight">
            I agree to the <Text className="text-gray-50">Terms and Conditions</Text>
          </Text>
        </View>

        <CustomButton
            title="Register"
            handlePress={handleRegister}
            containerStyles="w-[350px] ml-auto mr-auto"
            textStyles="text-2xl font-Osmedium text-gray-50 text-center"
          />

      <View className="flex-row items-center mb-4 m-5">
        <View className="flex-1 h-[1px] bg-gray-300" />
        <Text className="mx-2 text-gray-500 text-sm">WITH</Text>
        <View className="flex-1 h-[1px] bg-gray-300" />
      </View>

      <View className="flex-row justify-center">
        <Image 
          source={icons.google}
          className="w-[40px] h-[40px] mt-1"
          resizeMode='contain'
        />
        <Image 
          source={icons.fb}
          className="w-[50px] h-[45px]"
          resizeMode='contain'
        />
      </View>

      <Text className="mt-2">
          <Text className="text-center text-purple-400 font-Osregular ml-auto mr-auto">
                Already Have An Account?
          </Text>
      </Text>

      <TouchableOpacity onPress={handleRegister}>
         <Text className="text-gray-200 font-Osregular text-center text-decoration-line: underline
         ml-auto mr-auto mt-[-0.5%]">Log In</Text>
      </TouchableOpacity>

    </ScrollView>
    
   </SafeAreaView>
  );
};

export default Register;
