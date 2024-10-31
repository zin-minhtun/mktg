const mongoose = require("mongoose");

/*******Notes*******/
// TOADD: Difficulty of each itemLabels
// TBD: which data is required.

const adlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: [
      {
        type: String,
        required: true,
        // enum: ["Personal Care", "Household", "Work", "Leisure", "Sleep"],
      },
    ],
    itemLabels: [
      {
        type: String,
        required: true,
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Future dates unaccessible",
      },
    },
  },
  { timestamps: true }
);

// Validate that createdAt field cannot be updated
adlSchema.path("createdAt").immutable(true);

const adlLog = mongoose.model("ADL", adlSchema);

module.exports = adlLog;
