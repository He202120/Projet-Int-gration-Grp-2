import mongoose from "mongoose";

const parkingSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
        type: Number,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
  },

  {
    timestamps: true, // This will automatically add timestamps for any operations done.
  }
);

const Parking = mongoose.model("Subscription", parkingSchema);

export default Parking;
