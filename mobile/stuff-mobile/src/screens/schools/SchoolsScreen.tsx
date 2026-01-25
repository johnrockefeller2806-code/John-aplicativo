import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { schoolsAPI } from '../../services/api';
import { Card, CardContent, ShamrockIcon, HarpIcon } from '../../components';
import { colors, shadows } from '../../theme';

const { width } = Dimensions.get('window');

interface School {
  id: string;
  name: string;
  city: string;
  address: string;
  rating: number;
  reviews_count: number;
  image_url: string;
  description: string;
  accreditation: string[];
}

export const SchoolsScreen = ({ navigation }: any) => {
  const { language } = useLanguage();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCity, setSelectedCity] = useState('all');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await schoolsAPI.getAll();
      setSchools(response.data);
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSchools();
  };

  const cities = ['all', ...Array.from(new Set(schools.map((s) => s.city)))];

  const filteredSchools = selectedCity === 'all'
    ? schools
    : schools.filter((s) => s.city === selectedCity);

  const cityEmoji: { [key: string]: string } = {
    Dublin: '🏙️',
    Cork: '🏰',
    Galway: '🌊',
    Limerick: '🏛️',
    all: '🌍',
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#064e3b', '#047857', '#0d9488']}
        style={styles.header}
      >
        {/* Decorations */}
        <ShamrockIcon size={100} color="rgba(255,255,255,0.1)" style={styles.shamrock1} />
        <HarpIcon size={60} color="rgba(245,158,11,0.1)" style={styles.harp} />

        <View style={styles.headerContent}>
          <View style={styles.badge}>
            <ShamrockIcon size={16} color="#a7f3d0" />
            <Text style={styles.badgeText}>
              {language === 'pt' ? 'Escolas Certificadas ACELS' : 'ACELS Certified Schools'}
            </Text>
          </View>

          <Text style={styles.headerTitle}>
            {language === 'pt' ? 'Encontre sua ' : 'Find your '}
            <Text style={styles.headerHighlight}>
              {language === 'pt' ? 'escola ideal' : 'ideal school'}
            </Text>
          </Text>

          <Text style={styles.headerSubtitle}>
            {language === 'pt'
              ? `${schools.length} escolas em 4 cidades`
              : `${schools.length} schools in 4 cities`}
          </Text>
        </View>
      </LinearGradient>

      {/* City Filter */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {cities.map((city) => (
            <TouchableOpacity
              key={city}
              style={[
                styles.filterChip,
                selectedCity === city && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCity(city)}
            >
              <Text style={styles.filterEmoji}>{cityEmoji[city] || '📍'}</Text>
              <Text
                style={[
                  styles.filterText,
                  selectedCity === city && styles.filterTextActive,
                ]}
              >
                {city === 'all' ? (language === 'pt' ? 'Todas' : 'All') : city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Schools List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredSchools.map((school) => (
          <TouchableOpacity
            key={school.id}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('SchoolDetail', { school })}
          >
            <View style={styles.schoolCard}>
              {/* Image */}
              <Image
                source={{
                  uri: school.image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
                }}
                style={styles.schoolImage}
              />
              
              {/* City Badge */}
              <View style={styles.cityBadge}>
                <Text style={styles.cityEmoji}>{cityEmoji[school.city]}</Text>
                <Text style={styles.cityText}>{school.city}</Text>
              </View>

              {/* Rating Badge */}
              {school.rating && (
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="#fbbf24" />
                  <Text style={styles.ratingText}>{school.rating}</Text>
                </View>
              )}

              {/* Content */}
              <View style={styles.schoolContent}>
                <Text style={styles.schoolName} numberOfLines={1}>
                  {school.name}
                </Text>
                
                <View style={styles.addressRow}>
                  <Ionicons name="location" size={14} color={colors.gray[400]} />
                  <Text style={styles.addressText} numberOfLines={1}>
                    {school.address}
                  </Text>
                </View>

                {/* Accreditations */}
                <View style={styles.accreditations}>
                  {school.accreditation?.slice(0, 3).map((acc, idx) => (
                    <View key={idx} style={styles.accreditationBadge}>
                      <Ionicons name="checkmark-circle" size={12} color={colors.primary[600]} />
                      <Text style={styles.accreditationText}>{acc}</Text>
                    </View>
                  ))}
                </View>

                {/* Footer */}
                <View style={styles.schoolFooter}>
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>
                      {language === 'pt' ? 'Ver Detalhes' : 'View Details'}
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color={colors.primary[600]} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  shamrock1: {
    position: 'absolute',
    top: -20,
    left: -20,
  },
  harp: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  headerContent: {
    position: 'relative',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 16,
  },
  badgeText: {
    color: '#a7f3d0',
    fontSize: 12,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerHighlight: {
    color: '#fbbf24',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    ...shadows.sm,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    marginRight: 8,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: colors.primary[600],
  },
  filterEmoji: {
    fontSize: 16,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[700],
  },
  filterTextActive: {
    color: '#fff',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  schoolCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    ...shadows.md,
    marginBottom: 8,
  },
  schoolImage: {
    width: '100%',
    height: 160,
  },
  cityBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    ...shadows.sm,
  },
  cityEmoji: {
    fontSize: 14,
  },
  cityText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary[700],
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    ...shadows.sm,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.gray[800],
  },
  schoolContent: {
    padding: 16,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  addressText: {
    fontSize: 13,
    color: colors.gray[500],
    flex: 1,
  },
  accreditations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  accreditationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  accreditationText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary[700],
  },
  schoolFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    paddingTop: 12,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[600],
  },
});
