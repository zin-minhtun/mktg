const mongoose = require("mongoose");

// Mobility Schema
const mobilitySchema = new mongoose.Schema({
    transferOptions: {
        type: String,
        required: false,
        enum: ['With Assistance', 'Movies at Home',]
    },
    others: {
        type: String,
        required: false,
        enum: ['From bed to chair', 'From chair to bed',]
    },
    transportoptions: {
        type: String,
        required: false,
        enum: ['Driving', 'Using Public Transit']
    },
    additionalNotes: {
        type: String,
        required: false
    },

})

module.exports = mobilitySchema;