Expo Development Build (Dev Client)
Why a dev client is required
This project uses native modules and config plugins that require a custom client build, including:

@react-native-google-signin/google-signin
firebase
expo-notifications (config plugin)
expo-camera, expo-image-picker
react-native-reanimated
Because of this:

❌ Expo Go is not sufficient for full functionality
✅ Use an Expo Development Build (custom dev client)
EAS build profiles
Build profiles live in mobile/eas.json:

development: development client, internal distribution
preview: internal distribution
production: production build (auto increment)
Build a development client (recommended)
From mobile/:

cd mobile
npm install
Build with EAS:

eas build --profile development --platform android
eas build --profile development --platform ios
Install the resulting build on your device/simulator, then start Metro:

npm start
Local native run (alternative)
The repo includes:

npm run android → expo run:android
npm run ios → expo run:ios
Use these when you need local native debugging.