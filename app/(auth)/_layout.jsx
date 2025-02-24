import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { supabase } from '../../lib/gesturadb';

const AuthLayout = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });


    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <Stack>
      <Stack.Screen 
        name="Login"
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default AuthLayout;
