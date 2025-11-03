import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const getIconName = (routeName: string): keyof typeof FontAwesome.glyphMap => {
  if (routeName === 'index') return 'home'; // 'index' is the route name for the home file
  if (routeName === 'explore') return 'paper-plane';
  return 'circle';
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === 'dark';
  const tint = isDarkMode ? 'dark' : 'light';
  const activeColor = isDarkMode ? '#38e07b' : '#38e07b';
  const inactiveColor = isDarkMode ? '#8E8E93' : '#6c757d';
  const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }]}>
      <BlurView
        intensity={90} // Increased intensity for more blur
        tint={tint}
        style={[styles.blurView, { borderColor }]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
            >
              <FontAwesome
                name={getIconName(route.name)}
                size={isFocused ? 26 : 24}
                color={isFocused ? activeColor : inactiveColor}
              />
              <Text style={{ color: isFocused ? activeColor : inactiveColor, fontSize: 10, marginTop: 4 }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  blurView: {
    flexDirection: 'row',
    width: '100%',
    height: 65,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Added a background color for frosted effect
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});