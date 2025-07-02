# UberApp Mobile - React Native

A comprehensive Uber-like mobile application built with React Native and Expo, featuring real-time trip tracking, driver matching, and seamless user experience.

## 🚀 Features

### Authentication & User Management
- **Login/Register**: Secure user authentication with form validation
- **Profile Management**: Editable user profiles with ratings and trip statistics
- **Persistent Sessions**: Automatic login state persistence with AsyncStorage

### Trip Management
- **Trip Request**: Intuitive destination selection with real-time pricing
- **Driver Matching**: Simulated driver search and assignment
- **Real-time Tracking**: Live trip progress with status updates
- **Trip History**: Complete trip history with detailed information
- **Rating System**: Rate drivers and view trip ratings

### User Interface
- **Modern Design**: Clean, professional UI with consistent styling
- **Mobile Optimized**: Responsive design for all screen sizes
- **Dark Mode Ready**: Theme system prepared for dark mode
- **Smooth Navigation**: Stack and tab navigation with React Navigation

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **State Management**: Zustand for efficient global state management
- **Maps Integration**: React Native Maps for location services
- **Real-time Updates**: Simulated real-time trip status updates
- **Error Handling**: Comprehensive error handling and loading states

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: Zustand
- **Maps**: React Native Maps
- **Storage**: AsyncStorage
- **Icons**: Expo Vector Icons
- **Permissions**: Expo Location & Permissions

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Custom button component
│   └── index.ts        # Component exports
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx # Main navigation setup
├── screens/            # Application screens
│   ├── LoginScreen.tsx     # User authentication
│   ├── RegisterScreen.tsx  # User registration
│   ├── DashboardScreen.tsx # Main dashboard
│   ├── TripRequestScreen.tsx   # Trip booking
│   ├── TripTrackingScreen.tsx  # Live trip tracking
│   ├── ProfileScreen.tsx       # User profile
│   └── TripHistoryScreen.tsx   # Trip history
├── store/              # State management
│   ├── authStore.ts    # Authentication state
│   ├── tripStore.ts    # Trip management state
│   └── index.ts        # Store exports
├── styles/             # Global styling
│   ├── theme.ts        # Design system
│   └── globalStyles.ts # Global styles
├── types/              # TypeScript definitions
│   └── index.ts        # Type definitions
└── utils/              # Utility functions
    └── index.ts        # Helper functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Studio

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UberMobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## 📱 Screens Overview

### Authentication Flow
- **Login**: Email/password authentication with validation
- **Register**: User registration with form validation

### Main Application
- **Dashboard**: Trip history, quick actions, and user stats
- **Trip Request**: Destination selection with pricing estimates
- **Trip Tracking**: Real-time trip progress with driver info
- **Profile**: User profile management and settings
- **Trip History**: Complete trip history with detailed views

## 🎯 Features Breakdown

### Trip Flow
1. **Request Trip**: Select destination and view pricing
2. **Driver Search**: Automatic driver matching simulation
3. **Driver Found**: Driver details and vehicle information
4. **Driver Arriving**: Real-time ETA updates
5. **Driver Arrived**: Pickup confirmation
6. **Trip in Progress**: Live tracking and trip details
7. **Trip Completed**: Payment processing and rating

### State Management
- **Authentication**: User login state and profile data
- **Trip Management**: Current trip state and history
- **Persistent Storage**: Automatic state persistence

## 🔧 Configuration

### Environment Setup
The app uses mock data for demonstration. To integrate with real services:

1. **Maps API**: Configure Google Maps or Apple Maps
2. **Authentication**: Integrate with Firebase Auth or custom backend
3. **Real-time Updates**: Implement WebSocket connections
4. **Payment Processing**: Integrate Stripe or similar payment service

### Customization
- **Theme**: Modify `src/styles/theme.ts` for design system changes
- **Navigation**: Update `src/navigation/AppNavigator.tsx` for route changes
- **Mock Data**: Update store files for different demo scenarios

## 📋 Development Scripts

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Type checking
npm run type-check

# Lint code
npm run lint
```

## 🚀 Building for Production

### Expo Build
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

### EAS Build (Recommended)
```bash
# Configure EAS
eas build:configure

# Build for all platforms
eas build --platform all
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- React Native community for continuous improvements
- Design inspiration from Uber and other ride-sharing apps

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the [documentation](docs/)
- Contact the development team

---

**Built with ❤️ using React Native and Expo**
