import { Stack } from 'expo-router';

export default function BerandaLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="buat-kehamilan" />
      <Stack.Screen name="pilih-kehamilan" />
      <Stack.Screen name="tambah-pengingat" />
    </Stack>
  );
}