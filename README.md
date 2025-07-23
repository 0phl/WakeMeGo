# 🚍 Wake Me Go

**Never miss your stop again!**  
**Wake Me Go** is a React Native geofence alarm app that tracks your real-time location and automatically wakes you up when you reach your chosen destination.

---

## 📱 Overview

Wake Me Go is designed for commuters who nap or relax during rides. It works offline, stores destinations locally, and runs reliably in the background. The app uses real-time geofencing: when you enter a defined area, an alarm with vibration and sound will ring to wake you up.

---

## 🔑 Core Features

✅ Onboarding flow with permission guide  
✅ Destination search with Google Places API (free tier)  
✅ Interactive map with draggable pin and radius selector  
✅ Real-time geofence tracking on a map  
✅ Foreground service for Android background tracking  
✅ Local notifications and alarm with custom sounds/vibration  
✅ Recent destinations, journey history  
✅ Offline storage using AsyncStorage

---

## 🏗️ Tech Stack

| Area | Tech |
|----------------|-------------------------------|
| **Framework** | React Native with Expo Bare |
| **Location** | `expo-location` |
| **Maps** | `react-native-maps` |
| **Notifications & Audio** | `expo-notifications` + `expo-av` |
| **Storage** | `@react-native-async-storage/async-storage` |
| **Foreground Service** | `@voximplant/react-native-foreground-service` |
| **Navigation** | `@react-navigation/native` |
| **Styling** | `react-native-linear-gradient`, custom UI |

---