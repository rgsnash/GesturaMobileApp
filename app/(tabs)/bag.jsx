// Bag.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import CustomButton from '../../components/CustomButton'; // adjust path as needed
import { ProgressService } from '../src/services/ProgressService'; // adjust path as needed
import { router } from 'expo-router';

const FlashCard = ({ letter }) => (
  <View style={styles.card}>
    <Text style={styles.cardText}>{letter}</Text>
  </View>
);

const Bag = ({ navigation }) => {
  const [learnedLetters, setLearnedLetters] = useState([]);

  useEffect(() => {
    const fetchLearnedLetters = async () => {
      try {
        const progress = await ProgressService.getProgress();
        if (progress) {
          setLearnedLetters(progress.learnedLetters || []);
        }
      } catch (error) {
        console.error('Error fetching learned letters:', error);
      }
    };

    fetchLearnedLetters();
  }, []);

  const goBack = () => {
    // Use your navigation method (for example, using expo-router or React Navigation)
    // For example, if you're using react-navigation:
    if (navigation && navigation.goBack) {
      navigation.goBack();
    } else {
      console.log('Navigation not provided');
    }
  };

  return (
    <View style={styles.container}>
      <Text className="font-Mextrabold text-violet-950 text-3xl text-center mt-10">
                        GESTURA
                      </Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {learnedLetters.length > 0 ? (
          learnedLetters.map((letter, index) => (
            <FlashCard key={index} letter={letter} />
          ))
        ) : (
          <Text style={styles.noContentText}>No letters learned yet!</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#3F2A7E',
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#F3F4F6',
    width: 100,
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    elevation: 3,
  },
  cardText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3F2A7E',
  },
  noContentText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 50,
  },
  buttonContainer: {
    alignItems: 'center',
  },
});

export default Bag;
