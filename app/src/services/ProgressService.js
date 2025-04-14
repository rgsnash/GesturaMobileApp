import AsyncStorage from '@react-native-async-storage/async-storage';

// Key constants for AsyncStorage
const PROGRESS_KEY = '@user_progress';
const UNLOCKED_LEVELS_KEY = '@unlocked_levels';

export const ProgressService = {
  // Initialize user progress
  async initializeUser() {
    try {
      const existingProgress = await AsyncStorage.getItem(PROGRESS_KEY);
      if (!existingProgress) {
        await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify({
          currentLevel: 1,
          completedQuizzes: [],
          learnedLetters: []
        }));
      }
    } catch (error) {
      console.error('Error initializing user:', error);
    }
  },

  // Get current progress
  async getProgress() {
    try {
      const progress = await AsyncStorage.getItem(PROGRESS_KEY);
      return progress ? JSON.parse(progress) : null;
    } catch (error) {
      console.error('Error getting progress:', error);
      return null;
    }
  },

  // Unlock new level
  async unlockLevel(levelNumber) {
    try {
      const unlocked = await AsyncStorage.getItem(UNLOCKED_LEVELS_KEY);
      const unlockedLevels = unlocked ? JSON.parse(unlocked) : [1];
      
      if (!unlockedLevels.includes(levelNumber)) {
        const updatedLevels = [...unlockedLevels, levelNumber];
        await AsyncStorage.setItem(UNLOCKED_LEVELS_KEY, JSON.stringify(updatedLevels));
      }
    } catch (error) {
      console.error('Error unlocking level:', error);
    }
  },

  // Check if level is unlocked
  async isLevelUnlocked(levelNumber) {
    try {
      const unlocked = await AsyncStorage.getItem(UNLOCKED_LEVELS_KEY);
      const unlockedLevels = unlocked ? JSON.parse(unlocked) : [1];
      return unlockedLevels.includes(levelNumber);
    } catch (error) {
      console.error('Error checking level:', error);
      return false;
    }
  },

  // Add learned letters after quiz completion
  async addLearnedLetter(letter) {
    try {
      const progress = await AsyncStorage.getItem(PROGRESS_KEY);
      let progressData = progress ? JSON.parse(progress) : { 
        currentLevel: 1, 
        completedQuizzes: [], 
        learnedLetters: [] 
      };
      
      if (!progressData.learnedLetters.includes(letter)) {
        progressData.learnedLetters.push(letter);
      }
      
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progressData));
    } catch (error) {
      console.error('Error adding learned letter:', error);
    }
  }
};