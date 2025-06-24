import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Modal,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import { generateUUID } from './utils';

// Admin credentials (in production, use proper authentication)
const ADMIN_PASSWORD = 'AdamCourtney2024';

interface WeddingEvent {
  id: string;
  time: string;
  title: string;
  location: string;
  current: boolean;
  description?: string;
}

interface Photo {
  id: string;
  uri: string;
  contributorName: string;
  timestamp: string;
}

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [newEvent, setNewEvent] = useState({
    time: '',
    title: '',
    location: '',
    description: '',
  });
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadEvents();
      loadPhotos();
    }
  }, [isAuthenticated]);

  const authenticate = async () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      await SecureStore.setItemAsync('admin_session', 'authenticated');
    } else {
      Alert.alert('Access Denied', 'Incorrect password');
    }
  };

  const loadEvents = async () => {
    try {
      const stored = await AsyncStorage.getItem('wedding_events');
      if (stored) {
        setEvents(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const loadPhotos = async () => {
    try {
      const stored = await AsyncStorage.getItem('wedding_photos');
      if (stored) {
        setPhotos(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const saveEvents = async (updatedEvents: WeddingEvent[]) => {
    try {
      await AsyncStorage.setItem('wedding_events', JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };

  const addEvent = async () => {
    if (!newEvent.time || !newEvent.title || !newEvent.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const event: WeddingEvent = {
      id: generateUUID(),
      time: newEvent.time,
      title: newEvent.title,
      location: newEvent.location,
      description: newEvent.description,
      current: false,
    };

    const updatedEvents = [...events, event];
    await saveEvents(updatedEvents);
    
    setNewEvent({ time: '', title: '', location: '', description: '' });
    setIsAddingEvent(false);
    
    Alert.alert('Success', 'Event added successfully!');
  };

  const deleteEvent = async (eventId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedEvents = events.filter(e => e.id !== eventId);
            await saveEvents(updatedEvents);
          },
        },
      ]
    );
  };

  const markEventAsCurrent = async (eventId: string) => {
    const updatedEvents = events.map(event => ({
      ...event,
      current: event.id === eventId,
    }));
    await saveEvents(updatedEvents);
  };

  const sendPushNotification = async () => {
    if (!notificationMessage.trim()) {
      Alert.alert('Error', 'Please enter a notification message');
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Adam & Courtney Wedding Update 💕',
          body: notificationMessage,
          sound: 'default',
        },
        trigger: null, // Send immediately
      });

      Alert.alert('Success', 'Notification sent to all guests!');
      setNotificationMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  const downloadAllPhotos = async () => {
    if (photos.length === 0) {
      Alert.alert('No Photos', 'No photos have been uploaded yet.');
      return;
    }

    Alert.alert(
      'Download Photos',
      `Download all ${photos.length} wedding photos?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: async () => {
            try {
              // In a real app, this would zip and download all photos
              // For demo, we'll show the count and details
              const photoDetails = photos.map(p => 
                `${p.contributorName}: ${p.timestamp}`
              ).join('\n');
              
              Alert.alert(
                'Photo Collection Ready',
                `${photos.length} photos from:\n${photoDetails}\n\nIn production, these would be downloaded as a ZIP file.`
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to download photos');
            }
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <Modal visible={true} animationType="slide">
        <SafeAreaView style={styles.container}>
          <View style={styles.authContainer}>
            <Text style={styles.title}>Admin Access</Text>
            <Text style={styles.subtitle}>Enter admin password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={authenticate}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal visible={true} animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Wedding Admin Panel</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Schedule Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Schedule Management</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsAddingEvent(true)}
            >
              <Text style={styles.addButtonText}>+ Add Event</Text>
            </TouchableOpacity>

            {events.map(event => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTime}>{event.time}</Text>
                  <View style={styles.eventActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, event.current && styles.currentButton]}
                      onPress={() => markEventAsCurrent(event.id)}
                    >
                      <Text style={styles.actionButtonText}>
                        {event.current ? 'CURRENT' : 'SET CURRENT'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteEvent(event.id)}
                    >
                      <Text style={styles.deleteButtonText}>🗑</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
                {event.description && (
                  <Text style={styles.eventDescription}>{event.description}</Text>
                )}
              </View>
            ))}
          </View>

          {/* Push Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📢 Send Notification</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter notification message for guests..."
              value={notificationMessage}
              onChangeText={setNotificationMessage}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity style={styles.notifyButton} onPress={sendPushNotification}>
              <Text style={styles.notifyButtonText}>Send to All Guests</Text>
            </TouchableOpacity>
          </View>

          {/* Photo Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📸 Photo Collection</Text>
            <Text style={styles.photoCount}>{photos.length} photos uploaded</Text>
            <TouchableOpacity style={styles.downloadButton} onPress={downloadAllPhotos}>
              <Text style={styles.downloadButtonText}>Download All Photos</Text>
            </TouchableOpacity>
            
            {photos.length > 0 && (
              <View style={styles.photoList}>
                {photos.slice(0, 5).map(photo => (
                  <Text key={photo.id} style={styles.photoItem}>
                    📷 {photo.contributorName} - {photo.timestamp}
                  </Text>
                ))}
                {photos.length > 5 && (
                  <Text style={styles.morePhotos}>
                    ... and {photos.length - 5} more photos
                  </Text>
                )}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Add Event Modal */}
        <Modal visible={isAddingEvent} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Event</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Time (e.g., 2:00 PM)"
                value={newEvent.time}
                onChangeText={(text) => setNewEvent({...newEvent, time: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Event Title"
                value={newEvent.title}
                onChangeText={(text) => setNewEvent({...newEvent, title: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Location"
                value={newEvent.location}
                onChangeText={(text) => setNewEvent({...newEvent, location: text})}
              />
              
              <TextInput
                style={styles.textArea}
                placeholder="Description (optional)"
                value={newEvent.description}
                onChangeText={(text) => setNewEvent({...newEvent, description: text})}
                multiline
                numberOfLines={2}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAddingEvent(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={addEvent}>
                  <Text style={styles.buttonText}>Add Event</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff4757',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  eventActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  currentButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 6,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  notifyButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  notifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  downloadButton: {
    backgroundColor: '#9C27B0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  photoCount: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  photoList: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  photoItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  morePhotos: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
}); 