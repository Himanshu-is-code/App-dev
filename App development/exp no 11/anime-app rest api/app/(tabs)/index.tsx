import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Platform,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimeCard from '@/components/AnimeCard';
import { useRouter } from 'expo-router';

// --- Color palettes for light and dark modes ---
const lightColors = {
  background: '#F3F4F6',
  text: '#111827',
  textSecondary: '#6B7280',
  cardBackground: '#FFFFFF',
  inputBackground: '#E5E7EB',
  primary: '#38e07b',
};

const darkColors = {
  background: '#122017',
  text: '#FFFFFF',
  textSecondary: '#a0aec0',
  cardBackground: '#1A202C',
  inputBackground: '#2d3748',
  primary: '#38e07b',
};

// --- Dummy Data ---
const continueWatchingData = [
  { id: '1', title: "The Hero's Journey", episode: 'Episode 5', imageUrl: 'https://cdn.pixabay.com/photo/2022/05/22/15/02/girl-7213840_1280.png' },
  { id: '2', title: 'Silent Shadow', episode: 'Episode 3', imageUrl: 'https://cdn.pixabay.com/photo/2021/10/22/17/28/ai-generated-6733234_1280.jpg' },
  { id: '3', title: 'Cosmic Drift', episode: 'Episode 1', imageUrl: 'https://cdn.pixabay.com/photo/2022/10/29/18/14/boy-7555812_1280.png' },
];

// --- Type definitions ---
interface Anime {
  mal_id: number;
  title: string;
  synopsis: string;
  images: { jpg: { image_url: string } };
  genres: { name: string }[];
}

const { width: screenWidth } = Dimensions.get('window');

// Assuming you are using React Navigation and receive the `navigation` prop
export default function App() {
  const colorScheme = useColorScheme(); // Assuming you're using React Navigation and receive the `navigation` prop
  const themeColors = colorScheme === 'dark' ? darkColors : lightColors;
  const styles = useMemo(() => getStyles(themeColors), [colorScheme]);

  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroCarouselIndex, setHeroCarouselIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  // Effect to fetch popular anime on mount
  useEffect(() => {
    const fetchPopularAnime = async () => {
      try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime?sfw');
        if (!response.ok) throw new Error('Something went wrong!');
        const json = await response.json();
        setPopularAnime(json.data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchPopularAnime();
  }, []);

  const renderHeroItem = ({ item }: { item: Anime }) => (
    <View style={[styles.heroItemContainer, { width: screenWidth }]}>
      <ImageBackground source={{ uri: item.images?.jpg?.image_url }} style={styles.heroImage} resizeMode="cover">
        <View style={styles.heroOverlay} />
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.heroDescription} numberOfLines={2}>{item.synopsis ? item.synopsis : 'No description available.'}</Text>
          <TouchableOpacity style={styles.watchButton}>
            <Ionicons name="play" size={24} color="black" />
            <Text style={styles.watchButtonText}>Watch Now</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );

  const renderHorizontalCard = ({ item }: { item: any }) => (
    <View style={styles.horizontalCardWrapper}>
      <AnimeCard item={item} themeColors={themeColors} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* --- Hero Section --- */}
        <View style={styles.heroWrapper}>
          {loading ? (
            <ActivityIndicator size="large" color={themeColors.primary} style={styles.heroLoading} />
          ) : error ? (
            <Text style={styles.errorText}>Failed to load hero anime: {error}</Text>
          ) : (
            <FlatList
              ref={flatListRef}
              data={popularAnime.slice(0, 5)}
              renderItem={renderHeroItem}
              keyExtractor={(item) => item.mal_id.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                setHeroCarouselIndex(index);
              }}
            />
          )}
        </View>

        {/* --- Content Sheet with curved corners --- */}
        <View style={styles.contentSheet}>
          {!loading && !error && popularAnime.length > 0 && (
            <View style={styles.carouselIndicators}>
              {popularAnime.slice(0, 5).map((_, index) => (
                <View key={index} style={[styles.indicator, heroCarouselIndex === index && styles.activeIndicator]}/>
              ))}
            </View>
          )}

          {/* --- Dummy Search Bar Section --- */}
          <View style={styles.searchSection}>
            <TouchableOpacity 
              style={styles.searchContainer}
              onPress={() => router.push('/search bar')} 
            >
              <Ionicons name="search" size={20} color={themeColors.textSecondary} style={styles.searchIcon} />
              <View style={styles.searchInput}>
                  <Text style={{ color: themeColors.textSecondary, fontSize: 16 }}>Search</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* --- Other Content Sections --- */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continue Watching</Text>
            <FlatList
              data={continueWatchingData}
              renderItem={renderHorizontalCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Anime</Text>
            {loading ? <ActivityIndicator size="large" color={themeColors.primary} /> : (
              <FlatList
                data={popularAnime.slice(5).map((anime: Anime) => ({
                  id: anime.mal_id,
                  title: anime.title,
                  imageUrl: anime.images?.jpg?.image_url,
                  genre: anime.genres?.map(g => g.name).join(', ') || 'N/A',
                }))}
                renderItem={renderHorizontalCard}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLESHEET ---
const getStyles = (themeColors: typeof lightColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: themeColors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  heroWrapper: { width: screenWidth, height: 380 },
  heroItemContainer: { width: screenWidth, height: '100%' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(18, 32, 23, 0.4)' },
  heroTextContainer: { flex: 1, justifyContent: 'flex-end', padding: 24, paddingBottom: 48 },
  heroTitle: { color: 'white', fontSize: 36, fontWeight: 'bold' },
  heroDescription: { color: '#e2e8f0', fontSize: 16, marginVertical: 8, maxWidth: '85%' },
  watchButton: { backgroundColor: themeColors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, marginTop: 8, width: 160 },
  watchButtonText: { color: 'black', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  heroLoading: { height: 380, justifyContent: 'center', alignItems: 'center' },
  contentSheet: { backgroundColor: themeColors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -30, paddingTop: 16, paddingBottom: 100 },
  carouselIndicators: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 18 },
  indicator: { height: 8, width: 8, borderRadius: 4, backgroundColor: themeColors.textSecondary, marginHorizontal: 4 },
  activeIndicator: { backgroundColor: themeColors.primary, width: 20 },
  searchSection: { paddingHorizontal: 16, marginBottom: 24 },
  searchContainer: { position: 'relative', flexDirection: 'row', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: 16, zIndex: 1 },
  searchInput: { backgroundColor: themeColors.inputBackground, borderRadius: 9999, height: 50, paddingLeft: 48, paddingRight: 16, flex: 1, justifyContent: 'center' },
  section: { marginBottom: 32, paddingHorizontal: 16 },
  sectionTitle: { color: themeColors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  horizontalCardWrapper: { width: 150, marginRight: 16 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
});