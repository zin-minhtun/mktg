
const axios = require('axios');

const API_URL = 'http://localhost:5000';

// Test user ID (replace with real ID from your database)
const TEST_USER_ID = '507f1f77bcf86cd799439011'; // MongoDB ObjectId format

async function testReminderAPI() {
    console.log('🧪 Testing Reminder API Endpoints\n');

    try {
        // Test 1: Create/Update Reminder
        console.log('1️⃣ Testing POST /api/reminders (Create Water reminder)');
        const createResponse = await axios.post(`${API_URL}/api/reminders`, {
            userId: TEST_USER_ID,
            type: 'Water',
            enabled: true,
            message: 'Stay hydrated!',
            scheduleKind: 'interval',
            intervalMinutes: 60
        });
        console.log('✅ Create Response:', createResponse.data);
        const reminderId = createResponse.data.data._id;
        console.log('   Reminder ID:', reminderId);
        console.log('');

        // Test 2: Get All Reminders
        console.log('2️⃣ Testing GET /api/reminders/:userId');
        const getResponse = await axios.get(`${API_URL}/api/reminders/${TEST_USER_ID}`);
        console.log('✅ Get Response:', getResponse.data);
        console.log('   Total Reminders:', getResponse.data.data.length);
        console.log('');

        // Test 3: Toggle Reminder
        console.log('3️⃣ Testing PATCH /api/reminders/:id/toggle (Disable)');
        const toggleResponse = await axios.patch(`${API_URL}/api/reminders/${reminderId}/toggle`, {
            enabled: false
        });
        console.log('✅ Toggle Response:', toggleResponse.data);
        console.log('   Enabled:', toggleResponse.data.data.enabled);
        console.log('');

        // Test 4: Update Reminder (Daily schedule)
        console.log('4️⃣ Testing POST /api/reminders (Update to Daily schedule)');
        const updateResponse = await axios.post(`${API_URL}/api/reminders`, {
            userId: TEST_USER_ID,
            type: 'Water',
            enabled: true,
            message: 'Morning hydration time!',
            scheduleKind: 'daily',
            time: '08:00'
        });
        console.log('✅ Update Response:', updateResponse.data);
        console.log('   Schedule Kind:', updateResponse.data.data.scheduleKind);
        console.log('   Time:', updateResponse.data.data.time);
        console.log('');

        // Test 5: Delete Reminder
        console.log('5️⃣ Testing DELETE /api/reminders/:id');
        const deleteResponse = await axios.delete(`${API_URL}/api/reminders/${reminderId}`);
        console.log('✅ Delete Response:', deleteResponse.data);
        console.log('');

        console.log('✅ All tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

testReminderAPI();
