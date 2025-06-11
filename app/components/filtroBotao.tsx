import React, { useRef } from 'react';
import { Animated, Text, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function FiltroBotao({ onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
    onPress();
  };

  return (
    <View style={styles.labelRow}>
      <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
        <Animated.View style={[styles.filterButton, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.filterText}>Filtrar</Text>
          <MaterialCommunityIcons name="filter-variant" size={18} color="#fff" />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    width: '100%',
    
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: '#9b59b6',
    borderRadius: 0,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    color: '#fff',
    marginRight: 8,
    fontWeight: 'bold',
  },
});
