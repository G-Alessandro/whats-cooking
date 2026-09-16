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
import LoadingIcon from "./LoadingIcon";
import { useAuth } from "../context/AuthContext";
import { router, useFocusEffect } from "expo-router";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text style={styles.title}>Login</Text>
      <View style={styles.container}>
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

        <View style={styles.buttonContainer}>
          {!loading && (
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
          {loading && <LoadingIcon width={52} height={52} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 12,
  },

  title: {
    width: "100%",
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    paddingBottom: 15,
    borderBottomColor: "green",
    borderBottomWidth: 2,
    marginTop: 50,
    marginBottom: 30,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    paddingLeft: 20,
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

  buttonContainer: { alignItems: "center", paddingTop: 20 },

  button: {
    height: 52,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#059415",
    paddingHorizontal: 80,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
