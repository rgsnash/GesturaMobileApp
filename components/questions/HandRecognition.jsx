import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

// Make sure this is a default export
const HandRecognition = ({ question, onSignDetected }) => {
  const cameraRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);

  // Safe camera type access
  const cameraType = Camera?.Constants?.Type?.front || 'front';

  const takePicture = async () => {
    if (!cameraReady || !cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync();
      console.log('Photo captured:', photo.uri);
      
      // Simulate sign detection
      setTimeout(() => {
        if (onSignDetected) {
          onSignDetected("Hello"); // Mock detection
        }
      }, 1000);
      
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question}</Text>
      
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        onCameraReady={() => setCameraReady(true)}
      />
      
      <TouchableOpacity
        style={[
          styles.captureButton,
          !cameraReady && styles.disabledButton
        ]}
        onPress={takePicture}
        disabled={!cameraReady}
      >
        <Text style={styles.buttonText}>
          {cameraReady ? 'Capture Sign' : 'Loading Camera...'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#3F2A7E'
  },
  camera: {
    width: '100%',
    aspectRatio: 3/4,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden'
  },
  captureButton: {
    backgroundColor: '#3F2A7E',
    padding: 15,
    borderRadius: 10,
    minWidth: '80%',
    alignItems: 'center'
  },
  disabledButton: {
    opacity: 0.6
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  }
});

// Default export is crucial
export default HandRecognition;