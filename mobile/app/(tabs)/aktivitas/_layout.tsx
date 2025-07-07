import { Stack } from 'expo-router';

export default function AktivitasLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add" />
      <Stack.Screen name="aktivitas-berjalan" />
      <Stack.Screen name="detail-rekomendasi" />
      <Stack.Screen name="rekomendasi" />
      <Stack.Screen name="set-timer" />
      <Stack.Screen name="tambah-aktivitas" />
    </Stack>
  );
}