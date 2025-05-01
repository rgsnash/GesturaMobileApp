// app/(quiz)/_layout.js
import React from 'react';
import { Stack } from 'expo-router';

export default function QuizLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
