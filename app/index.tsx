import { useRouter, useSegments, Redirect } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Hanya redirect jika root layout sudah ready
    if (segments.length > 0) {
      router.replace("/login");
    }
  }, [segments]);

  // return (
  //   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //     <ActivityIndicator size="large" />
  //   </View>
  // );
  return <Redirect href="/login" />;
}
