// const mongoose = require("mongoose");

// const Activity = require("./activityModel");
// const adlLog = require("./adlModel");
// const BodyComposition = require("./bodyCompositionModel");
// const Hydration = require("./hydrationModel");
// const Medication = require("./medsModel");
// const Mood = require("./moodModel");
// const PainLog = require("./painModel");
// const Sleep = require("./sleepModel");

// const userSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     dateOfBirth: {
//       type: Date,
//       // required: true,
//     },
//     uid: {
//       type: String,
//       required: [true, "uid must be provided"],
//     },
//   },
//   { timestamps: true }
// );

// // Method to delete related data
// userSchema.methods.deleteRelatedData = async function () {
//   await Activity.deleteMany({ userId: this._id });
//   await adlLog.deleteMany({ userId: this._id });
//   await BodyComposition.deleteMany({ userId: this._id });
//   await Hydration.deleteMany({ userId: this._id });
//   await Medication.deleteMany({ userId: this._id });
//   await Mood.deleteMany({ userId: this._id });
//   await PainLog.deleteMany({ userId: this._id });
//   await Sleep.deleteMany({ userId: this._id });
// };

// userSchema.path("createdAt").immutable(true);

// const User = mongoose.model("User", userSchema);

// module.exports = User;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfBirth: {
      type: Date,
    },
    uid: {
      type: String,
      required: [true, "uid must be provided"],
    },
    personalInjuryAccident: {
      type: Boolean,
    },
    accidentDate: {
      type: Date,
    },
    hasLawyer: {
      type: Boolean,
    },
    insuranceApproval: {
      type: Boolean,
    },
    inTherapy: {
      type: Boolean,
    },
    preCondition: {
      type: String,
    },
  },
  { timestamps: true }
);

// Method to delete related data
userSchema.methods.deleteRelatedData = async function () {
  await Activity.deleteMany({ userId: this._id });
  await adlLog.deleteMany({ userId: this._id });
  await BodyComposition.deleteMany({ userId: this._id });
  await Hydration.deleteMany({ userId: this._id });
  await Medication.deleteMany({ userId: this._id });
  await Mood.deleteMany({ userId: this._id });
  await PainLog.deleteMany({ userId: this._id });
  await Sleep.deleteMany({ userId: this._id });
};

userSchema.path("createdAt").immutable(true);

const User = mongoose.model("User", userSchema);

module.exports = User;
