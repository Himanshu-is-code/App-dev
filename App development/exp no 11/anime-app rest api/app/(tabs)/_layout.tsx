// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import CustomTabBar from '@/components/CustomTabBar'; // Import your component
import { TrackedAnimeProvider } from './TrackedAnimeContext';

export default function TabLayout() {
  return (
    // Wrap the Tabs navigator with the provider
    <TrackedAnimeProvider>
      <Tabs
      // Tell the navigator to use your custom component
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index" // This is your home screen
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />
      </Tabs>
    </TrackedAnimeProvider>
  );
}