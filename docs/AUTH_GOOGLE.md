GOOGLE SIGN-IN — DEVELOPER SETUP GUIDE
1. Generate Your Debug SHA-1 Fingerprint
Windows:
keytool -list -v -keystore "android\app\debug.keystore" -alias androiddebugkey -storepass android
2. Add SHA-1 to Firebase
Firebase Console → Project Settings → Your Apps → Android App → Add Fingerprint → Paste SHA-1 → Save.
3. Download Updated google-services.json
Download the new google-services.json from Firebase and place it in:
Personal_Injury/google-services.json
4. Uninstall the App
Uninstall the old version from your device to remove stale config.
5. Rebuild the App
Run:
npx expo run:android
6. Enable USB Debugging (Real Devices)
Settings → About Phone → Tap Build Number 7 times.
Settings → System → Developer Options → Enable USB Debugging.
8. Test Google Sign-In
Tap the Google Sign-In button. If setup is correct, it should authenticate successfully.
9. What NOT to Commit
NEVER commit:
android/debug.keystore
*.jks
*.keystore
10. Summary
Every dev MUST:
- Generate SHA-1
- Add SHA-1 to Firebase
- Download updated google-services.json
- Uninstall app
- Run npx expo run:android
