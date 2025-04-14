import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to get the user's highest unlocked level
export const getUnlockedLevel = async () => {
  try {
    const storedLevel = await AsyncStorage.getItem('unlockedLevel');
    return storedLevel ? parseInt(storedLevel, 10) : 1; // Default to Level 1
  } catch (error) {
    console.error('Failed to get unlocked level:', error);
    return 1;
  }
};

// Function to unlock the next level
export const unlockNextLevel = async (currentLevel) => {
  try {
    const nextLevel = currentLevel + 1;
    await AsyncStorage.setItem('unlockedLevel', nextLevel.toString());
  } catch (error) {
    console.error('Failed to unlock level:', error);
  }
};
