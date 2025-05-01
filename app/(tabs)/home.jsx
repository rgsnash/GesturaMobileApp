import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../../constants/images';
import CustomButton from '../../components/CustomButton';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';

const sectionId = 1;

const Home = () => {
  const [lessons, setLessons] = useState([]);
  const { refresh } = useLocalSearchParams();

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace('/(auth)/Login');
      return false;
    }
    return true;
  };

  const getCurrentUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  };

  const fetchLessons = async () => {
    try {
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select(`
          *,
          lesson_progress (
            completed,
            is_unlocked
          )
        `)
        .eq('section_id', sectionId)
        .order('order_position', { ascending: true });
  
      const transformedLessons = lessonsData.map(lesson => ({
        ...lesson,
        is_unlocked: lesson.lesson_progress[0]?.unlocked || false,
        progress: lesson.lesson_progress[0] || null,
      }));
  
      setLessons(transformedLessons);
    } catch (error) {
      console.error('Fetch error:', error.message);
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('lessons-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lesson_progress',
        },
        (payload) => {
          console.log('Change detected:', payload);
          fetchLessons();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch when screen focuses or refresh param changes
  useFocusEffect(
    useCallback(() => {
      fetchLessons();
    }, [refresh])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full items-center px-4">
          <Image
            source={images.logo}
            className="w-32 h-32"
            resizeMode="contain"
          />

          <CustomButton
            title="Section 1: Alphabets"
            variant="primary"
            handlePress={() => router.push('/(tabs)/bag')}
            containerStyles="rounded-lg h-[70px] w-full mb-8"
            textStyles="text-2xl font-Osmedium text-gray-50"
          />

          <View className="w-full">
            {lessons.map((lesson, index) => {
              const isCompleted = lesson.progress?.completed;
              const isFirstLesson = index === 0;
              const isUnlocked = lesson.is_unlocked || isFirstLesson;
  

              return (
                <View
                  key={lesson.id}
                  className={`mb-16 ${index % 2 === 0 ? 'items-start' : 'items-end'}`}
                >
                  {isFirstLesson && !isCompleted && (
                    <View className="mb-2 rounded-lg bg-gray-50 border border-purple-950 ml-4">
                      <Text className="font-Osbold text-lg text-purple-950 text-center px-8 py-1">
                        {isFirstLesson ? 'Start Here' : 'Continue Learning'}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      if (isUnlocked) {
                        router.push({
                          pathname: `/(quiz)/${sectionId}/${lesson.id}`,
                          params: { refresh: Date.now() },
                        });
                      }
                    }}
                    className={`p-2 ${index % 2 === 0 ? 'ml-4' : 'mr-4'}`}
                  >
                    <Image
                      source={
                        isCompleted
                          ? images.completed
                          : isUnlocked || isFirstLesson
                          ? images.Unlocked1
                          : images.locked
                      }
                      className="w-28 h-28"
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
    minHeight: '100%',
  },
});

export default Home;