// Destination search screen with autocomplete and recent destinations
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { 
  GradientBackground, 
  GradientButton, 
  SearchBar, 
  LoadingSpinner 
} from '../../components/common';
import DestinationCard from '../../components/destination/DestinationCard';
import { COLORS, TYPOGRAPHY } from '../../styles';
import { SearchService, LocationService } from '../../services';

const DestinationSearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentDestinations, setRecentDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    loadRecentDestinations();
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const newSuggestions = SearchService.getSearchSuggestions(searchQuery);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
      
      // Debounced search
      const timeoutId = setTimeout(() => {
        handleSearch(searchQuery);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [searchQuery]);

  const loadRecentDestinations = async () => {
    try {
      const recent = await SearchService.getRecentDestinations();
      setRecentDestinations(recent);
    } catch (error) {
      console.error('Error loading recent destinations:', error);
    }
  };

  const handleSearch = async (query) => {
    if (query.length < 2) return;
    
    setIsLoading(true);
    setShowSuggestions(false);
    
    try {
      const results = await SearchService.searchPlaces(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectDestination = async (destination) => {
    try {
      // Add to recent destinations
      await SearchService.addToRecent(destination);
      
      // Navigate to map selection
      navigation.navigate('MapSelection', { destination });
    } catch (error) {
      console.error('Error selecting destination:', error);
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsLoading(true);
    
    try {
      const currentLocation = await LocationService.getCurrentLocation();
      
      if (currentLocation) {
        const address = await SearchService.reverseGeocode(currentLocation);
        
        const destination = {
          id: `current_${Date.now()}`,
          name: 'Current Location',
          address,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        };
        
        selectDestination(destination);
      } else {
        alert('Unable to get current location. Please check your GPS settings.');
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      alert('Failed to get current location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionPress = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const renderSearchResult = ({ item }) => (
    <DestinationCard
      destination={item}
      onPress={selectDestination}
    />
  );

  const renderRecentDestination = ({ item }) => (
    <DestinationCard
      destination={item}
      onPress={selectDestination}
      showLastUsed={true}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="search" size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyStateTitle}>Search for a destination</Text>
      <Text style={styles.emptyStateText}>
        Enter a location name, address, or landmark to get started
      </Text>
    </View>
  );

  return (
    <GradientBackground style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={COLORS.textLight} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Where do you want to go?</Text>
      </View>

      <View style={styles.content}>
        <SearchBar
          placeholder="Search destinations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          loading={isLoading}
          autoFocus={true}
          suggestions={suggestions}
          onSuggestionPress={handleSuggestionPress}
          showSuggestions={showSuggestions}
          style={styles.searchBar}
        />

        <GradientButton
          title="Use Current Location"
          onPress={handleUseCurrentLocation}
          loading={isLoading}
          style={styles.currentLocationButton}
        />

        {isLoading && (
          <LoadingSpinner text="Searching..." />
        )}

        {searchResults.length > 0 ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : recentDestinations.length > 0 && !isLoading && searchQuery.length === 0 ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>Recent Destinations</Text>
            <FlatList
              data={recentDestinations}
              renderItem={renderRecentDestination}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : !isLoading && searchQuery.length === 0 ? (
          renderEmptyState()
        ) : null}
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textLight,
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.backgroundWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  currentLocationButton: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  resultsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default DestinationSearchScreen;
