import mongoose from "mongoose";

const parkingSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    telephone: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    places: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // This will automatically add timestamps for any operations done.
  }
);

const Parking = mongoose.model("Parking", parkingSchema);

export default Parking;
