import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useState, useCallback } from "react";
import { z } from "zod";
import { loginSchema } from "../schemas/authentication.schemas";
import { loginUser } from "../services/authentication.services";
import { saveRefreshToken } from "../services/token.services";
import { useAuth } from "../context/AuthContext";
import { router, useFocusEffect } from "expo-router";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const { setAccessToken } = useAuth();

  useFocusEffect(
    useCallback(() => {
      return () => {
        setEmail("");
        setPassword("");
        setErrors({});
      };
    }, []),
  );

  const handleLogin = async () => {
    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      const errors = z.treeifyError(result.error);

      setErrors({
        email: errors.properties?.email?.errors[0],
        password: errors.properties?.password?.errors[0],
      });

      return;
    }
    setErrors({});

    try {
      const data = await loginUser(email, password);
      setAccessToken(data.accessToken);
      await saveRefreshToken(data.refreshToken);
      Alert.alert(data.message, "You will be redirected to the Home page.", [
        {
          text: "OK",
          onPress: () => router.replace("/"),
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Login failed",
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry
        autoComplete="new-password"
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 24,
  },

  title: {
    width: "100%",
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    paddingBottom: 15,
    borderBottomColor: "green",
    borderBottomWidth: 5,
    marginTop: 30,
    marginBottom: 30,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },

  inputError: {
    borderColor: "red",
  },

  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },

  button: {
    height: 52,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#059415",
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
