import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

// Fallback if env is missing (development safety)
const BASE_URL = API_URL || "http://192.168.2.17:5000";

console.log(`[OnboardingService] Using API URL: ${BASE_URL}`);

/**
 * Start a new onboarding session
 * @returns {Promise<string>} The new onboardingId
 */
export const startOnboarding = async () => {
    try {
        console.log('[OnboardingService] Starting new session...');
        const response = await axios.post(`${BASE_URL}/api/onboarding/start`);

        const { onboardingId } = response.data;
        if (!onboardingId) throw new Error("No onboardingId returned from backend");

        await AsyncStorage.setItem('onboardingId', onboardingId);
        console.log(`[OnboardingService] New ID saved: ${onboardingId}`);

        return onboardingId;
    } catch (error) {
        console.error('[OnboardingService] Start failed:', error);
        throw error;
    }
};

/**
 * Verify if an onboarding ID exists in the backend
 * @param {string} id 
 * @returns {Promise<boolean>}
 */
export const verifyOnboardingExists = async (id) => {
    if (!id) return false;
    try {
        const response = await axios.get(`${BASE_URL}/api/onboarding/verify/${id}`);
        return response.data.exists;
    } catch (error) {
        console.error('[OnboardingService] Verify failed:', error);
        return false;
    }
};

/**
 * Update onboarding answers
 * @param {string} onboardingId 
 * @param {object} answers - Key-value pairs to update
 * @returns {Promise<object>} Updated onboarding document
 */
export const updateOnboarding = async (onboardingId, answers) => {
    try {
        if (!onboardingId) throw new Error("Missing onboardingId");

        console.log(`[OnboardingService] Updating ${onboardingId} with:`, Object.keys(answers));

        const response = await axios.put(`${BASE_URL}/api/onboarding/update`, {
            onboardingId,
            answers
        });

        return response.data.onboarding;
    } catch (error) {
        // Check for specific 404 error (Onboarding Not Found)
        if (error.response && error.response.status === 404) {
            console.warn('[OnboardingService] ID not found on server (404). Throwing specific error.');
            const notFoundError = new Error("Onboarding record not found");
            notFoundError.code = "ONBOARDING_NOT_FOUND";
            throw notFoundError;
        }
        console.error('[OnboardingService] Update failed:', error);
        throw error;
    }
};

/**
 * Clear onboarding data locally
 */
export const clearOnboardingData = async () => {
    try {
        await AsyncStorage.removeItem('onboardingId');
        console.log('[OnboardingService] Local data cleared');
    } catch (error) {
        console.error('[OnboardingService] Clear failed:', error);
    }
};

/**
 * Complete onboarding and get triage decision
 * @param {string} onboardingId
 * @returns {Promise<object>} Triage result
 */
export const completeOnboarding = async (onboardingId) => {
    try {
        if (!onboardingId) throw new Error("Missing onboardingId");

        console.log(`[OnboardingService] Completing onboarding for: ${onboardingId}`);

        const response = await axios.post(`${BASE_URL}/api/onboarding/complete`, {
            onboardingId
        });

        console.log(`[OnboardingService] Triage result:`, response.data);
        return response.data;
    } catch (error) {
        console.error('[OnboardingService] Complete failed:', error);
        throw error;
    }
};

/**
 * Get triage result for a user
 * @param {string} userId 
 * @returns {Promise<object|null>}
 */
export const getTriageResult = async (userId) => {
    try {
        if (!userId) return null;
        console.log(`[OnboardingService] Fetching triage for user: ${userId}`);
        const response = await axios.get(`${BASE_URL}/api/user/${userId}/status`);
        return response.data.triageResult;
    } catch (error) {
        // Ignore 404s (user might not have onboarding)
        if (error.response?.status !== 404) {
            console.error('[OnboardingService] Get triage failed:', error);
        }
        return null;
    }
};

/**
 * Update user triage decision (Booked/Skipped)
 * @param {string} userId
 * @param {string} action "BOOKED" | "SKIPPED"
 * @returns {Promise<void>}
 */
export const sendTriageAction = async (userId, action) => {
    try {
        // We first need the onboardingId. We can get it from the status endpoint or pass it.
        // Assuming we rely on userId to look it up on backend would be cleaner, but our route expects onboardingId.
        // Let's modify the service to help us or just fetch it first.
        // Or simpler: Update backend to accept userId OR onboardingId? 
        // For now, let's fetch status to get ID, then update.
        const statusRes = await axios.get(`${BASE_URL}/api/user/${userId}/status`);
        const onboardingId = statusRes.data.onboardingId;

        if (!onboardingId) return;

        await axios.post(`${BASE_URL}/api/onboarding/action`, {
            onboardingId,
            action
        });
        console.log(`[OnboardingService] Triage action '${action}' saved.`);
    } catch (error) {
        console.error('[OnboardingService] Failed to save action:', error);
    }
};
