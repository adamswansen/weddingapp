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
  SafeAreaView,
  Alert,
} from 'react-native';

// Simple Error Boundary
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    console.error('Error Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error Boundary - Component Stack:', errorInfo.componentStack);
    console.error('Error Boundary - Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.errorContainer}>
          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>🚨 App Error</Text>
            <Text style={styles.errorMessage}>
              Something went wrong. Please restart the app.
            </Text>
            <Text style={styles.errorDetails}>
              {this.state.error?.toString() || 'Unknown error'}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                this.setState({ hasError: false, error: null });
              }}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

function MinimalApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home');

  useEffect(() => {
    console.log('✅ We Did It Weekend - App Starting...');
    
    // Simple initialization
    const initializeApp = async () => {
      try {
        console.log('✅ Starting app initialization...');
        
        // Just delay for a moment to simulate loading
        setTimeout(() => {
          console.log('✅ App initialization complete!');
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('❌ App initialization failed:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Text style={styles.loadingTitle}>🎉</Text>
          <Text style={styles.loadingText}>We Did It Weekend</Text>
          <Text style={styles.loadingSubtext}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderHomeScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎉 We Did It Weekend</Text>
        <Text style={styles.subtitle}>October 24-26, 2024</Text>
        <Text style={styles.location}>Orange Beach, Alabama</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎵 Navigation Test</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => Alert.alert('Success!', 'App is working correctly!')}
        >
          <Text style={styles.buttonText}>Test Button</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Debug Info</Text>
        <Text style={styles.debugText}>✅ React Native: Working</Text>
        <Text style={styles.debugText}>✅ SafeAreaView: Working</Text>
        <Text style={styles.debugText}>✅ ScrollView: Working</Text>
        <Text style={styles.debugText}>✅ State Management: Working</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎊 Quick Navigation</Text>
        {['Photos', 'Schedule', 'Guestbook', 'Music', 'Info'].map((screen) => (
          <TouchableOpacity
            key={screen}
            style={styles.navButton}
            onPress={() => setCurrentScreen(screen.toLowerCase())}
          >
            <Text style={styles.navButtonText}>{screen}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return renderHomeScreen();
      default:
        return (
          <View style={styles.screenContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentScreen('home')}
            >
              <Text style={styles.backButtonText}>← Back to Home</Text>
            </TouchableOpacity>
            <Text style={styles.screenTitle}>{currentScreen.toUpperCase()}</Text>
            <Text style={styles.screenText}>
              {currentScreen} screen is working! 🎉
            </Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f2ebdd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 20,
  },
  loadingTitle: {
    fontSize: 60,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#8B4513',
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#f2ebdd',
    textAlign: 'center',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#f2ebdd',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugText: {
    fontSize: 14,
    color: '#34C759',
    marginBottom: 5,
  },
  navButton: {
    backgroundColor: '#8B4513',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  screenContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#8B4513',
    padding: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 20,
  },
  screenText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    margin: 20,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 15,
  },
  errorMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  errorDetails: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Export with Error Boundary
export default function App() {
  console.log('🎉 App component rendering...');
  
  return (
    <ErrorBoundary>
      <MinimalApp />
    </ErrorBoundary>
  );
}
