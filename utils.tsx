import { useState, useEffect } from 'react';
import { 
  Dimensions, 
  Platform, 
  Keyboard, 
  KeyboardEvent,
  TextStyle 
} from 'react-native';

// Simple UUID generator
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format time for display
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Check if current time is within event time range
export function isEventCurrent(eventTime: string): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Parse event time (e.g., "2:00 PM")
  const [time, period] = eventTime.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  let eventHour = hours;
  if (period === 'PM' && hours !== 12) {
    eventHour += 12;
  } else if (period === 'AM' && hours === 12) {
    eventHour = 0;
  }
  
  // Consider event "current" if within 30 minutes
  const eventTotalMinutes = eventHour * 60 + minutes;
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  
  return Math.abs(eventTotalMinutes - currentTotalMinutes) <= 30;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// Enhanced Mobile Optimization Utilities

// Hook for keyboard detection and management
export const useKeyboardDetection = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const updateDimensions = () => {
      const { height } = Dimensions.get('window');
      setViewportHeight(height);
    };

    const keyboardDidShow = (event: KeyboardEvent) => {
      setIsKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates.height);
    };

    const keyboardDidHide = () => {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
    };

    // Subscribe to keyboard events
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    
    // Subscribe to orientation changes
    const dimensionListener = Dimensions.addEventListener('change', updateDimensions);

    return () => {
      keyboardShowListener?.remove();
      keyboardHideListener?.remove();
      dimensionListener?.remove();
    };
  }, []);

  return {
    isKeyboardVisible,
    keyboardHeight,
    viewportHeight,
    availableHeight: viewportHeight - keyboardHeight
  };
};

// Enhanced viewport dimensions hook
export const useResponsiveDimensions = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [orientation, setOrientation] = useState(
    dimensions.width > dimensions.height ? 'landscape' : 'portrait'
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }: { window: any }) => {
      setDimensions(window);
      setOrientation(window.width > window.height ? 'landscape' : 'portrait');
    });

    return () => subscription?.remove();
  }, []);

  const isSmallDevice = dimensions.width < 375;
  const isMediumDevice = dimensions.width >= 375 && dimensions.width < 414;
  const isLargeDevice = dimensions.width >= 414;

  return {
    ...dimensions,
    orientation,
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    isTablet: Math.min(dimensions.width, dimensions.height) >= 768
  };
};

// Optimized text input styles that prevent iOS zoom and improve UX
export const getOptimizedInputStyles = (): TextStyle => ({
  fontSize: 16, // Prevents iOS zoom
  paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  paddingHorizontal: 16,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#ddd',
  backgroundColor: '#fff',
  // Accessibility
  minHeight: 44, // Apple's minimum touch target
  textAlignVertical: 'center' as const,
});

// Touch target optimization - ensures minimum 44px touch targets
export const getOptimizedTouchableStyles = (isSmallTarget = false) => ({
  minHeight: isSmallTarget ? 32 : 44,
  minWidth: isSmallTarget ? 32 : 44,
  paddingVertical: isSmallTarget ? 6 : 12,
  paddingHorizontal: isSmallTarget ? 12 : 16,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
});

// Safe area utilities
export const getSafeAreaInsets = () => {
  // This would be enhanced with react-native-safe-area-context in production
  const window = Dimensions.get('window');
  const isIPhoneX = Platform.OS === 'ios' && (window.height >= 812 || window.width >= 812);
  
  return {
    top: isIPhoneX ? 44 : Platform.OS === 'ios' ? 20 : 0,
    bottom: isIPhoneX ? 34 : 0,
    left: 0,
    right: 0,
  };
};

// Device-specific optimizations
export const getDeviceOptimizations = () => {
  const { width, height } = Dimensions.get('window');
  
  return {
    // Keyboard behavior optimization
    keyboardAvoidingBehavior: Platform.OS === 'ios' ? 'padding' : 'height',
    
    // Layout optimizations based on screen size
    containerPadding: width < 375 ? 12 : 16,
    sectionSpacing: width < 375 ? 16 : 20,
    
    // Text scaling for readability
    baseFontSize: width < 375 ? 14 : 16,
    headingFontSize: width < 375 ? 20 : 24,
    
    // Touch target adjustments
    buttonHeight: width < 375 ? 44 : 48,
    inputHeight: width < 375 ? 44 : 48,
  };
};

// Form validation with accessibility
export const validateFormInput = (value: string, type: 'name' | 'email' | 'message') => {
  const trimmedValue = value.trim();
  
  switch (type) {
    case 'name':
      return {
        isValid: trimmedValue.length >= 2 && trimmedValue.length <= 50,
        error: trimmedValue.length < 2 ? 'Name must be at least 2 characters' : 
               trimmedValue.length > 50 ? 'Name must be less than 50 characters' : null
      };
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return {
        isValid: emailRegex.test(trimmedValue),
        error: !emailRegex.test(trimmedValue) ? 'Please enter a valid email address' : null
      };
    case 'message':
      return {
        isValid: trimmedValue.length >= 10 && trimmedValue.length <= 500,
        error: trimmedValue.length < 10 ? 'Message must be at least 10 characters' : 
               trimmedValue.length > 500 ? 'Message must be less than 500 characters' : null
      };
    default:
      return { isValid: true, error: null };
  }
};

// Accessibility helpers
export const getAccessibilityProps = (label: string, hint?: string, role?: string) => ({
  accessible: true,
  accessibilityLabel: label,
  accessibilityHint: hint,
  accessibilityRole: role as any,
});

// Performance optimization for images
export const getOptimizedImageProps = (uri: string) => ({
  source: { uri },
  resizeMode: 'cover' as const,
  // Optimize loading
  loadingIndicatorSource: undefined,
  // Cache optimization
  cache: 'default' as const,
}); 