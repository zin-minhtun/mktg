const DailyLog = require("../models/dailyLogModel");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const { get } = require("../models/sleepModel");
dayjs.extend(utc);

const addSleepLog = async (req, res) => {
    try {
        const { userId, date, sleep } = req.body;

        // Check if required fields are missing
        if (!userId || !date || !sleep) {
            return res.status(400).json({ error: "Missing data" });
        }

        let dailyLog = await DailyLog.findOne({ userId, date });

        if (!dailyLog) {
            dailyLog = new DailyLog({ userId, date, sleep });
        } else {
            // if dailyLog exists but doesn't have any sleep log in it
            if (!dailyLog.sleep) {
                dailyLog.sleep = [];
            }
            // push new sleep log object inside the sleep array
            dailyLog.sleep.push(sleep);
        }

        await dailyLog.save();
        return res.status(201).json({ message: "New sleep log created successfully", dailyLog });

    } catch (error) {
        console.error("Error adding sleep log:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Fetch all sleep logs for a given user and date
const getSleepLogs = async (req, res) => {
    try {
        const { userId, date } = req.query;
        // Find the DailyLog based on userId and date
        const dailyLog = await DailyLog.findOne({ userId, date });

        // If a DailyLog is found, include the id and the sleep array in the response
        if (dailyLog) {
            res.json({
                id: dailyLog._id,
                sleep: dailyLog.sleep || [],
            });
        } else {
            res.json({ id: null, sleep: [] });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Fetch all sleep logs for a given user and date
const getWeeklySleepLogs = async (req, res) => {
    try {
        const { userId } = req.query;

        // Get today's date in UTC
        const today = dayjs().utc().startOf("day");

        // Generate last 7 days in UTC
        const lastSevenDays = Array.from({ length: 7 }, (_, i) =>
            today.subtract(i, "day").format("YYYY-MM-DD")
        );

        // Convert to JavaScript Date objects for MongoDB
        const startDate = today.subtract(6, "days").toDate();
        const endDate = today.endOf("day").toDate();

        // Fetch logs
        const weeklyLogs = await DailyLog.find({
            userId,
            date: { $gte: startDate, $lte: endDate },
        });

        console.log("logsito", weeklyLogs);

        // Return the last 7 days even if no log exists
        const formattedLogs = lastSevenDays.map(date => {
            const log = weeklyLogs.find(log =>
                dayjs(log.date).utc().format("YYYY-MM-DD") === date
            );
            return {
                date,
                sleep: log ? log.sleep : [],
                id: log ? log._id : null,
            };
        });

        console.log(formattedLogs);
        res.json(formattedLogs);
    } catch (error) {
        console.error("Error in getWeeklySleepLogs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const updateSleepLog = async (req, res) => {
    const { dailyLogId, sleepLogId } = req.params;
    const { userId, date, sleep } = req.body;

    if (!userId || !date || !sleep) {
        return res.status(400).json({ error: "No sleep data provided for update" });
    }

    try {
        // Find the specific daily log
        const dailyLog = await DailyLog.findById(dailyLogId);

        if (!dailyLog) {
            return res.status(404).json({ error: "Daily log not found" });
        }

        // Find the specific sleep log inside the DailyLog's sleep array
        const sleepLogIndex = dailyLog.sleep.findIndex(log => log._id.toString() === sleepLogId);

        if (sleepLogIndex === -1) {
            return res.status(404).json({ error: "Sleep log not found" });
        }

        // Update the specific sleep log inside the DailyLog
        dailyLog.sleep[sleepLogIndex] = { ...dailyLog.sleep[sleepLogIndex], ...sleep };

        // Save the updated DailyLog
        await dailyLog.save();

        res.json(dailyLog.sleep[sleepLogIndex]);
    } catch (error) {
        res.status(500).json({ error: "Error updating sleep log", details: error.message });
    }
}

const updateMobilityLog = async (req, res) => {
    try {
        const { dailyLogId, mobilityLogId } = req.params;
        const { userId, date, mobility } = req.body;


        console.log('Update Request Params:', { dailyLogId, mobilityLogId });
        console.log('Update Request Body:', { userId, date, mobility });

        // Validate required fields
        if (!userId || !date || !mobility) {
            return res.status(400).json({ error: "Missing required data for update" });
        }

        // Find the daily log
        const dailyLog = await DailyLog.findById(dailyLogId);

        if (!dailyLog) {
            return res.status(404).json({ error: "Daily log not found" });
        }

        // Find the specific mobility log in the array
        const mobilityIndex = dailyLog.mobility.findIndex(
            log => log._id.toString() === mobilityLogId
        );

        if (mobilityIndex === -1) {
            return res.status(404).json({ error: "Mobility log not found" });
        }

        // Update the mobility log
        dailyLog.mobility[mobilityIndex] = {
            ...dailyLog.mobility[mobilityIndex],
            ...mobility
        };

        // Save the updated document
        await dailyLog.save();

        console.log("Updated mobility log:", dailyLog.mobility[mobilityIndex]);

        // Return success response
        res.json({
            message: "Mobility log updated successfully",
            updatedLog: dailyLog.mobility[mobilityIndex]
        });

    } catch (error) {
        console.error("Error updating mobility log:", error);
        res.status(500).json({
            error: "Error updating mobility log",
            details: error.message
        });
    }
};

const addMobilityLog = async (req, res) => {

    const { userId, date, mobility } = req.body;

    if (!userId || !date || !mobility) {
        return res.status(400).json({ error: "Missing data" });
    }

    try {
        const startOfDay = dayjs.utc(date).startOf('day').toDate();
        const endOfDay = dayjs.utc(date).endOf('day').toDate();

        // Check if a DailyLog already exists for the user and date
        let dailyLog = await DailyLog.findOne({
            userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (!dailyLog) {
            // Create new DailyLog
            dailyLog = new DailyLog({
                userId,
                date: startOfDay,
                mobility: []
            });
        }

        // Ensure mobility array exists
        if (!dailyLog.mobility) {
            dailyLog.mobility = [];
        }

        // Add the new mobility entry
        dailyLog.mobility.push(mobility);

        await dailyLog.save();

        console.log("Saved mobility log:", dailyLog.mobility);
        return res.status(201).json({
            message: "Mobility log created successfully",
            dailyLog
        });

    } catch (error) {
        console.error("Error adding mobility log:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// Fetch all mobility logs for a given user and date
const getMobilityLogs = async (req, res) => {
    try {
        const { userId, date } = req.query; // Retrieve the userId from the request query

        const startOfDay = dayjs.utc(date).startOf('day').toDate();
        const endOfDay = dayjs.utc(date).endOf('day').toDate();

        let dailyLog = await DailyLog.findOne({
            userId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        if (dailyLog && dailyLog.mobility) {
            res.json({
                id: dailyLog._id,
                mobility: dailyLog.mobility || [],
                date: date
            });
        }
        else {
            res.json({ id: null, mobility: [] });
        }


    } catch (error) {
        console.log("Error fetching mobility logs:", error);
        res.status(500).json({ error: "Error Fetching User Mobiliy Logs" });
    }


};

const deleteMobilityLog = async (req, res) => {
    const { dailyLogId, mobilityLogId } = req.params;

    try {
        const dailyLog = await DailyLog.findById(dailyLogId);

        if (!dailyLog) {
            return res.status(404).json({ error: "Daily log not found" });
        }

        const mobilityIndex = dailyLog.mobility.findIndex(
            log => log._id.toString() === mobilityLogId
        );

        if (mobilityIndex === -1) {
            return res.status(404).json({ error: "Mobility log not found" });
        }

        // Remove the log
        dailyLog.mobility.splice(mobilityIndex, 1);

        await dailyLog.save();

        res.json({ message: "Mobility log deleted successfully" });
    } catch (error) {
        console.error("Error deleting mobility log:", error);
        res.status(500).json({ error: "Error deleting mobility log" });
    }
};

const deleteSleepLog = async (req, res) => {
    const { dailyLogId, sleepLogId } = req.params;

    try {
        const dailyLog = await DailyLog.findById(dailyLogId);

        if (!dailyLog) {
            return res.status(404).json({ error: "Daily log not found" });
        }

        const sleepIndex = dailyLog.sleep.findIndex(
            log => log._id.toString() === sleepLogId
        );

        if (sleepIndex === -1) {
            return res.status(404).json({ error: "Sleep log not found" });
        }

        // Remove the log
        dailyLog.sleep.splice(sleepIndex, 1);

        await dailyLog.save();

        res.json({ message: "Sleep log deleted successfully" });
    } catch (error) {
        console.error("Error deleting sleep log:", error);
        res.status(500).json({ error: "Error deleting sleep log" });
    }
};

const updateWaterLog = async (req, res) => {
    try {
        const { userId, date, water } = req.body;
        console.log("Updating water log:", { userId, date, water });

        if (!userId || !date || !water) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let dailyLog = await DailyLog.findOne({ userId, date });

        if (!dailyLog) {
            dailyLog = new DailyLog({ userId, date, water });
        } else {
            // Merge water data (goal, consumed, unit)
            dailyLog.water = {
                goalMl: water.goalMl !== undefined ? water.goalMl : dailyLog.water.goalMl,
                consumedMl: water.consumedMl !== undefined ? water.consumedMl : dailyLog.water.consumedMl,
                unit: water.unit || dailyLog.water.unit || 'oz'
            };
        }

        await dailyLog.save();
        res.json({ message: "Water log updated", water: dailyLog.water });
    } catch (error) {
        console.error("Error updating water log:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getWaterLog = async (req, res) => {
    try {
        const { userId, date } = req.query;
        if (!userId || !date) return res.status(400).json({ error: "Missing userId or date" });

        const dailyLog = await DailyLog.findOne({ userId, date });
        if (dailyLog && dailyLog.water) {
            res.json(dailyLog.water);
        } else {
            // Return default if not found
            res.json({ goalMl: 2000, consumedMl: 0, unit: 'oz' });
        }
    } catch (error) {
        console.error("Error fetching water log:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { addSleepLog, getSleepLogs, updateSleepLog, getWeeklySleepLogs, addMobilityLog, getMobilityLogs, updateMobilityLog, deleteMobilityLog, deleteSleepLog, updateWaterLog, getWaterLog };
