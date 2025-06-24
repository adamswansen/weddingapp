/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import AppleMusicSearch from './AppleMusicSearch';
import { uploadPhotoToCloud, getAllPhotosFromCloud, getCloudPhotosCount } from './cloudPhotoService';

// Background Pattern Component - Beach Theme
const BackgroundPattern = () => (
  <View style={styles.backgroundPattern}>
    {/* Beach sand dots */}
    <View style={[styles.patternDot, { backgroundColor: '#f4e4bc' }]} />
    <View style={[styles.patternDot, { top: 20, left: 40, backgroundColor: '#e6d7b3' }]} />
    <View style={[styles.patternDot, { top: 60, left: 20, backgroundColor: '#f0e1c1' }]} />
    <View style={[styles.patternDot, { top: 100, left: 60, backgroundColor: '#e8d9b7' }]} />
    <View style={[styles.patternDot, { top: 140, left: 10, backgroundColor: '#f2e3c3' }]} />
    <View style={[styles.patternDot, { top: 180, left: 50, backgroundColor: '#e4d5b1' }]} />
    
    {/* Ocean wave lines */}
    <View style={[styles.wavePattern, { top: 100 }]} />
    <View style={[styles.wavePattern, { top: 250 }]} />
    <View style={[styles.wavePattern, { top: 400 }]} />
  </View>
);

// Decorative Border Component
const DecorativeBorder = () => (
  <View style={styles.decorativeBorder}>
    <View style={styles.borderElement} />
    <View style={styles.borderElement} />
    <View style={styles.borderElement} />
  </View>
);

// Beach Elements Component
const BeachElements = () => (
  <View style={styles.beachElements}>
    <Text style={[styles.beachElement, { top: 80, left: '15%' }]}>🐚</Text>
    <Text style={[styles.beachElement, { top: 200, left: '80%' }]}>⭐</Text>
    <Text style={[styles.beachElement, { top: 320, left: '25%' }]}>🐚</Text>
    <Text style={[styles.beachElement, { top: 440, left: '75%' }]}>⭐</Text>
  </View>
);

// Wedding data - ONLY October party now
const weddingEvents = [
  { id: '1', time: '5:00 PM', title: 'Cocktail Hour', location: 'Blue Chair Bay Beach', current: false },
  { id: '2', time: '6:30 PM', title: 'Welcome Toast', location: 'Beachfront', current: false },
  { id: '3', time: '7:00 PM', title: 'Dinner & Dancing', location: 'Pavilion', current: true },
  { id: '4', time: '9:00 PM', title: 'Party Games', location: 'Beach Bar', current: false },
  { id: '5', time: '10:00 PM', title: 'Late Night Dancing', location: 'Dance Floor', current: false },
];

const sampleMessages = [
  { id: '1', name: 'Emily', message: 'Can\'t wait to celebrate with you both! 💕', time: '2 hours ago' },
  { id: '2', name: 'Michael', message: 'Looking forward to the party at Blue Chair Bay!', time: '1 hour ago' },
];

interface Photo {
  id: string;
  uri: string;
  contributorName: string;
  timestamp: string;
}

interface WeddingEvent {
  id: string;
  time: string;
  title: string;
  location: string;
  current: boolean;
}

interface Message {
  id: string;
  name: string;
  message: string;
  time: string;
  type?: 'group' | 'private';
  recipientId?: string;
  recipientName?: string;
}

interface ChatUser {
  id: string;
  name: string;
  lastSeen: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  contributorName: string;
  timestamp: string;
}

interface UserProfile {
  name: string;
  travelPlans?: string;
  dietaryRestrictions?: string;
  allergies?: string;
}

// Simple UUID generator
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default function WeddingApp() {
  const [currentTab, setCurrentTab] = useState<'home' | 'photos' | 'schedule' | 'guestbook' | 'info' | 'playlist' | 'setup'>('home');
  const [newMessage, setNewMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<ChatUser | null>(null);
  const [chatMode, setChatMode] = useState<'group' | 'private'>('group');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminTapCount, setAdminTapCount] = useState(0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [cloudPhotos, setCloudPhotos] = useState<any[]>([]);
  const [events, setEvents] = useState<WeddingEvent[]>(weddingEvents);
  const [contributorName, setContributorName] = useState('');
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // New states for user profile and setup
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showSetupScreen, setShowSetupScreen] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    loadUserProfile();
    loadPhotos();
    loadCloudPhotos();
    loadEvents();
    loadMessages();
    loadPlaylist();
    loadChatUsers();
    initializeEvents();
  }, []);

  const loadCloudPhotos = async () => {
    try {
      const photos = await getAllPhotosFromCloud();
      setCloudPhotos(photos);
    } catch (error) {
      console.error('Error loading cloud photos:', error);
    }
  };

  // October party is the only event - no selection needed
  const initializeEvents = async () => {
    try {
      setEvents(weddingEvents);
    } catch (error) {
      console.error('Error initializing events:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem('user_profile');
      if (stored) {
        const profile = JSON.parse(stored);
        setUserProfile(profile);
        setContributorName(profile.name);
        setGuestName(profile.name);
      } else {
        setShowSetupScreen(true);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setShowSetupScreen(true);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const saveUserProfile = async (profile: UserProfile) => {
    try {
      await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
      setUserProfile(profile);
      setContributorName(profile.name);
      setGuestName(profile.name);
      setShowSetupScreen(false);
    } catch (error) {
      console.error('Error saving user profile:', error);
      Alert.alert('Error', 'Could not save your information. Please try again.');
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

  const loadMessages = async () => {
    try {
      const stored = await AsyncStorage.getItem('wedding_messages');
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadPlaylist = async () => {
    try {
      const stored = await AsyncStorage.getItem('wedding_playlist');
      if (stored) {
        setPlaylist(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading playlist:', error);
    }
  };

  const savePlaylist = async (newPlaylist: Song[]) => {
    try {
      await AsyncStorage.setItem('wedding_playlist', JSON.stringify(newPlaylist));
      setPlaylist(newPlaylist);
    } catch (error) {
      console.error('Error saving playlist:', error);
    }
  };

  const savePhotos = async (newPhotos: Photo[]) => {
    try {
      await AsyncStorage.setItem('wedding_photos', JSON.stringify(newPhotos));
      setPhotos(newPhotos);
    } catch (error) {
      console.error('Error saving photos:', error);
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'Wedding app needs access to camera to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const addPhoto = async (imageUri: string) => {
    if (!contributorName.trim()) {
      Alert.alert('Name Required', 'Please enter your name before adding a photo');
      return;
    }

    // Save locally first
    const newPhoto: Photo = {
      id: generateUUID(),
      uri: imageUri,
      contributorName: contributorName.trim(),
      timestamp: new Date().toLocaleString(),
    };

    const updatedPhotos = [...photos, newPhoto];
    await savePhotos(updatedPhotos);
    
    // Upload to cloud storage
    try {
      const cloudPhoto = await uploadPhotoToCloud(imageUri, contributorName.trim());
      if (cloudPhoto) {
        // Refresh cloud photos to show the new photo
        await loadCloudPhotos();
        
        Alert.alert(
          'Photo Shared! 📸✨',
          `Thank you ${contributorName}! Your photo has been shared with all wedding guests and saved to our collection!`,
          [{ text: 'Amazing!', onPress: () => setContributorName('') }]
        );
      } else {
        Alert.alert(
          'Photo Saved! 📸',
          `Thank you ${contributorName}! Your photo has been saved locally. We'll try to share it with everyone later.`,
          [{ text: 'OK', onPress: () => setContributorName('') }]
        );
      }
    } catch (error) {
      console.error('Error uploading to cloud:', error);
      Alert.alert(
        'Photo Saved! 📸',
        `Thank you ${contributorName}! Your photo has been saved locally.`,
        [{ text: 'OK', onPress: () => setContributorName('') }]
      );
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }

    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        addPhoto(response.assets[0].uri!);
      }
    });
  };

  const selectPhoto = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        addPhoto(response.assets[0].uri!);
      }
    });
  };

  const showPhotoOptions = () => {
    Alert.alert(
      'Add Photo 📸',
      'How would you like to add a photo?',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: selectPhoto },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const addMessage = async () => {
    if (guestName.trim() && newMessage.trim()) {
      const newMsg: Message = {
        id: generateUUID(),
        name: guestName.trim(),
        message: newMessage.trim(),
        time: 'Just now',
        type: chatMode,
        recipientId: selectedChatUser?.id,
        recipientName: selectedChatUser?.name
      };
      
      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);
      
      // Add user to chat users list if not already there
      if (!chatUsers.find(user => user.name === guestName)) {
        const newUser: ChatUser = {
          id: generateUUID(),
          name: guestName,
          lastSeen: new Date().toLocaleString()
        };
        const updatedUsers = [...chatUsers, newUser];
        setChatUsers(updatedUsers);
        
        try {
          await AsyncStorage.setItem('chat_users', JSON.stringify(updatedUsers));
        } catch (error) {
          console.error('Error saving chat users:', error);
        }
      }
      
      try {
        await AsyncStorage.setItem('wedding_messages', JSON.stringify(updatedMessages));
      } catch (error) {
        console.error('Error saving messages:', error);
      }
      
      setNewMessage('');
      const messageType = chatMode === 'private' && selectedChatUser ? 
        `private message to ${selectedChatUser.name}` : 'group message';
      Alert.alert('Message Sent! 💕', `Your ${messageType} has been sent!`);
    }
  };

  const loadChatUsers = async () => {
    try {
      const stored = await AsyncStorage.getItem('chat_users');
      if (stored) {
        setChatUsers(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading chat users:', error);
    }
  };

  const getFilteredMessages = () => {
    if (chatMode === 'group') {
      return messages.filter(msg => !msg.type || msg.type === 'group');
    } else if (selectedChatUser) {
      return messages.filter(msg => 
        (msg.type === 'private' && msg.recipientName === selectedChatUser.name && msg.name === guestName) ||
        (msg.type === 'private' && msg.recipientName === guestName && msg.name === selectedChatUser.name)
      );
    }
    return [];
  };

  const addSongToPlaylist = (title: string, artist: string, album: string = '', contributorName: string) => {
    const newSong: Song = {
      id: generateUUID(),
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim(),
      contributorName: contributorName.trim(),
      timestamp: new Date().toLocaleString(),
    };

    const updatedPlaylist = [...playlist, newSong];
    savePlaylist(updatedPlaylist);
    
    Alert.alert(
      'Song Added! 🎵',
      `"${title}" by ${artist} has been added to Adam & Courtney's wedding playlist!`,
      [{ text: 'OK' }]
    );
  };

  // Countdown calculation
  const getTimeUntilParty = () => {
    const partyDate = new Date('2025-10-23T19:00:00'); // October 23rd, 7pm
    const now = new Date();
    const timeDiff = partyDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) {
      return { days: 0, hours: 0, minutes: 0, isPartyTime: true };
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes, isPartyTime: false };
  };



  const renderHomeScreen = () => {
    const countdown = getTimeUntilParty();
    
    return (
      <View style={styles.screenWrapper}>
        <BackgroundPattern />
        <BeachElements />
        <ScrollView style={styles.screenContainer}>
          {/* Blue Chair Bay Photo Header */}
          <View style={styles.photoHeader}>
            <Image 
              source={require('./assets/splash-icon.png')} 
              style={styles.welcomePhoto}
              resizeMode="cover"
            />
            <View style={styles.photoOverlay}>
              <Text style={styles.coupleNames}>Adam & Courtney</Text>
              <Text style={styles.photoEventTitle}>Blue Chair Bay Celebration</Text>
              <TouchableOpacity
                style={styles.adminTrigger}
                onPress={() => {
                  setAdminTapCount(prev => {
                    const newCount = prev + 1;
                    if (newCount >= 5) {
                      setShowAdminPanel(true);
                      return 0;
                    }
                    setTimeout(() => setAdminTapCount(0), 3000);
                    return newCount;
                  });
                }}
              >
                <Text style={styles.weddingDate}>October 23, 2025</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Countdown Timer */}
          <View style={styles.countdownCard}>
            <DecorativeBorder />
            {countdown.isPartyTime ? (
              <Text style={styles.countdownTitle}>🎉 PARTY TIME! 🎉</Text>
            ) : (
              <>
                <Text style={styles.countdownTitle}>Countdown to Celebration</Text>
                <View style={styles.countdownRow}>
                  <View style={styles.countdownItem}>
                    <Text style={styles.countdownNumber}>{countdown.days}</Text>
                    <Text style={styles.countdownLabel}>Days</Text>
                  </View>
                  <View style={styles.countdownItem}>
                    <Text style={styles.countdownNumber}>{countdown.hours}</Text>
                    <Text style={styles.countdownLabel}>Hours</Text>
                  </View>
                  <View style={styles.countdownItem}>
                    <Text style={styles.countdownNumber}>{countdown.minutes}</Text>
                    <Text style={styles.countdownLabel}>Minutes</Text>
                  </View>
                </View>
              </>
            )}
            <DecorativeBorder />
          </View>

          {/* Welcome Message */}
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Welcome to Our Celebration!</Text>
            <Text style={styles.welcomeText}>
              Join us for an unforgettable evening at Blue Chair Bay Beach! 
              Share your photos, add songs to our playlist, and help us create 
              magical memories together.
            </Text>
            {userProfile && (
              <Text style={styles.personalWelcome}>
                Welcome back, {userProfile.name}! 🏖️
              </Text>
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.actionButton, styles.photosButton]} onPress={() => setCurrentTab('photos')}>
              <Text style={styles.actionSymbol}>📷</Text>
              <Text style={styles.actionTitle}>PHOTOS</Text>
              <Text style={styles.actionSubtitle}>Share memories</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.playlistButton]} onPress={() => setCurrentTab('playlist')}>
              <Text style={styles.actionSymbol}>🎵</Text>
              <Text style={styles.actionTitle}>PLAYLIST</Text>
              <Text style={styles.actionSubtitle}>Request songs</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.actionButton, styles.scheduleButton]} onPress={() => setCurrentTab('schedule')}>
              <Text style={styles.actionSymbol}>📅</Text>
              <Text style={styles.actionTitle}>SCHEDULE</Text>
              <Text style={styles.actionSubtitle}>Event timeline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.guestbookButton]} onPress={() => setCurrentTab('guestbook')}>
              <Text style={styles.actionSymbol}>💌</Text>
              <Text style={styles.actionTitle}>MESSAGES</Text>
              <Text style={styles.actionSubtitle}>Leave wishes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderPhotosScreen = () => (
    <View style={styles.screenWrapper}>
      <BackgroundPattern />
      <BeachElements />
      <ScrollView style={styles.screenContainer}>
        <View style={styles.sectionHeader}>
          <DecorativeBorder />
          <Text style={styles.sectionTitle}>◉ CAPTURE MOMENTS</Text>
          <Text style={styles.subtitle}>Share your favorite moments from today!</Text>
          <DecorativeBorder />
        </View>
        
        <View style={styles.inputSection}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Enter your name..."
            value={contributorName}
            onChangeText={setContributorName}
            maxLength={50}
          />
          
          <TouchableOpacity
            style={[styles.addPhotoButton, !contributorName.trim() && styles.disabledButton]}
            onPress={showPhotoOptions}
            disabled={!contributorName.trim()}
          >
            <Text style={styles.addPhotoButtonText}>📸 Add Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.statsText}>
            {cloudPhotos.length + photos.length} photo{(cloudPhotos.length + photos.length) !== 1 ? 's' : ''} shared by guests
          </Text>
          {cloudPhotos.length > 0 && (
            <Text style={styles.statsSubtext}>
              ✨ {cloudPhotos.length} photos shared with everyone!
            </Text>
          )}
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadCloudPhotos}
          >
            <Text style={styles.refreshButtonText}>🔄 Refresh Shared Photos</Text>
          </TouchableOpacity>
        </View>

        {/* Cloud Photos - Shared with everyone */}
        {cloudPhotos.length > 0 && (
          <>
            <View style={styles.sectionDivider}>
              <Text style={styles.sectionDividerText}>🌟 Shared Wedding Photos</Text>
            </View>
            <View style={styles.photoGrid}>
              {cloudPhotos.slice(0, 10).map((photo) => (
                <View key={photo.id} style={[styles.photoCard, styles.cloudPhotoCard]}>
                  <Image source={{ uri: photo.downloadURL }} style={styles.photoThumbnail} />
                  <View style={styles.photoInfo}>
                    <Text style={styles.photoContributor}>{photo.contributorName}</Text>
                    <Text style={styles.photoTimestamp}>{photo.timestamp}</Text>
                    <Text style={styles.cloudBadge}>✨ Shared</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Local Photos - Device only */}
        {photos.length > 0 && (
          <>
            <View style={styles.sectionDivider}>
              <Text style={styles.sectionDividerText}>📱 Your Local Photos</Text>
            </View>
            <View style={styles.photoGrid}>
              {photos.slice().reverse().slice(0, 6).map((photo) => (
                <View key={photo.id} style={styles.photoCard}>
                  <Image source={{ uri: photo.uri }} style={styles.photoThumbnail} />
                  <View style={styles.photoInfo}>
                    <Text style={styles.photoContributor}>{photo.contributorName}</Text>
                    <Text style={styles.photoTimestamp}>{photo.timestamp}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );

  const renderScheduleScreen = () => (
    <View style={styles.screenWrapper}>
      <BackgroundPattern />
      <ScrollView style={styles.screenContainer}>
        <View style={styles.sectionHeader}>
          <DecorativeBorder />
          <Text style={styles.sectionTitle}>◈ TIMELINE EVENTS</Text>
          <Text style={styles.subtitle}>
            October 23, 2025 • Blue Chair Bay Beach
          </Text>
          <DecorativeBorder />
        </View>
        
        {events.map(event => (
          <View key={event.id} style={[styles.eventCard, event.current && styles.currentEventCard]}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventTime}>{event.time}</Text>
              {event.current && <Text style={styles.nowIndicator}>NOW</Text>}
            </View>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventLocation}>{event.location}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderGuestbookScreen = () => {
    const filteredMessages = getFilteredMessages();
    
    return (
      <View style={styles.screenWrapper}>
        <BackgroundPattern />
        <View style={styles.screenContainer}>
          <View style={styles.sectionHeader}>
            <DecorativeBorder />
            <Text style={styles.sectionTitle}>💌 WEDDING CHAT</Text>
            <Text style={styles.subtitle}>
              {chatMode === 'group' ? 'Group Chat' : selectedChatUser ? `Chat with ${selectedChatUser.name}` : 'Private Messages'}
            </Text>
            <DecorativeBorder />
          </View>
          
          {/* Chat Mode Toggle */}
          <View style={styles.chatModeToggle}>
            <TouchableOpacity 
              style={[styles.chatModeButton, chatMode === 'group' && styles.activeChatMode]}
              onPress={() => {
                setChatMode('group');
                setSelectedChatUser(null);
              }}
            >
              <Text style={[styles.chatModeText, chatMode === 'group' && styles.activeChatModeText]}>
                👥 Group Chat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.chatModeButton, chatMode === 'private' && styles.activeChatMode]}
              onPress={() => setChatMode('private')}
            >
              <Text style={[styles.chatModeText, chatMode === 'private' && styles.activeChatModeText]}>
                💬 Private Messages
              </Text>
            </TouchableOpacity>
          </View>

          {/* Private Chat User Selection */}
          {chatMode === 'private' && (
            <View style={styles.userSelection}>
              <Text style={styles.userSelectionTitle}>Select someone to chat with:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.usersList}>
                {chatUsers.filter(user => user.name !== guestName).map(user => (
                  <TouchableOpacity
                    key={user.id}
                    style={[
                      styles.userButton,
                      selectedChatUser?.id === user.id && styles.selectedUserButton
                    ]}
                    onPress={() => setSelectedChatUser(user)}
                  >
                    <Text style={[
                      styles.userButtonText,
                      selectedChatUser?.id === user.id && styles.selectedUserButtonText
                    ]}>
                      {user.name}
                    </Text>
                  </TouchableOpacity>
                ))}
                {chatUsers.filter(user => user.name !== guestName).length === 0 && (
                  <Text style={styles.noUsersText}>No other users yet. Be the first to say hello! 👋</Text>
                )}
              </ScrollView>
            </View>
          )}
          
          {/* Messages List */}
          <ScrollView style={styles.messagesList}>
            {filteredMessages.map(msg => (
              <View key={msg.id} style={[
                styles.messageCard,
                msg.name === guestName ? styles.myMessageCard : styles.otherMessageCard
              ]}>
                <View style={styles.messageHeader}>
                  <Text style={styles.messageName}>{msg.name}</Text>
                  {msg.type === 'private' && (
                    <Text style={styles.privateLabel}>🔒 Private</Text>
                  )}
                </View>
                <Text style={styles.messageText}>{msg.message}</Text>
                <Text style={styles.messageTime}>{msg.time}</Text>
              </View>
            ))}
            {filteredMessages.length === 0 && (
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatText}>
                  {chatMode === 'group' 
                    ? "No messages yet. Start the conversation! 🎉" 
                    : selectedChatUser 
                      ? `No messages with ${selectedChatUser.name} yet. Say hello! 👋`
                      : "Select someone to start a private conversation 💬"
                  }
                </Text>
              </View>
            )}
          </ScrollView>
          
          {/* Message Input */}
          <View style={styles.messageInputSection}>
            <TextInput
              style={styles.nameInput}
              placeholder="Your name"
              value={guestName}
              onChangeText={setGuestName}
            />
            <View style={styles.messageInputRow}>
              <TextInput
                style={styles.messageInputBox}
                placeholder={
                  chatMode === 'private' && selectedChatUser 
                    ? `Message ${selectedChatUser.name}...`
                    : chatMode === 'private'
                      ? "Select someone to message..."
                      : "Write to the group..."
                }
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
                maxHeight={80}
                editable={chatMode === 'group' || (chatMode === 'private' && selectedChatUser !== null)}
              />
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  (!guestName.trim() || !newMessage.trim() || (chatMode === 'private' && !selectedChatUser)) && styles.disabledSendButton
                ]} 
                onPress={addMessage}
                disabled={!guestName.trim() || !newMessage.trim() || (chatMode === 'private' && selectedChatUser === null)}
              >
                <Text style={styles.sendButtonText}>📩</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderInfoScreen = () => (
    <View style={styles.screenWrapper}>
      <BackgroundPattern />
      <ScrollView style={styles.screenContainer}>
        <View style={styles.sectionHeader}>
          <DecorativeBorder />
          <Text style={styles.sectionTitle}>◆ WEDDING DETAILS</Text>
          <Text style={styles.subtitle}>Everything you need to know</Text>
          <DecorativeBorder />
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>◆ Venue</Text>
          <Text style={styles.infoText}>Blue Chair Bay Beach Resort</Text>
          <Text style={styles.infoText}>123 Paradise Drive</Text>
          <Text style={styles.infoText}>Tropical Island, TI 12345</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>◆ Contact</Text>
          <Text style={styles.infoText}>Wedding Coordinator: Sarah Johnson</Text>
          <Text style={styles.infoText}>Phone: (555) 123-4567</Text>
          <Text style={styles.infoText}>Emergency: (555) 987-6543</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>◆ WiFi</Text>
          <Text style={styles.infoText}>Network: WeddingGuest</Text>
          <Text style={styles.infoText}>Password: AdamAndCourtney2024</Text>
        </View>
      </ScrollView>
    </View>
  );

  const renderPlaylistScreen = () => (
    <View style={styles.screenWrapper}>
      <BackgroundPattern />
      <ScrollView style={styles.screenContainer}>
        <View style={styles.sectionHeader}>
          <DecorativeBorder />
          <Text style={styles.sectionTitle}>🎵 WEDDING PLAYLIST</Text>
          <Text style={styles.subtitle}>Add songs for our celebration!</Text>
          <DecorativeBorder />
        </View>
        
        <View style={styles.inputSection}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Enter your name..."
            value={guestName}
            onChangeText={setGuestName}
          />
          
          {guestName.trim() && (
            <View style={styles.playlistOptions}>
              <Text style={styles.optionsTitle}>Choose how to add songs:</Text>
              
              <View style={styles.optionCard}>
                <Text style={styles.optionTitle}>🍎 Search Apple Music</Text>
                <Text style={styles.optionDescription}>
                  Search Apple Music catalog for accurate song info and album artwork
                </Text>
                <AppleMusicSearch 
                  onAddSong={addSongToPlaylist}
                  contributorName={guestName}
                />
              </View>
              
              <View style={styles.optionCard}>
                <Text style={styles.optionTitle}>✏️ Manual Entry</Text>
                <Text style={styles.optionDescription}>
                  Type song and artist name manually
                </Text>
                <TextInput
                  style={styles.nameInput}
                  placeholder="Song title"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TextInput
                  style={styles.nameInput}
                  placeholder="Artist name"
                  value={newMessage}
                  onChangeText={setNewMessage}
                />
                <TouchableOpacity 
                  style={styles.submitButton} 
                  onPress={() => {
                    if (guestName.trim() && searchQuery.trim() && newMessage.trim()) {
                      addSongToPlaylist(searchQuery, newMessage, '', guestName);
                      setSearchQuery('');
                      setNewMessage('');
                    } else {
                      Alert.alert('Missing Info', 'Please fill in song title and artist');
                    }
                  }}
                >
                  <Text style={styles.submitButtonText}>🎵 Add Song</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.statsText}>
            {playlist.length} song{playlist.length !== 1 ? 's' : ''} in the playlist
          </Text>
        </View>

        {playlist.map(song => (
          <View key={song.id} style={styles.messageCard}>
            <Text style={styles.messageName}>🎵 {song.title}</Text>
            <Text style={styles.messageText}>by {song.artist}</Text>
            {song.album && <Text style={styles.messageAlbum}>from {song.album}</Text>}
            <Text style={styles.messageTime}>Added by {song.contributorName} • {song.timestamp}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderSetupScreen = () => {
    const [setupData, setSetupData] = useState({
      name: '',
      travelPlans: '',
      dietaryRestrictions: '',
      allergies: ''
    });

    const handleSaveProfile = () => {
      if (!setupData.name.trim()) {
        Alert.alert('Name Required', 'Please enter your name to continue');
        return;
      }

      saveUserProfile(setupData);
    };

    return (
      <View style={styles.screenWrapper}>
        <BackgroundPattern />
        <ScrollView style={styles.screenContainer}>
          <View style={styles.setupHeader}>
            <DecorativeBorder />
            <Text style={styles.setupTitle}>Welcome to Our Celebration!</Text>
            <Text style={styles.setupSubtitle}>Tell us a bit about yourself</Text>
            <DecorativeBorder />
          </View>

          <View style={styles.setupCard}>
            <Text style={styles.setupSectionTitle}>Your Name *</Text>
            <TextInput
              style={styles.setupInput}
              placeholder="Enter your name..."
              value={setupData.name}
              onChangeText={(text) => setSetupData(prev => ({ ...prev, name: text }))}
              maxLength={50}
            />

            <Text style={styles.setupSectionTitle}>Travel Plans</Text>
            <TextInput
              style={[styles.setupInput, styles.setupTextArea]}
              placeholder="Flight times, hotel, arrival date, etc."
              value={setupData.travelPlans}
              onChangeText={(text) => setSetupData(prev => ({ ...prev, travelPlans: text }))}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.setupSectionTitle}>Dietary Restrictions</Text>
            <TextInput
              style={[styles.setupInput, styles.setupTextArea]}
              placeholder="Vegetarian, vegan, gluten-free, etc."
              value={setupData.dietaryRestrictions}
              onChangeText={(text) => setSetupData(prev => ({ ...prev, dietaryRestrictions: text }))}
              multiline
              numberOfLines={2}
            />

            <Text style={styles.setupSectionTitle}>Allergies</Text>
            <TextInput
              style={[styles.setupInput, styles.setupTextArea]}
              placeholder="Food allergies, medication allergies, etc."
              value={setupData.allergies}
              onChangeText={(text) => setSetupData(prev => ({ ...prev, allergies: text }))}
              multiline
              numberOfLines={2}
            />

            <TouchableOpacity style={styles.setupButton} onPress={handleSaveProfile}>
              <Text style={styles.setupButtonText}>Continue to Celebration! 🎉</Text>
            </TouchableOpacity>

            <Text style={styles.setupNote}>
              * Required field. Other information helps us make your experience better!
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderScreen = () => {
    switch (currentTab) {
      case 'photos': return renderPhotosScreen();
      case 'schedule': return renderScheduleScreen();
      case 'playlist': return renderPlaylistScreen();
      case 'guestbook': return renderGuestbookScreen();
      case 'info': return renderInfoScreen();
      case 'setup': return renderSetupScreen();
      default: return renderHomeScreen();
    }
  };

  if (isLoadingProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.screenWrapper, { justifyContent: 'center', alignItems: 'center' }]}>
          <BackgroundPattern />
          <Text style={styles.welcomeTitle}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showSetupScreen) {
    return (
      <SafeAreaView style={styles.container}>
        {renderSetupScreen()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderScreen()}

      <View style={styles.modernTabBar}>
        {[
          { id: 'home', icon: 'home', label: 'Home' },
          { id: 'photos', icon: 'camera', label: 'Photos' },
          { id: 'schedule', icon: 'calendar', label: 'Schedule' },
          { id: 'playlist', icon: 'music', label: 'Music' },
          { id: 'guestbook', icon: 'chat', label: 'Chat' },
          { id: 'info', icon: 'info', label: 'Info' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.modernTab, currentTab === tab.id && styles.activeModernTab]}
            onPress={() => setCurrentTab(tab.id as 'home' | 'photos' | 'schedule' | 'guestbook' | 'info' | 'playlist' | 'setup')}
          >
            <View style={[styles.tabIconContainer, currentTab === tab.id && styles.activeTabIconContainer]}>
              <View style={[
                styles.modernTabIcon, 
                tab.icon === 'home' ? styles.homeIcon :
                tab.icon === 'camera' ? styles.cameraIcon :
                tab.icon === 'calendar' ? styles.calendarIcon :
                tab.icon === 'music' ? styles.musicIcon :
                tab.icon === 'chat' ? styles.chatIcon :
                styles.infoIcon,
                currentTab === tab.id && styles.activeModernTabIcon
              ]} />
            </View>
            <Text style={[styles.modernTabText, currentTab === tab.id && styles.activeModernTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87ceeb',
  },
  screenWrapper: {
    flex: 1,
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  patternDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d4af37',
    opacity: 0.8,
  },
  wavePattern: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#d4af37',
    opacity: 0.6,
  },
  decorativeBorder: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  borderElement: {
    width: 60,
    height: 3,
    backgroundColor: '#d4af37',
    marginHorizontal: 8,
    opacity: 1,
  },
  beachElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  beachElement: {
    position: 'absolute',
    fontSize: 16,
    opacity: 0.7,
  },
  screenContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  coupleNames: {
    fontSize: 36,
    fontWeight: '300',
    color: '#2c2c2c',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 2,
  },
  weddingDate: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 5,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  countdown: {
    fontSize: 14,
    color: '#b8860b',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 10,
  },
  content: {
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 40,
    borderRadius: 0,
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 0,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  photoContainer: {
    marginBottom: 20,
  },
  photoFrame: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#d4af37',
  },
  photoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c2c2c',
    textAlign: 'center',
  },
  photoSubtext: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  photoNote: {
    fontSize: 8,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '300',
    color: '#2c2c2c',
    marginBottom: 15,
    letterSpacing: 1,
  },
  welcomeText: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.5,
    fontWeight: '300',
  },
  personalWelcome: {
    fontSize: 16,
    color: '#2c2c2c',
    textAlign: 'center',
    marginTop: 15,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  // New styles for photo header and countdown
  photoHeader: {
    height: 250,
    position: 'relative',
    marginBottom: 20,
  },
  welcomePhoto: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    alignItems: 'center',
  },
  photoEventTitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
    letterSpacing: 1,
  },
  adminTrigger: {
    padding: 5,
  },
  countdownCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 20,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  countdownTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c2c2c',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  countdownItem: {
    alignItems: 'center',
  },
  countdownNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 5,
  },
  countdownLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionButton: {
    flex: 0.48,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 0,
    minHeight: 90,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  photosButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
  },
  scheduleButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
  },
  guestbookButton: {
    backgroundColor: 'rgba(233, 30, 99, 0.9)',
  },
  playlistButton: {
    backgroundColor: 'rgba(156, 39, 176, 0.9)',
  },
  infoButton: {
    borderColor: '#FF9800',
  },
  actionSymbol: {
    fontSize: 32,
    marginBottom: 8,
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 10,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  sectionHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#2c2c2c',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  inputSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 15,
    padding: 20,
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  addPhotoButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 0,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addPhotoButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  submitButton: {
    backgroundColor: 'linear-gradient(135deg, #4CAF50, #45a049)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 0,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  photoCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  photoThumbnail: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  photoInfo: {
    padding: 10,
  },
  photoContributor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  photoTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  eventCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#d4af37',
  },
  currentEventCard: {
    borderLeftColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  nowIndicator: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
  },
  messageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
  },
  messageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#d4af37',
    fontWeight: 'bold',
  },
  eventSelectionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 15,
    padding: 25,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d4af37',
    alignItems: 'center',
  },
  julyEventButton: {
    borderColor: '#4CAF50',
  },
  octoberEventButton: {
    borderColor: '#FF9800',
  },
  eventSelectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginBottom: 8,
    textAlign: 'center',
  },
  eventSelectionDate: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: '600',
  },
  eventSelectionLocation: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
    textAlign: 'center',
  },
  eventSelectionDescription: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
  },
  playlistOptions: {
    marginTop: 20,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  messageAlbum: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  setupHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  setupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginBottom: 8,
    textAlign: 'center',
  },
  setupSubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  setupCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 12,
    margin: 15,
  },
  setupSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  setupInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  setupTextArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  setupButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  setupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  setupNote: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  // Chat system styles
  chatModeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  chatModeButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activeChatMode: {
    backgroundColor: '#4CAF50',
  },
  chatModeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  activeChatModeText: {
    color: '#fff',
  },
  userSelection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 15,
    padding: 15,
    borderRadius: 8,
  },
  userSelectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  usersList: {
    maxHeight: 60,
  },
  userButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedUserButton: {
    backgroundColor: '#4CAF50',
  },
  userButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedUserButtonText: {
    color: '#fff',
  },
  noUsersText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  myMessageCard: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50',
    maxWidth: '80%',
  },
  otherMessageCard: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    maxWidth: '80%',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  privateLabel: {
    fontSize: 10,
    color: '#FF9800',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyChatText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  messageInputSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  messageInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageInputBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    fontSize: 18,
  },
  // Modern tab bar styles
  modernTabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  modernTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeModernTab: {
    transform: [{ scale: 1.05 }],
  },
  tabIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  activeTabIconContainer: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  modernTabIcon: {
    width: 18,
    height: 18,
    borderRadius: 2,
  },
  activeModernTabIcon: {
    backgroundColor: '#fff',
  },
  modernTabText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeModernTabText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  // Icon shapes
  homeIcon: {
    backgroundColor: '#666',
    width: 16,
    height: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cameraIcon: {
    backgroundColor: '#666',
    width: 16,
    height: 12,
    borderRadius: 3,
    position: 'relative',
  },
  calendarIcon: {
    backgroundColor: '#666',
    width: 14,
    height: 16,
    borderRadius: 2,
  },
  musicIcon: {
    backgroundColor: '#666',
    width: 6,
    height: 16,
    borderRadius: 3,
  },
  chatIcon: {
    backgroundColor: '#666',
    width: 16,
    height: 12,
    borderRadius: 8,
  },
  infoIcon: {
    backgroundColor: '#666',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  // Cloud photo styles
  statsSubtext: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '500',
  },
  sectionDivider: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
    marginHorizontal: 15,
  },
  sectionDividerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  cloudPhotoCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  cloudBadge: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
