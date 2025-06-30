import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Dimensions,
  Keyboard,
  KeyboardEvent,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface OptimizedFormInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  inputType?: 'name' | 'email' | 'message' | 'text';
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
}

const OptimizedFormInput: React.FC<OptimizedFormInputProps> = ({
  label,
  error,
  required = false,
  inputType = 'text',
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  ...textInputProps
}) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShow = (event: KeyboardEvent) => {
      setIsKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates.height);
    };

    const keyboardDidHide = () => {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
    };

    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    return () => {
      keyboardShowListener?.remove();
      keyboardHideListener?.remove();
    };
  }, []);

  // Get optimized input configuration based on type
  const getInputConfig = () => {
    const baseConfig = {
      autoCapitalize: 'sentences' as const,
      autoCorrect: true,
      returnKeyType: 'next' as const,
      blurOnSubmit: false,
    };

    switch (inputType) {
      case 'name':
        return {
          ...baseConfig,
          autoCapitalize: 'words' as const,
          textContentType: 'name' as const,
          maxLength: 50,
        };
      case 'email':
        return {
          ...baseConfig,
          autoCapitalize: 'none' as const,
          autoCorrect: false,
          keyboardType: 'email-address' as const,
          textContentType: 'emailAddress' as const,
          maxLength: 100,
        };
      case 'message':
        return {
          ...baseConfig,
          multiline: true,
          numberOfLines: 4,
          textAlignVertical: 'top' as const,
          returnKeyType: 'default' as const,
          maxLength: 500,
        };
      default:
        return baseConfig;
    }
  };

  // Get responsive dimensions
  const { width } = Dimensions.get('window');
  const isSmallDevice = width < 375;

  // Optimized styles based on device and keyboard state
  const optimizedStyles = StyleSheet.create({
    container: {
      marginBottom: isKeyboardVisible ? 12 : 16,
      ...containerStyle,
    },
    label: {
      fontSize: isSmallDevice ? 14 : 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 8,
      ...labelStyle,
    },
    required: {
      color: '#e74c3c',
    },
    inputContainer: {
      position: 'relative',
    },
    input: {
      fontSize: 16, // Critical: prevents iOS zoom
      paddingVertical: Platform.OS === 'ios' ? 12 : 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: error ? '#e74c3c' : '#ddd',
      backgroundColor: '#fff',
      minHeight: 44, // Apple's minimum touch target
      color: '#333',
      // Accessibility improvements
      ...inputStyle,
    },
    inputMultiline: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    inputFocused: {
      borderColor: '#4CAF50',
      borderWidth: 2,
    },
    inputError: {
      borderColor: '#e74c3c',
      borderWidth: 2,
    },
    errorContainer: {
      marginTop: 4,
    },
    errorText: {
      fontSize: 12,
      color: '#e74c3c',
      ...errorStyle,
    },
  });

  const [isFocused, setIsFocused] = useState(false);
  const inputConfig = getInputConfig();

  return (
    <View style={optimizedStyles.container}>
      {/* Label */}
      <Text style={optimizedStyles.label}>
        {label}
        {required && <Text style={optimizedStyles.required}> *</Text>}
      </Text>

      {/* Input */}
      <View style={optimizedStyles.inputContainer}>
        <TextInput
          {...textInputProps}
          {...inputConfig}
          style={[
            optimizedStyles.input,
            inputType === 'message' && optimizedStyles.inputMultiline,
            isFocused && optimizedStyles.inputFocused,
            error && optimizedStyles.inputError,
          ]}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          // Accessibility
          accessible={true}
          accessibilityLabel={label}
          accessibilityHint={error || `Enter your ${label.toLowerCase()}`}
          accessibilityRequired={required}
        />
      </View>

      {/* Error Message */}
      {error && (
        <View style={optimizedStyles.errorContainer}>
          <Text 
            style={optimizedStyles.errorText}
            accessible={true}
            accessibilityRole="alert"
          >
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

export default OptimizedFormInput; 