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
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
    },
    places: {
      type: Number,
      required: true,
    },
    max_places: {
      type: Number,
      required: true,
    },
    completion: {
      type: Number,
      default: 0,
    },
    // a changer !!!!!!
    num_parking: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true, // This will automatically add timestamps for any operations done.
  }
);

const Parking = mongoose.model("Parking", parkingSchema);

export default Parking;
