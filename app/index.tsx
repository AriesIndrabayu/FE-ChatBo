import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

export default function Index() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Kalau root layout sudah siap
    if (segments.length > 0) {
      router.replace("/chat");
    }
  }, [segments]);

  return null;
}
