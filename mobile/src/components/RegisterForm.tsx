import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useState, useCallback } from "react";
import { z } from "zod";
import { registerSchema } from "../schemas/authentication.schemas";
import { registerUser } from "../services/authentication.services";
import { router, useFocusEffect } from "expo-router";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  useFocusEffect(
    useCallback(() => {
      return () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
      };
    }, []),
  );

  const handleRegister = async () => {
    const result = registerSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const errors = z.treeifyError(result.error);

      setErrors({
        email: errors.properties?.email?.errors[0],
        password: errors.properties?.password?.errors[0],
        confirmPassword: errors.properties?.confirmPassword?.errors[0],
      });

      return;
    }

    setErrors({});

    try {
      const data = await registerUser(email, password);
      Alert.alert(data.message, "You will be redirected to the login page.", [
        {
          text: "OK",
          onPress: () => router.replace("/login"),
        },
      ]);
      router.replace("/login");
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Registration failed",
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>

      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
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

      <TextInput
        style={[styles.input, errors.confirmPassword && styles.inputError]}
        placeholder="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        autoCapitalize="none"
        secureTextEntry
        autoComplete="new-password"
      />

      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
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
