import React, { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!email.includes('@')) {
      return 'Invalid email';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    return '';
  };

  const handleLogin = async () => {
    setError('');
    setSuccess(false);

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    await new Promise((resolve: any) => setTimeout(resolve, 1500));

    setLoading(false);
    setSuccess(true);
  };

  return (
    <View style={styles.container} testID="login-screen">
      <Text style={styles.title}>Login</Text>

      <TextInput
        testID="email-input"
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        testID="password-input"
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {error ? (
        <Text testID="error-text" style={styles.error}>
          {error}
        </Text>
      ) : null}

      {loading ? (
        <ActivityIndicator testID="loader" size="large" />
      ) : (
        <Button title="Login" onPress={handleLogin} testID="login-button" />
      )}

      {success ? (
        <Text testID="success-text" style={styles.success}>
          Login Successful
        </Text>
      ) : null}
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '600',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },

  error: {
    color: 'red',
    marginBottom: 12,
  },

  success: {
    color: 'green',
    marginTop: 20,
    fontSize: 16,
  },
});
