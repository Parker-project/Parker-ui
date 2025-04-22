import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { styles } from '../constants/styles';

const mockImage = require('../assets/license_plate_placeholder.jpeg'); // replace with actual image

export default function ReportSubmissionScreen() {
    const [photoUri, setPhotoUri] = useState(null);
    const [licensePlate, setLicensePlate] = useState('');
    const [location, setLocation] = useState('Fetching location...');
  
    useEffect(() => {
      // Simulate dummy API call for license plate
      setTimeout(() => setLicensePlate('69-222-58'), 500);
      // Placeholder for GPS data
      setLocation('Latitude: --., Longitude: --.');
    }, []);
  
    const handleTakePhoto = () => {
      console.log('Photo taken');
      setPhotoUri(mockImage);
    };
  
    const handleRetake = () => {
      console.log('Retake pressed');
      setPhotoUri(null);
    };
  
    const handleCancel = () => {
      console.log('Cancel pressed');
      // TODO: navigation.goBack()
    };
  
    const handleSubmit = () => {
      console.log('Submit pressed', { photoUri, licensePlate, location });
      // TODO: integrate submit action
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Submit Report</Text>
  
        <View style={styles.card}>
          {/* Photo preview / placeholder */}
          <View style={styles.imageContainer}>
            {photoUri ? (
              <Image source={photoUri} style={styles.imagePreview} resizeMode="cover" />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>No Photo Taken</Text>
              </View>
            )}
          </View>
  
          {/* Action buttons */}
          <View style={styles.buttonRow}>
            {photoUri ? (
              <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleRetake}>
                <Text style={styles.buttonText}>🔄 Retake</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleTakePhoto}>
                <Text style={styles.buttonText}>Take Photo</Text>
              </TouchableOpacity>
            )}
  
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
  
            {photoUri && (
              <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            )}
          </View>
  
          {/* Inputs shown after photo is taken */}
          {photoUri && (
            <View style={{ marginTop: 16 }}>
              <TextInput
                style={styles.input}
                value={licensePlate}
                onChangeText={setLicensePlate}
                placeholder="License Plate"
              />
              <TextInput
                style={styles.input}
                value={location}
                editable={false}
                placeholder="Location placeholder"
              />
            </View>
          )}
        </View>
      </View>
    );
  }