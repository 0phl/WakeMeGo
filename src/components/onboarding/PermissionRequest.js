// Permission request component with explanations
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GradientButton, Card } from '../common';
import { COLORS, TYPOGRAPHY } from '../../styles';
import { requestAllPermissions, checkPermissions } from '../../utils/permissions';

const PermissionRequest = ({ onPermissionsGranted, onSkip }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(null);

  const permissions = [
    {
      icon: 'location-on',
      title: 'Location Access',
      description: 'Required to track your journey and detect when you reach your destination',
      required: true,
    },
    {
      icon: 'notifications',
      title: 'Notifications',
      description: 'Needed to alert you when you arrive at your destination',
      required: true,
    },
    {
      icon: 'my-location',
      title: 'Background Location',
      description: 'Allows the app to track your location even when minimized',
      required: true,
    },
  ];

  const handleRequestPermissions = async () => {
    setIsRequesting(true);
    
    try {
      const granted = await requestAllPermissions();
      const status = await checkPermissions();
      
      setPermissionStatus(status);
      
      if (granted) {
        if (onPermissionsGranted) {
          onPermissionsGranted(status);
        }
      } else {
        Alert.alert(
          'Permissions Required',
          'Some permissions were not granted. The app may not work properly without them. You can grant them later in Settings.',
          [
            { text: 'Try Again', onPress: handleRequestPermissions },
            { text: 'Continue Anyway', onPress: () => onSkip && onSkip() },
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert(
        'Error',
        'Failed to request permissions. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsRequesting(false);
    }
  };

  const getPermissionIcon = (permission, status) => {
    if (!status) return permission.icon;
    
    const key = permission.icon === 'location-on' ? 'locationForeground' :
                permission.icon === 'my-location' ? 'locationBackground' :
                'notifications';
    
    return status[key] ? 'check-circle' : permission.icon;
  };

  const getPermissionColor = (permission, status) => {
    if (!status) return COLORS.textSecondary;
    
    const key = permission.icon === 'location-on' ? 'locationForeground' :
                permission.icon === 'my-location' ? 'locationBackground' :
                'notifications';
    
    return status[key] ? COLORS.success : COLORS.textSecondary;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Permissions Required</Text>
        <Text style={styles.subtitle}>
          To provide the best experience, Wake Me Go needs the following permissions:
        </Text>
      </View>

      <View style={styles.permissionsList}>
        {permissions.map((permission, index) => (
          <Card key={index} style={styles.permissionCard}>
            <View style={styles.permissionContent}>
              <View style={styles.permissionIcon}>
                <Icon 
                  name={getPermissionIcon(permission, permissionStatus)} 
                  size={32} 
                  color={getPermissionColor(permission, permissionStatus)} 
                />
              </View>
              
              <View style={styles.permissionText}>
                <Text style={styles.permissionTitle}>{permission.title}</Text>
                <Text style={styles.permissionDescription}>{permission.description}</Text>
                
                {permission.required && (
                  <View style={styles.requiredBadge}>
                    <Text style={styles.requiredText}>Required</Text>
                  </View>
                )}
              </View>
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <GradientButton
          title={permissionStatus?.allGranted ? 'Continue' : 'Grant Permissions'}
          onPress={permissionStatus?.allGranted ? () => onPermissionsGranted(permissionStatus) : handleRequestPermissions}
          loading={isRequesting}
          style={styles.grantButton}
        />
        
        {onSkip && (
          <GradientButton
            title="Skip for Now"
            onPress={onSkip}
            variant="secondary"
            style={styles.skipButton}
          />
        )}
      </View>

      {permissionStatus && !permissionStatus.allGranted && (
        <Card style={styles.warningCard}>
          <View style={styles.warningContent}>
            <Icon name="warning" size={24} color={COLORS.warning} />
            <Text style={styles.warningText}>
              Some permissions are missing. The app may not work properly without them.
            </Text>
          </View>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionsList: {
    flex: 1,
    marginBottom: 24,
  },
  permissionCard: {
    marginBottom: 16,
  },
  permissionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  permissionText: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  requiredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.error,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  requiredText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLight,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  grantButton: {
    marginBottom: 12,
  },
  skipButton: {
    marginBottom: 12,
  },
  warningCard: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.warning,
    marginBottom: 20,
  },
  warningContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.warning,
    marginLeft: 12,
    flex: 1,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});

export default PermissionRequest;
