const express = require("express");
const router = express.Router();
const dailyLogController = require("../controllers/dailyLogController");

// Route to add a sleep log
router.post("/sleep/add", dailyLogController.addSleepLog);

// Route to get all sleep logs for a particular day
router.get("/sleep", dailyLogController.getSleepLogs);

// Route to get all sleep logs for the last seven days
router.get("/weeklySleep", dailyLogController.getWeeklySleepLogs);

// Route to edit a sleep log
router.put("/sleep/update/:dailyLogId/:sleepLogId", dailyLogController.updateSleepLog);

// Route to add a mobility log
router.post("/mobility/add", dailyLogController.addMobilityLog);

// Route to get all mobility logs for a particular day
router.get("/mobility", dailyLogController.getMobilityLogs);

router.put("/mobility/update/:dailyLogId/:mobilityLogId", dailyLogController.updateMobilityLog);

// Route to delete a mobility log
router.delete("/mobility/:dailyLogId/:mobilityLogId", dailyLogController.deleteMobilityLog);

// Route to delete a sleep log
router.delete("/sleep/:dailyLogId/:sleepLogId", dailyLogController.deleteSleepLog);

// Water Routes
router.post("/water/update", dailyLogController.updateWaterLog);
router.get("/water", dailyLogController.getWaterLog);


module.exports = router;
