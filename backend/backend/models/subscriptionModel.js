import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  
  {
    timestamps: true, // This will automatically add timestamps for any operations done.
  }
);

// Correction du nom du schéma utilisé dans le modèle
const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
