# Copilot Instructions for UberApp React Native

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a React Native Expo project for a comprehensive UberApp mobile application.

## Project Structure
- Uses TypeScript for type safety
- Expo framework for cross-platform development
- React Navigation for navigation
- Zustand for state management
- React Native Maps for map functionality
- Modern UI components with React Native styling

## Key Features to Implement
1. **Authentication Flow**: Login, registration, profile management
2. **Trip Booking**: Complete flow from request to completion
3. **Real-time Tracking**: Driver location, trip progress
4. **Maps Integration**: Current location, destination selection, route display
5. **Driver Matching**: Search, acceptance, arrival tracking
6. **Payment Integration**: Multiple payment methods
7. **Rating System**: Rate drivers and trips
8. **Push Notifications**: Trip updates, driver communications

## Code Style Guidelines
- Use functional components with hooks
- Implement proper TypeScript types for all props and state
- Follow React Native best practices for performance
- Use proper error handling and loading states
- Implement responsive design for different screen sizes
- Use consistent naming conventions (camelCase for variables, PascalCase for components)

## State Management
- Use Zustand stores for global state (auth, trips, user data)
- Keep component state local when possible
- Implement proper state persistence for user preferences

## Navigation
- Use React Navigation v6 with TypeScript
- Implement stack and tab navigation patterns
- Handle deep linking for trip sharing

## Styling
- Use StyleSheet.create for component styles
- Implement consistent color scheme and typography
- Use Flexbox for layouts
- Consider dark mode support

## Performance
- Optimize map rendering and location updates
- Implement proper image loading and caching
- Use FlatList for large data sets
- Minimize re-renders with proper memoization
