import { Stack } from 'expo-router';

export default function NutrisiLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[foodId]" />
      <Stack.Screen name="add" />
      <Stack.Screen name="detail" />
      <Stack.Screen name="recommendation" />
    </Stack>
  );
}