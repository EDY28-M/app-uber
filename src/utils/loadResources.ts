import { loadAsync } from 'expo-font';

export default async function loadResourcesAsync() {
  try {
    // Load fonts
    await loadAsync({
      // Add any custom fonts here if needed
    });
  } catch (e) {
    // We might want to provide this error information to an error reporting service
    console.warn(e);
  }
}
