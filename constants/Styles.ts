import { StyleSheet } from 'react-native';

export const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headingLarge: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
  },
  headingMedium: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
  },
  headingSmall: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  textSmall: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});