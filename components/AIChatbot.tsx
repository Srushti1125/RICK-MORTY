import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GEMINI_API_KEY } from '@/utils/config';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-001" });

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

export default function AIChatbot() {
  const { theme, themeMode } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey there! I’m your personal assistant here to help you stay on track, feel good, and make progress—one day at a time. What can I do for you today?',
      sender: 'bot',
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  // Animation values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  
  useEffect(() => {
    // Animate elements when screen loads
    opacity.value = withTiming(1, { duration: 800, easing: Easing.ease });
    translateY.value = withTiming(0, { duration: 800, easing: Easing.ease });
  }, []);
  
  // Transition animation when theme changes
  useEffect(() => {
    // Reset and replay animations when theme changes
    opacity.value = 0;
    translateY.value = 20;
    
    // Start animations again
    opacity.value = withTiming(1, { duration: 500, easing: Easing.ease });
    translateY.value = withTiming(0, { duration: 500, easing: Easing.ease });
  }, [themeMode]);
  
  const animatedViewStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
      flex: 1,
    };
  });

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Get response from Gemini API
      const result = await model.generateContent(inputText);
      const response = await result.response;
      const responseText = response.text();

      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: Date.now(),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error generating content:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: Date.now(),
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' 
          ? [styles.userMessage, { backgroundColor: theme.colors.primary }] 
          : [styles.botMessage, { backgroundColor: theme.colors.card }],
      ]}
    >
      <Text 
        style={[
          styles.messageText, 
          { 
            color: item.sender === 'user' ? '#fff' : theme.colors.text,
            fontFamily: theme.fonts.body,
          }
        ]}
      >
        {item.text}
      </Text>
      <Text 
        style={[
          styles.timestamp, 
          { 
            color: item.sender === 'user' ? 'rgba(255,255,255,0.7)' : theme.colors.secondaryText,
            fontFamily: theme.fonts.body,
          }
        ]}
      >
        {new Date(item.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={theme.gradients.background}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
          AI Assistant
        </Text>
      </View>

      <Animated.View style={[styles.chatContainer, animatedViewStyle]}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          // Add bottom padding to ensure messages don't get hidden behind input
          style={{ paddingBottom: 10 }}
        />

        {/* Wrap the input area in SafeAreaView to respect bottom insets */}
        <SafeAreaView edges={['bottom']} style={styles.inputSafeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                  fontFamily: theme.fonts.body,
                }]}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type your message..."
                placeholderTextColor={theme.colors.secondaryText}
                multiline
                returnKeyType="send"
                onSubmitEditing={sendMessage}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
                onPress={sendMessage}
                disabled={isLoading || inputText.trim() === ''}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={[styles.sendButtonText, { fontFamily: theme.fonts.body }]}>Send</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    // Add additional bottom padding to avoid messages being hidden by input bar
    paddingBottom: 80,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputSafeArea: {
    backgroundColor: 'transparent',
    // Position the input area at the bottom but above tab navigation
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    // Add margin to lift above tabs
    marginBottom: Platform.OS === 'ios' ? 50 : 60,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
    fontSize: 16,
    borderWidth: 1,
  },
  sendButton: {
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});