import React from 'react';
import { Stack } from 'expo-router';

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen 
        name="(sectionOne)/lessonOne"
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="TestResult"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default _layout;
