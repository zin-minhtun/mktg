const mongoose = require('mongoose');
const Onboarding = require('../src/models/onboardingModel');
require('dotenv').config({ path: '../.env' });

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log('Connected to MongoDB');

        const records = await Onboarding.find({});
        console.log(`Found ${records.length} records to check.`);

        for (const record of records) {
            let needsSave = false;

            // Example fix: Ensure answers object exists
            if (!record.answers) {
                record.answers = {};
                needsSave = true;
            }

            // Example fix: Ensure arrays are arrays
            if (record.answers.abilityToWork && !Array.isArray(record.answers.abilityToWork)) {
                // If it was a string, wrap in array
                if (typeof record.answers.abilityToWork === 'string') {
                    record.answers.abilityToWork = [record.answers.abilityToWork];
                    needsSave = true;
                }
            }

            if (needsSave) {
                await record.save();
                console.log(`Fixed record: ${record._id}`);
            }
        }

        console.log('Migration complete.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
