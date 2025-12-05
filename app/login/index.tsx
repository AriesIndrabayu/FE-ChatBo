// app/login/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { loginUser } from "../../src/api/login.service";
import { setUser } from "../../src/store/auth.slice";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("Email dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const user = await loginUser(email, password);

      // Simpan ke Redux
      dispatch(setUser(user));

      // Arahkan ke halaman chat
      router.push("/chat");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://assets.nflxext.com/ffe/siteui/vlv3/d1e334/NetflixBackground.jpg",
      }}
      style={styles.bg}
      blurRadius={3}
    >
      <View style={styles.overlay} />

      <View style={styles.card}>
        <Text style={styles.title}>Masuk</Text>

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Masuk</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footer}>Aplikasi Chat Bot • Jawa Barat</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, justifyContent: "center" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  card: {
    padding: 24,
    marginHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#222",
    color: "white",
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#e50914",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  error: {
    color: "#ff7373",
    marginBottom: 10,
    textAlign: "center",
  },
  footer: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 18,
    fontSize: 12,
  },
});
