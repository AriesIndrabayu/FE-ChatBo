import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";

import { loginRequest } from "@api/login.service";
import { setAuth } from "@store/auth.slice";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const doLogin = async () => {
    try {
      const res = await loginRequest(email, password);

      if (res.error === "0") {
        const sessionJson = JSON.parse(res.session);

        dispatch(
          setAuth({
            userId: sessionJson.userid,
            session: sessionJson,
            profile: sessionJson.profile_user,
          })
        );

        router.replace("/chat");
      } else {
        alert(res.msg);
      }
    } catch (err) {
      console.log(err);
      alert("Gagal login");
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 100 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 15 }}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <Button title="Login" onPress={doLogin} />
    </View>
  );
}
