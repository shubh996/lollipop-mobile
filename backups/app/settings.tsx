
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function SettingScreen() {
  const [phone, setPhone] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [showOtp, setShowOtp] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <View style={styles.container}>
      {!isLoggedIn ? (
        <View style={styles.card}>
          <Text style={styles.title}>Sign in to your account</Text>
          <Text style={styles.subtitle}>Login with your phone number to access personalized settings.</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputRow}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                maxLength={10}
              />
            </View>
          </View>
          {showOtp && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>OTP</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter OTP"
                maxLength={6}
              />
            </View>
          )}
          <Button
            style={styles.button}
            onPress={() => {
              if (!showOtp) setShowOtp(true);
              else setIsLoggedIn(true);
            }}
          >
            <Text style={styles.buttonText}>{showOtp ? 'Verify OTP' : 'Send OTP'}</Text>
          </Button>
        </View>
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>You are logged in.</Text>
          <Text style={styles.label}>Phone: +91 {phone}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6f6f6',
  },
  card: {
    width: '85%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontFamily: 'UberMove-Bold',
    fontSize: 22,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'UberMove-Medium',
    fontSize: 15,
    marginBottom: 18,
    color: '#666',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'UberMove-Medium',
    fontSize: 14,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fafafa',
  },
  countryCode: {
    fontSize: 16,
    color: '#888',
    marginRight: 4,
    fontFamily: 'UberMove-Medium',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'UberMove-Medium',
    padding: 6,
    color: '#222',
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#268e52',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'UberMove-Bold',
    fontSize: 16,
  },
});
