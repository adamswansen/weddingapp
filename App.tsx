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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AdminPanel from './AdminPanel';
import PhotoManager from './PhotoManager';
import NotificationManager from './NotificationManager';

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
    <View style={[styles.patternDot, { top: 220, left: 30, backgroundColor: '#f6e6c5' }]} />
    <View style={[styles.patternDot, { top: 260, left: 70, backgroundColor: '#ead8b5' }]} />
    <View style={[styles.patternDot, { top: 300, left: 15, backgroundColor: '#f1e2c2' }]} />
    <View style={[styles.patternDot, { top: 340, left: 55, backgroundColor: '#e7d6b4' }]} />
    <View style={[styles.patternDot, { top: 380, left: 35, backgroundColor: '#f5e5c4' }]} />
    <View style={[styles.patternDot, { top: 420, left: 65, backgroundColor: '#e9d7b6' }]} />
    <View style={[styles.patternDot, { top: 460, left: 25, backgroundColor: '#f3e4c1' }]} />
    <View style={[styles.patternDot, { top: 500, left: 45, backgroundColor: '#e5d4b2' }]} />
    
    {/* Ocean wave lines */}
    <View style={[styles.wavePattern, { top: 100 }]} />
    <View style={[styles.wavePattern, { top: 250 }]} />
    <View style={[styles.wavePattern, { top: 400 }]} />
    <View style={[styles.wavePattern, { top: 550 }]} />
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

// Floating Hearts Component
const FloatingHearts = () => (
  <View style={styles.floatingHearts}>
    <Text style={[styles.floatingHeart, { top: 50, left: '10%' }]}>♡</Text>
    <Text style={[styles.floatingHeart, { top: 150, left: '80%' }]}>♡</Text>
    <Text style={[styles.floatingHeart, { top: 250, left: '20%' }]}>♡</Text>
    <Text style={[styles.floatingHeart, { top: 350, left: '70%' }]}>♡</Text>
    <Text style={[styles.floatingHeart, { top: 450, left: '15%' }]}>♡</Text>
    <Text style={[styles.floatingHeart, { top: 550, left: '85%' }]}>♡</Text>
  </View>
);

// Beach Elements Component
const BeachElements = () => (
  <View style={styles.beachElements}>
    <Text style={[styles.beachElement, { top: 80, left: '15%' }]}>🐚</Text>
    <Text style={[styles.beachElement, { top: 200, left: '80%' }]}>⭐</Text>
    <Text style={[styles.beachElement, { top: 320, left: '25%' }]}>🐚</Text>
    <Text style={[styles.beachElement, { top: 440, left: '75%' }]}>⭐</Text>
    <Text style={[styles.beachElement, { top: 560, left: '20%' }]}>🐚</Text>
    <Text style={[styles.beachElement, { top: 680, left: '85%' }]}>⭐</Text>
  </View>
);

// Simulate wedding data
const weddingEvents = [
  { time: '2:00 PM', title: 'Guest Arrival', location: 'Garden Entrance', current: false },
  { time: '3:00 PM', title: 'Ceremony Begins', location: 'Rose Garden', current: true },
  { time: '4:30 PM', title: 'Cocktail Hour', location: 'Terrace', current: false },
  { time: '6:00 PM', title: 'Reception Dinner', location: 'Grand Ballroom', current: false },
  { time: '8:00 PM', title: 'First Dance', location: 'Dance Floor', current: false },
];

const sampleMessages = [
  { name: 'Emily', message: 'Wishing you both a lifetime of love and happiness! 💕', time: '2 hours ago' },
  { name: 'Michael', message: 'Congratulations! What a beautiful ceremony!', time: '1 hour ago' },
];

export default function WeddingApp() {
  const [currentTab, setCurrentTab] = useState('home');
  const [newMessage, setNewMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [messages, setMessages] = useState(sampleMessages);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminTapCount, setAdminTapCount] = useState(0);

  const addMessage = () => {
    if (guestName.trim() && newMessage.trim()) {
      setMessages([...messages, {
        name: guestName.trim(),
        message: newMessage.trim(),
        time: 'Just now'
      }]);
      setNewMessage('');
      Alert.alert('Thank you! 💕', 'Your message has been added to our guestbook!');
    }
  };

  const renderHomeScreen = () => (
    <View style={styles.screenWrapper}>
      <BackgroundPattern />
      <BeachElements />
      <FloatingHearts />
      <ScrollView style={styles.screenContainer}>
        <View style={styles.header}>
          <DecorativeBorder />
          <TouchableOpacity 
            onPress={() => {
              setAdminTapCount(prev => prev + 1);
              if (adminTapCount >= 4) {
                setShowAdminPanel(true);
                setAdminTapCount(0);
              }
            }}
            activeOpacity={0.9}
          >
            <Text style={styles.coupleNames}>Adam & Courtney</Text>
          </TouchableOpacity>
          <Text style={styles.weddingDate}>June 15, 2024</Text>
          <Text style={styles.countdown}>Today is the day! ✨</Text>
          <DecorativeBorder />
        </View>

        <View style={styles.content}>
          <View style={styles.welcomeCard}>
            <View style={styles.photoContainer}>
              <View style={styles.photoFrame}>
                <Text style={styles.photoText}>Adam & Courtney</Text>
                <Text style={styles.photoSubtext}>Blue Chair Bay Beach Photo</Text>
                <Text style={styles.photoNote}>Your beautiful beach photo will appear here!</Text>
              </View>
            </View>
            <Text style={styles.welcomeTitle}>Welcome to Our Wedding</Text>
            <Text style={styles.welcomeText}>
              Thank you for being part of our special day. We can't wait to celebrate with you.
            </Text>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.actionButton, styles.photosButton]} onPress={() => setCurrentTab('photos')}>
              <Text style={styles.actionSymbol}>◉</Text>
              <Text style={styles.actionTitle}>CAPTURE</Text>
              <Text style={styles.actionSubtitle}>Moments</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.scheduleButton]} onPress={() => setCurrentTab('schedule')}>
              <Text style={styles.actionSymbol}>◈</Text>
              <Text style={styles.actionTitle}>TIMELINE</Text>
              <Text style={styles.actionSubtitle}>Events</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.actionButton, styles.guestbookButton]} onPress={() => setCurrentTab('guestbook')}>
              <Text style={styles.actionSymbol}>♦</Text>
              <Text style={styles.actionTitle}>WISHES</Text>
              <Text style={styles.actionSubtitle}>Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.infoButton]} onPress={() => setCurrentTab('info')}>
              <Text style={styles.actionSymbol}>◆</Text>
              <Text style={styles.actionTitle}>DETAILS</Text>
              <Text style={styles.actionSubtitle}>Information</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const renderPhotosScreen = () => (
    <View style={styles.screenWrapper}>
      <BackgroundPattern />
      <BeachElements />
      <View style={styles.screenContainer}>
        <View style={styles.sectionHeader}>
          <DecorativeBorder />
          <Text style={styles.sectionTitle}>◉ CAPTURE MOMENTS</Text>
          <Text style={styles.subtitle}>Share your favorite moments from today!</Text>
          <DecorativeBorder />
        </View>
        
        <PhotoManager onPhotoAdded={(photo) => {
          Alert.alert('Photo Added! 📸', `Thank you for sharing your moment!`);
        }} />
      </View>
    </View>
  );

  const renderScheduleScreen = () => (
    <View style={styles.screenWrapper}>
      <BackgroundPattern />
      <ScrollView style={styles.screenContainer}>
        <View style={styles.sectionHeader}>
          <DecorativeBorder />
          <Text style={styles.sectionTitle}>◈ TIMELINE EVENTS</Text>
          <Text style={styles.subtitle}>June 15, 2024</Text>
          <DecorativeBorder />
        </View>

        {weddingEvents.map((event, index) => (
          <View key={index} style={[styles.eventCard, event.current && styles.currentEvent]}>
            <View style={styles.eventTime}>
              <Text style={[styles.timeText, event.current && styles.currentTimeText]}>{event.time}</Text>
              {event.current && <Text style={styles.nowLabel}>NOW</Text>}
            </View>
            <View style={styles.eventContent}>
              <Text style={[styles.eventTitle, event.current && styles.currentEventTitle]}>
                {event.title}
              </Text>
              <Text style={[styles.eventLocation, event.current && styles.currentEventLocation]}>
                ◆ {event.location}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderGuestbookScreen = () => (
    <View style={styles.screenWrapper}>
      <BackgroundPattern />
      <FloatingHearts />
      <ScrollView style={styles.screenContainer}>
        <View style={styles.sectionHeader}>
          <DecorativeBorder />
          <Text style={styles.sectionTitle}>♦ WISHES & MESSAGES</Text>
          <Text style={styles.subtitle}>Leave us a sweet message!</Text>
          <DecorativeBorder />
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.nameInput}
            placeholder="Your name"
            value={guestName}
            onChangeText={setGuestName}
          />
          <TextInput
            style={styles.messageInput}
            placeholder="Write your message here..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity style={styles.submitButton} onPress={addMessage}>
            <Text style={styles.buttonText}>♦ SEND MESSAGE</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.messagesTitle}>Messages ({messages.length})</Text>
        {messages.map((msg, index) => (
          <View key={index} style={styles.messageCard}>
            <View style={styles.messageHeader}>
              <Text style={styles.messageName}>{msg.name}</Text>
              <Text style={styles.messageTime}>{msg.time}</Text>
            </View>
            <Text style={styles.messageText}>{msg.message}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

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
          <Text style={styles.infoText}>The Grand Rose Garden</Text>
          <Text style={styles.infoText}>123 Beautiful Lane, Garden City, CA 90210</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>◆ Contacts</Text>
          <Text style={styles.infoText}>Maid of Honor - Emily: (123) 456-7890</Text>
          <Text style={styles.infoText}>Best Man - Michael: (123) 456-7891</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>◆ WiFi</Text>
          <Text style={styles.infoText}>Network: WeddingGuest</Text>
          <Text style={styles.infoText}>Password: AdamAndCourtney2024</Text>
        </View>
      </ScrollView>
    </View>
  );

  const renderScreen = () => {
    switch (currentTab) {
      case 'photos': return renderPhotosScreen();
      case 'schedule': return renderScheduleScreen();
      case 'guestbook': return renderGuestbookScreen();
      case 'info': return renderInfoScreen();
      default: return renderHomeScreen();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#d4af37" />
      <NotificationManager />
      
      {renderScreen()}

      <View style={styles.tabBar}>
        {[
          { id: 'home', emoji: '🏠', label: 'Home' },
          { id: 'photos', emoji: '📸', label: 'Photos' },
          { id: 'schedule', emoji: '📅', label: 'Schedule' },
          { id: 'guestbook', emoji: '💌', label: 'Guestbook' },
          { id: 'info', emoji: 'ℹ️', label: 'Info' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, currentTab === tab.id && styles.activeTab]}
            onPress={() => setCurrentTab(tab.id)}
          >
            <Text style={styles.tabEmoji}>{tab.emoji}</Text>
            <Text style={[styles.tabText, currentTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
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
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
  floatingHearts: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  floatingHeart: {
    position: 'absolute',
    fontSize: 20,
    color: '#ff6b9d',
    opacity: 0.8,
    textShadowColor: 'rgba(255, 107, 157, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
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
    fontFamily: 'serif',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '300',
    color: '#2c2c2c',
    marginBottom: 15,
    letterSpacing: 1,
    fontFamily: 'serif',
  },
  welcomeText: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.5,
    fontWeight: '300',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flex: 0.48,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d4af37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    minHeight: 80,
    justifyContent: 'center',
  },
  actionSymbol: {
    fontSize: 28,
    marginBottom: 8,
    color: '#1a1a1a',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionTitle: {
    color: '#1a1a1a',
    fontWeight: '700',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  actionSubtitle: {
    color: '#888',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  photosButton: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
  },
  scheduleButton: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  guestbookButton: {
    backgroundColor: '#fce4ec',
    borderColor: '#e91e63',
  },
  infoButton: {
    backgroundColor: '#fff3e0',
    borderColor: '#ff9800',
  },
  placeholderSymbol: {
    fontSize: 48,
    marginBottom: 15,
    color: '#4caf50',
    textShadowColor: 'rgba(76, 175, 80, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  sectionHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 40,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#2c2c2c',
    letterSpacing: 1,
    fontFamily: 'serif',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 5,
  },
  photoPlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 20,
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d4af37',
    borderStyle: 'dashed',
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  demoButton: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    backdropFilter: 'blur(5px)',
  },
  currentEvent: {
    backgroundColor: '#6366f1',
    borderWidth: 0,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  eventTime: {
    width: 80,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  currentTimeText: {
    color: '#fff',
  },
  nowLabel: {
    fontSize: 10,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  eventContent: {
    flex: 1,
    marginLeft: 15,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  currentEventTitle: {
    color: '#fff',
  },
  eventLocation: {
    fontSize: 12,
    color: '#999',
  },
  currentEventLocation: {
    color: '#fff',
  },
  inputSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backdropFilter: 'blur(5px)',
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  messagesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  messageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backdropFilter: 'blur(5px)',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  messageName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 15,
    marginBottom: 10,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backdropFilter: 'blur(5px)',
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 5,
    backdropFilter: 'blur(10px)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: '#f8f8f8',
  },
  tabEmoji: {
    fontSize: 20,
  },
  tabText: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  activeTabText: {
    color: '#6366f1',
    fontWeight: 'bold',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  photoFrame: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#f8f8f8',
    borderWidth: 3,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  photoText: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
  },
  photoSubtext: {
    fontSize: 10,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 5,
  },
  photoNote: {
    fontSize: 11,
    color: '#b8860b',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  wavePattern: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#d4af37',
    opacity: 0.5,
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
    fontSize: 40,
    color: '#d4af37',
    opacity: 0.5,
  },
});
