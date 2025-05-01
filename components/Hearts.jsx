import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/FontAwesome';

export const useHeartSystem = (userId) => {
    const [hearts, setHearts] = useState(null);
    const [lastDecrement, setLastDecrement] = useState(null);
  
    const calculateHearts = async () => {
      if (!userId) return;
  
      const { data, error } = await supabase
        .from('user_hearts')
        .select('hearts, last_decrement')
        .eq('user_id', userId)
        .single();
  
      if (error || !data) {
        // First time user
        const { error: upsertError } = await supabase
          .from('user_hearts')
          .upsert({
            user_id: userId,
            hearts: 5,
            last_decrement: null,
          });
  
        if (!upsertError) setHearts(5);
        return;
      }
  
      let { hearts: currentHearts, last_decrement } = data;
      const now = new Date();
      const last = last_decrement ? new Date(last_decrement) : null;
  
      if (currentHearts < 5 && last) {
        const hoursPassed = (now - last) / (1000 * 60 * 60); // convert ms to hours
        const heartsToAdd = Math.floor(hoursPassed);
  
        if (heartsToAdd > 0) {
          const newHearts = Math.min(5, currentHearts + heartsToAdd);
          const newDecrementTime = new Date(last.getTime() + heartsToAdd * 3600000); // add hours passed
  
          await supabase
            .from('user_hearts')
            .upsert({
              user_id: userId,
              hearts: newHearts,
              last_decrement: newDecrementTime.toISOString(),
            });
  
          setHearts(newHearts);
          setLastDecrement(newDecrementTime);
          return;
        }
      }
  
      setHearts(currentHearts);
      setLastDecrement(last);
    };
  
    const decrementHearts = async () => {
      if (!userId || hearts <= 0) return;
  
      const newHearts = Math.max(hearts - 1, 0);
      const now = new Date();
  
      await supabase
        .from('user_hearts')
        .upsert({
          user_id: userId,
          hearts: newHearts,
          last_decrement: now.toISOString(),
        });
  
      setHearts(newHearts);
      setLastDecrement(now);
    };
  
    useEffect(() => {
      if (!userId) return;
  
      calculateHearts();
  
      const channel = supabase
        .channel('user_hearts')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_hearts',
          filter: `user_id=eq.${userId}`
        }, (payload) => {
          setHearts(payload.new.hearts);
          setLastDecrement(payload.new.last_decrement);
        })
        .subscribe();
  
      const interval = setInterval(calculateHearts, 120000); // every 2 minutes
  
      return () => {
        channel.unsubscribe();
        clearInterval(interval);
      };
    }, [userId]);
  
    return {
      hearts: hearts !== null ? hearts : 5,
      decrementHearts,
    };
  };

  
export const HeartDisplay = ({ hearts }) => (
  <View style={styles.container}>
    <Icon name="heart" size={24} color="#ef4444" />
    <Text style={styles.text}>{hearts}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row-reverse', 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    gap: 4,
    padding: 8,
  },
  text: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#ef4444',
    marginRight: 4
  }
});